import type { WorknoonServer } from "../index.js";
import { registerConnectionHandlers } from "../handlers/connection.handler.js";
import { registerMessageHandlers } from "../handlers/message.handler.js";
import { registerTypingHandlers } from "../handlers/typing.handler.js";

const NAMESPACE = "/chat";

export function registerChatNamespace(io: WorknoonServer): void {
  const nsp = io.of(NAMESPACE);
  nsp.use((socket, next) => {
    const token = socket.handshake.auth["token"];
    if (typeof token !== "string" || !token.trim()) {
      next(new Error("Unauthorized"));
      return;
    }
    socket.data.userId = token;
    next();
  });

  nsp.on("connection", (socket) => {
    registerConnectionHandlers(nsp, socket);
    registerMessageHandlers(nsp, socket);
    registerTypingHandlers(nsp, socket);
  });
}
