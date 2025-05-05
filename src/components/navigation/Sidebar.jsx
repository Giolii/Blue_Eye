import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggle from "../reusable/ThemeToggle";
import { Home, LogIn, UserPlus, LogOut, Ghost } from "lucide-react";
import IconTooltip from "../reusable/IconToolTip";
import { useScroll } from "../../contexts/ScrollContext";
import ProfileTooltip from "../reusable/ProfileTooltip";
import NotificationBell from "../NotificationBell";
import { useEffect, useState } from "react";
import EyeLogo from "../reusable/EyeLogo";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const [bookmark, setBookmark] = useState("");
  const { currentUser, logout, guestLogin, loading } = useAuth();
  const { scrollToTop } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    scrollToTop();
    setBookmark("home");
  };

  useEffect(() => {
    const path = location.pathname;

    if (path === "/") {
      setBookmark("home");
    } else if (path === "/login") {
      setBookmark("login");
    } else if (path === "/register") {
      setBookmark("register");
    } else if (path.startsWith("/users/")) {
      setBookmark("UserProfile");
    }
  }, [location.pathname]);

  const selectStyle =
    "bg-gradient-to-r from-indigo-700 to-teal-800 text-white translate-y-[-2px] shadow-lg shadow-indigo-700/50 ";

  return (
    <nav
      className={`flex flex-col justify-between text-text bg-gradient-to-r from-cyan-950 to-transparent  h-screen transition-all duration-300 w-22  shrink-0`}
    >
      <div className="flex flex-col">
        {/* Header  */}
        <div
          className={`flex items-center justify-center p-2d border-b border-gray-700 `}
        >
          <Link
            onClick={() => handleHomeClick()}
            to="/"
            className="flex items-center rounded-lg  "
          >
            <EyeLogo />
          </Link>
        </div>

        {/* Navigation Links */}
        {loading ? (
          <div></div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center  space-y-2 mt-6 px-3 `}
          >
            <IconTooltip label="Home">
              <Link
                onClick={() => handleHomeClick()}
                to="/"
                className={`flex items-center p-2 rounded-lg  transition-all 
                ${bookmark === "home" ? selectStyle : "hover:bg-gray-700"}
                    `}
              >
                <Home className="w-6 h-6" />
              </Link>
            </IconTooltip>

            {currentUser ? (
              <>
                <div
                  className={` p-2 rounded-lg  group relative ${
                    bookmark === "UserProfile"
                      ? selectStyle
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    navigate(`users/${currentUser.id}`);
                  }}
                >
                  <div
                    className={`w-6 h-6 overflow-hidden border rounded-full  bg-gradient-to-br from-blue-300 to-blue-500 `}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={currentUser.avatar}
                      alt={`${currentUser.username}'s avatar`}
                    />
                    <ProfileTooltip user={currentUser} />
                  </div>
                </div>

                <IconTooltip label="Logout">
                  <button
                    onClick={() => logout()}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-700  transition-colors"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </IconTooltip>
                <div
                  className={` rounded-lg ${
                    bookmark === "notification"
                      ? selectStyle
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setBookmark("notification")}
                >
                  <IconTooltip label="Notifications">
                    <NotificationBell />
                  </IconTooltip>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`rounded-lg ${
                    bookmark === "login" ? selectStyle : "hover:bg-gray-700"
                  }`}
                >
                  <IconTooltip label="Login">
                    <Link
                      to="/login"
                      className="flex items-center p-2 rounded-lg  transition-colors"
                    >
                      <LogIn className="w-6 h-6" />
                    </Link>
                  </IconTooltip>
                </div>
                <div
                  className={`rounded-lg ${
                    bookmark === "register" ? selectStyle : "hover:bg-gray-700"
                  }`}
                >
                  <IconTooltip label="Register">
                    <Link
                      to="/register"
                      className="flex items-center p-2 rounded-lg  transition-colors"
                    >
                      <UserPlus className="w-6 h-6" />
                    </Link>
                  </IconTooltip>
                </div>

                <IconTooltip label="Guest Login">
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-gray-700  transition-colors"
                    onClick={guestLogin}
                  >
                    <Ghost className="w-6 h-6" />
                  </button>
                </IconTooltip>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom section for theme toggle */}
      <div
        className={`m-4 flex justify-center items-center rounded-full hover:bg-gray-700 transition-colors  `}
      >
        <ThemeToggle className="w-6 h-6" />
      </div>
    </nav>
  );
};

export default Sidebar;
