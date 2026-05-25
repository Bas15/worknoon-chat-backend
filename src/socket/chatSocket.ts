import type { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../config/User.js";
import { Message } from "../config/Message.js";
import { Conversation } from "../config/Conversation.js";

export const initializeChatSocket = (io: SocketIOServer): void => {
  // Handshake JWT authentication
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication token is missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      socket.data.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Invalid or expired authentication token"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const userId = socket.data.userId as string;

    // Map user to online status dynamically
    try {
      await User.findByIdAndUpdate(userId, { onlineStatus: true });
      socket.broadcast.emit("user_status_changed", { userId, isOnline: true });
    } catch (error) {
      console.error(
        "[Socket] Failed to update online status on connect:",
        error,
      );
    }

    // Join a specific conversation room
    socket.on("join_conversation", (data: { conversationId: string }) => {
      socket.join(data.conversationId);
    });

    // Receive and broadcast messages
    socket.on(
      "send_message",
      async (data: {
        conversationId: string;
        text: string;
        fileUrl?: string;
      }) => {
        try {
          const newMessage = await Message.create({
            conversationId: data.conversationId,
            senderId: userId,
            text: data.text,
            fileUrl: data.fileUrl,
            readBy: [userId],
          });

          await Conversation.findByIdAndUpdate(data.conversationId, {
            lastMessage: newMessage._id,
          });

          // Broadcast strictly to members inside this conversation window
          io.to(data.conversationId).emit("receive_message", newMessage);
        } catch (error) {
          socket.emit("error", {
            message: "Failed to process and send the message",
          });
          console.error("[Socket] Failed to send message:", error);
        }
      },
    );

    // Typing indicators
    socket.on(
      "typing_status",
      (data: { conversationId: string; isTyping: boolean }) => {
        socket.to(data.conversationId).emit("typing_update", {
          conversationId: data.conversationId,
          userId,
          isTyping: data.isTyping,
        });
      },
    );

    // Disconnect event for offline statuses
    socket.on("disconnect", async () => {
      try {
        const timestamp = new Date();
        await User.findByIdAndUpdate(userId, {
          onlineStatus: false,
          lastSeen: timestamp,
        });
        socket.broadcast.emit("user_status_changed", {
          userId,
          isOnline: false,
          lastSeen: timestamp,
        });
      } catch (error) {
        console.error(
          "[Socket] Failed to update offline status on disconnect:",
          error,
        );
      }
    });
  });
};
