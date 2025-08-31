import { useDispatch } from "react-redux";
import axios from "axios";
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
import { removeFeedUser } from "../utils/feedSlice"; // renamed

const FeedCard = ({ userInfo }) => {
  const dispatch = useDispatch();
  const { firstName, lastName, skills, about, photoURL, age, gender } = userInfo;

  const handleConnection = async (status, email) => {
    try {
      const res = await axios.post(
        `${VITE_BASE_URL}/connection/request/send/${status}/${email}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeedUser(userInfo._id));
      console.log("User Sent Request", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!userInfo) return <h1 className="text-white text-xl">Loading...</h1>;

  return (
    <div className="bg-gray-800 rounded-lg w-80 h-[500px] p-6 flex flex-col justify-between text-white border border-gray-700">
      {/* Profile Image */}
      <figure className="mb-4">
        <img
          className="rounded-full w-28 h-28 object-cover mx-auto border border-gray-600"
          src={photoURL || "https://via.placeholder.com/150"}
          alt="User Profile"
        />
      </figure>

      {/* Info Section */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-white">
          {firstName} {lastName}
        </h2>

        {/* Age + Gender as badges */}
        <div className="flex justify-center gap-2 flex-wrap">
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

        {/* About */}
        {about && <p className="text-sm italic px-2 text-gray-300">{about}</p>}

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-5 mt-6">
        <button
          className="px-5 py-2 text-sm text-gray-300 border border-gray-600 rounded-full hover:bg-gray-700"
          onClick={() => handleConnection("ignored", userInfo.email)}
        >
          Ignore
        </button>
        <button
          className="px-5 py-2 text-sm text-white bg-red-600 rounded-full hover:bg-red-700"
          onClick={() => handleConnection("interested", userInfo.email)}
        >
          Interested
        </button>
      </div>
    </div>
  );
};

export default FeedCard;
