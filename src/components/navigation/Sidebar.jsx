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

  // Updated select style to match app background colors
  const selectStyle =
    "bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-700 dark:to-indigo-800  translate-y-[-2px] shadow-lg shadow-sky-500/30 dark:shadow-indigo-900/40 ";

  return (
    <nav
      className={`z-50 flex flex-col justify-between
                 text-slate-600 dark:text-slate-200 
                 bg-gradient-to-r from-slate-200/90 to-slate-300/80 dark:from-slate-900/95 dark:to-slate-950/80 
                 backdrop-blur-sm h-screen transition-all duration-300 w-22 shrink-0 
                 border-r border-slate-300/30 dark:border-slate-700/20`}
    >
      <div className="flex flex-col">
        {/* Header */}
        <div
          className={`flex items-center justify-center p-2 border-b border-slate-300/30 dark:border-slate-700/30`}
        >
          <Link
            onClick={() => handleHomeClick()}
            to="/"
            className="flex items-center rounded-lg p-1 transition-transform duration-200 hover:scale-105"
          >
            <EyeLogo />
          </Link>
        </div>

        {/* Navigation Links */}
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="w-6 h-6 border-2 border-t-transparent border-slate-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center space-y-3 mt-6 px-3  `}
          >
            <IconTooltip label="Home">
              <Link
                onClick={() => handleHomeClick()}
                to="/"
                className={`flex items-center p-2 rounded-lg transition-all duration-200 dark:text-green-400 text-green-600
                ${
                  bookmark === "home"
                    ? selectStyle
                    : "hover:bg-slate-300/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <Home className="w-6 h-6" />
              </Link>
            </IconTooltip>

            {currentUser ? (
              <>
                <div
                  className={` p-2 rounded-lg group relative transition-all duration-200 cursor-pointer
                  ${
                    bookmark === "UserProfile"
                      ? selectStyle
                      : "hover:bg-slate-300/60 dark:hover:bg-slate-800/60"
                  }`}
                  onClick={() => {
                    navigate(`users/${currentUser.id}`);
                    setBookmark("UserProfile");
                  }}
                >
                  <div
                    className={`w-6 h-6 overflow-hidden border border-slate-300/50 dark:border-slate-500/30 rounded-full 
                    bg-gradient-to-br from-blue-300 to-indigo-500 dark:from-blue-400 dark:to-indigo-600 shadow-md`}
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
                    className="flex items-center p-2 rounded-lg hover:bg-slate-300/60 dark:hover:bg-slate-800/60 transition-colors duration-200 text-rose-500 hover:text-rose-400"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </IconTooltip>

                <div
                  className={` rounded-lg  transition-all duration-200
                  ${
                    bookmark === "notification"
                      ? selectStyle
                      : "hover:bg-slate-300/60 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <IconTooltip label="Notifications">
                    <NotificationBell setBookmark={setBookmark} />
                  </IconTooltip>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`rounded-lg transition-all duration-200
                  ${
                    bookmark === "login"
                      ? selectStyle
                      : "hover:bg-slate-300/60 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <IconTooltip label="Login">
                    <Link
                      to="/login"
                      className="flex items-center p-2 rounded-lg transition-colors duration-200 text-sky-500"
                    >
                      <LogIn className="w-6 h-6" />
                    </Link>
                  </IconTooltip>
                </div>

                <div
                  className={`rounded-lg transition-all duration-200
                  ${
                    bookmark === "register"
                      ? selectStyle
                      : "hover:bg-slate-300/60 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <IconTooltip label="Register">
                    <Link
                      to="/register"
                      className="flex items-center p-2 rounded-lg transition-colors duration-200 text-indigo-500"
                    >
                      <UserPlus className="w-6 h-6" />
                    </Link>
                  </IconTooltip>
                </div>

                <IconTooltip label="Guest Login">
                  <button
                    className="flex items-center p-2 rounded-lg hover:bg-slate-300/60 dark:hover:bg-slate-800/60 transition-colors duration-200 text-purple-500"
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
        className={`m-4 flex justify-center items-center p-2 rounded-full 
                  hover:bg-slate-300/60 dark:hover:bg-slate-800/60 
                  transition-colors duration-200 
                  text-amber-500 dark:text-amber-300`}
      >
        <ThemeToggle className="w-6 h-6" />
      </div>
    </nav>
  );
};

export default Sidebar;
