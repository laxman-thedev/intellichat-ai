import express from "express";
import {
    createChat,
    deleteChat,
    getChats,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";

/**
 * Router for chat-related operations
 */
const chatRouter = express.Router();

/**
 * Create a new chat
 * Protected route – requires valid JWT
 */
chatRouter.get("/create", protect, createChat);

/**
 * Get all chats of the logged-in user
 * Protected route – requires authentication
 */
chatRouter.get("/get", protect, getChats);

/**
 * Delete a specific chat
 * Protected route – ensures chat belongs to the user
 */
chatRouter.post("/delete", protect, deleteChat);

export default chatRouter;