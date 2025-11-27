import React, { useState, useEffect, useMemo, useContext } from "react";
import { FileText } from "lucide-react";
import { LogsDisplayContext } from "../../contexts/LogsAndAudit/LogsAndAudit";

const LogsAndAudit = () => {
    const {
        isLogs,
        isTotalPages,
        currentPage,
        isTotalLogs,
        loading,
        fetchLogsData,
        setCurrentPage,
    } = useContext(LogsDisplayContext);

    const [expandedLog, setExpandedLog] = useState(null);
    const [filterActionType, setFilterActionType] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchLogsData({
            page: currentPage,
            action_type: filterActionType === "All" ? undefined : filterActionType,
            from: startDate || undefined,
            to: endDate || undefined,
        });
    }, [currentPage, filterActionType, startDate, endDate, fetchLogsData]);

    const handleFilterChange = (event) => {
        setFilterActionType(event.target.value);
        setCurrentPage(1);
        setExpandedLog(null);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        setCurrentPage(1);
        setExpandedLog(null);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        setCurrentPage(1);
        setExpandedLog(null);
    };

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= (isTotalPages || 1)) {
            setCurrentPage(pageNumber);
            setExpandedLog(null);
        }
    };

    const toggleExpand = (log) => {
        setExpandedLog(expandedLog && expandedLog._id === log._id ? null : log);
    };

    const formatTimestamp = (isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    const getActionBadgeClass = (action) => {
        const base = "rounded-full px-1.5 py-0.5 text-[10px] font-medium sm:px-2 sm:py-1 sm:text-xs";
        const colors = {
            DELETE: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
            CREATE: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
            UPDATE: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
        };
        return `${base} ${colors[action] || "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200"}`;
    };

    // Function to render data in a clean format
    const renderData = (data) => {
        if (!data || Object.keys(data).length === 0) {
            return <span className="text-slate-500 dark:text-slate-400">—</span>;
        }

        return (
            <div className="space-y-1">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex flex-wrap gap-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{key}:</span>
                        <span className="text-slate-600 dark:text-slate-400">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const uniqueActionTypes = useMemo(() => {
        const types = new Set((isLogs || []).map((log) => log.action_type));
        return ["All", ...Array.from(types).sort()];
    }, [isLogs]);

    const itemsPerPage = 6;
    const startEntry = isTotalLogs > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endEntry = Math.min(currentPage * itemsPerPage, isTotalLogs || 0);

    return (
        <div className="card border border-slate-300/50 bg-gradient-to-br from-slate-50/30 to-slate-100/30 dark:border-slate-700/50 dark:from-slate-900/20 dark:to-slate-800/20">
            <div className="card-header p-3 sm:p-4">
                <p className="card-title text-sm font-medium text-slate-800 dark:text-slate-200 sm:text-base">
                    Logs and Audit Trail
                </p>
            </div>

            <div className="card-body p-0">
                {/* Filters */}
                <div className="border-b border-slate-200/40 bg-slate-50/50 p-3 dark:border-slate-700/30 dark:bg-slate-800/10 sm:p-4">
                    <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
                        <p className="text-slate-600 dark:text-slate-300">
                            Total: <span className="font-semibold">{isTotalLogs || 0}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1">
                                <label className="text-slate-700 dark:text-slate-300">Action:</label>
                                <select
                                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600/50 dark:bg-slate-700/50 dark:text-white"
                                    value={filterActionType}
                                    onChange={handleFilterChange}
                                >
                                    {uniqueActionTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-1">
                                <span className="text-slate-700 dark:text-slate-300">From:</span>
                                <input
                                    type="date"
                                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600/50 dark:bg-slate-700/50 dark:text-white"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    max={endDate || undefined}
                                />
                            </div>

                            <div className="flex items-center gap-1">
                                <span className="text-slate-700 dark:text-slate-300">To:</span>
                                <input
                                    type="date"
                                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600/50 dark:bg-slate-700/50 dark:text-white"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    min={startDate || undefined}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="h-[480px] overflow-y-auto [scrollbar-width:thin]">
                    {loading ? (
                        <div className="flex h-full w-full items-center justify-center p-4 text-slate-500 dark:text-slate-400">
                            <p className="text-sm">Loading logs...</p>
                        </div>
                    ) : Array.isArray(isLogs) && isLogs.length > 0 ? (
                        <>
                            {/* Mobile: ListView */}
                            <div className="block sm:hidden">
                                <div className="space-y-3 p-3">
                                    {isLogs.map((log) => (
                                        <div
                                            key={log._id}
                                            className="rounded-xl border border-slate-200/40 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-slate-600/40 dark:bg-slate-800/70"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/40">
                                                    <FileText size={16} className="text-slate-700 dark:text-slate-300" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                            {log.module}
                                                        </h3>
                                                        <span className={getActionBadgeClass(log.action_type)}>
                                                            {log.action_type}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 line-clamp-2 text-[11px] text-slate-600 dark:text-slate-400">
                                                        {log.description}
                                                    </p>
                                                    <div className="mt-2 grid grid-cols-2 gap-x-2 text-[11px] text-slate-700 dark:text-slate-300">
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">By:</span>{" "}
                                                            {log.performed_by_name || "N/A"}
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">Role:</span> {log.role || "N/A"}
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-slate-500 dark:text-slate-400">Time:</span>{" "}
                                                            {formatTimestamp(log.timestamp)}
                                                        </div>
                                                    </div>
                                                    {expandedLog && expandedLog._id === log._id && (
                                                        <div className="mt-2 space-y-2 border-t border-slate-200 pt-2 dark:border-slate-600 text-[10px]">
                                                            <div>
                                                                <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">Old Data:</p>
                                                                <div className="rounded bg-slate-100 p-2 dark:bg-slate-700/20">
                                                                    {renderData(log.old_data)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">New Data:</p>
                                                                <div className="rounded bg-slate-100 p-2 dark:bg-slate-700/20">
                                                                    {renderData(log.new_data)}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                <span>IP: {log.ip_address || "N/A"}</span>
                                                                <span>Ref ID: {log.reference_id || "N/A"}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleExpand(log)}
                                                className="mt-2 text-[10px] font-medium text-slate-600 hover:underline dark:text-slate-400"
                                            >
                                                {expandedLog && expandedLog._id === log._id ? "Show less" : "Show details"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop: Table */}
                            <div className="hidden sm:block">
                                <div className="w-full overflow-x-visible">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-slate-200/50 to-slate-300/50 dark:from-slate-700/30 dark:to-slate-600/30">
                                            <tr>
                                                <th className="px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 w-24">Action</th>
                                                <th className="px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 w-40">Module</th>
                                                <th className="px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 min-w-0 flex-1">Description</th>
                                                <th className="px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 w-32">By</th>
                                                <th className="px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 w-28">Role</th>
                                                <th className="px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 w-40">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLogs.map((log) => (
                                                <React.Fragment key={log._id}>
                                                    <tr
                                                        className="cursor-pointer border-b border-slate-200/30 hover:bg-slate-100/20 dark:border-slate-600/30 dark:hover:bg-slate-700/10"
                                                        onClick={() => toggleExpand(log)}
                                                    >
                                                        <td className="px-3 py-3">
                                                            <span className={getActionBadgeClass(log.action_type)}>
                                                                {log.action_type}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex size-8 items-center justify-center rounded bg-slate-100 dark:bg-slate-700/40">
                                                                    <FileText size={14} className="text-slate-700 dark:text-slate-300" />
                                                                </div>
                                                                <span className="font-medium text-slate-800 dark:text-slate-100 truncate">
                                                                    {log.module}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 text-sm text-slate-700 dark:text-slate-300 min-w-0">
                                                            {/* DITO NAGLAGAY NG LINE-CLAMP */}
                                                            <p className="line-clamp-2 break-words leading-tight">{log.description}</p>
                                                        </td>
                                                        <td className="px-3 py-3 text-sm text-slate-800 dark:text-slate-200 truncate">
                                                            {log.performed_by_name || "N/A"}
                                                        </td>
                                                        <td className="px-3 py-3 text-sm text-slate-800 dark:text-slate-200 truncate">
                                                            {log.role || "N/A"}
                                                        </td>
                                                        <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">
                                                            {formatTimestamp(log.timestamp)}
                                                        </td>
                                                    </tr>
                                                    {expandedLog && expandedLog._id === log._id && (
                                                        <tr className="bg-slate-50/30 dark:bg-slate-700/10">
                                                            <td colSpan="6" className="px-4 py-3 text-xs text-slate-800 dark:text-slate-300">
                                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                                    <div>
                                                                        <p className="mb-2 font-semibold text-slate-800 dark:text-slate-200">Old Data:</p>
                                                                        <div className="rounded bg-slate-100 p-3 dark:bg-slate-700/20">
                                                                            {renderData(log.old_data)}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="mb-2 font-semibold text-slate-800 dark:text-slate-200">New Data:</p>
                                                                        <div className="rounded bg-slate-100 p-3 dark:bg-slate-700/20">
                                                                            {renderData(log.new_data)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                                                                    <span>IP: {log.ip_address || "N/A"}</span>
                                                                    <span>Ref ID: {log.reference_id || "N/A"}</span>
                                                                    <span>Log ID: {log._id}</span>
                                                                    <span>By ID: {log.performed_by || "N/A"}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-slate-500 dark:text-slate-400 sm:gap-3 sm:p-6">
                            <FileText size={36} className="text-slate-400 opacity-70 dark:text-slate-500 sm:size-48" />
                            <p className="text-base font-medium sm:text-lg">No audit logs available.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {!loading && isTotalLogs > 0 && isTotalPages > 1 && (
                <div className="card-footer flex flex-col items-center justify-between gap-2 border-t border-slate-200/30 bg-slate-50/30 p-3 text-xs dark:border-slate-600/30 dark:bg-slate-700/10 sm:flex-row sm:p-4">
                    <div className="text-slate-700 dark:text-slate-300">
                        Showing <span className="font-semibold">{startEntry}</span>–<span className="font-semibold">{endEntry}</span> of{" "}
                        <span className="font-semibold">{isTotalLogs}</span>
                    </div>
                    <div className="flex gap-0.5">
                        {[
                            { label: "«", page: 1, disabled: currentPage === 1 },
                            { label: "‹", page: currentPage - 1, disabled: currentPage === 1 },
                        ].map(({ label, page, disabled }) => (
                            <button
                                key={label}
                                onClick={() => paginate(page)}
                                disabled={disabled}
                                className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            >
                                {label}
                            </button>
                        ))}

                        {Array.from({ length: Math.min(5, isTotalPages) }, (_, i) => {
                            let pageNum;
                            if (isTotalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= isTotalPages - 2) {
                                pageNum = isTotalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => paginate(pageNum)}
                                    className={`rounded border px-2 py-1 ${
                                        currentPage === pageNum
                                            ? "bg-slate-100 font-bold text-slate-800 dark:bg-slate-600/40 dark:text-white"
                                            : "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {[
                            { label: "›", page: currentPage + 1, disabled: currentPage === isTotalPages },
                            { label: "»", page: isTotalPages, disabled: currentPage === isTotalPages },
                        ].map(({ label, page, disabled }) => (
                            <button
                                key={label}
                                onClick={() => paginate(page)}
                                disabled={disabled}
                                className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogsAndAudit;