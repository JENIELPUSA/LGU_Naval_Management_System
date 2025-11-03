import React from "react";
import { motion } from "framer-motion";
import photo1 from "../../assets/pic6.jpg";
import photo2 from "../../assets/pic1.jpg";
import photo3 from "../../assets/pic3.jpg";
import photo4 from "../../assets/pic4.jpg";
import photo5 from "../../assets/pic5.jpg";
import photo6 from "../../assets/pic2.jpg";
import Award from "../../assets/Award.jpg";
import { useAccessibility } from "./NavHeader"; // Import the accessibility hook

export default function App() {
    const accessibility = useAccessibility(); // Use the accessibility hook
    const galleryPhotos = [photo1, photo2, photo3, photo4, photo5, photo6];

    // Translation function for this component
    const t = (key) => {
        const translations = {
            en: {
                awardImageAlt: "SP Cagayan honors CPPO and Athletes - Award ceremony",
                articleTitle: "IN PHOTOS|| LGU Naval Honored with Plaque of Appreciation from Bureau of Jail Management and Penology",
                articleContent: "The Local Government Unit of Naval received an award of recognition from the Bureau of Jail Management and Penology (BJMP) Regional Office VIII during their 34th Regional Anniversary celebration held on September 9, 2025, at the Leyte Convention Center Annex A in Palo, Leyte. Mayor Gretchen Stephanie M. Espina, represented by Hon. George Dela Peña, attended the said event, which carried the meaningful theme 'Matatag na Serbisyo, Patnubay sa Tunay na Pagbabago.' The plaque of appreciation was awarded to the LGU of Naval, Biliran in grateful recognition of their invaluable support, unwavering commitment, and active partnership with BJMP, significantly contributing to the enhancement of jail management and advancement of safekeeping and developmental programs for Persons Deprived of Liberty. This is a manifestation of the strong collaboration between local government unit and BJMP in promoting reformative justice and rehabilitation programs. The recognition highlights Naval's dedication to supporting initiatives that focus on the welfare and development of individuals within the correctional system, emphasizing the importance of community partnerships in building a safer nation. Together, the LGU of Naval and BJMP continue to work hand in hand in implementing programs that prioritize human dignity embodying the bureau's mission of 'Changing Lives, Building a Safer Nation.'",
                eventPhoto: "Event Photo",
                photoGallery: "Photo Gallery",
                awardCeremony: "Award Ceremony",
                lguNavalRecognition: "LGU Naval Recognition",
                bureauJailManagement: "Bureau of Jail Management and Penology",
                regionalAnniversary: "34th Regional Anniversary",
                mayorRepresentative: "Mayor represented by Hon. George Dela Peña",
                theme: "Theme: Matatag na Serbisyo, Patnubay sa Tunay na Pagbabago"
            },
            tl: {
                awardImageAlt: "SP Cagayan pinarangalan ang CPPO at mga Atleta - Seremonya ng parangal",
                articleTitle: "SA MGA LARAWAN|| LGU Naval, Ginawaran ng Plaque of Appreciation mula sa Bureau of Jail Management and Penology",
                articleContent: "Ang Local Government Unit ng Naval ay nakatanggap ng parangal ng pagkilala mula sa Bureau of Jail Management and Penology (BJMP) Regional Office VIII sa kanilang ika-34 na Regional Anniversary celebration na ginanap noong Septyembre 9, 2025, sa Leyte Convention Center Annex A sa Palo, Leyte. Si Mayor Gretchen Stephanie M. Espina, na kinatawan ni Hon. George Dela Peña, ay dumalo sa nasabing event, na may makahulugang temang 'Matatag na Serbisyo, Patnubay sa Tunay na Pagbabago.' Ang plaque of appreciation ay iginawad sa LGU ng Naval, Biliran bilang pagkilala sa kanilang napakahalagang suporta, walang pagatubiling pangako, at aktibong pakikipagtulungan sa BJMP, na malaki ang naitulong sa pagpapahusay ng pamamahala ng bilangguan at pagsulong ng mga programa sa pangangalaga at pag-unlad para sa mga Persons Deprived of Liberty. Ito ay isang pagpapakita ng malakas na pakikipagtulungan sa pagitan ng lokal na pamahalaan at BJMP sa pagtataguyod ng repormatibong katarungan at mga programa sa rehabilitasyon. Ang pagkilala ay nagpapakita ng dedikasyon ng Naval sa pagsuporta sa mga inisyatiba na nakatuon sa kapakanan at pag-unlad ng mga indibidwal sa loob ng correctional system, na binibigyang-diin ang kahalagahan ng pakikipagtulungan ng komunidad sa pagbuo ng mas ligtas na bansa. Magkasama, ang LGU ng Naval at BJMP ay patuloy na nagtutulungan sa pagpapatupad ng mga programa na nagbibigay priyoridad sa dignidad ng tao na sumasagisag sa misyon ng bureau na 'Pagbabago ng Buhay, Pagbuo ng Mas Ligtas na Bansa.'",
                eventPhoto: "Larawan ng Event",
                photoGallery: "Gallery ng mga Larawan",
                awardCeremony: "Seremonya ng Parangal",
                lguNavalRecognition: "Pagkilala sa LGU Naval",
                bureauJailManagement: "Bureau of Jail Management and Penology",
                regionalAnniversary: "Ika-34 na Regional Anniversary",
                mayorRepresentative: "Alkalde na kinatawan ni Hon. George Dela Peña",
                theme: "Tema: Matatag na Serbisyo, Patnubay sa Tunay na Pagbabago"
            }
        };
        return translations[accessibility.language]?.[key] || translations.en[key] || key;
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { 
                duration: accessibility.reducedMotion ? 0.1 : 0.6, 
                ease: "easeOut" 
            },
        },
    };

    return (
        <div 
            className="min-h-screen"
            style={{
                fontFamily: accessibility.fontType === "dyslexia" ? "'OpenDyslexic', Arial, sans-serif" : "inherit"
            }}
        >
            <div className="mx-auto max-w-7xl px-4">
                {/* Main Content Card with Background & Margin */}
                <div className="mb-10 rounded-xl bg-white p-12 shadow-lg">
                    {/* Header Image */}
                    <div className="mb-6">
                        <img
                            src={Award}
                            alt={t('awardImageAlt')}
                            className="mx-auto h-[500px] w-full max-w-[800px] rounded-lg object-cover"
                            onFocus={() => accessibility.speakText(t('awardImageAlt'))}
                        />
                    </div>

                    {/* Title */}
                    <h1 
                        className="mb-4 text-2xl font-bold text-red-700"
                        onFocus={() => accessibility.speakText(t('articleTitle'))}
                    >
                        {accessibility.language === 'tl' ? 
                            "𝐒𝐀 𝐌𝐆𝐀 𝐋𝐀𝐑𝐀𝐖𝐀𝐍|| 𝐋𝐆𝐔 𝐍𝐚𝐯𝐚𝐥, 𝐆𝐢𝐧𝐚𝐰𝐚𝐫𝐚𝐧 𝐧𝐠 𝐏𝐥𝐚𝐪𝐮𝐞 𝐨𝐟 𝐀𝐩𝐩𝐫𝐞𝐜𝐢𝐚𝐭𝐢𝐨𝐧 𝐦𝐮𝐥𝐚 𝐬𝐚 𝐁𝐮𝐫𝐞𝐚𝐮 𝐨𝐟 𝐉𝐚𝐢𝐥 𝐌𝐚𝐧𝐚𝐠𝐞𝐦𝐞𝐧𝐭 𝐚𝐧𝐝 𝐏𝐞𝐧𝐨𝐥𝐨𝐠𝐲" :
                            "𝐈𝐍 𝐏𝐇𝐎𝐓𝐎𝐒|| 𝐋𝐆𝐔 𝐍𝐚𝐯𝐚𝐥 𝐇𝐨𝐧𝐨𝐫𝐞𝐝 𝐰𝐢𝐭𝐡 𝐏𝐥𝐚𝐪𝐮𝐞 𝐨𝐟 𝐀𝐩𝐩𝐫𝐞𝐜𝐢𝐚𝐭𝐢𝐨𝐧 𝐟𝐫𝐨𝐦 𝐁𝐮𝐫𝐞𝐚𝐮 𝐨𝐟 𝐉𝐚𝐢𝐥 𝐌𝐚𝐧𝐚𝐠𝐞𝐦𝐞𝐧𝐭 𝐚𝐧𝐝 𝐏𝐞𝐧𝐨𝐥𝐨𝐠𝐲"
                        }
                    </h1>

                    {/* Article Paragraph */}
                    <article className="prose prose-lg mb-8 max-w-none">
                        <p
                            onFocus={() => accessibility.speakText(t('articleContent'))}
                        >
                            {t('articleContent')}
                        </p>
                    </article>

                    {/* Photo Gallery with Scroll-triggered Wave */}
                    <motion.div
                        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        aria-labelledby="photo-gallery-heading"
                    >
                        <h2 
                            id="photo-gallery-heading" 
                            className="sr-only"
                        >
                            {t('photoGallery')}
                        </h2>
                        
                        {galleryPhotos.map((photo, index) => (
                            <motion.figure
                                key={index}
                                className="overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
                                variants={accessibility.reducedMotion ? {} : itemVariants}
                                style={{ 
                                    originY: 1, 
                                    transitionDelay: accessibility.reducedMotion ? '0s' : `${index * 0.15}s` 
                                }}
                                onFocus={() => accessibility.speakText(`${t('eventPhoto')} ${index + 1}`)}
                                tabIndex={0}
                                role="group"
                                aria-label={`${t('eventPhoto')} ${index + 1}`}
                            >
                                <img
                                    src={photo}
                                    alt={`${t('eventPhoto')} ${index + 1} - ${t('lguNavalRecognition')} ${t('awardCeremony')}`}
                                    className="h-48 w-full object-cover"
                                    loading="lazy"
                                />
                                <figcaption className="sr-only">
                                    {t('eventPhoto')} {index + 1} - {t('lguNavalRecognition')} {t('awardCeremony')}
                                </figcaption>
                            </motion.figure>
                        ))}
                    </motion.div>

                    {/* Additional context for screen readers */}
                    <div className="sr-only" aria-live="polite">
                        <p>{t('bureauJailManagement')}</p>
                        <p>{t('regionalAnniversary')}</p>
                        <p>{t('mayorRepresentative')}</p>
                        <p>{t('theme')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}