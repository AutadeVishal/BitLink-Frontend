import React from "react";
import { Link } from "react-router-dom";
import { normalizeSkillList } from "../../utils/skillHelpers";
import { DEFAULT_AVATAR } from '../../constants/Constants';

const ConnectionCard = (props) => {
  const { firstName, lastName, skills, about, photoURL, _id, age, gender, unreadCount = 0 } = props;
  const normalizedSkills = normalizeSkillList(skills || []);

  return (
    <div className="glass-panel hoverable p-5">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative avatar-glow">
          <img
            src={photoURL || DEFAULT_AVATAR}
            alt={`${firstName} ${lastName}`}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-red-500/30"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 badge-pulse border-2 border-black/80">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${unreadCount > 0 ? 'text-white' : 'text-red-50'}`}>
            {firstName} {lastName}
          </h3>
          {about && <p className="text-sm text-red-200/80 mt-1 line-clamp-2">{about}</p>}
        </div>
      </div>

      <div className="flex gap-2 mb-3">
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

      {normalizedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {normalizedSkills.slice(0, 4).map((skill) => (
            <span
              key={skill.name}
              className="badge badge-primary"
            >
              {skill.name} L{skill.level}
            </span>
          ))}
          {normalizedSkills.length > 4 && (
            <span className="badge badge-muted">
              +{normalizedSkills.length - 4} more
            </span>
          )}
        </div>
      )}

      <Link to={`/chat/${_id}`}>
        <button className="w-full btn-primary relative">
          {unreadCount > 0 ? `${unreadCount} New Message${unreadCount > 1 ? 's' : ''}` : 'Start Chat'}
        </button>
      </Link>
    </div>
  );
};

export default ConnectionCard;
