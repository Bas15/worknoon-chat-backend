import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";
import { MessageService } from "../../domain/services/message-service.js";
import type { IMessageRepository } from "../../domain/repositories/message-repository.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

export function createMessageController(
  messageService: MessageService,
  messageRepo: IMessageRepository,
) {
  const history = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const page = await messageRepo.findByConversation(id!, cursor);
    res.json({ data: page.items, meta: { nextCursor: page.nextCursor } });
  });

  const send = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { conversationId, body } = req.body as {
      conversationId: string;
      body: string;
    };
    const message = await messageService.send({
      conversationId,
      senderId: req.userId,
      body,
    });
    res.status(201).json({ data: message });
  });

  return { history, send };
}
