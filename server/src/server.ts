import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

// dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Connect DB
await connectDB();

// stripe Webhooks
app.post("/api/stripe", express.raw({type: "application/json"}), stripeWebhooks)

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_req: Request, res: Response) => {
    res.send("Server running with TypeScript");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;