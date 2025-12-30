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

/**
 * Set base URL for all axios requests.
 * Value comes from Vite environment variables.
 */
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

/* ------------------ CONTEXT ------------------ */

/**
 * Global application context.
 * Holds user state, chats, theme, token, and shared actions.
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/* ------------------ PROVIDER PROPS ------------------ */

interface AppContextProviderProps {
    children: ReactNode;
}

/* ------------------ PROVIDER ------------------ */

/**
 * AppContextProvider
 * ------------------
 * Wraps the application and provides global state:
 * - Authenticated user
 * - Chat data
 * - Theme (dark/light)
 * - Auth token
 * - Shared API actions
 */
export const AppContextProvider = ({
    children,
}: AppContextProviderProps) => {
    // React Router navigation helper
    const navigate: NavigateFunction = useNavigate();

    // Logged-in user data
    const [user, setUser] = useState<IUser | null>(null);

    // All chats of the user
    const [chats, setChats] = useState<IChat[]>([]);

    // Currently selected chat
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

    // UI theme state (persisted in localStorage)
    const [theme, setTheme] = useState<string>(
        localStorage.getItem("theme") || "light"
    );

    // JWT token (persisted in localStorage)
    const [token, setToken] = useState<string>(
        localStorage.getItem("token") || ""
    );

    // Indicates whether user data is being loaded
    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    /* ------------------ ACTIONS ------------------ */

    /**
     * Fetch logged-in user details using stored JWT token.
     * Used on app load and after Stripe payment completion.
     */
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

    /**
     * Create a new empty chat for the logged-in user.
     * Redirects user to home page after creation.
     */
    const createNewChat = async (): Promise<void> => {
        try {
            if (!user) {
                toast("Login to create a new chat");
                return;
            }

            // Ensure user is on chat screen
            navigate("/");

            await axios.get("/api/chat/create", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Refresh chat list after creation
            await fetchUsersChats();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to create chat");
            }
        }
    };

    /**
     * Fetch all chats belonging to the logged-in user.
     * Automatically selects the latest chat.
     */
    const fetchUsersChats = async (): Promise<void> => {
        try {
            const { data } = await axios.get("/api/chat/get", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                setChats(data.chats);

                // If no chats exist, create one automatically
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

    /**
     * Apply dark/light theme to document root
     * and persist preference in localStorage.
     */
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    /**
     * Fetch chats whenever user changes.
     * Reset chats when user logs out.
     */
    useEffect(() => {
        if (user) {
            fetchUsersChats();
        } else {
            setChats([]);
            setSelectedChat(null);
        }
    }, [user]);

    /**
     * Fetch user data when token becomes available.
     * Reset user state if token is removed.
     */
    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    }, [token]);

    /* ------------------ CONTEXT VALUE ------------------ */

    /**
     * Values and actions exposed to the entire app
     */
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

/**
 * useAppContext
 * -------------
 * Safe wrapper around useContext.
 * Ensures hook is used inside AppContextProvider.
 */
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error(
            "useAppContext must be used within an AppContextProvider"
        );
    }

    return context;
};