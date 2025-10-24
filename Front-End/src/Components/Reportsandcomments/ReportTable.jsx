import React, { useState, useContext, useEffect } from "react";
import { ReportDisplayContext } from "../../contexts/ReportContext/ReportContext";

const createStarRating = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`h-4 w-4 ${
          i < rating ? "text-amber-400" : "text-slate-300 dark:text-slate-600"
        }`}
      >
        <path d="M12 17.27l-5.18 3.23 1.41-6.42-4.95-4.3 6.43-.55L12 2l2.29 6.23 6.43.55-4.95 4.3 1.41 6.42z" />
      </svg>
    );
  }
  return stars;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const ReportTable = () => {
  const { isReport } = useContext(ReportDisplayContext);
  const [feedbackList, setFeedbackList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  console.log("isReport",isReport)

  useEffect(() => {
    setFeedbackList(isReport || []);
  }, [isReport]);

  const averageRating = feedbackList.length > 0
    ? (feedbackList.reduce((sum, item) => sum + item.rating, 0) / feedbackList.length).toFixed(1)
    : 0;

  const ratingDistribution = feedbackList.reduce((acc, item) => {
    acc[item.rating] = (acc[item.rating] || 0) + 1;
    return acc;
  }, {});

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, feedbackList.length));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">TESTIMONIALS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            What Our Attendees Say
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Real feedback from people who experienced our events
          </p>
        </div>

        {/* Stats Overview */}
        {feedbackList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Average Rating */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Average Rating</span>
                <div className="flex">{createStarRating(Math.round(averageRating))}</div>
              </div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">
                {averageRating}
                <span className="text-lg text-slate-500 dark:text-slate-400 ml-2">/ 5.0</span>
              </div>
            </div>

            {/* Total Reviews */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Total Reviews</span>
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">
                {feedbackList.length}
              </div>
            </div>

            {/* Satisfaction Rate */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Satisfaction Rate</span>
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">
                {Math.round((feedbackList.filter(f => f.rating >= 4).length / feedbackList.length) * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Feedback Cards */}
        {feedbackList.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl">
            <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Be the First to Share!</h3>
            <p className="text-slate-500 dark:text-slate-400">Your feedback helps us create better events.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbackList.slice(0, visibleCount).map((feedback, index) => (
                <div
                  key={feedback._id ?? index}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {feedback.userName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {feedback.userName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(feedback.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    {createStarRating(feedback.rating)}
                    <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {feedback.rating}.0
                    </span>
                  </div>

                  {/* Event Title */}
                  <div className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {feedback.proposalTitle}
                    </p>
                  </div>

                  {/* Feedback */}
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-4">
                    "{feedback.feedback}"
                  </p>

                  {/* Quote Icon */}
                  <div className="mt-4 flex justify-end">
                    <svg className="w-8 h-8 text-slate-200 dark:text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < feedbackList.length && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Load More Reviews
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ReportTable;