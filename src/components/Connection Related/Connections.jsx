import React, { useEffect, useState } from 'react'
import axios from 'axios'
const  VITE_BASE_URL=import.meta.env.VITE_BASE_URL;
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../../utils/connectionSlice'
import ConnectionCard from './ConnectionCard'

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector(state => state.connection)
  const [loading, setLoading] = useState(true);
  
  const fetchConnections = async () => {
    try {
      const res = await axios.get(VITE_BASE_URL + "/request/connections", {
        withCredentials: true,
      })
      dispatch(addConnections(res.data.data))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading connections...</p>
        </div>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No connections yet
          </h2>
          <p className="text-gray-600">Start connecting with professionals to build your network!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Connections</h1>
        <p className="text-gray-600">{connections.length} professional connections</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {connections.map((user) => (
          <ConnectionCard key={user._id} {...user} />
        ))}
      </div>
    </div>
  )
}

export default Connections