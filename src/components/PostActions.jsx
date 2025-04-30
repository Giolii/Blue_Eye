import { MessageCircle, Share } from "lucide-react";
import { useState } from "react";
import SharePostModal from "./SharePostModal";

import HeartButton from "./post actions/Heart";

const PostActions = ({ post, setShowComments }) => {
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

        <button
          className="flex items-center gap-1 text-amber-50/70 hover:text-cyan-400 transition-colors"
          onClick={() => setShowComments((prev) => !prev)}
        >
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
