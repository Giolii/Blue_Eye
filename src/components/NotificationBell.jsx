import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { Bell } from "lucide-react";
import TimeAgo from "../utils/TimeAgoComponent";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, clearAll } = useSocket();
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        markAllAsRead();
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
  }, [isOpen]);

  const handleOpenBell = () => {
    setIsOpen(!isOpen);

    markAllAsRead();
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button onClick={handleOpenBell} className="relative p-2 text-text">
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-black">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      notification.read ? "bg-gray-50" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 border border-gray-400 rounded-full overflow-hidden ">
                        <img
                          className="w-full h-full object-cover"
                          src={notification.data.sentBy?.avatar || null}
                          alt="avatar"
                        />
                      </div>
                      <div className="">
                        <p className="text-sm font-medium text-gray-800">
                          {notification.message}
                        </p>
                        <div className="flex gap-2 items-center">
                          {notification.data.imageUrl && (
                            <div className="flex-shrink-0 w-10 h-10 border border-gray-400 overflow-hidden ">
                              <img
                                src={notification.data.imageUrl}
                                alt="imageUrl"
                              />
                            </div>
                          )}
                          {notification.data.content && (
                            <span className=" text-gray-600 text-sm line-clamp-2   ">
                              "{notification.data.content}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="flex justify-end  text-xs text-gray-500 mt-1">
                      <TimeAgo dateString={notification.createdAt} />
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
