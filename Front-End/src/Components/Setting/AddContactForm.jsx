import React, { useState } from "react";

export default function AddContactForm({ AddContact }) {
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (index, e, field) => {
        const updated = [...formData[field]];
        updated[index] = e.target.value;
        setFormData({ ...formData, [field]: updated });
    };

    const addArrayField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ""] });
    };

    const handleOfficeHoursChange = (index, key, e) => {
        const updated = [...formData.officeHours];
        updated[index][key] = e.target.value;
        setFormData({ ...formData, officeHours: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData", formData);

        try {
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
        } catch (error) {
            console.error("Frontend caught error:", error.message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-md bg-white p-6 shadow"
        >
            <h2 className="mb-6 text-lg font-bold">Add Contact Info</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Office Name - Full Width */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block font-medium">Office Name</label>
                        <input
                            type="text"
                            name="officeName"
                            value={formData.officeName}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Municipal Hall Building"
                        />
                    </div>

                    {/* City & Postal Code */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block font-medium">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block font-medium">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Phones */}
                    <div>
                        <label className="mb-2 block font-medium">Phones</label>
                        <div className="space-y-2">
                            {formData.phones.map((phone, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={phone}
                                    onChange={(e) => handleArrayChange(i, e, "phones")}
                                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="(02) 8123-4567"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => addArrayField("phones")}
                            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            + Add Phone
                        </button>
                    </div>

                    {/* Hotlines */}
                    <div>
                        <label className="mb-2 block font-medium">Hotlines</label>
                        <div className="space-y-2">
                            {formData.hotlines.map((hotline, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={hotline}
                                    onChange={(e) => handleArrayChange(i, e, "hotlines")}
                                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0917-123-4567"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => addArrayField("hotlines")}
                            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            + Add Hotline
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Emails */}
                    <div>
                        <label className="mb-2 block font-medium">Emails</label>
                        <div className="space-y-2">
                            {formData.emails.map((email, i) => (
                                <input
                                    key={i}
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleArrayChange(i, e, "emails")}
                                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="info@lgu-san-jose.gov.ph"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => addArrayField("emails")}
                            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            + Add Email
                        </button>
                    </div>

                    {/* Office Hours */}
                    <div>
                        <label className="mb-2 block font-medium">Office Hours</label>
                        <div className="space-y-3">
                            {formData.officeHours.map((hour, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                >
                                    <span className="w-20 text-sm font-medium text-gray-700">{hour.day}</span>
                                    <div className="flex flex-1 gap-2">
                                        <input
                                            type="text"
                                            value={hour.open}
                                            onChange={(e) => handleOfficeHoursChange(i, "open", e)}
                                            className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Open"
                                        />
                                        <input
                                            type="text"
                                            value={hour.close}
                                            onChange={(e) => handleOfficeHoursChange(i, "close", e)}
                                            className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Close"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button - Centered */}
            <div className="mt-8 flex justify-center">
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Save Contact Info
                </button>
            </div>
        </form>
    );
}
