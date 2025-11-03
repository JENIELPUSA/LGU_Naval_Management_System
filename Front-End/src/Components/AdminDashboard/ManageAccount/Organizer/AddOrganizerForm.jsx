import { useState, useRef } from "react";

const AddOrganizerFormModal = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, bgtheme, FontColor }) => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        const avatarToSend =
            file ||
            (typeof formData.avatar === "object" && formData.avatar !== null && formData.avatar.url) ||
            (typeof formData.avatar === "string" && formData.avatar);

        onSubmit(e, { ...formData, avatar: avatarToSend });
        setFile(null);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 sm:items-center">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">{isEditing ? "Edit Organizer" : "Add New Organizer"}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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

                <form
                    onSubmit={handleLocalSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Upload Picture</label>
                        <div
                            className="relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {file || formData.avatar?.url ? (
                                <img
                                    src={file ? URL.createObjectURL(file) : formData.avatar?.url}
                                    alt="Preview"
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mx-auto size-12 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Click to upload an image</p>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Middle Name</label>
                        <input
                            type="text"
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Contact Number</label>
                        <input
                            type="tel"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ background: bgtheme, color: FontColor }}
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-sm transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-500 dark:focus:ring-offset-slate-900"
                        >
                            <span className="relative">{isEditing ? "Save Changes" : "Add Organizer"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOrganizerFormModal;
