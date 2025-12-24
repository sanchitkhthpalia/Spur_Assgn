# AI Live Chat Support Agent

Production-ready MVP for a live chat widget with an AI support agent. Built with React/Vite on the frontend, Express/Prisma/SQLite on the backend, and OpenAI Chat Completions for replies.

## 🚀 Quick Start

**📖 For Complete Deployment Instructions:** See **`QUICK-START.md`** - This is your one-stop deployment guide!

### ☁️ Recommended Deployment Platforms
- **Render.com** - Easiest one-click deployment (15 minutes to live!)
- **Vercel + Railway** - Best performance and scalability
- **Self-hosted servers** - Full control with automated scripts

## Tech Stack
- Frontend: React, TypeScript, Vite, plain CSS
- Backend: Node.js, TypeScript, Express, Prisma ORM, SQLite
- LLM: OpenAI Chat Completions API

## Project Structure
- `backend/` — Express API, Prisma schema, LLM + chat services
- `frontend/` — React chat widget UI

## Local Setup
1. Clone this repo and install dependencies separately for backend and frontend:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Backend environment:
   - Copy `backend/env.example` to `backend/.env` and fill `OPENAI_API_KEY`.
3. Database:
   - From `backend/`, run `npx prisma migrate dev --name init` (creates SQLite `dev.db`).
   - Optional: `npm run prisma:generate` to refresh the client after schema changes.
4. Run the backend:
   - `npm run dev` (default port 4000) or `npm start` after `npm run build`.
5. Run the frontend:
   - From `frontend/`, `npm run dev` (default port 5173).
6. Visit `http://localhost:5173` and start chatting. The frontend will call `http://localhost:4000` by default; override with `VITE_API_BASE_URL`.

## Environment Variables
Backend (`backend/.env`):
```
OPENAI_API_KEY=sk-...
PORT=4000
DATABASE_URL="file:./dev.db"
```

Frontend (`frontend/.env`, optional):
```
VITE_API_BASE_URL=http://localhost:4000
```

## API
- `POST /chat/message`
  - Body: `{ message: string, sessionId?: string }`
  - Response: `{ reply: string, sessionId: string }`
- `GET /chat/history?sessionId=...`
  - Response: `{ sessionId: string, messages: Array<{id, sender, text, createdAt}> }`
- `GET /health` — simple health check.

## LLM Design
- System prompt encodes store policies (shipping 3–7 business days in India/USA, 7-day returns, refunds in 5 business days, support hours Mon–Fri 10am–6pm IST).
- Includes recent conversation history (last 12 messages) for context.
- Uses `gpt-4o-mini`, temperature 0.4, max_tokens 200.
- Robust fallback: friendly apology when API key is missing, rate limited, or any error occurs.

## Architecture Notes
- `routes/` → HTTP routes
- `controllers/` → validation (zod) + request orchestration
- `services/chatService` → conversation/session handling, history loading, persistence
- `services/llmService` → OpenAI abstraction and prompt
- `db/prisma` → shared Prisma client
- `utils/errorHandler` → centralized error responses
- SQLite via Prisma; conversation + message tables with UUID IDs.
- Frontend stores `sessionId` in `localStorage` and fetches history on reload; disables send during inflight calls; shows typing indicator; auto-scrolls to new messages.

## Prisma Migration Steps
- Dev: `npx prisma migrate dev --name <name>`
- Deploy: `npm run prisma:deploy`
- Update client after schema change: `npm run prisma:generate`

## Trade-offs & Future Work
- Could stream tokens for faster perceived response.
- Add authentication and rate limiting for production.
- Add better message length handling (e.g., server-side truncation/notification).
- Improve error reporting/observability (structured logs, tracing).
- Add unit/integration tests for services and UI states.
- Dockerize and add CI for lint/test/build.***

