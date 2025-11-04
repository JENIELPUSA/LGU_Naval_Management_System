import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Tourist1 from "../../assets/BiliranTourist12.jpg";
import Tourist2 from "../../assets/BiliranTourist3.jpg";
import Tourist3 from "../../assets/BiliranTourist2.webp";
import BgImage from "../../assets/BiliranTourist45.jfif";
import logo1 from "../../assets/LGU.png";
import logo2 from "../../assets/Dasig.png";
import Maountain from "../../assets/Maountain.jfif";
import { useAccessibility } from "./NavHeader"; // Import the accessibility hook

const TravelBanner = ({ bgtheme, FontColor }) => {
    const accessibility = useAccessibility(); // Use the accessibility hook
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Parallax effect para sa background
    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

    // Animation variants
    const fadeInUp = {
        initial: { y: 60, opacity: 0 },
        animate: { y: 0, opacity: 1 },
    };

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.2 } },
    };

    const scaleIn = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
    };

    const floatingWave = {
        initial: { y: 0 },
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    // Refs for animation triggers
    const textRef = useRef(null);
    const cardsRef = useRef(null);
    const serbisyoRef = useRef(null);

    const textInView = useInView(textRef, { once: true, threshold: 0.3 });
    const cardsInView = useInView(cardsRef, { once: true, threshold: 0.3 });
    const serbisyoInView = useInView(serbisyoRef, { once: true, threshold: 0.3 });

    // Window resize handler
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Mobile detection
    const isMobile = windowWidth < 1024;

    // Translation function for this component
    const t = (key) => {
        const translations = {
            en: {
                letsGo: "LET'S GO",
                travelBiliran: "Travel Biliran",
                discoverParadise: "AND DISCOVER PARADISE",
                description:
                    "Experience the natural wonders of Biliran — from pristine beaches and majestic waterfalls to rich culture and warm hospitality. Your island adventure begins here!",
                exploreDestinations: "Explore Destinations",
                ulanUlanFalls: "Ulan-Ulan Falls",
                tinagoFalls: "Tinago Falls",
                sambawanIsland: "Sambawan Island",
                serbisyongBiliranon: "Serbisyong Biliranon",
                lguLogo: "LGU Logo",
                dasigLogo: "Dasig Logo",
            },
            tl: {
                letsGo: "TAYO'Y",
                travelBiliran: "Maglakbay sa Biliran",
                discoverParadise: "AT TUKLASIN ANG PARAISO",
                description:
                    "Maranasan ang mga likas na kababalaghan ng Biliran — mula sa mga dalisay na beach at makapangyarihang talon hanggang sa mayamang kultura at mainit na pagtanggap. Ang iyong pakikipagsapalaran sa isla ay nagsisimula dito!",
                exploreDestinations: "Tuklasin ang mga Destinasyon",
                ulanUlanFalls: "Ulan-Ulan Falls",
                tinagoFalls: "Tinago Falls",
                sambawanIsland: "Pulo ng Sambawan",
                serbisyongBiliranon: "Serbisyong Biliranon",
                lguLogo: "Logo ng LGU",
                dasigLogo: "Logo ng Dasig",
            },
        };
        return translations[accessibility.language]?.[key] || translations.en[key] || key;
    };

    // Tourist spots data with translations
    const touristSpots = [
        { img: Tourist1, label: t("ulanUlanFalls") },
        { img: Tourist2, label: t("tinagoFalls") },
        { img: Tourist3, label: t("sambawanIsland") },
    ];

    return (
        <section
            className="relative w-full overflow-hidden text-white"
            aria-label={t("travelBiliran")}
        >
            {/* COMBINED SECTION */}
            <div className="flex min-h-screen flex-col">
                {/* MAIN CONTENT - Responsive layout */}
                <div className="relative w-full overflow-hidden text-white">
                    {/* PARALLAX BACKGROUND with breathing effect */}
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${Maountain})`,
                            y: backgroundY,
                        }}
                        animate={accessibility.reducedMotion ? {} : { scale: [1, 1.05, 1] }}
                        transition={
                            accessibility.reducedMotion
                                ? {}
                                : {
                                      duration: 10,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                  }
                        }
                        aria-hidden="true"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-blue-700/50 backdrop-blur-[4px]"></div>

                    {/* SHIMMERING TEXT EFFECTS - Hidden on mobile for performance */}
                    {!isMobile && (
                        <>
                            <motion.div
                                className="absolute left-1/4 top-1/4 -rotate-12 transform bg-gradient-to-r from-blue-300 via-pink-300 to-purple-400 bg-clip-text text-8xl font-extrabold text-transparent"
                                animate={accessibility.reducedMotion ? {} : { backgroundPosition: ["0%", "100%"] }}
                                transition={accessibility.reducedMotion ? {} : { duration: 6, repeat: Infinity, ease: "linear" }}
                                style={{ backgroundSize: "200% auto", opacity: 0.1 }}
                                aria-hidden="true"
                            >
                                Paradise
                            </motion.div>

                            <motion.div
                                className="absolute bottom-1/3 right-1/4 rotate-12 transform bg-gradient-to-r from-pink-300 via-blue-300 to-purple-400 bg-clip-text text-8xl font-extrabold text-transparent"
                                animate={accessibility.reducedMotion ? {} : { backgroundPosition: ["100%", "0%"] }}
                                transition={accessibility.reducedMotion ? {} : { duration: 7, repeat: Infinity, ease: "linear" }}
                                style={{ backgroundSize: "200% auto", opacity: 0.1 }}
                                aria-hidden="true"
                            >
                                Adventure
                            </motion.div>
                        </>
                    )}

                    {/* CONTENT - Responsive layout */}
                    <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-between gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:gap-12 lg:px-8 lg:py-12">
                        {/* LEFT TEXT - Full width on mobile, half on desktop */}
                        <motion.div
                            className="w-full space-y-4 text-center lg:w-1/2 lg:text-left"
                            initial="initial"
                            animate={textInView ? "animate" : "initial"}
                            variants={staggerContainer}
                            ref={textRef}
                        >
                            <motion.div
                                className="space-y-3"
                                variants={fadeInUp}
                            >
                                <h1 className="text-3xl font-bold leading-tight text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.5)] sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
                                    {t("letsGo")}
                                    <motion.span
                                        className="block bg-gradient-to-r from-white to-pink-400 bg-clip-text text-3xl font-black italic text-transparent drop-shadow-[2px_2px_6px_rgba(0,0,0,0.4)] sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={textInView ? { scale: 1, opacity: 1 } : {}}
                                        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                                    >
                                        {t("travelBiliran")}
                                    </motion.span>
                                </h1>
                                <motion.p
                                    className="text-lg font-light tracking-wide text-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)] sm:text-xl lg:text-2xl"
                                    variants={fadeInUp}
                                >
                                    {t("discoverParadise")}
                                </motion.p>
                            </motion.div>

                            <motion.p
                                className="mx-auto max-w-2xl text-base leading-relaxed text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)] lg:mx-0 lg:text-lg"
                                variants={fadeInUp}
                            >
                                {t("description")}
                            </motion.p>

                            <motion.div
                                className="pt-4"
                                variants={fadeInUp}
                            >
                                <motion.button
                                    style={{
                                        background: bgtheme,
                                        color: FontColor,
                                    }}
                                    className="transform rounded-full px-6 py-3 text-base font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:px-8 sm:py-4 sm:text-lg"
                                    whileHover={accessibility.reducedMotion ? {} : { scale: 1.05 }}
                                    whileTap={accessibility.reducedMotion ? {} : { scale: 0.95 }}
                                    onFocus={() => accessibility.speakText(t("exploreDestinations"))}
                                    onClick={() => window.open("https://tourism.biliranisland.com/island-attractions", "_blank")}
                                    aria-label={t("exploreDestinations")}
                                >
                                    {t("exploreDestinations")}
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* RIGHT CARDS - Full width on mobile, half on desktop */}
                        <motion.div
                            className="w-full lg:w-1/2"
                            initial="initial"
                            animate={cardsInView ? "animate" : "initial"}
                            variants={staggerContainer}
                            ref={cardsRef}
                        >
                            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} lg:gap-6`}>
                                {touristSpots.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="group relative"
                                        variants={scaleIn}
                                    >
                                        <motion.div
                                            variants={accessibility.reducedMotion ? {} : floatingWave}
                                            className={`relative transform overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 ${
                                                isMobile ? 'h-48' : 'h-56 lg:h-64'
                                            }`}
                                        >
                                            <img
                                                src={item.img}
                                                alt={item.label}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-3 left-3 right-3 lg:bottom-4 lg:left-4 lg:right-4">
                                                <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-900 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                                                    {item.label}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* SERBISYONG BILIRANON SECTION - Mobile optimized */}
                <motion.div
                    className="relative w-full flex-1 bg-cover bg-center text-white"
                    style={{ backgroundImage: `url(${BgImage})` }}
                    ref={serbisyoRef}
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

                    <div className="relative z-10 flex h-full flex-col items-center justify-center py-6 lg:py-8">
                        {/* LOGOS - Stacked on mobile, side by side on desktop */}
                        <motion.div
                            className={`flex justify-center gap-4 py-4 lg:gap-8 lg:py-6 ${
                                isMobile ? 'flex-col items-center' : 'flex-row'
                            }`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={serbisyoInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.img
                                src={logo1}
                                alt={t("lguLogo")}
                                className={`object-contain ${
                                    isMobile ? 'h-20 sm:h-24' : 'h-[120px] sm:h-[150px] lg:h-[170px]'
                                }`}
                                whileHover={accessibility.reducedMotion ? {} : { scale: 1.05 }}
                                onFocus={() => accessibility.speakText(t("lguLogo"))}
                            />
                            <motion.img
                                src={logo2}
                                alt={t("dasigLogo")}
                                className={`object-contain ${
                                    isMobile ? 'h-16 sm:h-20' : 'h-[120px] sm:h-[130px] lg:h-[200px]'
                                }`}
                                whileHover={accessibility.reducedMotion ? {} : { scale: 1.05 }}
                                onFocus={() => accessibility.speakText(t("dasigLogo"))}
                            />
                        </motion.div>

                        {/* HEADING - Responsive text size */}
                        <motion.div
                            className="flex flex-1 items-center justify-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={serbisyoInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2
                                className="relative z-10 px-4 text-center font-[cursive] italic tracking-wider"
                                style={{
                                    textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
                                    fontFamily: "'Great Vibes', cursive",
                                    fontSize: isMobile ? '2rem' : '3rem',
                                }}
                                onFocus={() => accessibility.speakText(t("serbisyongBiliranon"))}
                            >
                                {t("serbisyongBiliranon")}
                            </h2>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* FLOATING PARTICLES EFFECT - Reduced on mobile for performance */}
            {!accessibility.reducedMotion &&
                [...Array(isMobile ? 3 : 6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-blue-300 to-pink-300 opacity-20 blur-2xl"
                        style={{
                            width: Math.random() * (isMobile ? 40 : 60) + (isMobile ? 20 : 40),
                            height: Math.random() * (isMobile ? 40 : 60) + (isMobile ? 20 : 40),
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: Math.random() * 6 + 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        aria-hidden="true"
                    />
                ))}

            {/* Decorative Elements - Hidden on mobile for performance */}
            {!accessibility.reducedMotion && !isMobile && (
                <>
                    <div
                        className="absolute left-0 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl"
                        aria-hidden="true"
                    ></div>
                    <div
                        className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl"
                        aria-hidden="true"
                    ></div>
                </>
            )}

            {/* Mobile Layout Indicator (for debugging) */}
            {process.env.NODE_ENV === "development" && isMobile && (
                <div className="fixed bottom-2 left-2 rounded bg-green-500 px-2 py-1 text-xs text-white">
                    MOBILE: {windowWidth}px
                </div>
            )}
        </section>
    );
};

export default TravelBanner;