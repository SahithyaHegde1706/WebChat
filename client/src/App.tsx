import { useState } from "react";
import { useSocket } from "./hooks/useSocket";

function App() {
  const { status, messages, send } = useSocket(
    "ws://localhost:8081"
  );

  const [roomInput, setRoomInput] = useState("");
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const joinRoom = () => {
    const roomId = roomInput.trim();

    if (!roomId) return;

    send({
      type: "join",
      payload: {
        roomId,
      },
    });

    setJoinedRoom(roomId);
  };

  const sendMessage = () => {
    const message = draft.trim();

    if (!message || !joinedRoom) return;

    send({
      type: "chat",
      payload: {
        message,
      },
    });

    setDraft("");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>WebChat</h1>

        <p className={`status status-${status}`}>
          Connection: <strong>{status}</strong>
        </p>

        <div className="row">
          <input
            placeholder="Room ID (e.g. 123)"
            value={roomInput}
            onChange={(event) => setRoomInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                joinRoom();
              }
            }}
          />

          <button
            onClick={joinRoom}
            disabled={status !== "open"}
          >
            Join Room
          </button>
        </div>

        {joinedRoom && (
          <p className="room">
            In room: {joinedRoom}
          </p>
        )}

        <ul className="messages">
          {messages
            .filter((message) => message.type === "chat")
            .map((message, index) => (
              <li key={index}>
                {typeof message.payload.message === "string"
                  ? message.payload.message
                  : ""}
              </li>
            ))}
        </ul>

        <div className="row">
          <input
            placeholder="Type a message..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={!joinedRoom || status !== "open"}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;