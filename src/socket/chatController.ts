import type { Response, NextFunction } from "express";
import { Conversation } from "../config/Conversation.js";
import { Message } from "../config/Message.js";
import type { AuthRequest } from "../config/auth.js";

export const getActiveConversations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name email onlineStatus role")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { targetUserId, type, context } = req.body;

    // Ensure a duplicate conversation isn't erroneously created
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, targetUserId] },
      type,
      context,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, targetUserId],
        type,
        context,
      });
    }

    const populatedConversation = await conversation.populate(
      "participants",
      "name email onlineStatus role",
    );

    res.status(201).json({ success: true, data: populatedConversation });
  } catch (error) {
    next(error);
  }
};

export const getMessagesByConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { conversationId } = req.params;

    // Pagination can be introduced via req.query later, extracting full history block for now
    const messages = await Message.find({ conversationId })
      .populate("senderId", "name role avatarUrl")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};
