import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Chat from "../models/Chat.js";

/* ------------------ TYPES ------------------ */

interface AuthRequest extends Request {
    user?: unknown;
}

interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

/* ------------------ HELPERS ------------------ */

// generate JWT token
const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: "30d",
    });
};

/* ------------------ CONTROLLERS ------------------ */

// API to register a new user
export const registerUser = async (
    req: Request<{}, {}, RegisterBody>,
    res: Response
): Promise<Response> => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id.toString());

        return res.status(201).json({
            success: true,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// API to login a user
export const loginUser = async (
    req: Request<{}, {}, LoginBody>,
    res: Response
): Promise<Response> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = generateToken(user._id.toString());
                return res.status(200).json({
                    success: true,
                    token,
                });
            }
        }

        return res.status(400).json({
            success: false,
            message: "Invalid email or password",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// API to get user data
export const getUserData = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// API to get published images
export const getPublishedImages = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const publishedImageMessages = await Chat.aggregate([
            { $unwind: "$messages" },
            {
                $match: {
                    "messages.isImage": true,
                    "messages.isPublished": true,
                },
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName",
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            images: publishedImageMessages.reverse(),
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};