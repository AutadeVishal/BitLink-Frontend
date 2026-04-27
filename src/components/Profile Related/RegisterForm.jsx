import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import SkillsSelector from '../common/SkillsSelector';
import { BASE_URL, EMAIL_REGEX } from '../../constants/Constants';
import { normalizeSkillList } from '../../utils/skillHelpers';

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
        
        if (!EMAIL_REGEX.test(email)) {
            return "Please enter a valid email address";
        }

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
                skills: normalizeSkillList(skills, 5),
                age: parseInt(formData.age, 10),
                gender: formData.gender.toLowerCase()
            };
            const res = await axios.post(`${BASE_URL}/auth/signup`, payload, { 
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
                <div className="alert-error text-sm">
                    {error}
                </div>
            )}

            {/* Step 1: Identity */}
            <div>
                <p className="text-xs uppercase tracking-widest text-red-300/70 mb-2 font-semibold">Identity</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-red-100 mb-1">First Name</label>
                        <input 
                            className="input-dark" 
                            value={formData.firstName} 
                            onChange={e => handleChange('firstName', e.target.value)} 
                            placeholder="First Name" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-red-100 mb-1">Last Name</label>
                        <input 
                            className="input-dark" 
                            value={formData.lastName} 
                            onChange={e => handleChange('lastName', e.target.value)} 
                            placeholder="Last Name" 
                        />
                    </div>
                </div>
            </div>

            {/* Step 2: Credentials */}
            <div>
                <p className="text-xs uppercase tracking-widest text-red-300/70 mb-2 font-semibold">Credentials</p>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-semibold text-red-100 mb-1">Email</label>
                        <input 
                            type="email" 
                            className="input-dark" 
                            value={formData.email} 
                            onChange={e => handleChange('email', e.target.value)} 
                            placeholder="you@example.com" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-red-100 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="input-dark" 
                            value={formData.password} 
                            onChange={e => handleChange('password', e.target.value)} 
                            placeholder="Password" 
                        />
                    </div>
                </div>
            </div>

            {/* Step 3: Details */}
            <div>
                <p className="text-xs uppercase tracking-widest text-red-300/70 mb-2 font-semibold">Details</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-red-100 mb-1">Gender</label>
                        <select 
                            className="select-dark" 
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
                        <label className="block text-sm font-semibold text-red-100 mb-1">Age</label>
                        <input 
                            type="number"
                            className="input-dark" 
                            value={formData.age} 
                            onChange={e => handleChange('age', e.target.value)} 
                            placeholder="Age" 
                        />
                    </div>
                </div>
            </div>

            {/* Step 4: Skills */}
            <div>
                <p className="text-xs uppercase tracking-widest text-red-300/70 mb-2 font-semibold">Skills</p>
                <SkillsSelector 
                    selectedSkills={skills} 
                    onChange={setSkills} 
                    label=""
                    showLevelEditor={true}
                    placeholder="Search and add skills (optional)"
                />
            </div>

            <button 
                disabled={loading} 
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                onClick={handleRegister}
            >
                {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {loading ? "Creating Account..." : "Create Account"}
            </button>
        </div>
    );
};
export default RegisterForm;