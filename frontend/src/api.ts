import { ChatMessage, HistoryResponse } from "./types";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000";

export async function sendMessage(payload: {
  message: string;
  sessionId?: string;
}): Promise<{ reply: string; sessionId: string }> {
  const res = await fetch(`${API_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to send message");
  }

  return res.json();
}

export async function fetchHistory(
  sessionId: string,
): Promise<HistoryResponse> {
  const res = await fetch(
    `${API_BASE}/chat/history?sessionId=${encodeURIComponent(sessionId)}`,
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to load history");
  }

  return res.json();
}

