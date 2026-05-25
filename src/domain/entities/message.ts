export type MessageContentType = "text" | "image" | "system";

export interface MessageAttachment {
  url: string;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  contentType: MessageContentType;
  body: string;
  attachments?: MessageAttachment[];
  createdAt: Date;
  editedAt?: Date;
}
