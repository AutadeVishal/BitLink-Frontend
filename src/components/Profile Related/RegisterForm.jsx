import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import SkillsSelector from '../common/SkillsSelector';
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const labelClass = "text-sm text-gray-300";
    const inputClass = "w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 outline-none";

    const validate = () => {
        if (!firstName || !lastName || !email || !password || !gender || !age) return "All fields are required";
        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 18) return "Age must be a number >= 18";
        if (!['male', 'female', 'other'].includes(gender.toLowerCase())) return "Select a valid gender";
        if (password.length < 8) return "Password must be at least 8 characters";
        return null;
    };

    const handleRegister = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            setLoading(true);
            setError('');
            const payload = {
                email,
                password,
                skills,
                age: parseInt(age, 10),
                gender: gender.toLowerCase(),
                firstName,
                lastName
            };
            const res = await axios.post(`${VITE_BASE_URL}/auth/signup`, payload, { withCredentials: true });
            dispatch(setUser(res.data.data));
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] grid place-items-center px-4 text-white bg-gray-900">
            <fieldset className="w-full max-w-sm bg-gray-800 rounded-lg p-6 border border-gray-700">
                {error && <p className="text-center font-semibold text-red-400 mb-2">{error}</p>}
                <p className="text-center text-2xl font-semibold mb-4 text-white">Register</p>

                <div className="space-y-1 mt-3">
                    <label className={labelClass}>First Name</label>
                    <input className={inputClass} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
                </div>
                <div className="space-y-1 mt-3">
                    <label className={labelClass}>Last Name</label>
                    <input className={inputClass} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
                </div>
                <div className="space-y-1">
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-1 mt-3">
                    <label className={labelClass}>Password</label>
                    <input type="password" className={inputClass} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <div className="space-y-1 mt-3">
                    <SkillsSelector selectedSkills={skills} onChange={setSkills} label="Skills" />
                </div>
                <div className="space-y-1 mt-3">
                    <label className={labelClass}>Gender</label>
                    <select className={inputClass} value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="space-y-1 mt-3">
                    <label className={labelClass}>Age</label>
                    <input className={inputClass} value={age} onChange={e => setAge(e.target.value)} placeholder="Your Age" />
                </div>
                <button disabled={loading} className="w-full mt-5 rounded bg-blue-600 disabled:opacity-60 text-white hover:bg-blue-700 px-4 py-2 transition" onClick={handleRegister}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </fieldset>
        </div>
    );
};
export default RegisterForm;