import { useState, useEffect, useContext } from "react";
import { CircleX, CircleCheckBig, PencilLine, Trash, Plus, Database } from "lucide-react";
import { ResourcesDisplayContext } from "../../../contexts/ResourcesContext/ResourcesContext";
import LoadingOverlay from "../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../ReusableFolder/StatusModal";
import AddFormModal from "./ResourcesAddForm";
import { AuthContext } from "../../../contexts/AuthContext";
import { PersonilContext } from "../../../contexts/PersonelContext/PersonelContext";

const ResourcesTable = () => {
    const {
        isResources,
        DeleteResources,
        customError,
        FetchResourcesData,
        isLoading,
        setIsLoading,
        UpdateResources,
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        isTotalresources,
    } = useContext(ResourcesDisplayContext);
    const { bgtheme, FontColor } = useContext(PersonilContext);
    const { role } = useContext(AuthContext);
    const [isDeleteID, setDeleteID] = useState(null);
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isVerification, setVerification] = useState(false);
    const [formData, setFormData] = useState({
        resource_name: "",
        description: "",
        resource_type: "",
        availability: true,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingResourceId, setEditingResourceId] = useState(null);

    const showingStart = (currentPage - 1) * limit + 1;
    const showingEnd = Math.min(currentPage * limit, isTotalresources);

    useEffect(() => {
        FetchResourcesData(currentPage, limit, searchTerm, dateFrom, dateTo);
    }, [currentPage, searchTerm, dateFrom, dateTo, limit]);

    const handleSearch = () => {
        setSearchTerm(tempSearchTerm);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleFormSubmit = async (e, submittedData) => {
        setIsLoading(true);
        let result;

        if (isEditing) {
            result = await UpdateResources(submittedData._id, submittedData);
        } else {
            result = await isResources(submittedData);
        }

        setIsLoading(false);
        if (result?.success) {
            setModalStatus("success");
        } else {
            setModalStatus("failed");
        }
        setShowModal(true);
        closeFormModal();
        FetchResourcesData(currentPage, limit, searchTerm, dateFrom, dateTo);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setIsEditing(false);
        setEditingResourceId(null);
        setFormData({
            resource_name: "",
            description: "",
            resource_type: "",
            availability: true,
        });
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditingResourceId(null);
        setFormData({
            resource_name: "",
            description: "",
            resource_type: "",
            availability: true,
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (resource) => {
        setIsEditing(true);
        setEditingResourceId(resource._id);
        setFormData(resource);
        setIsFormModalOpen(true);
    };

    const renderPageNumbers = () => {
        if (totalPages <= 1) return null;

        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        return (
            <div className="relative flex items-center">
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        aria-label={`Go to page ${pageNum}`}
                        style={{ background: bgtheme, color: FontColor }}
                        className="mx-0.5 h-7 min-w-[28px] rounded px-1.5 py-0.5 text-[10px] font-medium sm:h-8 sm:min-w-[32px] sm:rounded-md sm:px-2 sm:py-1 sm:text-xs"
                    >
                        {pageNum}
                    </button>
                ))}
            </div>
        );
    };

    const handleCloseModal = () => {
        setVerification(false);
        setDeleteID(null);
    };

    const handleDeleteResource = (id) => {
        setDeleteID(id);
        setVerification(true);
    };

    const handleConfirmDelete = async () => {
        if (isDeleteID) {
            setIsLoading(true);
            const result = await DeleteResources(isDeleteID);
            setIsLoading(false);

            if (result?.success) {
                setModalStatus("success");
                setDeleteID(null);
                setVerification(false);
                FetchResourcesData(currentPage, limit, searchTerm, dateFrom, dateTo);
            } else {
                setModalStatus("failed");
            }
            setShowModal(true);
        }
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getAvailabilityConfig = (availability) => {
        return availability
            ? { bg: "bg-emerald-50 dark:bg-emerald-900/20", badge: "bg-emerald-500 text-white" }
            : { bg: "bg-red-50 dark:bg-red-900/20", badge: "bg-red-500 text-white" };
    };

    return (
        <>
            {isLoading && <LoadingOverlay />}
            
            {/* Mobile View - Only visible on small screens */}
            <div className="block md:hidden min-h-screen bg-slate-50 dark:bg-slate-900">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-slate-900/90">
                    <div className="px-2 py-3">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-base font-bold text-gray-900 dark:text-white">
                                    Resources Management
                                </h1>
                                <button
                                    onClick={openAddModal}
                                    style={{ background: bgtheme, color: FontColor }}
                                    className="flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium"
                                >
                                    <Plus size={12} /> Add Resource
                                </button>
                            </div>

                            {/* Search & Filters - stacked on mobile */}
                            <div className="flex flex-col gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search resources..."
                                        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-[10px] pl-8 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                        value={tempSearchTerm}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setTempSearchTerm(value);
                                            if (value.trim() === "") {
                                                setSearchTerm("");
                                                setCurrentPage(1);
                                            }
                                        }}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex gap-1">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="rounded border border-gray-200 bg-white px-1.5 py-1 text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="rounded border border-gray-200 bg-white px-1.5 py-1 text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Content - card structure */}
                <div className="px-2 py-3">
                    {isResources && isResources.length > 0 ? (
                        <div className="space-y-2">
                            {isResources.map((resource, index) => {
                                const availabilityConfig = getAvailabilityConfig(resource.availability);
                                return (
                                    <div
                                        key={resource._id}
                                        className={`rounded-lg border ${availabilityConfig.bg} dark:border-gray-700`}
                                    >
                                        <div className="p-2.5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                        {resource.resource_name}
                                                    </h3>
                                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${availabilityConfig.badge} whitespace-nowrap`}>
                                                        {resource.availability ? "Available" : "Not Available"}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium">Type:</span>
                                                        <span>{resource.resource_type}</span>
                                                    </div>
                                                </div>

                                                <p className="mt-1 line-clamp-2 text-[10px] text-gray-700 dark:text-gray-300">
                                                    {resource.description || "No description"}
                                                </p>

                                                {/* Availability Select for Admin - mobile friendly */}
                                                {role === "admin" && (
                                                    <div className="mt-2">
                                                        <select
                                                            value={resource.availability ? "Available" : "Not Available"}
                                                            onChange={async (e) => {
                                                                const newAvailability = e.target.value === "Available";
                                                                setIsLoading(true);
                                                                const result = await UpdateResources(resource._id, {
                                                                    ...resource,
                                                                    availability: newAvailability,
                                                                });
                                                                setIsLoading(false);

                                                                if (result?.success) {
                                                                    setModalStatus("success");
                                                                } else {
                                                                    setModalStatus("failed");
                                                                }
                                                                setShowModal(true);
                                                                FetchResourcesData(currentPage, limit, searchTerm, dateFrom, dateTo);
                                                            }}
                                                            className="w-full rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                                        >
                                                            <option value="Available">Available</option>
                                                            <option value="Not Available">Not Available</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    <button
                                                        onClick={() => openEditModal(resource)}
                                                        className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                                                    >
                                                        <PencilLine size={10} /> Edit
                                                    </button>
                                                    {role === "admin" && (
                                                        <button
                                                            onClick={() => handleDeleteResource(resource._id)}
                                                            className="flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                                                        >
                                                            <Trash size={10} /> Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
                            <Database className="mx-auto h-6 w-6 text-purple-500" />
                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">No resources found</p>
                            <button
                                onClick={openAddModal}
                                className="mt-2 rounded bg-purple-600 px-2 py-1 text-[10px] text-white hover:bg-purple-700"
                            >
                                Add First Resource
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Pagination */}
                {totalPages > 1 && (
                    <div className="sticky bottom-0 border-t border-gray-200 bg-white/90 px-2 py-2 dark:border-gray-700 dark:bg-slate-900/90">
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400">
                                Showing {showingStart}–{showingEnd} of {isTotalresources}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-600 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                >
                                    Prev
                                </button>
                                {renderPageNumbers()}
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-600 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop View - Only visible on medium screens and up - UNCHANGED */}
            <div className="hidden md:block card border border-pink-300/50 bg-gradient-to-br from-pink-50/30 to-blue-50/30 dark:border-pink-700/50 dark:from-pink-900/20 dark:to-blue-900/20">
                <div className="card-header flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <p className="card-title flex-1 text-slate-800 dark:text-slate-200">Display List</p>

                    <div className="relative w-full sm:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pl-10 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                            value={tempSearchTerm}
                            onChange={(e) => {
                                const value = e.target.value;
                                setTempSearchTerm(value);
                                if (value.trim() === "") {
                                    setSearchTerm("");
                                    setCurrentPage(1);
                                }
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900 dark:hover:text-pink-200"
                            aria-label="Search"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                        <div className="relative">
                            <input
                                type="date"
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                            <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                From
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="date"
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                            <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                To
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={openAddModal}
                        style={{ background: bgtheme, color: FontColor }}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-500 dark:focus:ring-offset-slate-900"
                    >
                        <Plus size={18} />
                        <span className="relative">Add Form</span>
                    </button>
                </div>

                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header bg-gradient-to-r from-pink-400/20 to-blue-400/20 dark:from-pink-700/30 dark:to-blue-700/30">
                                <tr className="table-row">
                                    <th className="table-head text-slate-800 dark:text-slate-100">#</th>
                                    <th className="table-head text-slate-800 dark:text-slate-100">Name </th>
                                    <th className="table-head text-slate-800 dark:text-slate-100">Description</th>
                                    <th className="table-head text-slate-800 dark:text-slate-100">Type</th>
                                    <th className="table-head text-slate-800 dark:text-slate-100">Available</th>
                                    <th className="table-head text-slate-800 dark:text-slate-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {isResources && isResources.length > 0 ? (
                                    isResources.map(
                                        (
                                            resource,
                                            index,
                                        ) => (
                                            <tr
                                                key={resource._id}
                                                className="table-row border-b hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-4 py-2 text-center">{(currentPage - 1) * limit + index + 1}</td>
                                                <td className="px-4 py-2">{resource.resource_name}</td>
                                                <td className="max-w-xs truncate px-4 py-2">{resource.description}</td>
                                                <td className="max-w-xs truncate px-4 py-2">{resource.resource_type}</td>
                                                <td className="px-4 py-2 capitalize">
                                                    {role === "admin" ? (
                                                        <select
                                                            value={resource.availability ? "Available" : "Not Available"}
                                                            onChange={async (e) => {
                                                                const newAvailability = e.target.value === "Available";
                                                                setIsLoading(true);
                                                                const result = await UpdateResources(resource._id, {
                                                                    ...resource,
                                                                    availability: newAvailability,
                                                                });
                                                                setIsLoading(false);

                                                                if (result?.success) {
                                                                    setModalStatus("success");
                                                                } else {
                                                                    setModalStatus("failed");
                                                                }
                                                                setShowModal(true);
                                                                FetchResourcesData(currentPage, limit, searchTerm, dateFrom, dateTo);
                                                            }}
                                                            className="rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                                                        >
                                                            <option value="Available">Available</option>
                                                            <option value="Not Available">Not Available</option>
                                                        </select>
                                                    ) : (
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                                resource.availability ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {resource.availability ? "Available" : "Not Available"}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-x-4">
                                                        <button
                                                            onClick={() => openEditModal(resource)}
                                                            className="rounded p-2 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900"
                                                        >
                                                            <PencilLine size={20} />
                                                        </button>
                                                        {role === "admin" && (
                                                            <button
                                                                onClick={() => handleDeleteResource(resource._id)}
                                                                className="rounded p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                                                            >
                                                                <Trash size={20} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="border border-dashed py-6 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="inline-flex items-center justify-center rounded-full bg-pink-100/50 p-3 dark:bg-pink-900/20">
                                                    <Database className="h-8 w-8 text-pink-500 dark:text-pink-400" />
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-400">No matching records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 p-4 dark:border-slate-700 sm:flex-row">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Showing{" "}
                                <span className="font-medium">
                                    {showingStart}-{showingEnd}
                                </span>{" "}
                                of <span className="font-medium">{isTotalresources}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                                className={`rounded-lg border border-slate-300 px-3 py-1 text-sm ${
                                    currentPage === 1
                                        ? "cursor-not-allowed text-slate-400 dark:text-slate-600"
                                        : "text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                }`}
                            >
                                Previous
                            </button>

                            <div className="flex flex-wrap justify-center">{renderPageNumbers()}</div>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                                className={`rounded-lg border border-slate-300 px-3 py-1 text-sm ${
                                    currentPage === totalPages
                                        ? "cursor-not-allowed text-slate-400 dark:text-slate-600"
                                        : "text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals - Shared between mobile and desktop */}
            <AddFormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleFormSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                editingData={isEditing ? formData : null}
                bgtheme={bgtheme}
                FontColor={FontColor}
            />
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                errorMessage={customError}
            />
            <StatusVerification
                isOpen={isVerification}
                onConfirmDelete={handleConfirmDelete}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default ResourcesTable;