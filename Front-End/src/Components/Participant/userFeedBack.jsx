import React, { useState, useContext, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Calendar, MapPin, Users, Star, ThumbsUp } from "lucide-react";
import { ReportDisplayContext } from "../../contexts/ReportContext/ReportContext";

const StarRating = ({ rating, animate = false, size = "md" }) => {
  const [animatedRating, setAnimatedRating] = useState(0);
  const sizeClasses = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6", xl: "h-8 w-8" };

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimatedRating(rating), 300);
      return () => clearTimeout(timer);
    } else setAnimatedRating(rating);
  }, [rating, animate]);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div key={star} whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className={`${sizeClasses[size]} ${
              star <= animatedRating ? "text-amber-400 drop-shadow-sm" : "text-gray-300"
            } transition-all duration-500`}
            style={{ transitionDelay: animate ? `${star * 100}ms` : "0ms" }}
          >
            <path d="M12 17.27l-5.18 3.23 1.41-6.42-4.95-4.3 6.43-.55L12 2l2.29 6.23 6.43.55-4.95 4.3 1.41 6.42z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const RatingBar = ({ rating, count, total }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center space-x-2 group">
      <div className="flex items-center space-x-1 w-7">
        <span className="text-xs sm:text-sm font-medium text-gray-700">{rating}</span>
        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-current" />
      </div>
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full"
        />
      </div>
      <span className="text-xs sm:text-sm text-gray-600 w-10 text-right font-medium">{count}</span>
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const UserFeedback = ({ feedbackRef }) => {
  const { isReport } = useContext(ReportDisplayContext);
  const [feedbackList, setFeedbackList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: feedbackRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const feedbackListY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const sidebarY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const sidebarScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);
  const decorLeftY = useTransform(scrollYProgress, [0, 1], [-80, 150]);
  const decorRightY = useTransform(scrollYProgress, [0, 1], [80, -150]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedbackList(isReport || []);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [isReport]);

  const averageRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((s, i) => s + i.rating, 0) / feedbackList.length).toFixed(1)
      : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].reduce((acc, r) => {
    acc[r] = feedbackList.filter((f) => f.rating === r).length;
    return acc;
  }, {});
  const satisfactionRate =
    feedbackList.length > 0
      ? Math.round((feedbackList.filter((f) => f.rating >= 4).length / feedbackList.length) * 100)
      : 0;

  const handleLoadMore = () => setVisibleCount((v) => Math.min(v + 6, feedbackList.length));

  const containerVariants = { visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <section
      ref={feedbackRef}
      className="mb-8 relative min-h-screen flex flex-col justify-center py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-white to-pink-50 overflow-hidden"
    >
      <motion.div
        style={{ y: decorLeftY }}
        className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-blue-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"
      />
      <motion.div
        style={{ y: decorRightY }}
        className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-pink-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-20"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Community Feedback
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto mt-3">
            Hear what our attendees have to say about their experience.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <motion.div style={{ y: feedbackListY }} className="lg:w-2/3">
            {isLoading ? (
              <div className="space-y-5 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 shadow h-28" />
                ))}
              </div>
            ) : feedbackList.length === 0 ? (
              <div className="text-center py-12 bg-white/80 rounded-2xl border shadow">
                <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No feedback yet.</p>
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
                <AnimatePresence>
                  {feedbackList.slice(0, visibleCount).map((feedback, index) => (
                    <motion.div
                      key={feedback._id ?? index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.015, translateX: 8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-white rounded-xl p-5 shadow border hover:border-blue-200 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                            {feedback.userName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{feedback.userName || "Anonymous"}</h4>
                            <p className="text-xs text-gray-500">{formatDate(feedback.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <StarRating rating={feedback.rating} size="sm" />
                          <span className="text-amber-600 font-bold text-xs">{feedback.rating}.0</span>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700 text-sm italic">"{feedback.feedback}"</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {feedbackList.length > visibleCount && !isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleLoadMore}
                  className="px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all"
                >
                  Load More Reviews
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {feedbackList.length > 0 && (
            <motion.div style={{ y: sidebarY, scale: sidebarScale }} className="lg:w-1/3 space-y-5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white/80 rounded-xl p-5 shadow hover:shadow-xl transition-shadow"
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 text-center">
                  {averageRating}
                  <span className="text-gray-500 text-sm ml-1">/5</span>
                </h3>
                <div className="flex justify-center mb-2">
                  <StarRating rating={Math.round(averageRating)} animate size="md" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 text-center mb-3">Average Rating</p>
                <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex justify-between text-xs sm:text-sm font-medium text-blue-700">
                    <span>Satisfaction Rate</span>
                    <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-700 mt-1">{satisfactionRate}%</div>
                  <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${satisfactionRate}%` }}
                      transition={{ duration: 1 }}
                      className="bg-gradient-to-r from-blue-500 to-pink-500 h-1.5 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white/80 rounded-xl p-5 shadow hover:shadow-xl transition-shadow"
              >
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Rating Breakdown</h4>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <RatingBar key={r} rating={r} count={ratingDistribution[r] || 0} total={feedbackList.length} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserFeedback;