import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/chat", chatRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

