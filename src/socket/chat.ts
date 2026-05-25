import { Router } from "express";
import { authenticate } from "../config/auth.js";
import {
  getActiveConversations,
  createConversation,
  getMessagesByConversation,
} from "./chatController.js";

const router = Router();

router.get("/conversations", authenticate, getActiveConversations);
router.post("/conversations", authenticate, createConversation);
router.get(
  "/conversations/:conversationId/messages",
  authenticate,
  getMessagesByConversation,
);

export default router;
