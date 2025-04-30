import { MoreVertical, Pencil, UndoIcon, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { usePosts } from "../contexts/PostContext";
import SpringDiv from "./reusable/SpringDiv";

const CommentActions = ({ comment, setEditComment }) => {
  const [showActions, setShowActions] = useState(false);
  const { setPosts } = usePosts();

  const handleDelete = async () => {
    try {
      const repsonse = await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${comment.postId}/comments/${
          comment.id
        }`,
        { withCredentials: true }
      );
      setPosts((prev) => {
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
