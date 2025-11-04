import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Calendar, ChevronDown, ChevronUp } from "lucide-react";
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
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [loadingButton, setLoadingButton] = useState(null);
    const [debugInfo, setDebugInfo] = useState("");
    const [voiceCommandLog, setVoiceCommandLog] = useState("");
    const [performanceMetrics, setPerformanceMetrics] = useState({});
    const [showCalendar, setShowCalendar] = useState(false);
    
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
                setWindowWidth(window.innerWidth);
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

    // SIMPLIFIED: Plain calendar days without marks
    const calendarDays = useMemo(() => 
        Array.from({ length: 30 }, (_, i) => i + 1), []);

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

    // Mobile detection
    const isMobile = windowWidth < 1024;

    return (
        <motion.section
            ref={heroRef}
            style={{ y, opacity, height: isMobile ? "auto" : getHeroHeight() }}
            className="relative flex w-full max-w-7xl flex-col gap-2 overflow-hidden rounded-3xl lg:flex-row"
        >
            {/* SLIDESHOW SECTION - Full width on mobile, 2/3 on desktop */}
            <div className="relative flex h-[50vh] w-full items-center justify-center overflow-hidden rounded-3xl text-white shadow-md lg:h-auto lg:w-2/3">
                {backgroundImages.map((image, i) => (
                    <motion.div
                        key={i}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                            i === currentBgIndex ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ backgroundImage: `url(${image})` }}
                    />
                ))}

                {/* Navigation Arrows - Smaller on mobile */}
                <button
                    onClick={() => {
                        setCurrentBgIndex(currentBgIndex === 0 ? backgroundImages.length - 1 : currentBgIndex - 1);
                        accessibility.speakText("Previous image");
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/40 lg:left-4 lg:p-3"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="h-4 w-4 text-white lg:h-6 lg:w-6" />
                </button>

                <button
                    onClick={() => {
                        setCurrentBgIndex(currentBgIndex === backgroundImages.length - 1 ? 0 : currentBgIndex + 1);
                        accessibility.speakText("Next image");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/40 lg:right-4 lg:p-3"
                    aria-label="Next image"
                >
                    <ChevronRight className="h-4 w-4 text-white lg:h-6 lg:w-6" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm lg:bottom-4 lg:px-3 lg:text-sm">
                    {currentBgIndex + 1} / {backgroundImages.length}
                </div>
            </div>

            {/* CONTENT SECTION - Stacked on mobile, sidebar on desktop */}
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 rounded-3xl bg-white/80 p-4 backdrop-blur-md lg:mt-0 lg:w-1/3 lg:gap-8 lg:p-8">
                
                {/* Calendar Section - Collapsible on mobile */}
                <div className="w-full lg:max-w-xs">
                    {/* Mobile Calendar Header - Collapsible */}
                    {isMobile && (
                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm lg:hidden"
                        >
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-600" />
                                <h3 className="text-sm font-bold text-gray-700">Calendar</h3>
                            </div>
                            {showCalendar ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    )}

                    {/* Calendar Content */}
                    <div className={`${isMobile ? (showCalendar ? 'block' : 'hidden') : 'block'} rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm lg:p-5`}>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-700 lg:text-lg">Calendar</h3>
                            {!isMobile && (
                                <button
                                    className="rounded-md p-1 hover:bg-gray-100"
                                    aria-label="Calendar"
                                    onClick={() => accessibility.speakText("Calendar showing current month")}
                                >
                                    <Calendar className="h-4 w-4 text-gray-500 lg:h-5 lg:w-5" />
                                </button>
                            )}
                        </div>

                        <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-gray-600">
                            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                                <div key={d}>{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-xs lg:gap-y-1 lg:text-sm">
                            {calendarDays.map((day) => (
                                <div
                                    key={day}
                                    className="mx-auto flex h-6 w-6 items-center justify-center rounded-full text-gray-700 transition-all hover:bg-gray-100 lg:h-8 lg:w-8"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Buttons Section - Stacked vertically */}
                <div className="w-full space-y-3 lg:space-y-4">
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
                            className={`group flex w-full items-center justify-center rounded-full px-4 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg lg:max-w-xs lg:px-6 ${
                                loadingButton === item.label ? "cursor-not-allowed" : "cursor-pointer"
                            }`}
                            aria-label={item.label}
                        >
                            {loadingButton === item.label ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span className="text-sm">Loading...</span>
                                </>
                            ) : (
                                <span
                                    style={{ color: FontColor }}
                                    className="text-sm lg:text-base"
                                >
                                    {item.label}
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Mobile Voice Command Helper */}
                {isMobile && process.env.NODE_ENV === "development" && (
                    <div className="mt-4 w-full rounded-lg bg-yellow-50 p-3">
                        <p className="text-xs text-yellow-800">
                            <strong>Voice Commands:</strong> Try saying "Mayor", "Vice Mayor", or "Register"
                        </p>
                    </div>
                )}
            </div>

            {/* Mobile Layout Indicator (for debugging) */}
            {process.env.NODE_ENV === "development" && isMobile && (
                <div className="fixed bottom-2 left-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
                    MOBILE VIEW: {windowWidth}px
                </div>
            )}
        </motion.section>
    );
};

export default React.memo(HeroSection);