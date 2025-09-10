import { useState, useEffect, useContext } from "react";
import { CircleX, CircleCheckBig, PencilLine, Trash, Plus, Database, FileText, MessageSquare, Clock, User, Eye, File } from "lucide-react";
import { ProposalDisplayContext } from "../../../contexts/ProposalContext/ProposalContext";
import LoadingOverlay from "../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../ReusableFolder/StatusModal";
import AddFormModal from "./AddFormMOdal";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProposalTable = () => {
    const {
        AddProposal,
        isProposal,
        DeleteProposal,
        customError,
        FetchProposalDisplay,
        isLoading,
        setIsLoading,
        UpdateProposal,
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        UpdateProposalMetaData,
        UpdateStatus,
        isTotalProposal,
    } = useContext(ProposalDisplayContext);

    const navigate = useNavigate();
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
        title: "",
        description: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingAdminId, setIsEditingProposal] = useState(null);
    // New states for rejection notes
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const [currentRejectProposal, setCurrentRejectProposal] = useState(null);
    const [rejectNotes, setRejectNotes] = useState("");
    const [notesError, setNotesError] = useState(""); // Added state for notes validation

    const showingStart = (currentPage - 1) * limit + 1;
    const showingEnd = Math.min(currentPage * limit, isTotalProposal);

    useEffect(() => {
        FetchProposalDisplay(currentPage, limit, searchTerm, dateFrom, dateTo);
    }, [currentPage, searchTerm, dateFrom, dateTo, limit]);

    const handleViewFile = (fileId, item) => {
        if (!fileId) return;
        navigate(`/dashboard/pdf-viewer/${fileId}`, { state: { fileData: item } });
    };

    const handleSearch = () => {
        setSearchTerm(tempSearchTerm);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleFormSubmit = async (payload) => {
        setIsLoading(true);
        let result;
        if (isEditing) {
            result = await UpdateProposal(editingAdminId, payload);
        } else {
            result = await AddProposal(payload);
        }

        setIsLoading(false);
        setModalStatus(result?.success ? "success" : "failed");
        setShowModal(true);
        closeFormModal();
        FetchProposalDisplay(currentPage, limit, searchTerm, dateFrom, dateTo);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setIsEditing(false);
        setIsEditingProposal(null);
        setFormData({
            title: "",
            description: "",
        });
    };

    const openAddModal = () => {
        setIsEditing(false);
        setIsEditingProposal(null);
        setFormData({
            title: "",
            description: "",
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (proposal) => {
        setIsEditing(true);
        setFormData(proposal);
        setIsEditingProposal(proposal._id);
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
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-200 dark:bg-purple-500 dark:shadow-purple-800"
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

    const handleDeleteProposal = (id) => {
        setDeleteID(id);
        setVerification(true);
    };
    const handleConfirmReject = async () => {
        // Validate that notes are provided
        if (!rejectNotes.trim()) {
            setNotesError("Notes are required for rejection");
            return;
        }

        if (currentRejectProposal) {
            const submittedBy = currentRejectProposal.submitted_by;
            const id = currentRejectProposal._id;
            const values = {
                status: "rejected",
                submitted_by: submittedBy,
                remarks: rejectNotes, // Include the rejection notes
            };

            await UpdateProposalMetaData(id, values);
            setRejectModalOpen(false);
            setRejectNotes("");
            setCurrentRejectProposal(null);
            setNotesError("");
        }
    };

    const handleConfirmDelete = async () => {
        if (isDeleteID) {
            setIsLoading(true);
            const result = await DeleteProposal(isDeleteID);
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

    const getFileNameFromUrl = (url) => {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const parts = pathname.split("/");
            const fileNameWithExtension = parts[parts.length - 1];
            // Decode URI encoded characters
            const decodedFileName = decodeURIComponent(fileNameWithExtension);
            // Remove timestamp prefix if present
            return decodedFileName.replace(/^\d+_/, "");
        } catch (error) {
            return "Download File";
        }
    };

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                {/* Header Section */}
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Proposal Management</h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Review and manage proposal submissions</p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {/* Search Input */}
                                <div className="flex gap-2">
                                    <div className="relative">
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
                                            type="button"
                                            onClick={handleSearch}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            <svg
                                                className="h-5 w-5"
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
                                </div>

                                {/* Date Filters */}
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>

                                {/* Add Button */}
                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                >
                                    <Plus size={16} />
                                    Add Proposal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    {isProposal && isProposal.length > 0 ? (
                        <div className="grid gap-6">
                            {isProposal.map((proposal, index) => {
                                const statusConfig = getStatusConfig(proposal.status);
                                const organizerName = proposal.organizerInfo
                                    ? `${proposal.organizerInfo.first_name || ""} ${proposal.organizerInfo.middle_name || ""} ${proposal.organizerInfo.last_name || ""}`.trim()
                                    : "Unknown Organizer";

                                const fileName = proposal.fileName || getFileNameFromUrl(proposal.fileUrl);

                                return (
                                    <div
                                        key={proposal._id}
                                        className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${statusConfig.bg} dark:bg-gray-800`}
                                    >
                                        {/* Card Header */}
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                                                        {proposal.title || "Untitled Proposal"}
                                                    </h3>
                                                    <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-4">
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            <span>
                                                                Submitted{" "}
                                                                {proposal.created_at
                                                                    ? new Date(proposal.created_at).toLocaleDateString("en-US", {
                                                                          month: "short",
                                                                          day: "numeric",
                                                                          year: "numeric",
                                                                      })
                                                                    : "Recently"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <User size={14} />
                                                            <span className="font-medium text-gray-800 dark:text-gray-200">Organizer:</span>
                                                            <span className="truncate">{organizerName}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {proposal.status && (
                                                    <div
                                                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusConfig.badge}`}
                                                    >
                                                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="px-6 pb-4">
                                            <div className="space-y-6">
                                                {/* Description Section */}
                                                <div>
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <FileText
                                                            size={16}
                                                            className="text-blue-500"
                                                        />
                                                        <h4 className="font-medium text-gray-900 dark:text-white">Description</h4>
                                                    </div>
                                                    <div className="pl-6">
                                                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                            {proposal.description || "No description provided"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* File Attachment Section */}
                                                {proposal.fileUrl && (
                                                    <div>
                                                        <div className="mb-3 flex items-center gap-2">
                                                            <File
                                                                size={16}
                                                                className="text-purple-500"
                                                            />
                                                            <h4 className="font-medium text-gray-900 dark:text-white">Attached File</h4>
                                                        </div>
                                                        <div className="pl-6">
                                                            <a
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewFile(proposal._id, proposal);
                                                                }}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                                            >
                                                                <Eye size={14} />
                                                                {fileName}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Remarks Section */}
                                                {proposal.remarks && (
                                                    <div>
                                                        <div className="mb-3 flex items-center gap-2">
                                                            <MessageSquare
                                                                size={16}
                                                                className="text-blue-500"
                                                            />
                                                            <h4 className="font-medium text-gray-900 dark:text-white">Remarks</h4>
                                                        </div>
                                                        <div className="pl-6">
                                                            <div className="rounded-lg border-l-4 border-pink-500 bg-gray-50 p-3 dark:bg-gray-700/50">
                                                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                                    {proposal.remarks}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Actions */}
                                        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                {/* Status Indicator */}
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${statusConfig.badge.replace("text-white", "").replace("bg-", "bg-")}`}
                                                    ></div>
                                                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        {proposal.status || "Pending Review"}
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => openEditModal(proposal)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                                        title="Edit Proposal"
                                                    >
                                                        <PencilLine size={16} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProposal(proposal._id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                                        title="Delete Proposal"
                                                    >
                                                        <Trash size={16} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <Database className="h-8 w-8 text-purple-500" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No proposals found</h3>
                                <p className="max-w-sm text-center text-gray-500 dark:text-gray-400">
                                    There are no proposals matching your current filters. Try adjusting your search criteria or add a new proposal.
                                </p>
                                <button
                                    onClick={openAddModal}
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                                >
                                    <Plus size={16} />
                                    Add First Proposal
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
                                of <span className="font-semibold">{isTotalProposal}</span> results
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
                <AddFormModal
                    isOpen={isFormModalOpen}
                    onClose={closeFormModal}
                    onSubmit={handleFormSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
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

                {/* Reject Notes Modal */}
                {isRejectModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Reject Proposal</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Please provide a reason for rejecting this proposal.</p>

                            <textarea
                                value={rejectNotes}
                                onChange={(e) => {
                                    setRejectNotes(e.target.value);
                                    // Clear error when user starts typing
                                    if (e.target.value.trim() && notesError) {
                                        setNotesError("");
                                    }
                                }}
                                className={`mt-4 w-full rounded-lg border ${notesError ? "border-red-500" : "border-gray-200"} bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white`}
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
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmReject}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                                    disabled={!rejectNotes.trim()} // Disable button if notes are empty
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

export default ProposalTable;
