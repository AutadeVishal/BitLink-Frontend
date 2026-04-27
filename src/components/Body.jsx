import React from 'react';
import NavBar from "./Important UI Related/NavBar";
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './Important UI Related/Footer';
import axios from 'axios';
import { useEffect } from 'react';
import { BASE_URL } from '../constants/Constants';
import { useDispatch } from 'react-redux';
import { setUser } from '../utils/userSlice';
import { useSelector } from 'react-redux';

const PageSkeleton = () => (
  <div className="min-h-screen flex flex-col">
    {/* Nav skeleton */}
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/45 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="skeleton h-8 w-24" />
        <div className="hidden md:flex gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-8 w-20 rounded-full" />)}
        </div>
        <div className="flex items-center gap-3">
          <div className="skeleton-circle w-9 h-9" />
          <div className="skeleton h-4 w-16 hidden sm:block" />
        </div>
      </div>
    </div>
    {/* Content skeleton */}
    <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-6">
      <div className="space-y-4">
        <div className="skeleton h-10 w-48" />
        <div className="skeleton h-4 w-72" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel p-5 space-y-4">
              <div className="flex justify-center"><div className="skeleton-circle w-20 h-20" /></div>
              <div className="skeleton h-5 w-32 mx-auto" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(state => state.user);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        dispatch(setUser(res.data.data));
        console.log("User fetched successfully from Body component");
      } catch (err) {
        console.log("Error fetching user from Body component:", err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (!userData) {
      fetchUser();
    } else {
      setLoading(false); // User already in Redux
    }
  }, [dispatch, navigate, userData]);

 if (loading) {
  return <PageSkeleton />;
}

 return (
  <div className="min-h-screen flex flex-col">
    <NavBar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
};


export default Body