import { useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext";

/**
 * Authentication mode type
 * - login: existing user login
 * - register: new user signup
 */
type AuthState = "login" | "register";

/**
 * Login / Register Page
 * ---------------------
 * Handles user authentication:
 * - Login with email & password
 * - Register with name, email & password
 * - Stores JWT token on success
 */
const Login = () => {
    // Current auth mode (login or register)
    const [state, setState] = useState<AuthState>("login");

    // Form fields
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Axios instance & token setter from global context
    const { axios, setToken } = useAppContext();

    /**
     * Handles login / registration form submission
     */
    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        // Select API endpoint based on auth mode
        const url =
            state === "login"
                ? "/api/user/login"
                : "/api/user/register";

        try {
            const { data } = await axios.post(url, {
                name,
                email,
                password,
            });

            if (data.success) {
                // Save token in context and localStorage
                setToken(data.token);
                localStorage.setItem("token", data.token);
            } else {
                toast.error(data.message || "Authentication failed");
            }
        } catch (error: unknown) {
            // Handle unexpected errors safely
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
        >
            {/* Header */}
            <p className="text-2xl font-medium m-auto">
                <span className="text-purple-700">User</span>{" "}
                {state === "login" ? "Login" : "Sign Up"}
            </p>

            {/* Name field (only for registration) */}
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
                        required
                    />
                </div>
            )}

            {/* Email field */}
            <div className="w-full">
                <p>Email</p>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="type here"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
                    required
                />
            </div>

            {/* Password field */}
            <div className="w-full">
                <p>Password</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="type here"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
                    required
                />
            </div>

            {/* Toggle between login & register */}
            {state === "register" ? (
                <p>
                    Already have an account?{" "}
                    <span
                        onClick={() => setState("login")}
                        className="text-purple-700 cursor-pointer"
                    >
                        click here
                    </span>
                </p>
            ) : (
                <p>
                    Create an account?{" "}
                    <span
                        onClick={() => setState("register")}
                        className="text-purple-700 cursor-pointer"
                    >
                        click here
                    </span>
                </p>
            )}

            {/* Submit button */}
            <button
                type="submit"
                className="bg-purple-700 hover:bg-purple-800 transition-all text-white w-full py-2 rounded-md cursor-pointer"
            >
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    );
};

export default Login;