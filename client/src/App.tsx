import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import "./assets/prism.css";

import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import Loading from "./pages/Loading";
import Login from "./pages/Login";

import { assets } from "./assets/assets";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  const { user, loadingUser } = useAppContext();

  if (pathname === "/loading" || loadingUser) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />
      {!isMenuOpen && user && (
        <img
          src={assets.menu_icon}
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          alt="menu"
        />
      )}

      {user ? (
        <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />

            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
              <Route path="/loading" element={<Loading />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-linear-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;