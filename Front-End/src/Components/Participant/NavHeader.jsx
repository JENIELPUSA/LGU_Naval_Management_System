import React, { useState, useEffect, createContext, useContext, useCallback, useMemo, useRef } from "react";
import Login from "../Login/Login"; // ✅ Import Login modal
import {
    Accessibility,
    Menu,
    X,
    Home,
    ZoomIn,
    ZoomOut,
    Contrast,
    Type,
    Keyboard,
    Volume2,
    VolumeX,
    RotateCcw,
    Languages,
    Mic,
    MicOff,
    LogIn,
} from "lucide-react";
import Logo from "../../assets/Biliran-header.webp";

// Translation dictionary
const translations = {
    en: {
        home: "Home",
        events: "Events",
        contactUs: "Contact Us",
        about: "About Us",
        feedback: "Contact Us",
        backToHome: "Back to Home",
        mainNavigation: "Main navigation",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        republic: "REPUBLIC OF THE PHILIPPINES",
        publicDomain: "All content is in the public domain unless otherwise stated.",
        province: "Province of Biliran",
        municipality: "Municipality of Naval",
        accessibility: "Accessibility",
        accessibilityOptions: "Accessibility Options",
        close: "Close",
        closeAccessibility: "Close accessibility panel",
        increaseTextSize: "Increase Text Size",
        decreaseTextSize: "Decrease Text Size",
        toggleHighContrast: "Toggle High Contrast",
        changeFontStyle: "Change Font Style",
        keyboardNavigation: "Keyboard Navigation",
        textToSpeech: "Text to Speech",
        stopSpeech: "Stop Speech",
        reducedMotion: "Reduced Motion",
        resetAllSettings: "Reset All Settings",
        currentTextSize: "px",
        highContrast: "High Contrast",
        fontStyle: "Font Style",
        defaultFont: "Default",
        arialFont: "Arial",
        dyslexiaFont: "Dyslexia Friendly",
        skipToContent: "Skip to main content",
        textSize: "Text Size",
        fontChangedTo: "Font changed to",
        highContrastModeOn: "High contrast mode on",
        highContrastModeOff: "High contrast mode off",
        textToSpeechOn: "Text to speech on",
        textToSpeechOff: "Text to speech off",
        reducedMotionOn: "Reduced motion on",
        reducedMotionOff: "Reduced motion off",
        accessibilityPanelOpened: "Accessibility panel opened",
        accessibilityPanelClosed: "Accessibility panel closed",
        language: "Language",
        english: "English",
        tagalog: "Tagalog",
        switchToTagalog: "Switch to Tagalog",
        switchToEnglish: "Switch to English",
        on: "On",
        off: "Off",
        active: "Active",
        handsFree: "Hands-Free Mode",
        handsFreeOn: "Hands-Free mode activated. Use voice commands for navigation.",
        handsFreeOff: "Hands-Free mode deactivated.",
        voiceCommands: "Voice Commands",
        listening: "Listening...",
        stopListening: "Stop listening",
        sayHelp: "Say 'help' for voice commands",
        availableCommands: "Available Voice Commands:",
        commandHome: "Say 'home' to go to home page",
        commandEvents: "Say 'events' to view events",
        commandContact: "Say 'contact' to contact us",
        commandAbout: "Say 'about' to learn about us",
        commandFeedback: "Say 'feedback' to give feedback",
        commandBack: "Say 'back' to go back",
        commandScrollUp: "Say 'scroll up' to scroll up",
        commandScrollDown: "Say 'scroll down' to scroll down",
        commandStop: "Say 'stop' to stop listening",
        commandAccessibility: "Say 'accessibility' to open accessibility options",
        commandLanguage: "Say 'language' to switch language",
        voiceNavigation: "Voice Navigation",
        handsFreeMode: "Hands-Free Mode",
        navigatingTo: "Navigating to",
        opening: "Opening",
        switchingTo: "Switching to",
        login: "Log In",
    },
    tl: {
        home: "Home",
        events: "Mga Event",
        contactUs: "Makipag-ugnayan",
        about: "Tungkol Sa Amin",
        feedback: "Feedback",
        backToHome: "Bumalik sa Home",
        mainNavigation: "Pangunahing navigation",
        openMenu: "Buksan ang menu",
        closeMenu: "Isara ang menu",
        republic: "REPUBLIKA NG PILIPINAS",
        publicDomain: "Lahat ng content ay nasa public domain maliban kung may ibang nakasaad.",
        province: "Lalawigan ng Biliran",
        municipality: "Bayan ng Naval",
        accessibility: "Accessibility",
        accessibilityOptions: "Mga Opsyon sa Accessibility",
        close: "Isara",
        closeAccessibility: "Isara ang accessibility panel",
        increaseTextSize: "Palakihin ang Text",
        decreaseTextSize: "Paliitin ang Text",
        toggleHighContrast: "Palitan ng High Contrast",
        changeFontStyle: "Palitan ang Istilo ng Font",
        keyboardNavigation: "Keyboard Navigation",
        textToSpeech: "Text-to-Speech",
        stopSpeech: "Itigil ang Speech",
        reducedMotion: "Reduced Motion",
        resetAllSettings: "I-reset ang Lahat ng Settings",
        currentTextSize: "px",
        highContrast: "High Contrast",
        fontStyle: "Istilo ng Font",
        defaultFont: "Default",
        arialFont: "Arial",
        dyslexiaFont: "Dyslexia Friendly",
        skipToContent: "Laktawan sa pangunahing content",
        textSize: "Laki ng Text",
        fontChangedTo: "Font pinalitan ng",
        highContrastModeOn: "High contrast mode naka-on",
        highContrastModeOff: "High contrast mode naka-off",
        textToSpeechOn: "Text to speech naka-on",
        textToSpeechOff: "Text to speech naka-off",
        reducedMotionOn: "Reduced motion naka-on",
        reducedMotionOff: "Reduced motion naka-off",
        accessibilityPanelOpened: "Accessibility panel nabuksan",
        accessibilityPanelClosed: "Accessibility panel nagsara",
        language: "Wika",
        english: "English",
        tagalog: "Tagalog",
        switchToTagalog: "Palitan ng Tagalog",
        switchToEnglish: "Palitan ng English",
        on: "Naka-on",
        off: "Naka-off",
        active: "Active",
        handsFree: "Hands-Free Mode",
        handsFreeOn: "Hands-Free mode na-activate. Gamitin ang voice commands para sa navigation.",
        handsFreeOff: "Hands-Free mode na-deactivate.",
        voiceCommands: "Mga Voice Command",
        listening: "Nakikinig...",
        stopListening: "Itigil ang pakikinig",
        sayHelp: "Sabihin ang 'help' para makita ang voice commands",
        availableCommands: "Mga Available na Voice Commands:",
        commandHome: "Sabihin ang 'home' para pumunta sa home page",
        commandEvents: "Sabihin ang 'events' para makita ang mga event",
        commandContact: "Sabihin ang 'contact' para makipag-ugnayan",
        commandAbout: "Sabihin ang 'about' para matuto tungkol sa amin",
        commandFeedback: "Sabihin ang 'feedback' para magbigay ng feedback",
        commandBack: "Sabihin ang 'back' para bumalik",
        commandScrollUp: "Sabihin ang 'scroll up' para mag-scroll pataas",
        commandScrollDown: "Sabihin ang 'scroll down' para mag-scroll pababa",
        commandStop: "Sabihin ang 'stop' para itigil ang pakikinig",
        commandMenu: "Sabihin ang 'menu' para buksan ang navigation menu",
        commandAccessibility: "Sabihin ang 'accessibility' para buksan ang accessibility options",
        commandLanguage: "Sabihin ang 'language' para palitan ang wika",
        voiceNavigation: "Voice Navigation",
        handsFreeMode: "Hands-Free Mode",
        navigatingTo: "Papunta sa",
        opening: "Binubuksan ang",
        switchingTo: "Pinapalitan ang wika sa",
        login: "Mag-Log In",
    },
};

const defaultAccessibilitySettings = {
    fontSize: 16,
    isHighContrast: false,
    fontType: "default",
    isKeyboardHighlight: false,
    isTextToSpeech: false,
    reducedMotion: false,
    language: "en",
    isHandsFree: false,
};

const AccessibilityContext = createContext();
export const AccessibilityProvider = ({ children }) => {
    const [accessibilitySettings, setAccessibilitySettings] = useState(defaultAccessibilitySettings);
    const [isListening, setIsListening] = useState(false);
    const [lastCommand, setLastCommand] = useState("");
    const recognitionRef = useRef(null);
    const speechSynthesisRef = useRef(null);

    const t = useCallback(
        (key) => translations[accessibilitySettings.language]?.[key] || translations.en[key] || key,
        [accessibilitySettings.language],
    );

    useEffect(() => {
        const saved = localStorage.getItem("accessibilitySettings");
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                setAccessibilitySettings(settings);
                applySettings(settings);
                document.documentElement.lang = settings.language;
            } catch (e) {
                console.error("Error loading settings:", e);
            }
        }
    }, []);

    const applySettings = useCallback((settings) => {
        const { fontSize, isHighContrast, fontType, isKeyboardHighlight, reducedMotion, language } = settings;
        document.documentElement.style.fontSize = `${fontSize}px`;
        document.documentElement.lang = language;
        document.body.classList.toggle("high-contrast", isHighContrast);
        const fonts = { dyslexia: "'OpenDyslexic', Arial, sans-serif", arial: "Arial, sans-serif", default: "inherit" };
        document.body.style.fontFamily = fonts[fontType] || fonts.default;
        document.body.classList.toggle("keyboard-highlight", isKeyboardHighlight);
        document.body.classList.toggle("reduced-motion", reducedMotion);
        localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
    }, []);

    const updateSettings = useCallback(
        (newSettings) => {
            const updated = { ...accessibilitySettings, ...newSettings };
            setAccessibilitySettings(updated);
            applySettings(updated);
        },
        [accessibilitySettings, applySettings],
    );

    const increaseFontSize = useCallback(() => {
        const newSize = Math.min(accessibilitySettings.fontSize + 2, 24);
        updateSettings({ fontSize: newSize });
        speakText(`Text size increased to ${newSize} pixels`);
    }, [accessibilitySettings.fontSize, updateSettings]);

    const decreaseFontSize = useCallback(() => {
        const newSize = Math.max(accessibilitySettings.fontSize - 2, 12);
        updateSettings({ fontSize: newSize });
        speakText(`Text size decreased to ${newSize} pixels`);
    }, [accessibilitySettings.fontSize, updateSettings]);

    const toggleLanguage = useCallback(() => {
        const lang = accessibilitySettings.language === "en" ? "tl" : "en";
        updateSettings({ language: lang });
        speakText(`Language switched to ${lang === "en" ? "English" : "Tagalog"}`);
    }, [accessibilitySettings.language, updateSettings]);

    const resetSettings = useCallback(() => {
        if (accessibilitySettings.isHandsFree) stopHandsFree();
        setAccessibilitySettings(defaultAccessibilitySettings);
        applySettings(defaultAccessibilitySettings);
        speakText("All settings have been reset to default");
    }, [accessibilitySettings.isHandsFree, applySettings]);

    const speakText = useCallback(
        (text = null) => {
            if (accessibilitySettings.isTextToSpeech && text && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.8;
                utterance.pitch = 1;
                utterance.lang = accessibilitySettings.language === "tl" ? "tl-PH" : "en-PH";
                const voices = window.speechSynthesis.getVoices();
                const voice = voices.find((v) => v.lang.includes(accessibilitySettings.language === "tl" ? "tl" : "en"));
                if (voice) utterance.voice = voice;
                speechSynthesisRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            }
        },
        [accessibilitySettings.isTextToSpeech, accessibilitySettings.language],
    );

    const stopSpeech = useCallback(() => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    }, []);

    const clickNavigationItem = useCallback(
        (itemText) => {
            const buttons = document.querySelectorAll('nav button, [role="navigation"] button, .nav-header button');
            for (let btn of buttons) {
                const txt = btn.textContent?.toLowerCase().trim();
                if (txt && txt.includes(itemText.toLowerCase())) {
                    btn.click();
                    speakText(`${t("navigatingTo")} ${itemText}`);
                    window.dispatchEvent(new CustomEvent("voice-navigation", { detail: { command: itemText.toLowerCase(), element: btn } }));
                    return true;
                }
            }
            return false;
        },
        [t, speakText],
    );

    const dispatchVoiceCommand = useCallback((cmd) => {
        window.dispatchEvent(new CustomEvent("voice-command", { detail: { command: cmd } }));
    }, []);

    const handleVoiceCommand = useCallback(
        (cmd) => {
            const cmdLower = cmd.toLowerCase();
            const handlers = {
                help: () => {
                    const cmds = [
                        t("commandHome"),
                        t("commandEvents"),
                        t("commandContact"),
                        t("commandAbout"),
                        t("commandFeedback"),
                        t("commandMenu"),
                        t("commandAccessibility"),
                        t("commandLanguage"),
                        t("commandScrollUp"),
                        t("commandScrollDown"),
                        t("commandBack"),
                        t("commandStop"),
                    ];
                    speakText(t("availableCommands") + " " + cmds.join(". "));
                },
                home: () => !clickNavigationItem(t("home")) && (speakText("Navigating to home"), dispatchVoiceCommand("home")),
                events: () => !clickNavigationItem(t("events")) && (speakText("Navigating to events"), dispatchVoiceCommand("events")),
                contact: () => !clickNavigationItem(t("contactUs")) && (speakText("Navigating to contact"), dispatchVoiceCommand("contact")),
                about: () => !clickNavigationItem(t("about")) && (speakText("Navigating to about"), dispatchVoiceCommand("about")),
                feedback: () => !clickNavigationItem(t("feedback")) && (speakText("Opening feedback"), dispatchVoiceCommand("feedback")),
                login: () => {
                    speakText("Opening login");
                    setShowLoginFromContext(true);
                },
                menu: () => {
                    speakText(t("opening") + " " + t("mainNavigation"));
                    document.querySelector('button[aria-label*="menu"]')?.click();
                },
                accessibility: () => {
                    speakText(t("opening") + " " + t("accessibilityOptions"));
                    document.querySelector('button[aria-label*="accessibility"]')?.click();
                },
                language: () => {
                    speakText(t("switchingTo") + " " + (accessibilitySettings.language === "en" ? t("tagalog") : t("english")));
                    toggleLanguage();
                },
                back: () => (speakText("Going back"), window.history.back()),
                "scroll up": () => (speakText("Scrolling up"), window.scrollBy({ top: -300, behavior: "smooth" })),
                "scroll down": () => (speakText("Scrolling down"), window.scrollBy({ top: 300, behavior: "smooth" })),
                stop: () => (speakText("Stopping hands-free mode"), toggleHandsFree()),
                register: () => (speakText("Opening registration"), dispatchVoiceCommand("register")),
            };

            const map = {
                help: ["help", "tulong"],
                home: ["home", "bahay"],
                events: ["events", "mga event", "event"],
                contact: ["contact", "contact us", "makipag-ugnayan"],
                about: ["about", "tungkol", "tungkol sa amin"],
                feedback: ["feedback"],
                login: ["login", "log in", "mag log in", "mag-login"],
                menu: ["menu", "navigation"],
                accessibility: ["accessibility"],
                language: ["language", "wika"],
                back: ["back", "bumalik"],
                "scroll up": ["scroll up", "scroll pataas"],
                "scroll down": ["scroll down", "scroll pababa"],
                stop: ["stop", "tigil", "itigil"],
                register: ["register", "sign up", "magparehistro"],
            };

            for (const [key, triggers] of Object.entries(map)) {
                if (triggers.some((t) => cmdLower.includes(t))) {
                    handlers[key]();
                    return;
                }
            }

            const navItems = [t("home"), t("events"), t("contactUs"), t("about"), t("feedback"), t("login")];
            for (let item of navItems) {
                if (cmdLower.includes(item.toLowerCase()) || (item.toLowerCase().includes(cmdLower) && cmdLower.length > 2)) {
                    if (clickNavigationItem(item)) return;
                }
            }

            speakText(`Command not recognized: ${cmd}. Say 'help' for available commands.`);
        },
        [t, speakText, clickNavigationItem, dispatchVoiceCommand, accessibilitySettings.language, toggleLanguage],
    );

    const startHandsFree = useCallback(() => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            speakText("Speech recognition is not supported in this browser.");
            return;
        }
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = accessibilitySettings.language === "tl" ? "tl-PH" : "en-US";
        rec.onstart = () => {
            setIsListening(true);
            speakText(t("handsFreeOn"));
        };
        rec.onresult = (e) => {
            const transcript = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
            setLastCommand(transcript);
            handleVoiceCommand(transcript);
        };
        rec.onerror = (e) => {
            if (e.error === "no-speech" && accessibilitySettings.isHandsFree) setTimeout(() => rec.start(), 1000);
        };
        rec.onend = () => {
            setIsListening(false);
            if (accessibilitySettings.isHandsFree) setTimeout(() => rec.start(), 500);
        };
        rec.start();
        recognitionRef.current = rec;
    }, [accessibilitySettings.language, accessibilitySettings.isHandsFree, t, speakText, handleVoiceCommand]);

    const stopHandsFree = useCallback(() => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
        recognitionRef.current = null;
        speakText(t("handsFreeOff"));
    }, [t, speakText]);

    const toggleHandsFree = useCallback(() => {
        const newState = !accessibilitySettings.isHandsFree;
        updateSettings({ isHandsFree: newState });
        if (newState) startHandsFree();
        else stopHandsFree();
    }, [accessibilitySettings.isHandsFree, updateSettings, startHandsFree, stopHandsFree]);

    // ✅ STATE FOR LOGIN MODAL (used in voice command)
    const [showLoginFromContext, setShowLoginFromContext] = useState(false);

    useEffect(() => {
        if (accessibilitySettings.isHandsFree && !isListening && !recognitionRef.current) startHandsFree();
    }, [accessibilitySettings.isHandsFree, isListening, startHandsFree]);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []);

    const contextValue = useMemo(
        () => ({
            ...accessibilitySettings,
            updateSettings,
            increaseFontSize,
            decreaseFontSize,
            toggleLanguage,
            resetSettings,
            speakText,
            stopSpeech,
            toggleHandsFree,
            isListening,
            lastCommand,
            t,
            // ✅ Expose login state control to context if needed
            setShowLoginFromContext,
        }),
        [
            accessibilitySettings,
            updateSettings,
            increaseFontSize,
            decreaseFontSize,
            toggleLanguage,
            resetSettings,
            speakText,
            stopSpeech,
            toggleHandsFree,
            isListening,
            lastCommand,
            t,
        ],
    );

    return (
        <AccessibilityContext.Provider value={contextValue}>
            {children}
            {accessibilitySettings.isHandsFree && (
                <div
                    className={`fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-lg ${
                        accessibilitySettings.isHighContrast ? "border-2 border-black bg-yellow-400 text-black" : "bg-red-500 text-white"
                    } ${isListening ? "animate-pulse" : ""}`}
                >
                    <div className="flex items-center gap-2">
                        <Mic size={20} />
                        <span className="text-sm font-semibold">{isListening ? t("listening") : t("handsFree")}</span>
                    </div>
                    {lastCommand && (
                        <div className="absolute -top-8 left-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white">
                            🎤: {lastCommand}
                        </div>
                    )}
                </div>
            )}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        return {
            ...defaultAccessibilitySettings,
            updateSettings: () => {},
            increaseFontSize: () => {},
            decreaseFontSize: () => {},
            toggleLanguage: () => {},
            resetSettings: () => {},
            speakText: () => {},
            stopSpeech: () => {},
            toggleHandsFree: () => {},
            isListening: false,
            lastCommand: "",
            t: (key) => translations.en[key] || key,
            setShowLoginFromContext: () => {},
        };
    }
    return context;
};

// ✅ NavHeader WITHOUT onLoginClick prop
const NavHeader = React.memo(
    ({ eventsRef, feedbacRef, aboutRef, documentationRef, onHomeClick, currentView, activeSection, onSectionChange, bgtheme, FontColor }) => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [isSticky, setIsSticky] = useState(false);
        const [currentTime, setCurrentTime] = useState(new Date());
        const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
        const [showLogin, setShowLogin] = useState(false); // ✅ Login modal state
        const accessibility = useAccessibility();

        useEffect(() => {
            let ticking = false;
            const handleScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        setIsSticky(window.scrollY > 100);
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
        }, []);

        useEffect(() => {
            const timer = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(timer);
        }, []);

        const scrollToSection = useCallback(
            (ref) => {
                const behavior = accessibility.reducedMotion ? "auto" : "smooth";
                ref?.current?.scrollIntoView({ behavior });
                setIsMenuOpen(false);
            },
            [accessibility.reducedMotion],
        );

        const handleNavClick = useCallback(
            (action, section = null) => {
                if (action) action();
                else if (onSectionChange && section) onSectionChange(section);
                setIsMenuOpen(false);
                if (section) accessibility.speakText(`Navigated to ${section}`);
            },
            [onSectionChange, accessibility],
        );

        const formatTime = useCallback(
            (date) =>
                date.toLocaleTimeString("en-PH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Manila",
                }),
            [],
        );

        const formatDate = useCallback(
            (date) =>
                date.toLocaleDateString(accessibility.language === "tl" ? "tl-PH" : "en-PH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "Asia/Manila",
                }),
            [accessibility.language],
        );

        const getActiveClass = useCallback(
            (section) => {
                const isActive = activeSection === section;
                if (accessibility.isHighContrast) {
                    return isActive
                        ? "nav-active bg-yellow-400 text-black font-bold border-r-4 border-black"
                        : "text-white hover:bg-white hover:text-black nav-hover";
                } else {
                    return isActive
                        ? "text-[#0032a0] bg-blue-50 border-r-4 border-[#0032a0] font-semibold"
                        : "text-gray-800 hover:text-[#0032a0] hover:bg-blue-50";
                }
            },
            [activeSection, accessibility.isHighContrast],
        );

        const toggleAccessibilityPanel = useCallback(() => {
            setShowAccessibilityPanel((prev) => !prev);
            accessibility.speakText(
                showAccessibilityPanel ? accessibility.t("accessibilityPanelClosed") : accessibility.t("accessibilityPanelOpened"),
            );
        }, [showAccessibilityPanel, accessibility]);

        const toggleContrast = useCallback(() => {
            accessibility.updateSettings({ isHighContrast: !accessibility.isHighContrast });
            accessibility.speakText(accessibility.isHighContrast ? accessibility.t("highContrastModeOff") : accessibility.t("highContrastModeOn"));
        }, [accessibility]);

        const toggleFont = useCallback(() => {
            const fonts = ["default", "arial", "dyslexia"];
            const idx = fonts.indexOf(accessibility.fontType);
            const next = fonts[(idx + 1) % fonts.length];
            accessibility.updateSettings({ fontType: next });
            const names = { default: accessibility.t("defaultFont"), arial: accessibility.t("arialFont"), dyslexia: accessibility.t("dyslexiaFont") };
            accessibility.speakText(`${accessibility.t("fontChangedTo")} ${names[next]}`);
        }, [accessibility]);

        const toggleTextToSpeech = useCallback(() => {
            accessibility.updateSettings({ isTextToSpeech: !accessibility.isTextToSpeech });
            accessibility.speakText(accessibility.isTextToSpeech ? accessibility.t("textToSpeechOff") : accessibility.t("textToSpeechOn"));
        }, [accessibility]);

        const toggleReducedMotion = useCallback(() => {
            accessibility.updateSettings({ reducedMotion: !accessibility.reducedMotion });
            accessibility.speakText(accessibility.reducedMotion ? accessibility.t("reducedMotionOff") : accessibility.t("reducedMotionOn"));
        }, [accessibility]);

        const getHighContrastStyles = useCallback(() => {
            if (accessibility.isHighContrast) {
                return { background: "#000000", color: "#ffffff", border: "2px solid #ffff00" };
            }
            return {};
        }, [accessibility.isHighContrast]);

        const getHighContrastButtonStyles = useCallback(() => {
            if (accessibility.isHighContrast) {
                return { background: "#ffff00", color: "#000000", border: "2px solid #000000", fontWeight: "bold" };
            }
            return { background: bgtheme, color: FontColor };
        }, [accessibility.isHighContrast, bgtheme, FontColor]);

        const getVoiceCommandAttributes = useCallback(
            (command) => {
                return {
                    "data-voice-command": command.toLowerCase(),
                    "aria-label": `${accessibility.t(command)} ${accessibility.t("navigation")}`,
                };
            },
            [accessibility],
        );

        const renderMainDashboardNavigation = useCallback(
            () => (
                <>
                    {["events", "contact", "about", "login"].map((section) => (
                        <li key={section}>
                            <button
                                {...getVoiceCommandAttributes(section)}
                                onClick={() => {
                                    if (section === "login") {
                                        setShowLogin(true); // ✅ OPEN MODAL
                                    } else {
                                        scrollToSection(section === "events" ? eventsRef : section === "contact" ? feedbacRef : aboutRef);
                                    }
                                }}
                                onFocus={() => accessibility.speakText(accessibility.t(section === "contact" ? "contactUs" : section))}
                                className={`group relative w-full border-b border-gray-100 px-6 py-4 text-sm font-semibold transition-all duration-200 lg:border-b-0 ${
                                    accessibility.isHighContrast
                                        ? "border-gray-600 text-white hover:bg-white hover:text-black"
                                        : "text-gray-800 hover:bg-blue-50 hover:text-[#0032a0]"
                                }`}
                            >
                                {section === "contact" ? accessibility.t("contactUs") : accessibility.t(section)}
                            </button>
                        </li>
                    ))}
                </>
            ),
            [accessibility, getVoiceCommandAttributes, scrollToSection, eventsRef, feedbacRef, aboutRef],
        );

        const renderParticipantDashboardNavigation = useCallback(
            () => (
                <>
                    {["events", "feedback", "about", "login"].map((section) => (
                        <li key={section}>
                            <button
                                {...getVoiceCommandAttributes(section)}
                                onClick={() => {
                                    if (section === "login") {
                                        setShowLogin(true); // ✅ OPEN MODAL
                                    } else {
                                        handleNavClick(null, section);
                                    }
                                }}
                                onFocus={() => accessibility.speakText(accessibility.t(section))}
                                className={`group relative w-full border-b border-gray-100 px-6 py-4 text-sm font-semibold transition-all duration-200 ${getActiveClass(section)}`}
                            >
                                {accessibility.t(section)}
                            </button>
                        </li>
                    ))}
                </>
            ),
            [accessibility, getVoiceCommandAttributes, handleNavClick, getActiveClass],
        );

        return (
            <>
                <header className="relative w-full font-sans">
                    <a
                        href="#main-content"
                        className="sr-only z-50 rounded bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-2 focus:top-2"
                        onFocus={() => accessibility.speakText(accessibility.t("skipToContent"))}
                        style={accessibility.isHighContrast ? { background: "#ffff00", color: "#000000", border: "2px solid #000000" } : {}}
                    >
                        {accessibility.t("skipToContent")}
                    </a>

                    <div
                        style={
                            accessibility.isHighContrast
                                ? { background: "#000000", color: "#ffffff", borderColor: "#ffff00" }
                                : { background: bgtheme }
                        }
                        className="border-b border-[#001f63] px-4 py-2 text-sm text-white"
                    >
                        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
                            <div className="flex items-center gap-4 text-xs">
                                <span
                                    style={{ color: accessibility.isHighContrast ? "#ffffff" : FontColor }}
                                    className="font-semibold"
                                >
                                    {accessibility.t("republic")}
                                </span>
                                <span
                                    style={{ color: accessibility.isHighContrast ? "#ffffff" : FontColor }}
                                    className="hidden md:inline"
                                >
                                    • {accessibility.t("publicDomain")}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <span
                                    style={{ color: accessibility.isHighContrast ? "#ffffff" : FontColor }}
                                    className="font-medium"
                                >
                                    {formatDate(currentTime)}
                                </span>
                                <span
                                    className="rounded px-2 py-1 font-mono"
                                    style={accessibility.isHighContrast ? { background: "#ffff00", color: "#000000" } : { background: "#001f63" }}
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {formatTime(currentTime)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <nav
                        className={`transition-all duration-300 ${
                            isSticky ? "sticky top-0 z-50 shadow-lg" : "shadow-md"
                        } ${accessibility.isHighContrast ? "bg-black text-white" : "bg-white"}`}
                        aria-label={accessibility.t("mainNavigation")}
                        role="navigation"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div className="flex items-center justify-between px-6 py-3">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={Logo}
                                        alt={`${accessibility.t("province")} Logo`}
                                        className="h-14 object-contain"
                                        loading="eager"
                                    />
                                    <div
                                        className={`hidden border-l pl-4 md:block ${
                                            accessibility.isHighContrast ? "border-gray-600" : "border-gray-300"
                                        }`}
                                    >
                                        <div className={`text-sm font-bold ${accessibility.isHighContrast ? "text-white" : "text-[#0032a0]"}`}>
                                            {accessibility.t("province")}
                                        </div>
                                        <div className={`text-xs ${accessibility.isHighContrast ? "text-gray-300" : "text-gray-600"}`}>
                                            {accessibility.t("municipality")}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        {...getVoiceCommandAttributes("accessibility")}
                                        onClick={toggleAccessibilityPanel}
                                        style={getHighContrastButtonStyles()}
                                        className="accessibility-button relative hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-colors lg:flex"
                                        aria-expanded={showAccessibilityPanel}
                                        aria-haspopup="dialog"
                                        onFocus={() => accessibility.speakText(accessibility.t("accessibility"))}
                                    >
                                        <Accessibility className="h-4 w-4" />
                                        {accessibility.t("accessibility")}
                                        {Object.values(accessibility).some((val) => val === true) && (
                                            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
                                        )}
                                    </button>
                                    <button
                                        {...getVoiceCommandAttributes("menu")}
                                        className={`rounded-lg border p-2 transition-colors lg:hidden ${
                                            accessibility.isHighContrast
                                                ? "border-yellow-400 text-white hover:bg-yellow-400 hover:text-black"
                                                : "border-gray-200 hover:bg-gray-100"
                                        }`}
                                        onClick={() => {
                                            setIsMenuOpen(!isMenuOpen);
                                            accessibility.speakText(isMenuOpen ? accessibility.t("closeMenu") : accessibility.t("openMenu"));
                                        }}
                                        aria-label={isMenuOpen ? accessibility.t("close") : accessibility.t("openMenu")}
                                        onFocus={() =>
                                            accessibility.speakText(isMenuOpen ? accessibility.t("closeMenu") : accessibility.t("openMenu"))
                                        }
                                    >
                                        {isMenuOpen ? (
                                            <X className={`h-5 w-5 ${accessibility.isHighContrast ? "text-yellow-400" : "text-[#0032a0]"}`} />
                                        ) : (
                                            <Menu className={`h-5 w-5 ${accessibility.isHighContrast ? "text-yellow-400" : "text-[#0032a0]"}`} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div
                                className={`${isMenuOpen ? "block" : "hidden"} border-t lg:flex ${
                                    accessibility.isHighContrast ? "border-gray-600 bg-black" : "border-gray-200 bg-white"
                                }`}
                                id="main-navigation"
                            >
                                <ul className="flex flex-col items-center lg:flex-row">
                                    <li className="w-full lg:w-auto">
                                        <button
                                            {...getVoiceCommandAttributes("home")}
                                            onClick={() => handleNavClick(onHomeClick, "home")}
                                            className={`group relative w-full border-b px-6 py-4 text-sm font-semibold transition-colors lg:border-b-0 ${
                                                accessibility.isHighContrast
                                                    ? `border-gray-600 ${getActiveClass("home")}`
                                                    : `border-gray-100 ${getActiveClass("home")}`
                                            }`}
                                            onFocus={() =>
                                                accessibility.speakText(
                                                    currentView === "document" ? accessibility.t("backToHome") : accessibility.t("home"),
                                                )
                                            }
                                        >
                                            {currentView === "document" ? (
                                                <>
                                                    <Home className="mr-2 inline h-4 w-4" />
                                                    {accessibility.t("backToHome")}
                                                </>
                                            ) : (
                                                accessibility.t("home")
                                            )}
                                        </button>
                                    </li>
                                    {currentView === "document"
                                        ? null
                                        : currentView === "main"
                                          ? renderMainDashboardNavigation()
                                          : renderParticipantDashboardNavigation()}
                                </ul>
                            </div>
                        </div>
                    </nav>

                    {showAccessibilityPanel && (
                        <div
                            className="accessibility-panel fixed right-6 top-28 z-50 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
                            style={getHighContrastStyles()}
                            role="dialog"
                            aria-label={accessibility.t("accessibilityOptions")}
                            aria-modal="true"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className={`text-lg font-semibold ${accessibility.isHighContrast ? "text-white" : "text-gray-800"}`}>
                                    {accessibility.t("accessibilityOptions")}
                                </h3>
                                <button
                                    onClick={toggleAccessibilityPanel}
                                    className={`transition-colors ${
                                        accessibility.isHighContrast ? "text-yellow-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    aria-label={accessibility.t("closeAccessibility")}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className={`space-y-3 text-sm ${accessibility.isHighContrast ? "text-white" : "text-gray-700"}`}>
                                <button
                                    onClick={accessibility.toggleLanguage}
                                    className={`flex w-full items-center justify-between rounded p-2 transition-colors ${
                                        accessibility.isHighContrast ? "hover:bg-yellow-400 hover:text-black" : "hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Languages size={16} />
                                        {accessibility.t("language")}:{" "}
                                        {accessibility.language === "en" ? accessibility.t("english") : accessibility.t("tagalog")}
                                    </span>
                                    <div
                                        className={`rounded px-2 py-1 text-xs ${
                                            accessibility.isHighContrast ? "bg-yellow-400 text-black" : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {accessibility.language === "en" ? "EN" : "TL"}
                                    </div>
                                </button>
                                <div className="flex items-center justify-between">
                                    <span>{accessibility.t("textSize")}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={accessibility.decreaseFontSize}
                                            className={`rounded p-1 transition-colors ${
                                                accessibility.isHighContrast ? "hover:bg-yellow-400 hover:text-black" : "hover:bg-gray-100"
                                            }`}
                                            aria-label={accessibility.t("decreaseTextSize")}
                                        >
                                            <ZoomOut size={16} />
                                        </button>
                                        <span className="w-8 text-center text-xs">
                                            {accessibility.fontSize}
                                            {accessibility.t("currentTextSize")}
                                        </span>
                                        <button
                                            onClick={accessibility.increaseFontSize}
                                            className={`rounded p-1 transition-colors ${
                                                accessibility.isHighContrast ? "hover:bg-yellow-400 hover:text-black" : "hover:bg-gray-100"
                                            }`}
                                            aria-label={accessibility.t("increaseTextSize")}
                                        >
                                            <ZoomIn size={16} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleContrast}
                                    className={`flex w-full items-center justify-between rounded p-2 transition-colors ${
                                        accessibility.isHighContrast ? "bg-yellow-400 text-black" : "hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Contrast size={16} />
                                        {accessibility.t("highContrast")}
                                    </span>
                                    {accessibility.isHighContrast && (
                                        <div className={`h-2 w-2 rounded-full ${accessibility.isHighContrast ? "bg-black" : "bg-blue-600"}`}></div>
                                    )}
                                </button>
                                <button
                                    onClick={toggleFont}
                                    className={`flex w-full items-center justify-between rounded p-2 transition-colors ${
                                        accessibility.isHighContrast ? "hover:bg-yellow-400 hover:text-black" : "hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Type size={16} />
                                        {accessibility.t("fontStyle")}:{" "}
                                        {accessibility.fontType === "default"
                                            ? accessibility.t("defaultFont")
                                            : accessibility.fontType === "arial"
                                              ? accessibility.t("arialFont")
                                              : accessibility.t("dyslexiaFont")}
                                    </span>
                                </button>
                                <button
                                    onClick={toggleTextToSpeech}
                                    className={`flex w-full items-center justify-between rounded p-2 transition-colors ${
                                        accessibility.isTextToSpeech
                                            ? accessibility.isHighContrast
                                                ? "bg-yellow-400 text-black"
                                                : "bg-blue-100 text-blue-800"
                                            : accessibility.isHighContrast
                                              ? "hover:bg-yellow-400 hover:text-black"
                                              : "hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {accessibility.isTextToSpeech ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                        {accessibility.t("textToSpeech")}
                                    </span>
                                    {accessibility.isTextToSpeech && (
                                        <div className={`h-2 w-2 rounded-full ${accessibility.isHighContrast ? "bg-black" : "bg-blue-600"}`}></div>
                                    )}
                                </button>
                                <button
                                    onClick={toggleReducedMotion}
                                    className={`flex w-full items-center justify-between rounded p-2 transition-colors ${
                                        accessibility.reducedMotion
                                            ? accessibility.isHighContrast
                                                ? "bg-yellow-400 text-black"
                                                : "bg-blue-100 text-blue-800"
                                            : accessibility.isHighContrast
                                              ? "hover:bg-yellow-400 hover:text-black"
                                              : "hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Keyboard size={16} />
                                        {accessibility.t("reducedMotion")}
                                    </span>
                                    {accessibility.reducedMotion && (
                                        <div className={`h-2 w-2 rounded-full ${accessibility.isHighContrast ? "bg-black" : "bg-blue-600"}`}></div>
                                    )}
                                </button>
                                <button
                                    onClick={accessibility.resetSettings}
                                    className={`mt-2 flex w-full items-center gap-2 rounded p-2 transition-colors ${
                                        accessibility.isHighContrast
                                            ? "text-yellow-400 hover:bg-yellow-400 hover:text-black"
                                            : "text-red-600 hover:bg-gray-100 hover:text-red-800"
                                    }`}
                                >
                                    <RotateCcw size={16} />
                                    {accessibility.t("resetAllSettings")}
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                {/*LOGIN MODAL */}
                {showLogin && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowLogin(false)}
                    >
                        <Login
                            isOpen={showLogin}
                            onClose={() => setShowLogin(false)}
                        />
                    </div>
                )}
            </>
        );
    },
);

export default NavHeader;
