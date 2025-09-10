import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
    visible: { transition: { staggerChildren: 0.2 } },
};

const FeaturesSection = ({ servicesRef }) => {
    return (
        <motion.section
            ref={servicesRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="mb-20"
        >
            <div className="mb-16 text-center">
                <motion.h2
                    variants={fadeIn}
                    className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl"
                >
                    Featured Services
                </motion.h2>
                <motion.p
                    variants={fadeIn}
                    className="mx-auto max-w-2xl text-xl text-gray-600"
                >
                    Everything you need for a successful event is here
                </motion.p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <motion.div
                    variants={fadeIn}
                    className="group transform rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-pink-500 transition-transform group-hover:scale-110">
                        <svg
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-800">Manage Team</h3>
                    <p className="leading-relaxed text-gray-600">
                        Efficiently organize, assign, and monitor team members to ensure smooth collaboration and project success.
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    className="group transform rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-pink-500 transition-transform group-hover:scale-110">
                        <svg
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-800">Digital Attendee Management</h3>
                    <p className="leading-relaxed text-gray-600">
                        Real-time attendee tracking, automated invitations, and QR code-based check-in system.
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    className="group transform rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-pink-500 transition-transform group-hover:scale-110">
                        <svg
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-800">Advanced Analytics</h3>
                    <p className="leading-relaxed text-gray-600">
                        Comprehensive reports, data visualization, and predictive insights for more successful events.
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default FeaturesSection;
