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
    <nav className="relative z-[300] bg-gray-800 border-b border-gray-700 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold tracking-wide hover:text-blue-400 transition"
      >
        BitLink
      </Link>

      {/* User Section */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-11 h-11 rounded-full overflow-hidden border border-gray-600 hover:ring-2 hover:ring-blue-400 transition"
          >
            <img
              src={user.photoURL || "https://via.placeholder.com/80"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <ul className="absolute right-0 mt-3 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-3 text-sm text-white animate-fadeIn">
              <li className="mb-2">
                <Link
                  to="/profile"
                  className="flex justify-between items-center px-3 py-2 rounded hover:bg-gray-700 transition"
                >
                  Profile{" "}
                  <span className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                    New
                  </span>
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/connections"
                  className="block px-3 py-2 rounded hover:bg-gray-700 transition"
                >
                  Connections
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/requests"
                  className="block px-3 py-2 rounded hover:bg-gray-700 transition"
                >
                  Requests
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded hover:bg-red-900 text-red-400 transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
