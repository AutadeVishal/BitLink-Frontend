import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';

import { BASE_URL, DEFAULT_AVATAR } from '../constants/Constants';

const formatTime = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  const date = new Date(dateValue);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const InboxSkeleton = () => (
  <div className="glass-panel overflow-hidden">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
        <div className="skeleton-circle w-12 h-12 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-48" />
        </div>
        <div className="skeleton h-3 w-12" />
      </div>
    ))}
  </div>
);

const ChatsInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, conversation) => sum + (conversation.unreadCount || 0), 0),
    [conversations]
  );

  const fetchInbox = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chat/inbox`, {
        withCredentials: true
      });
      setConversations(response.data?.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load chats right now');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();

    const socket = createSocketConnection();
    const onInboxRefresh = () => {
      fetchInbox();
    };

    socket.on('inboxNeedsRefresh', onInboxRefresh);
    window.addEventListener('chatRead', onInboxRefresh);

    return () => {
      socket.off('inboxNeedsRefresh', onInboxRefresh);
      window.removeEventListener('chatRead', onInboxRefresh);
    };
  }, []);

  return (
    <div className="page-shell page-enter">
      <div className="mb-6">
        <h1 className="section-title">Chats</h1>
        <p className="subtitle">
          {unreadTotal > 0
            ? <>{unreadTotal} unread message{unreadTotal > 1 ? 's' : ''}</>
            : 'All caught up'
          }
        </p>
      </div>

      {error && (
        <div className="alert-error mb-4">{error}</div>
      )}

      {loading ? (
        <InboxSkeleton />
      ) : conversations.length === 0 ? (
        <div className="glass-panel p-8 text-center text-red-100/90">
          No active conversations yet. Start chatting from your connections list.
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          {conversations.map((conversation) => (
            <button
              key={conversation.chatId}
              type="button"
              onClick={() => navigate(`/chat/${conversation.userId}`)}
              className="w-full text-left px-5 py-4 border-b border-white/5 hover:bg-red-500/10 transition-all duration-200 flex items-center gap-4 group"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={conversation.photoURL || DEFAULT_AVATAR}
                  alt={`${conversation.firstName} ${conversation.lastName}`}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-red-500/30 group-hover:ring-red-500/60 transition-all"
                />
                {conversation.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 badge-pulse border-2 border-black/80" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-base truncate ${
                    conversation.unreadCount > 0 
                      ? 'font-bold text-white' 
                      : 'font-semibold text-red-50'
                  }`}>
                    {conversation.firstName} {conversation.lastName}
                  </h3>
                  <span className="text-xs text-red-300 whitespace-nowrap">
                    {formatTime(conversation.lastMessageAt)}
                  </span>
                </div>

                <p className={`text-sm truncate mt-1 ${
                  conversation.unreadCount > 0 
                    ? 'text-red-100 font-medium' 
                    : 'text-red-200/80'
                }`}>
                  {conversation.lastMessageSenderName ? `${conversation.lastMessageSenderName}: ` : ''}
                  {conversation.lastMessageText || 'No messages yet'}
                </p>
              </div>

              {conversation.unreadCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 badge-pulse">
                  {conversation.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatsInbox;