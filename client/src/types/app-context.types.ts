import type { NavigateFunction } from "react-router-dom";
import type { AxiosInstance } from "axios";
import type { IUser, IChat } from "./chat.types";

export interface AppContextType {
    /* ------------------ USER ------------------ */
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;

    /* ------------------ AUTH ------------------ */
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;

    /* ------------------ CHATS ------------------ */
    chats: IChat[];
    setChats: React.Dispatch<React.SetStateAction<IChat[]>>;

    selectedChat: IChat | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<IChat | null>>;

    /* ------------------ UI ------------------ */
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;

    loadingUser: boolean;

    /* ------------------ ROUTING ------------------ */
    navigate: NavigateFunction;

    /* ------------------ API / ACTIONS ------------------ */
    fetchUser: () => Promise<void>;
    fetchUsersChats: () => Promise<void>;
    createNewChat: () => Promise<void>;

    /* ------------------ AXIOS ------------------ */
    axios: AxiosInstance;
}