import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const LguResponseContext = createContext();

export const LGUResponsiseProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);
    const [customError, setCustomError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isLguResponse, setLguResponse] = useState([]);
    const [isLguResponseProfile, setLguResponseProfile] = useState([]);
    const [isTotalResponse, setTotalResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isSummary, setSummary] = useState("");
    const [LguStatusCount, setLguStatusCount] = useState([]);

    const limit = 5;
    const FetchLguResponse = async (page = 1, limitValue = 10, searchTerm = "", fromDate = "", toDate = "") => {
        if (!authToken) return;

        try {
            setIsLoading(true);

            const params = {
                page,
                limit: limitValue,
            };

            // Ensure searchTerm is string before trim
            if (searchTerm && typeof searchTerm === "string" && searchTerm.trim() !== "") {
                params.search = searchTerm.trim();
            }

            if (fromDate && typeof fromDate === "string" && fromDate.trim() !== "") {
                params.dateFrom = fromDate.trim();
            }

            if (toDate && typeof toDate === "string" && toDate.trim() !== "") {
                params.dateTo = toDate.trim();
            }

            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/LGUResponse`, {
                params,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const { data, totalPages, currentPage, totalCount, statusCounts } = res.data;

            setLguStatusCount(statusCounts);
            setLguResponse(data || []);
            setTotalResponse(totalCount || 0);
            setTotalPages(totalPages || 1);
            setCurrentPage(currentPage || page);
        } catch (error) {
            console.error("Error fetching LGU response:", error);
            setCustomError(error?.message || "Failed to fetch LGU responses");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authToken) return;
        FetchLguResponse(1, search, dateFrom, dateTo);
    }, [authToken, search, dateFrom, dateTo]);

    const UpdateResponse = async (dataID, values) => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/LGUResponse/${dataID}`,
                values, // siguraduhin na FormData ito
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        // wag iset manually ang multipart/form-data
                    },
                },
            );

            if (response.data?.status === "success") {
                FetchLguResponse();
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

    const DeleteParticipant = async (lguID) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/LGUResponse/${lguID}`, {
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
    return (
        <LguResponseContext.Provider
            value={{
                isLguResponse,
                isTotalResponse,
                isLguResponseProfile,
                isSummary,
                customError,
                isLoading,
                setIsLoading,
                totalPages,
                currentPage,
                setCurrentPage,
                FetchLguResponse,
                limit,
                search,
                setSearch,
                dateFrom,
                setDateFrom,
                dateTo,
                setDateTo,
                UpdateResponse,
                LguStatusCount,
                DeleteParticipant,
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                errorMessage={customError}
            />
        </LguResponseContext.Provider>
    );
};
