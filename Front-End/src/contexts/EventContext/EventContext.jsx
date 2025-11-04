import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const EventDisplayContext = createContext();

export const EventDisplayProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);

    const [customError, setCustomError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isEvent, setEvent] = useState([]);
    const [isEventProfile, setEventData] = useState([]);
    const [isTotalEvent, setTotalEvent] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [isEventUpcoming, setEventUpcoming] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [UpcomingTotalPages, setUpcomingTotalPages] = useState(0);
    const [UpcomingCurrentPage, setUpcomingCurrentPage] = useState(0);
    const [isTotalUpcomingEvent, setTotalUpcomingEvent] = useState(0);
    const [isDropdownEvent, setDropdownEvent] = useState("");
    const limit = 5;
    const FetchProposalDisplay = async (page = 1, limit, searchTerm = "", fromDate = "", toDate = "") => {
        if (!authToken) return;

        try {
            setIsLoading(true);

            const params = {
                page,
                limit,
            };

            if (searchTerm && searchTerm.trim() !== "") {
                params.search = searchTerm.trim();
            }

            if (fromDate && fromDate.trim() !== "") {
                params.dateFrom = fromDate.trim();
            }

            if (toDate && toDate.trim() !== "") {
                params.dateTo = toDate.trim();
            }

            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Event`, {
                params,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const { data, totalPages, currentPage, totalCount, upcomingThisMonth } = res.data;

            setEvent(data || []);
            setTotalUpcomingEvent;
            setTotalEvent(totalCount || 0);
            setTotalPages(totalPages || 1);
            setCurrentPage(currentPage || page);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

   // contexts/EventContext/EventContext.js
const FetchUpcomingEvent = useCallback(async (page = 1, limit = 5, searchTerm = "") => {
    try {
        setIsLoading(true);

        const params = { page, limit };

        if (searchTerm.trim() !== "") {
            params.search = searchTerm.trim();
        }

        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Event/DisplayUpcomingEvent`, {
            params,
            withCredentials: true,
            headers: { "Cache-Control": "no-cache" },
        });

        const { data, totalCount, totalPages, currentPage } = res.data;

        setEventUpcoming(data || []);
        setUpcomingTotalPages(totalPages);
        setUpcomingCurrentPage(currentPage);
        setUpcomingTotalCount(totalCount); // Idagdag ito kung wala pa

    } catch (error) {
        console.error("Error fetching upcoming events:", error);
    } finally {
        setIsLoading(false);
    }
}, []);

    useEffect(() => {
        FetchUpcomingEvent();
    }, [FetchUpcomingEvent]);

    useEffect(() => {
        if (!authToken) return;
        FetchProposalDisplay(1, search, dateFrom, dateTo);
    }, [authToken, search, dateFrom, dateTo]);

    useEffect(() => {
        if (!authToken) return;
        DropdownEvent();
    }, [authToken]);

    const DropdownEvent = async () => {
        if (!authToken) return;

        try {
            setIsLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Event/EventDropdown`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const { data, totalPages, currentPage, totalAdmin } = res.data;

            setDropdownEvent(data || []);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const AddEvent = async (values) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Event`,
                {
                    eventDate: values.eventDate,
                    proposalId: values.proposalId,
                    resources: values.resources,
                    lgu: values.lguId,
                    startTime: values.startTime,
                    venue: values.venue,
                    linkId: values.linkId,
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                },
            );
            if (res.data.status === "success") {
                FetchProposalDisplay();
                setModalStatus("success");
                setShowModal(true);
            } else {
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: "Unexpected response from server." };
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const message = typeof errorData === "string" ? errorData : errorData.message || errorData.error || "Something went wrong.";
                setCustomError(message);
            } else if (error.request) {
                setCustomError("No response from the server.");
            } else {
                setCustomError(error.message || "Unexpected error occurred.");
            }
        }
    };

    const DeleteEvent = async (eventID) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Event/${eventID}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.data.status === "success") {
                return { success: true, data: response.data.data };
            } else {
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: "Unexpected response from server." };
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
    const UpdateEvent = async (dataID, values) => {
        try {
            const payload = {
                eventDate: values.eventDate,
                proposalId: values.proposalId,
                resources: values.resources,
                startTime: values.startTime,
                venue: values.venue,
            };

            const response = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Event/${dataID}`, payload, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data?.status === "success") {
                FetchProposalDisplay();
                return { success: true, data: response.data.data };
            } else {
                return { success: false, error: "Unexpected response from server." };
            }
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.error || error.message || "Something went wrong.";

            setCustomError(message);
            setModalStatus("failed");
            setShowModal(true);

            return { success: false, error: message };
        }
    };

    return (
        <EventDisplayContext.Provider
            value={{
                isEvent,
                DeleteEvent,
                UpdateEvent,
                isEventProfile,
                customError,
                isLoading,
                setIsLoading,
                totalPages,
                currentPage,
                setCurrentPage,
                FetchProposalDisplay,
                limit,
                isDropdownEvent,
                search,
                setSearch,
                isEventUpcoming,
                dateFrom,
                setDateFrom,
                dateTo,
                setDateTo,
                AddEvent,
                isTotalEvent,
                isTotalUpcomingEvent,
                FetchUpcomingEvent,
                UpcomingTotalPages,
                UpcomingCurrentPage,setUpcomingCurrentPage
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                errorMessage={customError}
            />
        </EventDisplayContext.Provider>
    );
};
