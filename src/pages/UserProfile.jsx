import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../contexts/PostContext";
import PostCard from "../components/PostCard";
import ProfilePicture from "../components/ProfilePicture";
import { useAuth } from "../contexts/AuthContext";
import UserProfileSkeleton from "../components/reusable/UserProfileSkeleton";
import OpacityContainer from "../components/reusable/OpacityContainer";
import axios from "axios";
import PostSkeletonLoader from "../components/reusable/PostSkeleton";
import { Check, UserPen, X } from "lucide-react";

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
  }, []);

  const handleChangeName = async () => {
    if (user.name === newName) return;
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
    if (e.key === "Escape") setEditName(false);
    if (e.key === "Enter") handleChangeName();
  };

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetchUserPost(userId, nextPage);
      setPosts((prev) => [...prev, ...response.posts]);
      setHasMore(response.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("Error landing more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchUserPost, page, loadingMore, hasMore]);

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

  return (
    <main className="flex-grow container flex flex-col  overflow-y-auto relative">
      {user && (
        <>
          <div className="mb-2 flex justify-between text-gray-50">
            <OpacityContainer>
              <div className="text-xl font-bold">{totalPosts}</div>
              <div className="text-sm">Posts</div>
            </OpacityContainer>
            <OpacityContainer>
              <div className="text-xl font-bold">{followers.length}</div>
              <div className="text-sm">Followers</div>
            </OpacityContainer>
            <OpacityContainer>
              <div className="text-xl font-bold">{following.length}</div>
              <div className="text-sm">Following</div>
            </OpacityContainer>
          </div>
          <div className="flex justify-center gap-4">
            {currentUser.id === user.id ? (
              <ProfilePicture />
            ) : (
              <div className=" rounded-full overflow-hidden  relative shadow-lg  transform hover:scale-105 transition-all duration-200  ring-4 ring-white dark:ring-zinc-800 w-30 h-30  bg-gradient-to-br from-blue-300 to-blue-500">
                <img
                  className="w-full h-full object-cover"
                  src={user.avatar}
                  alt="User Avatar"
                />
              </div>
            )}
            <div>
              <div className="flex gap-1">
                {editName ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-amber-50 px-1 border border-gray-400 rounded-sm"
                      autoFocus
                      onKeyDown={handleInputKeydown}
                    />
                    <Check
                      className="w-4 text-green-700"
                      onClick={() => handleChangeName()}
                    />
                    <X
                      className="w-4 text-red-700"
                      onClick={() => setEditName(false)}
                    />
                  </>
                ) : (
                  <>
                    <p className="text-gray-50">{user.name || user.username}</p>
                    <UserPen
                      className="text-amber-200 w-4"
                      onClick={() => setEditName(true)}
                    />
                  </>
                )}
              </div>
              <p className="text-gray-400 text-sm">@{user.username}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
        </>
      )}

      {posts && (
        <div>
          {posts.map((post, index) => (
            <article
              key={post.id}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
              className="p-4 hover:bg-cyan-800/20 transition-colors"
            >
              <PostCard post={post} setPostsPage={setPosts} />
            </article>
          ))}
          {loadingMore && <PostSkeletonLoader count={2} />}
        </div>
      )}
    </main>
  );
};

export default UserProfile;
