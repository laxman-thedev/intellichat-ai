import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ------------------ TYPES ------------------ */

/**
 * Shape of JWT payload stored in the token
 * We only store the user ID
 */
interface JwtPayload {
    id: string;
}

/**
 * Extended Express Request type
 * Adds `user` property after authentication
 */
export interface AuthRequest extends Request {
    user?: unknown;
}

/* ------------------ AUTH MIDDLEWARE ------------------ */

/**
 * Protect middleware
 *
 * - Verifies JWT token from Authorization header
 * - Fetches authenticated user from database
 * - Attaches user object to `req.user`
 * - Blocks request if authentication fails
 */
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {

    // Extract Authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists and follows "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized, no token" });
    }

    try {
        // Extract token from header
        const token = authHeader.split(" ")[1];

        // Verify JWT token using secret key
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        // Fetch user from database (exclude password)
        const user = await User.findById(decoded.id).select("-password");

        // If user does not exist
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Not authorized, user not found" });
        }

        // Attach authenticated user to request object
        req.user = user;

        // Allow request to proceed
        next();
    } catch (error) {
        // Token invalid, expired, or malformed
        return res
            .status(401)
            .json({ success: false, message: "Not authorized, token failed" });
    }
};