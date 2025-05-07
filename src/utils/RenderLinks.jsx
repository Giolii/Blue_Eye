const renderTextWithLinks = (text) => {
  if (!text) return "";

  // Regular expression to find URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Create an array to store parts of text and links
  const result = [];

  // Keep track of the last index processed
  let lastIndex = 0;

  // Find all matches of the URL regex
  let match;
  let i = 0;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add the text before the URL
    if (match.index > lastIndex) {
      result.push(text.substring(lastIndex, match.index));
    }

    // Add the URL as a clickable link
    result.push(
      <a
        key={i++}
        href={match[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 hover:underline"
        onClick={(e) => e.stopPropagation()} // Prevent triggering the parent Link
      >
        {match[0]}
      </a>
    );

    // Update the last index to after this URL
    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text after the last URL
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result;
};

export default renderTextWithLinks;
