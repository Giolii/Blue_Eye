import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const GifSearch = ({ setOpenGif, setImageToSendPreview, setImageToSend }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API;
  const LIMIT = 20;

  useEffect(() => {
    fetchGifs();
  }, [searchTerm]);

  const fetchGifs = async (reset = true) => {
    try {
      setLoading(true);
      const endpoint = searchTerm
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=${LIMIT}&offset=${
            reset ? 0 : page * LIMIT
          }&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${LIMIT}&offset=${
            reset ? 0 : page * LIMIT
          }&rating=g`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (reset) {
        setGifs(data.data);
        setPage(1);
      } else {
        setGifs([...gifs, ...data.data]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
        fetchGifs(false);
      }
    }
  };

  const handleClick = (gif) => {
    setImageToSendPreview(gif.images.fixed_height_small.url);
    setImageToSend(gif.images.original.url);
    setOpenGif(false);
  };

  return (
    <div
      className="z-50 fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center p-4"
      onClick={() => setOpenGif(false)}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg w-full max-w-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" p-4 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Select a GIF
          </h3>
          <button
            onClick={() => setOpenGif(false)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-900">
          <input
            autoComplete="off"
            type="text"
            placeholder="Search GIFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
          />
        </div>

        <div
          ref={containerRef}
          className="h-96 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-2  bg-zinc-50 dark:bg-zinc-900 "
          onScroll={handleScroll}
        >
          {gifs.map((gif, index) => (
            <div
              key={`${gif.id}-${index}`}
              className="flex items-center justify-center cursor-pointer hover:opacity-75 transition-opacity bg-white dark:bg-zinc-800 rounded-md  shadow-sm h-full"
              onClick={() => handleClick(gif)}
            >
              <img
                src={gif.images.fixed_height_small.url}
                alt={gif.title}
                className="w-full h-auto rounded-md"
                loading="lazy"
              />
            </div>
          ))}
          {loading && (
            <div className="col-span-full flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-600"></div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 text-center text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800">
          Powered by GIPHY
        </div>
      </div>
    </div>
  );
};

export default GifSearch;
