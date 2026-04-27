import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import { BASE_URL, DEFAULT_AVATAR } from '../constants/Constants';
import axios from 'axios';

const formatTime = (value) => new Date(value).toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit'
});

const MessageSkeleton = () => (
  <div className="space-y-4 p-6">
    {[...Array(5)].map((_, i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
        <div className={`skeleton ${i % 2 === 0 ? 'w-48' : 'w-56'} h-14`} />
      </div>
    ))}
  </div>
);

const Chat = () => {
  const { targetUserId } = useParams();
  const loggedInUser = useSelector(state => state.user);
  const _id = loggedInUser?._id;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const markChatAsRead = useCallback(async () => {
    if (!targetUserId) {
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/chat/${targetUserId}/read`,
        {},
        { withCredentials: true }
      );
      // Dispatch event to update unread badges across the app
      window.dispatchEvent(new Event('chatRead'));
    } catch (err) {
      console.error('Error marking chat as read:', err);
    }
  }, [targetUserId]);

  const fetchPreviousMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, { 
        withCredentials: true 
      });

      setTargetUser(response.data?.data?.targetUser || null);

      const cleaned = (response.data?.data?.messages || []).map(msg => ({
        id: msg?._id,
        firstName: msg?.senderId?.firstName || 'User',
        text: msg?.text,
        createdAt: msg?.createdAt,
        time: formatTime(msg?.createdAt || new Date()),
        isOwn: String(msg?.senderId?._id || msg?.senderId) === String(_id)
      }));

      setMessages(cleaned);
      await markChatAsRead();
    } catch (e) {
      console.error("Error fetching messages:", e);
    } finally {
      setLoading(false);
    }
  }, [_id, markChatAsRead, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", { targetUserId, text: newMessage });
    setNewMessage("");
  };

  const handleKeyDown = e => { 
    if (e.key === 'Enter') sendMessage(); 
  };

  useEffect(() => {
    if (!_id || !targetUserId) {
      return;
    }

    socketRef.current = createSocketConnection();
    socketRef.current.emit("joinChat", { targetUserId });

    const onMessageReceived = ({ text, firstName: senderName, senderId, createdAt }) => {
      const isOwnMessage = String(senderId) === String(_id);

      setMessages(prev => [...prev, {
        id: `${senderId}-${createdAt}-${prev.length}`,
        firstName: senderName,
        text,
        createdAt,
        time: formatTime(createdAt || new Date()),
        isOwn: isOwnMessage
      }]);

      if (!isOwnMessage) {
        markChatAsRead();
      }
    };

    socketRef.current.on("messageReceived", onMessageReceived);
    fetchPreviousMessages();

    return () => {
      socketRef.current?.emit("leaveChat", { targetUserId });
      socketRef.current?.off("messageReceived", onMessageReceived);
    };
  }, [_id, fetchPreviousMessages, markChatAsRead, targetUserId]);

  useEffect(scrollToBottom, [messages]);

  if (!loggedInUser) {
    return (
      <div className="page-shell">
        <div className="glass-panel p-8 text-center text-red-100">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="page-shell page-enter">
      <div className="glass-panel h-[72vh] min-h-[520px] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-black/20">
          <div className="relative avatar-glow">
            <img
              src={targetUser?.photoURL || DEFAULT_AVATAR}
              alt="Target user"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/40"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-red-50">
              {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'Conversation'}
            </h1>
            <p className="text-xs text-red-200/80">Realtime messaging</p>
          </div>
        </div>

        <div ref={containerRef} className="flex-1 p-6 overflow-y-auto bg-black/15">
          {loading ? (
            <MessageSkeleton />
          ) : messages.length === 0 ? (
            <div className="text-center text-red-200 mt-8">
              <p>Start your conversation...</p>
              <p className="text-sm mt-2 text-red-300/80">Type a message below to begin chatting</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={msg.id || i} className={`mb-4 flex ${msg.isOwn ? 'justify-end' : 'justify-start'} ${msg.isOwn ? 'msg-own' : 'msg-other'}`}>
                <div className={`max-w-sm px-4 py-3 rounded-2xl shadow-lg border ${
                  msg.isOwn 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-300/40 rounded-br-sm' 
                    : 'bg-zinc-900/90 border-white/10 text-red-50 rounded-bl-sm'
                }`}>
                  {!msg.isOwn && (
                    <div className="text-xs text-red-300 mb-1">{msg.firstName}</div>
                  )}
                  <div className="text-sm">{msg.text}</div>
                  <div className={`text-xs mt-1 ${
                    msg.isOwn ? 'text-red-100' : 'text-red-300/80'
                  }`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 bg-zinc-950/80 border-t border-white/10 backdrop-blur">
          <div className="flex gap-3">
            <input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input-dark flex-1"
              placeholder="Type your message here..."
            />
            <button 
              onClick={sendMessage} 
              className="btn-primary px-6"
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