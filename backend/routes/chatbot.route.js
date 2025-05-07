import express from "express";
import { handleChatbotRequest } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/", handleChatbotRequest);

export default router;
