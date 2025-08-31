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
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)
            setError('')
            const res = await axios.post(`${VITE_BASE_URL}/auth/login`, { email, password }, {
                withCredentials: true,
            });
            dispatch(setUser(res.data.data));
            navigate('/');
        }
        catch (err) {
            setError(err?.response?.data || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password"
                />
            </div>

            <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                onClick={handleLogin}
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </div>
    )
}
export default LoginForm;