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
 * Renders:
 * - User messages
 * - Assistant text (Markdown + Prism)
 * - Assistant images
 *
 * Mobile Fix:
 * - Prevents horizontal overflow
 * - Code blocks scroll inside container only
 */
const Message = ({ message }: MessageProps) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [message.content]);

    return (
        <div className="w-full overflow-hidden">
            {message.role === "user" ? (
                /* ---------------- USER MESSAGE ---------------- */
                <div className="flex items-start justify-end my-4 gap-2 w-full">
                    <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-[85%] break-words">
                        <p className="text-sm dark:text-primary break-words">
                            {message.content}
                        </p>

                        <span className="text-xs text-gray-400 dark:text-[#B1ACC0]">
                            {moment(message.timestamp).fromNow()}
                        </span>
                    </div>

                    <img
                        className="w-8 rounded-full shrink-0"
                        src={assets.user_icon}
                        alt="icon"
                    />
                </div>
            ) : (
                /* ---------------- ASSISTANT MESSAGE ---------------- */
                <div className="w-full max-w-full md:max-w-2xl flex flex-col gap-2 p-2 px-4 bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4 overflow-hidden">

                    {/* Image response */}
                    {message.isImage ? (
                        <img
                            className="w-full max-w-md rounded-md"
                            src={message.content}
                            alt="generated"
                        />
                    ) : (
                        /* Text response */
                        <div className="text-xs dark:text-primary reset-tw w-full overflow-hidden">
                            {/* Scroll only inside code blocks */}
                            <div className="w-full overflow-x-auto">
                                <Markdown>{message.content}</Markdown>
                            </div>
                        </div>
                    )}

                    <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
                        {moment(message.timestamp).fromNow()}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Message;