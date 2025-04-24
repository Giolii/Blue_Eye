import axios from "axios";
import SharedPost from "./SharedPost";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { usePosts } from "../contexts/PostContext";
import { useToast } from "../contexts/NotificationContext";

const SharePostModal = ({ setOpenModal, post }) => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState("");
  const { addPost } = usePosts();
  const { errorToast, success } = useToast();

  const handleSharePost = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${post.id}/share`,
        { content: comment },
        { withCredentials: true }
      );
      addPost(response.data.post);
      success("Post shared");
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  return (
    <div
      className="z-50 fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setOpenModal(false)}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl max-w-lg w-full animate-[fadeIn_0.5s_ease-in-out] overflow-hidden p-4 space-y-4 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 flex gap-2 ">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-cyan-900 font-bold group relative overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={currentUser.avatar}
              alt="Avatar"
            />
          </div>
          <input
            className="flex-1  text-text outline-0 text-xl"
            placeholder="Add a comment"
            type="text"
            autoFocus
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <SharedPost post={post} />
        <div className="w-full flex justify-center p-2 gap-2">
          <button
            className="px-4 py-2 bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
            onClick={() => handleSharePost()}
          >
            Share
          </button>
          <button
            className="px-4 py-2 bg-zinc-600 dark:bg-zinc-700 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-600 focus:ring-opacity-50"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePostModal;
