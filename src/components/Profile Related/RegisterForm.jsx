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
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
        age: ''
    });
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const { firstName, lastName, email, password, gender, age } = formData;
        if (!firstName || !lastName || !email || !password || !gender || !age) 
            return "All fields are required";
        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 18) return "Age must be 18 or older";
        if (!['male', 'female', 'other'].includes(gender.toLowerCase())) 
            return "Select a valid gender";
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
                ...formData,
                skills,
                age: parseInt(formData.age, 10),
                gender: formData.gender.toLowerCase()
            };
            const res = await axios.post(`${VITE_BASE_URL}/auth/signup`, payload, { 
                withCredentials: true 
            });
            dispatch(setUser(res.data.data));
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.firstName} 
                        onChange={e => handleChange('firstName', e.target.value)} 
                        placeholder="First Name" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.lastName} 
                        onChange={e => handleChange('lastName', e.target.value)} 
                        placeholder="Last Name" 
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={formData.email} 
                    onChange={e => handleChange('email', e.target.value)} 
                    placeholder="you@example.com" 
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                    type="password" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={formData.password} 
                    onChange={e => handleChange('password', e.target.value)} 
                    placeholder="Password" 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.gender} 
                        onChange={e => handleChange('gender', e.target.value)}
                    >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input 
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.age} 
                        onChange={e => handleChange('age', e.target.value)} 
                        placeholder="Age" 
                    />
                </div>
            </div>

            <SkillsSelector 
                selectedSkills={skills} 
                onChange={setSkills} 
                label="Skills (Optional)" 
            />

            <button 
                disabled={loading} 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition" 
                onClick={handleRegister}
            >
                {loading ? "Creating Account..." : "Create Account"}
            </button>
        </div>
    );
};
export default RegisterForm;