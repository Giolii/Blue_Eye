import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full 
               text-slate-800 dark:text-slate-300
               hover:text-amber-500 dark:hover:text-amber-300
               hover:bg-slate-200/70 dark:hover:bg-slate-700/70
               transition-all duration-300 transform hover:scale-110
               focus:outline-none focus:ring-2 focus:ring-offset-1
               focus:ring-amber-400/50 dark:focus:ring-amber-300/50
               focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
