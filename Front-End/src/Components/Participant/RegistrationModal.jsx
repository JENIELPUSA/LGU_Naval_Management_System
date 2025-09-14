import React from "react";
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
}) => {
    const formatEventDate = (dateString) => {
        if (!dateString) return "TBA";
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

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
                        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white"
                        variants={modalVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedEvent ? "Register for Event" : "Choose an Event"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedEvent(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg
                                        className="h-6 w-6"
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
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {Array.isArray(isEventUpcoming) && isEventUpcoming.length > 0 ? (
                                        isEventUpcoming.map((event, index) => (
                                            <motion.div
                                                key={event.id}
                                                className="cursor-pointer rounded-xl border p-4 transition-shadow hover:shadow-md"
                                                onClick={() => handleEventSelect(event)}
                                                variants={eventCardVariant}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className="flex items-start space-x-4">
                                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-pink-100">
                                                        <svg
                                                            className="h-8 w-8 text-blue-600"
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
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{event.proposal?.title}</h3>
                                                        <p className="mt-1 text-sm text-gray-600">{formatEventDate(event.eventDate)}</p>
                                                        <p className="mt-2 line-clamp-2 text-xs text-gray-500">{event.proposal?.description}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 text-center text-gray-500 py-10">
                                            No upcoming events.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="mb-6 rounded-xl bg-blue-50 p-4">
                                        <h3 className="font-semibold text-blue-800">{selectedEvent.proposal.title}</h3>
                                        <p className="text-sm text-blue-600">{formatEventDate(selectedEvent.eventDate)}</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="flex justify-between pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedEvent(null)}
                                                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
                                            >
                                                Back to Events
                                            </button>
                                            <button
                                                type="submit"
                                                className="rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 px-6 py-2 text-white transition-all hover:from-blue-700 hover:to-pink-700"
                                            >
                                                Complete Registration
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RegistrationModal;
