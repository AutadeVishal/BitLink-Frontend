import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl page-enter relative z-10">
        <div className="text-center mb-6">
          <h1
            className="brand-word text-6xl text-red-100 glow-pulse"
            style={{ display: "inline-block" }}
          >
            BitLink
          </h1>
          <p className="subtitle mt-2">
            Build your network with precision matching and real conversations.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8">
          {/* Toggle Buttons */}
          <div className="flex justify-center mb-8">
            <div className="relative inline-flex bg-black/30 rounded-full p-1 border border-white/10">

              {/* Sliding Background */}
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/25"
                animate={{
                  x: isLoginMode ? 0 : "100%",
                }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 28,
                }}
              />

              <button
                onClick={() => setIsLoginMode(true)}
                className={`relative z-10 px-6 py-2.5 w-32 font-semibold transition-colors duration-300 ${
                  isLoginMode ? "text-white" : "text-red-200"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setIsLoginMode(false)}
                className={`relative z-10 px-6 py-2.5 w-32 font-semibold transition-colors duration-300 ${
                  !isLoginMode ? "text-white" : "text-red-200"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Animated Forms */}
          <AnimatePresence mode="wait">
            {isLoginMode ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
              >
                <RegisterForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;