import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketConnection, disconnectSocket } from '../utils/socket';
import { useSelector } from 'react-redux';
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
import axios from 'axios';

const Chat = () => {
  const { targetUserId } = useParams();
  const loggedInUser = useSelector(state => state.user);
  const { firstName, _id } = loggedInUser;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const fetchPreviousMessages = async () => {
    try {
      const response = await axios.get(`${VITE_BASE_URL}/chat/${targetUserId}`, { 
        withCredentials: true 
      });
      const cleaned = (response.data?.data?.messages || []).map(msg => ({
        firstName: msg?.senderId?.firstName,
        text: msg?.text,
        time: new Date(msg?.createdAt).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: msg?.senderId?._id === _id
      }));
      setMessages(cleaned);
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    socketRef.current.emit("sendMessage", { targetUserId, text: newMessage });
    setNewMessage("");
  };

  const handleKeyDown = e => { 
    if (e.key === 'Enter') sendMessage(); 
  };

  useEffect(() => {
    socketRef.current = createSocketConnection();
    socketRef.current.emit("joinChat", { targetUserId });
    socketRef.current.on("messageReceived", ({ text, firstName: senderName, timestamp }) => {
      setMessages(prev => [...prev, {
        firstName: senderName,
        text,
        time: timestamp,
        isOwn: senderName === firstName
      }]);
    });
    fetchPreviousMessages();
    return () => {
      socketRef.current?.off("messageReceived");
      disconnectSocket();
    };
  }, [targetUserId, _id, firstName]);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 h-[600px] flex flex-col relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
        </div>

        {/* Messages Container - Add padding bottom for floating input */}
        <div ref={containerRef} className="flex-1 p-6 pb-24 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Start your conversation...</p>
              <p className="text-sm mt-2">Type a message below to begin chatting</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`mb-4 flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.isOwn 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  {!msg.isOwn && (
                    <div className="text-xs text-gray-500 mb-1">{msg.firstName}</div>
                  )}
                  <div className="text-sm">{msg.text}</div>
                  <div className={`text-xs mt-1 ${
                    msg.isOwn ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-gray-200 rounded-b-lg shadow-lg">
          <div className="flex gap-3">
            <input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Type your message here..."
            />
            <button 
              onClick={sendMessage} 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;