import React, { useContext } from "react";
import { Mail, Facebook, Youtube, Instagram, Phone, MapPin } from "lucide-react";
import Dilg from "../../assets/Dilg.png";
import republic from "../../assets/republic.png";
import transparency from "../../assets/transparency.png";
import biliran from "../../assets/logo-login.png";
import Bagong from "../../assets/BagongPilipinas.png";
import { useAccessibility } from "./NavHeader"; // Import the accessibility hook

const Footer = ({ FontColor, bgtheme }) => {
    const accessibility = useAccessibility(); // Use the accessibility hook

    // Translation function for this component
    const t = (key) => {
        const translations = {
            en: {
                emergencyHotlines: "Emergency Hotlines",
                fireDepartment: "BFP (Fire Department)",
                police: "PNP (Police)",
                municipalHealthOffice: "Municipal Health Office",
                disasterResponse: "MDRRMO (Disaster Response)",
                lguNaval: "LGU Naval",
                transparencySeal: "Transparency Seal",
                republicOfPhilippines: "Republic of the Philippines",
                dilg: "Department of Interior and Local Government",
                bagongPilipinas: "Bagong Pilipinas",
                provinceOfBiliran: "Province Of Biliran",
                naval: "Naval",
                navalLguOffice: "NAVAL LGU OFFICE",
                aboutGovPh: "About Gov.ph",
                aboutGovPhDescription: "Learn More About The Philippine Government, Its Structure, How Government Works And The People Behind It.",
                govPh: "GOV.PH",
                officialGazette: "Official Gazette",
                governmentLinks: "Government Links",
                officeOfThePresident: "Office of the President",
                officeOfTheVicePresident: "Office of the Vice President",
                senateOfThePhilippines: "Senate of the Philippines",
                houseOfThePhilippines: "House of the Philippines",
                supremeCourt: "Supreme Court",
                courtOfAppeals: "Court of Appeals",
                sandiganbayan: "Sandiganbayan",
                copyright: "Province of Biliran - Lgu Management System. All Rights Reserved.",
                contactInformation: "Contact Information",
                governmentSeals: "Government Seals and Logos",
                provinceInformation: "Province Information",
                externalLink: "External link",
                phoneNumber: "Phone number",
                followUs: "Follow us on social media",
                navigation: "Navigation"
            },
            tl: {
                emergencyHotlines: "Mga Emergency Hotline",
                fireDepartment: "BFP (Kaugnay ng Sunog)",
                police: "PNP (Pulisya)",
                municipalHealthOffice: "Opisina ng Kalusugan ng Bayan",
                disasterResponse: "MDRRMO (Tugon sa Sakuna)",
                lguNaval: "LGU Naval",
                transparencySeal: "Selyo ng Transparency",
                republicOfPhilippines: "Republika ng Pilipinas",
                dilg: "Kagawaran ng Interyor at Pamahalaang Lokal",
                bagongPilipinas: "Bagong Pilipinas",
                provinceOfBiliran: "Lalawigan ng Biliran",
                naval: "Naval",
                navalLguOffice: "OPISINA NG LGU NAVAL",
                aboutGovPh: "Tungkol sa Gov.ph",
                aboutGovPhDescription: "Matuto Pa Tungkol Sa Pamahalaan Ng Pilipinas, Ang Istraktura Nito, Kung Paano Gumagana Ang Pamahalaan At Ang Mga Tao Sa Likod Nito.",
                govPh: "GOV.PH",
                officialGazette: "Opisyal na Gazette",
                governmentLinks: "Mga Link ng Pamahalaan",
                officeOfThePresident: "Opisina ng Pangulo",
                officeOfTheVicePresident: "Opisina ng Bise Presidente",
                senateOfThePhilippines: "Senado ng Pilipinas",
                houseOfThePhilippines: "Kapulungan ng mga Kinatawan",
                supremeCourt: "Kataas-taasang Hukuman",
                courtOfAppeals: "Hukuman ng Apela",
                sandiganbayan: "Sandiganbayan",
                copyright: "Lalawigan ng Biliran - Lgu Management System. Lahat ng Karapatan ay Nakalaan.",
                contactInformation: "Impormasyon ng Kontak",
                governmentSeals: "Mga Selyo at Logo ng Pamahalaan",
                provinceInformation: "Impormasyon ng Lalawigan",
                externalLink: "Panlabas na link",
                phoneNumber: "Numero ng telepono",
                followUs: "Sundan kami sa social media",
                navigation: "Nabigasyon"
            }
        };
        return translations[accessibility.language]?.[key] || translations.en[key] || key;
    };

    // Emergency hotlines data
    const emergencyHotlines = [
        { name: t('fireDepartment'), number: "0917-123-4567" },
        { name: t('police'), number: "0998-765-4321" },
        { name: t('municipalHealthOffice'), number: "0935-112-2233" },
        { name: t('disasterResponse'), number: "0917-556-7788" },
        { name: t('lguNaval'), number: "0997-992-6806" }
    ];

    // Government links data
    const governmentLinks = [
        t('officeOfThePresident'),
        t('officeOfTheVicePresident'),
        t('senateOfThePhilippines'),
        t('houseOfThePhilippines'),
        t('supremeCourt'),
        t('courtOfAppeals'),
        t('sandiganbayan')
    ];

    // Government logos data
    const governmentLogos = [
        { src: transparency, alt: t('transparencySeal'), description: t('transparencySeal') },
        { src: republic, alt: t('republicOfPhilippines'), description: t('republicOfPhilippines') },
        { src: Dilg, alt: t('dilg'), description: t('dilg') },
        { src: Bagong, alt: t('bagongPilipinas'), description: t('bagongPilipinas') }
    ];

    return (
        <footer 
            className="w-full border-t border-gray-200 bg-gray-50"
            role="contentinfo"
            aria-label={t('navigation')}
        >
            {/* Top Section: Contact + Logos */}
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-4">
                {/* Left Section: Emergency Hotlines */}
                <div
                    style={{ background: bgtheme }}
                    className={`flex flex-col justify-center p-8 text-white`}
                    role="region"
                    aria-labelledby="emergency-hotlines-heading"
                >
                    <h3
                        id="emergency-hotlines-heading"
                        style={{ color: FontColor }}
                        className="mb-5 flex items-center gap-2 text-lg font-semibold tracking-wide"
                        onFocus={() => accessibility.speakText(t('emergencyHotlines'))}
                    >
                        <div className="h-5 w-1" aria-hidden="true"></div>
                        {t('emergencyHotlines')}
                    </h3>

                    <div className="space-y-4 text-xs sm:text-sm">
                        {emergencyHotlines.map((hotline, index) => (
                            <div 
                                key={index}
                                className="flex items-center justify-between border-b border-white/20 pb-1"
                                role="listitem"
                            >
                                <div className="flex items-center gap-2">
                                    <Phone
                                        style={{ color: FontColor }}
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                    <span 
                                        style={{ color: FontColor }}
                                        onFocus={() => accessibility.speakText(`${hotline.name}: ${hotline.number}`)}
                                    >
                                        {hotline.name}
                                    </span>
                                </div>
                                <p
                                    style={{ color: FontColor }}
                                    className="text-sm font-medium tracking-tight"
                                    aria-label={`${t('phoneNumber')}: ${hotline.number}`}
                                >
                                    {hotline.number}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right White Section: Logos */}
                <div 
                    className="col-span-3 flex flex-wrap items-center justify-center gap-8 bg-white p-8 lg:gap-12"
                    role="region"
                    aria-labelledby="government-seals-heading"
                >
                    <h2 id="government-seals-heading" className="sr-only">
                        {t('governmentSeals')}
                    </h2>
                    {governmentLogos.map((logo, index) => (
                        <div 
                            key={index}
                            className="flex flex-col items-center text-center"
                            onFocus={() => accessibility.speakText(logo.description)}
                        >
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className="mb-2 h-[150px] w-auto object-contain"
                            />
                            <p className="max-w-[120px] text-xs text-gray-600">
                                {logo.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section: Blue Background with Links */}
            <div
                style={{ background: bgtheme }}
                className={`grid grid-cols-1 gap-0 text-white lg:grid-cols-3`}
            >
                {/* Left: Province Info */}
                <div 
                    className="flex items-center justify-center border-b border-blue-600 p-8 lg:justify-start lg:border-b-0 lg:border-r"
                    role="region"
                    aria-labelledby="province-info-heading"
                >
                    <div className="flex items-center space-x-4">
                        <img
                            src={biliran}
                            alt={t('provinceOfBiliran')}
                            className="h-[150px] w-auto object-contain"
                        />
                        <div
                            style={{ color: FontColor }}
                            className="space-y-1"
                        >
                            <p className="text-xs">{t('republicOfPhilippines')}</p>
                            <p 
                                className="text-sm font-bold"
                                onFocus={() => accessibility.speakText(t('provinceOfBiliran'))}
                            >
                                {t('provinceOfBiliran')}
                            </p>
                            <p className="text-xs">{t('naval')}</p>
                            <p 
                                className="text-sm font-bold"
                                onFocus={() => accessibility.speakText(t('navalLguOffice'))}
                            >
                                {t('navalLguOffice')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Middle: About Gov.ph */}
                <div
                    style={{ color: FontColor }}
                    className="border-b border-blue-600 p-8 lg:border-b-0 lg:border-r"
                    role="region"
                    aria-labelledby="about-govph-heading"
                >
                    <h4 
                        id="about-govph-heading"
                        className="mb-4 text-lg font-bold"
                        onFocus={() => accessibility.speakText(t('aboutGovPh'))}
                    >
                        {t('aboutGovPh')}
                    </h4>
                    <p 
                        className="mb-4 text-sm leading-relaxed"
                        onFocus={() => accessibility.speakText(t('aboutGovPhDescription'))}
                    >
                        {t('aboutGovPhDescription')}
                    </p>
                    <div className="space-y-2">
                        <a
                            href="https://www.gov.ph"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm transition-colors hover:text-yellow-400 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-blue-800"
                            aria-label={`${t('govPh')} - ${t('externalLink')}`}
                            onFocus={() => accessibility.speakText(`${t('govPh')} - ${t('externalLink')}`)}
                        >
                            {t('govPh')}
                        </a>
                        <a
                            href="https://www.gov.ph/official-gazette/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm transition-colors hover:text-yellow-400 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-blue-800"
                            aria-label={`${t('officialGazette')} - ${t('externalLink')}`}
                            onFocus={() => accessibility.speakText(`${t('officialGazette')} - ${t('externalLink')}`)}
                        >
                            {t('officialGazette')}
                        </a>
                    </div>
                </div>

                {/* Right: Government Links */}
                <div
                    style={{ color: FontColor }}
                    className="border-b border-blue-600 p-8 lg:border-b-0 lg:border-r"
                    role="region"
                    aria-labelledby="government-links-heading"
                >
                    <h4 
                        id="government-links-heading"
                        className="mb-4 text-lg font-bold"
                        onFocus={() => accessibility.speakText(t('governmentLinks'))}
                    >
                        {t('governmentLinks')}
                    </h4>
                    <ul
                        style={{ color: FontColor }}
                        className="space-y-2 text-sm"
                        role="list"
                    >
                        {governmentLinks.map((link, index) => (
                            <li key={index} role="listitem">
                                <a
                                    href="#"
                                    className="block py-1 transition-colors hover:text-yellow-400 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-blue-800"
                                    onFocus={() => accessibility.speakText(link)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        accessibility.speakText(`${link} - ${t('externalLink')}`);
                                    }}
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Copyright Section */}
            <div 
                className="bg-blue-950 px-8 py-4 text-blue-200"
                role="region"
                aria-label="Copyright information"
            >
                <div className="mx-auto max-w-7xl text-center">
                    <p 
                        className="text-sm"
                        onFocus={() => accessibility.speakText(t('copyright'))}
                    >
                        © {new Date().getFullYear()} {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;