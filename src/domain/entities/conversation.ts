export type ConversationKind = "direct" | "support" | "order";

export interface ConversationParticipant {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  lastReadAt?: Date;
}

export interface Conversation {
  id: string;
  kind: ConversationKind;
  participants: ConversationParticipant[];
  subject?: string;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}
