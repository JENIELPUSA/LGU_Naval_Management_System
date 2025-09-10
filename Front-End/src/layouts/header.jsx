import { useTheme } from "@/hooks/use-theme";
import React, { useContext, useMemo, useState, useEffect } from "react";
import { Moon, Sun, Calendar, Clock } from "lucide-react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { EventDisplayContext } from "../contexts/EventContext/EventContext";

export const Header = ({ collapsed, setCollapsed }) => {
    const { isEvent } = useContext(EventDisplayContext);
    const { theme, setTheme } = useTheme();

    // Helper: combine eventDate + startTime
    const getEventDateTime = (event) => {
        const eventDate = new Date(event.eventDate);

        if (event.startTime) {
            const [time, modifier] = event.startTime.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            eventDate.setHours(hours, minutes, 0, 0);
        }
        return eventDate;
    };

    // Find the next upcoming event
    const nextEvent = useMemo(() => {
        if (!isEvent || isEvent.length === 0) return null;

        const now = new Date();
        const upcomingEvents = isEvent.filter((event) => getEventDateTime(event) >= now);

        if (upcomingEvents.length === 0) return null;

        return upcomingEvents.sort((a, b) => getEventDateTime(a) - getEventDateTime(b))[0];
    }, [isEvent]);

    // Countdown state
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [isExpired, setIsExpired] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false); // default false

    useEffect(() => {
        const isFirstLogin = !localStorage.getItem("firstLoginShown");
        if (isFirstLogin) {
            setShowOverlay(true);
            localStorage.setItem("firstLoginShown", "true");
        }
    }, []);

    useEffect(() => {
        if (nextEvent && showOverlay) {
            const timer = setTimeout(() => setShowOverlay(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [nextEvent, showOverlay]);

    useEffect(() => {
        if (!nextEvent) return;

        const target = getEventDateTime(nextEvent).getTime();

        const updateCountdown = () => {
            const now = Date.now();
            const distance = target - now;

            if (distance <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsExpired(true);
                return;
            }

            setIsExpired(false);
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [nextEvent]);

    // Hide overlay after 3 seconds
    useEffect(() => {
        if (nextEvent) {
            const timer = setTimeout(() => setShowOverlay(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [nextEvent]);

    return (
        <>
            {/* Overlay sa gitna */}
            <AnimatePresence>
                {showOverlay && nextEvent && (
                    <motion.div
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Shared motion box */}
                        <motion.div
                            layoutId="countdown-box"
                            className="rounded-xl bg-white/90 px-6 py-4 shadow-lg dark:bg-gray-900 dark:text-white"
                        >
                            <p className="text-center text-lg font-bold">{nextEvent.proposal?.title || nextEvent.title}</p>
                            <div className="mt-2 flex items-center justify-center gap-2 font-mono text-lg">
                                <Clock size={16} />
                                <span>
                                    {timeLeft.days > 0 && `${timeLeft.days}d `}
                                    {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
                                    {String(timeLeft.seconds).padStart(2, "0")}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navbar */}
            <header className="relative z-10 flex h-[70px] items-center justify-between px-4 shadow-lg [background:linear-gradient(90deg,#FF9EED_0%,#89C6F9_100%)] dark:[background:linear-gradient(90deg,#C00070_0%,#0040A0_100%)]">
                <div className="flex items-center gap-x-4">
                    {/* Hamburger Menu */}
                    <motion.button
                        className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                        onClick={() => setCollapsed(!collapsed)}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle navigation"
                    >
                        <div className="relative h-6 w-6">
                            <span className="absolute top-2 block h-0.5 w-5 rounded-full bg-slate-800 dark:bg-slate-100"></span>
                            <span className="absolute top-3 block h-0.5 w-5 rounded-full bg-slate-800 dark:bg-slate-100"></span>
                            <span className="absolute top-4 block h-0.5 w-5 rounded-full bg-slate-800 dark:bg-slate-100"></span>
                        </div>
                    </motion.button>

                    {/* Countdown in navbar (same layoutId for smooth morph) */}
                    {!showOverlay && nextEvent && (
                        <motion.div
                            layoutId="countdown-box"
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-3 py-1 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        >
                            <Calendar size={16} />
                            <span className="font-semibold">{nextEvent.proposal?.title || nextEvent.title}</span>
                            <span className="font-mono text-sm">
                                {timeLeft.days > 0 && `${timeLeft.days}d `}
                                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
                                {String(timeLeft.seconds).padStart(2, "0")}
                            </span>
                        </motion.div>
                    )}
                </div>

                <div className="flex items-center gap-x-3">
                    {/* Dark Mode Toggle */}
                    <motion.button
                        className="relative flex h-7 w-14 items-center rounded-full p-1"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        whileTap={{ scale: 0.95 }}
                        initial={false}
                    >
                        <div
                            className={`absolute inset-0 rounded-full shadow-inner transition-all duration-500 ${
                                theme === "light" ? "bg-gradient-to-r from-pink-300 to-blue-300" : "bg-gradient-to-r from-purple-800 to-blue-900"
                            }`}
                        />
                        <motion.div
                            className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-lg"
                            animate={theme === "dark" ? { x: 28 } : { x: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {theme === "light" ? (
                                <Sun
                                    size={14}
                                    className="text-yellow-500"
                                />
                            ) : (
                                <Moon
                                    size={14}
                                    className="text-blue-300"
                                />
                            )}
                        </motion.div>
                    </motion.button>
                </div>
            </header>
        </>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
