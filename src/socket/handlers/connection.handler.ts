import type { Namespace, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/types/socket-events.js";

type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

export function registerConnectionHandlers(
  _nsp: Namespace<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
  socket: ChatSocket,
): void {
  socket.on("conversation:join", ({ conversationId }) => {
    void socket.join(roomId(conversationId));
  });

  socket.on("conversation:leave", ({ conversationId }) => {
    void socket.leave(roomId(conversationId));
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("presence:update", {
      userId: socket.data.userId,
      status: "away",
    });
  });

  socket.broadcast.emit("presence:update", {
    userId: socket.data.userId,
    status: "online",
  });
}

export function roomId(conversationId: string): string {
  return `conversation:${conversationId}`;
}
