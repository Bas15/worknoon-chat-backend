import { Router } from "express";
import { healthCheck } from "../controllers/health-controller.js";
import { conversationsRouter } from "./conversations.js";
import { messagesRouter } from "./messages.js";

export const apiRouter = Router();

apiRouter.get("/health", healthCheck);
apiRouter.use("/conversations", conversationsRouter);
apiRouter.use("/messages", messagesRouter);
