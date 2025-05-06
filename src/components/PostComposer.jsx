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
      setImageToSend(null);
      setImageToSendPreview(null);
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
      <div
        className="border border-slate-300/30 dark:border-slate-700/30 rounded-2xl 
                    shadow-lg p-5 mb-6 transition-all duration-300 
                    bg-gradient-to-br from-slate-100/90 to-blue-100/90 
                    dark:from-slate-800/90 dark:to-slate-900/90 
                    backdrop-filter backdrop-blur-sm"
      >
        <div className="flex flex-col gap-4">
          {/* Text area for post composition */}
          <div
            className="relative w-full"
            onClick={() => !isExpanded && setIsExpanded(true)}
          >
            <textarea
              value={postDraft}
              onFocus={() => setIsExpanded(true)}
              onBlur={() =>
                !postDraft.trim() && !imageToSendPreview && setIsExpanded(false)
              }
              onChange={(e) => setPostDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              className={`w-full p-4 rounded-xl 
                        text-slate-700 dark:text-slate-200 
                        placeholder-slate-500/60 dark:placeholder-slate-400/60 
                        bg-white/60 dark:bg-slate-700/60 
                        border ${
                          isOverLimit
                            ? "border-red-500 dark:border-red-500"
                            : "border-slate-300/50 dark:border-slate-600/50 focus:border-sky-400/60 dark:focus:border-sky-500/60"
                        } 
                        outline-none resize-none transition-all duration-300 ${
                          isExpanded ? "h-28" : "h-14"
                        } 
                        shadow-inner focus:shadow-sky-400/5 dark:focus:shadow-sky-500/5`}
              rows={isExpanded ? 3 : 1}
              ref={inputRef}
            />

            {/* Character counter - only visible when expanded or typing */}
            {(isExpanded || characterCount > 0) && (
              <div
                className={`absolute bottom-3 right-4 text-xs font-medium transition-all duration-200 ${
                  isOverLimit
                    ? "text-red-500 dark:text-red-400"
                    : characterCount > charLimit * 0.8
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-500/70 dark:text-slate-400/70"
                }`}
              >
                {characterCount}/{charLimit}
              </div>
            )}
          </div>

          {/* Picture Preview */}
          {imageToSendPreview && (
            <div className="relative mx-auto overflow-hidden transition-all duration-300 group">
              <div
                className="relative max-w-xs rounded-xl overflow-hidden 
                           border border-slate-300/50 dark:border-slate-600/50 
                           shadow-md"
              >
                <button
                  className="absolute top-2 right-2 p-1.5 
                           bg-black/60 hover:bg-red-600/90 
                           rounded-full transition-all duration-200 text-white"
                  onClick={() => {
                    setImageToSendPreview(null);
                    setImageToSend(null);
                  }}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
                <img
                  src={imageToSendPreview}
                  alt="Upload preview"
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploadingPic}
                className="p-2.5 rounded-full 
                         text-slate-600 dark:text-slate-300 
                         hover:text-sky-600 dark:hover:text-sky-400 
                         transition-colors duration-200 
                         hover:bg-slate-200/70 dark:hover:bg-slate-700/70 
                         focus:outline-none focus:ring-2 focus:ring-offset-1 
                         focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 
                         focus:ring-sky-400/50 dark:focus:ring-sky-500/50 
                         disabled:opacity-50"
                aria-label="Upload image"
                title="Upload image"
              >
                {isUploadingPic ? (
                  <Loader className="animate-spin h-5 w-5 text-sky-500 dark:text-sky-400" />
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
                className="p-2.5 rounded-full 
                         text-slate-600 dark:text-slate-300 
                         hover:text-indigo-600 dark:hover:text-indigo-400 
                         transition-colors duration-200 
                         hover:bg-slate-200/70 dark:hover:bg-slate-700/70 
                         focus:outline-none focus:ring-2 focus:ring-offset-1 
                         focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 
                         focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50"
                title="Add GIF"
                onClick={() => setOpenGif(true)}
                aria-label="Add GIF"
              >
                <ImagePlay className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={handleSubmitPost}
              disabled={(!postDraft.trim() && !imageToSend) || isOverLimit}
              className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-medium 
                       transition-all duration-300 transform ${
                         (!postDraft.trim() && !imageToSend) || isOverLimit
                           ? "bg-slate-300/50 dark:bg-slate-700/50 text-slate-500/50 dark:text-slate-400/30 cursor-not-allowed"
                           : "bg-gradient-to-r from-sky-500 to-indigo-500 dark:from-sky-600 dark:to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-600 dark:hover:from-sky-500 dark:hover:to-indigo-500 active:scale-95 hover:shadow-lg hover:shadow-sky-400/20 dark:hover:shadow-indigo-500/20"
                       }`}
            >
              <span className="transition-all duration-300 opacity-100">
                {isExpanded || postDraft.trim() || imageToSend ? "Post" : ""}
              </span>
              <Send
                className={`h-4 w-4 ${
                  isExpanded || postDraft.trim() || imageToSend ? "ml-1" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostComposer;
