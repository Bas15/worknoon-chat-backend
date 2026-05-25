import { Schema, model, type InferSchemaType } from "mongoose";

const attachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    width: Number,
    height: Number,
  },
  { _id: false },
);

const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    senderId: { type: String, required: true, index: true },
    contentType: {
      type: String,
      enum: ["text", "image", "system"],
      default: "text",
    },
    body: { type: String, required: true },
    attachments: [attachmentSchema],
    editedAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

export type MessageDocument = InferSchemaType<typeof messageSchema> & {
  _id: { toString(): string };
  createdAt: Date;
};

export const MessageModel = model("Message", messageSchema);
