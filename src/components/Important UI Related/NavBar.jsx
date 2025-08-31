import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
 const VITE_BASE_URL =import.meta.env.VITE_BASE_URL;
import { removeUser } from "../../utils/userSlice";
import { useEffect, useState } from "react";
import { removeConnections } from "../../utils/connectionSlice";
import { removeFeed } from "../../utils/feedSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${VITE_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeConnections());
      dispatch(removeFeed());
      navigate("/login");
    } catch (err) {
      console.log("Error in Logging Out:", err);
      navigate("/error");
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          BitLink
        </Link>

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition"
            >
              <img
                src={user.photoURL || "https://via.placeholder.com/32"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">{user.firstName}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <Link
                  to="/connections"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Connections
                </Link>
                <Link
                  to="/requests"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Requests
                </Link>
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Close menu when clicking outside */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
};

export default NavBar;
