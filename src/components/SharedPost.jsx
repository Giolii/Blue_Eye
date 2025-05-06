import { Link } from "react-router-dom";

const SharedPost = ({ post }) => {
  return (
    <div
      className="border border-slate-300/30 dark:border-slate-700/40 
                  bg-gradient-to-br from-slate-100/80 to-slate-200/80 
                  dark:from-slate-800/90 dark:to-slate-900/90 
                  p-3 rounded-xl shadow-sm backdrop-blur-sm"
    >
      <div className="flex flex-col">
        <div className="flex gap-3">
          <div
            className="w-10 h-10 rounded-full 
                        bg-gradient-to-br from-sky-400 to-indigo-500 
                        dark:from-sky-500 dark:to-indigo-600 
                        flex items-center justify-center 
                        text-white font-bold group relative overflow-hidden 
                        ring-2 ring-sky-200/50 dark:ring-indigo-500/30"
          >
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 "
              src={post.user.avatar}
              alt={`${post.user.name || post.user.username}'s avatar`}
            />
          </div>
          <div className="flex-1">
            {/* Post header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex flex-col">
                <Link
                  className="font-semibold text-slate-800 dark:text-slate-200
                            hover:text-sky-600 dark:hover:text-sky-400
                            transition-colors duration-200 truncate max-w-[100px] sm:max-w-[200px]"
                  to={`/users/${post.userId}`}
                >
                  {post.user.name || post.user.username || "Unknown User"}
                </Link>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  @{post.user.username}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className="text-slate-700 dark:text-slate-300 
                        whitespace-pre-wrap break-words p-2 
                        bg-white/40 dark:bg-slate-700/30
                        rounded-lg my-2"
          >
            {post.content}
          </div>
          {post.imageUrl && (
            <div
              className="border border-slate-300/50 dark:border-slate-600/50 
                          rounded-xl overflow-hidden max-w-md mx-auto
                          shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={post.imageUrl}
                alt="Shared post media"
                className="w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedPost;
