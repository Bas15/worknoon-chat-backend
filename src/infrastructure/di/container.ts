import { MongoConversationRepository } from "../repositories/mongo-conversation-repository.js";
import { MongoMessageRepository } from "../repositories/mongo-message-repository.js";
import { ConversationService } from "../../domain/services/conversation-service.js";
import { MessageService } from "../../domain/services/message-service.js";

let cached: ReturnType<typeof build> | null = null;

function build() {
  const conversationRepository = new MongoConversationRepository();
  const messageRepository = new MongoMessageRepository();
  const conversationService = new ConversationService(conversationRepository);
  const messageService = new MessageService(
    messageRepository,
    conversationRepository,
  );
  return {
    conversationRepository,
    messageRepository,
    conversationService,
    messageService,
  };
}

export function createServices() {
  if (!cached) cached = build();
  return cached;
}
