import React, { useState, useContext, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, X, MessageCircle } from "lucide-react";
import { ReportDisplayContext } from "../../contexts/ReportContext/ReportContext";

const StarRating = ({ rating, size = "md" }) => {
  const sizeClasses = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6", xl: "h-8 w-8" };
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          fill={star <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          className={`${sizeClasses[size]} ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
        >
          <path d="M12 17.27l-5.18 3.23 1.41-6.42-4.95-4.3 6.43-.55L12 2l2.29 6.23 6.43.55-4.95 4.3 1.41 6.42z" />
        </svg>
      ))}
    </div>
  );
};

const UserFeedbackModal = ({ isOpen, onClose }) => {
  const { isReport } = useContext(ReportDisplayContext);
  const [feedbackList, setFeedbackList] = useState([]);
  const [lastCommand, setLastCommand] = useState("");

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setFeedbackList(isReport || []);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isReport]);

  // Voice command handler for closing the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleVoiceCommand = (event) => {
      const command = event.detail?.command?.toLowerCase().trim();
      if (!command) return;

      console.log(`💬 Feedback Modal Close Command: "${command}"`);
      setLastCommand(command);

      // Close command for the feedback modal
      if (
        command.includes("close feedback") || 
        command.includes("isara ang feedback") || 
        command.includes("isara feedback") ||
        command.includes("close the feedback") ||
        command.includes("exit feedback") ||
        command.includes("feedback close") ||
        command === "close" ||
        command === "exit" ||
        command === "back" ||
        command === "isara" ||
        command === "umalis" ||
        command === "balik"
      ) {
        onClose();
        // Trigger speech feedback
        window.dispatchEvent(new CustomEvent("speak-text", { 
          detail: { text: "Closing feedback" } 
        }));
      }
    };

    // Keyboard event handler
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener("voice-command", handleVoiceCommand, { capture: true });
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("voice-command", handleVoiceCommand, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const averageRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((s, i) => s + i.rating, 0) / feedbackList.length).toFixed(1)
      : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="relative mx-2 w-full max-w-3xl rounded-2xl bg-white/90 dark:bg-slate-800/90 p-4 sm:p-6 sm:p-8 shadow-2xl backdrop-blur-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full bg-red-500 p-2 text-white hover:bg-red-600 transition-colors"
              aria-label="Close feedback modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Community Feedback
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">
                Hear what our attendees have to say about their experience.
              </p>
              
              {/* Voice Command Hint */}
              <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span className="text-xs text-blue-600 dark:text-blue-300">
                  Say "close feedback" to exit
                </span>
              </div>
            </div>

            {/* Last Command Display (for debugging) */}
            {process.env.NODE_ENV === 'development' && lastCommand && (
              <div className="text-center mb-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-xs text-yellow-700 dark:text-yellow-300">
                  Last command: "{lastCommand}"
                </span>
              </div>
            )}

            {/* Feedback List */}
            <div className="space-y-3 sm:space-y-4 max-h-[50vh] overflow-y-auto">
              {feedbackList.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <ThumbsUp className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No feedback yet.</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Be the first to share your experience!</p>
                </div>
              ) : (
                feedbackList.map((feedback, idx) => (
                  <motion.div
                    key={feedback._id ?? idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-100 dark:bg-slate-700 rounded-xl p-3 sm:p-4 sm:p-5 shadow flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                          {feedback.userName?.charAt(0) ?? "U"}
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                          {feedback.userName || "Anonymous"}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StarRating rating={feedback.rating} size="sm" />
                        <span className="text-amber-600 font-bold text-xs">{feedback.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm italic">"{feedback.feedback}"</p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Average Rating */}
            {feedbackList.length > 0 && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl sm:text-2xl font-bold text-amber-600">{averageRating}</span>
                  <StarRating rating={Math.round(averageRating)} size="md" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    ({feedbackList.length} review{feedbackList.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Average community rating
                </p>
              </div>
            )}

            {/* Footer with voice reminder */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                💡 <strong>Voice Tip:</strong> Say "close feedback" or press ESC to exit
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserFeedbackModal;