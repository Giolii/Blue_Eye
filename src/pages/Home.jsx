import PostComposer from "../components/PostComposer";
import PostFeed from "../components/PostFeed";
import ScrollToTopButton from "../components/reusable/ScrollToTopButton";
import { useScroll } from "../contexts/ScrollContext";

const Home = () => {
  const { mainContentRef } = useScroll();
  return (
    <main
      className="flex-grow p-5 container flex flex-col  overflow-y-auto relative"
      ref={mainContentRef}
    >
      <ScrollToTopButton />
      <PostComposer />
      <PostFeed />
    </main>
  );
};

export default Home;
