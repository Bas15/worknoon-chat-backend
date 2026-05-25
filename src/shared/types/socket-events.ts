import type { Message } from "../../domain/entities/message.js";

/** Client → Server */
export interface ClientToServerEvents {
  "conversation:join": (payload: { conversationId: string }) => void;
  "conversation:leave": (payload: { conversationId: string }) => void;
  "message:send": (payload: { conversationId: string; body: string }) => void;
  "typing:start": (payload: { conversationId: string }) => void;
  "typing:stop": (payload: { conversationId: string }) => void;
}

/** Server → Client */
export interface ServerToClientEvents {
  "message:new": (message: Message) => void;
  "typing:update": (payload: {
    conversationId: string;
    userId: string;
    isTyping: boolean;
  }) => void;
  "presence:update": (payload: { userId: string; status: "online" | "away" }) => void;
  "error:app": (payload: { code: string; message: string }) => void;
}

export interface SocketData {
  userId: string;
}
