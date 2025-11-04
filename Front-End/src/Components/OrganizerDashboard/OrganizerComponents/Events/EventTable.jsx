import { useState, useEffect, useContext } from "react";
import { CircleX, Clock8, PencilLine, Trash, Plus, Database, Calendar, MapPin, User, Mail, Phone, FileText, Copy } from "lucide-react";
import { EventDisplayContext } from "../../../../contexts/EventContext/EventContext";
import LoadingOverlay from "../../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../../ReusableFolder/StatusModal";
import { ResourcesDisplayContext } from "../../../../contexts/ResourcesContext/ResourcesContext";
import AddFormModal from "./EventAddForm";
import { AuthContext } from "../../../../contexts/AuthContext";
import { PersonilContext } from "../../../../contexts/PersonelContext/PersonelContext";

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
    const { bgtheme, FontColor } = useContext(PersonilContext);
    const { isResourcesDropdown } = useContext(ResourcesDisplayContext);
    const { role, linkId } = useContext(AuthContext);

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
            setTimeout(() => setCopiedEventId(null), 2000);
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

        const formattedData = {
            ...event,
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

        const maxPagesToShow = window.innerWidth < 640 ? 3 : 5;
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
                    className={`mx-1 h-8 min-w-[35px] rounded-lg px-2 py-1.5 text-sm font-medium transition-all sm:h-10 sm:min-w-[40px] sm:px-3 sm:py-2 sm:text-sm ${
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
        FetchProposalDisplay(1, limit, "", dateFrom, dateTo);
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
                {/* Header Section - Mobile: denser, Desktop: unchanged */}
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="p-3 sm:p-5 lg:p-6">
                        {" "}
                        {/* p-3 only on mobile */}
                        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="text-center lg:text-left">
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-2xl">Event Management</h1>
                                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-base">
                                    Manage and organize your events efficiently
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                {/* Date Filters - Mobile: smaller padding */}
                                <div className="flex gap-1.5">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="flex-1 rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-3 sm:py-2.5 sm:text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="flex-1 rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-3 sm:py-2.5 sm:text-sm"
                                    />
                                </div>

                                {/* Add Button - Mobile: smaller */}
                                <button
                                    onClick={openAddModal}
                                    style={{ background: bgtheme, color: FontColor }}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                                >
                                    <Plus
                                        size={16}
                                        className="sm:size-4"
                                    />
                                    Add Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section - Mobile: tighter cards */}
                <div className="p-3 sm:p-5 lg:p-6">
                    {isEvent && isEvent.length > 0 ? (
                        <div className="grid gap-3 sm:gap-5 lg:gap-6">
                            {isEvent.map((event) => {
                                const statusConfig = getStatusConfig(event.status);

                                return (
                                    <div
                                        key={event._id}
                                        className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${statusConfig.bg} dark:bg-gray-800`}
                                    >
                                        {/* Card Header - Mobile: less padding */}
                                        <div className="p-3 sm:p-5 lg:p-6 lg:pb-4">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 dark:text-white sm:text-xl">
                                                        {event.proposal?.title || "Untitled Event"}
                                                    </h3>
                                                    <div className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar
                                                                size={14}
                                                                className="sm:size-4"
                                                            />
                                                            <span>
                                                                {new Date(event.eventDate).toLocaleDateString("en-US", {
                                                                    weekday: "short",
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin
                                                                size={14}
                                                                className="sm:size-4"
                                                            />
                                                            <span className="truncate">{event.venue || "TBD"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock8
                                                                size={14}
                                                                className="sm:size-4"
                                                            />
                                                            <span className="truncate">{event.startTime || "TBD"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {event.status && (
                                                    <div
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-sm ${statusConfig.badge}`}
                                                    >
                                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Content - Mobile: tighter */}
                                        <div className="px-3 pb-3 sm:px-5 lg:px-6 lg:pb-4">
                                            <div className="grid gap-3 sm:gap-5 lg:grid-cols-2 lg:gap-6">
                                                <div className="space-y-2.5 sm:space-y-4">
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-1.5">
                                                            <FileText
                                                                size={16}
                                                                className="text-blue-500 sm:size-4"
                                                            />
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white sm:text-lg">
                                                                Event Description
                                                            </h4>
                                                        </div>
                                                        <p className="line-clamp-3 pl-6 text-xs text-gray-600 dark:text-gray-300 sm:pl-7 sm:text-base">
                                                            {event.proposal?.description || "No description available"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-2">
                                                    {event.organizer && (
                                                        <div className="space-y-2.5 sm:space-y-4">
                                                            <div>
                                                                <div className="mb-2 flex items-center gap-1.5">
                                                                    <User
                                                                        size={16}
                                                                        className="text-purple-500 sm:size-4"
                                                                    />
                                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white sm:text-lg">
                                                                        Organizer
                                                                    </h4>
                                                                </div>
                                                                <div className="space-y-1.5 pl-6 sm:pl-7">
                                                                    <p className="text-xs font-medium text-gray-900 dark:text-white sm:text-base">
                                                                        {`${event.organizer.first_name || ""} ${event.organizer.middle_name || ""} ${event.organizer.last_name || ""}`.trim()}
                                                                    </p>
                                                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 sm:text-base">
                                                                        <Phone
                                                                            size={14}
                                                                            className="sm:size-4"
                                                                        />
                                                                        <span>{event.organizer.contact_number || "N/A"}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 sm:text-base">
                                                                        <Mail
                                                                            size={14}
                                                                            className="sm:size-4"
                                                                        />
                                                                        <span className="break-all">{event.organizer.email || "N/A"}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {event.resources && event.resources.length > 0 && (
                                                        <div className="space-y-2.5 sm:space-y-4">
                                                            <div>
                                                                <div className="mb-2 flex items-center gap-1.5">
                                                                    <Database
                                                                        size={16}
                                                                        className="text-green-500 sm:size-4"
                                                                    />
                                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white sm:text-lg">
                                                                        Resources
                                                                    </h4>
                                                                </div>
                                                                <div className="pl-6 sm:pl-7">
                                                                    <div className="max-h-32 overflow-y-auto pr-1 sm:max-h-40 sm:pr-2">
                                                                        {event.resources.map((resource, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="mb-2 text-xs text-gray-600 last:mb-0 dark:text-gray-300 sm:text-base"
                                                                            >
                                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                                    {resource.resource_name}
                                                                                </div>
                                                                                <div className="mt-1 flex items-center gap-1.5">
                                                                                    <span
                                                                                        className={`inline-block h-1.5 w-1.5 rounded-full ${resource.availability ? "bg-green-500" : "bg-red-500"}`}
                                                                                    ></span>
                                                                                    <span className="text-[10px] sm:text-xs">
                                                                                        {resource.resource_type} •{" "}
                                                                                        {resource.availability ? "Available" : "Unavailable"}
                                                                                    </span>
                                                                                </div>
                                                                                {resource.description && (
                                                                                    <div className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 sm:text-sm">
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

                                        {/* Card Actions - Mobile: smaller buttons */}
                                        <div className="border-t border-gray-100 bg-gray-50/50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800/50 sm:px-5 sm:py-4 lg:px-6">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                                                <button
                                                    onClick={() => openEditModal(event)}
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                                                    title="Edit Event"
                                                >
                                                    <PencilLine
                                                        size={16}
                                                        className="sm:size-4"
                                                    />
                                                </button>
                                                {role === "admin" && (
                                                    <button
                                                        onClick={() => handleDeleteEvent(event._id)}
                                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                                                        title="Delete Event"
                                                    >
                                                        <Trash
                                                            size={16}
                                                            className="sm:size-4"
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Database className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white sm:text-xl">No events found</h3>
                                <p className="max-w-md px-4 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-base">
                                    There are no events matching your current filters. Try adjusting your search criteria or add a new event.
                                </p>
                                <button
                                    onClick={openAddModal}
                                    className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                                >
                                    <Plus
                                        size={16}
                                        className="sm:size-4"
                                    />
                                    Add First Event
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination - Mobile: tighter */}
                {totalPages > 1 && (
                    <div className="border-t border-gray-200 bg-white/80 px-3 py-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80 sm:px-5 lg:px-6">
                        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
                            <div className="text-xs text-gray-700 dark:text-gray-300 sm:text-base">
                                Showing <span className="font-semibold">{showingStart}</span> to <span className="font-semibold">{showingEnd}</span>{" "}
                                of <span className="font-semibold">{isTotalEvent}</span> results
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:px-4 sm:py-2.5 sm:text-sm"
                                >
                                    Previous
                                </button>

                                <div className="flex sm:hidden">
                                    <span className="mx-1.5 flex items-center text-xs text-gray-500">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>

                                <div className="hidden sm:flex">{renderPageNumbers()}</div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:px-4 sm:py-2.5 sm:text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modals - no change needed */}
                <AddFormModal
                    isOpen={isFormModalOpen}
                    onClose={closeFormModal}
                    Resources={isResourcesDropdown}
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                    editingData={isEditing ? formData : null}
                    bgtheme={bgtheme}
                    FontColor={FontColor}
                    linkId={linkId}
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
