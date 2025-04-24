import { Pencil, XOctagon, Flag, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/NotificationContext";

const DotsMenu = ({ onEdit, onDelete, post }) => {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  const { currentUser } = useAuth();
  const { success, error, info } = useToast();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  const toggleMenu = () => {
    setIsVisible(!isVisible);
  };

  const handleEdit = () => {
    setIsVisible(!isVisible);
    onEdit();
  };
  const handleDelete = () => {
    setIsVisible(!isVisible);
    onDelete();
  };
  const handleReport = () => {
    setIsVisible(!isVisible);
    info("Post reported");
  };

  return (
    <>
      <div className="relative z-10" ref={menuRef}>
        <button
          className="text-amber-50/70 hover:text-amber-50 p-1 rounded-full hover:bg-cyan-700/30 transition-colors duration-100 "
          onClick={toggleMenu}
          aria-label="Menu Options"
        >
          <MoreHorizontal size={16} />
        </button>

        <div
          className={`absolute right-0 top-6 bg-slate-800 rounded-md shadow-lg   transition-all duration-100 ease-in-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1 pointer-events-none"
          }`}
        >
          {currentUser.id === post.userId ? (
            <>
              <button
                className="flex items-center w-full p-1 text-sm text-amber-50/90 hover:bg-cyan-700/30 hover:text-amber-300 transition-colors duration-150"
                onClick={handleEdit}
              >
                <Pencil className="mr-2" size={16} />
                Edit
              </button>
              <button
                className="flex items-center w-full p-1 text-sm text-amber-50/90 hover:bg-cyan-700/30 hover:text-red-400 transition-colors duration-150"
                onClick={handleDelete}
              >
                <XOctagon className="mr-2" size={16} />
                Delete
              </button>
            </>
          ) : (
            <button
              className="flex items-center w-full p-1 text-sm text-amber-50/90 hover:bg-cyan-700/30 hover:text-lime-500 transition-colors duration-150"
              onClick={handleReport}
            >
              <Flag size={16} className="mr-2" />
              Report
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DotsMenu;
