import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Calendar, MapPin, Users, Clock } from "lucide-react";
import { useAccessibility } from "./NavHeader"; // Import the accessibility hook

const heroBG4 = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80";

const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerChildren = {
    visible: { transition: { staggerChildren: 0.08 } },
};

const LatestEvents = ({ eventsRef, isEventUpcoming, setShowModal, handleEventSelect }) => {
    const accessibility = useAccessibility(); // Use the accessibility hook

    // Translation function for this component
    const t = (key) => {
        const translations = {
            en: {
                latestEvents: "Latest Events",
                stayUpdated: "Stay updated with the latest events and activities happening in our community.",
                noUpcomingEvents: "No Upcoming Events",
                checkBackLater: "Check back later for new events and activities.",
                registerEvent: "Register Event",
                public: "Public",
                openToPublic: "Open to Public",
                duration: "Duration: 2-3 hrs",
                noDescription: "No description available.",
                untitledEvent: "Untitled Event",
                tba: "TBA",
                sports: "Sports",
                cultural: "Cultural",
                meeting: "Meeting",
                festival: "Festival",
                communityService: "Community Service",
                training: "Training",
                communityEvent: "Community Event",
                navalBiliran: "Naval, Biliran",
                eventLocation: "Event location",
                eventDate: "Event date",
                eventTime: "Event time",
                eventCategory: "Event category",
                eventDescription: "Event description",
                registerForEvent: "Register for event",
                clickToRegister: "Click to register for this event"
            },
            tl: {
                latestEvents: "Pinakabagong Mga Event",
                stayUpdated: "Manatiling updated sa mga pinakabagong event at aktibidad na nagaganap sa ating komunidad.",
                noUpcomingEvents: "Walang Paparating na Event",
                checkBackLater: "Bumalik mamaya para sa mga bagong event at aktibidad.",
                registerEvent: "Magrehistro sa Event",
                public: "Pampubliko",
                openToPublic: "Bukas sa Publiko",
                duration: "Tagal: 2-3 oras",
                noDescription: "Walang available na deskripsyon.",
                untitledEvent: "Event na Walang Pamagat",
                tba: "TBA",
                sports: "Sports",
                cultural: "Kultural",
                meeting: "Pulong",
                festival: "Pista",
                communityService: "Serbisyong Pangkomunidad",
                training: "Pagsasanay",
                communityEvent: "Event ng Komunidad",
                navalBiliran: "Naval, Biliran",
                eventLocation: "Lokasyon ng event",
                eventDate: "Petsa ng event",
                eventTime: "Oras ng event",
                eventCategory: "Kategorya ng event",
                eventDescription: "Deskripsyon ng event",
                registerForEvent: "Magrehistro para sa event",
                clickToRegister: "I-click para magrehistro sa event na ito"
            }
        };
        return translations[accessibility.language]?.[key] || translations.en[key] || key;
    };

    const formatEventDate = (dateString) => {
        if (!dateString) return t('tba');
        return new Date(dateString).toLocaleDateString(accessibility.language === 'tl' ? 'tl-PH' : 'en-US', { 
            year: "numeric", 
            month: "short", 
            day: "numeric" 
        });
    };

    const formatEventTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleTimeString(accessibility.language === 'tl' ? 'tl-PH' : 'en-US', { 
            hour: "2-digit", 
            minute: "2-digit", 
            hour12: true 
        });
    };

    const getEventCategory = (event) => {
        const title = event.proposal?.title?.toLowerCase() || "";
        const description = event.proposal?.description?.toLowerCase() || "";

        if (title.includes("sports") || description.includes("sports") || title.includes("game")) return t('sports');
        if (title.includes("cultural") || description.includes("cultural") || title.includes("fiesta")) return t('cultural');
        if (title.includes("meeting") || description.includes("meeting") || title.includes("seminar")) return t('meeting');
        if (title.includes("festival") || description.includes("festival")) return t('festival');
        if (title.includes("clean") || description.includes("clean")) return t('communityService');
        if (title.includes("training") || description.includes("training")) return t('training');
        return t('communityEvent');
    };

    const getCategoryColor = (category) => {
        const baseCategory = category.toLowerCase();
        if (baseCategory.includes(t('sports').toLowerCase())) return "bg-blue-500";
        if (baseCategory.includes(t('cultural').toLowerCase())) return "bg-purple-500";
        if (baseCategory.includes(t('meeting').toLowerCase())) return "bg-yellow-500";
        if (baseCategory.includes(t('festival').toLowerCase())) return "bg-pink-500";
        if (baseCategory.includes(t('communityService').toLowerCase())) return "bg-green-500";
        if (baseCategory.includes(t('training').toLowerCase())) return "bg-indigo-500";
        return "bg-red-500";
    };

    const getEventLocation = (event) => event.proposal?.location || t('navalBiliran');

    // Get 4 latest events based on eventDate
    const getLatestEvents = () => {
        if (!isEventUpcoming || isEventUpcoming.length === 0) return [];
        
        // Sort events by eventDate in descending order (newest first)
        const sortedEvents = [...isEventUpcoming].sort((a, b) => {
            const dateA = a.eventDate ? new Date(a.eventDate) : new Date(0);
            const dateB = b.eventDate ? new Date(b.eventDate) : new Date(0);
            return dateB - dateA;
        });
        
        // Return only the first 4 events
        return sortedEvents.slice(0, 4);
    };

    const latestEvents = getLatestEvents();

    const handleEventClick = (event, index) => {
        setShowModal(true);
        handleEventSelect(event);
        const eventTitle = event.proposal?.title || t('untitledEvent');
        accessibility.speakText(`${t('registerForEvent')}: ${eventTitle}`);
    };

    return (
        <motion.section
            ref={eventsRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
            className="relative w-full bg-white py-8 sm:py-12"
            aria-labelledby="latest-events-heading"
        >
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    variants={fadeIn}
                    className="mb-6 text-center sm:mb-8"
                >
                    <h2 
                        id="latest-events-heading"
                        className="mb-3 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-3xl font-bold uppercase tracking-wide text-transparent sm:text-4xl"
                        onFocus={() => accessibility.speakText(t('latestEvents'))}
                    >
                        {t('latestEvents')}
                    </h2>

                    <p className="mx-auto max-w-lg text-sm text-gray-600 sm:text-base">
                        {t('stayUpdated')}
                    </p>
                    <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-pink-500" />
                </motion.div>

                {/* Event List */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    {latestEvents.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {latestEvents.map((event, index) => {
                                const category = getEventCategory(event);
                                const categoryColor = getCategoryColor(category);
                                const eventLocation = getEventLocation(event);
                                const eventTitle = event.proposal?.title || t('untitledEvent');
                                const eventDescription = event.proposal?.description || t('noDescription');

                                return (
                                    <motion.div
                                        key={index}
                                        variants={fadeIn}
                                        className="group cursor-pointer transition-all duration-200 hover:bg-gray-50"
                                        onClick={() => handleEventClick(event, index)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleEventClick(event, index);
                                            }
                                        }}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`${eventTitle}. ${t('eventCategory')}: ${category}. ${t('eventDate')}: ${formatEventDate(event.eventDate)}. ${t('clickToRegister')}`}
                                    >
                                        <div className="p-4 sm:p-5">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                                                {/* Image */}
                                                <div className="h-24 w-full flex-shrink-0 overflow-hidden rounded-lg shadow-sm sm:w-40">
                                                    <img
                                                        src={heroBG4}
                                                        alt={`${eventTitle} - ${category}`}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                                            <span 
                                                                className={`rounded-full px-2 py-0.5 text-white ${categoryColor}`}
                                                                aria-label={`${t('eventCategory')}: ${category}`}
                                                            >
                                                                {category}
                                                            </span>
                                                            <div 
                                                                className="flex items-center gap-1 text-gray-500"
                                                                aria-label={`${t('eventDate')}: ${formatEventDate(event.eventDate)}`}
                                                            >
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                <span>{formatEventDate(event.eventDate)}</span>
                                                            </div>
                                                            {event.eventDate && (
                                                                <div 
                                                                    className="flex items-center gap-1 text-gray-500"
                                                                    aria-label={`${t('eventTime')}: ${formatEventTime(event.eventDate)}`}
                                                                >
                                                                    <Clock className="h-3.5 w-3.5" />
                                                                    <span>{formatEventTime(event.eventDate)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div 
                                                            className="flex items-center gap-1 text-xs text-gray-400"
                                                            aria-label={t('public')}
                                                        >
                                                            <Users className="h-3.5 w-3.5" />
                                                            <span>{t('public')}</span>
                                                        </div>
                                                    </div>

                                                    <h3 
                                                        className="mb-1 text-lg font-semibold text-gray-800 transition-colors group-hover:text-red-600 sm:text-xl"
                                                        onFocus={() => accessibility.speakText(eventTitle)}
                                                    >
                                                        {eventTitle}
                                                    </h3>

                                                    <p 
                                                        className="mb-2 line-clamp-2 text-sm leading-snug text-gray-600"
                                                        aria-label={`${t('eventDescription')}: ${eventDescription}`}
                                                    >
                                                        {eventDescription}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                        <div 
                                                            className="flex items-center gap-1"
                                                            aria-label={`${t('eventLocation')}: ${eventLocation}`}
                                                        >
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            <span>{eventLocation}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-3.5 w-3.5" />
                                                            <span>{t('openToPublic')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{t('duration')}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 flex items-center justify-between">
                                                        <button 
                                                            className="flex items-center gap-1 text-xs font-medium text-red-600 transition-all hover:text-red-700 group-hover:gap-2"
                                                            onFocus={() => accessibility.speakText(t('registerEvent'))}
                                                        >
                                                            {t('registerEvent')}
                                                            <motion.span
                                                                animate={accessibility.reducedMotion ? {} : { x: [0, 5, 0] }}
                                                                transition={accessibility.reducedMotion ? {} : { duration: 1, repeat: Infinity }}
                                                            >
                                                                <ChevronRight className="h-3.5 w-3.5" />
                                                            </motion.span>
                                                        </button>
                                                        <span 
                                                            className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-400"
                                                            aria-label={`Event number ${index + 1}`}
                                                        >
                                                            #{index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div
                            variants={fadeIn}
                            className="py-12 text-center"
                            aria-live="polite"
                        >
                            <div className="mx-auto max-w-md">
                                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-pink-100">
                                    <Calendar className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 
                                    className="mb-1 text-sm font-semibold text-gray-600 sm:text-base"
                                    onFocus={() => accessibility.speakText(t('noUpcomingEvents'))}
                                >
                                    {t('noUpcomingEvents')}
                                </h3>
                                <p className="text-xs text-gray-500">{t('checkBackLater')}</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.section>
    );
};

export default LatestEvents;