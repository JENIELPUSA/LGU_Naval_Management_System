import { useState, useEffect, useContext } from "react";
import {
    CircleX,
    CircleCheckBig,
    PencilLine,
    Trash,
    Plus,
    Database,
    FileText,
    MessageSquare,
    Clock,
    User,
    Eye,
    File,
    ChevronDown,
    ChevronUp,
    StickyNote,
} from "lucide-react";
import { ProposalDisplayContext } from "../../../contexts/ProposalContext/ProposalContext";
import LoadingOverlay from "../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../ReusableFolder/StatusModal";
import AddFormModal from "./AddFormMOdal";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PersonilContext } from "../../../contexts/PersonelContext/PersonelContext";
import { motion } from "framer-motion";

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
        isTotalProposal,
    } = useContext(ProposalDisplayContext);
    const { bgtheme, FontColor } = useContext(PersonilContext);


    console.log("isProposal",isProposal)
    const navigate = useNavigate();
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
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingAdminId, setIsEditingProposal] = useState(null);
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const [currentRejectProposal, setCurrentRejectProposal] = useState(null);
    const [rejectNotes, setRejectNotes] = useState("");
    const [notesError, setNotesError] = useState("");
    const [expandedRow, setExpandedRow] = useState(null);

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
        setFormData({ title: "", description: "" });
    };

    const openAddModal = () => {
        setIsEditing(false);
        setIsEditingProposal(null);
        setFormData({ title: "", description: "" });
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
        return (
            <div className="relative flex items-center">
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        aria-label={`Go to page ${pageNum}`}
                        style={{ background: bgtheme, color: FontColor }}
                        className="mx-0.5 h-8 min-w-[32px] rounded-md px-2 py-1 text-xs font-medium sm:mx-1 sm:h-10 sm:min-w-[40px] sm:px-3 sm:py-2 sm:text-sm"
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

    const handleDeleteProposal = (id) => {
        setDeleteID(id);
        setVerification(true);
    };

    const handleConfirmReject = async () => {
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
                remarks: rejectNotes,
            };
            await UpdateProposalMetaData(id, values);
            setRejectModalOpen(false);
            setRejectNotes("");
            setCurrentRejectProposal(null);
            setNotesError("");
            FetchProposalDisplay(currentPage, limit, searchTerm, dateFrom, dateTo);
        }
    };

    const handleConfirmDelete = async () => {
        if (isDeleteID) {
            setIsLoading(true);
            const result = await DeleteProposal(isDeleteID, linkId);
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
                    bg: "bg-emerald-50 dark:bg-emerald-900/20",
                    badge: "bg-emerald-500 text-white",
                };
            case "pending":
                return {
                    bg: "bg-amber-50 dark:bg-amber-900/20",
                    badge: "bg-amber-500 text-white",
                };
            case "rejected":
                return {
                    bg: "bg-red-50 dark:bg-red-900/20",
                    badge: "bg-red-500 text-white",
                };
            default:
                return {
                    bg: "bg-gray-50 dark:bg-gray-800",
                    badge: "bg-gray-500 text-white",
                };
        }
    };

    const getFileNameFromUrl = (url) => {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const parts = pathname.split("/");
            const fileNameWithExtension = parts[parts.length - 1];
            const decodedFileName = decodeURIComponent(fileNameWithExtension);
            return decodedFileName.replace(/^\d+_/, "");
        } catch (error) {
            return "Download File";
        }
    };

    const toggleRowExpansion = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    if (isLoading) return <LoadingOverlay />;

    return (
        <>
            {/* MOBILE VIEW */}
            <div className="block md:hidden min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-slate-900/90">
                    <div className="px-3 py-3">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-base font-bold text-gray-900 dark:text-white">Proposal Management</h1>
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-[10px] pl-8 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
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
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
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
                                        className="rounded border border-gray-200 bg-white px-2 py-1 text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="rounded border border-gray-200 bg-white px-2 py-1 text-[10px] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <button
                                    onClick={openAddModal}
                                    style={{ background: bgtheme, color: FontColor }}
                                    className="mt-1 rounded border px-2 py-1 text-[10px] font-medium"
                                >
                                    <Plus size={10} className="inline mr-1" /> Add Proposal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-3 py-3">
                    {isProposal && isProposal.length > 0 ? (
                        <div className="space-y-3">
                            {isProposal.map((proposal) => {
                                const statusConfig = getStatusConfig(proposal.status);
                                const organizerName = proposal.organizerInfo
                                    ? `${proposal.organizerInfo.first_name || ""} ${proposal.organizerInfo.middle_name || ""} ${proposal.organizerInfo.last_name || ""}`.trim()
                                    : "Unknown Organizer";
                                const fileName = proposal.fileName || getFileNameFromUrl(proposal.fileUrl);
                                const isExpanded = expandedRow === proposal._id;

                                return (
                                    <div
                                        key={proposal._id}
                                        className={`rounded-lg border ${statusConfig.bg} dark:border-gray-700`}
                                    >
                                        <div className="p-3">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                                                        {proposal.title || "Untitled Proposal"}
                                                    </h3>
                                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${statusConfig.badge}`}>
                                                        {proposal.status?.charAt(0).toUpperCase() + proposal.status?.slice(1) || "Pending"}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={10} />
                                                        <span>
                                                            {proposal.created_at
                                                                ? new Date(proposal.created_at).toLocaleDateString("en-US", {
                                                                      month: "short",
                                                                      day: "numeric",
                                                                      year: "numeric",
                                                                  })
                                                                : "Recently"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <User size={10} />
                                                        <span className="truncate">{organizerName}</span>
                                                    </div>
                                                </div>
                                                {proposal.fileUrl && (
                                                    <div className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 mt-1">
                                                        <File size={10} />
                                                        <span>PDF Attached</span>
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    <button
                                                        onClick={() => openEditModal(proposal)}
                                                        className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                                                    >
                                                        <PencilLine size={10} /> Edit
                                                    </button>
                                                    {role === "admin" && (
                                                        <button
                                                            onClick={() => handleDeleteProposal(proposal._id)}
                                                            className="flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                                                        >
                                                            <Trash size={10} /> Delete
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => toggleRowExpansion(proposal._id)}
                                                        className="flex items-center gap-1 rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-600 hover:bg-gray-100 dark:bg-gray-800/30 dark:text-gray-400"
                                                    >
                                                        {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />} Details
                                                    </button>
                                                </div>
                                                {isExpanded && (
                                                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600 space-y-2">
                                                        <div>
                                                            <h4 className="text-[10px] font-medium text-gray-900 dark:text-white">Description</h4>
                                                            <p className="mt-1 text-[10px] text-gray-600 dark:text-gray-300">
                                                                {proposal.description || "No description provided"}
                                                            </p>
                                                        </div>
                                                        {proposal.fileUrl && (
                                                            <div>
                                                                <h4 className="text-[10px] font-medium text-gray-900 dark:text-white">Attached File</h4>
                                                                <a
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewFile(proposal._id, proposal);
                                                                    }}
                                                                    className="mt-1 inline-flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 hover:underline"
                                                                >
                                                                    <Eye size={10} /> {fileName}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {proposal.remarks && (
                                                            <div>
                                                                <h4 className="text-[10px] font-medium text-gray-900 dark:text-white">Remarks</h4>
                                                                <p className="mt-1 text-[10px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50 p-1 rounded">
                                                                    {proposal.remarks}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {/* Proposal Note Section - Mobile */}
                                                        {proposal.note && (
                                                            <div>
                                                                <h4 className="text-[10px] font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                                                    <StickyNote size={10} />
                                                                    Proposal Note
                                                                </h4>
                                                                <p className="mt-1 text-[10px] text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-1 rounded border-l-2 border-blue-500">
                                                                    {proposal.note}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
                            <Database className="mx-auto h-6 w-6 text-purple-500" />
                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">No proposals found</p>
                            <button
                                onClick={openAddModal}
                                className="mt-2 text-[10px] text-purple-600 underline"
                            >
                                Add your first proposal
                            </button>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="sticky bottom-0 border-t border-gray-200 bg-white/90 px-3 py-2 dark:border-gray-700 dark:bg-slate-900/90">
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400">
                                Showing {showingStart}–{showingEnd} of {isTotalProposal}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-600 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                >
                                    Prev
                                </button>
                                <div>{renderPageNumbers()}</div>
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

            {/* DESKTOP VIEW */}
            <div className="hidden md:block min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                    <div className="px-4 py-4 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Proposal Management</h1>
                                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400 sm:mt-1 sm:text-sm">
                                    Review and manage proposal submissions
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <div className="relative w-full sm:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 pl-9 text-xs text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500 sm:px-4 sm:py-2 sm:text-sm"
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
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                                    >
                                        <svg
                                            className="h-4 w-4 sm:h-5 sm:w-5"
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
                                <div className="flex gap-1.5 sm:gap-2">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-3 sm:py-2.5 sm:text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-3 sm:py-2.5 sm:text-sm"
                                    />
                                </div>
                                <button
                                    onClick={openAddModal}
                                    style={{ background: bgtheme, color: FontColor }}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm transition-all hover:bg-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                                >
                                    <Plus size={14} className="sm:size-4" />
                                    Add Proposal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-4 sm:p-6">
                    {isProposal && isProposal.length > 0 ? (
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {isProposal.map((proposal) => {
                                const statusConfig = getStatusConfig(proposal.status);
                                const organizerName = proposal.organizerInfo
                                    ? `${proposal.organizerInfo.first_name || ""} ${proposal.organizerInfo.middle_name || ""} ${proposal.organizerInfo.last_name || ""}`.trim()
                                    : "Unknown Organizer";
                                const fileName = proposal.fileName || getFileNameFromUrl(proposal.fileUrl);

                                return (
                                    <div
                                        key={proposal._id}
                                        className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md ${statusConfig.bg} dark:bg-gray-800 sm:rounded-2xl`}
                                    >
                                        <div className="p-4 pb-3 sm:p-6 sm:pb-4">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 dark:text-white sm:text-xl">
                                                        {proposal.title || "Untitled Proposal"}
                                                    </h3>
                                                    <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-3 sm:text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={12} className="sm:size-4" />
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
                                                            <User size={12} className="sm:size-4" />
                                                            <span className="font-medium text-gray-800 dark:text-gray-200">Organizer:</span>
                                                            <span className="truncate">{organizerName}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {proposal.status && (
                                                    <div
                                                        className={`mt-2 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold sm:mt-0 ${statusConfig.badge}`}
                                                    >
                                                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-4 pb-3 sm:px-6 sm:pb-4">
                                            <div className="space-y-4 sm:space-y-6">
                                                <div>
                                                    <div className="mb-2 flex items-center gap-1.5 sm:gap-2">
                                                        <FileText size={14} className="text-blue-500 sm:size-4" />
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                                                            Description
                                                        </h4>
                                                    </div>
                                                    <div className="pl-5 sm:pl-6">
                                                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 sm:text-sm">
                                                            {proposal.description || "No description provided"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {proposal.fileUrl && (
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-1.5 sm:gap-2">
                                                            <File size={14} className="text-purple-500 sm:size-4" />
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                                                                Attached File
                                                            </h4>
                                                        </div>
                                                        <div className="pl-5 sm:pl-6">
                                                            <a
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewFile(proposal._id, proposal);
                                                                }}
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
                                                            >
                                                                <Eye size={12} className="sm:size-4" />
                                                                {fileName}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {proposal.remarks && (
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-1.5 sm:gap-2">
                                                            <MessageSquare size={14} className="text-blue-500 sm:size-4" />
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                                                                Remarks
                                                            </h4>
                                                        </div>
                                                        <div className="pl-5 sm:pl-6">
                                                            <div className="rounded-lg border-l-4 border-pink-500 bg-gray-50 p-2 dark:bg-gray-700/50 sm:p-3">
                                                                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 sm:text-sm">
                                                                    {proposal.remarks}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Proposal Note Section - Desktop */}
                                                {proposal.note && (
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-1.5 sm:gap-2">
                                                            <StickyNote size={14} className="text-green-500 sm:size-4" />
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                                                                Proposal Note
                                                            </h4>
                                                        </div>
                                                        <div className="pl-5 sm:pl-6">
                                                            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-2 dark:bg-green-900/20 sm:p-3">
                                                                <p className="text-xs leading-relaxed text-gray-700 dark:text-green-200 sm:text-sm">
                                                                    {proposal.note}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50 sm:px-6 sm:py-4">
                                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div
                                                        className={`h-1.5 w-1.5 rounded-full ${statusConfig.badge.replace("text-white", "").replace("bg-", "bg-")}`}
                                                    ></div>
                                                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        {proposal.status || "Pending Review"}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                    <button
                                                        onClick={() => openEditModal(proposal)}
                                                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 sm:gap-1.5 sm:rounded-lg sm:px-3 sm:py-2 sm:text-sm"
                                                        title="Edit Proposal"
                                                    >
                                                        <PencilLine size={14} className="sm:size-4" />
                                                        Edit
                                                    </button>
                                                    {role === "admin" && (
                                                        <button
                                                            onClick={() => handleDeleteProposal(proposal._id)}
                                                            className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 sm:gap-1.5 sm:rounded-lg sm:px-3 sm:py-2 sm:text-sm"
                                                            title="Delete Proposal"
                                                        >
                                                            <Trash size={14} className="sm:size-4" />
                                                            Delete
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
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl">
                            <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 sm:mb-4 sm:h-16 sm:w-16">
                                    <Database className="h-6 w-6 text-purple-500 sm:h-8 sm:w-8" />
                                </div>
                                <h3 className="mb-1 text-base font-medium text-gray-900 dark:text-white sm:mb-2 sm:text-lg">No proposals found</h3>
                                <p className="max-w-xs px-2 text-center text-xs text-gray-500 dark:text-gray-400 sm:max-w-sm sm:text-sm">
                                    There are no proposals matching your current filters. Try adjusting your search criteria or add a new proposal.
                                </p>
                                <button
                                    onClick={openAddModal}
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple-700 sm:mt-6 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                                >
                                    <Plus size={14} className="sm:size-4" />
                                    Add First Proposal
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="border-t border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80 sm:px-6 sm:py-4">
                        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
                            <div className="text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                                Showing <span className="font-semibold">{showingStart}</span> to <span className="font-semibold">{showingEnd}</span>{" "}
                                of <span className="font-semibold">{isTotalProposal}</span> results
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm"
                                >
                                    Previous
                                </button>
                                <div className="flex">{renderPageNumbers()}</div>
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AddFormModal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                onSubmit={handleFormSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                FontColor={FontColor}
                bgtheme={bgtheme}
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
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl dark:bg-gray-800 sm:p-6">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white sm:text-lg">Reject Proposal</h3>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-sm">
                            Please provide a reason for rejecting this proposal.
                        </p>
                        <textarea
                            value={rejectNotes}
                            onChange={(e) => {
                                setRejectNotes(e.target.value);
                                if (e.target.value.trim() && notesError) {
                                    setNotesError("");
                                }
                            }}
                            className={`mt-3 w-full rounded-lg border ${notesError ? "border-red-500" : "border-gray-200"} bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm`}
                            rows={3}
                            placeholder="Enter reason for rejection..."
                            required
                        />
                        {notesError && <p className="mt-1 text-xs text-red-500">{notesError}</p>}
                        <div className="mt-4 flex justify-end gap-2 sm:mt-6 sm:gap-3">
                            <button
                                onClick={() => {
                                    setRejectModalOpen(false);
                                    setRejectNotes("");
                                    setNotesError("");
                                }}
                                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmReject}
                                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm"
                                disabled={!rejectNotes.trim()}
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProposalTable;