import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";
export const TEamContext = createContext();

export const TeamDisplayProvider = ({ children }) => {
    const [isTeam, setTeam] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { authToken } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [customError, setCustomError] = useState("");

    const fetchTeam = async () => {
        if (!authToken) return;
        try {
            const res = await axiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Team`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setTeam(res.data.data);
        } catch (error) {
            console.error("Error fetching brands:", error);
            setError("Failed to fetch data.");
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [authToken]);

    const AddTeam = async (values) => {
        console.log("values",values)
        try {
            const res = await axiosInstance.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Team`,
                {
                    event_id: values.event_id,
                    teamName: values.teamName,
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                },
            );
            if (res.data.status === "success") {
                const newData = res.data.data;
                setModalStatus("success");
                setShowModal(true);
                setTeam((prevUsers) => [...prevUsers, res.data.data]);
                return { success: true, data: newData };
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



    const UpdateTeam = async (sendId, Team ) => {
        try {
            const response = await axiosInstance.patch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Team/${sendId}`,
                { teamName:Team.teamName },
                { headers: { Authorization: `Bearer ${authToken}` } },
            );

            if (response.data?.status === "success") {
                const newData = response.data.data;
                setTeam((prev) => prev.map((u) => (u._id === newData._id ? { ...u, ...newData } : u)));
                setModalStatus("success");
                setShowModal(true);
                return { success: true, data: newData };
            } else {
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: "Unexpected response from server." };
            }
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.error || error.message || "Unexpected error occurred.";

            setCustomError(message);
        }
    };

    const deleteTeam = async (BrandId) => {
        try {
            const response = await axiosInstance.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Team/${BrandId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.data.status === "success") {
                const newData = response.data.data;
                setModalStatus("success");
                setShowModal(true);
                setTeam((prevUsers) => prevUsers.filter((user) => user._id !== BrandId));
                return { success: true, data: newData };
            } else {
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: "Unexpected response from server." };
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            setCustomError(error.response?.data?.message || "Failed to delete user.");
        }
    };

    return (
        <TEamContext.Provider
            value={{
                AddTeam,
                isTeam,
                fetchTeam,
                loading,
                error,
                UpdateTeam,
                deleteTeam,
                setTeam,
                customError,
                setCustomError,
            }}
        >
            {children}

            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                error={customError}
            />
        </TEamContext.Provider>
    );
};