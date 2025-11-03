// src/ReusableFolder/LoadingOverlay.jsx
import React, { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import logo from "../assets/logo-login.png";
import { PersonilContext } from "../contexts/PersonelContext/PersonelContext";

const LoadingOverlay = ({ message = "Loading..." }) => {
    const { bgtheme, FontColor } = useContext(PersonilContext);
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const overlayContent = (
        <div
            style={{
                background: bgtheme,
            }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                    ></div>
                ))}
            </div>

            {/* Main loading container */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Primary Loading Animation */}
                <div className="relative mb-8 h-32 w-32">
                    {/* Outer rotating ring */}
                    <div className="outer-ring"></div>

                    {/* Middle pulsing ring */}
                    <div className="middle-ring"></div>

                    {/* Inner spinning dots */}
                    <div className="inner-container">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="dot"
                            ></div>
                        ))}
                    </div>

                    {/* Center Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img
                            src={logo}
                            alt="Loading Logo"
                            className="h-16 w-16 animate-pulse object-contain"
                        />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <h2
                        style={{
                            color: FontColor,
                        }}
                        className="mb-2 bg-clip-text text-3xl font-bold text-transparent"
                    >
                        {message}
                        {dots}
                    </h2>
                    <div className="loading-bar"></div>
                    <p
                        style={{
                            color: FontColor,
                        }}
                        className="mt-4 text-sm opacity-75"
                    >
                        Please wait while we process your request
                    </p>
                </div>
            </div>

            <style jsx>{`
                .particle {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    animation: float 6s infinite ease-in-out;
                }
                .particle:nth-child(1) {
                    width: 20px;
                    height: 20px;
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }
                .particle:nth-child(2) {
                    width: 15px;
                    height: 15px;
                    top: 60%;
                    left: 80%;
                    animation-delay: 1s;
                }
                .particle:nth-child(3) {
                    width: 25px;
                    height: 25px;
                    top: 40%;
                    left: 70%;
                    animation-delay: 2s;
                }
                .particle:nth-child(4) {
                    width: 10px;
                    height: 10px;
                    top: 80%;
                    left: 30%;
                    animation-delay: 3s;
                }
                .particle:nth-child(5) {
                    width: 15px;
                    height: 15px;
                    top: 10%;
                    left: 60%;
                    animation-delay: 4s;
                }
                .particle:nth-child(6) {
                    width: 20px;
                    height: 20px;
                    top: 70%;
                    left: 20%;
                    animation-delay: 5s;
                }

                .outer-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 3px solid transparent;
                    border-top: 3px solid #8b5cf6;
                    border-radius: 50%;
                    animation: spin 2s linear infinite;
                }

                .middle-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 70%;
                    height: 70%;
                    border: 2px solid transparent;
                    border-top: 2px solid #ec4899;
                    border-radius: 50%;
                    animation: spin 1.5s linear infinite reverse;
                }

                .inner-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50%;
                    height: 50%;
                }

                .dot {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: #3b82f6;
                    border-radius: 50%;
                    animation: spin 2s linear infinite;
                }
                .dot:nth-child(1) {
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .dot:nth-child(2) {
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .dot:nth-child(3) {
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .dot:nth-child(4) {
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .loading-bar {
                    width: 200px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    overflow: hidden;
                    margin: 0 auto;
                }
                .loading-bar::after {
                    content: "";
                    display: block;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                    border-radius: 4px;
                    animation: loading 1.5s infinite ease-in-out;
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                @keyframes loading {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(200%);
                    }
                }

                @keyframes flip {
                    0% {
                        transform: rotateY(0deg);
                    }
                    50% {
                        transform: rotateY(180deg);
                    }
                    100% {
                        transform: rotateY(360deg);
                    }
                }

                .animate-flip {
                    animation: flip 1s infinite linear;
                }
            `}</style>
        </div>
    );

    // Prevent SSR issues (e.g., in Next.js)
    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(overlayContent, document.body);
};

export default LoadingOverlay;
