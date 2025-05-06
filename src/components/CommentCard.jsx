import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import CommentActions from "./CommentActions";
import SpringDiv from "./reusable/SpringDiv";
import { Check, X, Clock } from "lucide-react";
import { usePosts } from "../contexts/PostContext";
import TimeAgo from "../utils/TimeAgoComponent";
import { Link } from "react-router-dom";

const CommentCard = ({ comment, setPostPage }) => {
  const [editComment, setEditComment] = useState(false);
  const [commentDraft, setCommentDraft] = useState(comment.content);
  const { currentUser } = useAuth();
  const { updateComment } = usePosts();

  const handleUpdateComment = async () => {
    if (!commentDraft.trim()) return;
    if (commentDraft === comment.content) return;

    try {
      updateComment(commentDraft, comment, setPostPage);
      setEditComment(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputKeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdateComment();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      resetInput();
    }
  };

  const resetInput = () => {
    setCommentDraft(comment.content);
    setEditComment(false);
  };

  const isCurrentUser = currentUser.id === comment.userId;

  return (
    <SpringDiv>
      <div className="group mb-2.5 overflow-hidden">
        <div
          className="flex gap-2 p-2.5 rounded-xl 
                      bg-slate-200/60 dark:bg-slate-700/60 
                      border border-slate-300/30 dark:border-slate-700/30 
                      hover:border-slate-400/50 dark:hover:border-slate-600/50 
                      transition-all duration-200 shadow-sm"
        >
          {/* User avatar */}
          <Link to={`/users/${comment.userId}`} className="flex-shrink-0">
            <div
              className="w-8 h-8 rounded-full overflow-hidden 
                          ring-1 ring-slate-300/50 dark:ring-slate-600/50 
                          group-hover:ring-sky-400/50 dark:group-hover:ring-indigo-500/50 
                          transition-all duration-200 shadow-sm"
            >
              <img
                src={comment.user.avatar}
                alt={`${comment.user.name || comment.user.username}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            {/* Comment header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Link
                  to={`/users/${comment.userId}`}
                  className="font-medium text-slate-700 dark:text-slate-200 
                           hover:text-sky-600 dark:hover:text-sky-400 
                           transition-colors duration-200 text-sm truncate"
                >
                  {comment.user.name || comment.user.username}
                </Link>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  @{comment.user.username}
                </span>
                {isCurrentUser && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full 
                                 bg-slate-300/70 dark:bg-slate-600/70 
                                 text-sky-600 dark:text-sky-400 
                                 border border-slate-300/40 dark:border-slate-600/40"
                  >
                    You
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-2">
                <Clock size={10} />
                <TimeAgo dateString={comment.createdAt} />
              </div>
            </div>

            {/* Comment content */}
            <div className="text-slate-700 dark:text-slate-200 text-sm break-words">
              {editComment ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full 
                             bg-white/70 dark:bg-slate-800/70 
                             text-slate-700 dark:text-slate-200 
                             placeholder-slate-500/60 dark:placeholder-slate-400/60 
                             rounded-lg px-2.5 py-1.5 
                             border border-slate-300/50 dark:border-slate-600/50 
                             focus:border-sky-400/70 dark:focus:border-sky-500/70 
                             outline-none resize-none min-h-8 shadow-inner 
                             transition-all duration-200"
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    onKeyDown={handleInputKeydown}
                    autoFocus
                    rows={2}
                  />

                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={resetInput}
                      className="p-1.5 rounded-md 
                               text-slate-500/80 dark:text-slate-400/80 
                               hover:text-rose-500 dark:hover:text-rose-400 
                               hover:bg-rose-100/30 dark:hover:bg-rose-900/20 
                               transition-all duration-200"
                      aria-label="Cancel edit"
                    >
                      <X size={14} />
                    </button>
                    <button
                      onClick={handleUpdateComment}
                      disabled={
                        !commentDraft.trim() || commentDraft === comment.content
                      }
                      className={`p-1.5 rounded-md transition-all duration-200 ${
                        !commentDraft.trim() || commentDraft === comment.content
                          ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                          : "text-sky-500 dark:text-sky-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-100/30 dark:hover:bg-emerald-900/20"
                      }`}
                      aria-label="Save edit"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between group">
                  <p className="py-0.5 whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  {isCurrentUser && (
                    <div className="ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <CommentActions
                        comment={comment}
                        setEditComment={setEditComment}
                        setPostPage={setPostPage}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SpringDiv>
  );
};

export default CommentCard;
