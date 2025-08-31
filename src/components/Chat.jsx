import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
const  VITE_BASE_URL=import.meta.env.VITE_BASE_URL;
import axios from 'axios'

const Chat = () => {
  const { targetUserId } = useParams();
  const loggedInUser = useSelector(state => state.user);
  const { firstName, _id } = loggedInUser;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  const fetchPreviousMessages = async () => {
    try {
      const response = await axios(`${VITE_BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true
      });
      
      if (response.data && response.data.data && response.data.data.messages) {
        const cleanedUpMessages = response.data.data.messages.map((msg) => ({
          firstName: msg?.senderId?.firstName, 
          text: msg?.text, 
          time: new Date(msg?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: msg?.senderId?._id === _id
        }));
        setMessages(cleanedUpMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }
  
  const sendMessage = () => {
    const socket = createSocketConnection();
    if (!newMessage.trim()) return;
    socket.emit("sendMessage", { firstName, loggedInUserId: _id, targetUserId, text: newMessage });
    setNewMessage("");
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  useEffect(() => {
    const socket = createSocketConnection();
    socket.emit("joinChat", { targetUserId, loggedInUserId: _id, name: firstName });

    socket.on("messageReceived", ({ text, firstName: senderName }) => {
      console.log(senderName, " Send you", text);
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prevMessages => [...prevMessages, { 
        firstName: senderName, 
        text, 
        time: timeString,
        isOwn: senderName === firstName
      }]);
    });

    fetchPreviousMessages();
    return () => {
      socket.disconnect();
    }
  }, [loggedInUser, targetUserId]);

  return (
    <div className="flex flex-col p-6 bg-gray-800 rounded border border-gray-700 text-white min-h-[500px]">
      <h1 className="text-xl font-bold mb-4 text-center">Chat</h1>
      <div className="flex-1 bg-gray-700 border border-gray-600 rounded-xl p-5 mb-4 overflow-y-auto max-h-[400px]">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">Start chatting...</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-3 flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-3 py-2 rounded-lg ${
                msg.isOwn 
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-600 text-white'
              }`}>
                {!msg.isOwn && <div className="text-xs text-gray-300 mb-1">{msg.firstName}</div>}
                <div>{msg.text}</div>
                <div className="text-xs text-gray-300 mt-1 text-right">{msg.time}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="bg-gray-700 border border-gray-600 rounded-xl p-4 flex items-center gap-3">
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 text-sm text-white bg-gray-600 border border-gray-500 rounded-full placeholder-gray-400 focus:outline-none focus:border-blue-400"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors hover:px-8 duration-200">
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat