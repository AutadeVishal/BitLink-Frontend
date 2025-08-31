import React from "react";
import { Link } from "react-router-dom";

const ConnectionCard = (props) => {
  const { firstName, lastName, skills, about, photoURL, _id, age, gender } = props;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={photoURL || "https://via.placeholder.com/60"}
          alt={`${firstName} ${lastName}`}
          className="w-15 h-15 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {firstName} {lastName}
          </h3>
          {about && <p className="text-sm text-gray-600 mt-1">{about}</p>}
        </div>
      </div>

      {/* Age & Gender */}
      <div className="flex gap-2 mb-3">
        {age && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
            {age} years
          </span>
        )}
        {gender && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full capitalize">
            {gender}
          </span>
        )}
      </div>

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
              +{skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Chat Button */}
      <Link to={`/chat/${_id}`}>
        <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
          Start Chat
        </button>
      </Link>
    </div>
  );
};

export default ConnectionCard;
