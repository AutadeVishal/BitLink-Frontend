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
      console.log(usersData)
      if (usersData.length == 0) return;
      dispatch(setFeed(usersData))//as bckend has array of user as  data:[{user1data},{userndata}]
    }
    catch (err) {
      console.log(err);
      navigate('/login')
    }
  }

  useEffect(() => {
    if (feedData==null || feedData?.length == 0) getFeedData();

  }, []);
  return (
    <div className='flex flex-wrap gap-6 justify-center items-center p-4 bg-gray-900'>
      { feedData.map((userData) => (
        <FeedCard key={userData._id} userInfo={userData} />
      ))}
    </div>
  )
}

export default Feed
