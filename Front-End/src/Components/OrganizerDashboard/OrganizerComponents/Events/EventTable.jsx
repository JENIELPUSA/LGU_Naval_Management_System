import { useState, useEffect, useContext } from "react";
import { CircleX, Clock8, PencilLine, Trash, Plus, Database, Calendar, MapPin, User, Mail, Phone, FileText, Copy } from "lucide-react";
import { EventDisplayContext } from "../../../../contexts/EventContext/EventContext";
import LoadingOverlay from "../../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../../ReusableFolder/StatusModal";
import { ResourcesDisplayContext } from "../../../../contexts/ResourcesContext/ResourcesContext";
import AddFormModal from "./EventAddForm";

const EvenTable = () => {
    const {
        isEvent,
        DeleteEvent,
        customError,
        FetchProposalDisplay,
        isLoading,
        setIsLoading,
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        isTotalEvent,
    } = useContext(EventDisplayContext);
    const { isResources } = useContext(ResourcesDisplayContext);

    const [isDeleteID, setDeleteID] = useState(null);
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isVerification, setVerification] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        resources: "",
        lgu: "",
        venue: "",
        proposalId: "",
        contact_number: "",
        email: "",
        startTime: "",
        endTime: "",
        date: "",
    });

    const [copiedEventId, setCopiedEventId] = useState(null);

    const handleCopy = (eventId, url) => {
        if (url) {
            navigator.clipboard.writeText(url);
            setCopiedEventId(eventId);
            setTimeout(() => setCopiedEventId(null), 2000); // reset after 2s
        }
    };

    const showingStart = (currentPage - 1) * limit + 1;
    const showingEnd = Math.min(currentPage * limit, isTotalEvent);

    const pageSizeOptions = [5, 10, 20, 50];

    useEffect(() => {
        FetchProposalDisplay(currentPage, limit, searchTerm, dateFrom, dateTo);
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

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setIsEditing(false);
        setEditingEventId(null);
        // I-reset ang form data sa default values
        setFormData({
            title: "",
            description: "",
            resources: "",
            venue: "",
            proposalId: "",
            contact_number: "",
            email: "",
            lgu: "",
            startTime: "",
            endTime: "",
            date: "",
            status: "pending",
        });
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditingEventId(null);
        setFormData({
            title: "",
            description: "",
            resources: "",
            venue: "",
            proposalId: "",
            contact_number: "",
            email: "",
            lgu: "",
            startTime: "",
            endTime: "",
            date: "",
            status: "pending",
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (event) => {
        setIsEditing(true);
        setEditingEventId(event._id);

        // I-format ang data para sa form
        const formattedData = {
            ...event,
            // Siguraduhin na ang mga field na kailangan ng form ay narito
            title: event.proposal?.title || "",
            description: event.proposal?.description || "",
            proposalId: event.proposal?._id || "",
            resources: event.resources || "",
            lgu: event.lgu || "",
            venue: event.venue || "",
            contact_number: event.organizer?.contact_number || "",
            email: event.organizer?.email || "",
            startTime: event.startTime || "",
            endTime: event.endTime || "",
            date: event.date || "",
            status: event.status || "pending",
        };

        setFormData(formattedData);
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

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const pageNum = startPage + i;
            return (
                <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    aria-label={`Go to page ${pageNum}`}
                    className={`mx-1 h-10 min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:bg-blue-500 dark:shadow-blue-800"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                    {pageNum}
                </button>
            );
        });
    };

    const handleCloseModal = () => {
        setVerification(false);
        setDeleteID(null);
    };
    const handleRefresh = () => {
        setSearchTerm(""); 
        setTempSearchTerm("");
        setCurrentPage(1);
        FetchProposalDisplay(1, limit, "", dateFrom, dateTo); // fetch lahat ng data ulit
    };

    const handleDeleteEvent = (id) => {
        setDeleteID(id);
        setVerification(true);
    };

    const handleConfirmDelete = async () => {
        if (isDeleteID) {
            setIsLoading(true);
            const result = await DeleteEvent(isDeleteID);
            setIsLoading(false);

            if (result?.success) {
                setModalStatus("success");
                setDeleteID(null);
                setVerification(false);
                FetchProposalDisplay(currentPage, limit, searchTerm, dateFrom, dateTo);
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

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return {
                    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
                    text: "text-emerald-700 dark:text-emerald-300",
                    badge: "bg-emerald-500 text-white",
                    icon: "text-emerald-500",
                };
            case "pending":
                return {
                    bg: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
                    text: "text-amber-700 dark:text-amber-300",
                    badge: "bg-amber-500 text-white",
                    icon: "text-amber-500",
                };
            case "rejected":
                return {
                    bg: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
                    text: "text-red-700 dark:text-red-300",
                    badge: "bg-red-500 text-white",
                    icon: "text-red-500",
                };
            default:
                return {
                    bg: "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700",
                    text: "text-gray-700 dark:text-gray-300",
                    badge: "bg-gray-500 text-white",
                    icon: "text-gray-500",
                };
        }
    };

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                {/* Header Section */}
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Event Management</h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage and organize your events efficiently</p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {/* Search Input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pl-10 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
                                        value={tempSearchTerm}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setTempSearchTerm(value);

                                            if (value === "") {
                                                // Kapag walang laman, auto refresh/reset
                                                handleRefresh();
                                            }
                                        }}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
                                        aria-label="Search"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
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

                                {/* Date Filters */}
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>

                                {/* Add Button */}
                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                >
                                    <Plus size={16} />
                                    Add Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    {isEvent && isEvent.length > 0 ? (
                        <div className="grid gap-6">
                            {isEvent.map((event, index) => {
                                const statusConfig = getStatusConfig(event.status);

                                return (
                                    <div
                                        key={event._id}
                                        className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${statusConfig.bg} dark:bg-gray-800`}
                                    >
                                        {/* Card Header */}
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                                                        {event.proposal?.title || "Untitled Event"}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            <span>
                                                                {new Date(event.created_at).toLocaleDateString("en-US", {
                                                                    weekday: "short",
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin size={14} />
                                                            <span className="truncate">{event.venue || "TBD"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock8 size={14} />
                                                            <span className="truncate">{event.startTime || "TBD"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {event.status && (
                                                    <div
                                                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusConfig.badge}`}
                                                    >
                                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="px-6 pb-4">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {/* Event Details */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <FileText
                                                                size={16}
                                                                className="text-blue-500"
                                                            />
                                                            <h4 className="font-medium text-gray-900 dark:text-white">Event Description</h4>
                                                        </div>
                                                        <p className="line-clamp-3 pl-6 text-sm text-gray-600 dark:text-gray-300">
                                                            {event.proposal?.description || "No description available"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <FileText
                                                                size={16}
                                                                className="text-blue-500"
                                                            />
                                                            <h4 className="font-medium text-gray-900 dark:text-white">Event Url</h4>
                                                            {event.registerUrl && (
                                                                <button
                                                                    onClick={() => handleCopy(event._id, event.registerUrl)}
                                                                    className="ml-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                                                    title="Copy URL"
                                                                >
                                                                    <Copy size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="line-clamp-3 pl-6 text-sm text-gray-600 dark:text-gray-300">
                                                            {event.registerUrl || "No URL available"}
                                                        </p>
                                                        {copiedEventId === event._id && <span className="pl-6 text-xs text-green-500">Copied!</span>}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    {/* Organizer Details */}
                                                    {event.organizer && (
                                                        <div className="space-y-4">
                                                            <div>
                                                                <div className="mb-3 flex items-center gap-2">
                                                                    <User
                                                                        size={16}
                                                                        className="text-purple-500"
                                                                    />
                                                                    <h4 className="font-medium text-gray-900 dark:text-white">Organizer Details</h4>
                                                                </div>
                                                                <div className="space-y-2 pl-6">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {`${event.organizer.first_name || ""} ${event.organizer.middle_name || ""} ${event.organizer.last_name || ""}`.trim()}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                                        <Phone size={14} />
                                                                        <span>{event.organizer.contact_number || "N/A"}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                                        <Mail size={14} />
                                                                        <span>{event.organizer.email || "N/A"}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Resources */}
                                                    {event.resources && event.resources.length > 0 && (
                                                        <div className="space-y-4">
                                                            <div>
                                                                <div className="mb-3 flex items-center gap-2">
                                                                    <Database
                                                                        size={16}
                                                                        className="text-green-500"
                                                                    />
                                                                    <h4 className="font-medium text-gray-900 dark:text-white">Resources</h4>
                                                                </div>
                                                                <div className="space-y-3 pl-6">
                                                                    {/* Scrollable container for resources */}
                                                                    <div className="max-h-48 overflow-y-auto pr-2">
                                                                        {event.resources.map((resource, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="mb-3 text-sm text-gray-600 last:mb-0 dark:text-gray-300"
                                                                            >
                                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                                    {resource.resource_name}
                                                                                </div>
                                                                                <div className="mt-1 flex items-center gap-2">
                                                                                    <span
                                                                                        className={`inline-block h-2 w-2 rounded-full ${resource.availability ? "bg-green-500" : "bg-red-500"}`}
                                                                                    ></span>
                                                                                    <span>
                                                                                        {resource.resource_type} •{" "}
                                                                                        {resource.availability ? "Available" : "Unavailable"}
                                                                                    </span>
                                                                                </div>
                                                                                {resource.description && (
                                                                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                                        {resource.description}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Actions */}
                                        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(event)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                                    title="Edit Event"
                                                >
                                                    <PencilLine size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event._id)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                    title="Delete Event"
                                                >
                                                    <Trash size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Database className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No events found</h3>
                                <p className="max-w-sm text-center text-gray-500 dark:text-gray-400">
                                    There are no events matching your current filters. Try adjusting your search criteria or add a new event.
                                </p>
                                <button
                                    onClick={openAddModal}
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus size={16} />
                                    Add First Event
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="border-t border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span className="font-semibold">{showingStart}</span> to <span className="font-semibold">{showingEnd}</span>{" "}
                                of <span className="font-semibold">{isTotalEvent}</span> results
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    Previous
                                </button>

                                <div className="hidden sm:flex">{renderPageNumbers()}</div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modals */}
                <AddFormModal
                    isOpen={isFormModalOpen}
                    onClose={closeFormModal}
                    Resources={isResources}
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                    editingData={isEditing ? formData : null}
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
            </div>
        </>
    );
};

export default EvenTable;
