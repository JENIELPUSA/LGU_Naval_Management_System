import React, { useRef, useState, useContext } from "react";
import { EventDisplayContext } from "../../contexts/EventContext/EventContext";
import NavHeader from "./NavHeader";
import HeroSection from "./HeroSection";
import EventDocumentation from "./EventDocumentation";
import LatestEvents from "./LatestEvents";
import AboutSection from "./AboutSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import RegistrationModal from "./RegistrationModal";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";
import LoadingOverlay from "../../ReusableFolder/LoadingOverlay";

const ParticipantDashboard = () => {
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

    const eventsRef = useRef(null);
    const servicesRef = useRef(null);
    const aboutRef = useRef(null);

    const scrollToSection = (ref) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true); // ✅ Start loading
            await AddParticipant(formData);
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
        } catch (error) {
            console.error("Error adding participant:", error);
        } finally {
            setIsLoading(false); // ✅ Stop loading
        }
    };

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setFormData((prev) => ({ ...prev, eventId: event._id }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-blue-100 font-sans antialiased relative">
            {/* Loading overlay */}
            {isLoading && <LoadingOverlay />}

            <NavHeader
                scrollToSection={scrollToSection}
                eventsRef={eventsRef}
                servicesRef={servicesRef}
                aboutRef={aboutRef}
            />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <HeroSection setShowModal={setShowModal} showModal={showModal} />
                <EventDocumentation />
                <LatestEvents
                    eventsRef={eventsRef}
                    isEventUpcoming={isEventUpcoming}
                    setShowModal={setShowModal}
                    handleEventSelect={handleEventSelect}
                />
                <AboutSection aboutRef={aboutRef} />
                <FeaturesSection servicesRef={servicesRef} />
            </main>

            <Footer />

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
            />
        </div>
    );
};

export default ParticipantDashboard;
