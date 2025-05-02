import React from "react";

const OpacityContainer = ({ children }) => {
  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      {/* SVG with smooth radial gradient */}
      <svg
        className="absolute inset-0"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
      >
        <defs>
          <radialGradient
            id="circleGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="#1f2937" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#1f2937" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#1f2937" stopOpacity="0.5" />
            <stop offset="85%" stopColor="#1f2937" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1f2937" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#circleGradient)" />
      </svg>

      {/* Content layer */}
      <div className="relative flex flex-col items-center z-10 text-white">
        {children}
      </div>
    </div>
  );
};

export default OpacityContainer;
