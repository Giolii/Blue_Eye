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
          className="flex items-center gap-1.5 
                   text-slate-600 dark:text-slate-400 
                   hover:text-sky-600 dark:hover:text-sky-400 
                   transition-colors duration-200 
                   p-1.5 rounded-full 
                   hover:bg-slate-200/70 dark:hover:bg-slate-700/50"
          onClick={() => setShowComments((prev) => !prev)}
          aria-label={`${post.comments?.length || 0} comments`}
        >
          <MessageCircle size={18} />
          <span className="text-xs font-medium">
            {post.comments?.length || 0}
          </span>
        </button>

        <button
          className="flex items-center gap-1.5 
                   text-slate-600 dark:text-slate-400 
                   hover:text-indigo-600 dark:hover:text-indigo-400 
                   transition-colors duration-200 
                   p-1.5 rounded-full 
                   hover:bg-slate-200/70 dark:hover:bg-slate-700/50"
          onClick={() => setOpenModal(true)}
          aria-label="Share post"
        >
          <Share size={18} />
        </button>
      </div>
    </>
  );
};

export default PostActions;
