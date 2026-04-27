import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl page-enter relative z-10">
        <div className="text-center mb-6">
          <h1 className="brand-word text-6xl text-red-100 glow-pulse" style={{ display: 'inline-block' }}>BitLink</h1>
          <p className="subtitle mt-2">Build your network with precision matching and real conversations.</p>
        </div>
        
        <div className="glass-panel p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex bg-black/30 rounded-full p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  isLoginMode
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25'
                    : 'text-red-200 hover:text-red-100'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  !isLoginMode
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25'
                    : 'text-red-200 hover:text-red-100'
                }`}
              >
                Register
              </button>
            </div>
          </div>
          
          {isLoginMode ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default Login;
