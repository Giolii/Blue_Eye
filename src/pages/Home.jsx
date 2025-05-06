import PostComposer from "../components/PostComposer";
import PostFeed from "../components/PostFeed";
import PostSkeletonLoader from "../components/reusable/PostSkeleton";
import { useAuth } from "../contexts/AuthContext";
import { useScroll } from "../contexts/ScrollContext";

const Home = () => {
  const { loading } = useAuth();
  const { mainContentRef } = useScroll();
  return (
    <main
      className="flex-grow p-1
       sm:p-5 container flex flex-col  overflow-y-auto relative"
      ref={mainContentRef}
    >
      {loading && <PostSkeletonLoader count={5} />}
      <PostComposer />
      <PostFeed />
    </main>
  );
};

export default Home;
