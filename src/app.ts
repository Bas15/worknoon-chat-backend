import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import type { Env } from "./config/env.js";
import { apiRouter } from "./api/routes/index.js";
import { errorHandler } from "./api/middleware/error-handler.js";
import { notFoundHandler } from "./api/middleware/not-found.js";

export function createApp(env: Env): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "256kb" }));

  app.use("/api/v1", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
