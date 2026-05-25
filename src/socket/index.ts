import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import type { Env } from "../config/env.js";
import { buildSocketOptions } from "../config/socket.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../shared/types/socket-events.js";
import { registerChatNamespace } from "./namespaces/chat.namespace.js";

export type WorknoonServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

export function attachSocketServer(httpServer: HttpServer, env: Env): WorknoonServer {
  const opts = buildSocketOptions(env);
  const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(
    httpServer,
    {
      path: opts.path,
      cors: { origin: opts.corsOrigin, credentials: true },
    },
  );
  registerChatNamespace(io);
  return io;
}
