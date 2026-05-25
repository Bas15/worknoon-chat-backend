import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";
import { ConversationService } from "../../domain/services/conversation-service.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export function createConversationController(service: ConversationService) {
  const list = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const conversations = await service.listForUser(req.userId);
    res.json({ data: conversations });
  });

  const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { kind, participantIds, subject, metadata } = req.body as {
      kind: "direct" | "support" | "order";
      participantIds: string[];
      subject?: string;
      metadata?: Record<string, string>;
    };
    const conversation = await service.create({
      kind,
      participantIds: [...new Set([req.userId, ...participantIds])],
      subject,
      metadata,
    });
    res.status(201).json({ data: conversation });
  });

  return { list, create };
}
