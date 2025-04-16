import { useCallback, useEffect, useRef, useState } from "react";
import { usePosts } from "../contexts/PostContext";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import timeAgo from "../utils/timeAgo";
import PostSkeletonLoader from "./reusable/PostSkeleton";
import ScrollToTopButton from "./reusable/ScrollToTopButton";

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
      <div className="border border-amber-50/20 grow rounded-2xl mt-2  bg-cyan-900/30 backdrop-blur-sm ">
        {posts && posts.length > 0 ? (
          <div className="h-full flex flex-col divide-y divide-amber-50/10">
            {posts.map((post, index) => (
              <article
                key={post.id}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
                className="p-4 hover:bg-cyan-800/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-cyan-900 font-bold">
                    {post.user && <img src={post.user.avatar} alt="Avatar" />}
                  </div>

                  <div className="flex-1">
                    {/* Post header */}
                    <div className="flex items-center justify-between mb-1 ">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-amber-50">
                          {post.author ? post.author.username : "Unknown User"}
                        </span>
                        <span className="text-amber-50/50 text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {post.createdAt
                            ? timeAgo(post.createdAt)
                            : "Just now"}
                        </span>
                      </div>
                      <button className="text-amber-50/70 hover:text-amber-50 p-1 rounded-full hover:bg-cyan-700/30">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    {/* Post content */}
                    <div className="text-amber-50 mb-3 whitespace-pre-wrap break-words">
                      {post.content}
                    </div>

                    {/* Post actions */}
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-amber-50/70 hover:text-pink-400 transition-colors">
                        <Heart size={18} />
                        <span className="text-xs">{post.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 text-amber-50/70 hover:text-cyan-400 transition-colors">
                        <MessageCircle size={18} />
                        <span className="text-xs">
                          {post.comments?.length || 0}
                        </span>
                      </button>
                      <button className="flex items-center gap-1 text-amber-50/70 hover:text-amber-400 transition-colors">
                        <Share size={18} />
                      </button>
                    </div>
                  </div>
                </div>
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
