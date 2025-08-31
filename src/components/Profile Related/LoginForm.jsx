import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../../utils/userSlice'
import { useNavigate } from 'react-router-dom'
const  VITE_BASE_URL =import.meta.env.VITE_BASE_URL;
const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const labelClass = "text-sm text-gray-300";
    const inputClass = "w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 outline-none";

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${VITE_BASE_URL}/auth/login`, { email, password }, {
                withCredentials: true, // for cookies
            });
            const user = res.data.data;
            dispatch(setUser(user));
            return navigate('/');
        }
        catch (err) {
            console.log("Error in Login")
            setError(err?.response?.data)
        }
    }
    return (
     <div className="min-h-[70vh] grid place-items-center px-4 text-white bg-gray-900">
        <fieldset className="w-full max-w-sm bg-gray-800 rounded-lg p-6 border border-gray-700">
            {error ? (
                <p className="text-center font-semibold text-red-400 mb-2">
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                </p>
            ) : null}
            <p className="text-center text-2xl font-semibold mb-4 text-white">Login</p>

            <div className="space-y-1">
                <label className={labelClass}>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                />
            </div>

            <div className="space-y-1 mt-3">
                <label className={labelClass}>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="Password"
                />
            </div>
            <button
                className="w-full mt-5 rounded bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 transition"
                onClick={handleLogin}
            >
                Login
            </button>

        </fieldset>
    </div>
    )
}
export default LoginForm;