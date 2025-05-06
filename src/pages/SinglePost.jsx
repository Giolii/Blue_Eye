import { useEffect, useState } from "react";
import { usePosts } from "../contexts/PostContext";
import { useParams } from "react-router-dom";
import PostSkeletonLoader from "../components/reusable/PostSkeleton";
import { motion, AnimatePresence } from "motion/react";
import PostCard from "../components/PostCard";

const SinglePost = () => {
  const [posts, setPosts] = useState([]);
  const { postId } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const { fetchSinglePost } = usePosts();

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetchSinglePost(postId);
      setPosts([response]);
      setisLoading(false);
    };
    fetchPost();
  }, [postId]);

  if (isLoading) {
    return <PostSkeletonLoader />;
  }

  return (
    <main
      className="flex-grow p-5 container flex flex-col overflow-y-auto relative 
                     bg-gradient-to-br from-transparent to-slate-200/30 dark:to-slate-800/30"
    >
      <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
        {posts && posts.length > 0 && (
          <div className="h-full flex flex-col divide-y divide-slate-300/20 dark:divide-slate-700/20">
            <AnimatePresence mode="popLayout">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{
                    duration: 0.3,
                    layout: { type: "spring", stiffness: 200, damping: 20 },
                  }}
                  layout
                >
                  <article
                    key={post.id}
                    className="p-4 hover:bg-slate-200/50 dark:hover:bg-slate-700/30 
                              transition-colors duration-200 rounded-lg"
                  >
                    <PostCard
                      post={post}
                      setPostsPage={setPosts}
                      openComments={true}
                    />
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
};

export default SinglePost;
