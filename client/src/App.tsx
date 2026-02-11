import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import "./assets/prism.css"; // Syntax highlighting styles for code blocks

import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import Loading from "./pages/Loading";
import Login from "./pages/Login";

import { assets } from "./assets/assets";
import { useAppContext } from "./context/AppContext";
import NotFound from "./pages/NotFound";

const App = () => {
  // Controls mobile sidebar visibility
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Get current route path
  const { pathname } = useLocation();

  // Global app state
  const { user, loadingUser } = useAppContext();

  // Show loading screen during:
  // - Stripe redirect flow (/loading)
  // - Initial user authentication check
  if (pathname === "/loading" || loadingUser) {
    return <Loading />;
  }

  return (
    <>
      {/* Global toast notifications */}
      <Toaster />

      {/* Mobile menu icon (shown only when sidebar is closed and user is logged in) */}
      {!isMenuOpen && user && (
        <img
          src={assets.menu_icon}
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          alt="menu"
        />
      )}

      {/* Authenticated layout */}
      {user ? (
        <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            {/* Sidebar navigation */}
            <Sidebar
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />

            {/* App routes */}
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
              <Route path="/loading" element={<Loading />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      ) : (
        /* Unauthenticated layout */
        <div className="bg-linear-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;