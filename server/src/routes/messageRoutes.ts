import express from "express";
import { protect } from "../middlewares/auth.js";
import {
    imageMessageController,
    textMessageController,
} from "../controllers/messageController.js";

/**
 * Router for handling AI messages
 */
const messageRouter = express.Router();

/**
 * Handle text-based AI messages
 * Protected route – consumes user credits
 */
messageRouter.post("/text", protect, textMessageController);

/**
 * Handle image generation requests
 * Protected route – consumes higher credits
 */
messageRouter.post("/image", protect, imageMessageController);

export default messageRouter;