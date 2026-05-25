import type { RequestHandler } from "express";
import { getDatabaseHealth } from "../../config/database.js";

export const healthCheck: RequestHandler = (_req, res) => {
  const db = getDatabaseHealth();
  res.status(db.connected ? 200 : 503).json({
    status: db.connected ? "ok" : "degraded",
    services: { mongodb: db.connected ? "up" : "down" },
    timestamp: new Date().toISOString(),
  });
};
