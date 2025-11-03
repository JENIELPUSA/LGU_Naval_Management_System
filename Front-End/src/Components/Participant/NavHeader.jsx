import React, { useState, useEffect, createContext, useContext, useCallback, useMemo, useRef } from "react";
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
} from "lucide-react";
import Logo from "../../assets/Biliran-header.webp";

// Translation dictionary
const translations = {
  en: {
    home: "Home",
    events: "Events",
    contactUs: "Contact Us",
    about: "About",
    feedback: "Feedback",
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
  }
};

// Default accessibility settings
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

// Create Accessibility Context
const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [accessibilitySettings, setAccessibilitySettings] = useState(defaultAccessibilitySettings);
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Memoized translation function
  const t = useCallback((key) => {
    return translations[accessibilitySettings.language]?.[key] || translations.en[key] || key;
  }, [accessibilitySettings.language]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAccessibilitySettings(settings);
        applySettings(settings);
        document.documentElement.lang = settings.language;
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // Optimized settings application
  const applySettings = useCallback((settings) => {
    const { fontSize, isHighContrast, fontType, isKeyboardHighlight, reducedMotion, language } = settings;
    
    // Font size
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Language
    document.documentElement.lang = language;
    
    // High contrast
    document.body.classList.toggle('high-contrast', isHighContrast);
    
    // Font family
    const fontFamilies = {
      dyslexia: "'OpenDyslexic', Arial, sans-serif",
      arial: 'Arial, sans-serif',
      default: 'inherit'
    };
    document.body.style.fontFamily = fontFamilies[fontType] || fontFamilies.default;
    
    // Other classes
    document.body.classList.toggle('keyboard-highlight', isKeyboardHighlight);
    document.body.classList.toggle('reduced-motion', reducedMotion);

    // Save to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, []);

  const updateSettings = useCallback((newSettings) => {
    const updated = { ...accessibilitySettings, ...newSettings };
    setAccessibilitySettings(updated);
    applySettings(updated);
  }, [accessibilitySettings, applySettings]);

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
    const newLanguage = accessibilitySettings.language === 'en' ? 'tl' : 'en';
    updateSettings({ language: newLanguage });
    speakText(`Language switched to ${newLanguage === 'en' ? 'English' : 'Tagalog'}`);
  }, [accessibilitySettings.language, updateSettings]);

  const resetSettings = useCallback(() => {
    if (accessibilitySettings.isHandsFree) {
      stopHandsFree();
    }
    setAccessibilitySettings(defaultAccessibilitySettings);
    applySettings(defaultAccessibilitySettings);
    speakText("All settings have been reset to default");
  }, [accessibilitySettings.isHandsFree, applySettings]);

  // Optimized speech function
  const speakText = useCallback((text = null) => {
    if (accessibilitySettings.isTextToSpeech && text && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.lang = accessibilitySettings.language === 'tl' ? 'tl-PH' : 'en-PH';
      
      // Get available voices and try to use a local one
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes(accessibilitySettings.language === 'tl' ? 'tl' : 'en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [accessibilitySettings.isTextToSpeech, accessibilitySettings.language]);

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Optimized navigation click function
  const clickNavigationItem = useCallback((itemText) => {
    const navButtons = document.querySelectorAll('nav button, [role="navigation"] button, .nav-header button');
    
    for (let button of navButtons) {
      const buttonText = button.textContent?.toLowerCase().trim();
      if (buttonText && buttonText.includes(itemText.toLowerCase())) {
        button.click();
        speakText(`${t('navigatingTo')} ${itemText}`);
        
        // Dispatch event for global command handling
        window.dispatchEvent(new CustomEvent('voice-navigation', { 
          detail: { command: itemText.toLowerCase(), element: button }
        }));
        return true;
      }
    }
    
    return false;
  }, [t, speakText]);

  // Optimized voice command dispatch
  const dispatchVoiceCommand = useCallback((command) => {
    window.dispatchEvent(new CustomEvent('voice-command', { 
      detail: { command: command }
    }));
  }, []);

  // Optimized voice command handler
  const handleVoiceCommand = useCallback((command) => {
    const commandLower = command.toLowerCase();
    
    // Predefined command handlers
    const commandHandlers = {
      'help': () => {
        const commands = [
          t('commandHome'), t('commandEvents'), t('commandContact'),
          t('commandAbout'), t('commandFeedback'), t('commandMenu'),
          t('commandAccessibility'), t('commandLanguage'), t('commandScrollUp'),
          t('commandScrollDown'), t('commandBack'), t('commandStop')
        ];
        speakText(t('availableCommands') + " " + commands.join(". "));
      },
      'home': () => {
        if (!clickNavigationItem(t('home'))) {
          speakText("Navigating to home");
          dispatchVoiceCommand('home');
        }
      },
      'events': () => {
        if (!clickNavigationItem(t('events'))) {
          speakText("Navigating to events");
          dispatchVoiceCommand('events');
        }
      },
      'contact': () => {
        if (!clickNavigationItem(t('contactUs'))) {
          speakText("Navigating to contact");
          dispatchVoiceCommand('contact');
        }
      },
      'about': () => {
        if (!clickNavigationItem(t('about'))) {
          speakText("Navigating to about");
          dispatchVoiceCommand('about');
        }
      },
      'feedback': () => {
        if (!clickNavigationItem(t('feedback'))) {
          speakText("Opening feedback");
          dispatchVoiceCommand('feedback');
        }
      },
      'menu': () => {
        speakText(t('opening') + " " + t('mainNavigation'));
        const menuButton = document.querySelector('button[aria-label*="menu"], button[aria-label*="Menu"]');
        menuButton?.click();
      },
      'accessibility': () => {
        speakText(t('opening') + " " + t('accessibilityOptions'));
        const accessibilityButton = document.querySelector('button[aria-label*="accessibility"], button[aria-label*="Accessibility"]');
        accessibilityButton?.click();
      },
      'language': () => {
        speakText(t('switchingTo') + " " + (accessibilitySettings.language === 'en' ? t('tagalog') : t('english')));
        toggleLanguage();
      },
      'back': () => {
        speakText("Going back");
        window.history.back();
      },
      'scroll up': () => {
        speakText("Scrolling up");
        window.scrollBy({ top: -300, behavior: 'smooth' });
      },
      'scroll down': () => {
        speakText("Scrolling down");
        window.scrollBy({ top: 300, behavior: 'smooth' });
      },
      'stop': () => {
        speakText("Stopping hands-free mode");
        toggleHandsFree();
      },
      'register': () => {
        speakText("Opening registration");
        dispatchVoiceCommand('register');
      }
    };

    // Command mapping with aliases
    const commandMap = {
      'help': ['help', 'tulong'],
      'home': ['home', 'bahay'],
      'events': ['events', 'mga event', 'event'],
      'contact': ['contact', 'contact us', 'makipag-ugnayan'],
      'about': ['about', 'tungkol', 'tungkol sa amin'],
      'feedback': ['feedback'],
      'menu': ['menu', 'navigation', 'navigation menu'],
      'accessibility': ['accessibility', 'accessibility options'],
      'language': ['language', 'wika', 'change language'],
      'back': ['back', 'bumalik'],
      'scroll up': ['scroll up', 'scroll pataas'],
      'scroll down': ['scroll down', 'scroll pababa'],
      'stop': ['stop', 'tigil', 'itigil'],
      'register': ['register', 'sign up', 'magparehistro']
    };

    // Find and execute command handler
    for (const [handlerKey, triggers] of Object.entries(commandMap)) {
      if (triggers.some(trigger => commandLower.includes(trigger))) {
        commandHandlers[handlerKey]();
        return;
      }
    }

    // Check for partial matches for navigation items
    const navItems = [t('home'), t('events'), t('contactUs'), t('about'), t('feedback')];
    for (let item of navItems) {
      if (commandLower.includes(item.toLowerCase()) || 
          (item.toLowerCase().includes(commandLower) && commandLower.length > 2)) {
        if (clickNavigationItem(item)) {
          return;
        }
      }
    }

    // If no command matched
    speakText(`Command not recognized: ${command}. Say 'help' for available commands.`);
  }, [t, speakText, clickNavigationItem, dispatchVoiceCommand, accessibilitySettings.language, toggleLanguage]);

  // Optimized hands-free functions
  const startHandsFree = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      speakText("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = accessibilitySettings.language === 'tl' ? 'tl-PH' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      speakText(t('handsFreeOn'));
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      setLastCommand(transcript);
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' && accessibilitySettings.isHandsFree) {
        setTimeout(() => recognition.start(), 1000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (accessibilitySettings.isHandsFree) {
        setTimeout(() => recognition.start(), 500);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [accessibilitySettings.language, accessibilitySettings.isHandsFree, t, speakText, handleVoiceCommand]);

  const stopHandsFree = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    recognitionRef.current = null;
    speakText(t('handsFreeOff'));
  }, [t, speakText]);

  const toggleHandsFree = useCallback(() => {
    const newHandsFreeState = !accessibilitySettings.isHandsFree;
    updateSettings({ isHandsFree: newHandsFreeState });
    
    if (newHandsFreeState) {
      startHandsFree();
    } else {
      stopHandsFree();
    }
  }, [accessibilitySettings.isHandsFree, updateSettings, startHandsFree, stopHandsFree]);

  // Effect to handle hands-free mode changes
  useEffect(() => {
    if (accessibilitySettings.isHandsFree && !isListening && !recognitionRef.current) {
      startHandsFree();
    }
  }, [accessibilitySettings.isHandsFree, isListening, startHandsFree]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      {/* Hands-Free Status Indicator */}
      {accessibilitySettings.isHandsFree && (
        <div className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg ${
          accessibilitySettings.isHighContrast 
            ? "bg-yellow-400 text-black border-2 border-black" 
            : "bg-red-500 text-white"
        } ${isListening ? 'animate-pulse' : ''}`}>
          <div className="flex items-center gap-2">
            <Mic size={20} />
            <span className="text-sm font-semibold">
              {isListening ? t('listening') : t('handsFree')}
            </span>
          </div>
          {lastCommand && (
            <div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
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
    };
  }
  return context;
};

// Optimized NavHeader component with React.memo
const NavHeader = React.memo(({
  eventsRef,
  feedbacRef,
  aboutRef,
  documentationRef,
  onHomeClick,
  currentView,
  activeSection,
  onSectionChange,
  bgtheme,
  FontColor,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  
  const accessibility = useAccessibility();

  // Throttled scroll handler
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

  // Time updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Memoized functions
  const scrollToSection = useCallback((ref) => {
    const scrollBehavior = accessibility.reducedMotion ? 'auto' : 'smooth';
    ref?.current?.scrollIntoView({ behavior: scrollBehavior });
    setIsMenuOpen(false);
  }, [accessibility.reducedMotion]);

  const handleNavClick = useCallback((action, section = null) => {
    if (action) {
      action();
    } else if (onSectionChange && section) {
      onSectionChange(section);
    }
    setIsMenuOpen(false);

    if (section) {
      accessibility.speakText(`Navigated to ${section}`);
    }
  }, [onSectionChange, accessibility]);

  const formatTime = useCallback((date) =>
    date.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    }), []);

  const formatDate = useCallback((date) =>
    date.toLocaleDateString(accessibility.language === 'tl' ? 'tl-PH' : 'en-PH', {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Manila",
    }), [accessibility.language]);

  // Memoized styles and classes
  const getActiveClass = useCallback((section) => {
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
  }, [activeSection, accessibility.isHighContrast]);

  const toggleAccessibilityPanel = useCallback(() => {
    setShowAccessibilityPanel(prev => !prev);
    accessibility.speakText(
      showAccessibilityPanel 
        ? accessibility.t('accessibilityPanelClosed')
        : accessibility.t('accessibilityPanelOpened')
    );
  }, [showAccessibilityPanel, accessibility]);

  const toggleContrast = useCallback(() => {
    accessibility.updateSettings({ 
      isHighContrast: !accessibility.isHighContrast 
    });
    accessibility.speakText(
      accessibility.isHighContrast 
        ? accessibility.t('highContrastModeOff')
        : accessibility.t('highContrastModeOn')
    );
  }, [accessibility]);

  const toggleFont = useCallback(() => {
    const fonts = ["default", "arial", "dyslexia"];
    const currentIndex = fonts.indexOf(accessibility.fontType);
    const nextFont = fonts[(currentIndex + 1) % fonts.length];
    accessibility.updateSettings({ fontType: nextFont });
    
    const fontNames = {
      default: accessibility.t('defaultFont'),
      arial: accessibility.t('arialFont'),
      dyslexia: accessibility.t('dyslexiaFont')
    };
    accessibility.speakText(`${accessibility.t('fontChangedTo')} ${fontNames[nextFont]}`);
  }, [accessibility]);

  const toggleTextToSpeech = useCallback(() => {
    accessibility.updateSettings({ 
      isTextToSpeech: !accessibility.isTextToSpeech 
    });
    accessibility.speakText(
      accessibility.isTextToSpeech 
        ? accessibility.t('textToSpeechOff')
        : accessibility.t('textToSpeechOn')
    );
  }, [accessibility]);

  const toggleReducedMotion = useCallback(() => {
    accessibility.updateSettings({ 
      reducedMotion: !accessibility.reducedMotion 
    });
    accessibility.speakText(
      accessibility.reducedMotion 
        ? accessibility.t('reducedMotionOff')
        : accessibility.t('reducedMotionOn')
    );
  }, [accessibility]);

  // Memoized style getters
  const getHighContrastStyles = useCallback(() => {
    if (accessibility.isHighContrast) {
      return {
        background: '#000000',
        color: '#ffffff',
        border: '2px solid #ffff00'
      };
    }
    return {};
  }, [accessibility.isHighContrast]);

  const getHighContrastButtonStyles = useCallback(() => {
    if (accessibility.isHighContrast) {
      return {
        background: '#ffff00',
        color: '#000000',
        border: '2px solid #000000',
        fontWeight: 'bold'
      };
    }
    return { background: bgtheme, color: FontColor };
  }, [accessibility.isHighContrast, bgtheme, FontColor]);

  const getVoiceCommandAttributes = useCallback((command) => {
    return {
      'data-voice-command': command.toLowerCase(),
      'aria-label': `${accessibility.t(command)} ${accessibility.t('navigation')}`
    };
  }, [accessibility]);

  // Memoized navigation sections
  const renderMainDashboardNavigation = useCallback(() => (
    <>
      {['events', 'contact', 'about'].map((section) => (
        <li key={section}>
          <button
            {...getVoiceCommandAttributes(section)}
            onClick={() => scrollToSection(
              section === 'events' ? eventsRef : 
              section === 'contact' ? feedbacRef : 
              aboutRef
            )}
            onFocus={() => accessibility.speakText(accessibility.t(section))}
            className={`group relative w-full border-b border-gray-100 px-6 py-4 text-sm font-semibold transition-all duration-200 lg:border-b-0 ${
              accessibility.isHighContrast 
                ? "text-white hover:bg-white hover:text-black border-gray-600" 
                : "text-gray-800 hover:text-[#0032a0] hover:bg-blue-50"
            }`}
          >
            {accessibility.t(section === 'contact' ? 'contactUs' : section)}
          </button>
        </li>
      ))}
    </>
  ), [accessibility, getVoiceCommandAttributes, scrollToSection, eventsRef, feedbacRef, aboutRef]);

  const renderParticipantDashboardNavigation = useCallback(() => (
    <>
      {['events', 'feedback', 'about'].map((section) => (
        <li key={section}>
          <button
            {...getVoiceCommandAttributes(section)}
            onClick={() => handleNavClick(null, section)}
            onFocus={() => accessibility.speakText(accessibility.t(section))}
            className={`group relative w-full border-b border-gray-100 px-6 py-4 text-sm font-semibold transition-all duration-200 ${getActiveClass(section)}`}
          >
            {accessibility.t(section)}
          </button>
        </li>
      ))}
    </>
  ), [accessibility, getVoiceCommandAttributes, handleNavClick, getActiveClass]);

  return (
    <header className="w-full font-sans relative">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50"
        onFocus={() => accessibility.speakText(accessibility.t('skipToContent'))}
        style={accessibility.isHighContrast ? { background: '#ffff00', color: '#000000', border: '2px solid #000000' } : {}}
      >
        {accessibility.t('skipToContent')}
      </a>

      {/* GOVPH BAR */}
      <div
        style={accessibility.isHighContrast ? { background: '#000000', color: '#ffffff', borderColor: '#ffff00' } : { background: bgtheme }}
        className="border-b border-[#001f63] px-4 py-2 text-sm text-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex items-center gap-4 text-xs">
            <span style={{ color: accessibility.isHighContrast ? '#ffffff' : FontColor }} className="font-semibold">
              {accessibility.t('republic')}
            </span>
            <span style={{ color: accessibility.isHighContrast ? '#ffffff' : FontColor }} className="hidden md:inline">
              • {accessibility.t('publicDomain')}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span style={{ color: accessibility.isHighContrast ? '#ffffff' : FontColor }} className="font-medium">
              {formatDate(currentTime)}
            </span>
            <span 
              className="rounded px-2 py-1 font-mono"
              style={accessibility.isHighContrast ? { background: '#ffff00', color: '#000000' } : { background: '#001f63' }}
              aria-live="polite"
              aria-atomic="true"
            >
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav
        className={`transition-all duration-300 ${
          isSticky ? "sticky top-0 z-50 shadow-lg" : "shadow-md"
        } ${accessibility.isHighContrast ? "bg-black text-white" : "bg-white"}`}
        aria-label={accessibility.t('mainNavigation')}
        role="navigation"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-6 py-3">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <img
                src={Logo}
                alt={`${accessibility.t('province')} Logo`}
                className="h-14 object-contain"
                loading="eager"
              />
              <div className={`hidden border-l pl-4 md:block ${
                accessibility.isHighContrast ? "border-gray-600" : "border-gray-300"
              }`}>
                <div className={`text-sm font-bold ${
                  accessibility.isHighContrast ? "text-white" : "text-[#0032a0]"
                }`}>
                  {accessibility.t('province')}
                </div>
                <div className={`text-xs ${
                  accessibility.isHighContrast ? "text-gray-300" : "text-gray-600"
                }`}>
                  {accessibility.t('municipality')}
                </div>
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="flex items-center gap-3">
              <button
                {...getVoiceCommandAttributes('accessibility')}
                onClick={toggleAccessibilityPanel}
                style={getHighContrastButtonStyles()}
                className="hidden lg:flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-md transition-colors relative accessibility-button"
                aria-expanded={showAccessibilityPanel}
                aria-haspopup="dialog"
                onFocus={() => accessibility.speakText(accessibility.t('accessibility'))}
              >
                <Accessibility className="h-4 w-4" />
                {accessibility.t('accessibility')}
                {Object.values(accessibility).some(val => val === true) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              <button
                {...getVoiceCommandAttributes('menu')}
                className={`rounded-lg border p-2 lg:hidden transition-colors ${
                  accessibility.isHighContrast 
                    ? "border-yellow-400 text-white hover:bg-yellow-400 hover:text-black" 
                    : "border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  accessibility.speakText(isMenuOpen ? accessibility.t('closeMenu') : accessibility.t('openMenu'));
                }}
                aria-label={isMenuOpen ? accessibility.t('close') : accessibility.t('openMenu')}
                onFocus={() => accessibility.speakText(isMenuOpen ? accessibility.t('closeMenu') : accessibility.t('openMenu'))}
              >
                {isMenuOpen ? (
                  <X className={`h-5 w-5 ${accessibility.isHighContrast ? "text-yellow-400" : "text-[#0032a0]"}`} />
                ) : (
                  <Menu className={`h-5 w-5 ${accessibility.isHighContrast ? "text-yellow-400" : "text-[#0032a0]"}`} />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } border-t lg:flex ${
              accessibility.isHighContrast ? "border-gray-600 bg-black" : "border-gray-200 bg-white"
            }`}
            id="main-navigation"
          >
            <ul className="flex flex-col lg:flex-row items-center">
              <li className="w-full lg:w-auto">
                <button
                  {...getVoiceCommandAttributes('home')}
                  onClick={() => handleNavClick(onHomeClick, "home")}
                  className={`group relative w-full border-b px-6 py-4 text-sm font-semibold transition-colors lg:border-b-0 ${
                    accessibility.isHighContrast 
                      ? `border-gray-600 ${getActiveClass("home")}` 
                      : `border-gray-100 ${getActiveClass("home")}`
                  }`}
                  onFocus={() => accessibility.speakText(
                    currentView === "document" 
                      ? accessibility.t('backToHome')
                      : accessibility.t('home')
                  )}
                >
                  {currentView === "document" ? (
                    <>
                      <Home className="mr-2 inline h-4 w-4" />
                      {accessibility.t('backToHome')}
                    </>
                  ) : (
                    accessibility.t('home')
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

      {/* ACCESSIBILITY PANEL */}
      {showAccessibilityPanel && (
        <div 
          className="fixed right-6 top-28 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 accessibility-panel"
          style={getHighContrastStyles()}
          role="dialog"
          aria-label={accessibility.t('accessibilityOptions')}
          aria-modal="true"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-lg font-semibold ${
              accessibility.isHighContrast ? "text-white" : "text-gray-800"
            }`}>
              {accessibility.t('accessibilityOptions')}
            </h3>
            <button
              onClick={toggleAccessibilityPanel}
              className={`transition-colors ${
                accessibility.isHighContrast ? "text-yellow-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label={accessibility.t('closeAccessibility')}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className={`space-y-3 text-sm ${
            accessibility.isHighContrast ? "text-white" : "text-gray-700"
          }`}>
            {/* Language Toggle */}
            <button
              onClick={accessibility.toggleLanguage}
              className={`flex items-center justify-between w-full p-2 rounded transition-colors ${
                accessibility.isHighContrast 
                  ? "hover:bg-yellow-400 hover:text-black" 
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Languages size={16} />
                {accessibility.t('language')}: {accessibility.language === 'en' ? accessibility.t('english') : accessibility.t('tagalog')}
              </span>
              <div className={`text-xs px-2 py-1 rounded ${
                accessibility.isHighContrast 
                  ? "bg-yellow-400 text-black" 
                  : "bg-blue-100 text-blue-800"
              }`}>
                {accessibility.language === 'en' ? 'EN' : 'TL'}
              </div>
            </button>

            {/* Text Size */}
            <div className="flex items-center justify-between">
              <span>{accessibility.t('textSize')}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={accessibility.decreaseFontSize}
                  className={`p-1 rounded transition-colors ${
                    accessibility.isHighContrast 
                      ? "hover:bg-yellow-400 hover:text-black" 
                      : "hover:bg-gray-100"
                  }`}
                  aria-label={accessibility.t('decreaseTextSize')}
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs w-8 text-center">
                  {accessibility.fontSize}{accessibility.t('currentTextSize')}
                </span>
                <button
                  onClick={accessibility.increaseFontSize}
                  className={`p-1 rounded transition-colors ${
                    accessibility.isHighContrast 
                      ? "hover:bg-yellow-400 hover:text-black" 
                      : "hover:bg-gray-100"
                  }`}
                  aria-label={accessibility.t('increaseTextSize')}
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <button
              onClick={toggleContrast}
              className={`flex items-center justify-between w-full p-2 rounded transition-colors ${
                accessibility.isHighContrast 
                  ? "bg-yellow-400 text-black" 
                  : accessibility.isHighContrast 
                    ? "hover:bg-gray-800" 
                    : "hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Contrast size={16} />
                {accessibility.t('highContrast')}
              </span>
              {accessibility.isHighContrast && (
                <div className={`w-2 h-2 rounded-full ${
                  accessibility.isHighContrast ? "bg-black" : "bg-blue-600"
                }`}></div>
              )}
            </button>

            {/* Font Style */}
            <button
              onClick={toggleFont}
              className={`flex items-center justify-between w-full p-2 rounded transition-colors ${
                accessibility.isHighContrast 
                  ? "hover:bg-yellow-400 hover:text-black" 
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <Type size={16} />
                {accessibility.t('fontStyle')}: {
                  accessibility.fontType === 'default' ? accessibility.t('defaultFont') : 
                  accessibility.fontType === 'arial' ? accessibility.t('arialFont') : 
                  accessibility.t('dyslexiaFont')
                }
              </span>
            </button>

            {/* Text to Speech */}
            <button
              onClick={toggleTextToSpeech}
              className={`flex items-center justify-between w-full p-2 rounded transition-colors ${
                accessibility.isTextToSpeech 
                  ? (accessibility.isHighContrast ? "bg-yellow-400 text-black" : "bg-blue-100 text-blue-800")
                  : (accessibility.isHighContrast ? "hover:bg-yellow-400 hover:text-black" : "hover:bg-gray-100")
              }`}
            >
              <span className="flex items-center gap-2">
                {accessibility.isTextToSpeech ? <VolumeX size={16} /> : <Volume2 size={16} />}
                {accessibility.t('textToSpeech')}
              </span>
              {accessibility.isTextToSpeech && (
                <div className={`w-2 h-2 rounded-full ${
                  accessibility.isHighContrast ? "bg-black" : "bg-blue-600"
                }`}></div>
              )}
            </button>

            {/* Reduced Motion */}
            <button
              onClick={toggleReducedMotion}
              className={`flex items-center justify-between w-full p-2 rounded transition-colors ${
                accessibility.reducedMotion 
                  ? (accessibility.isHighContrast ? "bg-yellow-400 text-black" : "bg-blue-100 text-blue-800")
                  : (accessibility.isHighContrast ? "hover:bg-yellow-400 hover:text-black" : "hover:bg-gray-100")
              }`}
            >
              <span className="flex items-center gap-2">
                <Keyboard size={16} />
                {accessibility.t('reducedMotion')}
              </span>
              {accessibility.reducedMotion && (
                <div className={`w-2 h-2 rounded-full ${
                  accessibility.isHighContrast ? "bg-black" : "bg-blue-600"
                }`}></div>
              )}
            </button>

            {/* Reset */}
            <button
              onClick={accessibility.resetSettings}
              className={`flex items-center gap-2 w-full p-2 rounded transition-colors mt-2 ${
                accessibility.isHighContrast 
                  ? "text-yellow-400 hover:bg-yellow-400 hover:text-black" 
                  : "text-red-600 hover:text-red-800 hover:bg-gray-100"
              }`}
            >
              <RotateCcw size={16} />
              {accessibility.t('resetAllSettings')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
});

export default NavHeader;