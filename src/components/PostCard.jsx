import { Heart, MessageCircle, Share, Clock } from "lucide-react";
import timeAgo from "../utils/timeAgo";
import DotsMenu from "./DotsMenu";
import { useRef, useState } from "react";
import { usePosts } from "../contexts/PostContext";
import ProfileTooltip from "./reusable/ProfileTooltip";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const PostCard = ({ post, setPostsPage }) => {
  const [editPost, setEditPost] = useState(false);
  const [editDraft, setEditDraft] = useState(post.content);
  const editRef = useRef(null);
  const { updatePost, deletePost } = usePosts();
  const { currentUser } = useAuth();

  const handleUpdate = async () => {
    try {
      if (editDraft === post.content) return;
      if (!editDraft.trim()) return handleCancel();
      const response = await updatePost(post.id, editDraft, setPostsPage);
      setEditPost(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancel = () => {
    setEditDraft(post.content);
    setEditPost(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCancel();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    }
  };

  const handleDeletePost = async () => {
    deletePost(post.id, setPostsPage);
  };

  return (
    <>
      <div className="flex items-start gap-3 relative border border-gray-400 p-2 rounded-xl">
        {/* Avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-cyan-900 font-bold group relative overflow-hidden">
          {post.user && (
            <img
              className="w-full h-full object-cover"
              src={post.user.avatar}
              alt="Avatar"
            />
          )}
          {currentUser.id !== post.userId && (
            <ProfileTooltip user={post.user} />
          )}
        </div>
        <div className="flex-1">
          {/* Post header */}
          <div className="flex items-center justify-between mb-1 ">
            <div className="flex flex-col items-center ">
              <Link
                className="font-semibold text-amber-50"
                to={`/users/${post.userId}`}
              >
                {post.user ? post.user.username : "Unknown User"}
              </Link>
              <span className="text-amber-50/50 text-xs flex items-center gap-1">
                @{post.user && post.user.username}
              </span>
            </div>
            <DotsMenu
              onEdit={() => setEditPost(true)}
              onDelete={handleDeletePost}
              post={post}
            />
            <span className="text-amber-50/50 text-xs flex items-center gap-1 absolute bottom-0 right-0 p-2">
              <Clock size={12} />
              {post.createdAt ? timeAgo(post.createdAt) : "Just now"}
            </span>
          </div>

          {/* Post content */}
          <div className="overflow-hidden transition-all duration-300 ease-in-out mb-3">
            {editPost ? (
              <>
                {/* Edit mode */}
                <div ref={editRef} className="transition-opacity duration-300">
                  <div className="flex flex-col gap-2">
                    <input
                      className="outline-none border border-blue-900 bg-gray-700 px-2 py-1 rounded-xl text-white"
                      type="text"
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus={editPost}
                    />
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <button
                        className="text-white border px-2 rounded-xl hover:bg-gray-600"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                      <button
                        className="text-white border px-2 rounded-xl hover:bg-gray-600"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* View mode */}
                <div className="transition-opacity duration-300">
                  <div className="text-amber-50 whitespace-pre-wrap break-words p-2">
                    {post.content}
                  </div>
                  {post.imageUrl && (
                    <div className="bg-gray-50 flex justify-center  border border-gray-400 rounded-xl overflow-hidden">
                      <img src={post.imageUrl} alt="Picture" />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Post actions */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-amber-50/70 hover:text-pink-400 transition-colors">
              <Heart size={18} />
              <span className="text-xs">{post.likes || 0}</span>
            </button>
            <button className="flex items-center gap-1 text-amber-50/70 hover:text-cyan-400 transition-colors">
              <MessageCircle size={18} />
              <span className="text-xs">{post.comments?.length || 0}</span>
            </button>
            <button className="flex items-center gap-1 text-amber-50/70 hover:text-amber-400 transition-colors">
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
