import { useContext, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import socket from "../socket.js";
import { NotificationDisplayContext } from "../../contexts/NotificationContext/NotificationContext.jsx";
import { ProposalDisplayContext } from "../../contexts/ProposalContext/ProposalContext.jsx";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext.jsx";
const SocketListener = () => {
    const { role, linkId } = useAuth();
    const { setNotify, fetchNotifications } = useContext(NotificationDisplayContext);
    const { FetchParticipant } = useContext(ParticipantDisplayContext);
    const { FetchProposalDisplay } = useContext(ProposalDisplayContext);

    const formatNotification = (data, fallbackMessage = "You have a new notification") => ({
        _id: data._id || (data.data && data.data._id) || Math.random().toString(36).substr(2, 9),
        message: data.message || fallbackMessage,
        createdAt: data.createdAt || new Date().toISOString(),
        viewers: [
            {
                user: linkId,
                isRead: false,
            },
        ],
    });

    useEffect(() => {
        if (!linkId || !role) return;
        socket.emit("register-user", linkId, role);
    }, [linkId, role]);

    useEffect(() => {
        if (!linkId || !role) return;

        const handleProposalNotification = async (notification) => {
            try {
                await Promise.all([fetchNotifications(), FetchProposalDisplay()]);

                const updateProposal = notification.data;
                if (!updateProposal?._id) return;

                console.log("Proposal notification handled:", updateProposal._id);
            } catch (error) {
                console.error("Error handling proposal notification:", error);
            }
        };

        const handleRefreshNotifications = async () => {
            console.log("Socket RefreshNotifications triggered");
            await fetchNotifications();
        };
        const handleInvitation = async (invitation) => {
            try {
                console.log("Received new Invitation:", invitation);

                // Optional: update Notification context
                const formatted = formatNotification(invitation, "You have a new Invitation");
                setNotify((prev) => [formatted, ...prev]);

                // Refetch notifications from backend
                await fetchNotifications();
            } catch (error) {
                console.error("Error handling Invitation notification:", error);
            }
        };

        const handleNewAttendance = async (attendance) => {
            try {
                await FetchParticipant();
            } catch (error) {
                console.error("Error handling attendance notification:", error);
            }
        };

        socket.on("Invitation", handleInvitation);
        socket.on("NewProposalNotification", handleProposalNotification);
        socket.on("RefreshNotifications", handleRefreshNotifications);
        socket.on("newAttendance", handleNewAttendance);
        return () => {
            socket.off("Invitation", handleInvitation);
            socket.off("NewProposalNotification", handleProposalNotification);
            socket.off("RefreshNotifications", handleRefreshNotifications);
            socket.off("newAttendance", handleNewAttendance);
        };
    }, [linkId, role, setNotify]);

    return null;
};

export default SocketListener;
