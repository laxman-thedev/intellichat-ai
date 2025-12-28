import mongoose, { Schema, Document, Model } from "mongoose";

/* ------------------ TYPES ------------------ */

export interface IMessage {
    isImage: boolean;
    isPublished: boolean;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

export interface IChat extends Document {
    userId: string;
    userName: string;
    name: string;
    messages: IMessage[];
}

/* ------------------ SCHEMA ------------------ */

const messageSchema = new Schema<IMessage>(
    {
        isImage: { type: Boolean, required: true },
        isPublished: { type: Boolean, default: false },
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        content: { type: String, required: true },
        timestamp: { type: Number, required: true },
    },
    { _id: false }
);

const chatSchema = new Schema<IChat>(
    {
        userId: {
            type: String,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        messages: [messageSchema],
    },
    { timestamps: true }
);

/* ------------------ MODEL ------------------ */

const Chat: Model<IChat> =
    mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);

export default Chat;