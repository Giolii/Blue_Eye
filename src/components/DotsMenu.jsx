import { Pencil, XOctagon, Flag, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/NotificationContext";

const DotsMenu = ({ onEdit, onDelete, post }) => {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  const { currentUser } = useAuth();
  const { success, errorToast, info } = useToast();

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
    errorToast("Post deleted");
  };
  const handleReport = () => {
    setIsVisible(!isVisible);
    info("Post reported");
  };

  return (
    <>
      <div className="relative " ref={menuRef}>
        <button
          className="text-slate-500 dark:text-slate-400 
                   hover:text-slate-700 dark:hover:text-slate-300 
                   p-1 rounded-full 
                   hover:bg-slate-200/70 dark:hover:bg-slate-700/70 
                   transition-colors duration-200"
          onClick={toggleMenu}
          aria-label="Menu Options"
        >
          <MoreHorizontal size={16} />
        </button>

        <div
          className={`absolute right-0 top-6 
                     bg-white dark:bg-slate-800 
                     rounded-lg shadow-lg overflow-hidden
                     border border-slate-200/70 dark:border-slate-700/70
                     min-w-32
                     transition-all duration-150 ease-in-out ${
                       isVisible
                         ? "opacity-100 translate-y-0"
                         : "opacity-0 translate-y-1 pointer-events-none"
                     }`}
        >
          {currentUser.id === post.userId ? (
            <>
              <button
                className="flex items-center w-full px-3 py-2 text-sm 
                         text-slate-700 dark:text-slate-300 
                         hover:bg-slate-100 dark:hover:bg-slate-700 
                         hover:text-sky-600 dark:hover:text-sky-400 
                         transition-colors duration-150"
                onClick={handleEdit}
              >
                <Pencil className="mr-2" size={16} />
                Edit
              </button>
              <button
                className="flex items-center w-full px-3 py-2 text-sm 
                         text-slate-700 dark:text-slate-300 
                         hover:bg-slate-100 dark:hover:bg-slate-700 
                         hover:text-rose-600 dark:hover:text-rose-400 
                         transition-colors duration-150"
                onClick={handleDelete}
              >
                <XOctagon className="mr-2" size={16} />
                Delete
              </button>
            </>
          ) : (
            <button
              className="flex items-center w-full px-3 py-2 text-sm 
                       text-slate-700 dark:text-slate-300 
                       hover:bg-slate-100 dark:hover:bg-slate-700 
                       hover:text-amber-600 dark:hover:text-amber-400 
                       transition-colors duration-150"
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
