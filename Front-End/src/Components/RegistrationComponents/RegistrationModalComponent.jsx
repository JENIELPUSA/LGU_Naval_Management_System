import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";
import logo from "../../../src/assets/logo-login.png"; 
import LoadingOverlay from "../../ReusableFolder/LoadingOverlay";

const EventRegistrationForm = () => {
    const { AddParticipant } = useContext(ParticipantDisplayContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
    });

    // Show loading overlay for 1 second
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            eventId: id,
        };
        await AddParticipant(payload);

        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            gender: "",
            address: "",
        });
    };

    // If still loading, show the overlay
    if (loading) {
        return <LoadingOverlay message="Loading Event Form..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-500 to-blue-500 px-4 py-12 dark:from-gray-800 dark:to-gray-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
                {/* Form Header */}
                <div className="bg-gradient-to-br from-pink-500 to-blue-500 px-6 py-8 text-center">
                    {/* Logo */}
                    <img
                        src={logo}
                        alt="LGU Naval EMS Logo"
                        className="mx-auto mb-4 h-20 w-auto rounded-full shadow-lg"
                    />
                    <h1 className="mb-2 text-3xl font-bold text-white">LGU Naval EMS</h1>
                    <p className="text-indigo-100">
                        Secure your spot at the most anticipated tech events of the year
                    </p>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="space-y-6 px-8 py-6">
                    {/* Personal Information Section */}
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter your first name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter your last name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="your.email@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="+63 912 345 6789"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Address Field */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Address *
                        </label>
                        <input
                            type="text"
                            name="address"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Gender Selection */}
                    <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Gender *
                        </label>
                        <div className="flex space-x-6">
                            {["Male", "Female"].map((gender) => (
                                <label key={gender} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        required
                                        value={gender}
                                        checked={formData.gender === gender}
                                        onChange={handleInputChange}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">{gender}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 px-4 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Register for Event
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="bg-gray-100 px-8 py-4 text-center dark:bg-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        © 2025 Tech Events. All rights reserved. | Privacy Policy | Terms of Service
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventRegistrationForm;
