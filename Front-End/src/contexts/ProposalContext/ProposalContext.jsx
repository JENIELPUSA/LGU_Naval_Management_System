import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const ProposalDisplayContext = createContext();

export const ProposalDisplayProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);
    const [isDropdownProposal, setDropdownProposal] = useState("");
    const [customError, setCustomError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isProposal, setProposal] = useState([]);
    const [isProposalProfile, setProposalData] = useState([]);
    const [isTotalProposal, setTotalProposal] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [ProposalStatusCount, setProposalStatusCount] = useState([]);

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

            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal`, {
                params,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const { data, totalPages, currentPage, totalCount, statusCounts } = res.data;
            setProposalStatusCount(statusCounts);
            setProposal(data || []);
            setTotalProposal(totalCount || 0);
            setTotalPages(totalPages || 1);
            setCurrentPage(currentPage || page);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authToken) return;
        FetchProposalDisplay(1, search, dateFrom, dateTo);
        DropdownProposal();
    }, [authToken, search, dateFrom, dateTo]);

    const AddProposal = async (formData) => {
        console.log("formData", formData);
        try {
            const res = await axiosInstance.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.status === "success") {
                const newFile = res.data.data;
                setProposalData(newFile);
                return { success: true, data: newFile };
            } else {
                return { success: false, error: "Unexpected response from server." };
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

    const DeleteProposal = async (dataID) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal/${dataID}`, {
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

    const UpdateProposal = async (dataID, values) => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal/${dataID}`,
                values, // siguraduhin na FormData ito
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        // wag iset manually ang multipart/form-data
                    },
                },
            );

            if (response.data?.status === "success") {
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

    const UpdateStatus = async (dataID, values) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal/${dataID}`, values, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.data?.status === "success") {
                FetchProposalDisplay();
                setModalStatus("success");
                setShowModal(true);
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

    const UpdateProposalMetaData = async (dataID, values) => {
        console.log("values", values);
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal/MetaData/${dataID}`,
                {
                    remarks: values.remarks,
                    status: values.status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                },
            );

            if (response.data?.status === "success") {
                FetchProposalDisplay();
                setModalStatus("success");
                setShowModal(true);
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

    const DropdownProposal = async (showAll = false) => {
        if (!authToken) return;

        try {
            setIsLoading(true);

            const url =
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal/DisplayDropdownProposal` + (showAll ? "?showAll=true" : "");

            const res = await axios.post(
                url,
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Cache-Control": "no-cache",
                    },
                },
            );

            setDropdownProposal(res.data.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProposalDisplayContext.Provider
            value={{
                isProposal,
                DeleteProposal,
                UpdateProposal,
                isTotalProposal,
                isProposalProfile,
                customError,
                isLoading,
                setIsLoading,
                totalPages,
                currentPage,
                setCurrentPage,
                FetchProposalDisplay,
                limit,
                AddProposal,
                search,
                setSearch,
                dateFrom,
                setDateFrom,
                dateTo,
                setDateTo,
                UpdateStatus,
                UpdateProposalMetaData,
                ProposalStatusCount,
                isDropdownProposal,
                DropdownProposal,
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                errorMessage={customError}
            />
        </ProposalDisplayContext.Provider>
    );
};
