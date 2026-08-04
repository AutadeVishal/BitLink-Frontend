import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BASE_URL, validateEmail } from "../../constants/Constants";

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Password is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await axios.post(
                `${BASE_URL}/auth/login`,
                { email, password },
                {
                    withCredentials: true,
                }
            );

            dispatch(setUser(res.data.data));
            navigate("/");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data ||
                    "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !loading) handleLogin();
    };

    return (
        <div className="space-y-4">
            {/* Animated Error */}
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        key={error}
                        initial={{
                            opacity: 0,
                            scale: 0.75,
                            y: -10,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            y: -8,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 22,
                        }}
                        className="rounded-xl bg-red-500/15 border border-red-400/40 px-4 py-3 text-sm text-red-200 backdrop-blur-md shadow-lg"
                    >
                        {typeof error === "string"
                            ? error
                            : JSON.stringify(error)}
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <label className="block text-sm font-semibold text-red-100 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input-dark"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-red-100 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input-dark"
                    placeholder="Password"
                />
            </div>

            <button
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleLogin}
            >
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}

                {loading ? "Signing in..." : "Sign In"}
            </button>
        </div>
    );
};

export default LoginForm;