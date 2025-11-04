import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "../../assets/Bannerpic.jpg";
import { useAccessibility } from "./NavHeader";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const AboutSection = ({ aboutRef }) => {
  const accessibility = useAccessibility();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile detection
  const isMobile = windowWidth < 1024;
  const isSmallMobile = windowWidth < 640;

  // Translation function for this component
  const t = (key) => {
    const translations = {
      en: {
        aboutNavalLGU: "About Naval LGU",
        theLGUInNaval: "THE LGU IN NAVAL",
        lguDescription: "The Local Government Unit (LGU) of Naval, Biliran continuously promotes innovative ways to enhance public service and get closer to every citizen. As part of this initiative, the Event Management System was developed — a digital platform that serves as the center of information and management for all official activities and events of the town.",
        vision: "VISION",
        visionDescription: "In 2032, we envision the Province of Biliran anchored on sustainable agriculture and tourism industries in Eastern Visayas, with God-loving, healthy, educated, and empowered citizens living in a peaceful, resilient, and progressive economy within a technologically competent and ecologically balanced community.",
        mission: "MISSION",
        missionDescription: "To empower Biliranons through the provision of social services and economic opportunities.",
        objective: "OBJECTIVE",
        objective1: "Strengthen public service efficiency through innovation and digital transformation.",
        objective2: "Promote transparency and accountability in all levels of governance.",
        objective3: "Enhance citizen participation and engagement in local development programs.",
        objective4: "Foster sustainable economic growth and environmental protection for future generations.",
        objectives: "Objectives"
      },
      tl: {
        aboutNavalLGU: "Tungkol sa LGU ng Naval",
        theLGUInNaval: "ANG LGU SA NAVAL",
        lguDescription: "Ang Local Government Unit (LGU) ng Naval, Biliran ay patuloy na nagpapalaganap ng mga makabagong paraan upang mapahusay ang serbisyong publiko at maging mas malapit sa bawat mamamayan. Bilang bahagi ng inisyatibang ito, ang Event Management System ay binuo — isang digital platform na nagsisilbing sentro ng impormasyon at pamamahala para sa lahat ng opisyal na aktibidad at event ng bayan.",
        vision: "MISYON",
        visionDescription: "Sa 2032, aming isinasaisip ang Lalawigan ng Biliran na nakasalalay sa sustainable na agrikultura at industriya ng turismo sa Silangang Visayas, na may mga mamamayang umiibig sa Diyos, malusog, edukado, at may kapangyarihan na naninirahan sa isang mapayapa, matatag, at progresibong ekonomiya sa loob ng isang teknolohikal na karampatan at ekolohikal na balanseng komunidad.",
        mission: "LAYUNIN",
        missionDescription: "Upang bigyan ng kapangyarihan ang mga Biliranon sa pamamagitan ng pagbibigay ng mga serbisyong panlipunan at mga oportunidad sa ekonomiya.",
        objective: "MGA LAYUNIN",
        objective1: "Palakasin ang kahusayan ng serbisyong publiko sa pamamagitan ng inobasyon at digital na pagbabago.",
        objective2: "Itaguyod ang transparency at pananagutan sa lahat ng antas ng pamamahala.",
        objective3: "Pahusayin ang pakikilahok at pakikipag-ugnayan ng mamamayan sa mga programa ng pag-unlad ng lokal.",
        objective4: "Itaguyod ang sustainable na paglago ng ekonomiya at proteksyon sa kapaligiran para sa mga susunod na henerasyon.",
        objectives: "Mga Layunin"
      }
    };
    return translations[accessibility.language]?.[key] || translations.en[key] || key;
  };

  const objectives = [
    t('objective1'),
    t('objective2'),
    t('objective3'),
    t('objective4')
  ];

  return (
    <motion.section
      ref={aboutRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerChildren}
      className="relative overflow-hidden py-8 sm:py-12 lg:py-16"
      style={{
        fontFamily: accessibility.fontType === "dyslexia" ? "'OpenDyslexic', Arial, sans-serif" : "'Bernard MT Condensed', 'Anton', Impact, sans-serif",
        letterSpacing: "0.5px",
      }}
      aria-labelledby="about-section-heading"
    >
      {/* Background Image with Lighter Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${Image})`,
        }}
        aria-hidden="true"
      >
        {/* Reduced Blur & Softer Overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-3 text-gray-800 sm:px-4 lg:px-6">
        <div className="overflow-hidden">
          <div className="px-2 py-6 sm:px-4 sm:py-8 md:px-6">
            {/* Section Heading for Screen Readers */}
            <h2 id="about-section-heading" className="sr-only">
              {t('aboutNavalLGU')}
            </h2>
            
            <div className={`grid grid-cols-1 gap-6 sm:gap-8 ${isMobile ? '' : 'lg:grid-cols-2 lg:gap-10'}`}>
              {/* LEFT COLUMN */}
              <motion.div variants={fadeIn} className="space-y-6 sm:space-y-8">
                {/* THE LGU IN NAVAL */}
                <motion.div 
                  variants={fadeIn} 
                  className="rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:rounded-2xl sm:p-6"
                  onFocus={() => accessibility.speakText(`${t('theLGUInNaval')}. ${t('lguDescription')}`)}
                  tabIndex={0}
                  role="article"
                  aria-labelledby="lgu-heading"
                >
                  <h3 
                    id="lgu-heading"
                    className={`mb-3 font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent ${
                      isSmallMobile ? 'text-xl' : 'text-2xl sm:text-3xl'
                    }`}
                  >
                    {t('theLGUInNaval')}
                  </h3>
                  <p className={`leading-relaxed text-gray-700 ${
                    isSmallMobile ? 'text-sm' : 'text-base sm:text-lg'
                  }`}>
                    {t('lguDescription')}
                  </p>
                </motion.div>

                {/* VISION */}
                <motion.div 
                  variants={fadeIn} 
                  className="rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:rounded-2xl sm:p-6"
                  onFocus={() => accessibility.speakText(`${t('vision')}. ${t('visionDescription')}`)}
                  tabIndex={0}
                  role="article"
                  aria-labelledby="vision-heading"
                >
                  <h3 
                    id="vision-heading"
                    className={`mb-3 font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent ${
                      isSmallMobile ? 'text-xl' : 'text-2xl sm:text-3xl'
                    }`}
                  >
                    {t('vision')}
                  </h3>
                  <p className={`leading-relaxed text-gray-700 ${
                    isSmallMobile ? 'text-sm' : 'text-base sm:text-lg'
                  }`}>
                    {t('visionDescription')}
                  </p>
                </motion.div>
              </motion.div>

              {/* RIGHT COLUMN */}
              <motion.div variants={fadeIn} className="space-y-6 sm:space-y-8">
                {/* MISSION */}
                <motion.div 
                  variants={fadeIn} 
                  className="rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:rounded-2xl sm:p-6"
                  onFocus={() => accessibility.speakText(`${t('mission')}. ${t('missionDescription')}`)}
                  tabIndex={0}
                  role="article"
                  aria-labelledby="mission-heading"
                >
                  <h3 
                    id="mission-heading"
                    className={`mb-3 font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent ${
                      isSmallMobile ? 'text-xl' : 'text-2xl sm:text-3xl'
                    }`}
                  >
                    {t('mission')}
                  </h3>
                  <p className={`text-gray-700 leading-relaxed ${
                    isSmallMobile ? 'text-sm' : 'text-base sm:text-lg'
                  }`}>
                    {t('missionDescription')}
                  </p>
                </motion.div>

                {/* OBJECTIVE */}
                <motion.div 
                  variants={fadeIn} 
                  className="rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:rounded-2xl sm:p-6"
                  onFocus={() => accessibility.speakText(`${t('objective')}. ${t('objectives')}`)}
                  tabIndex={0}
                  role="article"
                  aria-labelledby="objective-heading"
                >
                  <h3 
                    id="objective-heading"
                    className={`mb-3 font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent ${
                      isSmallMobile ? 'text-xl' : 'text-2xl sm:text-3xl'
                    }`}
                  >
                    {t('objective')}
                  </h3>
                  <ul 
                    className="space-y-3 text-gray-700 leading-relaxed sm:space-y-4"
                    aria-label={t('objectives')}
                  >
                    {objectives.map((objective, index) => (
                      <motion.li 
                        key={index}
                        className="p-3 rounded-lg bg-pink-50/80 hover:bg-pink-100/80 transition-colors duration-300"
                        whileHover={accessibility.reducedMotion ? {} : { scale: 1.02 }}
                        onFocus={() => accessibility.speakText(`Objective ${index + 1}: ${objective}`)}
                        tabIndex={0}
                        role="listitem"
                      >
                        <span className={`${isSmallMobile ? 'text-sm' : 'text-base sm:text-lg'}`}>
                          {index + 1}. {objective}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            </div>

            {/* Mobile Navigation Helper */}
            {isMobile && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-white/80 bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                  💡 <strong>Tip:</strong> Swipe up to continue reading
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout Indicator (for debugging) */}
      {process.env.NODE_ENV === "development" && isMobile && (
        <div className="fixed bottom-2 right-2 rounded bg-purple-500 px-2 py-1 text-xs text-white">
          ABOUT: {windowWidth}px
        </div>
      )}

      {/* Accessibility focus indicators for high contrast mode */}
      <style jsx>{`
        .bg-white\\/90:focus {
          outline: ${accessibility.isHighContrast ? '2px solid yellow' : 'none'};
          outline-offset: 2px;
        }
        
        .bg-pink-50\\/80:focus {
          outline: ${accessibility.isHighContrast ? '2px solid blue' : 'none'};
          outline-offset: 2px;
        }
      `}</style>
    </motion.section>
  );
};

export default AboutSection;