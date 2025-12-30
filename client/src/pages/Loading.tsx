import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

/**
 * Loading Page
 * -------------
 * Used as an intermediate screen after Stripe payment.
 * - Waits briefly to allow Stripe webhook processing
 * - Refreshes user data (credits update)
 * - Shows success / error toast
 * - Redirects user back to home
 */
const Loading = () => {
  // React Router navigation
  const navigate = useNavigate();

  // Fetch updated user data from global context
  const { fetchUser } = useAppContext();

  useEffect(() => {
    // Delay added to ensure Stripe webhook finishes processing
    const timeout = setTimeout(async () => {
      try {
        // Refresh user data (credits should be updated by webhook)
        await fetchUser();

        // Show success message after confirmed refresh
        toast.success("Payment successful 🎉 Credits added!");
      } catch {
        // Fallback if refresh fails but payment may still be processed
        toast.error("Payment processed, but failed to refresh data");
      } finally {
        // Redirect user to home page
        navigate("/");
      }
    }, 2000); // Reduced delay for better UX

    // Cleanup timeout on unmount
    return () => clearTimeout(timeout);
  }, [fetchUser, navigate]);

  return (
    <div className="bg-linear-to-b from-[#531B81] to-[#29184B] backdrop-opacity-60 flex items-center justify-center h-screen w-screen text-white text-2xl">
      {/* Spinner */}
      <div className="w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin" />
    </div>
  );
};

export default Loading;