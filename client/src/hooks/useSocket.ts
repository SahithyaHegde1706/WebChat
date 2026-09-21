import { useEffect, useRef, useState } from "react";

type SocketStatus = "connecting" | "open" | "closed" | "error";

export interface SocketMessage {
  type: string;
  payload: {
    [key: string]: unknown;
  };
}

export function useSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);

  const [status, setStatus] = useState<SocketStatus>("connecting");

  const [messages, setMessages] = useState<SocketMessage[]>([]);

  useEffect(() => {
    const socket = new WebSocket(url);

    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("open");
    };

    socket.onmessage = (event) => {
      try {
        const data: SocketMessage = JSON.parse(event.data);

        setMessages((prev) => [...prev, data]);
      } catch {
        console.error("Received invalid JSON message");
      }
    };

    socket.onclose = () => {
      setStatus("closed");
    };

    socket.onerror = () => {
      setStatus("error");
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const send = (obj: SocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(obj));
    }
  };

  return {
    status,
    messages,
    send,
  };
}