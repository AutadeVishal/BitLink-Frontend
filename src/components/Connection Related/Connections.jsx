import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../constants/Constants';
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../../utils/connectionSlice'
import ConnectionCard from './ConnectionCard'
import { createSocketConnection } from '../../utils/socket'

const CardSkeleton = () => (
  <div className="glass-panel p-5 space-y-4">
    <div className="flex items-center gap-4">
      <div className="skeleton-circle w-16 h-16 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton h-3 w-48" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-5 w-16 rounded-full" />
      <div className="skeleton h-5 w-14 rounded-full" />
    </div>
    <div className="skeleton h-10 w-full" />
  </div>
);

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector(state => state.connection)
  const [loading, setLoading] = useState(true);
  const [unreadMap, setUnreadMap] = useState({});

  const fetchUnreadCounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chat/inbox`, {
        withCredentials: true
      });
      const map = {};
      (response.data?.data || []).forEach((conv) => {
        if (conv.unreadCount > 0) {
          map[conv.userId] = conv.unreadCount;
        }
      });
      setUnreadMap(map);
    } catch {
      // Silently fail — badges just won't show
    }
  };
  
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/request/connections", {
          withCredentials: true,
        })
        dispatch(addConnections(res.data.data))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    }

    fetchConnections()
    fetchUnreadCounts()

    const socket = createSocketConnection();
    const onInboxRefresh = () => fetchUnreadCounts();
    socket.on('inboxNeedsRefresh', onInboxRefresh);

    window.addEventListener('chatRead', fetchUnreadCounts);

    return () => {
      socket.off('inboxNeedsRefresh', onInboxRefresh);
      window.removeEventListener('chatRead', fetchUnreadCounts);
    };
  }, [dispatch])

  return (
    <div className="page-shell page-enter">
      <div className="mb-6">
        <h1 className="section-title">Connections</h1>
        <p className="subtitle">People already in your trusted circle.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !connections || connections.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <h2 className="text-xl font-semibold text-red-50 mb-2">
            No connections yet
          </h2>
          <p className="subtitle">Start connecting with professionals to build your network.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid">
          {connections.map((user) => (
            <ConnectionCard key={user._id} {...user} unreadCount={unreadMap[user._id] || 0} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Connections