import React, { useState } from "react";

export default function AddContactForm({ AddContact, bgtheme, FontColor }) {
    const [formData, setFormData] = useState({
        officeName: "",
        city: "",
        postalCode: "",
        phones: [""],
        hotlines: [""],
        emails: [""],
        officeHours: [
            { day: "Mon-Thu", open: "", close: "" },
            { day: "Fri", open: "", close: "" },
            { day: "Sat", open: "", close: "" },
            { day: "Sun", open: "", close: "" },
        ],
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const handleArrayChange = (index, e, field) => {
        const updated = [...formData[field]];
        updated[index] = e.target.value;
        setFormData({ ...formData, [field]: updated });
        
        // Clear error when user starts typing in email field
        if (field === "emails" && errors.emails) {
            setErrors({ ...errors, emails: "" });
        }
    };

    const addArrayField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ""] });
    };

    const handleOfficeHoursChange = (index, key, e) => {
        const updated = [...formData.officeHours];
        updated[index][key] = e.target.value;
        setFormData({ ...formData, officeHours: updated });
    };

    const validateForm = () => {
        const newErrors = {};

        // Required field validation
        if (!formData.officeName.trim()) {
            newErrors.officeName = "Office name is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.postalCode.trim()) {
            newErrors.postalCode = "Postal code is required";
        }

        // Email validation - at least one email is required
        const validEmails = formData.emails.filter(email => email.trim() !== "");
        if (validEmails.length === 0) {
            newErrors.emails = "At least one email is required";
        } else {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            for (let email of validEmails) {
                if (!emailRegex.test(email)) {
                    newErrors.emails = "Please enter valid email addresses";
                    break;
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            await AddContact(formData);
            setFormData({
                officeName: "",
                city: "",
                postalCode: "",
                phones: [""],
                hotlines: [""],
                emails: [""],
                officeHours: [
                    { day: "Mon-Thu", open: "", close: "" },
                    { day: "Fri", open: "", close: "" },
                    { day: "Sat", open: "", close: "" },
                    { day: "Sun", open: "", close: "" },
                ],
            });
            setErrors({});
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-lg bg-white p-4 shadow dark:bg-slate-800 dark:shadow-slate-900/30 sm:p-5 md:p-6"
        >
            <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100 sm:mb-5 sm:text-lg">Add Contact Info</h2>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
                {/* Left Column */}
                <div className="space-y-4 sm:space-y-5">
                    {/* Office Name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Our Office <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="officeName"
                            value={formData.officeName}
                            onChange={handleChange}
                            className={`w-full rounded border bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 sm:px-3 sm:py-2 ${
                                errors.officeName 
                                ? "border-red-500 dark:border-red-400" 
                                : "border-slate-300 dark:border-slate-600"
                            }`}
                            placeholder="P.Inocentes St.Brgy. P.I Garcia, Naval, Philippines"
                            required
                        />
                        {errors.officeName && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.officeName}</p>
                        )}
                    </div>

                    {/* City & Postal Code */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full rounded border bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 sm:px-3 sm:py-2 ${
                                    errors.city 
                                    ? "border-red-500 dark:border-red-400" 
                                    : "border-slate-300 dark:border-slate-600"
                                }`}
                                required
                            />
                            {errors.city && (
                                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.city}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Postal Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className={`w-full rounded border bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 sm:px-3 sm:py-2 ${
                                    errors.postalCode 
                                    ? "border-red-500 dark:border-red-400" 
                                    : "border-slate-300 dark:border-slate-600"
                                }`}
                                required
                            />
                            {errors.postalCode && (
                                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.postalCode}</p>
                            )}
                        </div>
                    </div>

                    {/* Phones */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Phones</label>
                        <div className="space-y-2">
                            {formData.phones.map((phone, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={phone}
                                    onChange={(e) => handleArrayChange(i, e, "phones")}
                                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 sm:px-3 sm:py-2"
                                    placeholder="(02) 8123-4567"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => addArrayField("phones")}
                            className="mt-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 sm:text-sm"
                        >
                            + Add Phone
                        </button>
                    </div>

                    {/* Hotlines */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Hotlines</label>
                        <div className="space-y-2">
                            {formData.hotlines.map((hotline, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={hotline}
                                    onChange={(e) => handleArrayChange(i, e, "hotlines")}
                                    className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 sm:px-3 sm:py-2"
                                    placeholder="0917-123-4567"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => addArrayField("hotlines")}
                            className="mt-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 sm:text-sm"
                        >
                            + Add Hotline
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-5">
                    {/* Emails */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Emails <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            {formData.emails.map((email, i) => (
                                <input
                                    key={i}
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleArrayChange(i, e, "emails")}
                                    className={`w-full rounded border bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 sm:px-3 sm:py-2 ${
                                        errors.emails 
                                        ? "border-red-500 dark:border-red-400" 
                                        : "border-slate-300 dark:border-slate-600"
                                    }`}
                                    placeholder="info@lgu-san-jose.gov.ph"
                                />
                            ))}
                        </div>
                        {errors.emails && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.emails}</p>
                        )}
                        <button
                            type="button"
                            onClick={() => addArrayField("emails")}
                            className="mt-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 sm:text-sm"
                        >
                            + Add Email
                        </button>
                    </div>

                    {/* Office Hours */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Office Hours</label>
                        <div className="space-y-2.5">
                            {formData.officeHours.map((hour, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-2 sm:gap-3"
                                >
                                    <span className="mt-1 min-w-[60px] text-xs font-medium text-slate-700 dark:text-slate-300 sm:text-sm">
                                        {hour.day}
                                    </span>
                                    <div className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:gap-2">
                                        <input
                                            type="text"
                                            value={hour.open}
                                            onChange={(e) => handleOfficeHoursChange(i, "open", e)}
                                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 sm:px-2.5 sm:py-1.5 sm:text-sm"
                                            placeholder="8:00 AM"
                                        />
                                        <input
                                            type="text"
                                            value={hour.close}
                                            onChange={(e) => handleOfficeHoursChange(i, "close", e)}
                                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 sm:px-2.5 sm:py-1.5 sm:text-sm"
                                            placeholder="5:00 PM"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5 flex justify-center sm:mt-6">
                <button
                    type="submit"
                    style={{background:bgtheme,color:FontColor}}
                    className="rounded px-4 py-1.5 text-sm font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-slate-800 sm:px-6 sm:py-2 sm:text-base"
                >
                    Save Contact Info
                </button>
            </div>
        </form>
    );
}