import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ------------------ TYPES ------------------ */

interface JwtPayload {
    id: string;
}

export interface AuthRequest extends Request {
    user?: unknown;
}

/* ------------------ MIDDLEWARE ------------------ */

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized, no token" });
    }

    try {
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Not authorized, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized, token failed" });
    }
};