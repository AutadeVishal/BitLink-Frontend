import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../../utils/userSlice'
import { useNavigate } from 'react-router-dom'
const VITE_BASE_URL =import.meta.env.VITE_BASE_URL;

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
        className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 outline-none"
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

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [gender, setGender] = useState('')
    const [age, setAge] = useState('')
    const [skills, setSkills] = useState([])
    const [error, setError] = useState('')
    const labelClass = "text-sm text-gray-300";
    const inputClass = "w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 outline-none";

    const handleRegister = async () => {
        try {
            const res = await axios.post(`${VITE_BASE_URL}/auth/signup`, { email, password,skills,age,gender,firstName,lastName }, {
                withCredentials: true, // for cookies
            });
            const user = res.data.data;
            console.log(res.data.data)
            dispatch(setUser(user));
            return navigate('/profile');
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
                <p className="text-center text-2xl font-semibold mb-4 text-white">Register</p>

                 <div className="space-y-1 mt-3">
                    <label className={labelClass}>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className={inputClass}
                        placeholder="First Name"
                    />
                </div>

                <div className="space-y-1 mt-3">
                    <label className={labelClass}>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className={inputClass}
                        placeholder="Last Name"
                    />
                </div>

                <div className="space-y-1">
                    <label className={labelClass}>email</label>
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

                <div className="space-y-1 mt-3">
                    <label className={labelClass}>Skills</label>
                    <SkillsSelector 
                        selectedSkills={skills}
                        onSkillsChange={setSkills}
                    />
                </div>

                <div className="space-y-1 mt-3">
                    <label className={labelClass}>Gender</label>
                    <input
                        type="text"
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        className={inputClass}
                        placeholder="male / female "
                    />
                </div>

                <div className="space-y-1 mt-3">
                    <label className={labelClass}>Age</label>
                    <input
                        type="text"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        className={inputClass}
                        placeholder="Your Age "
                    />
                </div>

                <button
                    className="w-full mt-5 rounded bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 transition"
                    onClick={handleRegister}
                >
                    Register
                </button>

            </fieldset>
        </div>
    )
}
export default RegisterForm;
