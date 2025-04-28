import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useToast } from "../../contexts/NotificationContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const HeartButton = ({ post }) => {
  const [animate, setAnimate] = useState(false);
  const [isLiked, setIsLiked] = useState(true);

  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);
  const { errorToast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    const hasLiked = post.likes?.some((like) => like.userId === currentUser.id);
    setIsLiked(hasLiked);
  }, [post.likes, currentUser.id]);

  const handleLikeClick = async () => {
    setAnimate(true);
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${post.id}/like`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
      console.error(error);
      errorToast(error.message);
    }
  };

  // Only show animation effects if user has clicked at least once
  const showEffects = isLiked && animate;

  return (
    <button
      className="flex items-center gap-1  transition-colors"
      onClick={handleLikeClick}
    >
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {/* Base heart that's always visible */}
        <Heart
          size={24}
          className="transition-colors duration-100"
          fill={isLiked ? "#f472b6" : "none"}
          color={isLiked ? "#f472b6" : "rgb(255, 251, 235, 0.7)"}
        />

        {/* Animation effects only after first click */}
        <AnimatePresence>
          {showEffects && (
            <>
              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-pink-600 opacity-70"
                initial={{ scale: 0.5, opacity: 0.7 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />

              {/* Small hearts flying out */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute top-1/2 left-1/2 h-2 w-2 bg-pink-800 rounded-full"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 20),
                    y: -10 - Math.random() * 20,
                    opacity: 0,
                    scale: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4 + Math.random() * 0.2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="text-xs text-text">{likeCount}</span>
    </button>
  );
};

export default HeartButton;
