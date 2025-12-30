import { useEffect } from "react";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";

import { assets } from "../assets/assets";
import type { IMessage } from "../types/chat.types";

/**
 * Props for Message component
 */
interface MessageProps {
    message: IMessage;
}

/**
 * Message component
 * -----------------
 * Responsible for rendering a single chat message.
 * Supports:
 * - User messages
 * - Assistant text responses (Markdown + syntax highlighting)
 * - Assistant image responses
 */
const Message = ({ message }: MessageProps) => {

    /**
     * Re-run Prism syntax highlighting
     * whenever message content changes.
     * This is required for code blocks inside Markdown.
     */
    useEffect(() => {
        Prism.highlightAll();
    }, [message.content]);

    return (
        <div>
            {/* User message */}
            {message.role === "user" ? (
                <div className="flex items-start justify-end my-4 gap-2">
                    <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl">
                        <p className="text-sm dark:text-primary">
                            {message.content}
                        </p>

                        {/* Timestamp */}
                        <span className="text-xs text-gray-400 dark:text-[#B1ACC0]">
                            {moment(message.timestamp).fromNow()}
                        </span>
                    </div>

                    {/* User avatar */}
                    <img
                        className="w-8 rounded-full"
                        src={assets.user_icon}
                        alt="icon"
                    />
                </div>
            ) : (
                /* Assistant message */
                <div className="inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4">

                    {/* Image response */}
                    {message.isImage ? (
                        <img
                            className="w-full max-w-md mt-2 rounded-md"
                            src={message.content}
                            alt="generated"
                        />
                    ) : (
                        /* Text response (Markdown supported) */
                        <div className="text-xs dark:text-primary reset-tw">
                            <Markdown>{message.content}</Markdown>
                        </div>
                    )}

                    {/* Timestamp */}
                    <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
                        {moment(message.timestamp).fromNow()}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Message;