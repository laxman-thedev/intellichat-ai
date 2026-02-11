import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const messages = [
    "Searching the neural network...",
    "Analyzing request...",
    "Oops! This page does not exist.",
];

const NotFound = () => {
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [msgIndex, setMsgIndex] = useState(0);

    /* -------- Typing Animation -------- */
    useEffect(() => {
        const currentMessage = messages[msgIndex];
        let i = 0;

        const typing = setInterval(() => {
            setText(currentMessage.slice(0, i));
            i++;
            if (i > currentMessage.length) {
                clearInterval(typing);
                setTimeout(() => {
                    setMsgIndex((prev) =>
                        prev === messages.length - 1 ? prev : prev + 1
                    );
                }, 800);
            }
        }, 40);

        return () => clearInterval(typing);
    }, [msgIndex]);

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden bg-linear-to-b from-[#1a0b2e] to-black text-white px-6">

            {/* -------- Floating AI Orbs -------- */}
            <div className="absolute w-72 h-72 bg-purple-600/30 rounded-full blur-3xl top-10 left-10 animate-pulse" />
            <div className="absolute w-72 h-72 bg-blue-500/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />
            <div className="absolute w-52 h-52 bg-pink-500/20 rounded-full blur-2xl top-1/2 left-1/3 animate-pulse" />

            {/* -------- Logo -------- */}
            <img
                src={assets.logo_full}
                alt="IntelliChat"
                className="w-56 mb-8 opacity-90 z-10"
            />

            {/* -------- Glitch 404 -------- */}
            <h1 className="text-8xl font-extrabold relative z-10 glitch">
                404
            </h1>

            {/* -------- Typing Text -------- */}
            <p className="mt-6 text-lg text-gray-300 h-6 z-10">
                {text}
                <span className="animate-pulse">|</span>
            </p>

            {/* -------- Buttons -------- */}
            <div className="flex gap-4 mt-10 z-10">
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition shadow-lg hover:scale-105 cursor-pointer"
                >
                    Go Home
                </button>

                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 rounded-md border border-purple-500 hover:bg-purple-900/40 transition hover:scale-105 cursor-pointer"
                >
                    Start Chat
                </button>
            </div>

            {/* -------- Footer Text -------- */}
            <p className="absolute bottom-6 text-xs text-gray-500">
                IntelliChat • Intelligent AI Assistant
            </p>

            {/* -------- Glitch CSS -------- */}
            <style>{`
                .glitch {
                color: white;
                text-shadow:
                    2px 2px #a855f7,
                    -2px -2px #3b82f6;
                animation: glitch 1.5s infinite;
                }

                @keyframes glitch {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
                }
            `}</style>
        </div>
    );
};

export default NotFound;