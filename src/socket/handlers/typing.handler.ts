import type { Namespace, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/types/socket-events.js";
import { roomId } from "./connection.handler.js";

type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

export function registerTypingHandlers(
  nsp: Namespace<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
  socket: ChatSocket,
): void {
  socket.on("typing:start", ({ conversationId }) => {
    socket.to(roomId(conversationId)).emit("typing:update", {
      conversationId,
      userId: socket.data.userId,
      isTyping: true,
    });
  });

  socket.on("typing:stop", ({ conversationId }) => {
    socket.to(roomId(conversationId)).emit("typing:update", {
      conversationId,
      userId: socket.data.userId,
      isTyping: false,
    });
  });
}
