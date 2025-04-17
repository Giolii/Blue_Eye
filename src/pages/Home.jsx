import PostComposer from "../components/PostComposer";
import PostFeed from "../components/PostFeed";
import { useScroll } from "../contexts/ScrollContext";

const Home = () => {
  const { mainContentRef } = useScroll();
  return (
    <main
      className="flex-grow p-5 container flex flex-col  overflow-y-auto relative"
      ref={mainContentRef}
    >
      <PostComposer />
      <PostFeed />
    </main>
  );
};

export default Home;
