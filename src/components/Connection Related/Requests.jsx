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
      console.log("Request you got:",res.data.data)
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 bg-gray-900">
      {loading ? (
       <div>
        <h1 className="text-white">Loading</h1>
        </div>
      ) : !requests || requests.length === 0 ? (
        <div className="flex justify-center items-center py-16">
          <p className="text-gray-300 text-lg">No requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {requests.map((user) => (
            <RequestCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;