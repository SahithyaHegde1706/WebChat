import { useEffect, useRef, useState } from "react";

type SocketStatus =
  | "connecting"
  | "open"
  | "closed"
  | "error";

export type SocketMessage =
  | {
    type: "welcome";
    payload: {
      userId: string;
    };
  }
  | {
    type: "room_users";
    payload: {
      count: number;
    };
  }
  | {
    type: "chat";
    payload: {
      message: string;
      senderId: string;
    };
  };

export function useSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);

  const [status, setStatus] =
    useState<SocketStatus>("connecting");

  const [messages, setMessages] =
    useState<SocketMessage[]>([]);

  const [userId, setUserId] =
    useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("open");
    };

    socket.onmessage = (event) => {
      try {
        const data: SocketMessage =
          JSON.parse(event.data);

        if (data.type === "welcome") {
          setUserId(data.payload.userId);
          return;
        }

        if (data.type === "room_users") {
          setMessages((prev) => [
            ...prev,
            data,
          ]);

          return;
        }

        if (data.type === "chat") {
          setMessages((prev) => [
            ...prev,
            data,
          ]);
        }
      } catch {
        console.error(
          "Received invalid JSON message"
        );
      }
    };

    socket.onclose = () => {
      setStatus("closed");
      setUserId(null);
    };

    socket.onerror = () => {
      setStatus("error");
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const send = (obj: object) => {
    if (
      socketRef.current?.readyState ===
      WebSocket.OPEN
    ) {
      socketRef.current.send(
        JSON.stringify(obj)
      );
    }
  };

  return {
    status,
    messages,
    send,
    userId,
  };
}