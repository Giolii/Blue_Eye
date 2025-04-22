import { useRef, useState } from "react";
import { usePosts } from "../contexts/PostContext";
import { Send, Image, ImagePlay, X, Loader } from "lucide-react";
import uploadImage from "../utils/uploadImage";
import GifSearch from "./GifSearch";

const PostComposer = () => {
  const [postDraft, setPostDraft] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [openGif, setOpenGif] = useState(false);

  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const [imageToSend, setImageToSend] = useState(null);
  const [imageToSendPreview, setImageToSendPreview] = useState(null);

  const { createPost } = usePosts();
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const charLimit = 280;

  const handleSubmitPost = async () => {
    if ((!postDraft.trim() && !imageToSend) || postDraft.length > charLimit)
      return;

    try {
      await createPost(postDraft, imageToSend);
      setPostDraft("");
      setIsExpanded(false);
    } catch (error) {
      console.error(error);
    } finally {
      setImageToSend(false);
      setImageToSendPreview(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPost();
    }
  };

  const handleUploadImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploadingPic(true);
        const objUrl = URL.createObjectURL(file);
        setImageToSendPreview(objUrl);
        const imageUrl = await uploadImage(file);
        setImageToSend(imageUrl);
        // Focus on text input after uploading
        inputRef.current?.focus();
      } catch (error) {
        console.error("Error uploading image:", error.message);
      } finally {
        setIsUploadingPic(false);
      }
    }
  };

  const characterCount = postDraft.length;
  const isOverLimit = characterCount > charLimit;

  return (
    <>
      {openGif && (
        <GifSearch
          setOpenGif={setOpenGif}
          setImageToSendPreview={setImageToSendPreview}
          setImageToSend={setImageToSend}
        />
      )}
      <div className="bg-gradient-to-r from-cyan-800 to-cyan-900 rounded-xl shadow-lg p-4 mb-6 transition-all duration-300">
        <div className="flex flex-col gap-3">
          {/* Text area for post composition */}
          <div
            className="relative w-full"
            onClick={() => !isExpanded && setIsExpanded(true)}
          >
            <textarea
              value={postDraft}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
              onChange={(e) => setPostDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              className={`w-full p-3 rounded-lg bg-cyan-950/50 text-amber-50 placeholder-amber-50/50 border ${
                isOverLimit
                  ? "border-red-500"
                  : "border-amber-50/20 focus:border-amber-50/60"
              } outline-none resize-none transition-all duration-200 ${
                isExpanded ? "h-24" : "h-12"
              }`}
              rows={isExpanded ? 3 : 1}
              ref={inputRef}
            />

            {/* Character counter */}
            <div
              className={`absolute bottom-2 right-3 text-xs ${
                isOverLimit ? "text-red-400" : "text-amber-50/60"
              }`}
            >
              {characterCount}/{charLimit}
            </div>
          </div>

          {/* Picture Preview */}
          {imageToSendPreview && (
            <div className="max-w-[200px]  mx-auto border  border-gray-400 rounded-xl relative flex justify-center overflow-hidden">
              <button
                className="absolute top-0 right-0  hover:opacity-80 "
                onClick={() => {
                  setImageToSendPreview(null);
                  setImageToSend(null);
                }}
              >
                <X className="text-red-600 " />
              </button>
              <img src={imageToSendPreview} />
            </div>
          )}

          {/* Action buttons */}
          <div className={`flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploadingPic}
                className="p-1 sm:p-3 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 relative rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                aria-label="Upload image"
                title="Upload image"
              >
                {isUploadingPic ? (
                  <Loader className="animate-spin h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                ) : (
                  <Image className="h-5 w-5" />
                )}
                <input
                  autoComplete="off"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImg}
                  ref={fileInputRef}
                />
              </button>
              <button
                className="p-2 rounded-full text-amber-50 hover:bg-cyan-700/50 transition-colors"
                title="Add GIF"
                onClick={() => setOpenGif(true)}
              >
                <ImagePlay size={18} />
              </button>
            </div>

            <button
              onClick={handleSubmitPost}
              disabled={(!postDraft.trim() && !imageToSend) || isOverLimit}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                (!postDraft.trim() && !imageToSend) || isOverLimit
                  ? "bg-cyan-600/50 text-amber-50/50 cursor-not-allowed"
                  : "bg-cyan-400 text-cyan-950 hover:bg-cyan-300"
              }`}
            >
              <span>{isExpanded ? "Post" : ""}</span>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostComposer;
