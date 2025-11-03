import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";

export const PersonilContext = createContext();

export const PersonelDisplayProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [isPersonel, setPersonel] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [customError, setCustomError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [FontColor, setFontColor] = useState("#1b1818");
    const [modalStatus, setModalStatus] = useState("success");
    const [bgtheme, setTheme] = useState("linear-gradient(to right, #70cef0, #93d1ec)");
    useEffect(() => {
        if (authToken) {
            FetchPersonel();
            fetchCurrentMayorTheme();
        }
    }, [authToken]);

    useEffect(() => {
        fetchCurrentMayorTheme();
    }, []);

    useEffect(() => {
        if (customError) {
            const timer = setTimeout(() => setCustomError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [customError]);

    const AddPersonel = async (formData) => {
        if (!authToken) return;

        try {
            const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Personel`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Baguhin ang content type
                    Authorization: `Bearer ${authToken}`,
                },
                withCredentials: true,
            });

            if (res.data.status === "success") {
                // Update local state
                setPersonel((prev) => [...prev, res.data.data]);
                setModalStatus("success");
                setShowModal(true);

                return res.data.data;
            } else {
                throw new Error(res.data.message || "Registration failed.");
            }
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.error || error.message || "Something went wrong.";

            setModalStatus("failed");
            setShowModal(true);
            setCustomError(message);

            console.error("AddPersonel error:", message);
            throw new Error(message);
        }
    };

    const FetchPersonel = async (page = 1, limit = 5, position = "", termFrom = "", termTo = "") => {
        if (!authToken) return;

        try {
            setIsLoading(true);

            const params = { page, limit };
            if (position && position.trim() !== "") params.position = position.trim();
            if (termFrom && termFrom.trim() !== "") params.termFrom = termFrom.trim();
            if (termTo && termTo.trim() !== "") params.termTo = termTo.trim();

            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Personel`, {
                params,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
                withCredentials: true,
            });

            const { data, totalCount, totalPages: pages } = res.data;
            let totalPages = 1;
            if (totalCount) {
                totalPages = Math.ceil(totalCount / limit);
            } else if (pages) {
                totalPages = pages;
            }

            setPersonel(data || []);
            setTotalPages(totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching personnel data:", error);
            setCustomError("Failed to fetch personnel data.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLatestProfileByPosition = async (position) => {
        try {
            setIsLoading(true);
            setCustomError(null);
            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Personel/position/${position}`);
            setProfile(res.data.data);
        } catch (err) {
            console.error("Frontend - Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });

            setCustomError(err.response?.data?.message || "Something went wrong");
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    const UpdatePersonel = async (dataID, formDataToSend) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Personel/${dataID}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data?.status === "success") {
                setModalStatus("success");
                setShowModal(true);
                FetchPersonel();
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

    const fetchCurrentMayorTheme = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Personel/getCurrentMayorProfile`);

            if (res.data.status === "success") {
                setTheme(res.data.data.colortheme);
                setFontColor(res.data.data.fontColor);
            }
        } catch (error) {
            console.error("Error fetching current mayor theme:", error);
        }
    };

    const DeletePersonel = async (persodelId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Personel/${persodelId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.data.status === "success") {
                FetchPersonel();
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
        <PersonilContext.Provider
            value={{
                isPersonel,
                isLoading,
                customError,
                AddPersonel,

                UpdatePersonel,
                fetchLatestProfileByPosition,
                profile,
                bgtheme,
                DeletePersonel,
                FontColor,
                totalPages,
                currentPage,
                setCurrentPage,
                FetchPersonel,
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                error={customError}
            />
        </PersonilContext.Provider>
    );
};
