import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="flex justify-end mb-6">
      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <>
            <FaSun className="text-yellow-500" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <FaMoon className="text-blue-500" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    </div>
  );
};

export default DarkModeToggle;
