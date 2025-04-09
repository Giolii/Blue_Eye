// TODO: Change localStorage with http cookies

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/auth/me`);
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Token verification failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = async (emailOrUsername, password) => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/login`, {
        emailOrUsername,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);

      setToken(token);
      setCurrentUser(user);

      return user;
    } catch (error) {
      setError(error.response?.data.message || "Failed to login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/guest`);

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      setToken(token);
      setCurrentUser(user);

      return user;
    } catch (error) {
      setError(error.response?.data.message || "Failed to login as a guest");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      setError(error.response?.data.message) || "Failed to register";
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    currentUser,
    token,
    error,
    loading,
    login,
    guestLogin,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
