import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { createMessageController } from "../controllers/message-controller.js";
import { createServices } from "../../infrastructure/di/container.js";

const { messageService, messageRepository } = createServices();
const controller = createMessageController(messageService, messageRepository);

export const messagesRouter = Router();

messagesRouter.use(authenticate);
messagesRouter.get("/conversations/:id", controller.history);
messagesRouter.post("/", controller.send);
