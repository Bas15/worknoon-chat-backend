import type { Env } from "./env.js";

export interface SocketServerOptions {
  path: string;
  corsOrigin: string;
}

export function buildSocketOptions(env: Env): SocketServerOptions {
  return {
    path: env.SOCKET_PATH,
    corsOrigin: env.CORS_ORIGIN,
  };
}
