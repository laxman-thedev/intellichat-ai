import { useState } from "react";
import type { FormEvent } from "react";

type AuthState = "login" | "register";

const Login = () => {
    const [state, setState] = useState<AuthState>("login");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // auth logic later
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
        >
            <p className="text-2xl font-medium m-auto">
                <span className="text-purple-700">User</span>{" "}
                {state === "login" ? "Login" : "Sign Up"}
            </p>

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