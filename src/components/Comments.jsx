import { useRef, useState } from "react";
import { usePosts } from "../contexts/PostContext";
import CommentCard from "./CommentCard";

const Comments = ({ post, setPostPage }) => {
  const [draftComment, setDraftComment] = useState("");
  const { sendComment } = usePosts();
  const commentsRef = useRef(null);

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
    }
  };

  const handleInputChange = (e) => {
    setDraftComment(e.target.value);
  };

  return (
    <div>
      <div
        className="max-h-[170px] overflow-hidden overflow-y-scroll"
        ref={commentsRef}
      >
        {post?.comments &&
          post.comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              setPostPage={setPostPage}
            />
          ))}
      </div>

      <div className="text-white border border-gray-400 p-2 rounded-xl flex justify-around gap-2">
        <input
          className="text-white rounded-xl border border-amber-50"
          type="text"
          placeholder="Reply"
          value={draftComment}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSendComment}
          className="border border-gray-400 p-2 rounded-xl "
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default Comments;
