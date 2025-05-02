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

const UserProfile = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { fetchUserPost } = usePosts();
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserPost(userId, page);
      setPosts(data.posts || []);
      setUser(data.user);
      // adjust posts count
      const followData = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/followers`,
        {
          withCredentials: true,
        }
      );
      setFollowers(followData.data.followers);
      setFollowing(followData.data.following);
      setisLoading(false);
    };

    fetchData();
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetchUserPost(userId, nextPage);

      console.log(response);

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
              <div className="text-xl font-bold">{posts.length}</div>
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
              <p className="text-gray-50">{user.name || user.username}</p>
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
