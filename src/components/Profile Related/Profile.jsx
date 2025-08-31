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

  // editable fields
  const [emailState] = useState(email || ''); // read-only (backend disallows edit)
  const [firstNameState, setFirstNameState] = useState(firstName || '');
  const [lastNameState, setLastNameState] = useState(lastName || '');
  const [skillsState, setSkillsState] = useState(skills || []);
  const [aboutState, setAboutState] = useState(about || '');
  const [photoURLState, setPhotoURLState] = useState(photoURL || '');

  // Password state 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async () => {
    try {
      const payload = {
        firstName: firstNameState,
        lastName: lastNameState,
        skills: skillsState,
        about: aboutState,
        photoURL: photoURLState
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
      setError(null);
      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setSkillsState(res.data.data?.skills || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Error updating profile");
      console.error("Error in Updating User", err);
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-white bg-gray-900">
        <div className="bg-gray-800 rounded-xl px-6 py-4 border border-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-10 justify-center text-white px-4 bg-gray-900">
      <div className="flex flex-row gap-10 justify-center mt-10">
        <fieldset className="flex flex-col bg-gray-800 rounded-lg w-xs p-5 border border-gray-700">
          {error && <p className="text-center font-bold text-red-400 mb-2">{error}</p>}
          <p className="text-center font-bold text-2xl mb-4 text-white">Edit Profile</p>

          <label className="text-sm text-gray-300">Email</label>
          <input value={emailState} disabled className="rounded px-4 py-2 bg-gray-700 border border-gray-600 text-gray-400" />

          <div className="mt-4">
            <button 
              className="px-3 py-1.5 text-sm rounded border border-gray-600 text-white hover:bg-gray-700"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              {isChangingPassword ? 'Cancel Password Change' : 'Change Password'}
            </button>

            {isChangingPassword && (
              <div className="mt-2 space-y-2">
                <label className="text-sm text-gray-300">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="rounded px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400" 
                  placeholder="Enter new password"
                />

                <label className="text-sm text-gray-300">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="rounded px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400" 
                  placeholder="Confirm new password"
                />
              </div>
            )}
          </div>

          <label className="mt-4 text-sm text-gray-300">First Name</label>
          <input
            type="text"
            value={firstNameState}
            onChange={(e) => setFirstNameState(e.target.value)}
            className="rounded px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            placeholder="First name"
          />

          <label className="text-sm text-gray-300">Last Name</label>
          <input
            type="text"
            value={lastNameState}
            onChange={(e) => setLastNameState(e.target.value)}
            className="rounded px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            placeholder="Last name"
          />

          <SkillsSelector 
            selectedSkills={skillsState}
            onChange={setSkillsState}
            label="Skills"
            className="mt-4"
          />

          <label className="text-sm text-gray-300">Photo URL</label>
          <input
            type="text"
            value={photoURLState}
            onChange={(e) => setPhotoURLState(e.target.value)}
            className="rounded px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            placeholder="https://..."
          />

          <label className="text-sm text-gray-300">About</label>
          <textarea
            value={aboutState}
            onChange={(e) => setAboutState(e.target.value)}
            className="rounded px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            rows="3"
            placeholder="A short bio..."
          ></textarea>

          <button 
            className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={updateData}
          >
            Update Profile
          </button>
        </fieldset>
        <div>
          <p className="text-center font-bold text-2xl mb-4 text-white">Profile Preview</p>
          <FeedCard userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
     