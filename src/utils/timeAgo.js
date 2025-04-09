function timeAgo(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    secod: 1,
  };

  if (secondsAgo < 0) {
    return "in the future";
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(secondsAgo / secondsInUnit);

    if (interval >= 1) {
      const suffix = interval === 1 ? "" : "s";
      return `${interval} ${unit}${suffix} ago`;
    }
  }
  return "just now";
}

export default timeAgo;
