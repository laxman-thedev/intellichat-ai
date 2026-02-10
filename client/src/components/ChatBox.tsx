import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

import type { IMessage } from "../types/chat.types";
import toast from "react-hot-toast";

/**
 * Supported chat modes:
 * - text  → normal AI text response
 * - image → AI image generation
 */
type Mode = "text" | "image";

const ChatBox = () => {
    /**
     * Reference to the chat container.
     * Used for auto-scrolling when new messages arrive.
     */
    const containerRef = useRef<HTMLDivElement | null>(null);

    /**
     * Global app context values
     */
    const {
        selectedChat, // currently active chat
        theme,        // light / dark mode
        user,         // logged-in user
        axios,        // preconfigured axios instance
        token,        // JWT auth token
        setUser,      // update user state (credits)
        fetchUsersChats, // refresh chat list
    } = useAppContext();

    /**
     * Local state
     */
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>("");
    const [mode, setMode] = useState<Mode>("text");
    const [isPublished, setIsPublished] = useState<boolean>(false);

    /* ------------------ SUBMIT ------------------ */

    /**
     * Handles message submission (text or image).
     * - Sends user prompt to backend
     * - Appends user message immediately
     * - Updates credits after successful response
     */
    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        // Ensure user is logged in
        if (!user) {
            toast("Login to continue");
            return;
        }

        let chatId = selectedChat?._id;

        // If no chat is selected, create one on the server first
        if (!chatId) {
            try {
                const { data: chatData } = await axios.get(
                    "/api/chat/create",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (chatData.success && chatData.chat) {
                    chatId = chatData.chat._id;
                } else {
                    toast.error("Failed to create chat");
                    return;
                }
            } catch {
                toast.error("Failed to create chat");
                return;
            }
        }

        try {
            setLoading(true);

            const promptCopy = prompt;
            setPrompt("");

            /**
             * Optimistic UI update:
             * Push user message immediately before API response
             */
            setMessages((prev) => [
                ...prev,
                {
                    role: "user",
                    content: promptCopy,
                    timestamp: Date.now(),
                    isImage: false,
                    isPublished: false,
                },
            ]);

            /**
             * Send message to backend
             */
            const { data } = await axios.post(
                `/api/message/${mode}`,
                {
                    chatId,
                    prompt: promptCopy,
                    isPublished,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (data.success) {
                // Append assistant reply
                setMessages((prev) => [...prev, data.reply]);

                /**
                 * Update user credits locally
                 * - text  → -1 credit
                 * - image → -2 credits
                 */
                setUser((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        credits:
                            mode === "image"
                                ? prev.credits - 2
                                : prev.credits - 1,
                    };
                });

                // If this was a new chat, refresh the chat list
                if (!selectedChat) {
                    await fetchUsersChats();
                }
            } else {
                toast.error(data.message);
                setPrompt(promptCopy);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong");
            }
            setPrompt(prompt);
        } finally {
            setLoading(false);
        }
    };

    /* ------------------ EFFECTS ------------------ */

    /**
     * Sync messages when selected chat changes.
     * Clear messages when no chat is selected (new chat mode).
     */
    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages);
        } else {
            setMessages([]);
        }
    }, [selectedChat]);

    /**
     * Auto-scroll chat container to bottom on new messages
     */
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    /* ------------------ UI ------------------ */

    return (
        <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40 overflow-y-scroll">
            {/* Messages */}
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

                {/* Render chat messages */}
                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
            </div>

            {/* Loading animation */}
            {loading && (
                <div className="loader flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
                </div>
            )}

            {/* Image publish toggle (only for image mode) */}
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

            {/* Prompt input */}
            <form
                onSubmit={handleSubmit}
                className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
            >
                {/* Mode selector */}
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

                {/* Prompt input */}
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 w-full text-sm outline-none"
                    placeholder="Type your prompt here..."
                    required
                />

                {/* Send button */}
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