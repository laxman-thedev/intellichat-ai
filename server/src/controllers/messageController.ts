import type { Response } from "express";
import axios from "axios";
import type { AuthRequest } from "../middlewares/auth.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";

/* ------------------ TEXT MESSAGE ------------------ */
/**
 * Handles AI text generation
 * - Deducts 1 credit per request
 * - Stores user and assistant messages
 */
export const textMessageController = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const user = req.user as any;
        const userId = user._id;

        // Check available credits
        if (user.credits < 1) {
            return res
                .status(200)
                .json({ success: false, message: "Insufficient credits" });
        }

        const { chatId, prompt } = req.body as {
            chatId: string;
            prompt: string;
        };

        // Validate chat ownership
        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res
                .status(200)
                .json({ success: false, message: "Chat not found" });
        }

        // Save user message
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false,
        });

        // Generate AI response
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
        });

        const reply = {
            ...choices[0].message,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false,
        };

        // Send response immediately
        res.status(200).json({ success: true, reply });

        // Persist assistant message and deduct credits
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
/**
 * Handles AI image generation
 * - Deducts 2 credits
 * - Uploads generated image to ImageKit
 * - Optionally publishes image to community
 */
export const imageMessageController = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const user = req.user as any;
        const userId = user._id;

        // Check credits for image generation
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

        // Validate chat ownership
        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res
                .status(200)
                .json({ success: false, message: "Chat not found" });
        }

        // Store user prompt
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: false,
        });

        // Generate image via ImageKit prompt endpoint
        const encodedPrompt = encodeURIComponent(prompt);
        const generatedImageUrl =
            `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/intellichat/${Date.now()}.png?tr=w=800,h-800`;

        const aiImageResponse = await axios.get<ArrayBuffer>(
            generatedImageUrl,
            { responseType: "arraybuffer" }
        );

        // Convert image to base64 for upload
        const base64Image = `data:image/png;base64,${Buffer.from(
            aiImageResponse.data
        ).toString("base64")}`;

        // Upload image to ImageKit
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

        // Respond to client
        res.status(200).json({ success: true, reply });

        // Persist image message and deduct credits
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