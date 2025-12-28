import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Connect DB
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_req: Request, res: Response) => {
    res.send("Server running with TypeScript");
});

app.use("/api/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});