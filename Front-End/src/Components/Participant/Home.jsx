import React, { useRef, useState, useContext, useEffect, useCallback, useMemo } from "react";
import { EventDisplayContext } from "../../contexts/EventContext/EventContext";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";
import NavHeader, { useAccessibility } from "./NavHeader";
import HeroSection from "./HeroSection";
import ThresholdSection from "./ThreeSectionContainer";
import AboutSection from "./AboutSection";
import Footer from "./Footer";
import RegistrationModal from "./RegistrationModal";
import LoadingOverlay from "../../ReusableFolder/LoadingOverlay";
import { ArrowUp, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TravelBanner from "./TravelBanner";
import ParticipantDashboard from "./ParticipantDashboard";
import DocumentLayout from "./DocumentLayout";
import ContactUsForm from "./ContactUs";
import { PersonilContext } from "../../contexts/PersonelContext/PersonelContext";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import VoiceController from "./VoiceController";
import VenueMap from "../Venue/VenueMap";

const HomeDashboard = () => {
    const { profile, bgtheme, FontColor } = useContext(PersonilContext);
    const { AddParticipant, isLoading, setIsLoading } = useContext(ParticipantDisplayContext);
    const { isEventUpcoming, FetchUpcomingEvent, UpcomingTotalPages, UpcomingCurrentPage, setUpcomingCurrentPage } = useContext(EventDisplayContext);
    const [isShowPersonel, setShowPersonel] = useState(false);
    const [showMainSections, setShowMainSections] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showVenueMap, setShowVenueMap] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        eventId: "",
        eventTitle: "",
    });
    const [registrationSuccess, setRegistrationSuccess] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showUpButton, setShowUpButton] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isNavigating, setIsNavigating] = useState(false);
    const [navigationDestination, setNavigationDestination] = useState("");
    const [lastCommandTime, setLastCommandTime] = useState(0);
    const [isListening, setIsListening] = useState(false);

    const heroRef = useRef(null);
    const eventsRef = useRef(null);
    const feedbacRef = useRef(null);
    const aboutRef = useRef(null);
    const documentationRef = useRef(null);
    const commandCooldownRef = useRef(0);

    const accessibility = useAccessibility();

    const handleOpenVenueMap = useCallback(() => {
        setShowVenueMap(true);
        setIsNavigating(true);
        setNavigationDestination("venue map");
        setTimeout(() => {
            setIsNavigating(false);
            accessibility.speakText("Opening Biliran map");
        }, 200);
    }, [accessibility]);

    const handleCloseVenueMap = useCallback(() => {
        setShowVenueMap(false);
        accessibility.speakText("Map closed");
    }, [accessibility]);

    useEffect(() => {
        const handleSpeechStateChange = (event) => {
            const { isListening: listening } = event.detail || {};
            setIsListening(listening);
        };

        window.addEventListener("speech-state-change", handleSpeechStateChange);
        return () => window.removeEventListener("speech-state-change", handleSpeechStateChange);
    }, []);

    const { startListening, stopListening, toggleListening } = useSpeechRecognition({
        autoStart: false,
        onStateChange: (listening) => {
            console.log(`🎤 Speech recognition ${listening ? "started" : "stopped"}`);
        },
    });

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.scrollY;
                    const docHeight = document.body.scrollHeight - window.innerHeight;
                    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                    setScrollProgress(scrolled);
                    setShowUpButton(scrollTop > 400);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [showMainSections, isShowPersonel]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const scrollToBottom = useCallback(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, []);

    const scrollUp = useCallback(() => {
        window.scrollBy({ top: -300, behavior: "smooth" });
        accessibility.speakText("Scrolled up");
    }, [accessibility]);

    const scrollDown = useCallback(() => {
        window.scrollBy({ top: 300, behavior: "smooth" });
        accessibility.speakText("Scrolled down");
    }, [accessibility]);

    const scrollToSection = useCallback(
        (ref, sectionName = "") => {
            if (ref?.current) {
                ref.current.scrollIntoView({
                    behavior: accessibility.reducedMotion ? "auto" : "smooth",
                    block: "start",
                });

                setTimeout(() => {
                    setIsNavigating(false);
                    if (sectionName) {
                        accessibility.speakText(`Now viewing ${sectionName}`);
                    }
                }, 400);
            }
        },
        [accessibility.reducedMotion, accessibility],
    );

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            try {
                setIsLoading(true);
                setIsNavigating(true);
                setNavigationDestination("registration");

                const response = await AddParticipant(formData);
                setRegistrationSuccess({
                    participant: response.data.participant,
                    pdfBase64: response.data.pdfBase64,
                });
                setIsNavigating(false);
                accessibility.speakText("Registration successful! Thank you.");
            } catch (error) {
                console.error("Error adding participant:", error);
                setIsNavigating(false);
                accessibility.speakText("Registration failed. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
        [formData, AddParticipant, setIsLoading, accessibility],
    );

    const handleEventSelect = useCallback(
        (event) => {
            setSelectedEvent(event);
            setFormData((prev) => ({
                ...prev,
                eventId: event._id,
                eventTitle: event.proposal?.title || "",
            }));
            setShowModal(true);
            accessibility.speakText(`Selected: ${event.proposal?.title}. Opening form.`);
        },
        [accessibility],
    );

    const handleClickHome = useCallback(() => {
        setIsNavigating(true);
        setNavigationDestination("home");

        setShowMainSections(true);
        setShowPersonel(false);
        setActiveSection("home");
        scrollToTop();

        setTimeout(() => {
            setIsNavigating(false);
            accessibility.speakText("Home dashboard");
        }, 300);
    }, [scrollToTop, accessibility]);

    const handleSectionChange = useCallback(
        (section) => {
            setIsNavigating(true);
            setNavigationDestination(section);
            setActiveSection(section);

            if (!showMainSections && !isShowPersonel) {
                scrollToTop();
                setTimeout(() => {
                    setIsNavigating(false);
                    accessibility.speakText(`${section} section`);
                }, 300);
            } else if (showMainSections && !isShowPersonel) {
                const refs = {
                    home: heroRef,
                    events: eventsRef,
                    feedback: feedbacRef,
                    about: aboutRef,
                    documentation: documentationRef,
                };

                if (refs[section]) {
                    scrollToSection(refs[section], section);
                }
            }
        },
        [showMainSections, isShowPersonel, scrollToTop, accessibility, scrollToSection],
    );

    const handleShowPersonel = useCallback(() => {
        setIsNavigating(true);
        setNavigationDestination("personnel");

        setShowPersonel(true);
        setShowMainSections(false);
        setActiveSection("home");
        scrollToTop();

        setTimeout(() => {
            setIsNavigating(false);
            accessibility.speakText("Personnel dashboard");
        }, 300);
    }, [scrollToTop, accessibility]);

    const resetRegistrationFlow = useCallback(() => {
        setRegistrationSuccess(null);
        setShowModal(false);
        setSelectedEvent(null);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            eventId: "",
            eventTitle: "",
        });
        accessibility.speakText("Form reset");
    }, [accessibility]);

    useEffect(() => {
        const COMMAND_DEBOUNCE_MS = 200;

        const handleGlobalVoiceCommand = (event) => {
            const command = event.detail?.command;
            if (!command) return;

            const now = Date.now();
            if (now - commandCooldownRef.current < COMMAND_DEBOUNCE_MS) return;
            commandCooldownRef.current = now;

            const commandLower = command.toLowerCase().trim();
            setLastCommandTime(now);

            console.log(`🎯 FAST Global Command: "${command}"`);

            setIsNavigating(true);

            const heroCommands = ["meet the mayor", "mayor", "vice mayor", "register event", "register", "next", "previous"];
            if (heroCommands.some((cmd) => commandLower.includes(cmd)) && showMainSections) {
                setNavigationDestination("hero");
                window.dispatchEvent(
                    new CustomEvent("hero-voice-command", {
                        detail: { command },
                    }),
                );
                setTimeout(() => setIsNavigating(false), 150);
                return;
            }

            const executeCommand = (action, destination = "command") => {
                setNavigationDestination(destination);
                setTimeout(action, 10);
            };

            const commandActions = {
                register: () => {
                    if (!showModal && isEventUpcoming?.length > 0) {
                        setShowModal(true);
                        setTimeout(() => {
                            setIsNavigating(false);
                            accessibility.speakText("Registration form");
                        }, 200);
                    } else {
                        setIsNavigating(false);
                        accessibility.speakText("No events available");
                    }
                },
                closeModal: () => {
                    if (showModal) {
                        setShowModal(false);
                        setSelectedEvent(null);
                        setTimeout(() => {
                            setIsNavigating(false);
                            accessibility.speakText("Modal closed");
                        }, 200);
                    } else {
                        setIsNavigating(false);
                    }
                },
                showMap: () => {
                    handleOpenVenueMap();
                },
                closeMap: () => {
                    if (showVenueMap) {
                        handleCloseVenueMap();
                        setTimeout(() => {
                            setIsNavigating(false);
                        }, 200);
                    } else {
                        setIsNavigating(false);
                    }
                },
                showEvents: () => {
                    if (showMainSections) {
                        scrollToSection(eventsRef, "events");
                    } else {
                        handleSectionChange("events");
                    }
                },
                showContact: () => {
                    if (showMainSections) {
                        scrollToSection(feedbacRef, "contact");
                    } else {
                        handleSectionChange("feedback");
                    }
                },
                showAbout: () => {
                    if (showMainSections) {
                        scrollToSection(aboutRef, "about");
                    } else {
                        handleSectionChange("about");
                    }
                },
                goHome: () => handleClickHome(),
                showDocument: () => {
                    if (!isShowPersonel) {
                        setShowPersonel(true);
                        setShowMainSections(false);
                        setTimeout(() => {
                            setIsNavigating(false);
                            accessibility.speakText("Documents");
                        }, 300);
                    } else {
                        setIsNavigating(false);
                    }
                },
                scrollUp: () => {
                    scrollUp();
                    setTimeout(() => setIsNavigating(false), 200);
                },
                scrollDown: () => {
                    scrollDown();
                    setTimeout(() => setIsNavigating(false), 200);
                },
                scrollTop: () => {
                    scrollToTop();
                    setTimeout(() => {
                        setIsNavigating(false);
                        accessibility.speakText("At top");
                    }, 300);
                },
                scrollBottom: () => {
                    scrollToBottom();
                    setTimeout(() => {
                        setIsNavigating(false);
                        accessibility.speakText("At bottom");
                    }, 300);
                },
                startListening: () => {
                    startListening();
                    setIsNavigating(false);
                    accessibility.speakText("Continuous voice recognition started");
                },
                stopListening: () => {
                    stopListening();
                    setIsNavigating(false);
                    accessibility.speakText("Voice recognition stopped");
                },
            };

            if (commandLower.includes("register") || commandLower.includes("magparehistro")) {
                executeCommand(commandActions.register, "registration");
            } else if (commandLower.includes("close") || commandLower.includes("isara")) {
                executeCommand(commandActions.closeModal, "close modal");
            } else if (
                commandLower.includes("map") ||
                commandLower.includes("mapa") ||
                commandLower.includes("show map") ||
                commandLower.includes("open map")
            ) {
                executeCommand(commandActions.showMap, "map");
            } else if (commandLower.includes("close map") || commandLower.includes("isara ang mapa")) {
                executeCommand(commandActions.closeMap, "close map");
            } else if (commandLower.includes("event") || commandLower.includes("mga event")) {
                executeCommand(commandActions.showEvents, "events");
            } else if (commandLower.includes("contact") || commandLower.includes("ugnayan")) {
                executeCommand(commandActions.showContact, "contact");
            } else if (commandLower.includes("about") || commandLower.includes("tungkol")) {
                executeCommand(commandActions.showAbout, "about");
            } else if (commandLower.includes("home") || commandLower.includes("bahay")) {
                executeCommand(commandActions.goHome, "home");
            } else if (commandLower.includes("document") || commandLower.includes("dokumento")) {
                executeCommand(commandActions.showDocument, "documents");
            } else if (commandLower.includes("scroll up") || commandLower.includes("scrollup")) {
                executeCommand(commandActions.scrollUp, "scroll up");
            } else if (commandLower.includes("scroll down") || commandLower.includes("scrolldown")) {
                executeCommand(commandActions.scrollDown, "scroll down");
            } else if (commandLower.includes("scroll top") || commandLower.includes("to top") || commandLower.includes("top")) {
                executeCommand(commandActions.scrollTop, "scroll top");
            } else if (commandLower.includes("scroll bottom") || commandLower.includes("to bottom") || commandLower.includes("bottom")) {
                executeCommand(commandActions.scrollBottom, "scroll bottom");
            } else if (commandLower.includes("iskrol pataas") || commandLower.includes("pataas") || commandLower.includes("itaas")) {
                executeCommand(commandActions.scrollUp, "scroll up");
            } else if (commandLower.includes("iskrol pababa") || commandLower.includes("pababa") || commandLower.includes("ibaba")) {
                executeCommand(commandActions.scrollDown, "scroll down");
            } else if (commandLower.includes("tuktok") || commandLower.includes("itaas na") || commandLower.includes("pinaka itaas")) {
                executeCommand(commandActions.scrollTop, "scroll top");
            } else if (commandLower.includes("ibaba na") || commandLower.includes("pinaka ibaba") || commandLower.includes("wakas")) {
                executeCommand(commandActions.scrollBottom, "scroll bottom");
            } else if (commandLower.includes("start listening") || commandLower.includes("makinig")) {
                executeCommand(commandActions.startListening, "start voice");
            } else if (commandLower.includes("stop listening") || commandLower.includes("tumigil")) {
                executeCommand(commandActions.stopListening, "stop voice");
            } else {
                setTimeout(() => {
                    setIsNavigating(false);
                    accessibility.speakText("Command not recognized");
                }, 200);
            }
        };

        window.addEventListener("voice-command", handleGlobalVoiceCommand, {
            capture: true,
            passive: true,
        });

        return () => {
            window.removeEventListener("voice-command", handleGlobalVoiceCommand, { capture: true });
        };
    }, [
        showModal,
        showVenueMap,
        isEventUpcoming,
        accessibility,
        showMainSections,
        isShowPersonel,
        scrollToSection,
        handleSectionChange,
        handleClickHome,
        startListening,
        stopListening,
        scrollUp,
        scrollDown,
        scrollToTop,
        scrollToBottom,
        handleOpenVenueMap,
        handleCloseVenueMap,
    ]);

    useEffect(() => {
        const handleToggleSpeech = () => {
            toggleListening();
        };

        window.addEventListener("toggle-speech-recognition", handleToggleSpeech);
        return () => window.removeEventListener("toggle-speech-recognition", handleToggleSpeech);
    }, [toggleListening]);

    const getCurrentView = useCallback(() => {
        if (isShowPersonel) return "document";
        if (!showMainSections) return "participant";
        return "main";
    }, [isShowPersonel, showMainSections]);

    const registrationModalProps = useMemo(
        () => ({
            FetchUpcomingEvent,
            UpcomingTotalPages,
            UpcomingCurrentPage,
            setUpcomingCurrentPage,
            showModal,
            setShowModal,
            selectedEvent,
            setSelectedEvent,
            formData,
            handleInputChange,
            handleSubmit,
            handleEventSelect,
            isEventUpcoming,
            registrationSuccess,
            onResetRegistration: resetRegistrationFlow,
        }),
        [
            showModal,
            selectedEvent,
            formData,
            handleInputChange,
            handleSubmit,
            handleEventSelect,
            isEventUpcoming,
            registrationSuccess,
            resetRegistrationFlow,
        ],
    );

    //  FIXED: Correct object syntax and dependencies
    const venueMapProps = useMemo(
        () => ({
            isOpen: showVenueMap,
            isEventUpcoming, //  Proper shorthand (was: isEventUpcoming={isEventUpcoming})
            onClose: handleCloseVenueMap,
        }),
        [showVenueMap, isEventUpcoming, handleCloseVenueMap], //  Added missing dependency
    );

    const mainDashboardContent = useMemo(
        () => (
            <>
                <section
                    ref={heroRef}
                    className="flex min-h-screen items-center justify-center"
                >
                    <HeroSection
                        setShowModal={setShowModal}
                        showModal={showModal}
                        setShowPersonel={handleShowPersonel}
                        bgtheme={bgtheme}
                        FontColor={FontColor}
                    />
                </section>

                <section className="flex min-h-screen items-center justify-center">
                    <TravelBanner
                        bgtheme={bgtheme}
                        FontColor={FontColor}
                    />
                </section>

                <section
                    ref={eventsRef}
                    className="flex min-h-screen items-center justify-center"
                >
                    <ThresholdSection
                        eventsRef={eventsRef}
                        isEventUpcoming={isEventUpcoming}
                        setShowModal={setShowModal}
                        handleEventSelect={handleEventSelect}
                        bgtheme={bgtheme}
                        FontColor={FontColor}
                    />
                </section>

                <section
                    ref={aboutRef}
                    className="min-h-screen"
                >
                    <AboutSection aboutRef={aboutRef} />
                </section>

                <section
                    ref={feedbacRef}
                    className="min-h-screen"
                >
                    <ContactUsForm
                        ref={feedbacRef}
                        bgtheme={bgtheme}
                        FontColor={FontColor}
                    />
                </section>
            </>
        ),
        [heroRef, eventsRef, aboutRef, feedbacRef, showModal, handleShowPersonel, bgtheme, FontColor, isEventUpcoming, handleEventSelect],
    );

    const floatingButtons = useMemo(
        () => (
            <div className="fixed bottom-6 right-6 z-[10000] space-y-3">
                <motion.button
                    onClick={handleOpenVenueMap}
                    className="rounded-xl border border-white/10 bg-black/40 p-3 text-white shadow-xl backdrop-blur-lg transition-all duration-300 hover:bg-black/60 hover:text-green-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Open Biliran map"
                >
                    <Map size={22} />
                </motion.button>

                {showUpButton && (
                    <motion.button
                        onClick={() => {
                            setIsNavigating(true);
                            setNavigationDestination("top");
                            setTimeout(() => {
                                scrollToTop();
                                setTimeout(() => {
                                    setIsNavigating(false);
                                    accessibility.speakText("At top");
                                }, 300);
                            }, 10);
                        }}
                        className="rounded-xl border border-white/10 bg-black/40 p-3 text-white shadow-xl backdrop-blur-lg transition-all duration-300 hover:bg-black/60 hover:text-yellow-400"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Scroll to top"
                    >
                        <ArrowUp size={22} />
                    </motion.button>
                )}
            </div>
        ),
        [
            isListening,
            showMainSections,
            isShowPersonel,
            showUpButton,
            handleSectionChange,
            scrollToSection,
            accessibility,
            scrollToTop,
            toggleListening,
            handleOpenVenueMap,
        ],
    );

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-white font-sans antialiased">
            {isLoading && <LoadingOverlay />}

            <VoiceController />

            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="mx-4 max-w-xs rounded-lg border border-gray-200 bg-white/95 p-3 shadow-xl"
                        >
                            <div className="flex items-center space-x-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-gray-800">Processing</div>
                                    <div className="truncate text-xs text-gray-600">{navigationDestination}</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed left-1/2 top-4 z-[10002] -translate-x-1/2 transform rounded-full bg-green-500 px-4 py-2 text-white shadow-lg"
                    >
                        <div className="flex items-center space-x-2">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="h-2 w-2 rounded-full bg-white"
                            />
                            <span className="text-sm font-medium">🎤 Continuous Listening Active</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className="fixed left-0 top-0 z-[9999] h-[5px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.6)] transition-all duration-100"
                style={{ width: `${scrollProgress}%` }}
            />

            <NavHeader
                eventsRef={eventsRef}
                feedbacRef={feedbacRef}
                documentationRef={documentationRef}
                aboutRef={aboutRef}
                onHomeClick={handleClickHome}
                currentView={getCurrentView()}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                bgtheme={bgtheme}
                FontColor={FontColor}
            />

            {isShowPersonel ? (
                <DocumentLayout
                    setShowPersonel={setShowPersonel}
                    profile={profile}
                />
            ) : !showMainSections ? (
                <ParticipantDashboard
                    heroRef={heroRef}
                    eventsRef={eventsRef}
                    feedbacRef={feedbacRef}
                    documentationRef={documentationRef}
                    aboutRef={aboutRef}
                    onHomeClick={handleClickHome}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />
            ) : (
                mainDashboardContent
            )}

            <Footer
                bgtheme={bgtheme}
                FontColor={FontColor}
            />

            <RegistrationModal {...registrationModalProps} />
            <VenueMap {...venueMapProps} />

            {floatingButtons}

            {process.env.NODE_ENV === "development" && (
                <div className="fixed bottom-4 left-4 z-50 rounded-lg bg-black/90 p-3 font-mono text-xs text-white opacity-95">
                    <div className="mb-2 flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${isListening ? "animate-pulse bg-green-500" : "bg-gray-500"}`}></div>
                        <div>SPEECH: {isListening ? "CONTINUOUS" : "OFF"}</div>
                    </div>
                    <div>NAV: {isNavigating ? "LOADING" : "READY"}</div>
                    <div>LAST: {lastCommandTime ? `${Date.now() - lastCommandTime}ms ago` : "Never"}</div>
                    <div>DEST: {navigationDestination || "None"}</div>
                    <div>MAP: {showVenueMap ? "OPEN" : "CLOSED"}</div>
                </div>
            )}
        </div>
    );
};

export default React.memo(HomeDashboard);
