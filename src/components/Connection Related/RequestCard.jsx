import axios from "axios";
import React from "react";
const VITE_BASE_URL=import.meta.env.VITE_BASE_URL;
import { useDispatch } from "react-redux";
import { removeRequest } from "../../utils/requestSlice";

const RequestCard = ({ user }) => {
    const dispatch=useDispatch();
    if (!user) return <h1 className="text-white text-xl">Loading...</h1>;
    const reviewRequest=async(status,email)=>{
        try{
            console.log(status,email)
            const res=await axios.post(`${VITE_BASE_URL}/connection/request/review/${status}/${email }`,{},{
                withCredentials:true,
            })
            console.log(user._id)
            dispatch(removeRequest(user._id))
            console.log(res.data)
        }catch(err){
            console.log(err)
        }
    }
    const {
        firstName = "",
        lastName = "",
        skills = [],
        about = "",
        photoURL = "",
    } = user;

    return (
        <div className="m-10 bg-gray-800 rounded-lg w-80 h-[480px] p-4 flex flex-col justify-between text-white border border-gray-700">
            <figure className="mb-4">
                <img
                    className="rounded-full w-24 h-24 object-cover mx-auto border border-gray-600"
                    src={photoURL || "https://via.placeholder.com/150"}
                    alt={`${firstName} ${lastName}`}
                />
            </figure>

            <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold tracking-wide text-white">
                    {firstName} {lastName}
                </h2>
                <p className="text-sm text-gray-300">{about}</p>

                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {skills?.map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-200"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Button group: Accept, Reject */}
            <div className="flex justify-center gap-3 mt-4">
                <button 
                onClick={()=>reviewRequest("accepted",user.email)}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200">
                    Accept
                </button>
                <button 
                onClick={()=>reviewRequest("rejected",user.email)}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-200">
                    Reject
                </button>
            </div>
        </div>
    );
};

export default RequestCard;