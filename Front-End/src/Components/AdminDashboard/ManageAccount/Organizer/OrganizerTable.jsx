import { useState, useEffect, useContext } from "react";
import { Calendar, PencilLine, Trash, Plus } from "lucide-react";
import { OrganizerDisplayContext } from "../../../../contexts/OrganizerContext/OrganizerContext";
import AddOrganizerFormModal from "./AddOrganizerForm";
import LoadingOverlay from "../../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../../ReusableFolder/StatusModal";
import { Database } from "lucide-react";

const OrganizerTable = ({ data, bgtheme, FontColor }) => {
    const {
        AddOrganizer,
        DeleteOrganizer,
        customError,
        FetchOrganizerData,
        isLoading,
        setIsLoading,
        UpdateOrganizer,
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        isTotalOrganizer,
    } = useContext(OrganizerDisplayContext);

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
        first_name: "",
        last_name: "",
        middle_name: "",
        gender: "Male",
        contact_number: "",
        email: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingAdminId, setEditingAdminId] = useState(null);

    const showingStart = (currentPage - 1) * limit + 1;
    const showingEnd = Math.min(currentPage * limit, isTotalOrganizer);

    useEffect(() => {
        FetchOrganizerData(currentPage, limit, searchTerm, dateFrom, dateTo);
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
            result = await UpdateOrganizer(submittedData._id, submittedData);
        } else {
            result = await AddOrganizer(submittedData);
        }

        setIsLoading(false);
        if (result?.success) {
            setModalStatus("success");
        } else {
            setModalStatus("failed");
        }
        setShowModal(true);
        closeFormModal();
        FetchOrganizerData(currentPage, limit, searchTerm, dateFrom, dateTo);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setIsEditing(false);
        setEditingAdminId(null);
        setFormData({
            first_name: "",
            last_name: "",
            middle_name: "",
            gender: "Male",
            contact_number: "",
            email: "",
        });
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditingAdminId(null);
        setFormData({
            first_name: "",
            last_name: "",
            middle_name: "",
            gender: "Male",
            contact_number: "",
            email: "",
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (admin) => {
        setIsEditing(true);
        setEditingAdminId(admin._id);
        setFormData(admin);
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
                    className={`mx-0.5 min-w-[28px] rounded px-2 py-0.5 text-xs ${
                        currentPage === pageNum
                            ? "bg-indigo-500 text-white dark:bg-indigo-700"
                            : "bg-gray-100 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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

    const handleDeleteOrganizer = (id) => {
        setDeleteID(id);
        setVerification(true);
    };

    const handleConfirmDelete = async () => {
        if (isDeleteID) {
            setIsLoading(true);
            const result = await DeleteOrganizer(isDeleteID);
            setIsLoading(false);

            if (result?.success) {
                setModalStatus("success");
                setDeleteID(null);
                setVerification(false);
                FetchOrganizerData(currentPage, limit, searchTerm, dateFrom, dateTo);
            } else {
                setModalStatus("failed");
            }
            setShowModal(true);
        }
    };

    const formatFullName = (admin) => {
        return `${admin.first_name} ${admin.middle_name} ${admin.last_name}`;
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <div className="card border border-pink-300/50 bg-gradient-to-br from-pink-50/30 to-blue-50/30 dark:border-pink-700/50 dark:from-pink-900/20 dark:to-blue-900/20">
                <div className="card-header flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                    <p className="card-title flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">Display List</p>

                    <div className="relative w-full sm:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 pl-9 text-xs text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500 sm:px-4 sm:py-2 sm:text-sm"
                            value={tempSearchTerm}
                            onChange={(e) => setTempSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            aria-label="Search"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4 sm:size-5"
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
                                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500 sm:px-4 sm:py-2 sm:text-sm"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                            <label className="absolute -top-1.5 left-2 bg-white px-1 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:-top-2 sm:left-3 sm:text-xs">
                                From
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="date"
                                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-pink-500 dark:focus:ring-pink-500 sm:px-4 sm:py-2 sm:text-sm"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                            <label className="absolute -top-1.5 left-2 bg-white px-1 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:-top-2 sm:left-3 sm:text-xs">
                                To
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={openAddModal}
                        style={{ background: bgtheme, color: FontColor }}
                        className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-white transition hover:bg-pink-600 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:ring-offset-1 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-500 dark:focus:ring-offset-slate-900 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                    >
                        <Plus
                            size={14}
                            className="sm:size-18"
                        />
                        <span>Add User</span>
                    </button>
                </div>

                <div className="card-body p-0">
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                        <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                            <table className="table">
                                <thead className="table-header bg-gradient-to-r from-pink-400/20 to-blue-400/20 dark:from-pink-700/30 dark:to-blue-700/30">
                                    <tr className="table-row">
                                        <th className="table-head px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 sm:px-4 sm:py-3 sm:text-sm">
                                            #
                                        </th>
                                        <th className="table-head px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 sm:px-4 sm:py-3 sm:text-sm">
                                            Avatar
                                        </th>
                                        <th className="table-head px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 sm:px-4 sm:py-3 sm:text-sm">
                                            Full Name
                                        </th>
                                        <th className="table-head px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 sm:px-4 sm:py-3 sm:text-sm">
                                            Gender
                                        </th>
                                        <th className="table-head px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 sm:px-4 sm:py-3 sm:text-sm">
                                            Phone
                                        </th>
                                        <th className="table-head px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 sm:px-4 sm:py-3 sm:text-sm">
                                            Email
                                        </th>
                                        <th className="table-head px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 sm:px-4 sm:py-3 sm:text-sm">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {data && data.length > 0 ? (
                                        data.map((admin, index) => (
                                            <tr
                                                key={admin._id}
                                                className="table-row border-b border-pink-200/30 hover:bg-pink-100/20 dark:border-pink-900/30 dark:hover:bg-pink-900/10"
                                            >
                                                <td className="table-cell px-3 py-2 text-xs text-slate-800 dark:text-slate-200 sm:px-4 sm:py-3 sm:text-sm">
                                                    {(currentPage - 1) * limit + index + 1}
                                                </td>
                                                <td className="table-cell px-3 py-2 sm:px-4 sm:py-3">
                                                    {admin.avatar?.url ? (
                                                        <img
                                                            src={admin.avatar.url}
                                                            alt="Organizer"
                                                            className="size-10 rounded-md object-cover sm:size-14"
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{ background: bgtheme }}
                                                            className="flex size-10 items-center justify-center rounded-md sm:size-14"
                                                        >
                                                            <span className="text-[10px] font-bold uppercase text-white sm:text-sm">
                                                                {admin.first_name.charAt(0)}
                                                                {admin.last_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="table-cell px-3 py-2 text-xs text-slate-800 dark:text-slate-200 sm:px-4 sm:py-3 sm:text-sm">
                                                    {formatFullName(admin)}
                                                </td>
                                                <td className="table-cell px-3 py-2 text-xs text-slate-800 dark:text-slate-200 sm:px-4 sm:py-3 sm:text-sm">
                                                    {admin.gender}
                                                </td>
                                                <td className="table-cell px-3 py-2 text-xs text-slate-800 dark:text-slate-200 sm:px-4 sm:py-3 sm:text-sm">
                                                    {admin.contact_number}
                                                </td>
                                                <td className="table-cell px-3 py-2 text-xs text-slate-800 dark:text-slate-200 sm:px-4 sm:py-3 sm:text-sm">
                                                    {admin.email}
                                                </td>
                                                <td className="table-cell px-3 py-2 sm:px-4 sm:py-3">
                                                    <div className="flex items-center gap-x-2">
                                                        <button
                                                            onClick={() => openEditModal(admin)}
                                                            className="text-pink-500 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                                                            aria-label="Edit"
                                                        >
                                                            <PencilLine size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteOrganizer(admin._id)}
                                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                            aria-label="Delete"
                                                        >
                                                            <Trash size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="border border-dashed border-pink-300 py-8 text-center dark:border-pink-700/50 sm:py-10"
                                            >
                                                <div className="inline-flex items-center justify-center rounded-full bg-pink-100/50 p-2 dark:bg-pink-900/20 sm:p-3">
                                                    <Database className="size-6 text-pink-500 dark:text-pink-400 sm:size-8" />
                                                </div>
                                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                                                    No matching records found
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile List View */}
                    <div className="md:hidden">
                        <div className="divide-y divide-pink-200/30 dark:divide-pink-900/30">
                            {data && data.length > 0 ? (
                                data.map((admin, index) => {
                                    const fullName = formatFullName(admin);
                                    const serial = (currentPage - 1) * limit + index + 1;
                                    return (
                                        <div
                                            key={admin._id}
                                            className="flex items-start gap-2 p-2 hover:bg-pink-100/20 dark:hover:bg-pink-900/10 sm:gap-3 sm:p-3"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{serial}</span>
                                                {admin.avatar?.url ? (
                                                    <img
                                                        src={admin.avatar.url}
                                                        alt="Organizer"
                                                        className="mt-1 size-8 rounded-md object-cover sm:size-10"
                                                    />
                                                ) : (
                                                    <div className="mt-1 flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-pink-400 to-blue-400 sm:size-10">
                                                        <span className="text-[8px] font-bold uppercase text-white sm:text-[10px]">
                                                            {admin.first_name.charAt(0)}
                                                            {admin.last_name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200 sm:text-sm">
                                                    {fullName}
                                                </p>
                                                <p className="text-[10px] text-slate-600 dark:text-slate-400 sm:text-xs">
                                                    {admin.gender} • {admin.contact_number}
                                                </p>
                                                <p className="truncate text-[10px] text-slate-600 dark:text-slate-400 sm:text-xs">{admin.email}</p>
                                            </div>

                                            <div className="flex flex-col gap-0.5">
                                                <button
                                                    onClick={() => openEditModal(admin)}
                                                    className="text-pink-500 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                                                    aria-label="Edit"
                                                >
                                                    <PencilLine size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrganizer(admin._id)}
                                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    aria-label="Delete"
                                                >
                                                    <Trash size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center sm:p-6">
                                    <div className="inline-flex items-center justify-center rounded-full bg-pink-100/50 p-1.5 dark:bg-pink-900/20 sm:p-2">
                                        <Database className="size-5 text-pink-500 dark:text-pink-400 sm:size-6" />
                                    </div>
                                    <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">No matching records found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 p-2 text-[10px] dark:border-slate-700 sm:flex-row sm:gap-3 sm:p-3 sm:text-xs">
                        <div className="text-slate-600 dark:text-slate-400">
                            Showing{" "}
                            <span className="font-medium">
                                {showingStart}-{showingEnd}
                            </span>{" "}
                            of <span className="font-medium">{isTotalOrganizer}</span>
                        </div>

                        <div className="flex items-center gap-0.5">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                                className={`rounded px-1.5 py-0.5 ${
                                    currentPage === 1
                                        ? "cursor-not-allowed text-slate-400 dark:text-slate-600"
                                        : "text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                }`}
                            >
                                Prev
                            </button>

                            <div className="flex flex-wrap justify-center">{renderPageNumbers()}</div>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                                className={`rounded px-1.5 py-0.5 ${
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

                <AddOrganizerFormModal
                    isOpen={isFormModalOpen}
                    onClose={closeFormModal}
                    onSubmit={handleFormSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
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
            </div>
        </>
    );
};

export default OrganizerTable;
