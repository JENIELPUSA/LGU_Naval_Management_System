import React from "react";
import { motion } from "framer-motion";
import { Facebook, ExternalLink } from "lucide-react";
import { useAccessibility } from "./NavHeader"; // Import the accessibility hook

const FBPageEmbed = ({ bgtheme, FontColor }) => {
    const [show, setShow] = React.useState(false);
    const [iframeLoaded, setIframeLoaded] = React.useState(false);
    const accessibility = useAccessibility();

    React.useEffect(() => {
        setShow(true);
    }, []);

    // Translation function
    const t = (key) => {
        const translations = {
            en: {
                followUsFacebook: "Follow Us on Facebook",
                stayUpdated: "Stay updated with our latest news",
                facebookPage: "Facebook Page",
                loadingFacebook: "Loading Facebook page...",
                visitOurPage: "Visit our Facebook page",
                pageOpensNew: "Page opens in new window",
                municipalGovernment: "Municipal Government of Naval, Biliran Facebook Page",
                latestUpdates: "Get the latest updates and announcements",
            },
            tl: {
                followUsFacebook: "Sundan Kami sa Facebook",
                stayUpdated: "Manatiling updated sa aming mga pinakabagong balita",
                facebookPage: "Facebook Page",
                loadingFacebook: "Naglo-load ng Facebook page...",
                visitOurPage: "Bisitahin ang aming Facebook page",
                pageOpensNew: "Ang page ay magbubukas sa bagong window",
                municipalGovernment: "Facebook Page ng Munisipyo ng Naval, Biliran",
                latestUpdates: "Kunin ang mga pinakabagong update at anunsyo",
            },
        };
        return translations[accessibility.language]?.[key] || translations.en[key] || key;
    };

    // High contrast styles
    const getHighContrastStyles = () => {
        if (accessibility.isHighContrast) {
            return {
                header: "bg-gray-900 text-white border-b-2 border-yellow-400",
                container: "bg-white border-2 border-gray-800",
                content: "bg-gray-100",
                button: "bg-yellow-400 text-black border-2 border-black font-bold",
            };
        }

        return {
            header: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
            container: "bg-white shadow-lg border border-blue-200",
            content: "bg-gray-50",
            button: "bg-blue-600 text-white hover:bg-blue-700",
        };
    };

    const styles = getHighContrastStyles();

    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    const handleHeaderFocus = () => {
        accessibility.speakText(`${t("followUsFacebook")}. ${t("stayUpdated")}`);
    };

    const handleVisitButtonFocus = () => {
        accessibility.speakText(`${t("visitOurPage")}. ${t("pageOpensNew")}`);
    };

    const pageUrl = "https://www.facebook.com/LGUNavalBiliran/";
    const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
        pageUrl,
    )}&tabs=timeline&width=340&height=700&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`;

    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: accessibility.reducedMotion ? 0 : 0.6 }}
            className={`mx-auto max-w-[400px] overflow-hidden rounded-lg ${styles.container}`}
            role="complementary"
            aria-label={t("facebookPage")}
        >
            {/* HEADER */}
            <div
                className={`flex items-center gap-3 p-5 ${styles.header}`}
                onFocus={handleHeaderFocus}
            >
                <div className={`rounded-lg p-2 ${accessibility.isHighContrast ? "bg-yellow-400 text-black" : "bg-white/20"}`}>
                    <Facebook className="h-6 w-6" />
                </div>
                <div>
                    <h3
                        className="text-lg font-bold"
                        tabIndex={0} // Make focusable for screen readers
                    >
                        {t("followUsFacebook")}
                    </h3>
                    <p className={`text-sm ${accessibility.isHighContrast ? "text-gray-200" : "text-blue-100"}`}>{t("stayUpdated")}</p>
                </div>
            </div>

            {/* EMBEDDED PAGE */}
            <div className={`flex justify-center p-3 ${styles.content}`}>
                <div className="relative">
                    {/* Loading state */}
                    {!iframeLoaded && (
                        <div
                            className="flex min-h-[700px] w-[340px] items-center justify-center rounded-xl bg-gray-200"
                            aria-live="polite"
                            aria-label={t("loadingFacebook")}
                        >
                            <div
                              
                                className="text-center"
                            >
                                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                <p 
                                className={accessibility.isHighContrast ? "text-gray-800" : "text-gray-600"}>{t("loadingFacebook")}</p>
                            </div>
                        </div>
                    )}

                    <motion.iframe
                        initial={{ opacity: 0 }}
                        animate={{ opacity: iframeLoaded ? 1 : 0 }}
                        transition={{ duration: accessibility.reducedMotion ? 0 : 0.8 }}
                        title={t("municipalGovernment")}
                        src={src}
                        className={`min-h-[700px] w-[340px] rounded-xl ${iframeLoaded ? "block" : "absolute inset-0"}`}
                        style={{ border: "none", overflow: "hidden" }}
                        scrolling="no"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        loading="lazy"
                        onLoad={handleIframeLoad}
                        aria-label={t("municipalGovernment")}
                    />
                </div>
            </div>

            {/* FALLBACK LINK - For accessibility and if iframe fails */}
            <div className={`border-t p-4 ${accessibility.isHighContrast ? "border-gray-600 bg-gray-100" : "border-gray-200"}`}>
                <a
                    href={pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors ${styles.button} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    onFocus={handleVisitButtonFocus}
                    aria-label={`${t("visitOurPage")} (${t("pageOpensNew")})`}
                >
                    <ExternalLink className="h-4 w-4" />
                    {t("visitOurPage")}
                </a>
                <p className={`mt-2 text-center text-xs ${accessibility.isHighContrast ? "text-gray-700" : "text-gray-500"}`}>{t("latestUpdates")}</p>
            </div>
        </motion.div>
    );
};

export default FBPageEmbed;
