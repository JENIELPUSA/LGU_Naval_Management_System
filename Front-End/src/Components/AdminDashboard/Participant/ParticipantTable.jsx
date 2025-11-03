import { useState, useEffect, useContext } from "react";
import { Database, Trash } from "lucide-react";
import { ParticipantDisplayContext } from "../../../contexts/ParticipantContext/ParticipantContext";
import LoadingOverlay from "../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../ReusableFolder/StatusModal";
import { AuthContext } from "../../../contexts/AuthContext";
import { EventDisplayContext } from "../../../contexts/EventContext/EventContext";
import { PersonilContext } from "../../../contexts/PersonelContext/PersonelContext";
import { motion } from "framer-motion";

const ParticipantTable = () => {
    const {
        FetchParticipant,
        isParticipant,
        DeleteParticipant,
        isLoading,
        setIsLoading,
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        isTotalParticipant,
        customError,
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

    console.log("selectedEvent", selectedEvent);

    useEffect(() => {
        FetchParticipant(currentPage, limit, searchTerm, dateFrom, dateTo, selectedEvent);
    }, [currentPage, searchTerm, dateFrom, dateTo, selectedEvent, limit]);

    const handleSearch = () => {
        setSearchTerm(tempSearchTerm);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleDeleteParticipant = (id) => {
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
                FetchParticipant(currentPage, limit, searchTerm, dateFrom, dateTo, selectedEvent);
            } else {
                setModalStatus("failed");
            }
            setShowModal(true);
        }
    };

    const formatFullName = (admin) => `${admin.first_name} ${admin.middle_name || ""} ${admin.last_name} ${admin.extention || ""}`.trim();

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
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

        const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

        return (
            <div className="relative flex items-center">
                {pageNumbers.map((pageNum, index) => (
                    <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        style={{ background: bgtheme, color: FontColor }}
                        className="relative mx-1 min-w-[36px] rounded-md px-3 py-1"
                    >
                        {pageNum}
                    </button>
                ))}

                {/* Moving border indicator */}
                <motion.div
                    className="absolute bottom-0 h-1 rounded-md bg-blue-500"
                    layout
                    layoutId="page-border" // enables smooth movement
                    style={{
                        width: 36, // same as min-width of button, adjust if needed
                        left: 8 + 42 * (currentPage - startPage), // spacing calculation: mx + width
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>
        );
    };

    const showingStart = (currentPage - 1) * limit + 1;
    const showingEnd = Math.min(currentPage * limit, isTotalParticipant);

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <div className="card border border-pink-300/50 bg-gradient-to-br from-pink-50/30 to-blue-50/30 dark:border-pink-700/50 dark:from-pink-900/20 dark:to-blue-900/20">
                <div className="card-header flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <p className="card-title flex-1 text-slate-800 dark:text-slate-200">Display List</p>
                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
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

                        {/* Date To */}
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

                        {/* Event Dropdown */}
                        <div className="relative">
                            <select
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500"
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
                                            {event.proposal.title} ({new Date(event.eventDate).toLocaleDateString()})
                                        </option>
                                    ))}
                            </select>
                            <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Event
                            </label>
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header bg-gradient-to-r from-pink-400/20 to-blue-400/20 dark:from-pink-700/30 dark:to-blue-700/30">
                                <tr className="table-row">
                                    <th className="table-head text-slate-800 dark:text-slate-100">#</th>
                                    <th className="table-head text-slate-800 dark:text-slate-100">Full Name</th>
                                    <th className="table-head text-slate-800 dark:text-slate-100">Check-In</th>
                                    <th className="table-head text-slate-800 dark:text-slate-100">Check-Out</th>
                                    {role === "admin" && <th className="table-head text-slate-800 dark:text-slate-100">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {isParticipant && isParticipant.length > 0 ? (
                                    isParticipant.map((admin, index) => (
                                        <tr
                                            key={admin._id}
                                            className="table-row border-b border-pink-200/30 hover:bg-pink-100/20 dark:border-pink-900/30 dark:hover:bg-pink-900/10"
                                        >
                                            <td className="table-cell text-slate-800 dark:text-slate-200">{(currentPage - 1) * limit + index + 1}</td>
                                            <td className="table-cell text-slate-800 dark:text-slate-200">{formatFullName(admin)}</td>
                                            <td className="table-cell text-slate-800 dark:text-slate-200">{formatDate(admin.check_in)}</td>
                                            <td className="table-cell text-slate-800 dark:text-slate-200">{formatDate(admin.check_out)}</td>
                                            {role === "admin" && (
                                                <td className="table-cell">
                                                    <button
                                                        onClick={() => handleDeleteParticipant(admin._id)}
                                                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="border border-dashed border-pink-300 py-10 dark:border-pink-700/50"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="inline-flex items-center justify-center rounded-full bg-pink-100/50 p-3 dark:bg-pink-900/20">
                                                    <Database className="size-8 text-pink-500 dark:text-pink-400" />
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-400">No matching records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 p-4 dark:border-slate-700 sm:flex-row">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Showing{" "}
                                <span className="font-medium">
                                    {showingStart}-{showingEnd}
                                </span>{" "}
                                of <span className="font-medium">{isTotalParticipant}</span>
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
