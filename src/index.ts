import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";

import { connectDB } from "./config/db.js";
import { errorHandler } from "./config/errorHandler.js";
import authRoutes from "./socket/auth.js";
import chatRoutes from "./socket/chat.js";
import { initializeChatSocket } from "./socket/chatSocket.js";

async function bootstrap(): Promise<void> {
  const app = express();
  const httpServer = createServer(app);

  // HTTP Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to Database
  await connectDB();

  // Setup Routes
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/chat", chatRoutes);

  // Global Catch-all Error Handler
  app.use(errorHandler);

  // Attach Socket.IO real-time engine
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });
  initializeChatSocket(io);

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.info(
      `[worknoon-chat] HTTP + Socket.IO server running strictly on :${PORT}`,
    );
  });
}

bootstrap().catch((err: unknown) => {
  console.error("[worknoon-chat] Fatal bootstrap initialization error:", err);
  process.exit(1);
});
