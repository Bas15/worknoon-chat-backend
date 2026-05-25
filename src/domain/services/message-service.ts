import type { IMessageRepository, SendMessageInput } from "../repositories/message-repository.js";
import type { IConversationRepository } from "../repositories/conversation-repository.js";
import type { Message } from "../entities/message.js";
import { NotFoundError, ForbiddenError } from "../../shared/errors/app-error.js";

export class MessageService {
  constructor(
    private readonly messages: IMessageRepository,
    private readonly conversations: IConversationRepository,
  ) {}

  async send(input: SendMessageInput): Promise<Message> {
    const conversation = await this.conversations.findById(input.conversationId);
    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }
    const isParticipant = conversation.participants.some(
      (p) => p.userId === input.senderId,
    );
    if (!isParticipant) {
      throw new ForbiddenError("Sender is not a participant");
    }
    if (!input.body.trim()) {
      throw new ForbiddenError("Message body cannot be empty");
    }
    return this.messages.create(input);
  }
}
