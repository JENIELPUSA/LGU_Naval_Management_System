import React from "react";
import { motion } from "framer-motion";
import tsinelasPartyImage from "../../assets/Tsinelast.jpg";
import fiestaImage from "../../assets/hero-image.png";
import culturalNightImage from "../../assets/sports1.jpg";

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const EventDocumentation = () => {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
                visible: { transition: { staggerChildren: 0.2 } }
            }}
            className="mb-20 rounded-3xl bg-gradient-to-br from-blue-50 to-pink-50 py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <motion.h2 variants={fadeIn} className="mb-14 text-center text-4xl font-bold text-gray-800">
                    LGU Event Documentation – Naval, Biliran
                </motion.h2>

                {/* Event Card */}
                <motion.div variants={fadeIn} className="mb-12 transform overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="grid gap-0 md:grid-cols-2">
                        <div className="overflow-hidden">
                            <img
                                src={tsinelasPartyImage}
                                alt="Tsinelas Party in Naval Biliran"
                                className="h-[350px] w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col justify-center p-8">
                            <h3 className="mb-4 text-2xl font-semibold text-indigo-700">Tsinelas Party in Naval, Biliran</h3>
                            <p className="mb-6 leading-relaxed text-gray-600">
                                The <strong className="text-blue-600">Tsinelas Party</strong> is one of the vibrant and joyful gatherings in
                                Naval, Biliran. It features dancing, food, and various games that symbolize the unity and joy of the
                                community.
                            </p>
                            <div className="relative overflow-hidden rounded-lg pt-[56.25%] shadow-md">
                                <iframe
                                    className="absolute left-0 top-0 h-full w-full"
                                    src="https://www.youtube.com/embed/qqfz5DgYSR0"
                                    title="Tsinelas Party Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Fiesta Card */}
                <motion.div variants={fadeIn} className="mb-12 transform overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="grid gap-0 md:grid-cols-2">
                        <div className="order-2 flex flex-col justify-center p-8 md:order-1">
                            <h3 className="mb-4 text-2xl font-semibold text-indigo-700">Fiesta Celebration</h3>
                            <p className="mb-6 leading-relaxed text-gray-600">
                                The <strong className="text-blue-600">Fiesta</strong> is a major celebration in every town and barangay in
                                Biliran. It features street dancing, parades, mass, and various community gatherings.
                            </p>
                            <div className="relative overflow-hidden rounded-lg pt-[56.25%] shadow-md">
                                <iframe
                                    className="absolute left-0 top-0 h-full w-full"
                                    src="https://www.youtube.com/embed/GRqM0FvzZTc"
                                    title="Fiesta Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                        <div className="order-1 overflow-hidden md:order-2">
                            <img
                                src={fiestaImage}
                                alt="Fiesta Celebration"
                                className="h-[350px] w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Cultural Events */}
                <motion.div variants={fadeIn} className="transform overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="grid gap-0 md:grid-cols-2">
                        <div className="overflow-hidden">
                            <img
                                src={culturalNightImage}
                                alt="Cultural Night"
                                className="h-[350px] w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col justify-center p-8">
                            <h3 className="mb-4 text-2xl font-semibold text-indigo-700">Cultural & Sports Events</h3>
                            <p className="mb-6 leading-relaxed text-gray-600">
                                Included in the programs offered by the LGU Naval are{" "}
                                <strong className="text-blue-600">cultural shows and sports activities</strong> such as drum & lyre
                                competitions, basketball tournaments, and cultural night.
                            </p>
                            <div className="relative overflow-hidden rounded-lg pt-[56.25%] shadow-md">
                                <iframe
                                    className="absolute left-0 top-0 h-full w-full"
                                    src="https://www.youtube.com/embed/tmHi8JUdROM"
                                    title="Cultural & Sports Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default EventDocumentation;