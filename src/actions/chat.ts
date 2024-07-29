"use server";

import { $Enums, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ServerActionResponse<Data> {
  data?: Data;
  error?: string;
}

interface RetrieveLatestChatResponse {
  id: number;
  messages: {
    id: number;
    chatId: number;
    sender: $Enums.SenderType;
    content: string;
    createdAt: Date;
    type: $Enums.MessageType;
  }[];
}

export async function retrieveLatestChat(
  userId: number
): Promise<RetrieveLatestChatResponse | null> {
  const userChats = await prisma.chat.findMany({
    where: {
      user: { id: userId },
    },
    orderBy: { createdAt: "desc" },
  });
  if (userChats.length === 0) {
    return null;
  }

  const mostRecentChat = userChats[0];
  const messages = await prisma.message.findMany({
    where: {
      chatId: mostRecentChat.id,
    },
  });

  return {
    id: mostRecentChat.id,
    messages: messages.map((message) => ({
      id: message.id,
      chatId: message.chatId,
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt,
      type: message.type,
    })),
  };
}

export async function createNewChat(userId: number) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const newChat = await prisma.chat.create({
        data: {
          userId,
        },
      });

      await prisma.message.create({
        data: {
          chatId: newChat.id,
          sender: "LLM",
          content:
            "Welcome! I am your assistant. You can ask me anything or request help with specific topics.",
          type: "TEXT",
        },
      });

      return newChat;
    });

    return result;
  } catch (error) {
    console.error("Error creating new chat: ", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
