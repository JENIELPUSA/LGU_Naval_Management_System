import React from "react";
import { Facebook, Globe, Mail, Phone, MapPin } from "lucide-react";
import { useAccessibility } from "./NavHeader"; // Import the accessibility hook

export default function App({ profile }) {
  const accessibility = useAccessibility(); // Use the accessibility hook

  // Translation function for this component
  const t = (key) => {
    const translations = {
      en: {
        loadingProfile: "Loading profile...",
        officeOf: "Office of the",
        biography: "Biography",
        facebook: "Facebook",
        email: "Email",
        contactInformation: "Contact Information",
        address: "Address",
        landline: "Landline",
        mobile: "Mobile",
        emailAddress: "Email Address",
        visitFacebook: "Visit Facebook profile",
        sendEmail: "Send email",
        profileImage: "Profile image of",
        noBiography: "No biography available.",
        noAddress: "Address not available",
        noContact: "No contact information available",
        skipToContent: "Skip to main content",
        mainContent: "Main content - Governor Profile",
        governorProfile: "Governor Profile",
        socialMediaLinks: "Social media links",
        contactDetails: "Contact details"
      },
      tl: {
        loadingProfile: "Naglo-load ng profile...",
        officeOf: "Opisina ng",
        biography: "Talambuhay",
        facebook: "Facebook",
        email: "Email",
        contactInformation: "Impormasyon ng Kontak",
        address: "Address",
        landline: "Landline",
        mobile: "Mobile",
        emailAddress: "Email Address",
        visitFacebook: "Bisitahin ang Facebook profile",
        sendEmail: "Magpadala ng email",
        profileImage: "Larawan ng profile ni",
        noBiography: "Walang available na talambuhay.",
        noAddress: "Walang available na address",
        noContact: "Walang available na impormasyon ng kontak",
        skipToContent: "Laktawan sa pangunahing content",
        mainContent: "Pangunahing content - Profile ng Gobernador",
        governorProfile: "Profile ng Gobernador",
        socialMediaLinks: "Mga social media link",
        contactDetails: "Mga detalye ng kontak"
      }
    };
    return translations[accessibility.language]?.[key] || translations.en[key] || key;
  };

  // High contrast color scheme
  const getHighContrastColors = () => {
    if (accessibility.isHighContrast) {
      return {
        background: "bg-white",
        textPrimary: "text-black font-bold",
        textSecondary: "text-gray-800 font-medium",
        accent: "text-blue-800 font-bold",
        border: "border-2 border-gray-800",
        cardBackground: "bg-white",
        button: {
          facebook: "bg-blue-800 text-white border-2 border-black font-bold",
          email: "bg-red-800 text-white border-2 border-black font-bold"
        },
        hover: {
          facebook: "hover:bg-blue-900",
          email: "hover:bg-red-900"
        },
        focusRing: "focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
      };
    }
    
    return {
      background: "bg-gray-100",
      textPrimary: "text-blue-800 font-semibold",
      textSecondary: "text-gray-600",
      accent: "text-blue-800",
      border: "border border-gray-300",
      cardBackground: "bg-white",
      button: {
        facebook: "bg-blue-700 text-white",
        email: "bg-red-600 text-white"
      },
      hover: {
        facebook: "hover:bg-blue-800",
        email: "hover:bg-red-700"
      },
      focusRing: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    };
  };

  const colors = getHighContrastColors();

  if (!profile) {
    return (
      <div 
        className={`min-h-screen ${colors.background} py-8 px-4`}
        style={{
          fontFamily: accessibility.fontType === 'dyslexia' ? 'OpenDyslexic, Arial, sans-serif' : 
                      accessibility.fontType === 'arial' ? 'Arial, sans-serif' : 'inherit',
          fontSize: `${accessibility.fontSize}px`
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p className={colors.textSecondary}>{t('loadingProfile')}</p>
        </div>
      </div>
    );
  }

  const governorData = {
    name: profile.name,
    title: profile.position,
    image: profile.avatar?.url || "https://placehold.co/200x250",
    bioSummary: [profile.biography?.split("\n")[0] || t('noBiography')],
    biography: profile.biography
      ? profile.biography.split("\n").slice(1)
      : [],
    socialLinks: {
      facebook: profile.socialLinks?.facebook
        ? `https://www.facebook.com/${profile.socialLinks.facebook}`
        : "#",
      website: profile.socialLinks?.gmail
        ? `mailto:${profile.socialLinks.gmail}`
        : "#",
    },
  };

  const officeInfo = {
    title: `${t('officeOf')} ${profile.position}`,
    address: profile.contactInfo?.address || t('noAddress'),
    landline: profile.contactInfo?.landline || "N/A",
    mobile: profile.contactInfo?.mobile ? [profile.contactInfo.mobile] : [],
    email: profile.socialLinks?.gmail || "N/A",
  };

  const handleNameFocus = () => {
    accessibility.speakText(`${governorData.name}, ${governorData.title}`);
  };

  const handleFacebookFocus = () => {
    accessibility.speakText(`${t('facebook')}: ${t('visitFacebook')}`);
  };

  const handleEmailFocus = () => {
    accessibility.speakText(`${t('email')}: ${t('sendEmail')}`);
  };

  const handleBiographyFocus = () => {
    accessibility.speakText(t('biography'));
  };

  const handleContactFocus = () => {
    accessibility.speakText(t('contactInformation'));
  };

  return (
    <div 
      className={`min-h-screen ${colors.background} py-8 px-4`}
      style={{
        fontFamily: accessibility.fontType === 'dyslexia' ? 'OpenDyslexic, Arial, sans-serif' : 
                    accessibility.fontType === 'arial' ? 'Arial, sans-serif' : 'inherit',
        fontSize: `${accessibility.fontSize}px`
      }}
      role="main"
      aria-label={t('governorProfile')}
    >
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50"
        onFocus={() => accessibility.speakText(t('skipToContent'))}
        style={accessibility.isHighContrast ? { background: '#ffff00', color: '#000000', border: '2px solid #000000' } : {}}
      >
        {t('skipToContent')}
      </a>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div id="main-content" className="mb-6">
          <h1 
            className={`text-2xl font-bold ${colors.textPrimary} mb-1`}
            onFocus={handleNameFocus}
            tabIndex={0}
          >
            {governorData.name}
          </h1>
          <p className={`text-lg ${colors.textSecondary} mb-6`}>
            {governorData.title}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Left Column */}
          <div className={`flex-1 ${colors.cardBackground} p-6 rounded-2xl ${colors.border}`}>
            <div className="space-y-4">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={governorData.image}
                  alt={`${t('profileImage')} ${governorData.name}`}
                  className="w-48 h-64 object-cover border border-gray-300 rounded-2xl flex-shrink-0"
                  onFocus={() => accessibility.speakText(`${t('profileImage')} ${governorData.name}`)}
                />
                <div className={`${colors.cardBackground} p-4 ${colors.border} rounded-2xl flex-1`}>
                  {governorData.bioSummary.map((para, i) => (
                    <p 
                      key={i} 
                      className={`mb-3 leading-relaxed text-sm ${colors.textSecondary}`}
                      style={{ lineHeight: '1.6' }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Social Buttons */}
              <div 
                className="flex gap-3"
                role="group"
                aria-label={t('socialMediaLinks')}
              >
                <a
                  href={governorData.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 ${colors.button.facebook} ${colors.hover.facebook} px-4 py-2 rounded-2xl font-bold transition-colors ${colors.focusRing} focus:outline-none`}
                  onFocus={handleFacebookFocus}
                  aria-label={`${t('facebook')} - ${t('visitFacebook')}`}
                >
                  <Facebook className="w-4 h-4" />
                  {t('facebook')}
                </a>
                <a
                  href={governorData.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 ${colors.button.email} ${colors.hover.email} px-4 py-2 rounded-2xl font-bold transition-colors ${colors.focusRing} focus:outline-none`}
                  onFocus={handleEmailFocus}
                  aria-label={`${t('email')} - ${t('sendEmail')}`}
                >
                  <Globe className="w-4 h-4" />
                  {t('email')}
                </a>
              </div>

              {/* Biography Section */}
              {governorData.biography.length > 0 && (
                <div>
                  <h2 
                    className={`text-xl font-bold ${colors.textPrimary} pb-2 border-b-2 border-blue-800 mb-4`}
                    onFocus={handleBiographyFocus}
                    tabIndex={0}
                  >
                    {t('biography')}
                  </h2>
                  <div 
                    className="space-y-3 text-justify leading-relaxed text-sm"
                    style={{ lineHeight: '1.6' }}
                  >
                    {governorData.biography.map((para, i) => (
                      <p 
                        key={i} 
                        className={colors.textSecondary}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Contact Information */}
          <div className="w-full lg:w-64 space-y-6">
            <div 
              className={`${colors.cardBackground} p-4 ${colors.border} rounded-2xl`}
              role="complementary"
              aria-label={t('contactDetails')}
            >
              <h3 
                className={`${colors.textPrimary} font-bold mb-3`}
                onFocus={handleContactFocus}
                tabIndex={0}
              >
                {officeInfo.title}
              </h3>
              <div className={`text-sm leading-relaxed ${colors.textSecondary} space-y-2`}>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>{t('address')}:</strong> {officeInfo.address}
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>{t('landline')}:</strong> {officeInfo.landline}
                  </div>
                </div>
                
                {officeInfo.mobile.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>{t('mobile')}:</strong> {officeInfo.mobile.join(" / ")}
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>{t('emailAddress')}:</strong> {officeInfo.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}