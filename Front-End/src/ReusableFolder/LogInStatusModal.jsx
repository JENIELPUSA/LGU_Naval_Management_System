import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";

export default function LoginStatusModal({ 
  isOpen, 
  onClose, 
  status = "success",
  customMessage 
}) {
  const isSuccess = status === "success";
  const iconSize = 28;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4 z-[999] font-sans"
        >
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { 
                type: "spring", 
                damping: 25, 
                stiffness: 300 
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9, 
              transition: { duration: 0.2 } 
            }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* Header with gradient */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              isSuccess 
                ? "bg-gradient-to-r from-emerald-400 to-cyan-500" 
                : "bg-gradient-to-r from-amber-400 to-orange-500"
            }`} />
            
            <div className="p-6 pt-8 pb-7">
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close modal"
              >
                <FiX size={20} />
              </motion.button>

              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: { 
                    type: "spring", 
                    stiffness: 300,
                    damping: 15,
                    delay: 0.1
                  }
                }}
                className={`mx-auto mb-5 w-20 h-20 flex items-center justify-center rounded-full ${
                  isSuccess 
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500" 
                    : "bg-amber-50 dark:bg-amber-900/30 text-amber-500"
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    transition: { delay: 0.3 }
                  }}
                >
                  {isSuccess ? (
                    <FiCheck size={iconSize} strokeWidth={2.5} />
                  ) : (
                    <FiAlertCircle size={iconSize} strokeWidth={2} />
                  )}
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { delay: 0.4 }
                }}
                className={`text-2xl font-bold text-center mb-3 ${
                  isSuccess 
                    ? "text-emerald-700 dark:text-emerald-400" 
                    : "text-amber-700 dark:text-amber-400"
                }`}
              >
                {isSuccess ? "Login Successful!" : "Login Failed"}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { delay: 0.45 }
                }}
                className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed px-4"
              >
                {customMessage || (
                  isSuccess
                    ? "You've successfully accessed your account. Welcome back!"
                    : "Invalid credentials or connection issue. Please check your details and try again."
                )}
              </motion.p>

              {/* Action button */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { delay: 0.5 }
                }}
                className="mt-6"
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: isSuccess 
                      ? "0 6px 16px rgba(16, 185, 129, 0.25)" 
                      : "0 6px 16px rgba(245, 158, 11, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    isSuccess 
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
                    isSuccess 
                      ? "focus:ring-emerald-400" 
                      : "focus:ring-amber-400"
                  }`}
                >
                  {isSuccess ? "Continue to Dashboard" : "Try Again"}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}