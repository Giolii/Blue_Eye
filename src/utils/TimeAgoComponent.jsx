import React, { useState, useEffect } from "react";

function TimeAgo({ dateString }) {
  const [timeAgoText, setTimeAgoText] = useState("");

  const calculateTimeAgo = () => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 30) return `just now`;
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  useEffect(() => {
    // Calculate immediately
    setTimeAgoText(calculateTimeAgo());

    // Set up interval to update every second
    const intervalId = setInterval(() => {
      setTimeAgoText(calculateTimeAgo());
    }, 30000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [dateString]);

  return <span className="text-xs text-gray-500">{timeAgoText}</span>;
}
export default TimeAgo;
