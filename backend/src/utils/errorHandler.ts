import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid request",
      details: err.errors.map((e) => e.message),
    });
  }

  return res.status(500).json({
    error: "Something went wrong",
    message:
      "We hit a snag processing your request. Please try again or contact support.",
  });
}

