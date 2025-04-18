import { useCallback, useEffect, useRef, useState } from "react";
import { usePosts } from "../contexts/PostContext";
import PostSkeletonLoader from "./reusable/PostSkeleton";
import PostCard from "./PostCard";

const PostFeed = () => {
  const { fetchPosts, posts } = usePosts();
  const { showNotification } = usePosts();
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
      {showNotification && (
        <div className="fixed top-4 left-0 right-0 mx-auto w-64 bg-green-500 text-white py-2 px-4 rounded-md shadow-md text-center">
          REPORTED
        </div>
      )}
      <div className="border border-amber-50/20 grow rounded-2xl mt-2  bg-cyan-900/30 backdrop-blur-sm ">
        {posts && posts.length > 0 ? (
          <div className="h-full flex flex-col divide-y divide-amber-50/10">
            {posts.map((post, index) => (
              <article
                key={post.id}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
                className="p-4 hover:bg-cyan-800/20 transition-colors"
              >
                <PostCard post={post} />
              </article>
            ))}
            {loadingMore && <PostSkeletonLoader count={2} />}
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
