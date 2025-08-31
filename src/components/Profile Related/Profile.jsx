import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
const VITE_BASE_URL=import.meta.env.VITE_BASE_URL;
import { setUser } from '../../utils/userSlice';
import FeedCard from '../FeedCard';

const TECHNICAL_SKILLS = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift','Flask','Django',
  'Kotlin', 'TypeScript', 'Dart', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell Scripting', 'PowerShell', 'Bash',
  'React.js', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Next.js', 'Nuxt.js', 'Svelte', 'Ember.js', 'Backbone.js',
  'HTML5', 'CSS3', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Chakra UI', 'Ant Design', 'Semantic UI',
  'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Oracle', 'SQL Server', 'Redis', 'Cassandra', 'DynamoDB', 'Firebase',
  'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Travis CI', 'CircleCI', 'Ansible', 'Terraform', 'Vagrant',
  'AWS', 'Azure', 'Google Cloud', 'Heroku', 'DigitalOcean', 'Netlify', 'Vercel', 'CloudFlare', 'Firebase Hosting', 'Railway',
  'Git', 'SVN', 'Mercurial', 'GitHub', 'GitLab', 'Bitbucket', 'SourceForge', 'Azure DevOps', 'Jira', 'Confluence',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'OpenCV', 'NLP', 'Computer Vision', 'Data Science',
  'Cybersecurity', 'Penetration Testing', 'Ethical Hacking', 'Kali Linux', 'Metasploit', 'Burp Suite', 'Wireshark', 'Nmap', 'OWASP', 'Cryptography',
  'Linux', 'Ubuntu', 'CentOS', 'Red Hat', 'Debian', 'Windows Server', 'macOS', 'Unix', 'FreeBSD', 'Arch Linux',
  'Apache', 'Nginx', 'IIS', 'Tomcat', 'JBoss', 'WebLogic', 'Load Balancing', 'CDN', 'SSL/TLS', 'DNS',
  'Microservices', 'REST API', 'GraphQL', 'SOAP', 'gRPC', 'WebSockets', 'OAuth', 'JWT', 'API Gateway', 'Swagger',
  'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'Test-Driven Development', 'Unit Testing', 'Integration Testing', 'E2E Testing', 'Performance Testing'
];

const SkillsSelector = ({ selectedSkills, onSkillsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredSkills = TECHNICAL_SKILLS.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !selectedSkills.includes(skill)
  );

  const addSkill = (skill) => {
    onSkillsChange([...selectedSkills, skill]);
    setSearchTerm('');
  };

  const removeSkill = (skillToRemove) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="relative">
      <label className="text-sm text-gray-300">Skills</label>
      
      {/* Selected Skills Display */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-700 rounded border border-gray-600">
          {selectedSkills.map(skill => (
            <span key={skill} className="bg-blue-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
              {skill}
              <button 
                onClick={() => removeSkill(skill)}
                className="text-blue-200 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full rounded px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
        placeholder="Search and select skills..."
      />

      {/* Dropdown */}
      {isOpen && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded max-h-48 overflow-y-auto">
          {filteredSkills.length > 0 ? (
            filteredSkills.slice(0, 10).map(skill => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white"
              >
                {skill}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400">No skills found</div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const Profile = () => {
  const userInfo = useSelector(state => state.user);
  const { firstName, lastName, skills, about, photoURL, email } = userInfo || {};
  const dispatch = useDispatch();

  // editable fields
  const [emailState, setEmailState] = useState(email || '');
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
      const updatedUserInfoPayload = {
        firstName: firstNameState,
        lastName: lastNameState,
        skills: skillsState,
        about: aboutState,
        photoURL: photoURLState,
        email: emailState,
      };

      if (isChangingPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
        updatedUserInfoPayload.password = newPassword;
      }

      const res = await axios.patch(`${VITE_BASE_URL}/profile/edit`, updatedUserInfoPayload, {
        withCredentials: true,
      });
      
      dispatch(setUser(res.data.data));
      setError(null);
      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setSkillsState(res.data.data?.skills || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
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
          <input
            type="email"
            value={emailState}
            onChange={(e) => setEmailState(e.target.value)}
            className="rounded px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            placeholder="you@example.com"
          />

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
            onSkillsChange={setSkillsState}
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
