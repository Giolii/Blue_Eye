import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import CommentActions from "./CommentActions";
import SpringDiv from "./reusable/SpringDiv";
import { Check, Undo } from "lucide-react";
import { usePosts } from "../contexts/PostContext";
import axios from "axios";
import TimeAgo from "../utils/TimeAgoComponent";

const CommentCard = ({ comment }) => {
  const [editComment, setEditComment] = useState(false);
  const [commentDraft, setCommentDraft] = useState(comment.content);
  const { currentUser } = useAuth();
  const { setPosts } = usePosts();

  const handleUpdateComment = async () => {
    if (!commentDraft.trim()) return;
    if (commentDraft === comment.content) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/posts/${comment.postId}/comments/${
          comment.id
        }`,
        { content: commentDraft },
        { withCredentials: true }
      );
      setEditComment(false);
      // Backend. keep it on the same position even if updated at@
      setPosts((prev) => {
        const updatedPosts = [...prev];
        const postIndex = updatedPosts.findIndex(
          (post) => post.id === comment.postId
        );
        const commentIndex = updatedPosts[postIndex].comments.findIndex(
          (comm) => (comm.id = comment.id)
        );
        updatedPosts[postIndex].comments[commentIndex] = response.data;
        return updatedPosts;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputKeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleUpdateComment();
    if (e.key === "Escape" && !e.shiftKey) resetInput();
  };

  const resetInput = () => {
    setCommentDraft(comment.content);
    setEditComment(false);
  };

  return (
    <SpringDiv>
      <div className="flex flex-col border border-gray-400 p-2 rounded-2xl relative">
        <div className=" flex items-start gap-1">
          <div>
            <img
              src={comment.user.avatar}
              alt=""
              className="w-6 rounded-full object-cover border border-gray-400"
            />
          </div>
          <div className="flex flex-col w-full ">
            <div className="flex items-center gap-1">
              <p className="text-white text-sm font-bold ">
                {comment.user.name || comment.user.username}
              </p>
              <p className="text-xs text-gray-400 font-light">
                @{comment.user.username}
              </p>
              <p className="absolute top-0 right-2">
                <TimeAgo dateString={comment.createdAt} />
              </p>
            </div>
            <div className="text-white  flex justify-between items-center ">
              {editComment ? (
                <input
                  className="border border-amber-100 p-1 rounded-xl"
                  type="text"
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  onKeyDown={handleInputKeydown}
                  autoFocus
                  autoComplete="off"
                />
              ) : (
                <p>{comment.content}</p>
              )}
              {currentUser.id === comment.userId &&
                (editComment ? (
                  <>
                    <button onClick={handleUpdateComment}>
                      <Check className="w-4 text-green-500" />
                    </button>
                    <button onClick={() => resetInput()}>
                      <Undo className="w-4" />
                    </button>
                  </>
                ) : (
                  <CommentActions
                    comment={comment}
                    setEditComment={setEditComment}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </SpringDiv>
  );
};

export default CommentCard;
