import { Filter, Calendar, User } from "lucide-react";
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

    return (
        <div className="card col-span-1 border border-pink-300/50 bg-gradient-to-br from-pink-50/30 to-blue-50/30 dark:border-pink-700/50 dark:from-pink-900/20 dark:to-blue-900/20 md:col-span-2 lg:col-span-3">
            <div className="card-header flex items-center justify-between gap-1.5 p-2.5 sm:p-4">
                <p className="card-title text-sm font-medium text-slate-800 dark:text-slate-200 sm:text-base">
                    Recent Registrations
                </p>
                <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-pink-100 px-1.5 py-0.5 text-[10px] font-medium text-pink-800 dark:bg-pink-900/50 dark:text-pink-200 sm:px-2 sm:py-1 sm:text-xs">
                        {todayParticipants.length} new today
                    </span>
                    <button className="text-slate-600 hover:text-pink-500 dark:text-slate-300">
                        <Filter size={14} className="sm:size-10" />
                    </button>
                </div>
            </div>
            <div className="card-body h-[260px] overflow-y-auto p-0 [scrollbar-width:thin] sm:h-[300px]">
                {todayParticipants.length === 0 ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-slate-500 dark:text-slate-400 sm:gap-3 sm:p-6">
                        <User size={32} className="text-slate-400 dark:text-slate-500 opacity-70 sm:size-48" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 sm:text-lg">
                            No registrations today.
                        </p>
                    </div>
                ) : (
                    todayParticipants.map((sale) => (
                        <div
                            key={sale.id}
                            className="group flex items-center justify-between gap-x-2.5 border-b border-pink-200/40 px-3 py-2 transition-colors duration-200 hover:bg-pink-50/30 dark:border-pink-900/40 dark:hover:bg-pink-900/10 sm:gap-x-4 sm:px-4 sm:py-3"
                        >
                            <div className="flex items-center gap-x-2.5">
                                <div className="relative">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-blue-400 text-[10px] font-bold text-white sm:size-10">
                                        {sale.first_name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50"></span>
                                        <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-slate-800 group-hover:text-pink-600 dark:text-slate-100 dark:group-hover:text-pink-400 sm:text-base">
                                        {sale.first_name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 sm:text-sm">
                                    #{sale.id}
                                </p>
                                <div className="mt-0.5 flex items-center gap-1">
                                    <Calendar size={8} className="text-slate-500 dark:text-slate-400 sm:size-10" />
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                                        {new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentRegistrations;