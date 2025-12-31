import type { Response } from "express";
import Chat from "../models/Chat.js";
import type { AuthRequest } from "../middlewares/auth.js";

/* ------------------ CREATE CHAT ------------------ */
/**
 * Creates a new empty chat for the authenticated user
 * - Uses user data injected by auth middleware
 * - Initializes chat with no messages
 */
export const createChat = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        // Authenticated user from middleware
        const user = req.user as any;

        // Create a new chat document
        await Chat.create({
            userId: user._id.toString(),
            userName: user.name,
            name: "New Chat",
            messages: [],
        });

        return res
            .status(201)
            .json({ success: true, message: "Chat created" });
    } catch (error: any) {
        return res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};

/* ------------------ GET CHATS ------------------ */
/**
 * Fetches all chats for the authenticated user
 * - Sorted by latest updated chat
 */
export const getChats = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const user = req.user as any;

        // Retrieve user's chats sorted by activity
        const chats = await Chat.find({ userId: user._id })
            .sort({ updatedAt: -1 })
            .lean();

        return res.status(200).json({ success: true, chats });
    } catch (error: any) {
        return res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};

/* ------------------ DELETE CHAT ------------------ */
/**
 * Deletes a specific chat belonging to the authenticated user
 */
export const deleteChat = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const { chatId } = req.body;
        const user = req.user as any;

        // Validate request payload
        if (!chatId) {
            return res
                .status(200)
                .json({ success: false, message: "Chat ID required" });
        }

        // Ensure chat belongs to the user before deletion
        await Chat.deleteOne({ _id: chatId, userId: user._id });

        return res
            .status(200)
            .json({ success: true, message: "Chat deleted" });
    } catch (error: any) {
        return res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};