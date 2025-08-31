import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => setIsLoginMode((prev) => !prev);

  return (
    <section className="max-w-md mx-auto mt-12 px-4 bg-gray-800 rounded border border-gray-700 text-white">
      <p className="mb-6 text-center text-sm text-gray-300">
        {isLoginMode ? "New here? " : "Already a user? "}
        <button
          onClick={toggleMode}
          className="text-blue-400 hover:underline font-medium"
        >
          {isLoginMode ? "Register" : "Login"}
        </button>
      </p>
      {isLoginMode ? <LoginForm /> : <RegisterForm />}
    </section>
  );
};

export default Login;
