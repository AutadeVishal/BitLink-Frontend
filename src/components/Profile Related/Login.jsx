import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">BitLink</h1>
          <p className="text-gray-600 mt-2">Connect with professionals</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`px-4 py-2 mr-2 rounded-md ${
                isLoginMode ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`px-4 py-2 rounded-md ${
                !isLoginMode ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Register
            </button>
          </div>
          
          {isLoginMode ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default Login;
