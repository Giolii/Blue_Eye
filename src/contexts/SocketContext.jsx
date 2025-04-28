import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "../contexts/AuthContext";
import io from "socket.io-client";
import axios from "axios";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Memoize loadNotifications to prevent unnecessary re-renders
  const loadNotifications = useCallback(async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        withCredentials: true,
      });

      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, [API_URL, currentUser]);

  // Initialize and manage socket connection
  useEffect(() => {
    const socketInstance = io(API_URL, { withCredentials: true });

    // Authentication events from your backend
    socketInstance.on("authenticated", (data) => {
      console.log("User authenticated:", data);
      loadNotifications();
    });

    // Notification event (this should be emitted from somewhere in your backend)
    socketInstance.on("notification", (data) => {
      console.log("Received notification:", data);

      const notificationWithId = {
        ...data,
        id: data.id || Date.now(),
        read: false,
      };

      setNotifications((prev) => [notificationWithId, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocket(null);
      }
    };
  }, [API_URL, loadNotifications]);

  // Notification management functions
  const markAllAsRead = async () => {
    const unreadCount = notifications.filter((notif) => !notif.read).length;
    // Optimistic update
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));

    setUnreadCount(0);

    try {
      await axios.put(
        `${API_URL}/notifications/readAll`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert optimistic update on error
      loadNotifications();
    }
  };

  const clearAll = async () => {
    // Optimistic update
    setNotifications([]);
    setUnreadCount(0);

    try {
      await axios.delete(`${API_URL}/notifications/clear`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error clearing notifications:", error);
      // Revert optimistic update on error
      loadNotifications();
    }
  };

  // Auto-load notifications when user changes
  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser, loadNotifications]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        loadNotifications,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
