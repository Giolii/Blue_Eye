import React from "react";

const PostSkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="border border-amber-50/20 grow rounded-2xl mt-2 bg-cyan-900/30 backdrop-blur-sm">
      <div className="h-full flex flex-col divide-y divide-amber-50/10">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="p-4 animate-pulse">
              <div className="flex items-start gap-3">
                {/* Avatar skeleton */}
                <div className="w-10 h-10 rounded-full bg-cyan-700/50"></div>

                <div className="flex-1">
                  {/* Header skeleton */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {/* Username skeleton */}
                      <div className="h-4 bg-cyan-700/50 rounded w-24"></div>
                      {/* Time skeleton */}
                      <div className="h-3 bg-cyan-700/30 rounded w-16"></div>
                    </div>
                    {/* More options skeleton */}
                    <div className="h-6 w-6 bg-cyan-700/30 rounded-full"></div>
                  </div>

                  {/* Content skeleton - multiple lines with different widths */}
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-cyan-700/40 rounded w-full"></div>
                    <div className="h-3 bg-cyan-700/40 rounded w-11/12"></div>
                    <div className="h-3 bg-cyan-700/40 rounded w-4/5"></div>
                    {index % 2 === 0 && ( // Randomly add an extra line to some posts
                      <div className="h-3 bg-cyan-700/40 rounded w-3/4"></div>
                    )}
                  </div>

                  {/* Action buttons skeleton */}
                  <div className="flex items-center gap-6 mt-3">
                    <div className="h-5 bg-cyan-700/30 rounded w-10"></div>
                    <div className="h-5 bg-cyan-700/30 rounded w-10"></div>
                    <div className="h-5 bg-cyan-700/30 rounded w-10"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostSkeletonLoader;
