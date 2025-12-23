import { Router } from "express";
import { handleMessage, getHistory } from "../controllers/chatController.js";

const router = Router();

router.post("/message", handleMessage);
router.get("/history", getHistory);

export default router;

