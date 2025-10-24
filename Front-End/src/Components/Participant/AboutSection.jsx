import React from "react";
import { motion } from "framer-motion";
import { Target, Zap, Users, Heart, Shield, Globe } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const AboutSection = ({ aboutRef }) => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Focused",
      description: "Bringing citizens closer through accessible event management",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Efficient Planning",
      description: "Streamlined coordination between departments and organizations",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Transparent Process",
      description: "Clear accountability in government resources and funds",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Digital Innovation",
      description: "Modern solutions for community engagement and participation",
    },
  ];

  return (
    <motion.section
      ref={aboutRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerChildren}
      className="relative overflow-hidden bg-gradient-to-br py-16 md:py-20 min-h-screen"
    >
      {/* Background shapes */}


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <motion.div variants={fadeIn} className="text-center mb-14 md:mb-5">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-white bg-clip-text text-transparent">
            About Our Mission
          </h2>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Connecting the community through innovative event management solutions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden">
          <div className="py-10 md:py-16 px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Content */}
              <motion.div variants={fadeIn} className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-6">
                    LGU Event Management System
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-600">
                    The Local Government Unit (LGU) of Naval, Biliran continuously promotes
                    innovative ways to enhance public service and get closer to every citizen.
                    As part of this initiative, the Event Management System was developed — a
                    digital platform that serves as the center of information and management
                    for all official activities and events of the town.
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={scaleIn}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl p-4 border border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Objectives */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Our Objectives</h4>
                  <ul className="space-y-4">
                    {[
                      "Enhance coordination between LGU departments and organizations in planning and conducting events.",
                      "Provide easier access to information for the public regarding programs, fiestas, cultural events, youth and sports activities, and other community gatherings.",
                      "Ensure transparency and efficiency in the use of government funds and resources in every activity.",
                      "Encourage resident participation to strengthen the relationship between the government and the citizens.",
                    ].map((objective, index) => (
                      <motion.li key={index} variants={fadeIn} className="flex items-start group">
                        <div className="mr-4 mt-1 flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <span className="text-gray-600 group-hover:text-gray-700 transition-colors">
                          {objective}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.p
                  variants={fadeIn}
                  className="text-lg leading-relaxed text-gray-600 bg-blue-50/50 rounded-2xl p-6 border border-blue-100"
                >
                  Through the LGU Event Management System, event planning and execution become
                  more organized, fast, and systematic. It also reflects the commitment of the
                  Naval Local Government to continuously deliver responsible governance,
                  inclusive development, and innovative solutions for the welfare of the entire
                  community.
                </motion.p>
              </motion.div>

              {/* Right Content */}
              <motion.div variants={staggerChildren} className="space-y-8">
                {/* Vision */}
                <motion.div
                  variants={scaleIn}
                  className="rounded-2xl bg-gradient-to-br from-blue-500 to-pink-500 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="mb-6 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="mb-4 text-center text-2xl font-bold">Our Vision</h3>
                  <p className="text-center text-blue-50 leading-relaxed text-base md:text-lg">
                    In 2032, we envision the Province of Biliran anchored on sustainable
                    agriculture and tourism industries in Eastern Visayas, with God-loving,
                    healthy, educated, and empowered citizens living in a peaceful, resilient,
                    and progressive economy within a technologically competent and ecologically
                    balanced community.
                  </p>
                </motion.div>

                {/* Mission */}
                <motion.div
                  variants={scaleIn}
                  className="rounded-2xl bg-gradient-to-br from-pink-500 to-blue-500 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="mb-6 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="mb-4 text-center text-2xl font-bold">Our Mission</h3>
                  <p className="text-center text-blue-50 leading-relaxed text-lg font-medium">
                    To empower Biliranons through the provision of social services and economic
                    opportunities.
                  </p>
                </motion.div>

                {/* Values */}
                <motion.div
                  variants={scaleIn}
                  className="rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 p-6 border border-gray-200 shadow-lg"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">Our Commitment</h4>
                      <p className="text-gray-600">Serving with integrity and innovation</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                      <div className="text-2xl font-bold text-blue-600">100%</div>
                      <div className="text-gray-600">Transparency</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                      <div className="text-2xl font-bold text-pink-600">24/7</div>
                      <div className="text-gray-600">Accessibility</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
