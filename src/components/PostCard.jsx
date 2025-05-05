import { Handshake, Timer, UserPlus } from "lucide-react";
import DotsMenu from "./DotsMenu";
import { useEffect, useState } from "react";
import { usePosts } from "../contexts/PostContext";
import ProfileTooltip from "./reusable/ProfileTooltip";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PostActions from "./PostActions";
import SharedPost from "./SharedPost";
import TimeAgo from "../utils/TimeAgoComponent";
import Comments from "./Comments";
import IconToolTip from "./reusable/IconToolTip";

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

  const handleFollowUser = async (userId) => {
    const response = await followUser(userId);
  };

  const handleUnfollowUser = async (userId) => {
    const response = await unfollowUser(userId);
  };

  return (
    <div>
      <div className="flex gap-2 relative border border-gray-400 p-2 rounded-xl ">
        {/* Avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 text-cyan-900 font-bold group relative overflow-hidden">
          {post.user && (
            <img
              className="w-10 h-10 object-cover"
              src={post.user.avatar}
              alt="Avatar"
            />
          )}
          {/* Why is this one here */}
          {currentUser.id !== post.userId && (
            <ProfileTooltip user={post.user} />
          )}
        </div>
        <div className="flex-1">
          {/* Post header */}
          <div className="flex  justify-between mb-1">
            <div className="flex flex-col ">
              <div className="flex gap-2 items-center">
                <Link
                  className="font-semibold text-amber-50"
                  to={`/users/${post.userId}`}
                >
                  {post.user.name || post.user.username || "Anonymous"}
                </Link>
                {currentUser.id === post.userId ? (
                  <span className="bg-amber-200 rounded-md px-1 text-sm">
                    You
                  </span>
                ) : following.find(
                    (foll) => foll.followingId === post.userId
                  ) ? (
                  <span
                    className="text-pink-300"
                    onClick={() => handleUnfollowUser(post.userId)}
                  >
                    <IconToolTip label={"Unfollow User"}>
                      <Handshake className="w-4" />
                    </IconToolTip>
                  </span>
                ) : (
                  <span
                    className="text-gray-300"
                    onClick={() => handleFollowUser(post.userId)}
                  >
                    <IconToolTip label={"Follow User"}>
                      <UserPlus className="w-4" />
                    </IconToolTip>
                  </span>
                )}
              </div>
              <span className="text-amber-50/50 text-xs flex items-center gap-1">
                @{post.user && post.user.username}
              </span>
            </div>
            <DotsMenu
              onEdit={() => setEditPost(true)}
              onDelete={handleDeletePost}
              post={post}
            />
            <span className=" text-amber-50/50 text-xs flex items-center gap-1 absolute bottom-0 right-0 p-2">
              <Timer size={12} />
              <TimeAgo dateString={post.createdAt} />
            </span>
          </div>

          {/* Post content */}

          <div
            className={` overflow-hidden transition-all duration-300 ease-in-out mb-3`}
          >
            {editPost ? (
              <div className="transition-opacity duration-300">
                <div className="flex flex-col gap-2">
                  <input
                    className="w-full outline-none border border-blue-900 bg-gray-700 px-2 py-1 rounded-xl text-white"
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
            ) : (
              <div>
                <Link to={`/posts/${post.id}`}>
                  <div className="text-amber-50 whitespace-pre-wrap break-words mt-2 p-2">
                    {post.content}
                  </div>
                </Link>
              </div>
            )}
            {/* Shared Post */}
            <div onClick={() => navigate(`/posts/${post.originalPost.id}`)}>
              {post.originalPost && <SharedPost post={post.originalPost} />}
              {post.imageUrl && (
                <div className="bg-gray-50 flex justify-center border border-gray-400 rounded-xl overflow-hidden max-w-md ">
                  <img src={post.imageUrl} alt="Picture" />
                </div>
              )}
            </div>
            {/* {post.originalPost && <PostCard post={post.originalPost} />} */}
          </div>

          <PostActions post={post} setShowComments={setShowComments} />
        </div>
      </div>
      {showComments && <Comments post={post} setPostPage={setPostsPage} />}
    </div>
  );
};

export default PostCard;
