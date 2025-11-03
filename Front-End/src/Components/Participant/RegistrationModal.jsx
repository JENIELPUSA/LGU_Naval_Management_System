import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RegistrationModal = ({
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
    onResetRegistration,
    FetchUpcomingEvent,
    UpcomingTotalPages,
    UpcomingCurrentPage,
    setUpcomingCurrentPage,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [voiceCommandLog, setVoiceCommandLog] = useState("");
    const [similarityScores, setSimilarityScores] = useState({});
    const lastCommandTimeRef = useRef(0);
    const searchInputRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    const debouncedBackendSearch = useCallback(
        (searchTerm, page = 1) => {
            setIsSearching(true);
            FetchUpcomingEvent(page, 5, searchTerm).finally(() => {
                setIsSearching(false);
            });
        },
        [FetchUpcomingEvent],
    );

    const handleSearchChange = useCallback(
        (e) => {
            const value = e.target.value;
            setSearchQuery(value);
            setUpcomingCurrentPage(1);
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(() => {
                debouncedBackendSearch(value, 1);
            }, 500);
        },
        [debouncedBackendSearch, setUpcomingCurrentPage],
    );

    const handlePageChange = useCallback(
        (newPage) => {
            setUpcomingCurrentPage(newPage);
            debouncedBackendSearch(searchQuery, newPage);
        },
        [setUpcomingCurrentPage, debouncedBackendSearch, searchQuery],
    );

    useEffect(() => {
        if (showModal && !selectedEvent) {
            setSearchQuery("");
            setUpcomingCurrentPage(1);
            debouncedBackendSearch("", 1);
        }
    }, [showModal, selectedEvent, debouncedBackendSearch, setUpcomingCurrentPage]);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, []);

    const commandPatterns = useMemo(
        () => ({
            firstName: ["first name", "firstname", "first name is", "my first name is", "first", "name"],
            lastName: ["last name", "lastname", "last name is", "my last name is", "last", "next"],
            email: ["email", "email address", "my email is", "email is", "@"],
            phone: ["phone", "phone number", "my phone is", "contact number", "number is", "mobile"],
            address: ["address", "my address is", "home address", "i live at", "address is", "location"],
            submit: ["submit", "complete registration", "finish registration", "register now", "send registration"],
            search: ["search", "find", "look for", "search for", "find events for", "look for events about"],
            select: ["select", "choose", "register for", "i want to register for", "pick", "event"],
            clear: ["clear search", "reset search", "cancel search", "clear", "reset"],
            back: ["back to events", "go back", "back", "previous"],
            close: ["close", "exit", "cancel", "close modal", "close registration"],
            nextPage: ["next page", "more events", "next", "next events"],
            prevPage: ["previous page", "back page", "previous", "prev"],
        }),
        [],
    );

    const cleanPhoneNumber = useCallback((phone) => {
        if (!phone) return "";
        return phone.replace(/\s+/g, "").replace(/(?!^\+)\D/g, "");
    }, []);

    const cleanEmail = useCallback((email) => {
        if (!email) return "";
        let cleaned = email.trim().replace(/\s+/g, "");
        cleaned = cleaned
            .replace(/at/gi, "@")
            .replace(/\[at\]/gi, "@")
            .replace(/\(at\)/gi, "@")
            .replace(/\s*@\s*/g, "@")
            .replace(/@@+/g, "@");
        return cleaned;
    }, []);

    const handleInputChangeWithClean = useCallback(
        (e) => {
            const { name, value } = e.target;
            let cleanedValue = value;
            if (name === "phone") cleanedValue = cleanPhoneNumber(value);
            else if (name === "email") cleanedValue = cleanEmail(value);
            handleInputChange({ target: { name, value: cleanedValue } });
        },
        [handleInputChange, cleanPhoneNumber, cleanEmail],
    );

    const formatEventDate = useCallback((dateString) => {
        if (!dateString) return "TBA";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, []);

    const calculateSimilarity = useCallback((str1, str2) => {
        if (!str1 || !str2) return 0;
        const s1 = str1.toLowerCase().trim();
        const s2 = str2.toLowerCase().trim();
        if (s1 === s2) return 100;
        if (s1.includes(s2) || s2.includes(s1)) return 90;
        const words1 = s1.split(/\s+/).filter((w) => w.length > 2);
        const words2 = s2.split(/\s+/).filter((w) => w.length > 2);
        let matching = 0;
        words1.forEach((w1) => {
            if (words2.some((w2) => w2.includes(w1) || w1.includes(w2))) matching++;
        });
        const wordScore = (matching / Math.max(words1.length, words2.length)) * 100;
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        let charMatches = 0;
        for (let i = 0; i < shorter.length; i++) {
            if (longer.includes(shorter[i])) charMatches++;
        }
        const charScore = (charMatches / longer.length) * 100;
        return Math.min(100, Math.max(0, wordScore * 0.7 + charScore * 0.3));
    }, []);

    const findBestMatchingEvent = useCallback(
        (command, events, threshold = 25) => {
            if (!events?.length) return null;
            const cleanCmd = command
                .toLowerCase()
                .replace(/\b(select|choose|register for|i want to|event|events)\b/gi, "")
                .trim();
            let bestMatch = null,
                bestScore = 0;
            const scores = {};
            events.forEach((event) => {
                const title = event.proposal?.title || "";
                const desc = event.proposal?.description || "";
                const titleScore = calculateSimilarity(cleanCmd, title);
                const descScore = calculateSimilarity(cleanCmd, desc) * 0.5;
                const total = Math.max(titleScore, descScore);
                scores[event._id] = total;
                if (total > bestScore && total >= threshold) {
                    bestScore = total;
                    bestMatch = event;
                }
            });
            setSimilarityScores(scores);
            return bestMatch;
        },
        [calculateSimilarity],
    );

    const extractSearchTerm = useCallback((command) => {
        const phrases = ["search for", "find events for", "look for events about", "search", "find", "look for", "events about", "events for"];
        let term = command.toLowerCase();
        phrases.forEach((p) => (term = term.replace(p, "")));
        return term
            .replace(/\s+/g, " ")
            .replace(/\b(the|a|an|and|or|for|about|events|event)\b/gi, "")
            .trim();
    }, []);

    const extractValue = useCallback((command, patterns) => {
        for (const p of patterns) {
            if (command.includes(p)) {
                let val = command.replace(p, "").trim();
                ["my", "is", "the", "for", "about", "events", "event"].forEach((c) => {
                    val = val.replace(c, "").trim();
                });
                return val;
            }
        }
        return "";
    }, []);

    // VOICE COMMAND HANDLER
    useEffect(() => {
        const DEBOUNCE = 500;
        const handleVoiceCommand = (event) => {
            const cmd = event.detail?.command;
            if (!cmd) return;
            const now = Date.now();
            if (now - lastCommandTimeRef.current < DEBOUNCE) return;
            lastCommandTimeRef.current = now;
            const cmdLow = cmd.toLowerCase().trim();
            setVoiceCommandLog(`Voice: "${cmd}"`);

            if (!showModal) return;

            // Pagination
            if (commandPatterns.nextPage.some((p) => cmdLow.includes(p)) && UpcomingCurrentPage < UpcomingTotalPages) {
                handlePageChange(UpcomingCurrentPage + 1);
                if (window.speechSynthesis) {
                    const u = new SpeechSynthesisUtterance(`Page ${UpcomingCurrentPage + 1}`);
                    u.rate = 1.0;
                    window.speechSynthesis.speak(u);
                }
                return;
            }
            if (commandPatterns.prevPage.some((p) => cmdLow.includes(p)) && UpcomingCurrentPage > 1) {
                handlePageChange(UpcomingCurrentPage - 1);
                if (window.speechSynthesis) {
                    const u = new SpeechSynthesisUtterance(`Page ${UpcomingCurrentPage - 1}`);
                    u.rate = 1.0;
                    window.speechSynthesis.speak(u);
                }
                return;
            }

            // Select Event
            const isSelect = commandPatterns.select.some((p) => cmdLow.includes(p));
            if (isSelect && !selectedEvent && Array.isArray(isEventUpcoming) && isEventUpcoming.length > 0) {
                const match = findBestMatchingEvent(cmdLow, isEventUpcoming, 25);
                if (match) {
                    handleEventSelect(match);
                    if (window.speechSynthesis) {
                        const u = new SpeechSynthesisUtterance(`Selected ${match.proposal?.title}. Please provide your registration details.`);
                        u.rate = 1.0;
                        window.speechSynthesis.speak(u);
                    }
                } else if (window.speechSynthesis) {
                    const u = new SpeechSynthesisUtterance("No matching event found. Please try different keywords.");
                    u.rate = 1.0;
                    window.speechSynthesis.speak(u);
                }
                return;
            }

            // Search or Clear
            if (!selectedEvent) {
                const isSearch = commandPatterns.search.some((p) => cmdLow.includes(p));
                if (isSearch) {
                    const term = extractSearchTerm(cmdLow);
                    if (term) {
                        setSearchQuery(term);
                        setUpcomingCurrentPage(1);
                        setTimeout(() => {
                            if (searchInputRef.current) {
                                searchInputRef.current.focus();
                                searchInputRef.current.select();
                            }
                        }, 100);
                        debouncedBackendSearch(term, 1);
                        if (window.speechSynthesis) {
                            const u = new SpeechSynthesisUtterance(`Searching for ${term}`);
                            u.rate = 1.0;
                            window.speechSynthesis.speak(u);
                        }
                    }
                    return;
                }
                if (commandPatterns.clear.some((p) => cmdLow.includes(p))) {
                    setSearchQuery("");
                    setUpcomingCurrentPage(1);
                    debouncedBackendSearch("", 1);
                    if (window.speechSynthesis) {
                        const u = new SpeechSynthesisUtterance("Search cleared");
                        u.rate = 1.0;
                        window.speechSynthesis.speak(u);
                    }
                    return;
                }
            }

            // Form fill
            if (selectedEvent) {
                if (commandPatterns.firstName.some((p) => cmdLow.includes(p))) {
                    const val = extractValue(cmdLow, commandPatterns.firstName);
                    if (val && val.length > 1) {
                        handleInputChangeWithClean({ target: { name: "firstName", value: val } });
                        if (window.speechSynthesis) {
                            const u = new SpeechSynthesisUtterance(`First name set to ${val}`);
                            u.rate = 1.0;
                            window.speechSynthesis.speak(u);
                        }
                    }
                    return;
                }
                if (commandPatterns.lastName.some((p) => cmdLow.includes(p))) {
                    const val = extractValue(cmdLow, commandPatterns.lastName);
                    if (val && val.length > 1) {
                        handleInputChangeWithClean({ target: { name: "lastName", value: val } });
                        if (window.speechSynthesis) {
                            const u = new SpeechSynthesisUtterance(`Last name set to ${val}`);
                            u.rate = 1.0;
                            window.speechSynthesis.speak(u);
                        }
                    }
                    return;
                }
                if (commandPatterns.email.some((p) => cmdLow.includes(p))) {
                    const emailMatch = cmdLow.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
                    let emailVal = "";
                    if (emailMatch?.[0]) emailVal = cleanEmail(emailMatch[0]);
                    else {
                        const val = extractValue(cmdLow, commandPatterns.email);
                        if (val && val.length > 3) emailVal = cleanEmail(val);
                    }
                    if (emailVal) {
                        handleInputChangeWithClean({ target: { name: "email", value: emailVal } });
                        if (window.speechSynthesis) {
                            const u = new SpeechSynthesisUtterance(`Email set to ${emailVal}`);
                            u.rate = 1.0;
                            window.speechSynthesis.speak(u);
                        }
                    }
                    return;
                }
                if (commandPatterns.phone.some((p) => cmdLow.includes(p))) {
                    const phoneMatch = cmdLow.match(/(\d{10,})/g);
                    let phoneVal = "";
                    if (phoneMatch?.[0]) phoneVal = cleanPhoneNumber(phoneMatch[0]);
                    else {
                        const val = extractValue(cmdLow, commandPatterns.phone);
                        if (val && val.length > 5) phoneVal = cleanPhoneNumber(val);
                    }
                    if (phoneVal) {
                        handleInputChangeWithClean({ target: { name: "phone", value: phoneVal } });
                        if (window.speechSynthesis) {
                            const u = new SpeechSynthesisUtterance(`Phone number set to ${phoneVal}`);
                            u.rate = 1.0;
                            window.speechSynthesis.speak(u);
                        }
                    }
                    return;
                }
                if (commandPatterns.address.some((p) => cmdLow.includes(p))) {
                    const val = extractValue(cmdLow, commandPatterns.address);
                    if (val && val.length > 5) {
                        handleInputChangeWithClean({ target: { name: "address", value: val } });
                        if (window.speechSynthesis) {
                            const u = new SpeechSynthesisUtterance(`Address set to ${val}`);
                            u.rate = 1.0;
                            window.speechSynthesis.speak(u);
                        }
                    }
                    return;
                }
                if (commandPatterns.submit.some((p) => cmdLow.includes(p))) {
                    const { firstName, lastName, email, phone, address } = formData;
                    if (firstName && lastName && email && phone && address) {
                        handleSubmit(new Event("submit"));
                    } else if (window.speechSynthesis) {
                        const u = new SpeechSynthesisUtterance("Please fill all required fields before submitting");
                        u.rate = 1.0;
                        window.speechSynthesis.speak(u);
                    }
                    return;
                }
            }

            // Back / Close
            if (commandPatterns.back.some((p) => cmdLow.includes(p)) && selectedEvent) {
                setSelectedEvent(null);
                setSearchQuery("");
                setUpcomingCurrentPage(1);
                debouncedBackendSearch("", 1);
                if (window.speechSynthesis) {
                    const u = new SpeechSynthesisUtterance("Back to events");
                    u.rate = 1.0;
                    window.speechSynthesis.speak(u);
                }
                return;
            }
            if (commandPatterns.close.some((p) => cmdLow.includes(p))) {
                setShowModal(false);
                setSelectedEvent(null);
                if (registrationSuccess) onResetRegistration();
                return;
            }

            // Fallback search
            if (!selectedEvent && cmdLow.length > 2 && !isSelect) {
                setSearchQuery(cmdLow);
                setUpcomingCurrentPage(1);
                debouncedBackendSearch(cmdLow, 1);
            }
        };

        window.addEventListener("voice-command", handleVoiceCommand, { capture: true, passive: true });
        return () => window.removeEventListener("voice-command", handleVoiceCommand, { capture: true });
    }, [
        showModal,
        selectedEvent,
        isEventUpcoming,
        handleEventSelect,
        setSelectedEvent,
        setShowModal,
        handleInputChangeWithClean,
        handleSubmit,
        registrationSuccess,
        onResetRegistration,
        commandPatterns,
        extractSearchTerm,
        findBestMatchingEvent,
        cleanPhoneNumber,
        cleanEmail,
        formData,
        debouncedBackendSearch,
        handlePageChange,
        UpcomingCurrentPage,
        UpcomingTotalPages,
    ]);

    useEffect(() => {
        if (registrationSuccess) {
            const timer = setTimeout(() => {
                setShowModal(false);
                setSelectedEvent(null);
                onResetRegistration();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [registrationSuccess, setShowModal, setSelectedEvent, onResetRegistration]);

    const backdropVariant = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariant = {
        hidden: { y: "-50px", opacity: 0 },
        visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 300 } },
        exit: { y: "-50px", opacity: 0, transition: { duration: 0.2 } },
    };
    const eventCardVariant = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    const PaginationControls = useMemo(() => {
        if (UpcomingTotalPages <= 1) return null;
        return (
            <div className="mt-3 flex items-center justify-center space-x-2">
                <button
                    onClick={() => handlePageChange(UpcomingCurrentPage - 1)}
                    disabled={UpcomingCurrentPage === 1}
                    className="rounded bg-gray-200 px-3 py-1 text-[10px] hover:bg-gray-300 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-[10px] font-medium text-gray-600">
                    Page {UpcomingCurrentPage} of {UpcomingTotalPages}
                </span>
                <button
                    onClick={() => handlePageChange(UpcomingCurrentPage + 1)}
                    disabled={UpcomingCurrentPage === UpcomingTotalPages}
                    className="rounded bg-gray-200 px-3 py-1 text-[10px] hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        );
    }, [UpcomingCurrentPage, UpcomingTotalPages, handlePageChange]);

    const eventList = useMemo(() => {
        if (!isEventUpcoming?.length) {
            return (
                <div className="col-span-full py-6 text-center text-[12px] text-gray-500">
                    {isSearching ? (
                        <div className="flex items-center justify-center space-x-1.5">
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                            <span>Searching events...</span>
                        </div>
                    ) : searchQuery ? (
                        "No events match your search."
                    ) : (
                        "No upcoming events available."
                    )}
                </div>
            );
        }
        return (
            <div className="space-y-1.5">
                <div className="grid max-h-[60vh] grid-cols-1 gap-2 overflow-y-auto pr-1">
                    {isEventUpcoming.map((event, index) => {
                        const score = similarityScores[event._id] || 0;
                        const high = score > 50;
                        return (
                            <motion.div
                                key={event._id}
                                className={`cursor-pointer rounded border p-2 transition-all hover:shadow ${
                                    high ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-blue-300"
                                }`}
                                onClick={() => handleEventSelect(event)}
                                variants={eventCardVariant}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.03 }}
                            >
                                <div className="flex flex-col items-start space-y-1">
                                    <div
                                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded ${
                                            high ? "bg-gradient-to-br from-green-100 to-blue-100" : "bg-gradient-to-br from-blue-100 to-pink-100"
                                        }`}
                                    >
                                        <svg
                                            className={`h-5 w-5 ${high ? "text-green-600" : "text-blue-600"}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-start justify-between">
                                            <h3 className="line-clamp-2 text-[12px] font-semibold text-gray-800">{event.proposal?.title}</h3>
                                            {high && (
                                                <span className="ml-1 flex-shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-800">
                                                    {Math.round(score)}% match
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-[10px] font-medium text-gray-600">{formatEventDate(event.eventDate)}</p>
                                        <p className="mt-1 line-clamp-2 text-[10px] text-gray-500">{event.proposal?.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                {PaginationControls}
            </div>
        );
    }, [isEventUpcoming, searchQuery, handleEventSelect, formatEventDate, similarityScores, isSearching, PaginationControls]);

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 p-2 backdrop-blur-sm"
                    variants={backdropVariant}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        className="z-[999] max-h-[90vh] w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl"
                        variants={modalVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="p-3">
                            <div className="mb-3 flex items-center justify-between border-b pb-2">
                                <h2 className="text-[16px] font-bold text-gray-800">{selectedEvent ? "Register for Event" : "Choose an Event"}</h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedEvent(null);
                                        if (registrationSuccess) onResetRegistration();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {!selectedEvent ? (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search events..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className="w-full rounded border border-gray-300 px-3 py-1.5 pl-10 pr-8 text-[12px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <div className="absolute left-3 top-1.5 text-gray-400">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                        {isSearching && (
                                            <div className="absolute right-9 top-1.5">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                                            </div>
                                        )}
                                        {searchQuery && !isSearching && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    debouncedBackendSearch("", 1);
                                                }}
                                                className="absolute right-2 top-1.5 p-0.5 text-gray-400 hover:text-gray-600"
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <div className="rounded border border-blue-200 bg-blue-50 p-2">
                                        <p className="text-center text-[12px] text-blue-700">
                                            <strong>Voice:</strong> "select [name]", "search [kw]", "next", "clear"
                                        </p>
                                        <p className="mt-1 text-center text-[10px] text-blue-600">
                                            <span className="font-semibold text-green-600">Green</span> = voice match
                                        </p>
                                    </div>

                                    {eventList}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 md:flex-row">
                                    <div className="md:w-1/3">
                                        <div className="h-full rounded border border-blue-100 bg-gradient-to-r from-blue-50 to-pink-50 p-2">
                                            <h3 className="text-[14px] font-bold text-blue-900">{selectedEvent.proposal?.title}</h3>
                                            <p className="mt-0.5 text-[12px] text-blue-600">{formatEventDate(selectedEvent.eventDate)}</p>
                                            <p className="mt-2 text-[12px] text-gray-700">{selectedEvent.proposal?.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:w-2/3">
                                        <div className="mb-2 rounded border border-green-200 bg-green-50 p-2">
                                            <p className="text-center text-[10px] text-green-700">
                                                <strong>Voice Fill:</strong> "first name John", "email john at gmail", etc.
                                            </p>
                                            <p className="mt-0.5 text-center text-[10px] text-green-600">
                                                <strong>Auto-clean:</strong> Spaces removed, 'at' → '@'
                                            </p>
                                        </div>
                                        <form
                                            onSubmit={handleSubmit}
                                            className="flex-grow space-y-2"
                                        >
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-0.5 block text-[10px] font-medium text-gray-700">First Name</label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleInputChangeWithClean}
                                                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-[12px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-0.5 block text-[10px] font-medium text-gray-700">Last Name</label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleInputChangeWithClean}
                                                        className="w-full rounded border border-gray-300 px-2 py-1.5 text-[12px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="mb-0.5 block text-[10px] font-medium text-gray-700">Email Address</label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChangeWithClean}
                                                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-[12px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                    placeholder="john at gmail.com"
                                                    onBlur={(e) => {
                                                        const cleaned = cleanEmail(e.target.value);
                                                        if (cleaned !== e.target.value) {
                                                            handleInputChangeWithClean({ target: { name: "email", value: cleaned } });
                                                        }
                                                    }}
                                                />
                                                <p className="mt-1 text-[10px] text-gray-500">Say "john at gmail.com" → becomes john@gmail.com</p>
                                            </div>
                                            <div>
                                                <label className="mb-0.5 block text-[10px] font-medium text-gray-700">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChangeWithClean}
                                                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-[12px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                    placeholder="09123456789"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-0.5 block text-[10px] font-medium text-gray-700">Address</label>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChangeWithClean}
                                                    rows={2}
                                                    className="w-full resize-none rounded border border-gray-300 px-2 py-1.5 text-[12px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5 border-t pt-2 sm:flex-row">
                                                <button
                                                    type="submit"
                                                    className="flex-1 rounded bg-gradient-to-r from-blue-600 to-pink-600 px-4 py-2 text-[12px] font-medium text-white hover:from-blue-700 hover:to-pink-700"
                                                >
                                                    Complete Registration
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedEvent(null)}
                                                    className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50"
                                                >
                                                    Back to Events
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(RegistrationModal);
