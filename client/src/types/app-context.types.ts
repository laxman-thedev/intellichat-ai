import type { NavigateFunction } from "react-router-dom";
import type { IUser, IChat } from "./chat.types";

export interface AppContextType {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;

    chats: IChat[];
    setChats: React.Dispatch<React.SetStateAction<IChat[]>>;

    selectedChat: IChat | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<IChat | null>>;

    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;

    navigate: NavigateFunction;

    fetchUser: () => Promise<void>;
}
