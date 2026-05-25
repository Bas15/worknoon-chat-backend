import type { Message } from "../entities/message.js";

export interface SendMessageInput {
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessagePage {
  items: Message[];
  nextCursor: string | null;
}

export interface IMessageRepository {
  findByConversation(
    conversationId: string,
    cursor?: string,
    limit?: number,
  ): Promise<MessagePage>;
  create(input: SendMessageInput): Promise<Message>;
}
