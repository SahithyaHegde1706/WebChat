import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.PORT) || 8081;

const wss = new WebSocketServer({
  port: PORT,
});

type JoinMessage = {
  type: "join";
  payload: {
    roomId: string;
  };
};

type ChatMessage = {
  type: "chat";
  payload: {
    message: string;
  };
};

type ClientMessage = JoinMessage | ChatMessage;

type ServerChatMessage = {
  type: "chat";
  payload: {
    message: string;
    senderId: string;
  };
};

const rooms = new Map<string, Set<WebSocket>>();
const socketRooms = new Map<WebSocket, string>();
const socketUsers = new Map<WebSocket, string>();

function generateUserId() {
  return Math.random().toString(36).substring(2, 10);
}

function broadcast(roomId: string, message: ServerChatMessage) {
  const clients = rooms.get(roomId);

  if (!clients) return;

  const data = JSON.stringify(message);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

wss.on("connection", (socket) => {
  const userId = generateUserId();

  socketUsers.set(socket, userId);

  socket.send(
    JSON.stringify({
      type: "welcome",
      payload: {
        userId,
      },
    })
  );

  console.log(`Client connected: ${userId}`);

  socket.on("message", (raw) => {
    let message: ClientMessage;

    try {
      message = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (message.type === "join") {
      const roomId = message.payload.roomId;

      const previousRoom = socketRooms.get(socket);

      if (previousRoom) {
        const previousClients = rooms.get(previousRoom);

        previousClients?.delete(socket);

        if (previousClients?.size === 0) {
          rooms.delete(previousRoom);
        }
      }

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId)!.add(socket);

      socketRooms.set(socket, roomId);

      console.log(`${userId} joined room ${roomId}`);
    }

    if (message.type === "chat") {
      const roomId = socketRooms.get(socket);
      const senderId = socketUsers.get(socket);

      if (!roomId || !senderId) return;

      broadcast(roomId, {
        type: "chat",
        payload: {
          message: message.payload.message,
          senderId,
        },
      });
    }
  });

  socket.on("close", () => {
    const roomId = socketRooms.get(socket);
    const userId = socketUsers.get(socket);

    if (roomId) {
      const clients = rooms.get(roomId);

      clients?.delete(socket);

      if (clients?.size === 0) {
        rooms.delete(roomId);
      }

      socketRooms.delete(socket);
    }

    socketUsers.delete(socket);

    console.log(`Client disconnected: ${userId}`);
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);