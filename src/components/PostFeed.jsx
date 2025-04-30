import { useCallback, useEffect, useRef, useState } from "react";
import { usePosts } from "../contexts/PostContext";
import PostSkeletonLoader from "./reusable/PostSkeleton";
import PostCard from "./PostCard";
import { motion, AnimatePresence } from "motion/react";
import Comments from "./Comments";

const PostFeed = () => {
  const { fetchPosts, posts } = usePosts();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();

  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      await fetchPosts(1);
      setLoading(false);
    };

    loadInitialPosts();
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetchPosts(nextPage);
      setHasMore(response.hasMore);
      setPage(response.nextPage);
    } catch (error) {
      console.error("Error landing more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPosts, page, loadingMore, hasMore]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;

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
    [loading, loadingMore, hasMore, loadMorePosts]
  );

  if (loading) {
    return <PostSkeletonLoader />;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {posts && posts.length > 0 ? (
          <div className="h-full flex flex-col divide-y divide-amber-50/10">
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
                    ref={index === posts.length - 1 ? lastPostElementRef : null}
                    className="p-4 hover:bg-cyan-800/20 transition-colors"
                  >
                    <PostCard post={post} />
                  </article>
                </motion.div>
              ))}
              {loadingMore && <PostSkeletonLoader count={2} />}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-amber-50/70 p-6 text-center">
            <div>
              <p className="mb-2">No posts yet</p>
              <p className="text-sm">Be the first to share something!</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostFeed;
