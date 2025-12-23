import { FormEvent, useEffect, useRef, useState } from "react";
import { fetchHistory, sendMessage } from "./api";
import { ChatMessage } from "./types";

const LOCAL_STORAGE_KEY = "chat_session_id";

const QUICK_PROMPTS = [
  "What’s your shipping timeline?",
  "What is the return policy?",
  "When are support hours?",
  "How do I track my order?",
];

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function loadSessionId() {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || undefined;
}

function saveSessionId(id: string) {
  localStorage.setItem(LOCAL_STORAGE_KEY, id);
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(loadSessionId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    async function bootstrap() {
      if (!sessionId) return;
      try {
        const history = await fetchHistory(sessionId);
        setMessages(history.messages);
      } catch (err) {
        console.error(err);
        setError("Unable to load previous messages. Starting fresh.");
      }
    }
    bootstrap();
  }, [sessionId]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      sender: "user",
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setLoading(true);
    setTyping(true);

    try {
      const response = await sendMessage({ message: text, sessionId });
      if (!sessionId) {
        setSessionId(response.sessionId);
        saveSessionId(response.sessionId);
      }
      const aiMessage: ChatMessage = {
        id: makeId(),
        sender: "ai",
        text: response.reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setError("We couldn't send your message. Please try again.");
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>AI Support Chat</h1>
          <p className="subhead">
            Ask about orders, shipping, returns, or anything else.
          </p>
          <div className="chips">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                className="chip"
                type="button"
                onClick={() => setInput(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <div className="status">
          <span className="dot online" />
          Online
        </div>
      </header>

      <div className="card">
        <div className="messages" ref={listRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === "user" ? "user" : "ai"}`}
            >
              <div className="avatar">
                {msg.sender === "user" ? "Y" : "A"}
              </div>
              <div className="message-body">
                <div className="sender-row">
                  <div className="sender">
                    {msg.sender === "user" ? "You" : "Support Agent"}
                  </div>
                  <div className="time">{formatTime(msg.createdAt)}</div>
                </div>
                <div className="bubble">{msg.text}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="message ai typing">
              <div className="avatar">A</div>
              <div className="message-body">
                <div className="sender-row">
                  <div className="sender">Support Agent</div>
                  <div className="time">typing…</div>
                </div>
                <div className="bubble dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="composer-wrap">
          {error && <div className="error">{error}</div>}
          <form className="composer" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend(e);
                }
              }}
              disabled={loading}
              aria-label="Message input"
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

