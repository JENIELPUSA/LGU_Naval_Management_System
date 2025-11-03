import React, { useState, forwardRef, useContext } from "react";
import { ContactContext } from "../../contexts/ContactContext/ContactInfoContext";
import { useAccessibility } from "./NavHeader"; // Import the accessibility hook

const ContactUsForm = forwardRef((props, ref, bgtheme, FontColor) => {
    const { displayContact } = useContext(ContactContext);
    const accessibility = useAccessibility(); // Use the accessibility hook

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const t = (key) => {
        const translations = {
            en: {
                contactUs: "Contact Us",
                contactDescription: "Get in touch with our Local Government Unit for any inquiries or feedback.",
                getInTouch: "Get In Touch",
                ourOffice: "Our Office",
                phone: "Phone",
                hotlines: "Hotlines",
                email: "Email",
                officeHours: "Office Hours",
                sendMessage: "Send a Message",
                fullName: "Full Name",
                enterFullName: "Enter your full name",
                enterEmail: "Enter your email",
                enterPhone: "Enter your phone number",
                subject: "Subject",
                selectSubject: "Select a subject",
                message: "Message",
                enterMessage: "Enter your message",
                send: "Send",
                generalInquiry: "General Inquiry",
                complaint: "Complaint",
                suggestion: "Suggestion",
                serviceRequest: "Service Request",
                other: "Other",
                thankYou: "Thank you",
                messageSent: "Your message has been sent.",
                closed: "Closed",
                mainOffice: "Main Office",
                requiredField: "This field is required",
                invalidEmail: "Please enter a valid email address",
                invalidPhone: "Please enter a valid phone number",
                contactInformation: "Contact Information",
                contactForm: "Contact Form",
            },
            tl: {
                contactUs: "Makipag-ugnayan",
                contactDescription: "Makipag-ugnayan sa aming Local Government Unit para sa anumang mga katanungan o feedback.",
                getInTouch: "Makipag-ugnayan",
                ourOffice: "Aming Opisina",
                phone: "Telepono",
                hotlines: "Mga Hotline",
                email: "Email",
                officeHours: "Oras ng Opisina",
                sendMessage: "Magpadala ng Mensahe",
                fullName: "Buong Pangalan",
                enterFullName: "Ilagay ang iyong buong pangalan",
                enterEmail: "Ilagay ang iyong email",
                enterPhone: "Ilagay ang iyong numero ng telepono",
                subject: "Paksa",
                selectSubject: "Pumili ng paksa",
                message: "Mensahe",
                enterMessage: "Ilagay ang iyong mensahe",
                send: "Ipadala",
                generalInquiry: "Pangkalahatang Tanong",
                complaint: "Reklamo",
                suggestion: "Mungkahi",
                serviceRequest: "Kahilingan ng Serbisyo",
                other: "Iba Pa",
                thankYou: "Salamat",
                messageSent: "Ang iyong mensahe ay naipadala na.",
                closed: "Sarado",
                mainOffice: "Pangunahing Opisina",
                requiredField: "Kinakailangan ang field na ito",
                invalidEmail: "Pakilagay ng wastong email address",
                invalidPhone: "Pakilagay ng wastong numero ng telepono",
                contactInformation: "Impormasyon ng Kontak",
                contactForm: "Form ng Kontak",
            },
        };
        return translations[accessibility.language]?.[key] || translations.en[key] || key;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Speak the field name and value for screen readers
        if (accessibility.isTextToSpeech) {
            const fieldName = t(name) || name;
            accessibility.speakText(`${fieldName}: ${value}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const successMessage = `${t("thankYou")}, ${formData.fullName}! ${t("messageSent")}`;
        alert(successMessage);
        accessibility.speakText(successMessage);
        setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
    };

    // Check if displayContact exists and has data
    const hasContactData = displayContact && displayContact.officeName;

    // Form fields configuration
    const formFields = [
        { label: t("fullName"), name: "fullName", type: "text", required: true, placeholder: t("enterFullName") },
        { label: t("email"), name: "email", type: "email", required: true, placeholder: t("enterEmail") },
        { label: t("phone"), name: "phone", type: "tel", placeholder: t("enterPhone") },
    ];

    const subjectOptions = [
        { value: "general", label: t("generalInquiry") },
        { value: "complaint", label: t("complaint") },
        { value: "suggestion", label: t("suggestion") },
        { value: "service", label: t("serviceRequest") },
        { value: "other", label: t("other") },
    ];

    // Fallback office hours
    const fallbackOfficeHours = [
        { day: "Mon-Thu", time: "8:00 AM - 5:00 PM" },
        { day: "Fri", time: "8:00 AM - 4:00 PM" },
        { day: "Sat", time: "9:00 AM - 12:00 PM" },
        { day: "Sun", time: t("closed") },
    ];

    // High contrast color scheme
    const getHighContrastColors = () => {
        if (accessibility.isHighContrast) {
            return {
                background: "bg-white",
                textPrimary: "text-black font-bold",
                textSecondary: "text-gray-800 font-medium",
                gradient: "from-white to-gray-100",
                accent: "text-blue-800 font-bold",
                border: "border-gray-700",
                sectionBackground: "bg-white",
                cardBackground: "bg-white",
                shadow: "shadow-md",
                inputBackground: "bg-white",
                inputBorder: "border-2 border-gray-800",
                inputFocusBorder: "border-2 border-black",
                inputText: "text-black",
                labelText: "text-black font-bold",
                buttonBackground: "bg-black",
                buttonText: "text-white font-bold",
                iconBackground: "bg-gray-200",
                iconText: "text-black",
            };
        }

        return {
            background: "bg-gray-50",
            textPrimary: "text-blue-800 font-semibold",
            textSecondary: "text-gray-700",
            gradient: "from-blue-50 to-gray-100",
            accent: "text-pink-600",
            border: "border-gray-200",
            sectionBackground: "bg-white",
            cardBackground: "bg-white",
            shadow: "shadow-lg",
            inputBackground: "bg-white",
            inputBorder: "border border-gray-400",
            inputFocusBorder: "border-2 border-blue-500",
            inputText: "text-gray-700",
            labelText: "text-gray-700",
            buttonBackground: bgtheme,
            buttonText: FontColor,
            iconBackground: "bg-blue-50",
            iconText: "text-blue-700",
        };
    };

    const colors = getHighContrastColors();

    return (
        <div
            ref={ref}
            className={`min-h-screen ${colors.background} py-8`}
            style={{
                fontFamily: accessibility.fontType === "dyslexia" ? "'OpenDyslexic', Arial, sans-serif" : "inherit",
            }}
        >
            <div className="mx-auto max-w-6xl px-4">
                {/* Title */}
                <div className="mb-8 text-center">
                    <h2
                        className={`mb-2 text-3xl font-bold ${colors.textPrimary} ${
                            accessibility.isHighContrast ? "" : "bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent"
                        }`}
                        onFocus={() => accessibility.speakText(t("contactUs"))}
                    >
                        {t("contactUs")}
                    </h2>
                    <p className={`mx-auto max-w-2xl text-sm md:text-base ${colors.textSecondary}`}>{t("contactDescription")}</p>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Contact Info */}
                    <div
                        className={`flex-1 rounded-xl ${colors.cardBackground} p-5 ${colors.shadow} ${colors.border}`}
                        role="complementary"
                        aria-label={t("contactInformation")}
                    >
                        <h3
                            className={`mb-4 text-xl font-bold ${colors.textPrimary}`}
                            onFocus={() => accessibility.speakText(t("getInTouch"))}
                        >
                            {t("getInTouch")}
                        </h3>
                        <div className={`space-y-4 text-sm ${colors.textSecondary}`}>
                            {/* Office Address */}
                            <div
                                className="flex items-start"
                                onFocus={() =>
                                    accessibility.speakText(`${t("ourOffice")}: ${hasContactData ? displayContact.officeName : t("mainOffice")}`)
                                }
                            >
                                <div
                                    className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${colors.iconBackground} text-lg ${colors.iconText}`}
                                    aria-hidden="true"
                                >
                                    📍
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${colors.textPrimary}`}>{t("ourOffice")}</h4>
                                    <p>
                                        {hasContactData ? (
                                            <>
                                                {displayContact.officeName}
                                                <br />
                                                {displayContact.city}
                                                {displayContact.postalCode && `, ${displayContact.postalCode}`}
                                            </>
                                        ) : (
                                            "Municipal Hall Building, Plaza Central, San Jose, 1234"
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Phone Numbers */}
                            <div
                                className="flex items-start"
                                onFocus={() =>
                                    accessibility.speakText(
                                        `${t("phone")}: ${hasContactData && displayContact.phones ? displayContact.phones.join(", ") : "Main: (02) 8123-4567"}`,
                                    )
                                }
                            >
                                <div
                                    className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${colors.iconBackground} text-lg ${colors.iconText}`}
                                    aria-hidden="true"
                                >
                                    📞
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${colors.textPrimary}`}>{t("phone")}</h4>
                                    <p>
                                        {hasContactData && displayContact.phones && displayContact.phones.length > 0 ? (
                                            <>
                                                {displayContact.phones.map((phone, index) => (
                                                    <span key={index}>
                                                        {phone}
                                                        <br />
                                                    </span>
                                                ))}
                                            </>
                                        ) : (
                                            "Main: (02) 8123-4567"
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Hotlines */}
                            {hasContactData && displayContact.hotlines && displayContact.hotlines.length > 0 && (
                                <div
                                    className="flex items-start"
                                    onFocus={() => accessibility.speakText(`${t("hotlines")}: ${displayContact.hotlines.join(", ")}`)}
                                >
                                    <div
                                        className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${
                                            accessibility.isHighContrast ? "bg-gray-200" : "bg-red-50"
                                        } text-lg ${accessibility.isHighContrast ? "text-black" : "text-red-700"}`}
                                        aria-hidden="true"
                                    >
                                        🆘
                                    </div>
                                    <div>
                                        <h4 className={`font-semibold ${colors.textPrimary}`}>{t("hotlines")}</h4>
                                        <p>
                                            {displayContact.hotlines.map((hotline, index) => (
                                                <span key={index}>
                                                    {hotline}
                                                    <br />
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Emails */}
                            <div
                                className="flex items-start"
                                onFocus={() =>
                                    accessibility.speakText(
                                        `${t("email")}: ${hasContactData && displayContact.emails ? displayContact.emails.join(", ") : "info@lgu-san-jose.gov.ph, support@lgu-san-jose.gov.ph"}`,
                                    )
                                }
                            >
                                <div
                                    className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${colors.iconBackground} text-lg ${colors.iconText}`}
                                    aria-hidden="true"
                                >
                                    ✉️
                                </div>
                                <div>
                                    <h4 className={`font-semibold ${colors.textPrimary}`}>{t("email")}</h4>
                                    <p>
                                        {hasContactData && displayContact.emails && displayContact.emails.length > 0 ? (
                                            <>
                                                {displayContact.emails.map((email, index) => (
                                                    <span key={index}>
                                                        {email}
                                                        <br />
                                                    </span>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                info@lgu-san-jose.gov.ph
                                                <br />
                                                support@lgu-san-jose.gov.ph
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Office Hours */}
                        <div className={`mt-5 border-t ${colors.border} pt-4 text-sm`}>
                            <h4
                                className={`mb-2 font-bold ${colors.textPrimary}`}
                                onFocus={() => accessibility.speakText(t("officeHours"))}
                            >
                                {t("officeHours")}
                            </h4>
                            {hasContactData && displayContact.officeHours
                                ? displayContact.officeHours.map((schedule, index) => (
                                      <div
                                          key={index}
                                          className="flex justify-between"
                                          onFocus={() =>
                                              accessibility.speakText(
                                                  `${schedule.day}: ${schedule.open && schedule.close ? `${schedule.open} - ${schedule.close}` : t("closed")}`,
                                              )
                                          }
                                      >
                                          <span>{schedule.day}</span>
                                          <span className={`font-medium ${colors.textSecondary}`}>
                                              {schedule.open && schedule.close ? `${schedule.open} - ${schedule.close}` : t("closed")}
                                          </span>
                                      </div>
                                  ))
                                : // Fallback office hours if no data
                                  fallbackOfficeHours.map((schedule, index) => (
                                      <div
                                          key={index}
                                          className="flex justify-between"
                                          onFocus={() => accessibility.speakText(`${schedule.day}: ${schedule.time}`)}
                                      >
                                          <span>{schedule.day}</span>
                                          <span className={`font-medium ${colors.textSecondary}`}>{schedule.time}</span>
                                      </div>
                                  ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div
                        className={`flex-1 rounded-xl ${colors.cardBackground} p-5 ${colors.shadow} ${colors.border}`}
                        role="form"
                        aria-label={t("contactForm")}
                    >
                        <h3
                            className={`mb-4 text-xl font-bold ${colors.textPrimary}`}
                            onFocus={() => accessibility.speakText(t("sendMessage"))}
                        >
                            {t("sendMessage")}
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-3 text-sm"
                            noValidate
                        >
                            {formFields.map((field, index) => (
                                <div key={index}>
                                    <label
                                        htmlFor={field.name}
                                        className={`mb-1 block font-medium ${colors.labelText}`}
                                    >
                                        {field.label}
                                        {field.required && (
                                            <span
                                                className="ml-1 text-red-500"
                                                aria-hidden="true"
                                            >
                                                *
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        className={`w-full rounded ${colors.inputBorder} ${colors.inputBackground} px-3 py-2 ${colors.inputText} transition-all focus:${colors.inputFocusBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        aria-required={field.required}
                                        aria-invalid={field.required && !formData[field.name] ? "true" : "false"}
                                    />
                                </div>
                            ))}

                            <div>
                                <label
                                    htmlFor="subject"
                                    className={`mb-1 block font-medium ${colors.labelText}`}
                                >
                                    {t("subject")}
                                    <span
                                        className="ml-1 text-red-500"
                                        aria-hidden="true"
                                    >
                                        *
                                    </span>
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className={`w-full rounded ${colors.inputBorder} ${colors.inputBackground} px-3 py-2 ${colors.inputText} transition-all focus:${colors.inputFocusBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    aria-required="true"
                                    aria-invalid={!formData.subject ? "true" : "false"}
                                >
                                    <option
                                        value=""
                                        disabled
                                    >
                                        {t("selectSubject")}
                                    </option>
                                    {subjectOptions.map((option, index) => (
                                        <option
                                            key={index}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className={`mb-1 block font-medium ${colors.labelText}`}
                                >
                                    {t("message")}
                                    <span
                                        className="ml-1 text-red-500"
                                        aria-hidden="true"
                                    >
                                        *
                                    </span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder={t("enterMessage")}
                                    required
                                    className={`w-full rounded ${colors.inputBorder} ${colors.inputBackground} px-3 py-2 ${colors.inputText} transition-all focus:${colors.inputFocusBorder} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    aria-required="true"
                                    aria-invalid={!formData.message ? "true" : "false"}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                style={{ background: bgtheme, color: FontColor }}
                                className="w-full rounded py-2 font-semibold shadow transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onFocus={() => accessibility.speakText(t("send"))}
                            >
                                {t("send")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ContactUsForm;