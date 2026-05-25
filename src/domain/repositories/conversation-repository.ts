import type { Conversation, ConversationKind } from "../entities/conversation.js";

export interface CreateConversationInput {
  kind: ConversationKind;
  participantIds: string[];
  subject?: string;
  metadata?: Record<string, string>;
}

export interface IConversationRepository {
  findById(id: string): Promise<Conversation | null>;
  findByParticipant(userId: string): Promise<Conversation[]>;
  create(input: CreateConversationInput): Promise<Conversation>;
}
