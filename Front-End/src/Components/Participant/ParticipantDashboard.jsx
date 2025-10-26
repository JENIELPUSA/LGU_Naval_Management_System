import React, { useRef, useState, useContext, useEffect } from "react";
import { EventDisplayContext } from "../../contexts/EventContext/EventContext";
import NavHeader from "./NavHeader";
import HeroSection from "./HeroSection";
import EventDocumentation from "./EventDocumentation";
import LatestEvents from "./LatestEvents";
import AboutSection from "./AboutSection";
import Footer from "./Footer";
import RegistrationModal from "./RegistrationModal";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";
import LoadingOverlay from "../../ReusableFolder/LoadingOverlay";
import fiestaImage from "../../assets/hero-image.png";
import FeedBack from "../../Components/Participant/userFeedBack";
import VenueMap from "../Venue/VenueMap";
import { ArrowUp } from "lucide-react"; // npm install lucide-react

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
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showUpButton, setShowUpButton] = useState(false);

  const heroRef = useRef(null);
  const eventsRef = useRef(null);
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const feedbacRef = useRef(null);
  const documentationRef = useRef(null);
  const mapRefLocate = useRef(null);

  // Scroll progress + floating button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollProgress(scrolled);
      setShowUpButton(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always scroll to Hero Section (top) on refresh
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const resetRegistrationFlow = () => {
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
  };

  return (
    <div
      className="relative min-h-screen font-sans antialiased"
      style={{
        backgroundImage: `url(${fiestaImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isLoading && <LoadingOverlay />}

      {/* Gradient Scroll Progress Bar */}
      <div
        className="fixed left-0 top-0 z-[9999] h-[5px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.6)] transition-all duration-100"
        style={{
          width: `${scrollProgress}%`,
        }}
      ></div>

      <NavHeader
        scrollToSection={scrollToSection}
        eventsRef={eventsRef}
        servicesRef={servicesRef}
        aboutRef={aboutRef}
        feedbacRef={feedbacRef}
        documentationRef={documentationRef}
      />

      <main className="mx-auto">
        <div ref={heroRef}>
          <HeroSection setShowModal={setShowModal} showModal={showModal} />
        </div>

        <EventDocumentation documentationRef={documentationRef} />

        <LatestEvents
          eventsRef={eventsRef}
          isEventUpcoming={isEventUpcoming}
          setShowModal={setShowModal}
          handleEventSelect={handleEventSelect}
        />

        <FeedBack feedbackRef={feedbacRef} />

        <AboutSection aboutRef={aboutRef} />

        <VenueMap isEventUpcoming={isEventUpcoming} mapRefLocate={mapRefLocate} />
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
        registrationSuccess={registrationSuccess}
        onResetRegistration={resetRegistrationFlow}
      />

      {/*Floating Scroll-to-Top Button */}
      {showUpButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[10000] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.6)] p-3 text-white transition-all duration-300 hover:scale-110"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default ParticipantDashboard;
