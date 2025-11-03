import React, { useState, useContext, useEffect } from "react";
import { BellRing, Bell, CheckCircle, Clock, User, FileText, AlertCircle, Filter, Search, MoreVertical, Eye, EyeOff } from "lucide-react";
import { NotificationDisplayContext } from "../../../contexts/NotificationContext/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { PersonilContext } from "../../../contexts/PersonelContext/PersonelContext";

const NotificationsView = ({ notifications, onMarkAllAsRead, onMarkAsRead, onArchive, onDelete, onShowAll, showAll }) => {
    const { bgtheme, FontColor } = useContext(PersonilContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const { linkId } = useAuth();

    const isUnread = (notif) => {
        const userViewer = notif.viewers?.find((viewer) => viewer.user === linkId);
        return !userViewer || !userViewer.isRead;
    };

    const unreadCount = notifications.filter((notif) => isUnread(notif) && !notif.archived).length;
    const hasUnread = unreadCount > 0;

    const filteredNotifications = notifications
        .filter((notif) => !notif.archived)
        .filter((notif) => {
            if (selectedFilter === "unread") return isUnread(notif);
            if (selectedFilter === "read") return !isUnread(notif);
            return true;
        })
        .filter((notif) => {
            const title = notif.title || "";
            const message = notif.message || "";
            return title.toLowerCase().includes(searchTerm.toLowerCase()) || message.toLowerCase().includes(searchTerm.toLowerCase());
        });

    useEffect(() => {
        setSelectedNotifications([]);
    }, [searchTerm, selectedFilter, notifications]);

    const getNotificationIcon = (type, isUnread, priority) => {
        const baseClass = "w-3.5 h-3.5";
        const colorClass =
            priority === "high"
                ? "text-red-500"
                : priority === "medium"
                  ? "text-amber-500"
                  : isUnread
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500";

        switch (type) {
            case "registration":
                return <User className={`${baseClass} ${colorClass}`} />;
            case "report":
                return <FileText className={`${baseClass} ${colorClass}`} />;
            case "reminder":
                return <Clock className={`${baseClass} ${colorClass}`} />;
            case "update":
                return <AlertCircle className={`${baseClass} ${colorClass}`} />;
            default:
                return isUnread ? <BellRing className={`${baseClass} ${colorClass}`} /> : <Bell className={`${baseClass} ${colorClass}`} />;
        }
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            high: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 text-[10px] px-1 py-0.5",
            medium: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 text-[10px] px-1 py-0.5",
            low: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 text-[10px] px-1 py-0.5",
        };
        return badges[priority] || badges.low;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "—";
        const now = new Date();
        const notifTime = new Date(timestamp);
        if (isNaN(notifTime.getTime())) return "—";
        const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInMinutes < 1) return "now";
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInHours < 24) return `${diffInHours}h`;
        if (diffInDays < 7) return `${diffInDays}d`;
        return notifTime.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    };

    const handleSelectNotification = (id) => {
        setSelectedNotifications((prev) => (prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]));
    };

    const handleSelectAll = () => {
        if (selectedNotifications.length === filteredNotifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(filteredNotifications.map((n) => n._id));
        }
    };

    const handleBulkMarkAsRead = () => {
        selectedNotifications.forEach((id) => onMarkAsRead(id));
        setSelectedNotifications([]);
    };

    const isAllSelected = filteredNotifications.length > 0 && selectedNotifications.length === filteredNotifications.length;

    return (
        <div className="flex max-h-[calc(100vh-20px)] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 dark:border-gray-700 dark:bg-gray-800">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-gray-200 bg-white px-2 py-2 dark:border-gray-700 dark:bg-gray-900 sm:px-4 sm:py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            style={{ background: bgtheme, color: FontColor }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10"
                        >
                            <Bell className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">Notifications</h1>
                            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 sm:text-sm">
                                {hasUnread ? `${unreadCount} unread` : "All caught up!"} {showAll && " (All)"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onShowAll}
                        className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-3 sm:py-2 sm:text-sm"
                    >
                        {showAll ? <EyeOff className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" /> : <Eye className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />}
                        {showAll ? "Recent" : "All"}
                    </button>
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400 dark:text-gray-500 sm:left-3 sm:h-4 sm:w-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-200 py-1 pl-7 pr-2 text-[10px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:py-2 sm:pl-9 sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-1">
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="rounded-md border border-gray-200 px-2 py-1 text-[10px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-3 sm:py-2 sm:text-sm"
                        >
                            <option value="all">All</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                        </select>
                        <button className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 sm:p-2">
                            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                    </div>
                </div>

                {selectedNotifications.length > 0 && (
                    <div className="mt-1 flex items-center justify-between gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-300 sm:px-4 sm:py-2 sm:text-sm">
                        <span>{selectedNotifications.length} selected</span>
                        <button
                            onClick={handleBulkMarkAsRead}
                            className="rounded px-2 py-0.5 hover:bg-blue-100 dark:hover:bg-blue-800/30 sm:px-3 sm:py-1"
                        >
                            Mark as read
                        </button>
                    </div>
                )}
            </div>

            {/* Notifications List */}
            <div
                className="divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700/50"
                style={{ maxHeight: "calc(100vh - 120px)" }} // header + search + padding
            >
                {filteredNotifications.length > 0 ? (
                    <>
                        <div className="border-b border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-700 dark:bg-gray-900/50 sm:px-4 sm:py-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 sm:h-4 sm:w-4"
                                />
                                <label className="ml-1 text-[10px] font-medium text-gray-700 dark:text-gray-300 sm:ml-2 sm:text-sm">
                                    Select all ({filteredNotifications.length})
                                </label>
                            </div>
                        </div>

                        {filteredNotifications.map((notif) => {
                            const unread = isUnread(notif);
                            return (
                                <div
                                    key={notif._id}
                                    className={`group px-2 py-1 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/20 ${
                                        unread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                                    } ${selectedNotifications.includes(notif._id) ? "bg-blue-50 dark:bg-blue-900/20" : ""} sm:px-4 sm:py-2`}
                                >
                                    <div className="flex items-start gap-2">
                                        <div className="flex h-4 items-center pt-1 sm:pt-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedNotifications.includes(notif._id)}
                                                onChange={() => handleSelectNotification(notif._id)}
                                                className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 sm:h-4 sm:w-4"
                                            />
                                        </div>

                                        <div
                                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                                                notif.priority === "high"
                                                    ? "bg-red-100 dark:bg-red-900/30"
                                                    : notif.priority === "medium"
                                                      ? "bg-amber-100 dark:bg-amber-900/30"
                                                      : unread
                                                        ? "bg-blue-100 dark:bg-blue-900/30"
                                                        : "bg-gray-100 dark:bg-gray-700"
                                            } sm:h-10 sm:w-10`}
                                        >
                                            {getNotificationIcon(notif.type, unread, notif.priority)}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="mr-1 flex-1 sm:mr-2">
                                                    <div className="mb-1 flex flex-wrap items-center gap-1">
                                                        <h3
                                                            className={`text-[10px] font-medium ${unread ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"} sm:text-sm`}
                                                        >
                                                            {notif.title || "No title"}
                                                        </h3>
                                                        {unread && (
                                                            <span className="relative flex h-1 w-1">
                                                                <span className="absolute inline-flex h-1 w-1 animate-ping rounded-full bg-blue-400 opacity-75"></span>
                                                                <span className="relative inline-flex h-1 w-1 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                                                            </span>
                                                        )}
                                                        {notif.priority && notif.priority !== "low" && (
                                                            <span
                                                                className={`inline-flex items-center rounded-full border ${getPriorityBadge(notif.priority)}`}
                                                            >
                                                                {notif.priority}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mb-1 text-[10px] leading-tight text-gray-600 dark:text-gray-400 sm:text-sm">
                                                        {notif.message || "No message"}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-1 text-[9px] text-gray-500 dark:text-gray-400 sm:text-xs">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{formatTimestamp(notif.createdAt)}</span>
                                                        </span>
                                                        {notif.category && (
                                                            <span className="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                                                {notif.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300 sm:p-1.5">
                                                        <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div className="px-2 py-6 text-center sm:px-4 sm:py-12">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 sm:h-12 sm:w-12">
                            <Bell className="h-5 w-5 text-gray-400 dark:text-gray-500 sm:h-6 sm:w-6" />
                        </div>
                        <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-white sm:text-base">No notifications</h3>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-sm">
                            {searchTerm || selectedFilter !== "all" ? "Try adjusting your search or filter." : "You're all caught up!"}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 px-2 py-1 text-[10px] text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400 sm:px-4 sm:py-2 sm:text-sm">
                    <span>
                        Showing {filteredNotifications.length} of {notifications.filter((n) => !n.archived).length}
                    </span>
                </div>
            )}
        </div>
    );
};

export default function App() {
    const { notify, markNotificationAsRead, markAllNotificationsAsRead, showAll, loading, fetchNotifications } =
        useContext(NotificationDisplayContext);
    const { linkId, authToken } = useAuth();

    useEffect(() => {
        fetchNotifications(false);
    }, [linkId, authToken]);

    const toggleShowAll = () => fetchNotifications(!showAll);

    const markAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const archiveNotification = (id) => console.log("Archive:", id);
    const deleteNotification = (id) => console.log("Delete:", id);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center dark:bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="border-3 h-10 w-10 animate-spin rounded-full border-blue-200 border-t-blue-600 dark:border-t-blue-400 sm:h-12 sm:w-12"></div>
                    <p className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 sm:text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <NotificationsView
            notifications={notify || []}
            onMarkAllAsRead={markAllAsRead}
            onMarkAsRead={markAsRead}
            onArchive={archiveNotification}
            onDelete={deleteNotification}
            onShowAll={toggleShowAll}
            showAll={showAll}
        />
    );
}
