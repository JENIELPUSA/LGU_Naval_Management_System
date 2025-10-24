import React, { useRef, useState, useContext } from "react";
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
import FeedBack from "../../Components/Participant/userFeedBack"

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
      setIsLoading(true);
      const response = await AddParticipant(formData);

      setRegistrationSuccess({
        participant: response.data.participant,
        pdfBase64: response.data.pdfBase64,
      });
    } catch (error) {
      console.error("Error adding participant:", error);
      // Optional: show error toast
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
      className="min-h-screen font-sans antialiased relative"
      style={{
        backgroundImage: `url(${fiestaImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isLoading && <LoadingOverlay />}

      <NavHeader
        scrollToSection={scrollToSection}
        eventsRef={eventsRef}
        servicesRef={servicesRef}
        aboutRef={aboutRef}
      />

      <main className="mx-auto">
        <HeroSection setShowModal={setShowModal} showModal={showModal} />
        <EventDocumentation />
        <LatestEvents
          eventsRef={eventsRef}
          isEventUpcoming={isEventUpcoming}
          setShowModal={setShowModal}
          handleEventSelect={handleEventSelect}
        />
        <FeedBack/>
        <AboutSection aboutRef={aboutRef} />
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
    </div>
  );
};

export default ParticipantDashboard;