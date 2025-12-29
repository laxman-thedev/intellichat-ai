import type { Response } from "express";
import Chat from "../models/Chat.js";
import type { AuthRequest } from "../middlewares/auth.js";

/* ------------------ CREATE CHAT ------------------ */

export const createChat = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const user = req.user as any;

        const chat = await Chat.create({
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

export const getChats = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const user = req.user as any;

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

export const deleteChat = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const { chatId } = req.body;
        const user = req.user as any;

        if (!chatId) {
            return res
                .status(200)
                .json({ success: false, message: "Chat ID required" });
        }

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