import React, { useState, useContext, useEffect } from "react";
import {
    BellRing,
    Bell,
    CheckCircle,
    Clock,
    User,
    FileText,
    AlertCircle,
    Filter,
    Search,
    MoreVertical,
    Archive,
    Trash2,
    Eye,
    EyeOff,
} from "lucide-react";
import { NotificationDisplayContext } from "../../../contexts/NotificationContext/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";

const NotificationsView = ({ notifications, onMarkAllAsRead, onMarkAsRead, onArchive, onDelete, onShowAll, showAll }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const { linkId } = useAuth();

    // Check if a notification is unread for the current user
    const isUnread = (notif) => {
        const userViewer = notif.viewers.find(viewer => viewer.user === linkId);
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
            return (
                title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    // Reset selected notifications when filter or search changes
    useEffect(() => {
        setSelectedNotifications([]);
    }, [searchTerm, selectedFilter, notifications]);

    const getNotificationIcon = (type, isUnread, priority) => {
        const baseClass = "w-4 h-4";
        const colorClass =
            priority === "high" ? "text-red-500" : 
            priority === "medium" ? "text-amber-500" : 
            isUnread ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500";

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
            high: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
            medium: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
            low: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600",
        };
        return badges[priority] || badges.low;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Unknown time";
        
        const now = new Date();
        const notifTime = new Date(timestamp);
        
        if (isNaN(notifTime.getTime())) return "Invalid date";
        
        const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return notifTime.toLocaleDateString();
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
        selectedNotifications.forEach(id => {
            onMarkAsRead(id);
        });
        setSelectedNotifications([]);
    };

    const handleBulkArchive = () => {
        selectedNotifications.forEach(id => {
            onArchive(id);
        });
        setSelectedNotifications([]);
    };

    const handleBulkDelete = () => {
        selectedNotifications.forEach(id => {
            onDelete(id);
        });
        setSelectedNotifications([]);
    };

    const isAllSelected = filteredNotifications.length > 0 && 
                          selectedNotifications.length === filteredNotifications.length;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all duration-200">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 shadow-sm">
                                <Bell className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    {hasUnread ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : "All caught up!"}
                                    {showAll && " (Showing all)"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      
                        <button
                            onClick={onShowAll}
                            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
                        >
                            {showAll ? (
                                <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Show Recent
                                </>
                            ) : (
                                <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Show All
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 transition-colors duration-200"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20 transition-colors duration-200"
                        >
                            <option value="all">All notifications</option>
                            <option value="unread">Unread only</option>
                            <option value="read">Read only</option>
                        </select>
                        <button className="rounded-lg p-2.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 border border-gray-200 dark:border-gray-700">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedNotifications.length > 0 && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/40 shadow-sm">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                        </span>
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={handleBulkMarkAsRead}
                                className="text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
                            >
                                Mark as read
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filteredNotifications.length > 0 ? (
                    <>
                        {/* Select All Header */}
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-900/50">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 dark:ring-offset-gray-900"
                                />
                                <label className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Select all ({filteredNotifications.length})
                                </label>
                            </div>
                        </div>

                        {filteredNotifications.map((notif) => {
                            const unread = isUnread(notif);
                            return (
                                <div
                                    key={notif._id}
                                    className={`group px-6 py-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                                        unread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                                    } ${selectedNotifications.includes(notif._id) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                                >
                                    <div className="flex items-start space-x-4">
                                        {/* Checkbox */}
                                        <div className="flex h-5 items-center pt-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedNotifications.includes(notif._id)}
                                                onChange={() => handleSelectNotification(notif._id)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 dark:ring-offset-gray-900 transition duration-200"
                                            />
                                        </div>

                                        {/* Icon */}
                                        <div
                                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                                                notif.priority === "high"
                                                    ? "bg-red-100 dark:bg-red-900/30"
                                                    : notif.priority === "medium"
                                                        ? "bg-amber-100 dark:bg-amber-900/30"
                                                        : unread
                                                            ? "bg-blue-100 dark:bg-blue-900/30"
                                                            : "bg-gray-100 dark:bg-gray-700"
                                            } transition-colors duration-200`}
                                        >
                                            {getNotificationIcon(notif.type, unread, notif.priority)}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="mr-4 flex-1">
                                                    <div className="mb-1.5 flex items-center space-x-2">
                                                        <h3 className={`text-sm font-semibold ${unread ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                                                            {notif.title || "No title"}
                                                        </h3>
                                                        {unread && (
                                                            <span className="flex h-2 w-2">
                                                                <span className="absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                                                            </span>
                                                        )}
                                                        {notif.priority && notif.priority !== "low" && (
                                                            <span
                                                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityBadge(notif.priority)}`}
                                                            >
                                                                {notif.priority}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400">{notif.message || "No message"}</p>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center space-x-1.5">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{formatTimestamp(notif.createdAt)}</span>
                                                        </span>
                                                        {notif.category && (
                                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                                                {notif.category}
                                                            </span>
                                                        )}
                                                        {notif.sender && (
                                                            <span className="flex items-center space-x-1">
                                                                <User className="h-3.5 w-3.5" />
                                                                <span>from {notif.sender}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300">
                                                        <MoreVertical className="h-4 w-4" />
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
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No notifications found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            {searchTerm || selectedFilter !== "all"
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : "You're all caught up! No new notifications at the moment."}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>
                            Showing {filteredNotifications.length} of {notifications.filter((n) => !n.archived).length} notifications
                            {showAll && " (All notifications)"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function App() {
    const { 
        notify, 
        markNotificationAsRead, 
        markAllNotificationsAsRead,
        showAll, 
        loading, 
        fetchNotifications 
    } = useContext(NotificationDisplayContext);
    
    const { linkId, authToken } = useAuth();

    useEffect(() => {
        fetchNotifications(false);
    }, [linkId, authToken]);

    const toggleShowAll = () => {
        fetchNotifications(!showAll);
    };

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

    const archiveNotification = (id) => {
        console.log("Archive notification:", id);
    };

    const deleteNotification = (id) => {
        console.log("Delete notification:", id);
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center dark:bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-t-blue-400"></div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
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