import React, { useContext, useState, useEffect } from "react";
import { FileText, MessageSquareText, X, List } from "lucide-react";
import { ResourcesDisplayContext } from "../../../contexts/ResourcesContext/ResourcesContext";

const AddResourceModal = ({ isOpen, onClose, editingData, isEditing, bgtheme, FontColor }) => {
    const [formData, setFormData] = useState({
        resourceName: "",
        resourceType: "",
        description: "",
    });

    const { AddResources, UpdateResources } = useContext(ResourcesDisplayContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    // Set form data when modal opens or editingData changes
    useEffect(() => {
        if (isOpen) {
            if (isEditing && editingData) {
                // Pre-fill form with editing data
                setFormData({
                    resourceName: editingData.resource_name || "",
                    resourceType: editingData.resource_type || "",
                    description: editingData.description || "",
                });
            } else {
                // Clear form for adding new resource
                setFormData({
                    resourceName: "",
                    resourceType: "",
                    description: "",
                });
            }
            setMessage("");
        }
    }, [isOpen, isEditing, editingData]);

    const handleCloseModal = () => {
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let result;
            if (isEditing && editingData) {
                // Update existing resource
                result = await UpdateResources(editingData._id, formData);
                setMessage("Resource updated successfully!");
            } else {
                // Add new resource
                result = await AddResources(formData);
                setMessage("Resource added successfully!");
            }

            // Wait a moment to show success message, then close
            setTimeout(() => {
                onClose();
                setFormData({
                    resourceName: "",
                    resourceType: "",
                    description: "",
                });
            }, 1000);
        } catch (error) {
            // Error handling
            setMessage(`Failed to ${isEditing ? "update" : "add"} resource. Please try again.`);
            console.error(`Error ${isEditing ? "updating" : "adding"} resource:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8">
                <button
                    onClick={handleCloseModal}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Resource Management Form</h1>
                    <p className="text-sm text-gray-600 sm:text-base">
                        {isEditing ? "Update a resource in your database." : "Add a new resource to your database."}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Resource Name Input */}
                    <div className="mb-6">
                        <label className="mb-2 block flex items-center text-sm font-semibold text-gray-700">
                            <FileText className="mr-2 h-4 w-4 text-purple-500" />
                            Resource Name
                        </label>
                        <input
                            type="text"
                            name="resourceName"
                            value={formData.resourceName}
                            onChange={handleChange}
                            placeholder="e.g., Projector A"
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* Resource Type Dropdown */}
                    <div className="mb-6">
                        <label className="mb-2 block flex items-center text-sm font-semibold text-gray-700">
                            <List className="mr-2 h-4 w-4 text-purple-500" />
                            Resource Type
                        </label>
                        <select
                            name="resourceType"
                            value={formData.resourceType}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        >
                            <option value="">Select a type...</option>
                            <option value="venue">Venue</option>
                            <option value="equipment">Equipment</option>
                            <option value="personnel">Personnel</option>
                        </select>
                    </div>

                    {/* Description Input */}
                    <div className="mb-6">
                        <label className="mb-2 block flex items-center text-sm font-semibold text-gray-700">
                            <MessageSquareText className="mr-2 h-4 w-4 text-purple-500" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Provide a detailed description of the resource."
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        ></textarea>
                    </div>

                    {/* Submission Message */}
                    {message && (
                        <div className={`mb-6 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{ background: bgtheme, color: FontColor }}
                        className="w-full transform rounded-lg px-4 py-3 font-bold transition duration-300 ease-in-out hover:scale-105 hover:from-purple-700 hover:to-indigo-700 disabled:transform-none disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {isSubmitting ? (isEditing ? "Updating..." : "Submitting...") : isEditing ? "Update Resource" : "Add Resource"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddResourceModal;
