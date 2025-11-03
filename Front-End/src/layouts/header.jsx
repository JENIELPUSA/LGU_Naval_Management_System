import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { Moon, Sun } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export const Header = ({ collapsed, setCollapsed, bgtheme, FontColor }) => {
    const { theme, setTheme } = useTheme();

    return (
        <header
            style={{ background: bgtheme }}
            className="relative z-10 flex h-[70px] items-center justify-between px-3 shadow-lg sm:px-4"
        >
            <div className="flex items-center gap-x-2 sm:gap-x-4">
                {/* Hamburger Menu */}
                <motion.button
                    className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 sm:size-10"
                    onClick={() => setCollapsed(!collapsed)}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Toggle navigation"
                >
                    <div className="relative h-5 w-5 sm:h-6 sm:w-6">
                        <span
                            style={{ backgroundColor: FontColor }}
                            className="absolute top-1 block h-0.5 w-4 rounded-full sm:top-2 sm:w-5"
                        />
                        <span
                            style={{ backgroundColor: FontColor }}
                            className="absolute top-2 block h-0.5 w-4 rounded-full sm:top-3 sm:w-5"
                        />
                        <span
                            style={{ backgroundColor: FontColor }}
                            className="absolute top-3 block h-0.5 w-4 rounded-full sm:top-4 sm:w-5"
                        />
                    </div>
                </motion.button>
            </div>

            <div className="flex items-center gap-x-2 sm:gap-x-3">
                {/* Dark Mode Toggle */}
                <motion.button
                    className="relative flex h-6 w-12 items-center rounded-full p-0.5 sm:h-7 sm:w-14"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    whileTap={{ scale: 0.95 }}
                    initial={false}
                >
                    <div
                        className={`absolute inset-0 rounded-full shadow-inner transition-all duration-500 ${
                            theme === "light"
                                ? "bg-gradient-to-r from-pink-300 to-blue-300"
                                : "bg-gradient-to-r from-purple-800 to-blue-900"
                        }`}
                    />
                    <motion.div
                        className="relative flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm sm:h-5 sm:w-5"
                        animate={theme === "dark" ? { x: 24 } : { x: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {theme === "light" ? (
                            <Sun size={10} className="text-yellow-500 sm:size-12" />
                        ) : (
                            <Moon size={10} className="text-blue-300 sm:size-12" />
                        )}
                    </motion.div>
                </motion.button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
    bgtheme: PropTypes.string,
    FontColor: PropTypes.string,
};
