import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import {
  Bell,
  X,
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  Clock,
  Trash2,
} from "lucide-react";
import TimeAgo from "../utils/TimeAgoComponent";
import { useNavigate } from "react-router-dom";

const NotificationBell = ({ setBookmark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, clearAll } = useSocket();
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        markAllAsRead();
        setBookmark("");
      }
    }

    // Add event listener when the panel is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, markAllAsRead]);

  const handleOpenBell = () => {
    if (isOpen) {
      setIsOpen(false);
      markAllAsRead();
      setBookmark("");
    } else {
      setIsOpen(true);
      setBookmark("notification");
    }
  };

  const handleClickNotification = (notification) => {
    if (notification.type === "USER_FOLLOW") {
      navigate(`/users/${notification.data.sentBy.id}`);
    } else {
      navigate(`/posts/${notification.postId}`);
    }
    setIsOpen(false);
  };

  // Helper function to get the appropriate icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "USER_FOLLOW":
        return (
          <UserPlus
            size={14}
            className="text-indigo-500 dark:text-indigo-400"
          />
        );
      case "POST_LIKE":
        return <Heart size={14} className="text-rose-500 dark:text-rose-400" />;
      case "POST_COMMENT":
        return (
          <MessageCircle
            size={14}
            className="text-amber-500 dark:text-amber-400"
          />
        );
      case "POST_SHARE":
        return (
          <Share2
            size={14}
            className="text-emerald-500 dark:text-emerald-400"
          />
        );
      default:
        return <Bell size={14} className="text-sky-500 dark:text-sky-400" />;
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      {/* Bell icon with unread count badge */}
      <button
        onClick={handleOpenBell}
        className="relative p-2 text-yellow-600 dark:text-yellow-500 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200 focus:outline-none"
        aria-label={`Notifications ${
          unreadCount > 0 ? `(${unreadCount} unread)` : ""
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 dark:from-sky-600 dark:to-indigo-600 rounded-full transform translate-x-1/3 -translate-y-1/3 shadow-sm animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification panel */}
      {isOpen && (
        <div
          className=" absolute left-0 mt-2 w-80 sm:w-96 rounded-xl shadow-lg 
                      border border-slate-300/30 dark:border-slate-700/30 overflow-hidden 
                      bg-gradient-to-br from-slate-100/95 to-slate-200/95 
                      dark:from-slate-800/95 dark:to-slate-900/95 
                      backdrop-filter backdrop-blur-sm transform origin-top-right transition-all duration-200 ease-out"
        >
          <div className="p-4">
            {/* Panel header */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-300/30 dark:border-slate-700/30 pb-3">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Bell size={16} className="text-sky-500 dark:text-sky-400" />
                <span>Notifications</span>
              </h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-slate-500 dark:text-slate-400 
                             hover:text-rose-500 dark:hover:text-rose-400 
                             transition-colors duration-200 flex items-center gap-1 
                             py-1 px-2 rounded-lg 
                             hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                    aria-label="Clear all notifications"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Clear all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-500 dark:text-slate-400 
                           hover:text-slate-700 dark:hover:text-slate-200 
                           transition-colors duration-200 p-1.5 rounded-lg 
                           hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                  aria-label="Close notifications"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notifications list */}
            <div
              className="space-y-2 max-h-96 overflow-y-auto pr-1 
                          scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 
                          scrollbar-track-transparent"
            >
              {notifications.length === 0 ? (
                <div className="text-slate-500 dark:text-slate-400 text-center py-8 px-4">
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="mb-1 font-medium">No notifications</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleClickNotification(notification)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all duration-200 hover:shadow-md ${
                      notification.read
                        ? "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/40 hover:border-slate-300/70 dark:hover:border-slate-600/70"
                        : "bg-gradient-to-r from-sky-50/80 to-indigo-50/80 dark:from-slate-700/60 dark:to-slate-700/60 border-sky-200/70 dark:border-sky-700/40 hover:border-sky-300/70 dark:hover:border-sky-600/50"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* User avatar */}
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full overflow-hidden 
                                     ring-1 ring-slate-200/70 dark:ring-slate-700/70 
                                     shadow-sm"
                        >
                          <img
                            className="w-full h-full object-cover"
                            src={notification.data.sentBy?.avatar || ""}
                            alt={notification.data.sentBy?.name || "User"}
                          />
                        </div>
                      </div>

                      {/* Notification content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-1.5 mb-0.5">
                          {getNotificationIcon(notification.type)}
                          <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>

                        {/* If notification has image or content */}
                        {(notification.data.imageUrl ||
                          notification.data.content) && (
                          <div
                            className="mt-2 flex items-center gap-2 
                                        bg-slate-100/80 dark:bg-slate-800/80 p-2 rounded-lg 
                                        border border-slate-200/50 dark:border-slate-700/50"
                          >
                            {notification.data.imageUrl && (
                              <div
                                className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden 
                                           border border-slate-300/50 dark:border-slate-600/50"
                              >
                                <img
                                  src={notification.data.imageUrl}
                                  alt="Content preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {notification.data.content && (
                              <span className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 italic">
                                "{notification.data.content}"
                              </span>
                            )}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="flex justify-end items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                          <Clock size={10} />
                          <TimeAgo dateString={notification.createdAt} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 5 && (
              <div className="pt-2 mt-2 border-t border-slate-300/30 dark:border-slate-700/30 text-center">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-slate-500 dark:text-slate-400 
                           hover:text-sky-600 dark:hover:text-sky-400 
                           transition-colors duration-200"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
