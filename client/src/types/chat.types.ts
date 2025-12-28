// src/types/chat.types.ts

export type Role = "user" | "assistant";

export interface IMessage {
    isImage: boolean;
    isPublished: boolean;
    role: Role;
    content: string; // text OR image url
    timestamp: number;
}

export interface IChat {
    _id: string;
    userId: string;
    userName?: string;
    name: string;
    messages: IMessage[];
    createdAt: string;
    updatedAt: string;
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    credits: number;
}

export interface IPlan {
    _id: string;
    name: string;
    price: number;
    credits: number;
    features: string[];
}

export interface IPublishedImage {
    imageUrl: string;
    userName: string;
}
