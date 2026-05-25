import type { Message } from "../../domain/entities/message.js";
import type {
  IMessageRepository,
  MessagePage,
  SendMessageInput,
} from "../../domain/repositories/message-repository.js";
import {
  MessageModel,
  type MessageDocument,
} from "../database/schemas/message.schema.js";

const DEFAULT_LIMIT = 50;

function toDomain(doc: MessageDocument): Message {
  return {
    id: doc._id.toString(),
    conversationId: doc.conversationId.toString(),
    senderId: doc.senderId,
    contentType: doc.contentType,
    body: doc.body,
    ...(doc.attachments !== undefined && { attachments: doc.attachments }),
    createdAt: doc.createdAt,
    ...(doc.editedAt !== undefined && { editedAt: doc.editedAt }),
  };
}

export class MongoMessageRepository implements IMessageRepository {
  async findByConversation(
    conversationId: string,
    cursor?: string,
    limit = DEFAULT_LIMIT,
  ): Promise<MessagePage> {
    const filter: Record<string, unknown> = { conversationId };
    if (cursor) {
      filter["_id"] = { $lt: cursor };
    }
    const docs = await MessageModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean<MessageDocument[]>();

    const hasMore = docs.length > limit;
    const slice = hasMore ? docs.slice(0, limit) : docs;
    const items = slice.map(toDomain).reverse();
    const nextCursor = hasMore && slice.length > 0 ? slice[slice.length - 1]!._id.toString() : null;

    return { items, nextCursor };
  }

  async create(input: SendMessageInput): Promise<Message> {
    const doc = await MessageModel.create({
      conversationId: input.conversationId,
      senderId: input.senderId,
      body: input.body.trim(),
      contentType: "text",
    });
    return toDomain(doc.toObject() as MessageDocument);
  }
}
