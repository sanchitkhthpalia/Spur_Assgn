import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { chatService } from "../services/chatService.js";

const messageSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(1000),
  sessionId: z.string().trim().optional(),
});

const historySchema = z.object({
  sessionId: z.string().trim(),
});

export async function handleMessage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { message, sessionId } = messageSchema.parse(req.body);

    const result = await chatService.processMessage(message, sessionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { sessionId } = historySchema.parse(req.query);
    const history = await chatService.fetchHistory(sessionId as string);
    res.json(history);
  } catch (error) {
    next(error);
  }
}

