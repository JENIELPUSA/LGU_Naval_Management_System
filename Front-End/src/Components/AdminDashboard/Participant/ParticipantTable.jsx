import { useState, useEffect, useContext } from "react";
import { Calendar, PencilLine, Trash, Plus } from "lucide-react";
import { ParticipantDisplayContext } from "../../../contexts/ParticipantContext/ParticipantContext";
import LoadingOverlay from "../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../ReusableFolder/StatusModal";
import { Database } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext";

const ParticipantTable = () => {
    const {
        AddOfficer,
        isParticipant,
        DeleteParticipant,
        customError,
        FetchParticipant,
        isLoading,
        setIsLoading,
        UpdateOfficer,
        totalPages,
        currentPage,
        setCurrentPage,
        limit,
        isTotalParticipant,
    } = useContext(ParticipantDisplayContext);
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
        first_name: "",
        last_name: "",
        middle_name: "",
        gender: "Male",
        contact_number: "",
        email: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingAdminId, setEditingAdminId] = useState(null); // New state for hover popup modal

    const [hoveredAdmin, setHoveredAdmin] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); // Calculate showing range

    const showingStart = (currentPage - 1) * limit + 1;
    const showingEnd = Math.min(currentPage * limit, isTotalParticipant); // Page size options

    const pageSizeOptions = [5, 10, 20, 50];

    useEffect(() => {
        FetchParticipant(currentPage, limit, searchTerm, dateFrom, dateTo);
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
                    className={`mx-1 min-w-[36px] rounded-md px-3 py-1 ${
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
                FetchParticipant(currentPage, limit, searchTerm, dateFrom, dateTo);
            } else {
                setModalStatus("failed");
            }
            setShowModal(true);
        }
    };

    const formatFullName = (admin) => {
        return `${admin.first_name} ${admin.last_name}`;
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }; // Function to format date and time

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString(); // Ex: "10/25/2023, 10:30:00 AM"
    }; // Handle mouse enter for showing popup

    const handleMouseEnter = (admin, e) => {
        setHoveredAdmin(admin);
        setPopupPosition({ x: e.clientX, y: e.clientY });
    }; // Handle mouse leave for hiding popup

    const handleMouseLeave = () => {
        setHoveredAdmin(null);
    };

    return (
        <>
                        {isLoading && <LoadingOverlay />}           
            <div className="card border border-pink-300/50 bg-gradient-to-br from-pink-50/30 to-blue-50/30 dark:border-pink-700/50 dark:from-pink-900/20 dark:to-blue-900/20">
                               
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            aria-label="Search"
                        >
                                                       
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
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
                                   
                </div>
                               
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
                                            onMouseEnter={(e) => handleMouseEnter(admin, e)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                                                                       
                                            <td className="table-cell text-slate-800 dark:text-slate-200">{(currentPage - 1) * limit + index + 1}</td>
                                                                                       
                                            <td className="table-cell text-slate-800 dark:text-slate-200">{formatFullName(admin)}</td>               
                                                                                              
                                                             
                                            <td className="table-cell text-slate-800 dark:text-slate-200">{formatDate(admin.check_in)}</td>           
                                                                           
                                            <td className="table-cell text-slate-800 dark:text-slate-200">{formatDate(admin.check_out)}</td>         
                                                                             
                                            <td className="table-cell">
                                                                                               
                                                <div className="flex items-center gap-x-4">
                                                                                                       
                                                    {role === "admin" && (
                                                        <button
                                                            onClick={() => handleDeleteParticipant(admin._id)}
                                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            <Trash size={20} />
                                                        </button>
                                                    )}
                                                                                                   
                                                </div>
                                                                                           
                                            </td>
                                                                                   
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
                                       
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 p-4 dark:border-slate-700 sm:flex-row">
                                               
                        <div className="flex flex-wrap items-center gap-4">
                                                       
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                                Showing                                
                                <span className="font-medium">
                                                                        {showingStart}-{showingEnd}                               
                                </span>
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
                    onClose={handleCloseModal}
                />
                                {/* The popup modal that appears on hover */}               
                {hoveredAdmin && (
                    <div
                        className="fixed z-50 rounded-lg bg-white p-4 text-sm shadow-lg ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/5"
                        style={{ top: popupPosition.y + 15, left: popupPosition.x + 15 }}
                    >
                                                <h3 className="font-bold text-pink-500 dark:text-pink-400">Detailed Information</h3>                 
                             
                        <div className="mt-2 space-y-1 text-slate-700 dark:text-slate-200">
                                                       
                            <p>
                                <strong>Full Name:</strong> {formatFullName(hoveredAdmin)}
                            </p>
                                                       
                            <p>
                                <strong>Gender:</strong> {hoveredAdmin.gender}
                            </p>
                                                       
                            <p>
                                <strong>Address:</strong> {hoveredAdmin.address || "N/A"}
                            </p>
                                                       
                            <p>
                                <strong>Phone:</strong> {hoveredAdmin.contact_number || "N/A"}
                            </p>
                                                       
                            <p>
                                <strong>Email:</strong> {hoveredAdmin.email || "N/A"}
                            </p>
                                                       
                            <p>
                                <strong>Event:</strong> {hoveredAdmin.proposalInfo?.title || "N/A"}
                            </p>
                                                       
                            <p>
                                <strong>Check-in:</strong> {formatDate(hoveredAdmin.check_in)}
                            </p>
                                                       
                            <p>
                                <strong>Check-out:</strong> {formatDate(hoveredAdmin.check_out)}
                            </p>
                                                   
                        </div>
                                           
                    </div>
                )}
                           
            </div>
                   
        </>
    );
};

export default ParticipantTable;
