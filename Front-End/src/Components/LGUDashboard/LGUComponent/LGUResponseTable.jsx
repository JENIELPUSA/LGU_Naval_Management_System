import { useState, useEffect, useContext } from "react";
import {
    CircleX,
    Clock8,
    PencilLine,
    Trash,
    CircleCheckBig,
    Database,
    Calendar,
    MapPin,
    User,
    Mail,
    Phone,
    FileText,
    Search,
    Building,
    UserCheck,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import LoadingOverlay from "../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../ReusableFolder/StatusModal";
import { LguResponseContext } from "../../../contexts/LGUResponseContext/LGUResponseContext";
import { AuthContext } from "../../../contexts/AuthContext";

const LGUResponseTable = () => {
    const { role } = useContext(AuthContext);
    const { isLguResponse,DeleteParticipant, currentPage, isTotalResponse,totalPages, customError, FetchLguResponse, UpdateResponse,limit,setCurrentPage,isLoading, setIsLoading, } =
        useContext(LguResponseContext);
    const [isDeleteID, setDeleteID] = useState(null);
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isVerification, setVerification] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
    const [expandedRow, setExpandedRow] = useState(null);
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const [currentRejectResponse, setCurrentRejectResponse] = useState(null);
    const [rejectNotes, setRejectNotes] = useState("");
    const [notesError, setNotesError] = useState("");
    const showingStart = (currentPage - 1) * limit + 1;
    const showingEnd = Math.min(currentPage * limit, isTotalResponse);

    useEffect(() => {
        FetchLguResponse(currentPage, limit, searchTerm, dateFrom, dateTo);
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

    const handleApprove = async (response) => {
        const submittedBy = response.EventInfo.created_by;
        const id = response._id;
        const values = {
            status: "approved",
            submitted_by: submittedBy,
        };
        await UpdateResponse(id, values);
    };

    const handleReject = (response) => {
        setCurrentRejectResponse(response);
        setRejectModalOpen(true);
        setNotesError("");
    };

    const handleConfirmReject = async () => {
        if (!rejectNotes.trim()) {
            setNotesError("Notes are required for rejection");
            return;
        }

        if (currentRejectResponse) {
            const submittedBy = currentRejectResponse.EventInfo.created_by;
            const id = currentRejectResponse._id;
            const values = {
                status: "rejected",
                submitted_by: submittedBy,
                note: rejectNotes,
            };

            await UpdateResponse(id, values);
            setRejectModalOpen(false);
            setRejectNotes("");
            setCurrentRejectResponse(null);
            setNotesError("");
            FetchLguResponse(currentPage, limit, searchTerm, dateFrom, dateTo);
        }
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

    const handleDeleteEvent = (id) => {
        setDeleteID(id);
        setVerification(true);
    };

    const handleConfirmDelete = async () => {
        if (isDeleteID) {
            setIsLoading(true);
            const result = await DeleteParticipant(isDeleteID);
            setIsLoading(false);

            if (result?.success) {
                setModalStatus("success");
                setDeleteID(null);
                setVerification(false);
                FetchLguResponse(currentPage, limit, searchTerm, dateFrom, dateTo);
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
                    bg: "bg-emerald-50 dark:bg-emerald-900/20",
                    text: "text-emerald-700 dark:text-emerald-300",
                    badge: "bg-emerald-500 text-white",
                    icon: "text-emerald-500",
                };
            case "pending":
                return {
                    bg: "bg-amber-50 dark:bg-amber-900/20",
                    text: "text-amber-700 dark:text-amber-300",
                    badge: "bg-amber-500 text-white",
                    icon: "text-amber-500",
                };
            case "rejected":
                return {
                    bg: "bg-red-50 dark:bg-red-900/20",
                    text: "text-red-700 dark:text-red-300",
                    badge: "bg-red-500 text-white",
                    icon: "text-red-500",
                };
            default:
                return {
                    bg: "bg-gray-50 dark:bg-gray-800",
                    text: "text-gray-700 dark:text-gray-300",
                    badge: "bg-gray-500 text-white",
                    icon: "text-gray-500",
                };
        }
    };

    const toggleRowExpansion = (id) => {
        if (expandedRow === id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(id);
        }
    };

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
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
                                <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    <Building className="h-6 w-6" />
                                    LGU Response
                                </h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage and organize LGU responses efficiently</p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {/* Search Input */}
                                <div className="relative w-full sm:max-w-xs">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pl-10 pr-10 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
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

                                {/* Date Filters */}
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        />
                                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        />
                                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    {isLguResponse && isLguResponse.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="w-[25%] px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Event Details
                                            </th>
                                            <th scope="col" className="w-[15%] px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Date & Time
                                            </th>
                                            <th scope="col" className="w-[15%] px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Organizer
                                            </th>
                                            <th scope="col" className="w-[10%] px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Resources
                                            </th>
                                            <th scope="col" className="w-[10%] px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Status
                                            </th>
                                            <th scope="col" className="w-[15%] px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                Actions
                                            </th>
                                            <th scope="col" className="w-[5%] px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                {/* Expand column */}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {isLguResponse?.map((event, index) => {
                                            const statusConfig = getStatusConfig(event.status);
                                            const isExpanded = expandedRow === event._id;

                                            return (
                                                <>
                                                    <tr
                                                        key={event._id}
                                                        className={`${isExpanded ? "bg-gray-50 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-700"} transition-colors`}
                                                    >
                                                        {/* Event Details - WITH CLAMP */}
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-start">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    <FileText className="h-10 w-10 rounded-full text-blue-500" />
                                                                </div>
                                                                <div className="ml-3 min-w-0 flex-1">
                                                                    {/* Title with line clamp */}
                                                                    <div className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white break-words">
                                                                        {event.proposalInfo?.title || "Untitled Event"}
                                                                    </div>
                                                                    {/* Venue with line clamp */}
                                                                    <div className="line-clamp-1 text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                                                                        {event.EventInfo?.venue || "TBD"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Date & Time */}
                                                        <td className="px-4 py-4">
                                                            <div className="text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                                                {new Date(event.EventInfo?.eventDate).toLocaleDateString("en-US", {
                                                                    weekday: "short",
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                                {event.EventInfo?.startTime || "TBD"}
                                                            </div>
                                                        </td>

                                                        {/* Organizer - WITH CLAMP */}
                                                        <td className="px-4 py-4">
                                                            {event.organizer ? (
                                                                <div className="min-w-0">
                                                                    {/* Organizer name with line clamp */}
                                                                    <div className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white break-words">
                                                                        {`${event.organizer.first_name || ""} ${event.organizer.last_name || ""}`.trim()}
                                                                    </div>
                                                                    {/* Email with line clamp */}
                                                                    <div className="line-clamp-1 text-sm text-gray-500 dark:text-gray-400 break-words mt-1">
                                                                        {event.organizer.email || "N/A"}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                                                            )}
                                                        </td>

                                                        {/* Resources */}
                                                        <td className="px-4 py-4">
                                                            <div className="text-sm text-gray-900 dark:text-white">
                                                                {event.resources ? event.resources.length : 0} resources
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {event.resources
                                                                    ? `${event.resources.filter((r) => r.availability).length} available`
                                                                    : "0 available"}
                                                            </div>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.badge}`}
                                                            >
                                                                {event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || "Unknown"}
                                                            </span>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center space-x-2">
                                                                {role !== "organizer" && (
                                                                    <>
                                                                        {event.status !== "approved" && event.status !== "rejected" && (
                                                                            <button
                                                                                onClick={() => handleApprove(event)}
                                                                                className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                                                                                title="Approve event"
                                                                            >
                                                                                <CircleCheckBig size={18} />
                                                                            </button>
                                                                        )}
                                                                        {event.status !== "rejected" && event.status !== "approved" && (
                                                                            <button
                                                                                onClick={() => handleReject(event)}
                                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                                title="Reject event"
                                                                            >
                                                                                <CircleX size={18} />
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDeleteEvent(event._id)}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                    title="Delete Event"
                                                                >
                                                                    <Trash size={18} />
                                                                </button>
                                                            </div>
                                                        </td>

                                                        {/* Expand Button */}
                                                        <td className="px-4 py-4 text-right">
                                                            <button
                                                                onClick={() => toggleRowExpansion(event._id)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    
                                                    {/* Expanded Row */}
                                                    {isExpanded && (
                                                        <tr className="bg-gray-50 dark:bg-gray-700">
                                                            <td colSpan="7" className="px-4 py-4">
                                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                                    {/* Event Details */}
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <div className="mb-2 flex items-center gap-2">
                                                                                <FileText size={16} className="text-blue-500" />
                                                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                                                    Event Description
                                                                                </h4>
                                                                            </div>
                                                                            <p className="pl-6 text-sm text-gray-600 dark:text-gray-300 break-words">
                                                                                {event.eventInfo?.description || "No description available"}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 flex items-center gap-2">
                                                                                <UserCheck size={16} className="text-purple-500" />
                                                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                                                    Respondent
                                                                                </h4>
                                                                            </div>
                                                                            <p className="pl-6 text-sm text-gray-600 dark:text-gray-300 break-words">
                                                                                {event.LGUInfo
                                                                                    ? `${event.LGUInfo.first_name || ""} ${event.LGUInfo.middle_name || ""} ${event.LGUInfo.last_name || ""}`.trim()
                                                                                    : "No respondent information available"}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 flex items-center gap-2">
                                                                                <FileText size={16} className="text-blue-500" />
                                                                                <h4 className="font-medium text-gray-900 dark:text-white">Notes</h4>
                                                                            </div>
                                                                            <p className="pl-6 text-sm text-gray-600 dark:text-gray-300 break-words">
                                                                                {event.note || "N/A"}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Resources Details */}
                                                                    {event.resources && event.resources.length > 0 && (
                                                                        <div className="space-y-4">
                                                                            <div>
                                                                                <div className="mb-3 flex items-center gap-2">
                                                                                    <Database size={16} className="text-green-500" />
                                                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                                                        Resources Details
                                                                                    </h4>
                                                                                </div>
                                                                                <div className="max-h-48 space-y-3 overflow-y-auto pr-2">
                                                                                    {event.resources.map((resource, idx) => (
                                                                                        <div key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                                                                                            <div className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
                                                                                                <div className={`h-2 w-2 rounded-full ${resource.availability ? "bg-green-500" : "bg-red-500"}`}></div>
                                                                                                {resource.resource_name}
                                                                                            </div>
                                                                                            <div className="ml-3 mt-1 flex items-center gap-2">
                                                                                                <span className="break-words">
                                                                                                    {resource.resource_type} •{" "}
                                                                                                    {resource.availability ? "Available" : "Unavailable"}
                                                                                                </span>
                                                                                            </div>
                                                                                            {resource.description && (
                                                                                                <div className="ml-3 mt-1 text-xs text-gray-500 dark:text-gray-400 break-words">
                                                                                                    {resource.description}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Database className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No events found</h3>
                                <p className="max-w-sm text-center text-gray-500 dark:text-gray-400">
                                    There are no events matching your current filters. Try adjusting your search criteria.
                                </p>
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
                                of <span className="font-semibold">{isTotalResponse}</span> results
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

                {/* Reject Notes Modal */}
                {isRejectModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Reject LGU Response</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Please provide a reason for rejecting this LGU response.</p>

                            <textarea
                                value={rejectNotes}
                                onChange={(e) => {
                                    setRejectNotes(e.target.value);
                                    if (e.target.value.trim() && notesError) {
                                        setNotesError("");
                                    }
                                }}
                                className={`mt-4 w-full rounded-lg border ${notesError ? "border-red-500" : "border-gray-200"} bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
                                rows={4}
                                placeholder="Enter reason for rejection..."
                                required
                            />
                            {notesError && <p className="mt-1 text-sm text-red-500">{notesError}</p>}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setRejectModalOpen(false);
                                        setRejectNotes("");
                                        setNotesError("");
                                    }}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmReject}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                                    disabled={!rejectNotes.trim()}
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default LGUResponseTable;