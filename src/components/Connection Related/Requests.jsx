import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { setRequest } from '../../utils/requestSlice';
import RequestCard from './RequestCard';

const CardSkeleton = () => (
  <div className="glass-panel p-5 space-y-4">
    <div className="flex justify-center"><div className="skeleton-circle w-20 h-20" /></div>
    <div className="space-y-2">
      <div className="skeleton h-5 w-32 mx-auto" />
      <div className="flex justify-center gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="skeleton h-4 w-full" />
    </div>
    <div className="flex gap-3">
      <div className="skeleton h-10 flex-1" />
      <div className="skeleton h-10 flex-1" />
    </div>
  </div>
);

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/request/view`, {
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

    fetchRequests();
  }, [dispatch]);

  return (
    <div className="page-shell page-enter">
      <div className="mb-6">
        <h1 className="section-title">Requests</h1>
        <p className="subtitle">Review who wants to connect with you.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !requests || requests.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <h2 className="text-xl font-semibold text-red-50 mb-2">
            No connection requests
          </h2>
          <p className="subtitle">You will see incoming requests here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid">
          {requests.map((user) => (
            <RequestCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;