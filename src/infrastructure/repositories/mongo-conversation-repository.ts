import type { Conversation } from "../../domain/entities/conversation.js";
import type {
  CreateConversationInput,
  IConversationRepository,
} from "../../domain/repositories/conversation-repository.js";
import {
  ConversationModel,
  type ConversationDocument,
} from "../database/schemas/conversation.schema.js";

function toDomain(doc: ConversationDocument): Conversation {
  return {
    id: doc._id.toString(),
    kind: doc.kind,
    participants: doc.participants.map((p) => ({
      userId: p.userId,
      displayName: p.displayName,
      ...(p.avatarUrl !== undefined && { avatarUrl: p.avatarUrl }),
      ...(p.lastReadAt !== undefined && { lastReadAt: p.lastReadAt }),
    })),
    ...(doc.subject !== undefined && { subject: doc.subject }),
    ...(doc.metadata !== undefined && {
      metadata: Object.fromEntries(doc.metadata),
    }),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class MongoConversationRepository implements IConversationRepository {
  async findById(id: string): Promise<Conversation | null> {
    const doc = await ConversationModel.findById(id).lean<ConversationDocument>();
    return doc ? toDomain(doc) : null;
  }

  async findByParticipant(userId: string): Promise<Conversation[]> {
    const docs = await ConversationModel.find({
      "participants.userId": userId,
    })
      .sort({ updatedAt: -1 })
      .lean<ConversationDocument[]>();
    return docs.map(toDomain);
  }

  async create(input: CreateConversationInput): Promise<Conversation> {
    const doc = await ConversationModel.create({
      kind: input.kind,
      participants: input.participantIds.map((id) => ({
        userId: id,
        displayName: id,
      })),
      subject: input.subject,
      metadata: input.metadata,
    });
    return toDomain(doc.toObject() as ConversationDocument);
  }
}
