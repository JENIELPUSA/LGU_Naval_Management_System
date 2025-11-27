import { useState, useEffect, useContext } from "react";
import { CircleX, Clock, PencilLine, Trash, Plus, Database, Calendar, MapPin, User, Mail, Phone, FileText, ChevronLeft, ChevronRight, Grid, List, Search, ChevronDown, ChevronUp } from "lucide-react";
import { EventDisplayContext } from "../../../../contexts/EventContext/EventContext";
import LoadingOverlay from "../../../../ReusableFolder/LoadingOverlay";
import SuccessFailed from "../../../../ReusableFolder/SuccessandField";
import StatusVerification from "../../../../ReusableFolder/StatusModal";
import { ResourcesDisplayContext } from "../../../../contexts/ResourcesContext/ResourcesContext";
import AddFormModal from "./EventAddForm";
import { AuthContext } from "../../../../contexts/AuthContext";
import { PersonilContext } from "../../../../contexts/PersonelContext/PersonelContext";

const CalendarEventView = () => {
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

    const [viewMode, setViewMode] = useState("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        description: true,
        organizer: true,
        resources: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        FetchProposalDisplay(currentPage, limit, searchTerm, dateFrom, dateTo);
    }, [currentPage, searchTerm, dateFrom, dateTo, limit]);

    const handleSearch = () => {
        setSearchTerm(tempSearchTerm);
        setCurrentPage(1);
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
            const result = await DeleteEvent(isDeleteID);
            setIsLoading(false);

            if (result?.success) {
                setModalStatus("success");
                setDeleteID(null);
                setVerification(false);
                setShowEventDetails(false);
                FetchProposalDisplay(currentPage, limit, searchTerm, dateFrom, dateTo);
            } else {
                setModalStatus("failed");
            }
            setShowModal(true);
        }
    };

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return {
                    bg: "bg-blue-500",
                    text: "text-blue-700",
                    lightBg: "bg-blue-50 border-blue-200",
                    darkBg: "dark:bg-blue-900/20 dark:border-blue-800"
                };
            case "pending":
                return {
                    bg: "bg-amber-500",
                    text: "text-amber-700",
                    lightBg: "bg-amber-50 border-amber-200",
                    darkBg: "dark:bg-amber-900/20 dark:border-amber-800"
                };
            case "rejected":
                return {
                    bg: "bg-red-500",
                    text: "text-red-700",
                    lightBg: "bg-red-50 border-red-200",
                    darkBg: "dark:bg-red-900/20 dark:border-red-800"
                };
            default:
                return {
                    bg: "bg-gray-500",
                    text: "text-gray-700",
                    lightBg: "bg-gray-50 border-gray-200",
                    darkBg: "dark:bg-gray-800 dark:border-gray-700"
                };
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { daysInMonth, startingDayOfWeek, firstDay, lastDay };
    };

    const getEventsForDate = (date) => {
        if (!isEvent || isEvent.length === 0) return [];
        
        return isEvent.filter(event => {
            const eventDate = new Date(event.eventDate);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowEventDetails(true);
    };

    const renderMonthView = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
        const days = [];
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="min-h-24 border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            days.push(
                <div
                    key={day}
                    className={`min-h-24 border border-gray-200 bg-white p-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 ${
                        isToday ? 'ring-2 ring-blue-500' : ''
                    }`}
                >
                    <div className={`mb-1 text-sm font-semibold ${isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {day}
                    </div>
                    <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => {
                            const config = getStatusConfig(event.status);
                            return (
                                <div
                                    key={event._id}
                                    onClick={() => handleEventClick(event)}
                                    className={`cursor-pointer rounded px-2 py-1 text-xs font-medium text-white transition-transform hover:scale-105 ${config.bg}`}
                                >
                                    <div className="truncate">{event.proposal?.title || "Untitled Event"}</div>
                                    <div className="truncate text-[10px] opacity-90">{event.startTime || "TBD"}</div>
                                </div>
                            );
                        })}
                        {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - 2} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
                    {weekDays.map(day => (
                        <div key={day} className="border-b border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days}
                </div>
            </div>
        );
    };

    const renderAgendaView = () => {
        if (!isEvent || isEvent.length === 0) {
            return (
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
                            style={{ background: bgtheme, color: FontColor }}
                            className="mt-6 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                        >
                            <Plus size={16} className="sm:size-4" />
                            Add First Event
                        </button>
                    </div>
                </div>
            );
        }

        const filteredEvents = isEvent.filter(event => {
            return true; // Show all events
        });

        if (filteredEvents.length === 0) {
            return (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">No events match your filters</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {filteredEvents.map(event => {
                    const config = getStatusConfig(event.status);
                    return (
                        <div
                            key={event._id}
                            onClick={() => handleEventClick(event)}
                            className={`cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${config.lightBg} ${config.darkBg}`}
                        >
                            <div className={`h-1 ${config.bg}`}></div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {event.proposal?.title || "Untitled Event"}
                                        </h3>
                                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={16} />
                                                {new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} />
                                                {event.startTime || "TBD"} - {event.endTime || "TBD"}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={16} />
                                                {event.venue || "TBD"}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${config.bg}`}>
                                        {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigateMonth(-1)}
                                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentDate(new Date())}
                                        className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => navigateMonth(1)}
                                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
                                    <button
                                        onClick={() => setViewMode("month")}
                                        className={`px-4 py-2 text-sm font-medium ${viewMode === "month" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300"}`}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("agenda")}
                                        className={`px-4 py-2 text-sm font-medium ${viewMode === "agenda" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300"}`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>

                                <button 
                                    onClick={openAddModal}
                                    style={{ background: bgtheme, color: FontColor }}
                                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-lg transition-all hover:shadow-xl">
                                    <Plus size={18} />
                                    Add Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {viewMode === "month" ? renderMonthView() : renderAgendaView()}
                </div>

                {/* Event Details Modal - Google Calendar Style with Collapse */}
                {showEventDetails && selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEventDetails(false)}>
                        <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                            {/* Header with colored bar */}
                            <div className={`h-2 shrink-0 ${getStatusConfig(selectedEvent.status).bg}`}></div>
                            
                            {/* Scrollable Content */}
                            <div className="overflow-y-auto">
                                <div className="p-6">
                                    {/* Close Button */}
                                    <div className="mb-4 flex items-start justify-between">
                                        <h2 className="flex-1 pr-4 text-2xl font-semibold text-gray-900 dark:text-white">
                                            {selectedEvent.proposal?.title || "Untitled Event"}
                                        </h2>
                                        <button
                                            onClick={() => setShowEventDetails(false)}
                                            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <CircleX size={20} className="text-gray-500" />
                                        </button>
                                    </div>

                                    {/* Date & Time - Always Visible */}
                                    <div className="mb-6 space-y-3">
                                        <div className="flex items-start gap-4">
                                            <Clock size={20} className="mt-0.5 text-gray-500 dark:text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {new Date(selectedEvent.eventDate).toLocaleDateString('en-US', { 
                                                        weekday: 'long', 
                                                        month: 'long', 
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {selectedEvent.startTime || "TBD"} – {selectedEvent.endTime || "TBD"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-start gap-4">
                                            <MapPin size={20} className="mt-0.5 text-gray-500 dark:text-gray-400" />
                                            <p className="flex-1 text-sm text-gray-900 dark:text-white">
                                                {selectedEvent.venue || "TBD"}
                                            </p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-5"></div>
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusConfig(selectedEvent.status).bg}`}>
                                                {selectedEvent.status ? selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1) : "N/A"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description - Collapsible */}
                                    {selectedEvent.proposal?.description && (
                                        <div className="mb-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                            <button
                                                onClick={() => toggleSection('description')}
                                                className="flex w-full items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -ml-2"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <FileText size={20} className="text-gray-500 dark:text-gray-400" />
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Description</h3>
                                                </div>
                                                {expandedSections.description ? (
                                                    <ChevronUp size={20} className="text-gray-500" />
                                                ) : (
                                                    <ChevronDown size={20} className="text-gray-500" />
                                                )}
                                            </button>
                                            {expandedSections.description && (
                                                <div className="ml-11 mt-2">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {selectedEvent.proposal.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Organizer - Collapsible */}
                                    {selectedEvent.organizer && (
                                        <div className="mb-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                            <button
                                                onClick={() => toggleSection('organizer')}
                                                className="flex w-full items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -ml-2"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <User size={20} className="text-gray-500 dark:text-gray-400" />
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Organizer</h3>
                                                </div>
                                                {expandedSections.organizer ? (
                                                    <ChevronUp size={20} className="text-gray-500" />
                                                ) : (
                                                    <ChevronDown size={20} className="text-gray-500" />
                                                )}
                                            </button>
                                            {expandedSections.organizer && (
                                                <div className="ml-11 mt-2 space-y-1.5">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {`${selectedEvent.organizer.first_name || ""} ${selectedEvent.organizer.middle_name || ""} ${selectedEvent.organizer.last_name || ""}`.trim() || "N/A"}
                                                    </p>
                                                    {selectedEvent.organizer.email && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {selectedEvent.organizer.email}
                                                        </p>
                                                    )}
                                                    {selectedEvent.organizer.contact_number && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {selectedEvent.organizer.contact_number}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Resources - Collapsible */}
                                    {selectedEvent.resources && selectedEvent.resources.length > 0 && (
                                        <div className="mb-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                            <button
                                                onClick={() => toggleSection('resources')}
                                                className="flex w-full items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -ml-2"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Database size={20} className="text-gray-500 dark:text-gray-400" />
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        Resources ({selectedEvent.resources.length})
                                                    </h3>
                                                </div>
                                                {expandedSections.resources ? (
                                                    <ChevronUp size={20} className="text-gray-500" />
                                                ) : (
                                                    <ChevronDown size={20} className="text-gray-500" />
                                                )}
                                            </button>
                                            {expandedSections.resources && (
                                                <div className="ml-11 mt-2 space-y-2">
                                                    {selectedEvent.resources.map((resource, idx) => (
                                                        <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {resource.resource_name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {resource.resource_type}
                                                                    </p>
                                                                    {resource.description && (
                                                                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                                            {resource.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${resource.availability ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                                    {resource.availability ? 'Available' : 'Unavailable'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons - Fixed at bottom */}
                            <div className="shrink-0 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            openEditModal(selectedEvent);
                                            setShowEventDetails(false);
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                                        <PencilLine size={16} />
                                        Edit
                                    </button>
                                    {role === "admin" && (
                                        <button 
                                            onClick={() => handleDeleteEvent(selectedEvent._id)}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20">
                                            <Trash size={16} />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
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
        </>
    );
};

export default CalendarEventView;