import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

import "./assets/prism.css";

import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import Loading from "./pages/Loading";

import { assets } from "./assets/assets";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  if (pathname === "/loading") {
    return <Loading />;
  }

  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          alt="menu"
        />
      )}

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
    </>
  );
};

export default App;