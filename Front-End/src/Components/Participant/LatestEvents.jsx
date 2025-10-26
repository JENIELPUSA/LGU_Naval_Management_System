import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users } from "lucide-react";
import Login from "../Login/Login";

const heroBG4 =
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideIn = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const LatestEvents = ({ eventsRef, isEventUpcoming, setShowModal, handleEventSelect }) => {
  const carouselRef = useRef(null);
  const [currentScroll, setCurrentScroll] = useState(0);

  const handleNext = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.querySelector(".carousel-item").offsetWidth + 24;
      const newScroll = currentScroll + itemWidth;
      carouselRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
      setCurrentScroll(newScroll);
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.querySelector(".carousel-item").offsetWidth + 24;
      const newScroll = Math.max(0, currentScroll - itemWidth);
      carouselRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
      setCurrentScroll(newScroll);
    }
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return "TBA";
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const getEventCategory = (event) => {
    const title = event.proposal?.title?.toLowerCase() || "";
    if (title.includes("sports") || title.includes("game")) return "Sports";
    if (title.includes("cultural") || title.includes("fiesta")) return "Cultural";
    if (title.includes("party") || title.includes("celebration")) return "Community";
    return "Event";
  };

  return (
    <motion.section
      ref={eventsRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerChildren}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          
          {/* Header Section */}
          <motion.div 
            variants={fadeIn} 
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-white bg-clip-text text-transparent">
              Latest Events
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Join exciting events and celebrations in your community
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto mt-4 rounded-full" />
          </motion.div>

          {/* Transparent Container for Cards */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden p-6">
            
            {/* Carousel Section */}
            <div className="relative">
              
              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-100"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              <button
                onClick={handleNext}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-100"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="carousel-container flex gap-6 overflow-x-auto pb-8 scroll-smooth px-2"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {Array.isArray(isEventUpcoming) && isEventUpcoming.length > 0 ? (
                  isEventUpcoming.map((event, index) => (
                    <motion.div
                      key={index}
                      variants={slideIn}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="carousel-item group w-80 flex-shrink-0"
                    >
                      {/* Event Card */}
                      <div className="transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-500 hover:shadow-2xl group-hover:-translate-y-2 h-full flex flex-col">
                        
                        {/* Image Container */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={heroBG4}
                            alt={event.proposal?.title || "Event Image"}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                          {/* Category & Date Badges */}
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full shadow-lg">
                              {getEventCategory(event)}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3">
                            <span className="flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full shadow-lg">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatEventDate(event.eventDate)}
                            </span>
                          </div>
                        </div>

                        {/* Content Container */}
                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="mb-2 text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
                            {event.proposal?.title || "Untitled Event"}
                          </h3>
                          <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2 flex-grow">
                            {event.proposal?.description || "No description available."}
                          </p>

                          <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>Naval, Biliran</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              <span>Community</span>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setShowModal(true);
                              handleEventSelect(event);
                            }}
                            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-pink-600 hover:shadow-xl"
                          >
                            Register Now
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div variants={fadeIn} className="w-full text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-pink-100 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
                      <p className="text-gray-500">Check back later for new events in your community.</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Scroll Indicator */}
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2 bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  {Array.isArray(isEventUpcoming) &&
                    isEventUpcoming.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          Math.floor(currentScroll / 304) === index
                            ? "bg-gradient-to-r from-blue-500 to-pink-500 w-8"
                            : "bg-gray-300 w-2"
                        }`}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default LatestEvents;