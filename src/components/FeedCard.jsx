import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL, DEFAULT_AVATAR } from '../constants/Constants';
import { removeFeedUser } from "../utils/feedSlice"; // renamed
import { normalizeSkillList } from "../utils/skillHelpers";
import { getProjectTypeLabel } from "../constants/projectTypes";

const FeedCard = ({ userInfo, showActions = true }) => {
  const dispatch = useDispatch();
  const { firstName, lastName, skills, about, photoURL, age, gender, projectTypes } = userInfo;

  const normalizedSkills = normalizeSkillList(skills || []);

  const handleConnection = async (status, email) => {
    try {
      await axios.post(
        `${BASE_URL}/connection/request/send/${status}/${email}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeedUser(userInfo._id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="glass-panel hoverable p-5 w-full">
      <div className="text-center mb-4">
        <div className="relative inline-block avatar-glow">
          <img
            className="w-20 h-20 rounded-full object-cover ring-2 ring-red-500/40"
            src={photoURL || DEFAULT_AVATAR}
            alt={`${firstName} ${lastName}`}
          />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-red-50">
          {firstName} {lastName}
        </h3>

        <div className="flex justify-center gap-2">
          {age && (
            <span className="badge badge-muted">
              {age} years
            </span>
          )}
          {gender && (
            <span className="badge badge-muted capitalize">
              {gender}
            </span>
          )}
        </div>

        {about && (
          <p className="text-sm text-red-100/80 italic px-2">{about}</p>
        )}

        {normalizedSkills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-3">
            {normalizedSkills.slice(0, 6).map((skill) => (
              <span
                key={skill.name}
                className="badge badge-primary"
              >
                {skill.name} L{skill.level}
              </span>
            ))}
            {normalizedSkills.length > 6 && (
              <span className="badge badge-muted">
                +{normalizedSkills.length - 6} more
              </span>
            )}
          </div>
        )}

        {Array.isArray(projectTypes) && projectTypes.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {projectTypes.slice(0, 4).map((type) => (
              <span key={type} className="badge badge-muted">
                {getProjectTypeLabel(type)}
              </span>
            ))}
          </div>
        )}
      </div>

      {showActions && userInfo.email && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleConnection("ignored", userInfo.email)}
            className="btn-secondary flex-1"
          >
            Pass
          </button>
          <button
            onClick={() => handleConnection("interested", userInfo.email)}
            className="btn-primary flex-1"
          >
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedCard;
