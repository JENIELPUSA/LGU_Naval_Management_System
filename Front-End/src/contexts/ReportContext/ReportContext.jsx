import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const ReportDisplayContext = createContext();

export const ReportDisplayProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);

    const [customError, setCustomError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isReport, setReport] = useState([]);
    const [isReportProfile, setReportData] = useState([]);
    const [isTotalEvent, setTotalEvent] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [isReportUpcoming, setReportUpcoming] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isTotalUpcomingEvent, setTotalUpcomingEvent] = useState(0);
    const [isDropdownEvent, setDropdownEvent] = useState("");
    const limit = 9;
    const FetchReportDisplay = async (page = 1, limit, searchTerm = "", fromDate = "", toDate = "") => {
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

            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Report`, {
                params,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const { data, totalPages, currentPage, totalCount } = res.data;
            setTotalPages(totalPages || 1);
            setCurrentPage(currentPage || page);
            setReport(data || []);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (!authToken) return;
        FetchReportDisplay(currentPage, search, dateFrom, dateTo);
    }, [authToken, search, dateFrom, dateTo, currentPage]);

    const AddReport = async (values) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Report`,
                {
                    event_id: values.event_id,
                    feedback: values.comment,
                    rating: values.rating,
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                },
            );
            if (res.data.status === "success") {
                FetchReportDisplay();
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

    const DeleteReport = async (eventID) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Report/${eventID}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.data.status === "success") {
                setModalStatus("success");
                setShowModal(true);
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

    return (
        <ReportDisplayContext.Provider
            value={{
                isReport,
                DeleteReport,
                isReportProfile,
                customError,
                isLoading,
                setIsLoading,
                totalPages,
                currentPage,
                setCurrentPage,
                FetchReportDisplay,
                limit,
                isDropdownEvent,
                search,
                setSearch,
                isReportUpcoming,
                dateFrom,
                setDateFrom,
                dateTo,
                setDateTo,
                AddReport,
                isTotalEvent,
                isTotalUpcomingEvent,
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                errorMessage={customError}
            />
        </ReportDisplayContext.Provider>
    );
};
