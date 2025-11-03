import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import heroBG1 from "../../assets/hero-image.png";
import heroBG2 from "../../assets/hero-image2.png";
import heroBG3 from "../../assets/hero-image1.png";
import heroBG4 from "../../assets/Tsinelast.jpg";
import { PersonilContext } from "../../contexts/PersonelContext/PersonelContext";
import { useAccessibility } from "./NavHeader";

const HeroSection = ({ setShowModal, showModal, setShowPersonel, bgtheme, FontColor }) => {
    const personilContext = useContext(PersonilContext);
    const { fetchLatestProfileByPosition } = personilContext || {};
    const heroRef = useRef(null);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [loadingButton, setLoadingButton] = useState(null);
    const [debugInfo, setDebugInfo] = useState("");
    const [voiceCommandLog, setVoiceCommandLog] = useState("");
    const [performanceMetrics, setPerformanceMetrics] = useState({});
    
    // OPTIMIZED: Preload images for faster switching
    const backgroundImages = useMemo(() => [heroBG1, heroBG3, heroBG2, heroBG4], []);
    
    // ULTRA FAST: Optimized command patterns
    const commandPatterns = useMemo(() => ({
        mayor: ['mayor', 'meier', 'major', 'meyer'],
        viceMayor: ['meet our vice', 'vice-mayor', 'vice meier', 'vice major'],
        register: ['register', 'registration', 'rehistro', 'magparehistro'],
        next: ['next', 'next image', 'next picture', 'next slide'],
        previous: ['previous', 'previous image', 'previous picture', 'previous slide', 'back']
    }), []);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const accessibility = useAccessibility();

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Performance monitoring
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            const debugData = {
                setShowModal: typeof setShowModal,
                setShowPersonel: typeof setShowPersonel,
                showModal: showModal,
                fetchLatestProfileByPosition: typeof fetchLatestProfileByPosition,
                contextAvailable: !!personilContext,
                accessibility: !!accessibility,
                lastCommand: voiceCommandLog,
                performance: performanceMetrics
            };
            setDebugInfo(JSON.stringify(debugData, null, 2));
        }
    }, [setShowModal, setShowPersonel, personilContext, fetchLatestProfileByPosition, showModal, accessibility, voiceCommandLog, performanceMetrics]);

    // Window resize handler
    useEffect(() => {
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setWindowHeight(window.innerHeight);
            }, 100);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    // Background rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex(prev => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    // ULTRA FAST VOICE COMMAND HANDLER - OPTIMIZED FOR CONTINUOUS MODE
    useEffect(() => {
        console.log("🎤 HeroSection: Setting up CONTINUOUS voice command listener");

        const handleVoiceCommand = (event) => {
            const startTime = performance.now();
            const command = event.detail?.command;
            if (!command) return;

            const commandLower = command.toLowerCase().trim();
            setVoiceCommandLog(`"${command}" - ${new Date().toLocaleTimeString()}`);

            if (showModal) return;

            // ULTRA FAST PATTERN MATCHING
            let matched = false;
            let actionExecuted = false;
            
            // Direct string includes check (fastest method)
            if (commandPatterns.mayor.some(pattern => commandLower.includes(pattern))) {
                console.log("🎯 FAST MAYOR COMMAND DETECTED");
                handleMeetButtonClick("Mayor");
                matched = true;
                actionExecuted = true;
            } 
            else if (commandPatterns.viceMayor.some(pattern => commandLower.includes(pattern))) {
                console.log("🎯 FAST VICE MAYOR COMMAND DETECTED");
                handleMeetButtonClick("Vice-Mayor");
                matched = true;
                actionExecuted = true;
            }
            else if (commandPatterns.register.some(pattern => commandLower.includes(pattern))) {
                console.log("🎯 FAST REGISTER COMMAND DETECTED");
                handleRegisterEvent();
                matched = true;
                actionExecuted = true;
            }
            else if (commandPatterns.next.some(pattern => commandLower.includes(pattern))) {
                console.log("🎯 FAST NEXT COMMAND DETECTED");
                setCurrentBgIndex(prev => (prev + 1) % backgroundImages.length);
                accessibility.speakText("Next image");
                matched = true;
                actionExecuted = true;
            }
            else if (commandPatterns.previous.some(pattern => commandLower.includes(pattern))) {
                console.log("🎯 FAST PREVIOUS COMMAND DETECTED");
                setCurrentBgIndex(prev => prev === 0 ? backgroundImages.length - 1 : prev - 1);
                accessibility.speakText("Previous image");
                matched = true;
                actionExecuted = true;
            }

            const endTime = performance.now();
            const processingTime = endTime - startTime;
            
            setPerformanceMetrics(prev => ({
                ...prev,
                lastProcessingTime: `${processingTime.toFixed(2)}ms`,
                lastCommand: commandLower,
                matched: matched,
                actionExecuted: actionExecuted,
                timestamp: Date.now()
            }));

            if (!matched) {
                console.log("🔄 No HeroSection match for:", commandLower);
            }
        };

        // HIGH PRIORITY event listener for continuous mode
        window.addEventListener("voice-command", handleVoiceCommand, { 
            capture: true,
            passive: true 
        });
        
        return () => window.removeEventListener("voice-command", handleVoiceCommand, { capture: true });
    }, [accessibility, backgroundImages.length, showModal, commandPatterns]);

    // OPTIMIZED: Height calculation
    const getHeroHeight = useCallback(() => {
        if (windowHeight < 600) return "75vh";
        if (windowHeight < 768) return "85vh";
        if (windowHeight < 1024) return "90vh";
        return "100vh";
    }, [windowHeight]);

    // OPTIMIZED: Async function
    const handleMeetButtonClick = useCallback(async (position) => {
        const buttonLabel = position === "Mayor" ? "Meet the Mayor" : "Meet Our Vice Mayor";
        setLoadingButton(buttonLabel);

        try {
            if (fetchLatestProfileByPosition && typeof fetchLatestProfileByPosition === "function") {
                await fetchLatestProfileByPosition(position);
                
                if (setShowPersonel && typeof setShowPersonel === "function") {
                    setShowPersonel(true);
                    accessibility.speakText(`Opening ${position} profile`);
                }
            } else {
                console.error("fetchLatestProfileByPosition not available");
                accessibility.speakText("Error: Profile function not available");
            }
        } catch (error) {
            console.error(`Error fetching ${position} profile:`, error);
            accessibility.speakText("Error opening profile");
        } finally {
            setLoadingButton(null);
        }
    }, [fetchLatestProfileByPosition, setShowPersonel, accessibility]);

    // OPTIMIZED: Register function
    const handleRegisterEvent = useCallback(() => {
        setLoadingButton("Register Event");

        if (setShowModal && typeof setShowModal === "function") {
            setShowModal(true);
            accessibility.speakText("Opening event registration");
        }

        setTimeout(() => setLoadingButton(null), 200);
    }, [setShowModal, accessibility]);

    // OPTIMIZED: Test functions
    const testVoiceCommand = useCallback((command) => {
        window.dispatchEvent(
            new CustomEvent("voice-command", {
                detail: { command: command },
            }),
        );
    }, []);

    const emergencyDebug = useCallback(() => {
        handleMeetButtonClick("Mayor");
    }, [handleMeetButtonClick]);

    // OPTIMIZED: Memoized components
    const buttons = useMemo(() => [
        {
            label: "Meet the Mayor",
            action: () => handleMeetButtonClick("Mayor"),
            testCommand: "mayor",
        },
        {
            label: "Meet Our Vice Mayor",
            action: () => handleMeetButtonClick("Vice-Mayor"),
            testCommand: "vice mayor",
        },
        {
            label: "Register Event",
            action: handleRegisterEvent,
            testCommand: "register",
        },
    ], [handleMeetButtonClick, handleRegisterEvent]);

    const calendarDays = useMemo(() => 
        Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const isMarked = [3, 10, 17, 25].includes(day);
            return { day, isMarked };
        }), []);

    const testButtonStyle = useCallback((color) => ({
        background: color,
        color: "white",
        border: "none",
        padding: "4px 8px",
        borderRadius: "3px",
        cursor: "pointer",
        fontSize: "10px",
        width: "100%",
    }), []);

    return (
        <motion.section
            ref={heroRef}
            style={{ y, opacity, height: getHeroHeight() }}
            className="relative flex w-full max-w-7xl flex-col gap-2 overflow-hidden rounded-3xl lg:flex-row"
        >
            {/* LEFT SIDE: Slideshow */}
            <div className="relative flex h-[75vh] w-full items-center justify-center overflow-hidden rounded-3xl text-white shadow-md lg:h-auto lg:w-2/3">
                {backgroundImages.map((image, i) => (
                    <motion.div
                        key={i}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                            i === currentBgIndex ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ))}

                <button
                    onClick={() => {
                        setCurrentBgIndex(currentBgIndex === 0 ? backgroundImages.length - 1 : currentBgIndex - 1);
                        accessibility.speakText("Previous image");
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm hover:bg-white/40"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="h-6 w-6 text-white" />
                </button>

                <button
                    onClick={() => {
                        setCurrentBgIndex(currentBgIndex === backgroundImages.length - 1 ? 0 : currentBgIndex + 1);
                        accessibility.speakText("Next image");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm hover:bg-white/40"
                    aria-label="Next image"
                >
                    <ChevronRight className="h-6 w-6 text-white" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    {currentBgIndex + 1} / {backgroundImages.length}
                </div>
            </div>

            {/* RIGHT SIDE: Calendar + Buttons */}
            <div className="relative z-10 mt-4 flex w-full flex-col items-center justify-center gap-8 rounded-3xl bg-white/80 p-8 backdrop-blur-md sm:p-12 lg:mt-0 lg:w-1/3">
                {/* Calendar */}
                <div className="w-full max-w-xs rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-700">Event Calendar</h3>
                        <button
                            className="rounded-md p-1 hover:bg-gray-100"
                            aria-label="Calendar"
                            onClick={() => accessibility.speakText("Event calendar showing current month with marked events")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 2v2M18 2v2M4 10h16M5 22h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-gray-600">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
                        {calendarDays.map(({ day, isMarked }) => (
                            <div
                                key={day}
                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                                    isMarked ? "bg-blue-500 font-bold text-white" : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {day}
                                {isMarked && <span className="absolute bottom-0 right-1 h-1.5 w-1.5 rounded-full bg-pink-400" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons with Spinner */}
                {buttons.map((item, idx) => (
                    <motion.button
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        onClick={item.action}
                        disabled={loadingButton === item.label}
                        style={{
                            background: loadingButton === item.label ? "#9CA3AF" : bgtheme,
                        }}
                        className={`group flex w-full max-w-xs items-center justify-center rounded-full px-6 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg ${
                            loadingButton === item.label ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                        aria-label={item.label}
                    >
                        {loadingButton === item.label ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <span
                                style={{ color: FontColor }}
                                className="text-sm sm:text-base"
                            >
                                {item.label}
                            </span>
                        )}
                    </motion.button>
                ))}
            </div>
        </motion.section>
    );
};

export default React.memo(HeroSection);