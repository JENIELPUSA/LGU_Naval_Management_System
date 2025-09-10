// src/components/OrganizedCard.jsx
import { Calendar, Users, DollarSign, Package, TrendingUp } from "lucide-react";
import { EventDisplayContext } from "../../contexts/EventContext/EventContext";
import { useContext } from "react";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";
import { ProposalDisplayContext } from "../../contexts/ProposalContext/ProposalContext";
const OrganizedCard = ({ icon, title, value, change, description, gradient, progress }) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 transition-opacity duration-500 group-hover:opacity-30`}></div>

            <div className="relative h-full rounded-2xl border border-white/30 bg-white/80 p-5 backdrop-blur-lg dark:border-slate-700/30 dark:bg-slate-900/70">
                <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 p-3 text-white shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                        {icon}
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800/50">
                        <TrendingUp
                            size={16}
                            className="text-yellow-500"
                        />
                        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">{change}</span>
                    </div>
                </div>

                <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                    {value}
                    <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">this month</span>
                </h3>

                <div className="mt-2">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
                </div>

                <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                </div>
            </div>

            {/* Floating particles effect */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden rounded-2xl">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-pulse rounded-full bg-white opacity-10"
                        style={{
                            width: `${Math.random() * 20 + 5}px`,
                            height: `${Math.random() * 20 + 5}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 5 + 3}s`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

const OrganizedCardGrid = () => {
    const { isTotalEvent, isTotalUpcomingEvent } = useContext(EventDisplayContext);
    const { isTotalParticipant } = useContext(ParticipantDisplayContext);
    const {ProposalStatusCount}=useContext(ProposalDisplayContext)

    const statsData = [
        {
            icon: <Calendar size={26} />,
            title: "Total Events",
            value: isTotalEvent,
            description: "All events created",
            gradient: "from-pink-500 to-blue-500",
        },
        {
            icon: <Users size={26} />,
            title: "Participants",
            value: isTotalParticipant,
            description: "Total attendees registered",
            gradient: "from-pink-500 via-purple-500 to-blue-500",
        },
        {
            icon: <DollarSign size={26} />,
            title: "Total Approved",
            value: ProposalStatusCount.approved || 0,
            description: "Total revenue generated",
            gradient: "from-blue-500 to-pink-500",
            progress: 82,
        },
        {
            icon: <Package size={26} />,
            title: "Upcoming Events",
            value: isTotalUpcomingEvent,
            description: "Scheduled for next 30 days",
            gradient: "from-pink-500 to-blue-400",
        },
    ];
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
                <OrganizedCard
                    key={index}
                    {...stat}
                />
            ))}
        </div>
    );
};

export default OrganizedCardGrid;
