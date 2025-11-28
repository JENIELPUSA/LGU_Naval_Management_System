import { useState, useEffect, useContext } from "react";
import { Database, ArchiveX, User, Calendar, Clock, Check, X } from "lucide-react";
import { ParticipantDisplayContext } from "../../../contexts/ParticipantContext/ParticipantContext";
import LoadingOverlay from "../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../ReusableFolder/StatusModal";
import { AuthContext } from "../../../contexts/AuthContext";
import { EventDisplayContext } from "../../../contexts/EventContext/EventContext";
import { PersonilContext } from "../../../contexts/PersonelContext/PersonelContext";

const ParticipantTable = () => {
    const {
        FetchParticipant,
        isParticipant,
        DeleteParticipant,
        UpdateParticipantStatus, 
        isLoading,
        setIsLoading,
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        isTotalParticipant,
        customError,
        MoveToArchived,
    } = useContext(ParticipantDisplayContext);
    const { bgtheme, FontColor } = useContext(PersonilContext);
    const { isEvent } = useContext(EventDisplayContext);
    const { role } = useContext(AuthContext);

    const [isDeleteID, setDeleteID] = useState(null);
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isVerification, setVerification] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false); // For Accept/Reject loading state

    useEffect(() => {
        FetchParticipant(currentPage, limit, searchTerm, dateFrom, dateTo, selectedEvent);
    }, [currentPage, searchTerm, dateFrom, dateTo, selectedEvent, limit]);


    const handleDeleteParticipant = async(id) => {
      await MoveToArchived(id,true)
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
                FetchParticipant(currentPage, limit, searchTerm, dateFrom, dateTo, selectedEvent);
            } else {
                setModalStatus("failed");
            }
            setShowModal(true);
        }
    };

    //Accept/Reject Handlers
    const handleAccept = async (id) => {
        await UpdateParticipantStatus(id, "Accept");
    };



    const handleReject = async (id) => {
        await UpdateParticipantStatus(id, "Reject");
    };

    const formatFullName = (admin) => `${admin.first_name} ${admin.middle_name || ""} ${admin.last_name} ${admin.extention || ""}`.trim();

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
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

    const showingStart = (currentPage - 1) * limit + 1;
    const showingEnd = Math.min(currentPage * limit, isTotalParticipant);

    return (
        <>
            {(isLoading || isUpdating) && <LoadingOverlay />}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-slate-900/90">
                    <div className="px-2 py-3 sm:px-4 sm:py-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h1 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">Participant Management</h1>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                                <div className="flex gap-1">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="rounded border border-gray-200 bg-white px-1.5 py-1 text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-2 sm:py-1.5 sm:text-xs"
                                    />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="rounded border border-gray-200 bg-white px-1.5 py-1 text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-2 sm:py-1.5 sm:text-xs"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <select
                                    className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-2 sm:py-1.5 sm:text-xs"
                                    value={selectedEvent}
                                    onChange={(e) => {
                                        setSelectedEvent(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Events</option>
                                    {isEvent &&
                                        isEvent.map((event) => (
                                            <option
                                                key={event._id}
                                                value={event._id}
                                            >
                                                {event.proposal?.title || "Untitled Event"}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-2 py-3 sm:px-4 sm:py-4">
                    {isParticipant && isParticipant.length > 0 ? (
                        <div className="space-y-2 sm:space-y-3">
                            {isParticipant.map((participant, index) => (
                                <div
                                    key={participant._id}
                                    className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="p-2.5 sm:p-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <User
                                                            size={12}
                                                            className="text-blue-600 dark:text-blue-400"
                                                        />
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                                                        {formatFullName(participant)}
                                                    </h3>
                                                </div>
                                                <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                    #{(currentPage - 1) * limit + index + 1}
                                                </span>
                                            </div>

                                            {/* Optional: Show current status */}
                                            {participant.status && (
                                                <div className="mt-1">
                                                    <span
                                                        className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                                                            participant.status === "accepted"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                                : participant.status === "rejected"
                                                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                        }`}
                                                    >
                                                        {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-3 text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar
                                                            size={10}
                                                            className="sm:size-3"
                                                        />
                                                        <span className="font-medium">Check-in:</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 pl-4">
                                                        <Clock
                                                            size={10}
                                                            className="sm:size-3"
                                                        />
                                                        <span>{formatDate(participant.check_in)}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar
                                                            size={10}
                                                            className="sm:size-3"
                                                        />
                                                        <span className="font-medium">Check-out:</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 pl-4">
                                                        <Clock
                                                            size={10}
                                                            className="sm:size-3"
                                                        />
                                                        <span>{formatDate(participant.check_out)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {participant.event && (
                                                <div className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs">
                                                    <span className="font-medium">Event:</span>
                                                    <span className="truncate">{participant.event.proposal?.title || "Unknown Event"}</span>
                                                </div>
                                            )}

                                            {(role === "admin" || role === "organizer") && (
                                                <div className="mt-2 flex flex-wrap justify-end gap-1">
                                                    {participant.status === "Pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAccept(participant._id)}
                                                                disabled={isUpdating}
                                                                className="flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 text-[10px] text-green-700 hover:bg-green-100 disabled:opacity-60 dark:bg-green-900/20 dark:text-green-400 sm:gap-1.5 sm:px-2 sm:py-1 sm:text-xs"
                                                            >
                                                                <Check
                                                                    size={10}
                                                                    className="sm:size-3"
                                                                />{" "}
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(participant._id)}
                                                                disabled={isUpdating}
                                                                className="flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-700 hover:bg-red-100 disabled:opacity-60 dark:bg-red-900/20 dark:text-red-400 sm:gap-1.5 sm:px-2 sm:py-1 sm:text-xs"
                                                            >
                                                                <X
                                                                    size={10}
                                                                    className="sm:size-3"
                                                                />{" "}
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        onClick={() => handleDeleteParticipant(participant._id)}
                                                        className="flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 sm:gap-1.5 sm:px-2 sm:py-1 sm:text-xs"
                                                    >
                                                        <ArchiveX
                                                            size={10}
                                                            className="sm:size-3"
                                                        />{" "}
                                                        Archive
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
                            <Database className="mx-auto h-6 w-6 text-purple-500" />
                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">No participants found</p>
                            <button
                                style={{ background: bgtheme, color: FontColor }}
                                className="mt-2 rounded px-2 py-1 text-[10px] font-medium sm:px-3 sm:py-1.5 sm:text-xs"
                            >
                                Add First Participant
                            </button>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="sticky bottom-0 border-t border-gray-200 bg-white/90 px-2 py-2 dark:border-gray-700 dark:bg-slate-900/90 sm:px-4 sm:py-3">
                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-0">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs">
                                Showing {showingStart}–{showingEnd} of {isTotalParticipant}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-600 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:px-2.5 sm:py-1 sm:text-xs"
                                >
                                    Prev
                                </button>
                                {renderPageNumbers()}
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-600 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:px-2.5 sm:py-1 sm:text-xs"
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
                    onClose={() => setVerification(false)}
                />
            </div>
        </>
    );
};

export default ParticipantTable;
