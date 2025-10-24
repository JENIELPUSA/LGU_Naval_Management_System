import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-r from-blue-900 to-pink-900 text-white"
        >
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4 flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-pink-500">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold">LGU Events</span>
                        </div>
                        <p className="mb-6 max-w-md text-gray-300">
                            The leading platform for digital transformation of Local Government Units in the Philippines.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Services</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <a href="#" className="transition-colors hover:text-white">
                                    Event Planning
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-white">
                                    Attendee Management
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-white">
                                    Analytics & Reports
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-white">
                                    Technical Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-blue-700 pt-8 text-center text-gray-300">
                    <p>&copy; 2025 LGU Event Management System. All rights reserved.</p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;