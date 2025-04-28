import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import ThemeToggle from "../reusable/ThemeToggle";
import { Home, LogIn, UserPlus, LogOut, Ghost } from "lucide-react";
import IconTooltip from "../reusable/IconToolTip";
import { useScroll } from "../../contexts/ScrollContext";
import ProfileTooltip from "../reusable/ProfileTooltip";
import NotificationBell from "../NotificationBell";

const Sidebar = () => {
  const { currentUser, logout, guestLogin } = useAuth();
  const { scrollToTop } = useScroll();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    scrollToTop();
  };

  return (
    <nav
      className={`flex flex-col justify-between text-text bg-sidebar shadow-2xl h-screen transition-all duration-300 w-20`}
    >
      <div className="flex flex-col">
        {/* Header  */}
        <div className="flex items-center justify-between p-2 border-b border-gray-700">
          <Link
            onClick={() => handleHomeClick()}
            to="/"
            className="flex items-center p-2 rounded-lg hover:scale-200 hover:rotate-180 transition-all duration-300"
          >
            <img src="/eye.png" alt="Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center justify-center  space-y-2 mt-6 px-3">
          <IconTooltip label="Home">
            <Link
              onClick={() => handleHomeClick()}
              to="/"
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-6 h-6" />
            </Link>
          </IconTooltip>

          {currentUser ? (
            <>
              <div className="p-2 rounded-lg hover:bg-gray-700 group relative">
                <div
                  className="w-6 h-6 overflow-hidden border rounded-full  bg-gradient-to-br from-blue-300 to-blue-500"
                  onClick={() => navigate(`users/${currentUser.id}`)}
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
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </IconTooltip>
              <NotificationBell />
            </>
          ) : (
            <>
              <IconTooltip label="Login">
                <Link
                  to="/login"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <LogIn className="w-6 h-6" />
                </Link>
              </IconTooltip>

              <IconTooltip label="Register">
                <Link
                  to="/register"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <UserPlus className="w-6 h-6" />
                </Link>
              </IconTooltip>

              <IconTooltip label="Guest Login">
                <button
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={guestLogin}
                >
                  <Ghost className="w-6 h-6" />
                </button>
              </IconTooltip>
            </>
          )}
        </div>
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
