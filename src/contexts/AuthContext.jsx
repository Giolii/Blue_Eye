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
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const verifyUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setCurrentUser(response.data.user);
      const response2 = await fetchFollowers(response.data.user.id);
      setFollowers(response2.followers);
      setFollowing(response2.following);
    } catch (error) {
      if (error.status !== 401) {
        console.error("User verification failed:", error);
      }
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
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

  const followUser = async (userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/${userId}/follow`,
        {},
        { withCredentials: true }
      );
      setFollowing((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error(error.response.data.error);
      setError(error.response?.data.message || "Failed to follow user");
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/${userId}/unfollow`,
        {},
        { withCredentials: true }
      );
      // it unfollow the user but it doesnt upload the ui
      setFollowing((prev) =>
        prev.filter((foll) => foll.followingId !== userId)
      );

      return response.data;
    } catch (error) {
      console.error(error.response?.data?.error);
      setError(error.response?.data.message || "Failed to follow user");
    }
  };

  const fetchFollowers = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/followers`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(error.response.data.error);
      setError(error.response?.data.message || "Failed to fetch followers");
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
    verifyUser,
    followUser,
    followers,
    following,
    unfollowUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
