const ProfileTooltip = ({ user }) => {
  return (
    <div
      className="absolute left-full ml-2 top-1/2 -translate-y-1/2 
                px-4 py-3 
                bg-white/90 dark:bg-slate-800/95 
                text-slate-700 dark:text-slate-200 
                text-sm rounded-lg 
                whitespace-nowrap
                opacity-0 invisible 
                group-hover:opacity-100 group-hover:visible 
                transition-all duration-200 
                z-50 
                shadow-lg dark:shadow-black/30
                border border-slate-200/50 dark:border-slate-700/50
                backdrop-blur-sm"
    >
      {/* Tooltip arrow */}
      <div
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 
                     w-3 h-3 
                     bg-white dark:bg-slate-800 
                     rotate-45
                     border-l border-t 
                     border-slate-200/50 dark:border-slate-700/50"
      ></div>

      <div className="flex items-start gap-3 relative">
        {/* User avatar */}
        <div
          className="rounded-full overflow-hidden 
                       border border-slate-300/30 dark:border-slate-600/30 
                       bg-gradient-to-br from-sky-400/10 to-indigo-400/10 dark:from-sky-900/20 dark:to-indigo-900/20 
                       w-12 h-12 flex-shrink-0 
                       shadow-md"
        >
          <img
            className="w-full h-full object-cover"
            src={user.avatar}
            alt={`${user.username}'s avatar`}
          />
        </div>

        {/* User details */}
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium leading-tight text-slate-800 dark:text-slate-100">
            {user.username}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {user.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTooltip;
