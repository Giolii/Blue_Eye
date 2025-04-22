import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../contexts/PostContext";
import PostCard from "../components/PostCard";
import ProfilePicture from "../components/ProfilePicture";
import { useAuth } from "../contexts/AuthContext";
import UserProfileSkeleton from "../components/reusable/UserProfileSkeleton";

const UserProfile = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const { fetchUserPost } = usePosts();
  const { currentUser } = useAuth();
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await fetchUserPost(userId);
      setPosts(data.posts || []);
      setUser(data.user);
      setisLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) return <UserProfileSkeleton />;

  return (
    <main className="flex-grow p-5 container flex flex-col  overflow-y-auto relative">
      {user && (
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
      )}
      {posts && (
        <div>
          {posts.map((post) => (
            <article
              key={post.id}
              className="p-4 hover:bg-cyan-800/20 transition-colors"
            >
              <PostCard post={post} setPostsPage={setPosts} />
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default UserProfile;
