/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";
import type { NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

import type { IUser, IChat } from "../types/chat.types";
import type { AppContextType } from "../types/app-context.types";

/* ------------------ AXIOS CONFIG ------------------ */

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/* ------------------ CONTEXT ------------------ */

const AppContext = createContext<AppContextType | undefined>(undefined);

/* ------------------ PROVIDER PROPS ------------------ */

interface AppContextProviderProps {
    children: ReactNode;
}

/* ------------------ PROVIDER ------------------ */

export const AppContextProvider = ({
    children,
}: AppContextProviderProps) => {
    const navigate: NavigateFunction = useNavigate();

    const [user, setUser] = useState<IUser | null>(null);
    const [chats, setChats] = useState<IChat[]>([]);
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

    const [theme, setTheme] = useState<string>(
        localStorage.getItem("theme") || "light"
    );

    const [token, setToken] = useState<string>(
        localStorage.getItem("token") || ""
    );

    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    /* ------------------ ACTIONS ------------------ */

    const fetchUser = async (): Promise<void> => {
        try {
            const { data } = await axios.get("/api/user/data", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                setUser(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to fetch user");
            }
        } finally {
            setLoadingUser(false);
        }
    };

    const createNewChat = async (): Promise<void> => {
        try {
            if (!user) {
                toast("Login to create a new chat");
                return;
            }

            navigate("/");

            await axios.get("/api/chat/create", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await fetchUsersChats();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to create chat");
            }
        }
    };

    const fetchUsersChats = async (): Promise<void> => {
        try {
            const { data } = await axios.get("/api/chat/get", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                setChats(data.chats);

                // If no chats exist, create one
                if (data.chats.length === 0) {
                    await createNewChat();
                    return fetchUsersChats();
                } else {
                    setSelectedChat(data.chats[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to fetch chats");
            }
        }
    };

    /* ------------------ EFFECTS ------------------ */

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        if (user) {
            fetchUsersChats();
        } else {
            setChats([]);
            setSelectedChat(null);
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    }, [token]);

    /* ------------------ CONTEXT VALUE ------------------ */

    const value: AppContextType = {
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        navigate,
        fetchUser,
        createNewChat,
        loadingUser,
        fetchUsersChats,
        token,
        setToken,
        axios,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

/* ------------------ CUSTOM HOOK ------------------ */

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error(
            "useAppContext must be used within an AppContextProvider"
        );
    }

    return context;
};