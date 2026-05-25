import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  type: "buyer-to-designer" | "buyer-to-merchant" | "buyer-to-agent";
  context?: string;
  lastMessage?: mongoose.Types.ObjectId;
}

const ConversationSchema: Schema<IConversation> = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    type: {
      type: String,
      enum: ["buyer-to-designer", "buyer-to-merchant", "buyer-to-agent"],
      required: true,
    },
    context: {
      type: String, // E.g., Product slug or WooCommerce order number metadata
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

export const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema,
);
