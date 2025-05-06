// GrayBlueGradientBackground;
import React from "react";

const GrayBlueGradientBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
      {/* Main gradient background - lighter in light mode, darker in dark mode */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-blue-200 
                     dark:from-slate-800 dark:via-slate-900 dark:to-blue-950 transition-colors duration-300"
      ></div>

      {/* Accent elements with dark mode variants */}
      <div
        className="absolute top-1/4 left-1/3 h-80 w-80 rounded-full 
                     bg-gradient-to-r from-sky-300 to-indigo-400 opacity-30 
                     dark:from-sky-800 dark:to-indigo-900 dark:opacity-20 
                     blur-xl animate-pulse-slow"
      ></div>

      <div
        className="absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full 
                     bg-gradient-to-r from-gray-300 to-slate-400 opacity-25 
                     dark:from-gray-600 dark:to-slate-700 dark:opacity-15 
                     blur-xl"
      ></div>

      {/* Light effect - more visible in light mode, subtle in dark mode */}
      <div
        className="absolute -top-32 -right-32 h-96 w-96 rounded-full 
                     bg-blue-300 opacity-30 dark:bg-blue-400 dark:opacity-10 
                     blur-3xl"
      ></div>

      {/* Grid overlay - conditional visibility */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-black 
                     opacity-[0.03] dark:opacity-[0.07]"
      ></div>

      {/* Content container with improved z-index and padding */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

// You'll need to add this to your tailwind.config.js to enable the slow pulse animation:
// extend: {
//   animation: {
//     'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//   },
// },

export default GrayBlueGradientBackground;
