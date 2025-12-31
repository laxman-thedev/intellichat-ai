import mongoose, { Schema, Document, Model } from "mongoose";

/* ------------------ TYPES ------------------ */

/**
 * Represents a single message inside a chat
 * Can be either a text message or an image
 */
export interface IMessage {
    isImage: boolean;          // true if message is an image URL
    isPublished: boolean;      // whether image is published to community
    role: "user" | "assistant"; // sender role
    content: string;           // text content OR image URL
    timestamp: number;         // message creation time
}

/**
 * Chat document structure
 */
export interface IChat extends Document {
    userId: string;            // owner of the chat
    userName: string;          // username (used for community images)
    name: string;              // chat title
    messages: IMessage[];      // list of messages in chat
}

/* ------------------ SCHEMA ------------------ */

/**
 * Schema for individual messages
 * Embedded inside Chat documents
 */
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
    { _id: false } // Prevents MongoDB from creating _id for each message
);

/**
 * Schema for chat documents
 */
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
    { timestamps: true } // Automatically adds createdAt & updatedAt
);

/* ------------------ MODEL ------------------ */

/**
 * Chat model
 * Reuses existing model if already compiled (important for dev/hot reload)
 */
const Chat: Model<IChat> =
    mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);

export default Chat;