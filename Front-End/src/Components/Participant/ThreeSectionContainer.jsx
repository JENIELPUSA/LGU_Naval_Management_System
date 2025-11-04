import React from "react";
import LatestEvent from "./LatestEvents";
import FacebookPage from "./FacebookPage";
import { useAccessibility } from "./NavHeader"; // Import the accessibility hook

const ThreeSectionContainer = ({ eventsRef, isEventUpcoming, setShowModal, handleEventSelect, bgtheme, FontColor }) => {
    const accessibility = useAccessibility();

    // Translation function for this component
    const t = (key) => {
        const translations = {
            en: {
                biliranConnect: "Biliran Connect",
                stayConnected: "Stay connected with the latest updates and community activities",
                communityUpdates: "Community updates and activities",
                latestCommunityEvents: "Latest community events",
                hotlineInformation: "Hotline and important information",
                formSection: "Forms and input sections",
                inputFields: "Input fields and forms",
            },
            tl: {
                biliranConnect: "Biliran Connect",
                stayConnected: "Manatiling konektado sa mga pinakabagong update at mga gawain sa komunidad",
                communityUpdates: "Mga update at gawain sa komunidad",
                latestCommunityEvents: "Pinakabagong mga event sa komunidad",
                hotlineInformation: "Hotline at mahalagang impormasyon",
                formSection: "Mga form at seksyon ng input",
                inputFields: "Mga input field at form",
            },
        };
        return translations[accessibility.language]?.[key] || translations.en[key] || key;
    };

    // High contrast color scheme - IMPROVED FOR BETTER TEXT CLARITY AND BORDERS
    const getHighContrastColors = () => {
        if (accessibility.isHighContrast) {
            return {
                background: "bg-white",
                textPrimary: "text-black font-bold",
                textSecondary: "text-gray-800 font-medium",
                gradient: "from-white to-gray-100",
                accent: "text-blue-800 font-bold",
                border: "border-2 border-gray-800", // Thicker border for high contrast
                sectionBackground: "bg-white",
                cardBackground: "bg-white",
                shadow: "shadow-md",
                formBorder: "border-2 border-gray-700", // Specific border for forms
                inputBorder: "border-2 border-gray-600 focus:border-blue-700 focus:ring-2 focus:ring-blue-500", // Enhanced input borders
                focusRing: "focus:ring-2 focus:ring-blue-700 focus:ring-offset-2", // Focus indicators
            };
        }

        return {
            background: "bg-gradient-to-br from-blue-50 to-gray-100",
            textPrimary: "text-blue-800 font-semibold",
            textSecondary: "text-gray-700",
            gradient: "from-blue-50 to-gray-100",
            accent: "text-pink-600",
            border: "border border-gray-200",
            sectionBackground: "bg-gradient-to-br from-blue-50 to-gray-100",
            cardBackground: "bg-white",
            shadow: "shadow-lg",
            formBorder: "border border-gray-300", // Standard form borders
            inputBorder: "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200", // Standard input borders
            focusRing: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        };
    };

    const colors = getHighContrastColors();

    const handleHeaderFocus = () => {
        accessibility.speakText(`${t("biliranConnect")}. ${t("stayConnected")}`);
    };

    // Calculate font size based on accessibility settings
    const getTextSizeClass = (baseSize) => {
        const sizeMultiplier = accessibility.fontSize / 16; // 16px is default
        if (sizeMultiplier > 1.2) return `text-${baseSize + 1}xl`;
        if (sizeMultiplier > 1.1) return `text-${baseSize}xl font-semibold`;
        return `text-${baseSize}xl`;
    };

    return (
        <section
            className={`relative min-h-screen w-full ${colors.background} py-12`}
            aria-labelledby="three-section-heading"
            style={{
                fontFamily:
                    accessibility.fontType === "dyslexia"
                        ? "OpenDyslexic, Arial, sans-serif"
                        : accessibility.fontType === "arial"
                          ? "Arial, sans-serif"
                          : "inherit",
            }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header - IMPROVED TEXT CLARITY */}
                <div className="mb-12 text-center">
                    <h2
                        id="three-section-heading"
                        className={`${getTextSizeClass("3")} font-bold sm:text-4xl ${colors.textPrimary} mb-4 leading-tight tracking-tight`}
                        onFocus={handleHeaderFocus}
                        tabIndex={0}
                        style={{
                            textShadow: accessibility.isHighContrast ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                        }}
                    >
                        {t("biliranConnect")}
                    </h2>
                    <p
                        className={`text-lg ${colors.textSecondary} mx-auto max-w-2xl leading-relaxed ${
                            accessibility.isHighContrast ? "font-medium" : ""
                        }`}
                        aria-describedby="three-section-heading"
                        style={{
                            fontSize: `${accessibility.fontSize}px`,
                            lineHeight: "1.6",
                        }}
                    >
                        {t("stayConnected")}
                    </p>

                    {/* Decorative line with better contrast */}
                    <div
                        className={`mx-auto mt-4 h-1 w-20 rounded-full ${
                            accessibility.isHighContrast ? "bg-blue-700" : "bg-gradient-to-r from-blue-500 to-pink-500"
                        }`}
                    />
                </div>

                {/* Three Section Layout */}
                <div
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-6"
                    role="region"
                    aria-label={t("communityUpdates")}
                >
                    {/* Facebook Page/Hotline - 1 column */}
                    <div
                        className="lg:col-span-1"
                        role="complementary"
                        aria-label={t("hotlineInformation")}
                    >
                        <div
                            className={`rounded-lg ${colors.shadow} ${colors.cardBackground} ${colors.border} ${
                                accessibility.isHighContrast ? "border-2 border-gray-700" : "border border-gray-200"
                            }`}
                        >
                            <FacebookPage
                                bgtheme={bgtheme}
                                FontColor={FontColor}
                            />
                        </div>
                    </div>

                    {/* Latest Event - 2 columns */}
                    <div
                        className="lg:col-span-2"
                        role="main"
                        aria-label={t("latestCommunityEvents")}
                    >
                        <div
                            className={`rounded-lg ${colors.shadow} ${colors.border} ${
                                accessibility.isHighContrast ? "border-2 border-gray-700" : "border border-gray-200"
                            }`}
                        >
                            <LatestEvent
                                eventsRef={eventsRef}
                                isEventUpcoming={isEventUpcoming}
                                setShowModal={setShowModal}
                                handleEventSelect={handleEventSelect}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThreeSectionContainer;
