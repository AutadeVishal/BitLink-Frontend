import React, { useEffect, useState } from 'react';
import axios from 'axios';
const  VITE_BASE_URL=import.meta.env.VITE_BASE_URL;
import { useDispatch, useSelector } from 'react-redux';
import { setRequest } from '../../utils/requestSlice';
import RequestCard from './RequestCard';

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${VITE_BASE_URL}/request/view`, {
        withCredentials: true,
      });
      dispatch(setRequest(res?.data?.data || []));
    } catch (err) {
      console.error('Error fetching requests:', err);
      dispatch(setRequest([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No connection requests
          </h2>
          <p className="text-gray-600">You'll see new connection requests here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connection Requests</h1>
        <p className="text-gray-600">{requests.length} pending requests</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {requests.map((user) => (
          <RequestCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Requests;