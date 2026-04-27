import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, DEFAULT_AVATAR } from '../../constants/Constants';
import { removeUser } from "../../utils/userSlice";
import { useCallback, useEffect, useState } from "react";
import { removeConnections } from "../../utils/connectionSlice";
import { removeFeed } from "../../utils/feedSlice";
import { setRequest } from "../../utils/requestSlice";
import { createSocketConnection } from "../../utils/socket";

const NavBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navLinks = [
    { to: "/", label: "Discover" },
    { to: "/connections", label: "Connections" },
    { to: "/requests", label: "Requests" },
    { to: "/chats", label: "Chats" }
  ];

  const refreshUnreadCount = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/chat/inbox`, {
        withCredentials: true
      });

      const totalUnread = (response.data?.data || []).reduce(
        (sum, chat) => sum + (chat.unreadCount || 0),
        0
      );
      setUnreadCount(totalUnread);
    } catch {
      setUnreadCount(0);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeConnections());
      dispatch(removeFeed());
      dispatch(setRequest([]));
      navigate("/login");
    } catch (err) {
      console.log("Error in Logging Out:", err);
      navigate("/error");
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }

    refreshUnreadCount();

    const socket = createSocketConnection();
    const onInboxRefresh = () => refreshUnreadCount();

    socket.on("inboxNeedsRefresh", onInboxRefresh);
    window.addEventListener("chatRead", refreshUnreadCount);

    return () => {
      socket.off("inboxNeedsRefresh", onInboxRefresh);
      window.removeEventListener("chatRead", refreshUnreadCount);
    };
  }, [refreshUnreadCount, user]);

  useEffect(() => {
    refreshUnreadCount();
    setMenuOpen(false);
  }, [location.pathname, refreshUnreadCount]);

  if (!user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/45 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img src="/bitlink-logo.png" alt="BitLink Logo" className="w-9 h-9 rounded-md object-contain" />
          <span className="brand-word text-3xl text-red-100">BitLink</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {link.label}
                {link.to === '/chats' && unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 badge-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition"
          >
            <div className="relative">
              <img
                src={user.photoURL || DEFAULT_AVATAR}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500/40"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 badge-pulse border-2 border-black/80" />
              )}
            </div>
            <span className="text-red-100 font-semibold hidden sm:block">{user.firstName}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel p-2 z-50 page-enter">
              <div className="md:hidden">
                {navLinks.map((link) => (
                  <Link
                    key={`mobile-${link.to}`}
                    to={link.to}
                    className="menu-link flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    {link.to === '/chats' && unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-orange-500">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                ))}
                <hr className="my-2 border-white/10" />
              </div>

              <Link to="/profile" className="menu-link">
                Profile Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="menu-link w-full text-left text-red-300 hover:text-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
};

export default NavBar;
