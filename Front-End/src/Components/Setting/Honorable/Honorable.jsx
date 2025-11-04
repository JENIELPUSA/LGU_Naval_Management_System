import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaFilter, FaSort, FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";
import AddPersonelForm from "./AddForm";

export default function UserProfileTable({
    AddPersonel,
    isPersonel,
    UpdatePersonel,
    totalPages,
    currentPage,
    setCurrentPage,
    FetchPersonel,
    DeletePersonel,
    bgtheme,
    FontColor,
}) {
    const [showModal, setShowModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [positionFilter, setPositionFilter] = useState("all");
    const [termFromFilter, setTermFromFilter] = useState("");
    const [termToFilter, setTermToFilter] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showFilters, setShowFilters] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(null);
    const limit = 5;

    // Close modal and reset
    const closeModal = () => {
        setShowModal(false);
        setEditingProfile(null);
    };

    const handleEdit = (profile) => {
        setEditingProfile(profile);
        setShowModal(true);
    };

    // Handle delete with confirmation
    const handleDelete = async (profile) => {
        if (window.confirm(`Are you sure you want to delete ${profile.name}? This action cannot be undone.`)) {
            try {
                await DeletePersonel(profile._id);
                fetchFilteredData(currentPage);
            } catch (error) {
                console.error("Error deleting profile:", error);
                alert("Failed to delete profile. Please try again.");
            }
        }
    };

    // When filters change
    const handleFilterChange = (type, value) => {
        if (type === "position") setPositionFilter(value);
        if (type === "termFrom") setTermFromFilter(value);
        if (type === "termTo") setTermToFilter(value);
    };

    // Apply filters and fetch data
    const applyFilters = () => {
        setCurrentPage(1);
        fetchFilteredData(1);
        setShowFilters(false);
    };

    // Clear all filters
    const clearFilters = () => {
        setPositionFilter("all");
        setTermFromFilter("");
        setTermToFilter("");
        setCurrentPage(1);
        FetchPersonel(1, limit, "", "", "");
        setShowFilters(false);
    };

    // Fetch data with current filters
    const fetchFilteredData = (pageNumber) => {
        const position = positionFilter === "all" ? "" : positionFilter;
        const termFrom = termFromFilter || "";
        const termTo = termToFilter || "";
        FetchPersonel(pageNumber, limit, position, termFrom, termTo);
    };

    // Pagination handler
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchFilteredData(pageNumber);
    };

    // Handle sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // Get current year for max year filter
    const currentYear = new Date().getFullYear();

    // Sort personnel data
    const sortedPersonel = [...(isPersonel || [])].sort((a, b) => {
        let aValue = a[sortField] || "";
        let bValue = b[sortField] || "";

        if (sortField === "termFrom" || sortField === "termTo") {
            aValue = parseInt(aValue) || 0;
            bValue = parseInt(bValue) || 0;
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // Toggle mobile menu
    const toggleMobileMenu = (profileId) => {
        setShowMobileMenu(showMobileMenu === profileId ? null : profileId);
    };

    // Generate pagination buttons
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700 sm:text-sm"
            >
                Previous
            </button>,
        );

        // Page numbers
        for (let page = startPage; page <= endPage; page++) {
            buttons.push(
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium sm:text-sm ${
                        currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    }`}
                >
                    {page}
                </button>,
            );
        }

        // Next button
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700 sm:text-sm"
            >
                Next
            </button>,
        );

        return buttons;
    };

    return (
        <div className="p-3 sm:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Mayor & Vice-Mayor List</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage personnel profiles and their information</p>
                </div>

                <div className="flex gap-3">
                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800 sm:hidden"
                    >
                        <FaFilter
                            className="mr-2"
                            size={14}
                        />
                        Filters
                    </button>

                    {/* Add Button */}
                    <button
                        style={{ background: bgtheme, color: FontColor }}
                        className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        onClick={() => {
                            setEditingProfile(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus
                            className="mr-2"
                            size={14}
                        />
                        <span className="hidden sm:inline">Add Profile</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>
            </div>

            {/* Filters Card - Mobile Responsive */}
            <div className={`mb-6 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 ${showFilters ? "block" : "hidden sm:block"}`}>
                <div className="mb-3 flex items-center justify-between sm:justify-start">
                    <div className="flex items-center gap-2">
                        <FaFilter
                            className="text-gray-500"
                            size={14}
                        />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filters</h3>
                    </div>
                    <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 sm:hidden"
                    >
                        <FaChevronUp size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-end">
                    {/* Position Filter */}
                    <div className="sm:col-span-1">
                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Position</label>
                        <select
                            value={positionFilter}
                            onChange={(e) => handleFilterChange("position", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">All Positions</option>
                            {isPersonel &&
                                Array.isArray(isPersonel) &&
                                [...new Set(isPersonel.map((p) => p.position).filter(Boolean))].map((position) => (
                                    <option
                                        key={position}
                                        value={position}
                                    >
                                        {position}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Term From Filter */}
                    <div className="sm:col-span-1">
                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Year From</label>
                        <input
                            type="number"
                            value={termFromFilter}
                            onChange={(e) => handleFilterChange("termFrom", e.target.value)}
                            placeholder="Start year"
                            min="1900"
                            max={currentYear + 10}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Term To Filter */}
                    <div className="sm:col-span-1">
                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Year To</label>
                        <input
                            type="number"
                            value={termToFilter}
                            onChange={(e) => handleFilterChange("termTo", e.target.value)}
                            placeholder="End year"
                            min="1900"
                            max={currentYear + 10}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:col-span-1">
                        <button
                            onClick={applyFilters}
                            className="flex flex-1 items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            <FaFilter
                                className="mr-2 hidden sm:block"
                                size={12}
                            />
                            Apply
                        </button>
                        <button
                            onClick={clearFilters}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 sm:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Avatar
                                </th>
                                <th
                                    className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center gap-1">
                                        Name
                                        <FaSort
                                            className="text-gray-400"
                                            size={10}
                                        />
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                    onClick={() => handleSort("position")}
                                >
                                    <div className="flex items-center gap-1">
                                        Position
                                        <FaSort
                                            className="text-gray-400"
                                            size={10}
                                        />
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                    onClick={() => handleSort("termFrom")}
                                >
                                    <div className="flex items-center gap-1">
                                        Term From
                                        <FaSort
                                            className="text-gray-400"
                                            size={10}
                                        />
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                    onClick={() => handleSort("termTo")}
                                >
                                    <div className="flex items-center gap-1">
                                        Term To
                                        <FaSort
                                            className="text-gray-400"
                                            size={10}
                                        />
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {sortedPersonel && sortedPersonel.length > 0 ? (
                                sortedPersonel.map((profile) => (
                                    <tr
                                        key={profile._id || profile.id}
                                        style={{ background: profile.colortheme }}
                                        className="text-white transition-colors hover:bg-opacity-90"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3">
                                            {profile.avatar?.url ? (
                                                <img
                                                    src={profile.avatar.url}
                                                    alt={profile.name}
                                                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-300">
                                                    <span className="text-sm font-bold uppercase text-gray-600">
                                                        {profile.name
                                                            ?.split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .slice(0, 2)}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium">{profile.name || "No Name"}</td>
                                        <td className="whitespace-nowrap px-4 py-3">{profile.position || "No Position"}</td>
                                        <td className="whitespace-nowrap px-4 py-3">{profile.termFrom || "N/A"}</td>
                                        <td className="whitespace-nowrap px-4 py-3">{profile.termTo || "N/A"}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="rounded-lg bg-yellow-500 p-2 text-white transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                                    onClick={() => handleEdit(profile)}
                                                    title="Edit"
                                                >
                                                    <FaEdit size={12} />
                                                </button>
                                                <button
                                                    className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                                    onClick={() => handleDelete(profile)}
                                                    title="Delete"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="text-lg font-medium">No profiles found</div>
                                            <div className="mt-1 text-sm">Try adjusting your filters or add a new profile.</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-4 sm:hidden">
                {sortedPersonel && sortedPersonel.length > 0 ? (
                    sortedPersonel.map((profile) => (
                        <div
                            key={profile._id || profile.id}
                            className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
                            style={{ background: profile.colortheme }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    {profile.avatar?.url ? (
                                        <img
                                            src={profile.avatar.url}
                                            alt={profile.name}
                                            className="h-12 w-12 rounded-full border-2 border-white object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gray-300">
                                            <span className="text-sm font-bold uppercase text-gray-600">
                                                {profile.name
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-white">
                                        <h3 className="text-sm font-bold">{profile.name || "No Name"}</h3>
                                        <p className="text-xs opacity-90">{profile.position || "No Position"}</p>
                                        <p className="mt-1 text-xs opacity-80">
                                            Term: {profile.termFrom || "N/A"} - {profile.termTo || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Mobile Menu Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => toggleMobileMenu(profile._id)}
                                        className="rounded-lg p-2 text-white hover:bg-white hover:bg-opacity-20"
                                    >
                                        <FaBars size={14} />
                                    </button>

                                    {/* Mobile Action Menu */}
                                    {showMobileMenu === profile._id && (
                                        <div className="absolute right-0 top-10 z-10 w-32 rounded-lg bg-white shadow-lg dark:bg-gray-700">
                                            <button
                                                onClick={() => {
                                                    handleEdit(profile);
                                                    setShowMobileMenu(null);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-t-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                                            >
                                                <FaEdit size={12} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDelete(profile);
                                                    setShowMobileMenu(null);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-b-lg px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
                                            >
                                                <FaTrash size={12} />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-gray-800">
                        <div className="text-lg font-medium text-gray-500 dark:text-gray-400">No profiles found</div>
                        <div className="mt-1 text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters or add a new profile.</div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing page {currentPage} of {totalPages} • {sortedPersonel?.length || 0} profile(s)
                    </div>
                    <div className="flex flex-wrap gap-2">{renderPaginationButtons()}</div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <AddPersonelForm
                    setShowModal={closeModal}
                    AddPersonel={AddPersonel}
                    editingProfile={editingProfile}
                    UpdatePersonel={UpdatePersonel}
                    bgtheme={bgtheme}
                    FontColor={FontColor}
                />
            )}
        </div>
    );
}
