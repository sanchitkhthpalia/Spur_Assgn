import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const SYSTEM_PROMPT = `
You are a helpful customer support agent for a small e-commerce store.

Store policies:
- Shipping: Ships within India and the USA in 3–7 business days
- Returns: 7-day return policy for unused items
- Refunds: Processed within 5 business days after return
- Support hours: Monday–Friday, 10am–6pm IST

Guidelines:
- Be concise, polite, and clear
- If unsure, say you will escalate to human support
`.trim();

const FALLBACK_MESSAGE =
  "Sorry, I'm having trouble responding right now. I've flagged this for human support.";

class LlmService {
  private client: OpenAI | null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async generateReply(
    history: ChatCompletionMessageParam[],
    userMessage: string,
  ): Promise<string> {
    if (!this.client) {
      return FALLBACK_MESSAGE;
    }

    try {
      const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: userMessage },
      ];

      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 200,
        temperature: 0.4,
      });

      const reply = response.choices[0]?.message?.content;
      return reply?.trim() || FALLBACK_MESSAGE;
    } catch (err) {
      console.error("LLM error", err);
      return FALLBACK_MESSAGE;
    }
  }
}

export const llmService = new LlmService();

