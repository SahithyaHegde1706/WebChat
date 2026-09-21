import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";
import ThemeToggle from "../components/ThemeToggle";

const WS_URL = "ws://localhost:8081";

export default function ChatPage() {
    const { status, messages, send, userId } = useSocket(WS_URL);

    const [roomInput, setRoomInput] = useState("");
    const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
    const [draft, setDraft] = useState("");

    const connected = status === "open";

    const joinRoom = () => {
        const roomId = roomInput.trim();

        if (!roomId || !connected) return;

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

        if (!message || !joinedRoom || !connected) return;

        send({
            type: "chat",
            payload: {
                message,
            },
        });

        setDraft("");
    };

    // Get all room_users events
    const roomUsersMessages = messages.filter(
        (message) => message.type === "room_users"
    );

    // Get the latest user count
    const roomUsersCount =
        roomUsersMessages.at(-1)?.payload.count ?? 0;

    // Only display chat messages
    const chatMessages = messages.filter(
        (message) => message.type === "chat"
    );

    return (
        <div className="flex min-h-screen flex-col bg-background px-4 py-6">
            {/* Top navigation */}
            <div className="mx-auto flex w-full max-w-lg items-center justify-between pb-4">
                <Link
                    to="/"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    ← Home
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <span className="text-sm font-semibold text-foreground">
                        WebChat
                    </span>
                </div>
            </div>

            {/* Chat card */}
<div className="mx-auto w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">                <h1 className="text-xl font-bold text-card-foreground">
                    WebSocket Chat
                </h1>

                {/* Connection status */}
                <p className="mt-2 text-sm text-muted-foreground">
                    Connection:{" "}
                    <strong
                        className={
                            connected
                                ? "text-success"
                                : "text-muted-foreground"
                        }
                    >
                        {connected ? "🟢 Connected" : "🔴 Disconnected"}
                    </strong>
                </p>

                {/* Room join */}
                <div className="mt-4 flex gap-2">
                    <input
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Room ID (e.g. 123)"
                        value={roomInput}
                        onChange={(event) =>
                            setRoomInput(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                joinRoom();
                            }
                        }}
                    />

                    <button
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                        onClick={joinRoom}
                        disabled={!roomInput.trim() || !connected}
                    >
                        Join Room
                    </button>
                </div>

                {/* Current room + user count */}
                {joinedRoom && (
                    <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                        <p>
                            In room:{" "}
                            <span className="font-medium text-foreground">
                                {joinedRoom}
                            </span>
                        </p>

                        <p>
                            Users:{" "}
                            <span className="font-medium text-foreground">
                                {roomUsersCount}
                            </span>
                        </p>
                    </div>
                )}

                {/* Messages */}
                <div className="mt-4 flex h-64 flex-col gap-2 overflow-y-auto rounded-md border border-border bg-muted/50 p-3">
                    {chatMessages.length === 0 ? (
                        <p className="m-auto text-center text-sm text-muted-foreground">
                            No messages yet. Join a room and send one.
                        </p>
                    ) : (
                        chatMessages.map((message, index) => {
                            const isOwnMessage =
                                message.payload.senderId === userId;

                            return (
                                <div
                                    key={index}
                                    className={`flex ${isOwnMessage
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-md px-3 py-1.5 text-sm ${isOwnMessage
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-foreground"
                                            }`}
                                    >
                                        {message.payload.message}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Send message */}
                <div className="mt-4 flex gap-2">
                    <input
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                        placeholder={
                            joinedRoom
                                ? "Type a message…"
                                : "Join a room first"
                        }
                        value={draft}
                        disabled={!joinedRoom}
                        onChange={(event) =>
                            setDraft(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                sendMessage();
                            }
                        }}
                    />

                    <button
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                        onClick={sendMessage}
                        disabled={!joinedRoom || !connected}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}