import React from "react";
import { Link } from "react-router-dom";

const ConnectionCard = (props) => {
  const { firstName, lastName, skills, about, photoURL, _id, age, gender } = props;

  return (
    <div className="bg-gray-800 rounded-lg p-6 m-4 w-80 text-white flex flex-col justify-between border border-gray-700">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={photoURL || "https://via.placeholder.com/80"} // fallback image
          alt={`${firstName} ${lastName}`}
          className="w-16 h-16 rounded-full object-cover border border-gray-600"
        />
        <div>
          <h2 className="text-xl font-semibold text-white">
            {firstName} {lastName}
          </h2>
          {about && <p className="text-sm text-gray-300 italic">{about}</p>}
        </div>
      </div>

      {/* Age + Gender */}
      <div className="flex gap-2 flex-wrap mb-3">
        {age && (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-200">
            {age} years
          </span>
        )}
        {gender && (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-200 capitalize">
            {gender}
          </span>
        )}
      </div>

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Chat Button */}
      <Link to={`/chat/${_id}`} className="mt-auto">
        <button className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition">
          Chat
        </button>
      </Link>
    </div>
  );
};

export default ConnectionCard;
