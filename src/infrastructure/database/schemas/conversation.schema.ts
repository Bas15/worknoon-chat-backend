import { Schema, model, type InferSchemaType } from "mongoose";

const participantSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    displayName: { type: String, required: true },
    avatarUrl: String,
    lastReadAt: Date,
  },
  { _id: false },
);

const conversationSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["direct", "support", "order"],
      required: true,
    },
    participants: { type: [participantSchema], required: true },
    subject: String,
    metadata: { type: Map, of: String },
  },
  { timestamps: true },
);

conversationSchema.index({ "participants.userId": 1, updatedAt: -1 });

export type ConversationDocument = InferSchemaType<typeof conversationSchema> & {
  _id: { toString(): string };
};

export const ConversationModel = model("Conversation", conversationSchema);
