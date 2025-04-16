import { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = ({ containerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const defaultContainerRef = useRef(null);

  // Use provided container ref or fallback to default
  const scrollContainer = containerRef || defaultContainerRef;

  // Show button when scrolled down
  const toggleVisibility = () => {
    const container = scrollContainer.current;
    if (!container) return;

    if (container.scrollTop > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    const container = scrollContainer.current;
    if (!container) return;

    container.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Set default container to main element if none provided
    if (!containerRef) {
      defaultContainerRef.current = document.querySelector("main");
    }

    const container = scrollContainer.current;
    if (!container) return;

    container.addEventListener("scroll", toggleVisibility);
    return () => container.removeEventListener("scroll", toggleVisibility);
  }, [containerRef, scrollContainer]);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-cyan-700 text-amber-50 shadow-lg hover:bg-cyan-600 transition-all duration-300 z-50 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
