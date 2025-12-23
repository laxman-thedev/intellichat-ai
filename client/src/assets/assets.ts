// src/assets/assets.ts

import logo from "./logo.svg";
import logo_full from "./logo_full.svg";
import logo_full_dark from "./logo_full_dark.svg";
import search_icon from "./search_icon.svg";
import user_icon from "./user_icon.svg";
import theme_icon from "./theme_icon.svg";
import send_icon from "./send_icon.svg";
import stop_icon from "./stop_icon.svg";
import mountain_img from "./mountain_img.jpg";
import menu_icon from "./menu_icon.svg";
import close_icon from "./close_icon.svg";
import bin_icon from "./bin_icon.svg";
import logout_icon from "./logout_icon.svg";
import diamond_icon from "./diamond_icon.svg";
import gallery_icon from "./gallery_icon.svg";

import ai_image1 from "./ai_image1.jpg";
import ai_image2 from "./ai_image2.jpg";
import ai_image3 from "./ai_image3.jpg";
import ai_image4 from "./ai_image4.jpg";
import ai_image5 from "./ai_image5.jpg";
import ai_image6 from "./ai_image6.jpg";
import ai_image7 from "./ai_image7.jpg";
import ai_image8 from "./ai_image8.jpg";
import ai_image9 from "./ai_image9.jpg";
import ai_image10 from "./ai_image10.jpg";
import ai_image11 from "./ai_image11.jpg";
import ai_image12 from "./ai_image12.jpg";

import type {
    IUser,
    IPlan,
    IChat,
    IPublishedImage,
} from "../types/chat.types";


/* ------------------ ASSETS ------------------ */

export const assets: Record<string, string> = {
    logo,
    logo_full,
    logo_full_dark,
    search_icon,
    user_icon,
    theme_icon,
    send_icon,
    stop_icon,
    mountain_img,
    menu_icon,
    close_icon,
    bin_icon,
    logout_icon,
    diamond_icon,
    gallery_icon,
};

/* ------------------ DUMMY USER ------------------ */

export const dummyUserData: IUser = {
    _id: "689c6deed410acddc0d95a0e",
    name: "GreatStack",
    email: "admin@example.com",
    credits: 200,
};

/* ------------------ PLANS ------------------ */

export const dummyPlans: IPlan[] = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: [
            "100 text generations",
            "50 image generations",
            "Standard support",
            "Access to basic models",
        ],
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: [
            "500 text generations",
            "200 image generations",
            "Priority support",
            "Access to pro models",
            "Faster response time",
        ],
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: [
            "1000 text generations",
            "500 image generations",
            "24/7 VIP support",
            "Access to premium models",
            "Dedicated account manager",
        ],
    },
];

/* ------------------ CHATS ------------------ */

export const dummyChats: IChat[] = [
    {
        _id: "689de4bbaa932dc3a8ef6cd7",
        userId: "689c6deed410acddc0d95a0e",
        userName: "GreatStack",
        name: "New Chat",
        messages: [
            {
                isImage: false,
                isPublished: false,
                role: "user",
                content: "a boy running on water",
                timestamp: 1755178179612,
            },
            {
                isImage: true,
                isPublished: true,
                role: "assistant",
                content: ai_image11,
                timestamp: 1755178194747,
            },
        ],
        createdAt: "2025-08-14T13:29:31.398Z",
        updatedAt: "2025-08-14T13:29:54.753Z",
    },
    {
        _id: Date.now(),
        userId: "gs123456789",
        userName: "GreatStack",
        name: "New Chat",
        messages: [],
        createdAt: "2025-08-13T17:29:52.421Z",
        updatedAt: "2025-08-14T09:39:19.046Z",
    },
];

/* ------------------ PUBLISHED IMAGES ------------------ */

export const dummyPublishedImages: IPublishedImage[] = [
    { imageUrl: ai_image12, userName: "GreatStack" },
    { imageUrl: ai_image11, userName: "GreatStack" },
    { imageUrl: ai_image10, userName: "GreatStack" },
    { imageUrl: ai_image9, userName: "GreatStack" },
    { imageUrl: ai_image8, userName: "GreatStack" },
    { imageUrl: ai_image7, userName: "GreatStack" },
    { imageUrl: ai_image6, userName: "GreatStack" },
    { imageUrl: ai_image5, userName: "GreatStack" },
    { imageUrl: ai_image4, userName: "GreatStack" },
    { imageUrl: ai_image3, userName: "GreatStack" },
    { imageUrl: ai_image2, userName: "GreatStack" },
    { imageUrl: ai_image1, userName: "GreatStack" },
];