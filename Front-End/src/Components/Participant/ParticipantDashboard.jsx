import React, { useState, useContext, useEffect } from "react";
import { EventDisplayContext } from "../../contexts/EventContext/EventContext";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";
import LoadingOverlay from "../../ReusableFolder/LoadingOverlay";
import FeedBack from "../../Components/Participant/userFeedBack";
import { ArrowUp, Map, MessageCircle } from "lucide-react";
import TravelBanner from "./TravelBanner";
import FirstModal from "./FirstModal";
import Banner from "./Banner";
import ThresholdSection from "./ThreeSectionContainer";
import AboutSection from "./AboutSection";
import RegistrationModal from "./RegistrationModal";
import Contact from "./ContactUs";

const ParticipantDashboard = ({
    heroRef,
    eventsRef,
    feedbacRef,
    documentationRef,
    aboutRef,
    onHomeClick,
    activeSection,
}) => {
    const { AddParticipant, isLoading, setIsLoading } = useContext(ParticipantDisplayContext);
    const { isEventUpcoming } = useContext(EventDisplayContext);

    const [showModal, setShowModal] = useState(false);
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

    // Scroll progress + floating button
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollProgress(scrolled);
            setShowUpButton(scrollTop > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await AddParticipant(formData);
            setRegistrationSuccess({
                participant: response.data.participant,
                pdfBase64: response.data.pdfBase64,
            });
        } catch (error) {
            console.error("Error adding participant:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setFormData((prev) => ({
            ...prev,
            eventId: event._id,
            eventTitle: event.proposal?.title || "",
        }));
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-white font-sans antialiased">
            {isLoading && <LoadingOverlay />}

            {/* Scroll Progress Bar */}
            <div
                className="fixed left-0 top-0 z-[9999] h-[5px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.6)] transition-all duration-100"
                style={{ width: `${scrollProgress}%` }}
            />

            {/* Main Content - WALANG NAVIGATION BUTTONS SA ITAAS */}
            <div className="relative z-10">
                <main className="relative">
                    {/* Home Section - Banner and FirstModal (only shown when activeSection is "home") */}
                    {activeSection === "home" && (
                        <section ref={heroRef}>
                            <Banner />
                            <div
                                className="relative"
                                style={{ marginTop: "-90px" }}
                            >
                                <div className="max-w-8xl z-20 mx-auto px-4">
                                    <FirstModal />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* TravelBanner Section - Conditional */}
                    {activeSection === "travel" && (
                        <section className="flex min-h-screen items-center justify-center">
                            <TravelBanner />
                        </section>
                    )}

                    {/* Events Section - Conditional */}
                    {activeSection === "events" && (
                        <section
                            ref={eventsRef}
                            className="flex min-h-screen items-center justify-center"
                        >
                            <ThresholdSection
                                isEventUpcoming={isEventUpcoming}
                                setShowModal={setShowModal}
                                handleEventSelect={handleEventSelect}
                            />
                        </section>
                    )}

                    {/* Feedback Section - Conditional */}
                    {activeSection === "feedback" && (
                        <section
                            ref={feedbacRef}
                            className="min-h-screen"
                        >
                            <Contact />
                        </section>
                    )}

                    {/* About Section - Conditional */}
                    {activeSection === "about" && (
                        <section
                            ref={aboutRef}
                            className="min-h-screen"
                        >
                            <AboutSection />
                        </section>
                    )}

                    {/* Documentation Section - Conditional */}
                    {activeSection === "documentation" && (
                        <section
                            ref={documentationRef}
                            className="flex min-h-screen items-center justify-center bg-gray-50"
                        >
                            <div className="container mx-auto px-4 py-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-gray-800">Documentation</h2>
                                <p className="text-gray-600">Documentation content will be displayed here.</p>
                            </div>
                        </section>
                    )}

                    {/* Registration Modal */}
                    <RegistrationModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        selectedEvent={selectedEvent}
                        setSelectedEvent={setSelectedEvent}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        handleEventSelect={handleEventSelect}
                        isEventUpcoming={isEventUpcoming}
                        registrationSuccess={registrationSuccess}
                    />
                </main>
            </div>
            {/* Scroll to Top Button */}
            {showUpButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-[10000] rounded-xl border border-white/10 bg-black/40 p-3 text-white shadow-xl backdrop-blur-lg transition-all duration-300 hover:bg-black/60 hover:text-blue-400"
                    aria-label="Scroll to Top"
                >
                    <ArrowUp size={22} />
                </button>
            )}
        </div>
    );
};

export default ParticipantDashboard;
