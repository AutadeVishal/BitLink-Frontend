import { useDispatch } from "react-redux";
import axios from "axios";
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
import { removeFeedUser } from "../utils/feedSlice"; // renamed

const FeedCard = ({ userInfo }) => {
  const dispatch = useDispatch();
  const { firstName, lastName, skills, about, photoURL, age, gender } = userInfo;

  const handleConnection = async (status, email) => {
    try {
      await axios.post(
        `${VITE_BASE_URL}/connection/request/send/${status}/${email}`,
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-80">
      {/* Profile Image */}
      <div className="text-center mb-4">
        <img
          className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-100"
          src={photoURL || "https://via.placeholder.com/80"}
          alt={`${firstName} ${lastName}`}
        />
      </div>

      {/* User Info */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">
          {firstName} {lastName}
        </h3>

        {/* Age & Gender */}
        <div className="flex justify-center gap-2">
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

        {/* About */}
        {about && (
          <p className="text-sm text-gray-600 italic px-2">{about}</p>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-3">
            {skills.slice(0, 6).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
              >
                {skill}
              </span>
            ))}
            {skills.length > 6 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                +{skills.length - 6} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => handleConnection("ignored", userInfo.email)}
          className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          Pass
        </button>
        <button
          onClick={() => handleConnection("interested", userInfo.email)}
          className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
