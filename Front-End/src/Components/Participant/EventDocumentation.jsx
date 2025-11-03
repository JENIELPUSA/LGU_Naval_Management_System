import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Calendar, MapPin } from "lucide-react";
import tsinelasPartyImage from "../../assets/Tsinelast.jpg";
import fiestaImage from "../../assets/hero-image.png";
import culturalNightImage from "../../assets/sports1.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.4, ease: "easeIn" } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const events = [
  {
    title: "Tsinelas Party in Naval, Biliran",
    description:
      "The Tsinelas Party is one of the vibrant and joyful gatherings in Naval, Biliran. It features dancing, food, and various games that symbolize the unity and joy of the community.",
    img: tsinelasPartyImage,
    video: "https://www.youtube.com/embed/qqfz5DgYSR0",
    date: "June 15, 2024",
    location: "Naval Town Plaza",
    category: "Community Event",
  },
  {
    title: "Fiesta Celebration",
    description:
      "The Fiesta is a major celebration in every town and barangay in Biliran. It features street dancing, parades, mass, and various community gatherings.",
    img: fiestaImage,
    video: "https://www.youtube.com/embed/GRqM0FvzZTc",
    date: "May 28, 2024",
    location: "Various Barangays",
    category: "Cultural Festival",
  },
  {
    title: "Cultural & Sports Events",
    description:
      "Included in the programs offered by the LGU Naval are cultural shows and sports activities such as drum & lyre competitions, basketball tournaments, and cultural night.",
    img: culturalNightImage,
    video: "https://www.youtube.com/embed/tmHi8JUdROM",
    date: "July 10, 2024",
    location: "Municipal Stadium",
    category: "Sports & Culture",
  },
];

const EventDocumentation = ({ documentationRef }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  const { scrollYProgress } = useScroll({
    target: documentationRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const cardScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const decorLeftY = useTransform(scrollYProgress, [0, 1], [-50, 200]);
  const decorRightY = useTransform(scrollYProgress, [0, 1], [50, -200]);
  const controlsY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const handleBack = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const currentEvent = events[currentIndex];

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => handleNext(), 6000);
    return () => clearInterval(timer);
  }, [currentIndex, autoPlay]);

  return (
    <motion.section
      ref={documentationRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
      className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-pink-50 overflow-hidden py-8 sm:py-12"
    >
      <motion.div
        style={{ y: decorLeftY }}
        className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-blue-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"
      />
      <motion.div
        style={{ y: decorRightY }}
        className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-pink-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-20"
      />

      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center mb-10"
        >
          <h2 className="mb-3 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            LGU Event Documentation
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto mb-4">
            Explore the vibrant events and celebrations from Naval, Biliran
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          style={{ y: cardY, scale: cardScale }}
          className="relative flex items-center justify-center mb-8"
        >
          <button
            onClick={handleBack}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all md:left-4"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all md:right-4"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-5xl mx-auto overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                <div className="relative overflow-hidden">
                  <img
                    src={currentEvent.img}
                    alt={currentEvent.title}
                    className="w-full h-full min-h-[250px] object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 text-xs sm:text-sm bg-blue-500 text-white font-medium rounded-full">
                      {currentEvent.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                    >
                      <Play className="w-6 h-6 text-blue-600 fill-current" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex flex-col p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2 mb-5">
                    <div className="flex items-center text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs sm:text-sm">{currentEvent.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs sm:text-sm">{currentEvent.location}</span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl sm:text-2xl font-bold text-gray-800">
                    {currentEvent.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-6 flex-grow">
                    {currentEvent.description}
                  </p>

                  <motion.div
                    variants={scaleUp}
                    className="overflow-hidden rounded-lg bg-gray-900"
                  >
                    <div className="relative pt-[56.25%]">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={currentEvent.video.trim()}
                        title={currentEvent.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          style={{ y: controlsY }}
          className="flex flex-col items-center space-y-4"
        >
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
              autoPlay
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {autoPlay ? "⏸️ Auto-play Enabled" : "▶️ Auto-play Disabled"}
          </button>

          <div className="flex space-x-2">
            {events.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex(index);
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-full transition-all h-2 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-blue-500 to-pink-500 w-6"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {currentIndex + 1} of {events.length}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default EventDocumentation;