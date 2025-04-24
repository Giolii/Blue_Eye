import { Heart, MessageCircle, Share } from "lucide-react";
import { useEffect, useState } from "react";
import SharePostModal from "./SharePostModal";
import axios from "axios";
import { useToast } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import HeartButton from "./post actions/Heart";

const PostActions = ({ post }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {openModal && (
        <SharePostModal
          setOpenModal={setOpenModal}
          post={post.originalPost || post}
        />
      )}
      <div className="flex items-center gap-4">
        <HeartButton post={post} />

        <button className="flex items-center gap-1 text-amber-50/70 hover:text-cyan-400 transition-colors">
          <MessageCircle size={18} />
          <span className="text-xs">{post.comments?.length || 0}</span>
        </button>

        <button
          className="flex items-center gap-1 text-amber-50/70 hover:text-amber-400 transition-colors"
          onClick={() => setOpenModal(true)}
        >
          <Share size={18} />
        </button>
      </div>
    </>
  );
};

export default PostActions;
