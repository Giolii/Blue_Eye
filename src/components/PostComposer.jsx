import { useState } from "react";
import { usePosts } from "../contexts/PostContext";
import { Send, Image, ImagePlay, X } from "lucide-react";

const PostComposer = () => {
  const [postDraft, setPostDraft] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { createPost } = usePosts();
  const charLimit = 280;

  const handleSubmitPost = async () => {
    if (postDraft.trim() === "" || postDraft.length > charLimit) return;

    try {
      await createPost(postDraft);
      setPostDraft("");
      setIsExpanded(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPost();
    }
  };

  const characterCount = postDraft.length;
  const isOverLimit = characterCount > charLimit;

  return (
    <div className="bg-gradient-to-r from-cyan-800 to-cyan-900 rounded-xl shadow-lg p-4 mb-6 transition-all duration-300">
      <div className="flex flex-col gap-3">
        {/* Text area for post composition */}
        <div
          className="relative w-full"
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <textarea
            value={postDraft}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            onChange={(e) => setPostDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            className={`w-full p-3 rounded-lg bg-cyan-950/50 text-amber-50 placeholder-amber-50/50 border ${
              isOverLimit
                ? "border-red-500"
                : "border-amber-50/20 focus:border-amber-50/60"
            } outline-none resize-none transition-all duration-200 ${
              isExpanded ? "h-24" : "h-12"
            }`}
            rows={isExpanded ? 3 : 1}
          />

          {/* Character counter */}
          <div
            className={`absolute bottom-2 right-3 text-xs ${
              isOverLimit ? "text-red-400" : "text-amber-50/60"
            }`}
          >
            {characterCount}/{charLimit}
          </div>
        </div>

        {/* Action buttons */}
        <div className={`flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full text-amber-50 hover:bg-cyan-700/50 transition-colors"
              title="Add image"
            >
              <Image size={18} />
            </button>
            <button
              className="p-2 rounded-full text-amber-50 hover:bg-cyan-700/50 transition-colors"
              title="Add GIF"
            >
              <ImagePlay size={18} />
            </button>
          </div>

          <button
            onClick={handleSubmitPost}
            disabled={postDraft.trim() === "" || isOverLimit}
            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
              postDraft.trim() === "" || isOverLimit
                ? "bg-cyan-600/50 text-amber-50/50 cursor-not-allowed"
                : "bg-cyan-400 text-cyan-950 hover:bg-cyan-300"
            }`}
          >
            <span>{isExpanded ? "Post" : ""}</span>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComposer;
