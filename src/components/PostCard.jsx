import {
  Handshake,
  Timer,
  UserPlus,
  Check,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import DotsMenu from "./DotsMenu";
import { useState } from "react";
import { usePosts } from "../contexts/PostContext";
import ProfileTooltip from "./reusable/ProfileTooltip";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PostActions from "./PostActions";
import SharedPost from "./SharedPost";
import TimeAgo from "../utils/TimeAgoComponent";
import Comments from "./Comments";

const PostCard = ({ post, setPostsPage, openComments = false }) => {
  const [editPost, setEditPost] = useState(false);
  const [editDraft, setEditDraft] = useState(post.content);
  const [showComments, setShowComments] = useState(openComments);
  const { updatePost, deletePost } = usePosts();
  const { currentUser, followUser, followers, following, unfollowUser } =
    useAuth();
  const navigate = useNavigate();

  const handleUpdate = async () => {
    try {
      if (editDraft === post.content) return;
      if (!editDraft.trim() && !post.imageUrl && !post.originalPost)
        return handleCancel();
      await updatePost(post.id, editDraft, setPostsPage);
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

  const handleFollowUser = async (userId) => {
    await followUser(userId);
  };

  const handleUnfollowUser = async (userId) => {
    await unfollowUser(userId);
  };

  const isFollowing = following.find(
    (foll) => foll.followingId === post.userId
  );

  const isCurrentUser = currentUser.id === post.userId;

  return (
    <div className="mb-4">
      <div
        className="relative flex gap-3 border border-slate-300/20 dark:border-slate-700/30 p-4 rounded-xl 
                    bg-gradient-to-br from-slate-100/90 to-blue-100/90 
                    dark:from-slate-800/90 dark:to-slate-900/90 
                    shadow-md backdrop-filter backdrop-blur-sm 
                    transition-all duration-300"
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full 
                        bg-gradient-to-br from-sky-400 to-indigo-500 
                        dark:from-sky-500 dark:to-indigo-600 
                        text-slate-800 dark:text-slate-200 font-bold 
                        group relative overflow-hidden shadow-lg 
                        ring-2 ring-sky-200/50 dark:ring-indigo-500/30 
                        hover:ring-sky-400/50 dark:hover:ring-indigo-400/50 
                        transition-all duration-300"
          >
            {post.user && (
              <Link to={`/users/${post.userId}`}>
                <img
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  src={post.user.avatar}
                  alt={`${post.user.name || post.user.username}'s avatar`}
                />
              </Link>
            )}
            {/* Profile tooltip only for other users */}
            {!isCurrentUser && <ProfileTooltip user={post.user} />}
          </div>
        </div>

        <div className="flex-1 flex flex-col ">
          {/* Post header */}
          <div className="flex justify-between mb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Link
                  className="font-semibold text-slate-800 dark:text-slate-200 
                           hover:text-sky-600 dark:hover:text-sky-400 
                           transition-colors duration-200 truncate max-w-[100px] sm:max-w-[200px] inline-block"
                  to={`/users/${post.userId}`}
                >
                  {post.user.name || post.user.username || "Anonymous"}
                </Link>

                {isCurrentUser ? (
                  <span
                    className="bg-gradient-to-r from-amber-200 to-amber-300 
                                dark:from-amber-300 dark:to-amber-400 
                                text-amber-800 dark:text-amber-900 
                                rounded-full px-2 py-0.5 text-xs font-medium"
                  >
                    You
                  </span>
                ) : isFollowing ? (
                  <button
                    className="flex items-center gap-1 
                             text-sky-600 dark:text-sky-400 
                             hover:text-indigo-500 dark:hover:text-indigo-400 
                             transition-colors duration-200 rounded-full 
                             px-2 py-0.5 text-xs 
                             bg-sky-100/70 dark:bg-slate-700/60 
                             hover:bg-indigo-100/70 dark:hover:bg-slate-700/80 
                             border border-sky-200/60 dark:border-slate-600/60 
                             hover:border-indigo-300/60 dark:hover:border-indigo-500/40"
                    onClick={() => handleUnfollowUser(post.userId)}
                    aria-label="Unfollow user"
                  >
                    <Handshake className="w-3 h-3" />
                    <span>Following</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-1 
                             text-slate-600 dark:text-slate-300 
                             hover:text-sky-600 dark:hover:text-sky-400 
                             transition-colors duration-200 rounded-full 
                             px-2 py-0.5 text-xs 
                             bg-slate-200/60 dark:bg-slate-700/60 
                             hover:bg-sky-100/70 dark:hover:bg-slate-700/80 
                             border border-slate-300/50 dark:border-slate-600/50 
                             hover:border-sky-300/50 dark:hover:border-sky-500/40"
                    onClick={() => handleFollowUser(post.userId)}
                    aria-label="Follow user"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Follow</span>
                  </button>
                )}
              </div>
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                @{post.user && post.user.username}
              </span>
            </div>

            <DotsMenu
              onEdit={() => setEditPost(true)}
              onDelete={handleDeletePost}
              post={post}
            />
          </div>

          {/* Post content */}
          <div className="mb-3">
            {editPost ? (
              <div
                className="transition-all duration-300 
                            bg-slate-200/50 dark:bg-slate-700/40 
                            p-3 rounded-xl 
                            border border-slate-300/50 dark:border-slate-600/50"
              >
                <div className="flex flex-col gap-3">
                  <textarea
                    className="w-full outline-none 
                             border border-slate-300/80 dark:border-slate-600/80 
                             bg-white/80 dark:bg-slate-800/90 
                             px-3 py-2 rounded-lg 
                             text-slate-700 dark:text-slate-200 
                             focus:border-sky-400/60 dark:focus:border-sky-500/60 
                             resize-none transition-all duration-200 min-h-24 shadow-inner"
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="px-3 py-1.5 rounded-lg 
                               text-slate-700 dark:text-slate-200 
                               border border-slate-300/70 dark:border-slate-600/70 
                               hover:bg-slate-200/70 dark:hover:bg-slate-700/70 
                               transition-all duration-200 text-sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg 
                               bg-sky-500 dark:bg-sky-600 
                               text-white 
                               hover:bg-sky-600 dark:hover:bg-sky-500 
                               transition-all duration-200 font-medium text-sm"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="text-slate-700 dark:text-slate-200 
                            whitespace-pre-wrap break-words mt-1 
                            transition-all duration-300"
              >
                <Link
                  to={`/posts/${post.id}`}
                  className="block hover:bg-slate-200/50 dark:hover:bg-slate-700/40 
                           rounded-lg p-2 transition-colors duration-200 overflow-hidden text-ellipsis break-all"
                >
                  {post.content}
                </Link>
              </div>
            )}

            {/* Shared Post */}
            {post.originalPost && (
              <div
                onClick={() => navigate(`/posts/${post.originalPost.id}`)}
                className="mt-3 cursor-pointer hover:opacity-95 transition-opacity duration-200"
              >
                <SharedPost post={post.originalPost} />
              </div>
            )}

            {/* Post Image */}
            {post.imageUrl && (
              <div
                className="mt-3 rounded-xl overflow-hidden 
                            border border-slate-300/30 dark:border-slate-600/30 
                            shadow-md max-w-full"
              >
                <img
                  src={post.imageUrl}
                  alt="Post media"
                  className="w-full object-cover max-h-96"
                  onClick={() => window.open(post.imageUrl, "_blank")}
                />
              </div>
            )}
          </div>

          {/* Post actions */}
          <PostActions post={post} setShowComments={setShowComments} />

          {/* Timestamp */}
          <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-2">
            <Timer size={12} />
            <TimeAgo dateString={post.createdAt} />
          </div>

          {/* Comments toggle */}
          {post.comments && post.comments.length > 0 && !showComments && (
            <button
              onClick={() => setShowComments(true)}
              className="mt-2 text-xs flex items-center gap-1 
                       text-slate-500 dark:text-slate-400 
                       hover:text-sky-600 dark:hover:text-sky-400 
                       transition-colors duration-200 self-start"
            >
              <MessageCircle size={12} />
              <span>
                Show {post.comments.length} comment
                {post.comments.length !== 1 ? "s" : ""}
              </span>
              <ChevronDown size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div
          className="pl-4 pr-2 
                      border-l-2 border-l-slate-300/30 dark:border-l-slate-600/30 
                      ml-6 mt-1"
        >
          <Comments post={post} setPostPage={setPostsPage} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
