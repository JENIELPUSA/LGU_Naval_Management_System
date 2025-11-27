import { useTheme } from "@/hooks/use-theme";
import React, { useContext, useState } from "react";
import { Moon, Sun, ScanQrCode, X } from "lucide-react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import ScannerModal from "../Components/Scanner/ScannerComponent";
import { AuthContext } from "../contexts/AuthContext";

export const Header = ({ collapsed, setCollapsed, bgtheme, FontColor }) => {
  const { theme, setTheme } = useTheme();
  const { role } = useContext(AuthContext);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Tukuyin kung dapat ipakita ang scanner button
  const shouldShowScanner = role && ["admin", "organizer", "staff"].includes(role);

  return (
    <>
      {/* Enhanced Scanner Modal */}
      <AnimatePresence>
        {isScannerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
            >
              {/* Modal Header */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  QR Code Scanner
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsScannerOpen(false)}
                  className="rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Close scanner"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>

              {/* Scanner Content */}
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-4 dark:border-gray-600">
                <ScannerModal
                  isOpen={isScannerOpen}
                  onClose={() => setIsScannerOpen(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        style={{ background: bgtheme }}
        className="relative z-10 flex h-[70px] items-center justify-between px-4 shadow-lg"
      >
        <div className="flex items-center gap-x-3">
          <motion.button
            className="flex size-10 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-95"
            onClick={() => setCollapsed(!collapsed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle navigation"
          >
            <div className="relative h-5 w-5">
              <span
                style={{ backgroundColor: FontColor }}
                className="absolute top-1 block h-0.5 w-4 rounded-full transition-all"
              />
              <span
                style={{ backgroundColor: FontColor }}
                className="absolute top-2 block h-0.5 w-4 rounded-full transition-all"
              />
              <span
                style={{ backgroundColor: FontColor }}
                className="absolute top-3 block h-0.5 w-4 rounded-full transition-all"
              />
            </div>
          </motion.button>
        </div>

        <div className="flex items-center gap-x-3">
          {/* Enhanced Scanner Button (Conditional) */}
          {shouldShowScanner && (
            <motion.button
              className="group relative flex size-10 items-center justify-center rounded-xl transition-all hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open scanner"
              onClick={() => setIsScannerOpen(true)}
            >
              <ScanQrCode
                size={20}
                style={{ color: FontColor }}
                className="transition-transform group-hover:scale-110"
              />
            </motion.button>
          )}

          {/* Enhanced Theme Toggle */}
          <motion.button
            className="relative flex h-7 w-14 items-center rounded-full p-1 shadow-inner"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={false}
          >
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                theme === "light"
                  ? "bg-gradient-to-r from-amber-300 to-orange-400"
                  : "bg-gradient-to-r from-indigo-600 to-purple-700"
              }`}
            />
            <motion.div
              className="relative flex size-5 items-center justify-center rounded-full bg-white shadow-lg"
              animate={theme === "dark" ? { x: 26 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {theme === "light" ? (
                <Sun size={12} className="text-amber-500" />
              ) : (
                <Moon size={12} className="text-indigo-600" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </header>
    </>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
  bgtheme: PropTypes.string,
  FontColor: PropTypes.string,
};