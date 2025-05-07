import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../contexts/PostContext";
import PostCard from "../components/PostCard";
import ProfilePicture from "../components/ProfilePicture";
import { useAuth } from "../contexts/AuthContext";
import UserProfileSkeleton from "../components/reusable/UserProfileSkeleton";
import axios from "axios";
import PostSkeletonLoader from "../components/reusable/PostSkeleton";
import {
  Check,
  UserPen,
  X,
  Mail,
  AtSign,
  FileText,
  Users,
  UserPlus,
} from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { fetchUserPost } = usePosts();
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const observer = useRef();
  const nameInputRef = useRef(null);

  const fetchData = async () => {
    const data = await fetchUserPost(userId, page);
    setPosts(data.posts || []);
    setUser(data.user);
    setTotalPosts(data.totalPosts);
    setNewName(data.user.name || data.user.username);
    const followData = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/${userId}/followers`,
      { withCredentials: true }
    );
    setFollowers(followData.data.followers);
    setFollowing(followData.data.following);
    setisLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleChangeName = async () => {
    if (!newName.trim() || user.name === newName) {
      setEditName(false);
      setNewName(user.name || user.username);
      return;
    }

    try {
      const userUpdated = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${userId}/name`,
        { newName: newName },
        { withCredentials: true }
      );
      setUser(userUpdated.data);
      setEditName(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputKeydown = (e) => {
    if (e.key === "Escape") {
      setEditName(false);
      setNewName(user.name || user.username);
    }
    if (e.key === "Enter") handleChangeName();
  };

  useEffect(() => {
    if (editName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editName]);

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetchUserPost(userId, nextPage);
      setPosts((prev) => [...prev, ...response.posts]);
      setHasMore(response.hasMore);
      setPage(response.nextPage);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchUserPost, userId, page, loadingMore, hasMore]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading || loadingMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMorePosts();
          }
        },
        { threshold: 0.5 }
      );
      if (node) observer.current.observe(node);
    },
    [isLoading, loadingMore, hasMore, loadMorePosts]
  );

  if (isLoading) return <UserProfileSkeleton />;

  const isCurrentUser = currentUser.id === user.id;

  return (
    <main className="flex-grow container max-w-3xl mx-auto flex flex-col overflow-y-auto relative px-4 pb-8">
      {user && (
        <div className="my-6">
          {/* Profile Header */}
          <div
            className="rounded-xl overflow-hidden 
                        bg-gradient-to-br from-slate-100/90 to-blue-100/90 
                        dark:from-slate-800/90 dark:to-slate-900/90 
                        shadow-lg border border-slate-300/30 dark:border-slate-700/30 
                        p-6 mb-6 backdrop-blur-sm"
          >
            {/* User Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div
                className="bg-white/40 dark:bg-slate-700/40 
                            rounded-lg p-3 text-center 
                            border border-slate-300/30 dark:border-slate-600/30 
                            shadow-sm transition-all duration-200 
                            hover:border-sky-300/50 dark:hover:border-sky-600/30 
                            hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="text-slate-800 dark:text-slate-200 text-xl font-bold mb-1">
                    {totalPosts}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-1 flex-col">
                    <FileText size={14} />
                    <span>Posts</span>
                  </div>
                </div>
              </div>
              <div
                className="bg-white/40 dark:bg-slate-700/40 
                            rounded-lg p-3 text-center 
                            border border-slate-300/30 dark:border-slate-600/30 
                            shadow-sm transition-all duration-200 
                            hover:border-sky-300/50 dark:hover:border-sky-600/30 
                            hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="text-slate-800 dark:text-slate-200 text-xl font-bold mb-1">
                    {followers.length}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-1 flex-col">
                    <Users size={14} />
                    <span>Followers</span>
                  </div>
                </div>
              </div>
              <div
                className="bg-white/40 dark:bg-slate-700/40 
                            rounded-lg p-3 text-center 
                            border border-slate-300/30 dark:border-slate-600/30 
                            shadow-sm transition-all duration-200 
                            hover:border-sky-300/50 dark:hover:border-sky-600/30 
                            hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="text-slate-800 dark:text-slate-200 text-xl font-bold mb-1">
                    {following.length}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-1 flex-col">
                    <UserPlus size={14} />
                    <span>Following</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {isCurrentUser ? (
                  <ProfilePicture />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden relative 
                               shadow-lg transform hover:scale-105 transition-all duration-300 
                               ring-4 ring-sky-200/50 dark:ring-indigo-500/30 
                               bg-gradient-to-br from-sky-400 to-indigo-500 dark:from-sky-500 dark:to-indigo-600"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={user.avatar}
                      alt={`${user.name || user.username}'s avatar`}
                    />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col">
                {/* Name with edit functionality */}
                <div className="flex items-center  mb-2 truncate  ">
                  {editName ? (
                    <div className="flex items-center relative gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-white/70 dark:bg-slate-800/70 
                                 w-full text-slate-700 dark:text-slate-200 
                                 px-3 py-1.5 border border-slate-300/50 dark:border-slate-600/50 
                                 rounded-lg focus:border-sky-400/70 dark:focus:border-sky-500/70 
                                 outline-none shadow-inner max-w-[100px] sm:max-w-[200px]"
                        ref={nameInputRef}
                        onKeyDown={handleInputKeydown}
                        maxLength={30}
                      />
                      <div className=" flex flex-col">
                        <button
                          onClick={handleChangeName}
                          className="rounded-md text-green-600 dark:text-green-400 
                                   hover:bg-green-100/40 dark:hover:bg-green-900/30 
                                   transition-all duration-200"
                          aria-label="Save name"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditName(false);
                            setNewName(user.name || user.username);
                          }}
                          className="rounded-md text-rose-600 dark:text-rose-400 
                                   hover:bg-rose-100/40 dark:hover:bg-rose-900/30 
                                   transition-all duration-200"
                          aria-label="Cancel edit"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center  flex-col">
                      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 max-w-[100px] sm:max-w-[200px] ">
                        {user.name || user.username}
                      </h1>
                      {isCurrentUser && (
                        <button
                          onClick={() => setEditName(true)}
                          className="p-1.5 rounded-md 
                                   text-indigo-600 dark:text-indigo-400 
                                   hover:text-sky-600 dark:hover:text-sky-400 
                                   hover:bg-slate-200/60 dark:hover:bg-slate-700/60 
                                   transition-all duration-200"
                          aria-label="Edit name"
                        >
                          <UserPen size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Username and Email */}
                <div className="space-y-1">
                  <div
                    className="flex items-center gap-1.5 
                               text-slate-500 dark:text-slate-400 text-sm"
                  >
                    <AtSign
                      size={14}
                      className="text-slate-400 dark:text-slate-500"
                    />
                    <span>{user.username}</span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 
                               text-slate-500 dark:text-slate-400 text-sm"
                  >
                    <Mail
                      size={14}
                      className="text-slate-400 dark:text-slate-500"
                    />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Header */}
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-semibold 
                         text-slate-800 dark:text-slate-200 
                         flex items-center gap-2"
            >
              <FileText size={18} />
              <span>Posts</span>
            </h2>
            <div className="text-slate-500 dark:text-slate-400 text-sm">
              {totalPosts} post{totalPosts !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Posts List */}
          {posts && (
            <div className="space-y-1">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  ref={index === posts.length - 1 ? lastPostElementRef : null}
                  className="transition-all duration-200"
                >
                  <PostCard post={post} setPostsPage={setPosts} />
                </article>
              ))}
              {loadingMore && <PostSkeletonLoader count={2} />}
              {!hasMore && posts.length > 0 && (
                <div
                  className="text-center py-4 
                              text-slate-500 dark:text-slate-400 text-sm"
                >
                  No more posts to load
                </div>
              )}
              {posts.length === 0 && (
                <div
                  className="text-center py-8 
                              bg-white/60 dark:bg-slate-800/60 
                              rounded-xl border border-slate-200/50 dark:border-slate-700/50 
                              shadow-sm backdrop-blur-sm
                              text-slate-700 dark:text-slate-300"
                >
                  <div className="mb-2">
                    <FileText size={36} className="mx-auto opacity-30" />
                  </div>
                  <p className="text-lg">No posts yet</p>
                  <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
                    {isCurrentUser
                      ? "Start sharing your thoughts with the world!"
                      : `${
                          user.name || user.username
                        } hasn't posted anything yet.`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default UserProfile;
