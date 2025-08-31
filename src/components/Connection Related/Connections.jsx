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
      setLoading(true);
      const res = await axios.get(VITE_BASE_URL + "/request/connections", {
        withCredentials: true,
      })
      console.log(res.data.data)
      dispatch(addConnections(res.data.data))
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchConnections()
  }, [])
  if (loading) {
    return <div className="flex justify-center my-10 bg-gray-900">
      <h1 className='text-3xl font-bold text-center text-white'>Loading...</h1>
    </div>
  }
  if (!connections) {
    return <div className="flex justify-center my-10 bg-gray-900">
      <h1 className='text-3xl font-bold text-center text-white'></h1>


    </div>
  }
  if (connections.length === 0) {
    return <div className="flex justify-center my-10 bg-gray-900">
      <h1 className='text-3xl font-bold text-center text-white'>No Connections Found</h1>
    </div>
  }
  return (
    <div className="flex flex-wrap justify-center items-center gap-6 my-10 px-4 bg-gray-900">
      {connections.map((user) => (
        <ConnectionCard
          key={user._id}
          firstName={user.firstName}
          lastName={user.lastName}
          skills={user.skills}
          about={user.about}
          photoURL={user.photoURL}
          _id={user._id}
          age={user.age}
          gender={user.gender}
        />
      ))}
    </div>
  )
}

export default Connections