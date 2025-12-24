/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";

import type { FormEvent } from "react";

import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

import type { IMessage } from "../types/chat.types";

type Mode = "text" | "image";

const ChatBox = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { selectedChat, theme } = useAppContext();

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>("");
    const [mode, setMode] = useState<Mode>("text");
    const [isPublished, setIsPublished] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages);
        }
    }, [selectedChat]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40 overflow-y-scroll">
            {/* Chat Messages */}
            <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
                        <img
                            className="w-full max-w-56 sm:max-w-68"
                            src={
                                theme === "dark"
                                    ? assets.logo_full
                                    : assets.logo_full_dark
                            }
                            alt="logo"
                        />
                        <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
                            Ask me anything.
                        </p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
            </div>

            {/* Loader */}
            {loading && (
                <div className="loader flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
                </div>
            )}

            {mode === "image" && (
                <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
                    <p className="text-xs">
                        Publish Generated Image to Community
                    </p>
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="cursor-pointer"
                    />
                </label>
            )}

            {/* Prompt Input */}
            <form
                onSubmit={handleSubmit}
                className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
            >
                <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as Mode)}
                    className="text-sm pl-3 pr-2 outline-none"
                >
                    <option className="dark:bg-purple-900" value="text">
                        Text
                    </option>
                    <option className="dark:bg-purple-900" value="image">
                        Image
                    </option>
                </select>

                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 w-full text-sm outline-none"
                    placeholder="Type your prompt here..."
                    required
                />

                <button disabled={loading}>
                    <img
                        className="w-8 cursor-pointer"
                        src={loading ? assets.stop_icon : assets.send_icon}
                        alt="send"
                    />
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
