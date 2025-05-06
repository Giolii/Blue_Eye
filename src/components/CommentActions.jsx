import { MoreVertical, Pencil, UndoIcon, X } from "lucide-react";
import { useState } from "react";
import { usePosts } from "../contexts/PostContext";
import SpringDiv from "./reusable/SpringDiv";

const CommentActions = ({ comment, setEditComment, setPostPage }) => {
  const [showActions, setShowActions] = useState(false);
  const { deleteComment } = usePosts();

  const handleDelete = async () => {
    try {
      deleteComment(comment, setPostPage);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <SpringDiv>
      <div className="flex gap-2">
        {showActions ? (
          <>
            <button
              onClick={handleDelete}
              className="p-1 rounded hover:bg-rose-100/40 dark:hover:bg-rose-900/30 
                       transition-colors duration-200"
              aria-label="Delete comment"
            >
              <X className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            </button>
            <button
              onClick={() => setEditComment(true)}
              className="p-1 rounded hover:bg-sky-100/40 dark:hover:bg-sky-900/30 
                       transition-colors duration-200"
              aria-label="Edit comment"
            >
              <Pencil className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            </button>
            <button
              onClick={() => setShowActions(false)}
              className="p-1 rounded hover:bg-slate-200/70 dark:hover:bg-slate-700/70 
                       transition-colors duration-200"
              aria-label="Cancel"
            >
              <UndoIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowActions(true)}
            className="p-1 rounded hover:bg-slate-200/70 dark:hover:bg-slate-700/70 
                     transition-colors duration-200"
            aria-label="Show comment actions"
          >
            <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        )}
      </div>
    </SpringDiv>
  );
};

export default CommentActions;
