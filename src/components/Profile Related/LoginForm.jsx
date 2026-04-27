import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, validateEmail } from '../../constants/Constants';
const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)



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
            setLoading(true)
            setError('')
            const res = await axios.post(`${BASE_URL}/auth/login`, { email, password }, {
                withCredentials: true,
            });
            dispatch(setUser(res.data.data));
            navigate('/');
        }
        catch (err) {
            setError(err?.response?.data?.message || err?.response?.data || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) handleLogin();
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="alert-error text-sm">
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-red-100 mb-1">Email</label>
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
                <label className="block text-sm font-semibold text-red-100 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </div>
    )
}
export default LoginForm;