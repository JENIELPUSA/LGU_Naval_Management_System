import React, { useRef, useState, useEffect } from "react";

export default function AddPersonnelForm({ setShowModal, AddPersonel, editingProfile, UpdatePersonel, bgtheme, FontColor }) {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState("basic");

    const [formData, setFormData] = useState({
        name: "",
        position: "Mayor",
        biography: "",
        fromColor: "#1e40af",
        toColor: "#ec4899",
        fontColor: "#ffffff",
        gmail: "",
        facebook: "",
        landline: "",
        mobile: "",
        termFrom: new Date().getFullYear(),
        termTo: new Date().getFullYear() + 3,
    });

    useEffect(() => {
        if (editingProfile) {
            let fromColor = "#1e40af";
            let toColor = "#ec4899";
            let fontColor = "#ffffff";

            if (editingProfile.colortheme) {
                const colorMatch = editingProfile.colortheme.match(/#[a-fA-F0-9]{6}/g);
                if (colorMatch && colorMatch.length >= 2) {
                    fromColor = colorMatch[0];
                    toColor = colorMatch[1];
                }
            }

            if (editingProfile.fontColor) {
                fontColor = editingProfile.fontColor;
            }

            setFormData({
                name: editingProfile.name || "",
                position: editingProfile.position || "Mayor",
                biography: editingProfile.biography || "",
                fromColor: fromColor,
                toColor: toColor,
                fontColor: fontColor,
                gmail: editingProfile.socialLinks?.gmail || "",
                facebook: editingProfile.socialLinks?.facebook || "",
                landline: editingProfile.contactInfo?.landline || "",
                mobile: editingProfile.contactInfo?.mobile || "",
                termFrom: editingProfile.termFrom || new Date().getFullYear(),
                termTo: editingProfile.termTo || new Date().getFullYear() + 3,
            });
            setFile(null);
        } else {
            setFormData({
                name: "",
                position: "Mayor",
                biography: "",
                fromColor: "#1e40af",
                toColor: "#ec4899",
                fontColor: "#ffffff",
                gmail: "",
                facebook: "",
                landline: "",
                mobile: "",
                termFrom: new Date().getFullYear(),
                termTo: new Date().getFullYear() + 3,
            });
            setFile(null);
        }
    }, [editingProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        if (!validTypes.includes(selectedFile.type)) {
            alert("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
            return;
        }

        if (selectedFile.size > maxSize) {
            alert("File size must be less than 5MB");
            return;
        }

        setFile(selectedFile);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Please enter a name");
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            if (editingProfile && editingProfile._id) {
                formDataToSend.append("_id", editingProfile._id);
            }

            if (file) {
                formDataToSend.append("avatar", file);
            }

            formDataToSend.append("name", formData.name.trim());
            formDataToSend.append("position", formData.position);
            formDataToSend.append("biography", formData.biography.trim());
            formDataToSend.append("colortheme", `linear-gradient(to right, ${formData.fromColor}, ${formData.toColor})`);
            formDataToSend.append("fontColor", formData.fontColor);
            formDataToSend.append("termFrom", formData.termFrom);
            formDataToSend.append("termTo", formData.termTo);

            formDataToSend.append(
                "socialLinks",
                JSON.stringify({
                    gmail: formData.gmail.trim(),
                    facebook: formData.facebook.trim(),
                }),
            );
            formDataToSend.append(
                "contactInfo",
                JSON.stringify({
                    landline: formData.landline.trim(),
                    mobile: formData.mobile.trim(),
                }),
            );

            if (editingProfile && editingProfile._id) {
                await UpdatePersonel(editingProfile._id, formDataToSend);
            } else {
                await AddPersonel(formDataToSend);
            }

            setShowModal(false);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error submitting form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };

    const sectionButtons = [
        { id: "basic", label: "Basic", icon: "👤" },
        { id: "appearance", label: "Theme", icon: "🎨" },
        { id: "contact", label: "Contact", icon: "📞" },
    ];

    const displayAvatar = () => {
        if (file) {
            return URL.createObjectURL(file);
        }
        if (editingProfile?.avatar?.url) {
            return editingProfile.avatar.url;
        }
        return null;
    };

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-black/60 p-2 sm:p-4"
            onClick={handleBackdropClick}
        >
            <div className="mx-2 w-full max-w-5xl rounded-2xl bg-white shadow-2xl dark:bg-gray-800 sm:mx-0">
                {/* Header - Sticky on mobile */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-lg font-bold text-gray-800 dark:text-white sm:text-2xl">
                            {editingProfile ? "Edit Personnel" : "Add New Personnel"}
                        </h2>
                        <p className="mt-1 hidden text-sm text-gray-600 dark:text-gray-400 sm:block">
                            {editingProfile
                                ? "Update the details below for this personnel member"
                                : "Fill in the details below to add a new personnel member"}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(false)}
                        className="ml-4 flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <svg
                            className="h-5 w-5 text-gray-500 sm:h-6 sm:w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex max-h-[80vh] flex-col overflow-hidden lg:flex-row">
                    {/* LEFT SIDE - Profile Picture & Navigation - Hidden on mobile, shown on desktop */}
                    <div className="hidden flex-col space-y-6 overflow-y-auto border-r border-gray-200 p-6 dark:border-gray-700 lg:flex lg:w-1/3">
                        {/* Profile Upload */}
                        <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/50">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Profile Picture</h3>

                            <div className="group relative mb-4">
                                <div
                                    className="relative mx-auto flex size-32 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white transition-all duration-200 hover:bg-gray-50 group-hover:scale-105 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                                    onClick={handleUploadClick}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && handleUploadClick()}
                                >
                                    {displayAvatar() ? (
                                        <>
                                            <img
                                                src={displayAvatar()}
                                                alt="Profile preview"
                                                className="size-full rounded-full object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                <span className="text-sm font-medium text-white">
                                                    {editingProfile && !file ? "Change" : "Change"}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="mb-2 size-8 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                                                />
                                            </svg>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Upload Photo</p>
                                        </>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                Click to upload photo (Max: 5MB)
                                <br />
                                Recommended: 1:1 aspect ratio
                            </p>
                        </div>

                        {/* Navigation */}
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                            <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">Sections</h3>
                            <div className="space-y-2">
                                {sectionButtons.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                            activeSection === section.id
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        <span className="text-base">{section.icon}</span>
                                        {section.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Form Fields */}
                    <div className="flex-1 overflow-y-auto">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 p-4 sm:p-6"
                        >
                            {/* Mobile Profile Upload - Only shown on mobile */}
                            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50 lg:hidden">
                                <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">Profile Picture</h3>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="relative flex size-16 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white transition-all duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        onClick={handleUploadClick}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === "Enter" && handleUploadClick()}
                                    >
                                        {displayAvatar() ? (
                                            <>
                                                <img
                                                    src={displayAvatar()}
                                                    alt="Profile preview"
                                                    className="size-full rounded-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 hover:opacity-100">
                                                    <span className="text-xs font-medium text-white">Change</span>
                                                </div>
                                            </>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="size-6 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">Tap to upload photo (Max: 5MB)</p>
                                        <button
                                            type="button"
                                            onClick={handleUploadClick}
                                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                        >
                                            {displayAvatar() ? "Change Photo" : "Upload Photo"}
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Mobile Navigation Tabs - Only shown on mobile */}
                            <div className="lg:hidden">
                                <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-700">
                                    {sectionButtons.map((section) => (
                                        <button
                                            key={section.id}
                                            type="button"
                                            onClick={() => setActiveSection(section.id)}
                                            className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                                                activeSection === section.id
                                                    ? "bg-white text-blue-700 shadow-sm dark:bg-gray-600 dark:text-blue-300"
                                                    : "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            }`}
                                        >
                                            <span>{section.icon}</span>
                                            <span>{section.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Basic Information Section */}
                            {(activeSection === "basic" || activeSection === "all") && (
                                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50 sm:p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-white sm:text-lg">
                                        <span>👤</span>
                                        Basic Information
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter full name"
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="position"
                                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Position
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="position"
                                                    name="position"
                                                    value={formData.position}
                                                    onChange={handleChange}
                                                    className="w-full appearance-none rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="Mayor">Mayor</option>
                                                    <option value="Vice-Mayor">Vice-Mayor</option>
                                                    <option value="Councilor">Councilor</option>
                                                    <option value="Secretary">Secretary</option>
                                                    <option value="Treasurer">Treasurer</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="term"
                                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Term Period
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <input
                                                        type="number"
                                                        name="termFrom"
                                                        value={formData.termFrom}
                                                        onChange={handleChange}
                                                        min="2000"
                                                        max="2100"
                                                        placeholder="From"
                                                        className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        name="termTo"
                                                        value={formData.termTo}
                                                        onChange={handleChange}
                                                        min="2000"
                                                        max="2100"
                                                        placeholder="To"
                                                        className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="biography"
                                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Biography
                                            </label>
                                            <textarea
                                                id="biography"
                                                name="biography"
                                                value={formData.biography}
                                                onChange={handleChange}
                                                placeholder="Enter biography and description..."
                                                rows="3"
                                                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contact Information Section */}
                            {(activeSection === "contact" || activeSection === "all") && (
                                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50 sm:p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-white sm:text-lg">
                                        <span>📞</span>
                                        Contact Information
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label
                                                htmlFor="gmail"
                                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Gmail
                                            </label>
                                            <input
                                                id="gmail"
                                                type="email"
                                                name="gmail"
                                                placeholder="email@gmail.com"
                                                value={formData.gmail}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="facebook"
                                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Facebook
                                            </label>
                                            <input
                                                id="facebook"
                                                type="text"
                                                name="facebook"
                                                placeholder="Facebook profile URL"
                                                value={formData.facebook}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="mobile"
                                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Mobile
                                            </label>
                                            <input
                                                id="mobile"
                                                type="tel"
                                                name="mobile"
                                                placeholder="Mobile number"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="landline"
                                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Landline
                                            </label>
                                            <input
                                                id="landline"
                                                type="tel"
                                                name="landline"
                                                placeholder="Landline number"
                                                value={formData.landline}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Section */}
                            {(activeSection === "appearance" || activeSection === "all") && (
                                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50 sm:p-6">
                                    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-white sm:text-lg">
                                        <span>🎨</span>
                                        Appearance & Theme
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Theme Preview */}
                                        <div>
                                            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Theme Preview</h4>
                                            <div
                                                className="flex h-20 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-inner sm:h-24"
                                                style={{
                                                    background: `linear-gradient(to right, ${formData.fromColor}, ${formData.toColor})`,
                                                    color: formData.fontColor,
                                                }}
                                            >
                                                {formData.name.trim() || "Theme Preview"}
                                            </div>
                                        </div>

                                        {/* Color Pickers */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="text-center">
                                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">Start</label>
                                                <input
                                                    type="color"
                                                    name="fromColor"
                                                    value={formData.fromColor}
                                                    onChange={handleChange}
                                                    className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 sm:h-12"
                                                />
                                            </div>
                                            <div className="text-center">
                                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">End</label>
                                                <input
                                                    type="color"
                                                    name="toColor"
                                                    value={formData.toColor}
                                                    onChange={handleChange}
                                                    className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 sm:h-12"
                                                />
                                            </div>
                                            <div className="text-center">
                                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">Font</label>
                                                <input
                                                    type="color"
                                                    name="fontColor"
                                                    value={formData.fontColor}
                                                    onChange={handleChange}
                                                    className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 sm:h-12"
                                                />
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            The gradient will be used as the personnel card's background theme, and the font color will be applied to
                                            the text.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons - Sticky on mobile */}
                            <div className="sticky bottom-0 border-t border-gray-200 bg-white pt-4 dark:border-gray-700 dark:bg-gray-800 sm:relative sm:border-t-0 sm:bg-transparent sm:dark:bg-transparent">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    {/* Section navigation - Hidden on mobile, shown on desktop */}
                                    <div className="hidden gap-2 sm:flex">
                                        {sectionButtons.map((section) => (
                                            <button
                                                key={section.id}
                                                type="button"
                                                onClick={() => setActiveSection(section.id)}
                                                className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                                                    activeSection === section.id
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                {section.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:flex-none sm:px-6"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            style={{background:bgtheme,color:FontColor}}
                                            disabled={isSubmitting}
                                            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-6"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    {editingProfile ? "Updating..." : "Saving..."}
                                                </div>
                                            ) : editingProfile ? (
                                                "Update"
                                            ) : (
                                                "Save"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
