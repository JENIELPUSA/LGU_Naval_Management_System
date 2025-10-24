import { Calendar, PencilLine, Trash } from "lucide-react";
import { useContext } from "react";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";

const UpcomingEventsTable = () => {
  const { IncomingEvent } = useContext(ParticipantDisplayContext);

  const events = Array.isArray(IncomingEvent) ? IncomingEvent : [];

  return (
    <div className="card border border-pink-300/50 bg-gradient-to-br from-pink-50/30 to-blue-50/30 dark:border-pink-700/50 dark:from-pink-900/20 dark:to-blue-900/20">
      <div className="card-header">
        <p className="card-title text-slate-800 dark:text-slate-200">Upcoming Events</p>
      </div>
      <div className="card-body p-0">
        <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
          {events.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-slate-500 dark:text-slate-400">
              <Calendar size={48} className="text-slate-400 dark:text-slate-500 opacity-70" />
              <p className="text-lg font-medium">No upcoming events found.</p>
            </div>
          ) : (
            <table className="table">
              <thead className="table-header bg-gradient-to-r from-pink-400/20 to-blue-400/20 dark:from-pink-700/30 dark:to-blue-700/30">
                <tr className="table-row">
                  <th className="table-head text-slate-800 dark:text-slate-100">#</th>
                  <th className="table-head text-slate-800 dark:text-slate-100">Event Name</th>
                  <th className="table-head text-slate-800 dark:text-slate-100">Date</th>
                  <th className="table-head text-slate-800 dark:text-slate-100">Status</th>
                  <th className="table-head text-slate-800 dark:text-slate-100">Participants</th>
                  <th className="table-head text-slate-800 dark:text-slate-100">Venue</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {events.map((event, index) => {
                  const statusColors = {
                    approved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
                    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
                    rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
                  };

                  return (
                    <tr
                      key={event.event_id || index}
                      className="table-row border-b border-pink-200/30 hover:bg-pink-100/20 dark:border-pink-900/30 dark:hover:bg-pink-900/10"
                    >
                      <td className="table-cell text-slate-800 dark:text-slate-200">
                        {index + 1}
                      </td>
                      <td className="table-cell">
                        <div className="flex w-max gap-x-4">
                          <div className="flex size-14 items-center justify-center rounded-lg bg-gradient-to-br from-pink-400 to-blue-400">
                            <Calendar size={24} className="text-white" />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-slate-800 dark:text-slate-100">{event.eventName}</p>
                            <p className="font-normal text-slate-600 dark:text-slate-400">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-slate-800 dark:text-slate-200">
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString("en-PH", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="table-cell">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            statusColors[event.status] || "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="table-cell text-slate-800 dark:text-slate-200">
                        {(event.totalParticipants ?? 0).toLocaleString()}
                      </td>
                      <td className="table-cell text-slate-800 dark:text-slate-200">
                        <span className="text-sm">{event.venue || "TBD"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsTable;