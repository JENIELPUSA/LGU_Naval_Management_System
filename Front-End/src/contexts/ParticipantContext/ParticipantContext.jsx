import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const ParticipantDisplayContext = createContext();

export const ParticipantDisplayProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);
    const [customError, setCustomError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isParticipant, setParticipant] = useState([]);
    const [isParticipantProfile, setParticipantData] = useState([]);
    const [isTotalParticipant, setTotalParticipant] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [IncomingEvent, setIncomingEvent] = useState("");
    const limit = 5;

    useEffect(() => {
        if (!authToken) return;
        FetchParticipant(1, search, dateFrom, dateTo);
        FetchIncomingEvent(1, search, dateFrom, dateTo);
    }, [authToken, search, dateFrom, dateTo]);
    useEffect(() => {
        if (customError) {
            const timer = setTimeout(() => {
                setCustomError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [customError]);

    const AddParticipant = async (values) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Participant`,
                {
                    event_id: values.eventId,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    address: values.address,
                    contact_number: values.phone,
                    email: values.email,
                },
                {
                    headers: { "Content-Type": "application/json" },
                },
            );
            if (res.data.status === "success") {
                setParticipant((prevUsers) => [...prevUsers, res.data.data]);
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

    const Attendance = async (values) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Participant/${values.code}`, values, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data?.status === "success") {
                FetchParticipant();
                setModalStatus("success");
                setShowModal(true);
                return { success: true, data: response.data.data };
            } else {
                // Kunin ang message mula sa server response kung meron
                const message = response.data?.message || response.data?.error || "Unexpected response from server.";

                setCustomError(message);
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: message };
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const message = typeof errorData === "string" ? errorData : errorData.message || errorData.error || "Something went wrong.";
                setCustomError(message);
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: message };
            } else if (error.request) {
                setCustomError("No response from the server.");
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: "No response from the server." };
            } else {
                setCustomError(error.message || "Unexpected error occurred.");
                return {
                    success: false,
                    error: error.message || "Unexpected error",
                };
            }
        }
    };

    const FetchParticipant = async (page = 1, limit, searchTerm = "", fromDate = "", toDate = "") => {
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

            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Participant`, {
                params,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const { data, totalPages, currentPage, totalCount } = res.data;

            setParticipant(data || []);
            setTotalParticipant(totalCount || 0);
            setTotalPages(totalPages || 1);
            setCurrentPage(currentPage || page);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const DeleteParticipant = async (participantID) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Participant/${participantID}`, {
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

    const FetchIncomingEvent = async (page = 1, limit, searchTerm = "", fromDate = "", toDate = "") => {
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

            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Participant/getParticipantsCountPerEvent`, {
                params,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const payload = res.data;
            console.log("payload",payload)
            setIncomingEvent(payload.data || []);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ParticipantDisplayContext.Provider
            value={{
                isParticipant,
                isParticipantProfile,
                customError,
                isLoading,
                setIsLoading,
                totalPages,
                currentPage,
                setCurrentPage,
                limit,
                search,
                Attendance,
                setSearch,
                dateFrom,
                setDateFrom,
                dateTo,
                setDateTo,
                AddParticipant,
                FetchParticipant,
                DeleteParticipant,
                isTotalParticipant,
                IncomingEvent,
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                error={customError}
            />
        </ParticipantDisplayContext.Provider>
    );
};
