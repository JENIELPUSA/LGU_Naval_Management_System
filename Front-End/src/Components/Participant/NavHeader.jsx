import React, { useState } from "react";
import {
  Facebook,
  Mail,
  Youtube,
  Twitter,
  Building
} from "lucide-react";
import AuthFormModal from "../Login/Login";

const NavHeader = ({ scrollToSection, eventsRef, servicesRef, aboutRef }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      {/* Social Media Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-pink-600 py-2 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-white">
              <span>📍 P.Inocentes St. Brgy.P.I Garcia, Naval Biliran</span>
              <span className="mx-2">|</span>
              <span>📞 09979926806</span>
              <span className="mx-2">|</span>
              <span>✉️ lgunaval2022@gmail.com</span>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href="https://www.facebook.com/LGUNavalBiliran?mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>

              <a
                href="lgunaval2022@gmail.com"
                className="text-white hover:text-blue-200 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 border-opacity-50 bg-white bg-opacity-80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-pink-600">
                <Building className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-700 to-pink-700 bg-clip-text text-xl font-bold text-transparent">
                LGU Events
              </span>
            </div>

            <div className="hidden items-center space-x-8 md:flex">
              <a
                onClick={() => scrollToSection(eventsRef)}
                className="font-medium text-gray-700 transition-colors hover:text-blue-600 cursor-pointer"
              >
                Events
              </a>
              <a
                onClick={() => scrollToSection(servicesRef)}
                className="font-medium text-gray-700 transition-colors hover:text-blue-600 cursor-pointer"
              >
                Services
              </a>
              <a
                onClick={() => scrollToSection(aboutRef)}
                className="font-medium text-gray-700 transition-colors hover:text-blue-600 cursor-pointer"
              >
                About
              </a>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="transform rounded-full bg-gradient-to-r from-blue-600 to-pink-600 px-6 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-pink-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthFormModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default NavHeader;