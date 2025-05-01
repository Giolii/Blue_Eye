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

  const createPost = async (content, imageUrl) => {
    try {
      const res = await axios.post(
        `${API_URL}/posts`,
        { content, imageUrl },
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

  const updatePost = async (id, content, setPostsPage = setPosts) => {
    try {
      const res = await axios.put(
        `${API_URL}/posts/${id}`,
        { content: content },
        {
          withCredentials: true,
        }
      );
      setPostsPage((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? res.data.post : post))
      );
      return res.data.post;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deletePost = async (id, setPostsPage = setPosts) => {
    try {
      const res = await axios.delete(`${API_URL}/posts/${id}`, {
        withCredentials: true,
      });
      setPostsPage((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Still not sure i am gonna use these functions
  // May need them if just modifying state isn't enough and I need more up-to-date data

  const fetchSinglePost = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/posts/${id}`, {
        withCredentials: true,
      });
      return res.data.post;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const fetchUserPost = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/posts/users/${id}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const fetchUserById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/users/${id}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const addPost = async (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const sendComment = async (draftComment, post, setPostsPage = setPosts) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${post.id}/comments`,
        { content: draftComment },
        { withCredentials: true }
      );
      const newComment = response.data;
      setPostsPage((prev) => {
        const updatedPosts = [...prev];
        const postIndex = updatedPosts.findIndex((p) => p.id === post.id);
        if (postIndex !== -1) {
          updatedPosts[postIndex] = {
            ...updatedPosts[postIndex],
            comments: [...updatedPosts[postIndex].comments, newComment],
          };
        }
        return updatedPosts;
      });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };
  const updateComment = async (
    commentDraft,
    comment,
    setPostsPage = setPosts
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/posts/${comment.postId}/comments/${
          comment.id
        }`,
        { content: commentDraft },
        { withCredentials: true }
      );

      setPostsPage((prev) => {
        const updatedPosts = [...prev];
        const postIndex = updatedPosts.findIndex(
          (post) => post.id === comment.postId
        );
        const commentIndex = updatedPosts[postIndex].comments.findIndex(
          (comm) => comm.id === comment.id
        );
        if (postIndex !== -1) {
          updatedPosts[postIndex].comments[commentIndex].content = commentDraft;
        }
        return updatedPosts;
      });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };
  const deleteComment = async (comment, setPostsPage = setPosts) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${comment.postId}/comments/${
          comment.id
        }`,
        { withCredentials: true }
      );
      setPostsPage((prev) => {
        const updatedPosts = [...prev];
        const postIndex = updatedPosts.findIndex(
          (post) => post.id === comment.postId
        );
        updatedPosts[postIndex] = {
          ...updatedPosts[postIndex],
          comments: [
            ...updatedPosts[postIndex].comments.filter(
              (comm) => comm.id !== comment.id
            ),
          ],
        };
        return updatedPosts;
      });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        loading,
        error,
        fetchPosts,
        fetchSinglePost,
        fetchUserPost,
        fetchUserById,
        createPost,
        updatePost,
        deletePost,
        addPost,
        sendComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
