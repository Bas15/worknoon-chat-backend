import type {
  CreateConversationInput,
  IConversationRepository,
} from "../repositories/conversation-repository.js";
import type { Conversation } from "../entities/conversation.js";

export class ConversationService {
  constructor(private readonly conversations: IConversationRepository) {}

  async listForUser(userId: string): Promise<Conversation[]> {
    return this.conversations.findByParticipant(userId);
  }

  async create(input: CreateConversationInput): Promise<Conversation> {
    if (input.participantIds.length < 2) {
      throw new Error("Conversation requires at least two participants");
    }
    return this.conversations.create(input);
  }
}
