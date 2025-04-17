import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};

const API_URL = import.meta.env.VITE_API_URL;

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/posts`, {
        params: { page, limit },
        withCredentials: true,
      });
      const data = res.data;
      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content) => {
    try {
      const res = await axios.post(
        `${API_URL}/posts`,
        { content },
        {
          withCredentials: true,
        }
      );
      setPosts([res.data.post, ...posts]);
      return res.data.post;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updatePost = async (id, content) => {
    try {
      const res = await axios.put(
        `${API_URL}/posts/${id}`,
        { content: content },
        {
          withCredentials: true,
        }
      );
      setPosts(posts.map((post) => (post.id === id ? res.data.post : post)));
      return res.data.post;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deletePost = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/posts/${id}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Still not sure i am gonna use these functions
  // May need them if just modifying state isn't enough and I need more up-to-date data

  const fetchSinglePost = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/posts/${id}`, content, {
        withCredentials: true,
      });
      return res.data.post;
    } catch (error) {}
  };

  const fetchUserPost = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/posts/${id}`, content, {
        withCredentials: true,
      });
      return res.data.post;
    } catch (error) {}
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
