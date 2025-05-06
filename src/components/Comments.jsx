import { useRef, useState } from "react";
import { usePosts } from "../contexts/PostContext";
import CommentCard from "./CommentCard";
import { Send, X } from "lucide-react";

const Comments = ({ post, setPostPage }) => {
  const [draftComment, setDraftComment] = useState("");
  const { sendComment } = usePosts();
  const commentsRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    if (commentsRef.current) {
      // Using a slight delay to ensure the new comment is rendered
      setTimeout(() => {
        commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
      }, 100);
    }
  };

  const handleSendComment = async () => {
    try {
      if (!draftComment.trim()) return;
      sendComment(draftComment, post, setPostPage);
      setDraftComment("");
      scrollToBottom();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.target.blur();
      setDraftComment("");
    }
  };

  const handleInputChange = (e) => {
    setDraftComment(e.target.value);
  };

  const handleClearInput = () => {
    setDraftComment("");
    inputRef.current?.focus();
  };

  return (
    <div className="mt-2 mb-3">
      {/* Comments list */}
      <div
        className="max-h-60 overflow-y-auto pr-1 mb-3 
                 scrollbar-thin 
                 scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 
                 scrollbar-track-transparent"
        ref={commentsRef}
      >
        {post?.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              setPostPage={setPostPage}
            />
          ))
        ) : (
          <div className="text-slate-500 dark:text-slate-400 text-center py-3 text-sm italic">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>

      {/* Comment input */}
      <div
        className="border border-slate-300/30 dark:border-slate-700/40 
                    bg-slate-200/50 dark:bg-slate-700/50 
                    p-3 rounded-xl flex items-center gap-2 
                    shadow-sm transition-all duration-300 
                    focus-within:border-sky-400/60 dark:focus-within:border-sky-500/60 
                    focus-within:shadow-md"
      >
        <div className="relative flex-1">
          <textarea
            className="w-full 
                     bg-white/70 dark:bg-slate-800/70 
                     text-slate-700 dark:text-slate-200 
                     placeholder-slate-500/60 dark:placeholder-slate-400/60 
                     rounded-lg px-3 py-2 
                     border border-slate-300/40 dark:border-slate-600/40 
                     focus:border-sky-400/60 dark:focus:border-sky-500/60 
                     outline-none resize-none h-10 
                     transition-all duration-300 focus:h-16 shadow-inner"
            placeholder="Add a reply..."
            value={draftComment}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            rows={1}
          />
          {draftComment && (
            <button
              onClick={handleClearInput}
              className="absolute right-3 top-2.5 
                       text-slate-400 hover:text-slate-600 
                       dark:text-slate-500 dark:hover:text-slate-300 
                       transition-colors duration-200"
              aria-label="Clear input"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={handleSendComment}
          disabled={!draftComment.trim()}
          className={`p-2.5 rounded-lg transition-all duration-200 
                    flex items-center justify-center ${
                      !draftComment.trim()
                        ? "bg-slate-300/50 dark:bg-slate-700/50  text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-sky-500 to-indigo-500  dark:from-sky-600 dark:to-indigo-600  text-white hover:from-sky-600 hover:to-indigo-600  dark:hover:from-sky-500 dark:hover:to-indigo-500  active:scale-95 shadow-sm  hover:shadow-sky-400/20 dark:hover:shadow-indigo-500/20"
                    }`}
          aria-label="Send reply"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default Comments;
