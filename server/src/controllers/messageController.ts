import type { Response } from "express";
import axios from "axios";
import type { AuthRequest } from "../middlewares/auth.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";

/* ------------------ TEXT MESSAGE ------------------ */

export const textMessageController = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const user = req.user as any;
        const userId = user._id;

        if (user.credits < 1) {
            return res
                .status(200)
                .json({ success: false, message: "Insufficient credits" });
        }

        const { chatId, prompt } = req.body as {
            chatId: string;
            prompt: string;
        };

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res
                .status(200)
                .json({ success: false, message: "Chat not found" });
        }

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false,
        });

        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = {
            ...choices[0].message,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false,
        };

        res.status(200).json({ success: true, reply });

        chat.messages.push(reply as any);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

        return res;
    } catch (error: any) {
        return res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};

/* ------------------ IMAGE MESSAGE ------------------ */

export const imageMessageController = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const user = req.user as any;
        const userId = user._id;

        if (user.credits < 2) {
            return res
                .status(200)
                .json({ success: false, message: "Insufficient credits" });
        }

        const { chatId, prompt, isPublished } = req.body as {
            chatId: string;
            prompt: string;
            isPublished: boolean;
        };

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res
                .status(200)
                .json({ success: false, message: "Chat not found" });
        }

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false,
        });

        const encodedPrompt = encodeURIComponent(prompt);
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/intellichat/${Date.now()}.png?tr=w=800,h-800`;

        const aiImageResponse = await axios.get<ArrayBuffer>(
            generatedImageUrl,
            { responseType: "arraybuffer" }
        );

        const base64Image = `data:image/png;base64,${Buffer.from(
            aiImageResponse.data
        ).toString("base64")}`;

        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "intellichat",
        });

        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished,
        };

        res.status(200).json({ success: true, reply });

        chat.messages.push(reply as any);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

        return res;
    } catch (error: any) {
        return res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};