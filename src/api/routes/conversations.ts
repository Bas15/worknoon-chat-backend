import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { createConversationController } from "../controllers/conversation-controller.js";
import { createServices } from "../../infrastructure/di/container.js";

const { conversationService } = createServices();
const controller = createConversationController(conversationService);

export const conversationsRouter = Router();

conversationsRouter.use(authenticate);
conversationsRouter.get("/", controller.list);
conversationsRouter.post("/", controller.create);
