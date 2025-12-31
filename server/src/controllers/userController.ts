import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Chat from "../models/Chat.js";

/* ------------------ TYPES ------------------ */

/**
 * Extended request type used for protected routes
 * User is injected by auth middleware
 */
interface AuthRequest extends Request {
    user?: unknown;
}

/**
 * Request body for user registration
 */
interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

/**
 * Request body for user login
 */
interface LoginBody {
    email: string;
    password: string;
}

/* ------------------ HELPERS ------------------ */

/**
 * Generates a signed JWT token for authentication
 * @param id MongoDB user ID
 */
const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: "30d",
    });
};

/* ------------------ CONTROLLERS ------------------ */

/* -------- REGISTER USER -------- */
/**
 * Registers a new user
 * - Prevents duplicate email registration
 * - Password hashing handled by User model middleware
 * - Returns JWT token on success
 */
export const registerUser = async (
    req: Request<{}, {}, RegisterBody>,
    res: Response
): Promise<Response> => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res
                .status(200)
                .json({ success: false, message: "User already exists" });
        }

        // Create new user
        const user = await User.create({ name, email, password });

        // Generate auth token
        const token = generateToken(user._id.toString());

        return res.status(201).json({
            success: true,
            token,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/* -------- LOGIN USER -------- */
/**
 * Authenticates user credentials
 * - Verifies email exists
 * - Compares hashed password
 * - Returns JWT token on success
 */
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

        // Invalid credentials fallback
        return res.status(200).json({
            success: false,
            message: "Invalid email or password",
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/* -------- GET USER DATA -------- */
/**
 * Returns authenticated user profile
 * - Requires valid JWT
 * - User is attached by protect middleware
 */
export const getUserData = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/* -------- GET PUBLISHED IMAGES -------- */
/**
 * Fetches all publicly shared AI-generated images
 * - Aggregates from chat messages
 * - Filters image + published flags
 * - Used for Community page
 */
export const getPublishedImages = async (
    _req: Request,
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