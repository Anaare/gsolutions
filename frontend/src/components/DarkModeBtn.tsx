import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const DarkModeBtn = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 p-2 rounded-lg 
             bg-white dark:bg-gs-dark 
             border border-gray-200 dark:border-white/10 
             shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 
             transition-colors 
             text-gs-dark dark:text-gs-text-main font-medium"
    >
      {isDark ? (
        <>
          <Sun size={18} />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={18} />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default DarkModeBtn;
