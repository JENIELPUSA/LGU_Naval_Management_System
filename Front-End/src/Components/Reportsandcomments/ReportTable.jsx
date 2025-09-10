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
        className={`h-5 w-5 transition-colors duration-300 ${
          i < rating
            ? "text-amber-400 drop-shadow-sm"
            : "text-slate-300 dark:text-slate-700"
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
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
};

const Reports = () => {
  const { isReport, totalPages, currentPage, setCurrentPage,DeleteReport } = useContext(ReportDisplayContext);
  const [commentList, setCommentList] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setCommentList(isReport || []);
  }, [isReport]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await DeleteReport(id)
    // Add a small delay for better UX
    setTimeout(() => {
      setCommentList((prev) => prev.filter((c) => c._id !== id));
      setDeletingId(null);
    }, 200);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950";
    if (rating >= 3) return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950";
    return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950";
  };

  const getRatingText = (rating) => {
    if (rating >= 4) return "Excellent";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Fair";
    return "Poor";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10 dark:bg-slate-900/80 dark:border-slate-700/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:via-slate-300 dark:to-slate-400">
              Event Feedback & Reviews
            </h1>
            <p className="mt-2 text-slate-600 text-lg dark:text-slate-400">
              {commentList.length > 0
                ? `Showing ${commentList.length} review${commentList.length !== 1 ? 's' : ''}`
                : "No reviews available"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {commentList.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 dark:bg-slate-800">
              <svg className="w-12 h-12 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2 dark:text-slate-300">No Reviews Yet</h3>
            <p className="text-slate-500 dark:text-slate-400">Comments and feedback will appear here once submitted.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {commentList.map((comment, index) => (
              <div
                key={comment._id ?? index}
                className={`relative group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 overflow-hidden dark:bg-slate-800 dark:border-slate-700/50 ${
                  deletingId === comment._id ? "scale-95 opacity-50" : "hover:scale-[1.02]"
                }`}
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(comment._id)}
                  disabled={deletingId === comment._id}
                  className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full bg-white shadow-md hover:bg-red-50 hover:text-red-600 text-slate-400 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-red-900 dark:hover:text-red-400 dark:text-slate-400"
                  aria-label="Delete comment"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"/>
                  </svg>
                </button>

                {/* Card Content */}
                <div className="p-6">
                  {/* Rating Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {createStarRating(comment.rating)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRatingColor(comment.rating)}`}>
                        {getRatingText(comment.rating)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl dark:bg-slate-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {comment.userName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate dark:text-slate-100">
                          {comment.userName}
                        </p>
                        <p className="text-sm text-slate-600 truncate dark:text-slate-400">
                          <span className="inline-flex items-center">
                            <svg className="w-3 h-3 mr-1 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {comment.proposalTitle}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900 dark:text-slate-200">Feedback:</h4>
                    <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-3 rounded-xl dark:bg-slate-700 dark:text-slate-300">
                      {comment.feedback}
                    </p>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className={`h-1 ${
                  comment.rating >= 4 ? "bg-gradient-to-r from-emerald-400 to-green-500" :
                  comment.rating >= 3 ? "bg-gradient-to-r from-amber-400 to-yellow-500" :
                  "bg-gradient-to-r from-red-400 to-pink-500"
                }`} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Enhanced Pagination Footer */}
      {totalPages > 1 && (
        <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 mt-12 dark:bg-slate-900/80 dark:border-slate-700/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              {/* Page Info */}
              <div className="text-slate-600 text-sm dark:text-slate-400">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`group flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                      : "bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200 hover:shadow-md dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-slate-600"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          pageNum === currentPage
                            ? "bg-blue-600 text-white shadow-lg dark:bg-blue-500"
                            : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-slate-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`group flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                      : "bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200 hover:shadow-md dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-slate-600"
                  }`}
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Reports;