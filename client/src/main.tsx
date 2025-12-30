import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.tsx";

// Entry point of the React application
// - createRoot enables React 18 concurrent features
// - BrowserRouter enables client-side routing
// - AppContextProvider wraps the app with global state (auth, chats, theme, etc.)
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);