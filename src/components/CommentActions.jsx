import { MoreVertical, Pencil, UndoIcon, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
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
      <div className="flex gap-2 ">
        {showActions ? (
          <>
            <button onClick={handleDelete}>
              <X className="w-4 text-red-600" />
            </button>
            <button onClick={() => setEditComment(true)}>
              <Pencil className="w-4 text-amber-400" />
            </button>
            <button onClick={() => setShowActions(false)}>
              <UndoIcon className="w-4 " />
            </button>
          </>
        ) : (
          <button onClick={() => setShowActions(true)}>
            <MoreVertical className="w-4 text-gray-400" />
          </button>
        )}
      </div>
    </SpringDiv>
  );
};

export default CommentActions;
