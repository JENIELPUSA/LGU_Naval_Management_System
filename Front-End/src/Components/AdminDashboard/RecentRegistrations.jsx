// src/components/RecentRegistrations.jsx
import { Filter, Calendar } from "lucide-react";
import React, { useContext, useMemo } from "react";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";

const RecentRegistrations = () => {
    const { isParticipant } = useContext(ParticipantDisplayContext);

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const todayParticipants = useMemo(() => {
        return isParticipant.filter((p) => {
            if (!p.created_at) return false;
            const participantDate = new Date(p.created_at).toISOString().split("T")[0];
            return participantDate === todayStr;
        });
    }, [isParticipant]);

    console.log("Today Participants:", todayParticipants);
    return (
        <div className="card col-span-1 border border-pink-300/50 bg-gradient-to-br from-pink-50/30 to-blue-50/30 dark:border-pink-700/50 dark:from-pink-900/20 dark:to-blue-900/20 md:col-span-2 lg:col-span-3">
            <div className="card-header flex items-center justify-between">
                <p className="card-title text-slate-800 dark:text-slate-200">Recent Registrations</p>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-800 dark:bg-pink-900/50 dark:text-pink-200">
                        {todayParticipants.length} new today
                    </span>
                    <div className="relative">
                        <button className="text-slate-600 hover:text-pink-500 dark:text-slate-300">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body h-[300px] overflow-auto p-0">
                {todayParticipants.map((sale) => (
                    <div
                        key={sale.id}
                        className="group flex items-center justify-between gap-x-4 border-b border-pink-200/50 px-4 py-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-50/30 hover:to-blue-50/30 dark:border-pink-900/50 dark:hover:from-pink-900/10 dark:hover:to-blue-900/10"
                    >
                        <div className="flex items-center gap-x-3">
                            <div className="relative">
                                <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-blue-400 text-white">
                                    <span className="font-bold">{sale.first_name.charAt(0)}</span>
                                </div>
                                <div className="absolute bottom-0 right-0 flex size-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex size-2.5 rounded-full bg-green-500"></span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="font-medium text-slate-800 group-hover:text-pink-600 dark:text-slate-100 dark:group-hover:text-pink-400">
                                    {sale.first_name}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="font-medium text-blue-600 dark:text-blue-400">#{sale.id}</p>
                            <div className="mt-1 flex items-center gap-1">
                                <Calendar
                                    size={12}
                                    className="text-slate-500 dark:text-slate-400"
                                />
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentRegistrations;
