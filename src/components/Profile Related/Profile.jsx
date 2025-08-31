import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
import { setUser } from '../../utils/userSlice';
import FeedCard from '../FeedCard';
import SkillsSelector from '../common/SkillsSelector';

const Profile = () => {
  const userInfo = useSelector(state => state.user);
  const { firstName, lastName, skills, about, photoURL, email } = userInfo || {};
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    about: about || '',
    photoURL: photoURL || ''
  });
  const [skillsState, setSkillsState] = useState(skills || []);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        ...formData,
        skills: skillsState
      };

      if (isChangingPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
        payload.password = newPassword;
      }

      const res = await axios.patch(`${VITE_BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
      });
      
      dispatch(setUser(res.data.data));
      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your professional profile</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                value={email || ''} 
                disabled 
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
              <input
                value={formData.photoURL}
                onChange={(e) => handleChange('photoURL', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
              <textarea
                value={formData.about}
                onChange={(e) => handleChange('about', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A short bio..."
              />
            </div>

            <SkillsSelector 
              selectedSkills={skillsState}
              onChange={setSkillsState}
              label="Skills"
            />

            {/* Password Change Section */}
            <div className="border-t pt-4">
              <button 
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {isChangingPassword ? 'Cancel Password Change' : 'Change Password'}
              </button>

              {isChangingPassword && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={updateData}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
          <FeedCard userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
     