import React, { useEffect, useState } from "react";

const ErrorMessage = ({ message }) => {
  const [localMessage, setLocalMessage] = useState(message);

  return (
    <div
      className={`
        w-full overflow-hidden transition-all
      `}
    >
      <div
        className={`
          relative border border-red-400 text-red-700 px-4 py-2 rounded-lg
          text-center transition-all duration-300 ease-in-out 
        `}
      >
        <p className="w-full"> {localMessage}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
