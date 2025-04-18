import { useState, useEffect } from "react";

const ToastNotification = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      <button
        onClick={toggleToast}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none transition-colors duration-200"
      >
        {show ? "Hide Toast" : "Show Toast"}
      </button>

      <div className="relative">
        {/* Toast container with transition effects */}
        <div
          className={`
            fixed bottom-4 right-4 max-w-sm p-4 text-white bg-gray-800 rounded-lg shadow-lg
            transform transition-all duration-500 ease-in-out
            ${
              show
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0 pointer-events-none"
            }
          `}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 font-medium">{message}</div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => setShow(false)}
                className="inline-flex text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
