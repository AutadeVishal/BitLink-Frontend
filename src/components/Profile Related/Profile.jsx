import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../constants/Constants';
import { setUser } from '../../utils/userSlice';
import FeedCard from '../FeedCard';
import SkillsSelector from '../common/SkillsSelector';
import { normalizeSkillList } from '../../utils/skillHelpers';
import { PROJECT_TYPES, getProjectTypeLabel } from '../../constants/projectTypes';

const PROJECT_TYPE_COLORS = {
  fintech: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  healthtech: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  edtech: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  ai: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
  gaming: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  default: 'from-red-500/10 to-orange-500/10 border-red-500/20'
};

const getTypeColor = (type) => PROJECT_TYPE_COLORS[type] || PROJECT_TYPE_COLORS.default;

const ProfileSkeleton = () => (
  <div className="page-shell">
    <div className="mb-6 space-y-2">
      <div className="skeleton h-10 w-48" />
      <div className="skeleton h-4 w-72" />
    </div>
    <div className="grid xl:grid-cols-3 gap-6">
      <div className="glass-panel p-6 xl:col-span-2 space-y-4">
        <div className="skeleton h-6 w-32" />
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-11 w-full" />)}
      </div>
      <div className="space-y-6">
        <div className="glass-panel p-5 space-y-3">
          <div className="skeleton h-6 w-28" />
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-11 w-full" />)}
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const userInfo = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    about: '',
    photoURL: ''
  });
  const [skillsState, setSkillsState] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [projectError, setProjectError] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    type: PROJECT_TYPES[0]
  });
  const [projectSkills, setProjectSkills] = useState([]);

  const previewUser = useMemo(() => {
    if (!userInfo) {
      return null;
    }

    return {
      ...userInfo,
      ...formData,
      skills: skillsState
    };
  }, [userInfo, formData, skillsState]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fetchProjects = useCallback(async () => {
    if (!userInfo) {
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/project/mine`, {
        withCredentials: true
      });
      setProjects(response.data?.data || []);
      setProjectError('');
    } catch (err) {
      setProjectError(err.response?.data?.message || 'Unable to fetch projects');
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    setFormData({
      firstName: userInfo.firstName || '',
      lastName: userInfo.lastName || '',
      age: userInfo.age || '',
      gender: userInfo.gender || '',
      about: userInfo.about || '',
      photoURL: userInfo.photoURL || ''
    });
    setSkillsState(normalizeSkillList(userInfo.skills || [], 5));
    fetchProjects();
  }, [fetchProjects, userInfo]);

  const updateData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        ...formData,
        skills: normalizeSkillList(skillsState, 5),
        age: Number(formData.age),
        gender: String(formData.gender || '').toLowerCase()
      };

      if (isChangingPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
        payload.password = newPassword;
      }

      const res = await axios.patch(`${BASE_URL}/profile/edit`, payload, {
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

  const createProject = async () => {
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      setProjectError('Project title and description are required');
      return;
    }
    if (projectSkills.length === 0) {
      setProjectError('Select at least one skill used in this project');
      return;
    }

    try {
      setProjectLoading(true);
      setProjectError('');

      const response = await axios.post(
        `${BASE_URL}/project/create`,
        {
          title: projectForm.title,
          description: projectForm.description,
          type: projectForm.type,
          skillsUsed: projectSkills
        },
        { withCredentials: true }
      );

      const createdProject = response.data?.data?.project;
      const updatedUser = response.data?.data?.user;

      if (createdProject) {
        setProjects((previous) => [createdProject, ...previous]);
      }

      if (updatedUser) {
        dispatch(setUser(updatedUser));
        setSkillsState(normalizeSkillList(updatedUser.skills || [], 5));
      }

      setProjectForm({
        title: '',
        description: '',
        type: PROJECT_TYPES[0]
      });
      setProjectSkills([]);
    } catch (err) {
      setProjectError(err.response?.data?.message || 'Unable to create project');
    } finally {
      setProjectLoading(false);
    }
  };

  if (!userInfo) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="page-shell page-enter">
      <div className="mb-6">
        <h1 className="section-title">Profile Studio</h1>
        <p className="subtitle">Tune your profile and keep your portfolio updated in one place.</p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="glass-panel p-6 xl:col-span-2">
          <h2 className="text-xl font-semibold text-red-50 mb-5">Edit Profile</h2>

          {error && (
            <div className="alert-error text-sm mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-red-100 mb-1">Email</label>
              <input
                value={userInfo.email || ''}
                disabled
                className="input-dark opacity-70"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-red-100 mb-1">First Name</label>
                <input
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-100 mb-1">Last Name</label>
                <input
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="input-dark"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-red-100 mb-1">Age</label>
                <input
                  type="number"
                  min="18"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-100 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="select-dark"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-red-100 mb-1">Photo URL</label>
              <input
                value={formData.photoURL}
                onChange={(e) => handleChange('photoURL', e.target.value)}
                className="input-dark"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-red-100 mb-1">About</label>
              <textarea
                value={formData.about}
                onChange={(e) => handleChange('about', e.target.value)}
                rows="3"
                className="textarea-dark"
                placeholder="A short bio..."
              />
            </div>

            <SkillsSelector
              selectedSkills={skillsState}
              onChange={setSkillsState}
              label="Skills"
              showLevelEditor={true}
            />

            <div className="border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="text-red-200 hover:text-red-100 text-sm font-semibold transition-colors"
              >
                {isChangingPassword ? 'Cancel Password Change' : 'Change Password'}
              </button>

              {isChangingPassword && (
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-dark"
                    placeholder="New password"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-dark"
                    placeholder="Confirm password"
                  />
                </div>
              )}
            </div>

            <button
              onClick={updateData}
              disabled={loading}
              className="w-full btn-primary disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5">
            <h2 className="text-lg font-semibold text-red-50 mb-3">Add Project</h2>

            {projectError && <div className="alert-error text-sm mb-3">{projectError}</div>}

            <div className="space-y-3">
              <input
                className="input-dark"
                value={projectForm.title}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Project title"
              />

              <textarea
                className="textarea-dark"
                rows="3"
                value={projectForm.description}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="What did you build?"
              />

              <select
                className="select-dark"
                value={projectForm.type}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, type: event.target.value }))}
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {getProjectTypeLabel(type)}
                  </option>
                ))}
              </select>

              <SkillsSelector
                selectedSkills={projectSkills}
                onChange={setProjectSkills}
                label="Skills used in this project"
                showLevelEditor={false}
              />

              <button
                type="button"
                onClick={createProject}
                disabled={projectLoading}
                className="w-full btn-primary disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {projectLoading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {projectLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>

          <div className="glass-panel p-5">
            <h2 className="text-lg font-semibold text-red-50 mb-3">My Projects</h2>
            {projectsLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="glass-subpanel p-3 space-y-2">
                    <div className="skeleton h-5 w-36" />
                    <div className="skeleton h-3 w-20" />
                    <div className="skeleton h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <p className="subtitle">No projects yet. Add your first one.</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className={`glass-subpanel p-3 border bg-gradient-to-br ${getTypeColor(project.type)} transition-all hover:scale-[1.01]`}
                  >
                    <h3 className="font-semibold text-red-50">{project.title}</h3>
                    <p className="text-xs text-red-300 mb-2">{getProjectTypeLabel(project.type)}</p>
                    <p className="text-sm text-red-100/80 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {(project.skillsUsed || []).map((skill) => (
                        <span key={`${project._id}-${skill}`} className="badge badge-muted">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="glass-panel p-5">
            <h2 className="text-lg font-semibold text-red-50 mb-4">Preview</h2>
            {previewUser && <FeedCard userInfo={previewUser} showActions={false} />}
          </div>
        </div>
      </div>
    </div>
    );
};

export default Profile;
