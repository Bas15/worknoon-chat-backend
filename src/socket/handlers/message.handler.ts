import type { Namespace, Socket } from "socket.io";
import { createServices } from "../../infrastructure/di/container.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/types/socket-events.js";
import { AppError } from "../../shared/errors/app-error.js";
import { roomId } from "./connection.handler.js";

type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

export function registerMessageHandlers(
  nsp: Namespace<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>,
  socket: ChatSocket,
): void {
  const { messageService } = createServices();

  socket.on("message:send", async ({ conversationId, body }) => {
    try {
      const message = await messageService.send({
        conversationId,
        senderId: socket.data.userId,
        body,
      });
      nsp.to(roomId(conversationId)).emit("message:new", message);
    } catch (err) {
      const payload =
        err instanceof AppError
          ? { code: err.code, message: err.message }
          : { code: "INTERNAL", message: "Failed to send message" };
      socket.emit("error:app", payload);
    }
  });
}
