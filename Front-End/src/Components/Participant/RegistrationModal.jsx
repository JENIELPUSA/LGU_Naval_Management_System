import React, { useEffect } from "react";
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
}) => {
  const formatEventDate = (dateString) => {
    if (!dateString) return "TBA";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // ✅ Auto-close modal when registration is successful
  useEffect(() => {
    if (registrationSuccess) {
      // Optional: Add a short delay (e.g., 1000ms) so user sees feedback if you later add a success message
      const timer = setTimeout(() => {
        setShowModal(false);
        setSelectedEvent(null);
        onResetRegistration(); // Reset success state in parent
      }, 1000); // Remove or set to 0 for instant close

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, setShowModal, setSelectedEvent, onResetRegistration]);

  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariant = {
    hidden: { y: "-50px", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 300 } },
    exit: { y: "-50px", opacity: 0, transition: { duration: 0.2 } },
  };

  const eventCardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm"
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-5">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-gray-800">
                  {selectedEvent ? "Register for Event" : "Choose an Event"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedEvent(null);
                    if (registrationSuccess) onResetRegistration();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Event Picker */}
              {!selectedEvent ? (
                <div className="space-y-3">
                  {Array.isArray(isEventUpcoming) && isEventUpcoming.length > 0 ? (
                    isEventUpcoming.map((event, index) => (
                      <motion.div
                        key={event._id}
                        className="cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:shadow-lg hover:border-blue-300"
                        onClick={() => handleEventSelect(event)}
                        variants={eventCardVariant}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-pink-100">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-sm">{event.proposal?.title}</h3>
                            <p className="mt-0.5 text-xs text-gray-600">{formatEventDate(event.eventDate)}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{event.proposal?.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No upcoming events available.
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Event Info - Compact */}
                  <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-pink-50 p-3 border border-blue-100">
                    <h3 className="font-semibold text-blue-900 text-sm">{selectedEvent.proposal?.title}</h3>
                    <p className="text-xs text-blue-600 mt-0.5">{formatEventDate(selectedEvent.eventDate)}</p>
                  </div>

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
                        required
                      ></textarea>
                    </div>

                    <div className="flex flex-col gap-2 pt-3 border-t">
                      <button
                        type="submit"
                        className="w-full rounded-md bg-gradient-to-r from-blue-600 to-pink-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-pink-700 shadow-sm"
                      >
                        Complete Registration
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(null)}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Back to Events
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;