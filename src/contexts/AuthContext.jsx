import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        if (error.status !== 401) {
          console.error("User verification failed:", error);
        }
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          emailOrUsername,
          password,
        },
        { withCredentials: true }
      );
      const { user } = response.data;

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

      const response = await axios.post(
        `${API_URL}/auth/guest`,
        {},
        { withCredentials: true }
      );

      const { user } = response.data;

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

      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data.message || "Failed to register");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setCurrentUser(null);
    } catch (error) {
      setError(error.response?.data.message || "Logout error");
    }
  };

  const value = {
    currentUser,
    error,
    loading,
    login,
    guestLogin,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
