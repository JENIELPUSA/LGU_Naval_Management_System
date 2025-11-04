import React, { useContext, useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Users, List, CircleDot, X, Clock, Search, Filter, ChevronDown } from "lucide-react";
import { EventDisplayContext } from "../../../../contexts/EventContext/EventContext";
import { ProposalDisplayContext } from "../../../../contexts/ProposalContext/ProposalContext";
import { LguDisplayContext } from "../../../../contexts/LguContext/LguContext";
import { ResourcesDisplayContext } from "../../../../contexts/ResourcesContext/ResourcesContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const AddEventModal = ({ isOpen, onClose, isEditing, editingData, bgtheme, FontColor, linkId }) => {
    const { AddEvent, UpdateEvent } = useContext(EventDisplayContext);
    const { isLgu } = useContext(LguDisplayContext);
    const { isDropdownProposal, DropdownProposal } = useContext(ProposalDisplayContext);
    const { isResourcesDropdown, FetchResourcesDropdownData } = useContext(ResourcesDisplayContext);
    const lguDropdownRef = useRef(null);
    const proposalDropdownRef = useRef(null);
    const resourcesDropdownRef = useRef(null);

    const generateTimeOptions = () => {
        const times = [];
        const startHour = 8;
        const endHour = 17;
        const interval = 30;
        for (let h = startHour; h <= endHour; h++) {
            for (let m = 0; m < 60; m += interval) {
                const hour = h > 12 ? h - 12 : h;
                const ampm = h >= 12 ? "PM" : "AM";
                const minute = m < 10 ? `0${m}` : m;
                times.push(`${hour}:${minute} ${ampm}`);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    const [formData, setFormData] = useState({
        eventDate: "",
        startTime: "",
        venue: "",
        city: "",
        proposalId: "",
        lguId: "",
        resources: [],
        latitude: null,
        longitude: null,
    });

    const [showAllProposals, setShowAllProposals] = useState(false);
    const [showAllResources, setShowAllResources] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [resourceFilter, setResourceFilter] = useState("");
    const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
    const [proposalFilter, setProposalFilter] = useState("");
    const [isProposalDropdownOpen, setIsProposalDropdownOpen] = useState(false);
    const [lguFilter, setLguFilter] = useState("");
    const [isLguDropdownOpen, setIsLguDropdownOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mapCenter, setMapCenter] = useState([11.5449, 124.038]);
    const [markerPos, setMarkerPos] = useState(null);

    const formatDateForInput = (isoDateString) => {
        if (!isoDateString) return "";
        const date = new Date(isoDateString);
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        if (isOpen) {
            DropdownProposal(showAllProposals);
            FetchResourcesDropdownData(showAllResources);
        }
    }, [isOpen, showAllProposals, showAllResources]);

    useEffect(() => {
        if (isEditing && editingData) {
            setFormData({
                eventDate: formatDateForInput(editingData.eventDate),
                startTime: editingData.startTime || "",
                venue: editingData.venue || "",
                city: editingData.city || "",
                proposalId: editingData.proposalId || "",
                lguId: editingData.lguId || "",
                resources: editingData.resources || [],
                latitude: editingData.latitude || null,
                longitude: editingData.longitude || null,
            });
            if (editingData.latitude && editingData.longitude) {
                setMarkerPos([parseFloat(editingData.latitude), parseFloat(editingData.longitude)]);
                setMapCenter([parseFloat(editingData.latitude), parseFloat(editingData.longitude)]);
            }
        } else {
            setFormData({
                eventDate: "",
                startTime: "",
                venue: "",
                city: "",
                proposalId: "",
                lguId: "",
                resources: [],
                latitude: null,
                longitude: null,
            });
            setMarkerPos(null);
            setMapCenter([11.5449, 124.038]);
        }
    }, [isEditing, editingData]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (lguDropdownRef.current && !lguDropdownRef.current.contains(event.target)) {
                setIsLguDropdownOpen(false);
            }
            if (proposalDropdownRef.current && !proposalDropdownRef.current.contains(event.target)) {
                setIsProposalDropdownOpen(false);
            }
            if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) {
                setIsResourcesDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        onClose();
        setResourceFilter("");
        setDateFilter({ start: "", end: "" });
        setProposalFilter("");
        setLguFilter("");
        setSuggestions([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleResourceChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => {
            const updatedResources = checked ? [...prevData.resources, value] : prevData.resources.filter((id) => id !== value);
            return {
                ...prevData,
                resources: updatedResources,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        const dataToSend = {
            ...formData,
            linkId,
            eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : "",
            resources: formData.resources,
        };

        if (isEditing && editingData) {
            UpdateEvent(editingData._id, dataToSend);
        } else {
            AddEvent(dataToSend);
        }

        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
        }, 1000);
    };

    const filteredResources = Array.isArray(isResourcesDropdown)
        ? isResourcesDropdown.filter((res) => {
              const matchesText = res.resource_name.toLowerCase().includes(resourceFilter.toLowerCase());
              return matchesText && res.availability === true;
          })
        : [];

    const filteredProposals = Array.isArray(isDropdownProposal)
        ? isDropdownProposal.filter((prop) => prop.title.toLowerCase().includes(proposalFilter.toLowerCase()) && !prop.assigned)
        : [];

    const filteredLgus = isLgu.filter((lgu) => {
        const fullName = `${lgu.full_name || ""} ${lgu.middle_name || ""} ${lgu.last_name || ""}`;
        return fullName.toLowerCase().includes(lguFilter.toLowerCase());
    });

    const debounceRef = useRef(null);

    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        setIsSearching(true);
        try {
            const q = formData.city ? `${query}, ${formData.city}` : query;
            const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(q)}`;
            const res = await axios.get(url, { headers: { "Accept-Language": "en" } });
            setSuggestions(res.data || []);
        } catch (err) {
            console.error("Suggestion fetch error:", err);
            setSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (formData.venue && formData.venue.length >= 2) {
                fetchSuggestions(formData.venue);
            } else {
                setSuggestions([]);
            }
            if (!formData.venue && formData.city && formData.city.length >= 2) {
                (async () => {
                    try {
                        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(formData.city)}`;
                        const res = await axios.get(url);
                        if (res.data && res.data.length > 0) {
                            const { lat, lon } = res.data[0];
                            setMapCenter([parseFloat(lat), parseFloat(lon)]);
                            setMarkerPos([parseFloat(lat), parseFloat(lon)]);
                            setFormData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
                        }
                    } catch (err) {
                        // fail silently
                    }
                })();
            }
        }, 700);
        return () => clearTimeout(debounceRef.current);
    }, [formData.venue, formData.city]);

    const handleSelectSuggestion = (sug) => {
        const displayName = sug.display_name || `${sug.type || ""}`;
        setFormData((prev) => ({
            ...prev,
            venue: displayName,
            latitude: sug.lat,
            longitude: sug.lon,
        }));
        setMarkerPos([parseFloat(sug.lat), parseFloat(sug.lon)]);
        setMapCenter([parseFloat(sug.lat), parseFloat(sug.lon)]);
        setSuggestions([]);
    };

    const pinIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });

    function FlyTo({ center }) {
        const map = useMap();
        useEffect(() => {
            if (center) map.flyTo(center, 15, { duration: 1.2 });
        }, [center, map]);
        return null;
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[900] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6 md:p-4">
            {/* MAIN WRAPPER */}
            <div className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-gray-200/50 bg-white shadow-2xl md:flex-row">
                {/* LEFT: FORM */}
                <div className="max-h-full flex-1 overflow-y-auto p-4 sm:p-6">
                    {/* Header Section */}
                    <div
                        style={{ background: bgtheme, color: FontColor }}
                        className="relative -mx-6 -mt-6 rounded-t-2xl p-6"
                    >
                        <button
                            onClick={handleCloseModal}
                            className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="pr-12">
                            <h1 className="mb-2 text-2xl font-bold">{isEditing ? "Edit Event" : "Create New Event"}</h1>
                            <p className="text-sm text-blue-100">
                                {isEditing ? "Update event information below" : "Fill in the details to create a new event"}
                            </p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6 p-6">
                        {/* Resources Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                                <CircleDot className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
                            </div>
                            <div
                                className="relative"
                                ref={resourcesDropdownRef}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsResourcesDropdownOpen(!isResourcesDropdownOpen);
                                        setIsLguDropdownOpen(false);
                                        setIsProposalDropdownOpen(false);
                                    }}
                                    className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left transition-all duration-200 hover:border-blue-300 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                >
                                    <span className={formData.resources.length > 0 ? "text-gray-900" : "text-gray-500"}>
                                        {formData.resources.length > 0 ? `${formData.resources.length} resource(s) selected` : "Select resources..."}
                                    </span>
                                    <ChevronDown
                                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                                            isResourcesDropdownOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Assignment Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Assignment</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* LGU Dropdown */}
                                <div
                                    className="relative"
                                    ref={lguDropdownRef}
                                >
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Assigned LGU</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLguDropdownOpen(!isLguDropdownOpen);
                                            setIsProposalDropdownOpen(false);
                                            setIsResourcesDropdownOpen(false);
                                        }}
                                        className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left transition-all duration-200 hover:border-blue-300 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    >
                                        <span className={formData.lguId ? "text-gray-900" : "text-gray-500"}>
                                            {formData.lguId
                                                ? (() => {
                                                      const selectedLgu = isLgu.find((l) => l._id === formData.lguId);
                                                      if (!selectedLgu) return "Selected LGU";
                                                      const nameParts = [
                                                          selectedLgu.first_name,
                                                          selectedLgu.middle_name,
                                                          selectedLgu.last_name,
                                                      ].filter((part) => part && part !== "N/A");
                                                      return nameParts.length > 0 ? nameParts.join(" ") : "Selected LGU";
                                                  })()
                                                : "Select an LGU..."}
                                        </span>
                                        <ChevronDown
                                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                                                isLguDropdownOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Proposal Dropdown */}
                                <div
                                    className="relative"
                                    ref={proposalDropdownRef}
                                >
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Related Proposal</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProposalDropdownOpen(!isProposalDropdownOpen);
                                            setIsLguDropdownOpen(false);
                                            setIsResourcesDropdownOpen(false);
                                        }}
                                        className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left transition-all duration-200 hover:border-blue-300 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    >
                                        <span className={formData.proposalId ? "text-gray-900" : "text-gray-500"}>
                                            {formData.proposalId
                                                ? isDropdownProposal.find((p) => p._id === formData.proposalId)?.title || "Selected proposal"
                                                : "Select a proposal..."}
                                        </span>
                                        <ChevronDown
                                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                                                isProposalDropdownOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Event Details Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Event Date</label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Start Time</label>
                                    <select
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select time...</option>
                                        {timeOptions.map((time, index) => (
                                            <option
                                                key={index}
                                                value={time}
                                            >
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mt-3">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Enter city (e.g., Biliran)"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="Enter venue location"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    required
                                    disabled={!formData.city.trim()}
                                    title={!formData.city.trim() ? "Please enter a city first" : ""}
                                />
                                {isSearching && <div className="mt-1 text-xs text-gray-500">Searching...</div>}
                                {suggestions.length > 0 && (
                                    <ul className="z-50 mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                                        {suggestions.map((sug, idx) => (
                                            <li
                                                key={idx}
                                                className="cursor-pointer px-3 py-2 hover:bg-blue-50"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleSelectSuggestion(sug)}
                                            >
                                                <div className="line-clamp-1 text-sm font-medium text-gray-900">{sug.display_name.split(",")[0]}</div>
                                                <div className="line-clamp-1 text-xs text-gray-500">{sug.display_name}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-gray-200 pt-6">
                            {message && (
                                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                                    <p className="text-sm font-medium text-blue-800">{message}</p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    style={{ background: bgtheme, color: FontColor }}
                                    className="flex-1 rounded-xl px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Event" : "Create Event"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAP: BELOW ON MOBILE, RIGHT ON MD+ */}
                <div className="min-h-[400px] w-full border-t border-gray-200 md:min-h-full md:w-[40%] md:border-l md:border-t-0">
                    <MapContainer
                        center={mapCenter}
                        zoom={12}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <FlyTo center={mapCenter} />
                        {markerPos && (
                            <Marker
                                position={markerPos}
                                icon={pinIcon}
                            >
                                <Popup>
                                    <div className="text-sm font-medium">{formData.venue || "Venue"}</div>
                                    <div className="text-xs text-gray-600">{formData.city}</div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>

                {/* Dropdown Overlays (unchanged) */}
                {isLguDropdownOpen && (
                    <div
                        className="fixed z-[950] max-h-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                        style={{
                            top: lguDropdownRef.current?.getBoundingClientRect().bottom + window.scrollY + 8,
                            left: lguDropdownRef.current?.getBoundingClientRect().left + window.scrollX,
                            width: lguDropdownRef.current?.getBoundingClientRect().width,
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="border-b border-gray-200 bg-gray-50 p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search LGU..."
                                    value={lguFilter}
                                    onChange={(e) => setLguFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                {filteredLgus.length} of {isLgu.length} LGUs
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {filteredLgus.length > 0 ? (
                                filteredLgus.map((lgu) => (
                                    <div
                                        key={lgu._id}
                                        className="cursor-pointer border-b border-gray-100 p-3 transition-colors duration-150 last:border-b-0 hover:bg-blue-50"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={() => {
                                            setFormData((prev) => ({ ...prev, lguId: lgu._id }));
                                            setIsLguDropdownOpen(false);
                                        }}
                                    >
                                        <div className="font-medium text-gray-900">
                                            {lgu.first_name} {lgu.middle_name} {lgu.last_name}
                                        </div>
                                        {lgu.position && <div className="text-sm text-gray-500">{lgu.position}</div>}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <Search className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                    <p>No LGUs found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {isProposalDropdownOpen && (
                    <div
                        className="fixed z-[950] max-h-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                        style={{
                            top: proposalDropdownRef.current?.getBoundingClientRect().bottom + window.scrollY + 8,
                            left: proposalDropdownRef.current?.getBoundingClientRect().left + window.scrollX,
                            width: proposalDropdownRef.current?.getBoundingClientRect().width,
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="border-b border-gray-200 bg-gray-50 p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search proposals..."
                                    value={proposalFilter}
                                    onChange={(e) => setProposalFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                {filteredProposals.length} of {isDropdownProposal.length} proposals
                            </div>
                            <label className="mt-2 flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={showAllProposals}
                                    onChange={() => setShowAllProposals(!showAllProposals)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Show all proposals</span>
                            </label>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {filteredProposals.length > 0 ? (
                                filteredProposals.map((prop) => (
                                    <div
                                        key={prop._id}
                                        className="cursor-pointer border-b border-gray-100 p-3 transition-colors duration-150 last:border-b-0 hover:bg-blue-50"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={() => {
                                            setFormData((prev) => ({ ...prev, proposalId: prop._id }));
                                            setIsProposalDropdownOpen(false);
                                        }}
                                    >
                                        <div className="font-medium text-gray-900">{prop.title}</div>
                                        {prop.description && <div className="line-clamp-2 text-sm text-gray-500">{prop.description}</div>}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <Search className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                    <p>No proposals found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {isResourcesDropdownOpen && (
                    <div
                        className="fixed z-[950] max-h-96 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                        style={{
                            top: resourcesDropdownRef.current?.getBoundingClientRect().bottom + window.scrollY + 8,
                            left: resourcesDropdownRef.current?.getBoundingClientRect().left + window.scrollX,
                            width: resourcesDropdownRef.current?.getBoundingClientRect().width,
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-3 border-b border-gray-200 bg-gray-50 p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    value={resourceFilter}
                                    onChange={(e) => setResourceFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                {filteredResources.length} of {isResourcesDropdown.length} resources
                            </div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={showAllResources}
                                    onChange={() => setShowAllResources(!showAllResources)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Show all resources</span>
                            </label>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-4">
                            <div className="grid grid-cols-1 gap-3">
                                {filteredResources.length > 0 ? (
                                    filteredResources.map((res) => (
                                        <label
                                            key={res._id}
                                            className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors duration-150 hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                name="resources"
                                                value={res._id}
                                                checked={formData.resources.includes(res._id)}
                                                onChange={handleResourceChange}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                onMouseDown={(e) => e.stopPropagation()}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{res.resource_name}</div>
                                                <div className="space-y-1 text-sm text-gray-500">
                                                    {res.resource_type && <div>Type: {res.resource_type}</div>}
                                                    {res.capacity && <div>Capacity: {res.capacity}</div>}
                                                </div>
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <Search className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                        <p>No resources found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddEventModal;
