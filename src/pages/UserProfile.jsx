import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../contexts/PostContext";
import PostCard from "../components/PostCard";

const UserProfile = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const { fetchUserPost } = usePosts();

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await fetchUserPost(userId);
      setPosts(data.posts || []);
      setUser(data.user);
    };
    fetchPosts();
  }, []);

  return (
    <main className="flex-grow p-5 container flex flex-col  overflow-y-auto relative">
      {user && (
        <div className="flex gap-4">
          <div className="rounded-full border border-gray-50">
            <img src={user.avatar} alt="User Avatar" />
          </div>
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
