import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { prisma } from "../db/prisma.js";
import { llmService } from "./llmService.js";

const HISTORY_LIMIT = 12;

async function ensureConversation(sessionId?: string) {
  if (sessionId) {
    const existing = await prisma.conversation.findUnique({
      where: { id: sessionId },
    });
    if (existing) return existing.id;
  }

  const created = await prisma.conversation.create({ data: {} });
  return created.id;
}

async function getRecentMessages(conversationId: string) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: HISTORY_LIMIT,
  });

  return messages
    .reverse()
    .map<ChatCompletionMessageParam>((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));
}

async function saveMessage(
  conversationId: string,
  sender: "user" | "ai",
  text: string,
) {
  await prisma.message.create({
    data: { conversationId, sender, text },
  });
}

async function processMessage(message: string, sessionId?: string) {
  const conversationId = await ensureConversation(sessionId);
  const history = await getRecentMessages(conversationId);

  await saveMessage(conversationId, "user", message);

  const reply = await llmService.generateReply(history, message);
  await saveMessage(conversationId, "ai", reply);

  return {
    reply,
    sessionId: conversationId,
  };
}

async function fetchHistory(sessionId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: sessionId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  return {
    sessionId,
    messages:
      conversation?.messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        createdAt: m.createdAt,
      })) ?? [],
  };
}

export const chatService = {
  processMessage,
  fetchHistory,
};

