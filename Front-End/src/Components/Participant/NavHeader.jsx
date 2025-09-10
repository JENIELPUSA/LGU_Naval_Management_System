import React, { useState } from "react";
import AuthFormModal from "../Login/Login"; // import the modal

const NavHeader = ({ scrollToSection, eventsRef, servicesRef, aboutRef }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200 border-opacity-50 bg-white bg-opacity-80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-pink-600">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-blue-700 to-pink-700 bg-clip-text text-xl font-bold text-transparent">
                LGU Events
              </span>
            </div>

            <div className="hidden items-center space-x-8 md:flex">
              <a onClick={() => scrollToSection(eventsRef)} className="font-medium text-gray-700 transition-colors hover:text-blue-600 cursor-pointer">
                Events
              </a>
              <a onClick={() => scrollToSection(servicesRef)} className="font-medium text-gray-700 transition-colors hover:text-blue-600 cursor-pointer">
                Services
              </a>
              <a onClick={() => scrollToSection(aboutRef)} className="font-medium text-gray-700 transition-colors hover:text-blue-600 cursor-pointer">
                About
              </a>
              {/* Login Button */}
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
