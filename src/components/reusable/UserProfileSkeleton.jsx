import React from "react";

const UserProfileSkeleton = () => {
  return (
    <main className="flex-grow p-5 container flex flex-col overflow-y-auto relative">
      {/* User profile skeleton */}
      <div className="flex justify-center gap-4 mb-8">
        {/* Avatar skeleton */}
        <div className="rounded-full overflow-hidden relative shadow-lg w-30 h-30 bg-gray-300 dark:bg-gray-700 animate-pulse">
          <div className="w-full h-full" />
        </div>

        {/* User info skeleton */}
        <div>
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Posts skeleton */}
      <div>
        {[1, 2, 3].map((item) => (
          <article
            key={item}
            className="p-4 hover:bg-cyan-800/20 transition-colors mb-4"
          >
            <div className="animate-pulse">
              {/* Post header */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3" />
                <div>
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
              </div>

              {/* Post content */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6" />
              </div>

              {/* Post actions */}
              <div className="flex space-x-4">
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default UserProfileSkeleton;
