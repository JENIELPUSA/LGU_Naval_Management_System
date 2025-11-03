import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BannerPic from "../../assets/Bannerpicture.jfif";
import BackgroundBanner from "../../assets/Bannerpic.jpg";

const Banner = () => {
  const bannerRef = useRef(null);

  // Track scroll progress relative to this banner
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start start", "end start"],
  });

  // Parallax motion for background image
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section
      ref={bannerRef}
      className="relative flex h-[400px] sm:h-[500px] md:h-[600px] w-full items-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={BackgroundBanner}
          alt="Background"
          className="w-full h-full object-cover object-center sm:object-top scale-110"
        />
        {/* Dark overlay with soft blur */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1.5px]" />
      </motion.div>

      {/* Foreground Content */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between w-full px-6 md:px-16">
        {/* Left Side - Title and Info */}
        <div className="text-left max-w-xl z-10">
          <h1 className="text-lg sm:text-2xl md:text-4xl font-serif font-extrabold text-white drop-shadow-lg leading-snug">
            LGU Naval Honored with Plaque of Appreciation from
            Bureau of Jail Management and Penology
          </h1>

          <p className="text-sm sm:text-base text-gray-200 italic mt-2">
            {new Date().toLocaleString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
