import React, { useRef } from "react";
import { motion } from "framer-motion";
const heroBG4 =
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80";
const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
    visible: { transition: { staggerChildren: 0.2 } },
};

const LatestEvents = ({ eventsRef, isEventUpcoming, setShowModal, handleEventSelect }) => {
    const carouselRef = useRef(null);
    const handleNext = () => {
        if (carouselRef.current) {
            const itemWidth = carouselRef.current.querySelector(".carousel-item").offsetWidth + 24;
            carouselRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
        }
    };

    const handlePrev = () => {
        if (carouselRef.current) {
            const itemWidth = carouselRef.current.querySelector(".carousel-item").offsetWidth + 24;
            carouselRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
        }
    };

    const formatEventDate = (dateString) => {
        if (!dateString) return "TBA"; // fallback
        const options = { year: "numeric", month: "short", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", options); // halimbawa: Sep 09, 2025
    };

    return (
        <motion.section
            ref={eventsRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="mb-20"
        >
            <div className="mb-12 text-center">
                <motion.h2
                    variants={fadeIn}
                    className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl"
                >
                    Latest Events
                </motion.h2>
                <motion.p
                    variants={fadeIn}
                    className="text-xl text-gray-600"
                >
                    Join exciting events in your community
                </motion.p>
            </div>

            <div className="relative">
                <div
                    ref={carouselRef}
                    className="carousel-container flex gap-6 overflow-x-auto pb-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {Array.isArray(isEventUpcoming) && isEventUpcoming.length > 0 ? (
                        isEventUpcoming.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="carousel-item group w-80 flex-shrink-0"
                            >
                                <div className="transform overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl group-hover:-translate-y-2">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={heroBG4}
                                            alt={event.proposal?.title || "Event Image"}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-t ${event.color || "from-gray-500 to-transparent"} opacity-80`}
                                        ></div>
                                        <div className="absolute left-4 top-4 flex items-center space-x-2">
                                            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-800">
                                                {formatEventDate(event.eventDate)}
                                            </span>
                                        </div>

                                    </div>
                                    <div className="p-6">
                                        <h3 className="mb-3 text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                                            {event.proposal?.title || "Untitled Event"}
                                        </h3>
                                        <p className="mb-4 leading-relaxed text-gray-600">
                                            {event.proposal?.description || "No description available."}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setShowModal(true);
                                                handleEventSelect(event);
                                            }}
                                            className="w-full transform rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-pink-600"
                                        >
                                            Register Event
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="w-full text-center text-gray-500">No upcoming events</p>
                    )}
                </div>
                <button
                    onClick={handlePrev}
                    className="group absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 transform items-center justify-center rounded-full border border-gray-200 bg-white bg-opacity-90 shadow-xl backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-2xl"
                >
                    <svg
                        className="h-6 w-6 text-gray-600 transition-colors group-hover:text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <button
                    onClick={handleNext}
                    className="group absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 transform items-center justify-center rounded-full border border-gray-200 bg-white bg-opacity-90 shadow-xl backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-2xl"
                >
                    <svg
                        className="h-6 w-6 text-gray-600 transition-colors group-hover:text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </motion.section>
    );
};

export default LatestEvents;
