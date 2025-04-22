import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import uploadImage from "../utils/uploadImage";
import axios from "axios";
import { useToast } from "../contexts/NotificationContext";

const ProfilePicture = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { info } = useToast();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarUpload = async () => {
    if (!previewUrl) return;
    try {
      setIsUploading(true);
      console.log(fileToUpload);
      const avatarLink = await uploadImage(fileToUpload);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${currentUser.id}/avatar`,
        { avatarLink },
        { withCredentials: true }
      );

      setPreviewUrl(null);
      setFileToUpload(null);
      navigate(0);
    } catch (error) {
      console.error(error.response.data.message);
      info(error.response.data.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setFileToUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <div
        className=" rounded-full overflow-hidden  relative shadow-lg  transform hover:scale-105 transition-all duration-200  ring-4 ring-white dark:ring-zinc-800 w-30 h-30  bg-gradient-to-br from-blue-300 to-blue-500"
        onClick={handleAvatarClick}
      >
        <img
          className="w-full h-full object-cover"
          src={previewUrl || currentUser?.avatar}
          alt="User Avatar"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer">
          <span className="text-white font-medium">Change</span>
        </div>
        <input
          autoComplete="off"
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {previewUrl && (
        <div className="mt-4 flex space-x-3">
          <button
            onClick={handleAvatarUpload}
            disabled={isUploading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
          >
            {isUploading ? (
              <Loader className="animate-spin h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            ) : (
              "Save"
            )}
          </button>
          <button
            onClick={() => {
              setPreviewUrl(null);
            }}
            className="px-4 py-2 bg-zinc-600 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
