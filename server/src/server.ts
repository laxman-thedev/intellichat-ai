import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config"; // Loads environment variables from .env

import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

/**
 * Create Express application instance
 */
const app = express();

/**
 * Server port configuration
 * Defaults to 5000 if PORT is not defined in environment
 */
const PORT = Number(process.env.PORT) || 5000;

/**
 * Establish MongoDB connection before handling requests
 * Uses top-level await (Node.js ES module support)
 */
await connectDB();

/**
 * Stripe webhook endpoint
 * This route must be defined BEFORE express.json middleware
 */
app.post(
    "/api/stripe",
    express.raw({ type: "application/json" }),
    stripeWebhooks
);

/**
 * Global middlewares
 */

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

/**
 * Health check / root route
 * Useful to verify server is running
 */
app.get("/", (_req: Request, res: Response) => {
    res.send("Server running with TypeScript");
});

/**
 * API routes
 */

// User authentication & profile routes
app.use("/api/user", userRouter);

// Chat creation, fetching, deletion routes
app.use("/api/chat", chatRouter);

// Text & image message handling routes
app.use("/api/message", messageRouter);

// Credit plans & Stripe checkout routes
app.use("/api/credit", creditRouter);

/**
 * Start HTTP server
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;