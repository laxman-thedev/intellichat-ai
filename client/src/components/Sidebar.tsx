import { useState } from "react";
import moment from "moment";

import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

import type { FC, Dispatch, SetStateAction} from "react";
import type { IChat } from "../types/chat.types";

/* ------------------ PROPS ------------------ */

interface SidebarProps {
    isMenuOpen: boolean;
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

/* ------------------ COMPONENT ------------------ */

const Sidebar: FC<SidebarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
    const { chats, setSelectedChat, theme, setTheme, user, navigate } = useAppContext();

    const [search, setSearch] = useState<string>("");

    /* ------------------ FILTERED CHATS ------------------ */

    const filteredChats: IChat[] = chats.filter((chat) => {
        const query = search.toLowerCase();

        if (chat.messages[0]) {
            return chat.messages[0].content.toLowerCase().includes(query);
        }

        return chat.name.toLowerCase().includes(query);
    });

    return (
        <div
            className={`flex flex-col h-screen min-w-72 p-5 dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-10 ${!isMenuOpen && "max-md:-translate-x-full"
                }`}
        >
            {/* Logo */}
            <img
                src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
                alt="logo"
                className="w-full max-w-48"
            />

            {/* New chat */}
            <button className="flex justify-center items-center w-full py-2 mt-10 text-white bg-linear-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer">
                <span className="mr-2 text-xl">+</span> New Chat
            </button>

            {/* Search */}
            <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
                <img
                    src={assets.search_icon}
                    className="w-4 not-dark:invert"
                    alt="search"
                />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversation"
                    className="text-xs placeholder:text-gray-400 outline-none bg-transparent"
                />
            </div>

            {/* Chats */}
            {filteredChats.length > 0 && (
                <p className="mt-4 text-sm">Recent Chats</p>
            )}

            <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
                {filteredChats.map((chat) => (
                    <div
                        key={chat._id}
                        onClick={() => {
                            navigate("/");
                            setSelectedChat(chat);
                            setIsMenuOpen(false);
                        }}
                        className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group"
                    >
                        <div>
                            <p className="truncate w-full">
                                {chat.messages.length > 0
                                    ? chat.messages[0].content.slice(0, 32)
                                    : chat.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                                {moment(chat.updatedAt).fromNow()}
                            </p>
                        </div>
                        <img
                            src={assets.bin_icon}
                            className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                            alt="delete"
                        />
                    </div>
                ))}
            </div>

            {/* Community */}
            <div
                onClick={() => {
                    navigate("/community");
                    setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-105 transition-all"
            >
                <img
                    src={assets.gallery_icon}
                    className="w-4.5 not-dark:invert"
                    alt="icon"
                />
                <p className="text-sm">Community Images</p>
            </div>

            {/* Credits */}
            <div
                onClick={() => {
                    navigate("/credits");
                    setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-105 transition-all"
            >
                <img
                    src={assets.diamond_icon}
                    className="w-4.5 dark:invert"
                    alt="icon"
                />
                <div className="text-sm">
                    <p>Credits: {user?.credits ?? 0}</p>
                    <p className="text-xs text-gray-400">
                        Purchase credits to use IntelliChat
                    </p>
                </div>
            </div>

            {/* Dark mode */}
            <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                    <img
                        src={assets.theme_icon}
                        className="w-4 not-dark:invert"
                        alt="icon"
                    />
                    <p>Dark Mode</p>
                </div>
                <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="cursor-pointer"
                />
            </div>

            {/* User */}
            <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
                <img src={assets.user_icon} className="w-7 rounded-full" alt="user" />
                <p className="flex-1 text-sm truncate">
                    {user ? user.name : "Login your account"}
                </p>
                {user && (
                    <img
                        src={assets.logout_icon}
                        className="h-5 hidden group-hover:block cursor-pointer not-dark:invert"
                        alt="logout"
                    />
                )}
            </div>

            {/* Close */}
            <img
                src={assets.close_icon}
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
                alt="close"
            />
        </div>
    );
};

export default Sidebar;