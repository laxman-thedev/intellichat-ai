import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Loading = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAppContext();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        await fetchUser();
        toast.success("Payment successful 🎉 Credits added!");
      } catch {
        toast.error("Payment processed, but failed to refresh data");
      } finally {
        navigate("/");
      }
    }, 2000); // ⬅ reduce from 8000ms (UX improvement)

    return () => clearTimeout(timeout);
  }, [fetchUser, navigate]);

  return (
    <div className="bg-linear-to-b from-[#531B81] to-[#29184B] backdrop-opacity-60 flex items-center justify-center h-screen w-screen text-white text-2xl">
      <div className="w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin" />
    </div>
  );
};

export default Loading;