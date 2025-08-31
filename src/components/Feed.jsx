import React, { useEffect } from 'react'
import FeedCard from './FeedCard'
import { useDispatch, useSelector } from 'react-redux'
import { setFeed } from '../utils/feedSlice';
import axios from 'axios';
const  VITE_BASE_URL=import.meta.env.VITE_BASE_URL;
import { useNavigate } from 'react-router-dom';
const Feed = () => {
  const feedData = useSelector(state => state.feed)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFeedData = async () => {
    try {
      const res = await axios(`${VITE_BASE_URL}/request/feed`, {
        withCredentials: true
      })
      const usersData = res.data.data;
      if (usersData.length === 0) return;
      dispatch(setFeed(usersData))
    }
    catch (err) {
      console.error(err);
      navigate('/login')
    }
  }

  useEffect(() => {
    if (!feedData || feedData.length === 0) {
      getFeedData();
    }
  }, []);

  if (!feedData || feedData.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No more profiles to show
          </h2>
          <p className="text-gray-600">Check back later for new connections!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Professionals</h1>
        <p className="text-gray-600">Connect with people in your field</p>
      </div>
      
      <div className="flex flex-wrap gap-6 justify-center">
        {feedData.map((userData) => (
          <FeedCard key={userData._id} userInfo={userData} />
        ))}
      </div>
    </div>
  )
}

export default Feed
