import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../contexts/AuthContext";
import io from "socket.io-client";
import axios from "axios";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { currentUser } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

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

  // Socket connection management
  useEffect(() => {
    let socketInstance = null;

    if (currentUser) {
      // Only connect when user is authenticated
      socketInstance = io(API_URL, { withCredentials: true });

      // Connection events
      socketInstance.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Connection error:", err);
        setIsConnected(false);
      });

      // Authentication events
      socketInstance.on("authenticated", (data) => {
        console.log("User authenticated:", data);
        loadNotifications();
      });
      // Notification events
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
    }
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [currentUser, API_URL, loadNotifications]);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser, loadNotifications]);

  const markAsRead = async (notificationId) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
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

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead,
    clearAll,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
