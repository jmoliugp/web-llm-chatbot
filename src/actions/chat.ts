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
  email: string
): Promise<RetrieveLatestChatResponse | null> {
  const userChats = await prisma.chat.findMany({
    where: {
      user: { email },
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
