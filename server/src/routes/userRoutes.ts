import express from "express";
import {
    getPublishedImages,
    getUserData,
    loginUser,
    registerUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

/**
 * Router for user authentication & profile actions
 */
const userRouter = express.Router();

/**
 * Register a new user account
 */
userRouter.post("/register", registerUser);

/**
 * Login user and return JWT token
 */
userRouter.post("/login", loginUser);

/**
 * Get logged-in user profile data
 * Protected route – requires valid JWT
 */
userRouter.get("/data", protect, getUserData);

/**
 * Fetch community-published images
 * Public route – visible to all users
 */
userRouter.get("/published-images", getPublishedImages);

export default userRouter;