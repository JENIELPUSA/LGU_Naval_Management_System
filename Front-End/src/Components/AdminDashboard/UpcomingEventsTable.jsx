import { Calendar } from "lucide-react";
import { useContext } from "react";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";

const UpcomingEventsTable = ({ bgtheme, FontColor }) => {
    const { IncomingEvent } = useContext(ParticipantDisplayContext);
    const events = Array.isArray(IncomingEvent) ? IncomingEvent : [];

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusBadgeClass = (status) => {
        const base = "rounded-full px-1.5 py-0.5 text-[10px] font-medium sm:px-2 sm:py-1 sm:text-xs";
        const colors = {
            approved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
            rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
        };
        return `${base} ${colors[status] || "bg-blue-100 text-blue-800"}`;
    };

    return (
        <div className="card border border-pink-300/50 bg-gradient-to-br from-pink-50/30 to-blue-50/30 dark:border-pink-700/50 dark:from-pink-900/20 dark:to-blue-900/20">
            <div className="card-header p-3 sm:p-4">
                <p className="card-title text-sm font-medium text-slate-800 dark:text-slate-200 sm:text-base">Upcoming Events</p>
            </div>
            <div className="card-body p-0">
                <div className="h-[480px] overflow-y-auto [scrollbar-width:thin]">
                    {events.length === 0 ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-slate-500 dark:text-slate-400 sm:gap-3 sm:p-6">
                            <Calendar
                                size={36}
                                className="text-slate-400 opacity-70 dark:text-slate-500 sm:size-48"
                            />
                            <p className="text-base font-medium sm:text-lg">No upcoming events found.</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile: ListView */}
                            <div className="block sm:hidden">
                                <div className="space-y-3 p-3">
                                    {events.map((event, index) => (
                                        <div
                                            key={event.event_id || index}
                                            className="rounded-xl border border-pink-200/40 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-pink-800/40 dark:bg-slate-900/70"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    style={{
                                                        background: bgtheme,
                                                        color: FontColor,
                                                    }}
                                                    className="mt-0.5 flex size-9 items-center justify-center rounded-lg"
                                                >
                                                    <Calendar
                                                        size={16}
                                                        style={{
                                                            color: FontColor,
                                                        }}
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                            {event.eventName}
                                                        </h3>
                                                        <span className={getStatusBadgeClass(event.status)}>{event.status}</span>
                                                    </div>
                                                    <p className="mt-1 line-clamp-2 overflow-hidden text-ellipsis whitespace-normal break-words text-[11px] text-slate-600 dark:text-slate-400">
                                                        {event.description}
                                                    </p>
                                                    <div className="mt-2 grid grid-cols-2 gap-x-2 text-[11px] text-slate-700 dark:text-slate-300">
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">Date:</span>{" "}
                                                            {formatDate(event.eventDate)}
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">Venue:</span> {event.venue || "TBD"}
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className="text-slate-500 dark:text-slate-400">Participants:</span>{" "}
                                                            {(event.totalParticipants ?? 0).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop: Table */}
                            <div className="hidden sm:block">
                                <div className="min-w-full overflow-x-auto">
                                    <table className="table w-full min-w-[600px]">
                                        <thead className="table-header bg-gradient-to-r from-pink-400/20 to-blue-400/20 dark:from-pink-700/30 dark:to-blue-700/30">
                                            <tr className="table-row">
                                                <th className="table-head px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                                                    Event
                                                </th>
                                                <th className="table-head px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                                                    Date
                                                </th>
                                                <th className="table-head px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                                                    Status
                                                </th>
                                                <th className="table-head px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                                                    Participants
                                                </th>
                                                <th className="table-head px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                                                    Venue
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-body">
                                            {events.map((event, index) => (
                                                <tr
                                                    key={event.event_id || index}
                                                    className="table-row border-b border-pink-200/30 hover:bg-pink-100/20 dark:border-pink-900/30 dark:hover:bg-pink-900/10"
                                                >
                                                    <td className="table-cell px-3 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                style={{
                                                                    background: bgtheme,
                                                                    color: FontColor,
                                                                }}
                                                                className="flex size-10 items-center justify-center rounded-lg"
                                                            >
                                                                <Calendar
                                                                    size={18}
                                                                    style={{
                                                                        color: FontColor,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                                    {event.eventName}
                                                                </p>
                                                                <p className="mt-0.5 line-clamp-1 overflow-hidden text-ellipsis whitespace-normal break-words text-xs text-slate-600 dark:text-slate-400">
                                                                    {event.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="table-cell px-3 py-3 text-sm text-slate-800 dark:text-slate-200">
                                                        {formatDate(event.eventDate)}
                                                    </td>
                                                    <td className="table-cell px-3 py-3">
                                                        <span className={getStatusBadgeClass(event.status)}>{event.status}</span>
                                                    </td>
                                                    <td className="table-cell px-3 py-3 text-sm text-slate-800 dark:text-slate-200">
                                                        {(event.totalParticipants ?? 0).toLocaleString()}
                                                    </td>
                                                    <td className="line-clamp- table-cell text-ellipsis whitespace-normal break-words px-3 py-3 text-sm text-slate-800 dark:text-slate-200">
                                                        {event.venue || "TBD"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpcomingEventsTable;
