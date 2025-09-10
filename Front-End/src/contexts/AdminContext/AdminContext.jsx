import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const AdminDisplayContext = createContext();

export const AdminDisplayProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);

    const [customError, setCustomError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isAdmin, setAdmin] = useState([]);
    const [isAdminProfile, setAdminProfile] = useState([]);
    const [isTotalAdmin, setTotalAdmin] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const limit = 5; 
const FetchAdminData = async (page = 1, limit, searchTerm = "", fromDate = "", toDate = "") => {
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

        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Admin`, {
            params,
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Cache-Control": "no-cache",
            },
        });

        const { data, totalPages, currentPage, totalAdmin } = res.data;

        setAdmin(data || []);
        setTotalAdmin(totalAdmin || 0);
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
        FetchAdminData(1, search, dateFrom, dateTo);
    }, [authToken, search, dateFrom, dateTo]);

    const AddAdmin = async (values) => {
        try {
            const formData = new FormData();
            formData.append("first_name", values.first_name || "");
            formData.append("last_name", values.last_name || "");
            formData.append("gender", values.gender || "");
            formData.append("email", values.email || "");
            formData.append("contact_number", values.contact_number || "");
            formData.append("role", "admin");
            if (values.avatar) formData.append("avatar", values.avatar);
            if (values.middle_name) formData.append("middle_name", values.middle_name);

            const res = await axiosInstance.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/authentication/signup`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 201 && res.data.status === "success") {
                const newAdmin = res.data.data;
                return { success: true, data: newAdmin };
            } else {
                return { success: false, error: "Unexpected response from server." };
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Something went wrong.";

            setCustomError(message);
            setModalStatus("failed");
            setShowModal(true);

            return { success: false, error: message };
        }
    };

    const DeleteAdmin = async (officerID) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Admin/${officerID}`, {
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

    const UpdateAdmin = async (dataID, values) => {

        console.log("values",values)
        try {
            const formData = new FormData();
            formData.append("first_name", values.first_name || "");
            formData.append("last_name", values.last_name || "");
            formData.append("gender", values.gender || "");
            formData.append("email", values.email || "");
            formData.append("contact_number", values.contact_number || "");
            formData.append("role", "admin");
            if (values.avatar) formData.append("avatar", values.avatar);
            if (values.middle_name) formData.append("middle_name", values.middle_name);

            const response = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Admin/${dataID}`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data?.status === "success") {
                return { success: true, data: response.data.data };
            } else {
                return { success: false, error: "Unexpected response from server." };
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Something went wrong.";

            setCustomError(message);
            setModalStatus("failed");
            setShowModal(true);

            return { success: false, error: message };
        }
    };

    return (
        <AdminDisplayContext.Provider
            value={{
                isAdmin,
                DeleteAdmin,
                UpdateAdmin,
                isTotalAdmin,
                isAdminProfile,
                AddAdmin,
                customError,
                isLoading,
                setIsLoading,
                totalPages,
                currentPage,
                setCurrentPage,
                FetchAdminData,
                limit,
                // filter state controls
                search,
                setSearch,
                dateFrom,
                setDateFrom,
                dateTo,
                setDateTo,
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                errorMessage={customError}
            />
        </AdminDisplayContext.Provider>
    );
};
