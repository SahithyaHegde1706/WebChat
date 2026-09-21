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

const rooms = new Map<string, Set<WebSocket>>();
const socketRooms = new Map<WebSocket, string>();

function broadcast(roomId: string, message: ChatMessage) {
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
  console.log("Client connected");

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

      console.log(`Client joined room ${roomId}`);
    }

    if (message.type === "chat") {
      const roomId = socketRooms.get(socket);

      if (!roomId) return;

      broadcast(roomId, {
        type: "chat",
        payload: {
          message: message.payload.message,
        },
      });
    }
  });

  socket.on("close", () => {
    const roomId = socketRooms.get(socket);

    if (roomId) {
      const clients = rooms.get(roomId);

      clients?.delete(socket);

      if (clients?.size === 0) {
        rooms.delete(roomId);
      }

      socketRooms.delete(socket);
    }

    console.log("Client disconnected");
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);