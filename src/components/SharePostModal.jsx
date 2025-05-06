import axios from "axios";
import SharedPost from "./SharedPost";
import { useAuth } from "../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { usePosts } from "../contexts/PostContext";
import { useToast } from "../contexts/NotificationContext";
import { Share2, X } from "lucide-react";
import { createPortal } from "react-dom";

const SharePostModal = ({ setOpenModal, post }) => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState("");
  const { addPost } = usePosts();
  const { errorToast, success } = useToast();
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when modal opens
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }

    // Close modal on escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpenModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setOpenModal]);

  const handleSharePost = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${post.id}/share`,
        { content: comment },
        { withCredentials: true }
      );
      addPost(response.data.post);
      success("Post shared successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      errorToast(error.message || "Failed to share post");
    }
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setOpenModal(false);
    }
  };

  return createPortal(
    <div
      className=" z-50 fixed inset-0 flex items-center justify-center p-4 
                 bg-slate-900/70 dark:bg-slate-950/80 
                 backdrop-blur-sm transition-all duration-300"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-slate-100/95 to-slate-200/95 
                   dark:from-slate-800/95 dark:to-slate-900/95 
                   rounded-xl shadow-2xl max-w-lg w-full 
                   animate-[fadeIn_0.3s_ease-out] overflow-hidden 
                   border border-slate-300/30 dark:border-slate-700/30"
      >
        {/* Modal header */}
        <div
          className="p-4 border-b border-slate-300/30 dark:border-slate-700/30 
                        flex justify-between items-center"
        >
          <h3
            className="text-lg font-semibold text-slate-700 dark:text-slate-200 
                         flex items-center gap-2"
          >
            <Share2 size={18} className="text-sky-500 dark:text-sky-400" />
            <span>Share Post</span>
          </h3>
          <button
            onClick={() => setOpenModal(false)}
            className="text-slate-500 dark:text-slate-400 
                       hover:text-slate-700 dark:hover:text-slate-200 
                       p-1.5 rounded-lg 
                       hover:bg-slate-300/30 dark:hover:bg-slate-700/30 
                       transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-5 space-y-4">
          {/* User input area */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div
                className="w-12 h-12 rounded-full 
                              bg-gradient-to-br from-sky-400 to-indigo-500 
                              dark:from-sky-500 dark:to-indigo-600 
                              overflow-hidden 
                              ring-2 ring-sky-200/50 dark:ring-indigo-500/30 
                              hover:ring-sky-400/50 dark:hover:ring-indigo-400/50 
                              shadow-md transition-all duration-200"
              >
                <img
                  className="w-full h-full object-cover"
                  src={currentUser.avatar}
                  alt={`${currentUser.name || currentUser.username}'s avatar`}
                />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                ref={inputRef}
                className="w-full bg-white/70 dark:bg-slate-700/70 
                           text-slate-700 dark:text-slate-200 
                           placeholder-slate-500/60 dark:placeholder-slate-400/60 
                           rounded-lg px-3 py-2.5 
                           border border-slate-300/50 dark:border-slate-600/50 
                           focus:border-sky-400/60 dark:focus:border-sky-500/60 
                           outline-none resize-none min-h-20 shadow-inner 
                           transition-all duration-200"
                placeholder="Add your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          {/* Original post to share */}
          <div
            className="border border-slate-300/30 dark:border-slate-700/30 
                          rounded-xl overflow-hidden shadow-md"
          >
            <SharedPost post={post} />
          </div>
        </div>

        {/* Modal footer with action buttons */}
        <div
          className="p-4 border-t border-slate-300/30 dark:border-slate-700/30 
                        flex justify-end gap-3"
        >
          <button
            onClick={() => setOpenModal(false)}
            className="px-4 py-2 rounded-lg 
                       border border-slate-300/60 dark:border-slate-600/60 
                       text-slate-700 dark:text-slate-300 
                       hover:bg-slate-200/70 dark:hover:bg-slate-700/70 
                       transition-all duration-200 text-sm 
                       focus:outline-none focus:ring-2 
                       focus:ring-slate-400/50 dark:focus:ring-slate-500/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSharePost}
            className="px-5 py-2 rounded-lg 
                       bg-gradient-to-r from-sky-500 to-indigo-500 
                       dark:from-sky-600 dark:to-indigo-600 
                       text-white 
                       hover:from-sky-600 hover:to-indigo-600 
                       dark:hover:from-sky-500 dark:hover:to-indigo-500 
                       transition-all duration-200 text-sm font-medium 
                       flex items-center gap-1.5 
                       focus:outline-none focus:ring-2 
                       focus:ring-sky-400/50 dark:focus:ring-sky-500/50 
                       active:scale-95 shadow-md"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SharePostModal;
