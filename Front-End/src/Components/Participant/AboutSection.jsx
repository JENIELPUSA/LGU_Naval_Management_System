import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
    visible: { transition: { staggerChildren: 0.2 } },
};

const AboutSection = ({ aboutRef }) => {
    return (
        <motion.section
            ref={aboutRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            className="mb-20"
        >
            <div className="mx-auto max-w-7xl sm:px-6">
                <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
                    <div className="py-12 md:px-16 md:py-20">
                        <motion.div variants={fadeIn} className="mb-12 text-center">
                            <h2 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">About Us</h2>
                            <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-500 to-pink-500"></div>
                        </motion.div>

                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                            <motion.div variants={fadeIn} className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-800">LGU Event Management System</h3>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    The Local Government Unit (LGU) of Naval, Biliran continuously promotes innovative ways to enhance public
                                    service and get closer to every citizen. As part of this initiative, the Event Management System was
                                    developed — a digital platform that serves as the center of information and management for all official
                                    activities and events of the town.
                                </p>

                                <h4 className="text-xl font-semibold text-gray-800">The objectives of this system are to:</h4>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <div className="mr-3 mt-1 flex-shrink-0 text-blue-500">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span>
                                            Enhance coordination between LGU departments and organizations in planning and conducting events.
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-3 mt-1 flex-shrink-0 text-blue-500">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span>
                                            Provide easier access to information for the public regarding programs, fiestas, cultural events,
                                            youth and sports activities, and other community gatherings.
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-3 mt-1 flex-shrink-0 text-blue-500">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span>
                                            Ensure transparency and efficiency in the use of government funds and resources in every activity.
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-3 mt-1 flex-shrink-0 text-blue-500">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span>
                                            Encourage resident participation to strengthen the relationship between the government and the
                                            citizens.
                                        </span>
                                    </li>
                                </ul>

                                <p className="text-lg leading-relaxed text-gray-600">
                                    Through the LGU Event Management System, event planning and execution become more organized, fast, and
                                    systematic. It also reflects the commitment of the Naval Local Government to continuously deliver
                                    responsible governance, inclusive development, and innovative solutions for the welfare of the entire
                                    community.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeIn} className="space-y-8">
                                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 p-8 shadow-inner">
                                    <div className="mb-6 flex items-center justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-pink-500">
                                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="mb-4 text-center text-2xl font-bold text-gray-800">Vision</h3>
                                    <p className="text-center text-gray-600">
                                        In 2032, we envision the Province of Biliran anchored on sustainable agriculture and tourism
                                        industries in Eastern Visayas, with God-loving, healthy, educated, and empowered citizens living in a
                                        peaceful, resilient, and progressive economy within a technologically competent and ecologically
                                        balanced community, united in a proactive, responsive, transparent, and participative governance.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 p-8 shadow-inner">
                                    <div className="mb-6 flex items-center justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-pink-500">
                                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="mb-4 text-center text-2xl font-bold text-gray-800">Mission</h3>
                                    <p className="text-center text-gray-600">
                                        To empower Biliranons through the provision of social services and economic opportunities.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default AboutSection;