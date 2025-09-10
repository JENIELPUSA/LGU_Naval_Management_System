import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX, FiCheck, FiAlertCircle } from "react-icons/fi";

export default function StatusModal({ 
  isOpen, 
  onClose, 
  status = "success",
  customError = "" 
}) {
  const isSuccess = status === "success";
  const [visible, setVisible] = useState(false);

  // Handle animation transitions
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        damping: 25,
        stiffness: 300
      } 
    }
  };

  return visible ? (
    <motion.div
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      exit="hidden"
      variants={backdropVariants}
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-[999] p-4 font-sans backdrop-blur-md"
    >
      <motion.div
        variants={modalVariants}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-8 rounded-3xl shadow-2xl max-w-md w-full relative border border-gray-100 dark:border-gray-800"
      >
        <motion.button
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close modal"
        >
          <FiX className="text-2xl" />
        </motion.button>

        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.7, 
            type: "spring", 
            stiffness: 300,
            damping: 15
          }}
          className={`mx-auto mb-6 w-28 h-28 flex items-center justify-center rounded-full
            ${isSuccess 
              ? "bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20" 
              : "bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/20"}
            text-white`}
        >
          <motion.div
            animate={{ 
              scale: [0.8, 1.1, 1],
              rotate: [0, isSuccess ? 5 : -5, 0]
            }}
            transition={{ duration: 0.5 }}
            className="text-5xl"
          >
            {isSuccess ? <FiCheck /> : <FiAlertCircle />}
          </motion.div>
        </motion.div>

        <div className="text-center mb-7">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-3 text-gray-900 dark:text-white"
          >
            {isSuccess ? "Action Successful!" : "Operation Failed"}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed"
          >
            {isSuccess
              ? "Your request has been processed successfully. Everything is looking great!"
              : "We encountered an issue while processing your request."}
          </motion.p>
          
          {!isSuccess && customError && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/50 text-left"
            >
              <p className="text-sm font-medium text-rose-700 dark:text-rose-200 mb-2 flex items-center">
                <FiAlertCircle className="mr-2" /> Error Details:
              </p>
              <p className="text-rose-600 dark:text-rose-300 text-sm break-words">
                {customError}
              </p>
            </motion.div>
          )}
        </div>

        <motion.button
          whileHover={{ 
            scale: 1.03,
            boxShadow: isSuccess 
              ? "0 10px 25px -5px rgba(59, 130, 246, 0.4)" 
              : "0 10px 25px -5px rgba(244, 63, 94, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg relative overflow-hidden
            ${isSuccess 
              ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
              : "bg-gradient-to-r from-rose-500 to-red-600"}
            transition-all duration-300`}
        >
          <span className="relative z-10">
            {isSuccess ? "Continue" : "Try Again"}
          </span>
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
        </motion.button>
      </motion.div>
    </motion.div>
  ) : null;
}