import axios from "axios";
import React from "react";
import { BASE_URL, DEFAULT_AVATAR } from '../../constants/Constants';
import { useDispatch } from "react-redux";
import { removeRequest } from "../../utils/requestSlice";
import { normalizeSkillList } from "../../utils/skillHelpers";

const RequestCard = ({ user }) => {
    const dispatch = useDispatch();
    
    if (!user) return null;

    const reviewRequest = async (status, email) => {
        try {
            await axios.post(
                `${BASE_URL}/connection/request/review/${status}/${email}`, 
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

    const normalizedSkills = normalizeSkillList(skills);

    return (
        <div className="glass-panel hoverable p-5">
            <div className="text-center mb-4">
                <div className="relative inline-block avatar-glow">
                    <img
                        className="w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-red-500/35"
                        src={photoURL || DEFAULT_AVATAR}
                        alt={`${firstName} ${lastName}`}
                    />
                </div>
            </div>

            <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-red-50">
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

                {about && <p className="text-sm text-red-200/80">{about}</p>}

                {normalizedSkills.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1">
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
            </div>

            <div className="flex gap-3 mt-6">
                <button 
                    onClick={() => reviewRequest("rejected", user.email)}
                    className="btn-secondary flex-1"
                >
                    Decline
                </button>
                <button 
                    onClick={() => reviewRequest("accepted", user.email)}
                    className="btn-primary flex-1"
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default RequestCard;