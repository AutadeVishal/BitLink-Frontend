import axios from "axios";
import React from "react";
const VITE_BASE_URL=import.meta.env.VITE_BASE_URL;
import { useDispatch } from "react-redux";
import { removeRequest } from "../../utils/requestSlice";

const RequestCard = ({ user }) => {
    const dispatch = useDispatch();
    
    if (!user) return null;

    const reviewRequest = async (status, email) => {
        try {
            await axios.post(
                `${VITE_BASE_URL}/connection/request/review/${status}/${email}`, 
                {}, 
                { withCredentials: true }
            );
            dispatch(removeRequest(user._id));
        } catch (err) {
            console.error(err);
        }
    };

    const {
        firstName = "",
        lastName = "",
        skills = [],
        about = "",
        photoURL = "",
        age,
        gender
    } = user;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
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
                <h3 className="text-lg font-semibold text-gray-900">
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
                {about && <p className="text-sm text-gray-600">{about}</p>}

                {/* Skills */}
                {skills?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1">
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
                <button 
                    onClick={() => reviewRequest("rejected", user.email)}
                    className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                    Decline
                </button>
                <button 
                    onClick={() => reviewRequest("accepted", user.email)}
                    className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default RequestCard;