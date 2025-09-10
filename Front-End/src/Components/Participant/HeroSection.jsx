import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroBG1 from "../../assets/hero-image.png";
import heroBG2 from "../../assets/hero-image2.png";
import heroBG3 from "../../assets/hero-image1.png";

const heroBG4 = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80";

const HeroSection = ({ setShowModal }) => {
    const heroRef = useRef(null);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const backgroundImages = [heroBG4, heroBG1, heroBG2, heroBG3];

    // Parallax effect for Hero Section
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Background carousel effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prevIndex) => (prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <motion.section
            ref={heroRef}
            style={{ y, opacity }}
            className="relative mb-16 overflow-hidden rounded-3xl shadow-2xl"
        >
            {/* Carousel Background */}
            <div className="absolute inset-0">
                {backgroundImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                            index === currentBgIndex ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-blue-700/70 via-pink-400/70 to-blue-700/70"></div>
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            ></div>

            <div className="relative px-8 py-20 text-center md:px-16 md:py-32">
                <div className="mx-auto max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6 text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl"
                    >
                        Management of
                        <span className="block bg-gradient-to-r from-blue-200 to-pink-200 bg-clip-text text-transparent drop-shadow-sm">
                            LGU Events
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-blue-100 drop-shadow-md md:text-2xl"
                    >
                        The most advanced platform for planning, managing, and monitoring events in your local government.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
                    >
                        <button
                            onClick={() => setShowModal(true)}
                            className="group flex transform items-center justify-center space-x-2 rounded-full bg-white px-8 py-4 font-bold text-blue-700 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <span>Register Now</span>
                            <svg
                                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-2">
                {backgroundImages.map((_, index) => (
                    <button
                        key={index}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                            index === currentBgIndex ? "scale-125 bg-white" : "bg-white/50"
                        }`}
                        onClick={() => setCurrentBgIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </motion.section>
    );
};

export default HeroSection;