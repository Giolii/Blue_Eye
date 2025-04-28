import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import io from "socket.io-client";
import axios from "axios";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  // Load initial notifications when authenticated, it doesnt.
  // do it on login or on bell component

  const loadNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        withCredentials: true,
      });

      const data = response.data;
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const connectSocket = () => {
    const socketInstance = io(API_URL || "http://localhost:3000", {
      withCredentials: true,
    });

    socketInstance.on("authenticated", (data) => {
      console.log("User authenticated:", data);
      loadNotifications(); // Load notifications only when authenticated
    });

    socketInstance.on("anonymous", () => {
      console.log("Connected as anonymous");
      setNotifications([]);
      setUnreadCount(0);
    });

    socketInstance.on("notification", (data) => {
      console.log("Received notification:", data);

      // Ensure the notification has an ID and read status
      const notificationWithId = {
        ...data,
        id: data.id || Date.now(),
        read: false,
      };

      setNotifications((prev) => [notificationWithId, ...prev]);
      setUnreadCount((prev) => prev + 1); // Increment unread count
    });

    setSocket(socketInstance);
    return socketInstance;
  };

  useEffect(() => {
    const socketInstance = connectSocket();

    return () => {
      socketInstance.off("notification");
      socketInstance.off("authenticated");
      socketInstance.off("anonymous");
      socketInstance.disconnect();
    };
  }, []);

  const reconnect = () => {
    if (socket) {
      socket.disconnect();
    }
    connectSocket();
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        {
          withCredentials: true,
        }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearAll = async () => {
    try {
      const response = await axios.delete(`${API_URL}/notifications/clear`, {
        withCredentials: true,
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        loadNotifications,
        notifications,
        unreadCount,
        setNotifications,
        markAsRead,
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
