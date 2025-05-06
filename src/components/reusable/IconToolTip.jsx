const IconTooltip = ({ children, label }) => {
  return (
    <div className="relative group">
      {children}
      <div
        className="absolute left-full ml-2 top-1/2 -translate-y-1/2 
                  px-2.5 py-1.5 
                  bg-gradient-to-r from-slate-200 to-slate-300 
                  dark:from-slate-800 dark:to-slate-900 
                  text-slate-800 dark:text-slate-200 
                  text-sm rounded-md whitespace-nowrap 
                  opacity-0 invisible 
                  group-hover:opacity-100 group-hover:visible 
                  transition-all duration-200 
                  shadow-md dark:shadow-slate-950/40
                  border border-slate-300/30 dark:border-slate-700/30 
                  backdrop-blur-sm 
                  z-50"
      >
        {/* Arrow pointing to the icon */}
        <div
          className="absolute -left-1 top-1/2 -translate-y-1/2 
                    w-2 h-2 
                    bg-gradient-to-br from-slate-200 to-slate-300
                    dark:from-slate-800 dark:to-slate-900
                    rotate-45 
                    border-l border-t border-slate-300/30 dark:border-slate-700/30"
        ></div>
        {label}
      </div>
    </div>
  );
};

export default IconTooltip;
