import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ProposalDisplayContext } from "../../contexts/ProposalContext/ProposalContext";
import { useContext } from "react";
import { LguResponseContext } from "../../contexts/LGUResponseContext/LGUResponseContext";

const EventStatusChart = ({ theme }) => {
    const { ProposalStatusCount = [] } = useContext(ProposalDisplayContext) || {};
    const { LguStatusCount = [] } = useContext(LguResponseContext) || {};

    const allMonths = [...new Set([...ProposalStatusCount.map((d) => d.month), ...LguStatusCount.map((d) => d.month)])];

    const combinedData = allMonths.map((month) => {
        const proposal = ProposalStatusCount.find((d) => d.month === month) || {};
        const lgu = LguStatusCount.find((d) => d.month === month) || {};

        return {
            name: month,
            proposal_approved: proposal.approved || 0,
            proposal_rejected: proposal.rejected || 0,
            proposal_pending: proposal.pending || 0,
            lgu_approved: lgu.approved || 0,
            lgu_rejected: lgu.rejected || 0,
            lgu_pending: lgu.pending || 0,
        };
    });

    const totalProposalApproved = ProposalStatusCount.reduce((sum, d) => sum + (d.approved || 0), 0);
    const totalProposalRejected = ProposalStatusCount.reduce((sum, d) => sum + (d.rejected || 0), 0);
    const totalLGUApproved = LguStatusCount.reduce((sum, d) => sum + (d.approved || 0), 0);
    const totalLGURejected = LguStatusCount.reduce((sum, d) => sum + (d.rejected || 0), 0);
    const totalLGUPending = LguStatusCount.reduce((sum, d) => sum + (d.pending || 0), 0);

    const totalApproved = totalProposalApproved + totalLGUApproved;
    const totalRejected = totalProposalRejected + totalLGURejected;
    const totalPending = totalLGUPending;

    return (
        <div className="card col-span-1 border border-pink-300/50 bg-gradient-to-br from-pink-50/30 to-blue-50/30 dark:border-pink-700/50 dark:from-pink-900/20 dark:to-blue-900/20 md:col-span-2 lg:col-span-4">
            <div className="card-header flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
                <p className="card-title text-sm font-medium text-slate-800 dark:text-slate-200 sm:text-base">
                    Proposal and LGU Status Trend
                </p>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500 sm:h-3 sm:w-3"></div>
                            <span className="text-[10px] text-slate-600 dark:text-stone-50 sm:text-xs">Approved</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-red-500 sm:h-3 sm:w-3"></div>
                            <span className="text-[10px] text-slate-600 dark:text-stone-50 sm:text-xs">Rejected</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-yellow-500 sm:h-3 sm:w-3"></div>
                            <span className="text-[10px] text-slate-600 dark:text-stone-50 sm:text-xs">Pending</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <div className="h-[260px] w-full sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={combinedData}
                            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={theme === "light" ? "#e2e8f0" : "#334155"}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                tick={{ fontSize: "11px", fill: theme === "light" ? "#64748b" : "#94a3b8" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                tick={{ fontSize: "11px", fill: theme === "light" ? "#64748b" : "#94a3b8" }}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-md border border-gray-200/50 bg-white p-2 shadow-md dark:border-gray-700/50 dark:bg-slate-800 sm:p-3">
                                                <p className="text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
                                                    {payload[0].payload.name}
                                                </p>
                                                {payload.map((p, index) => (
                                                    <p
                                                        key={index}
                                                        style={{ color: p.stroke }}
                                                        className="text-xs font-semibold sm:text-sm"
                                                    >
                                                        {p.name.replace(/_/g, " ")}: {p.value}
                                                    </p>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line type="monotone" dataKey="proposal_approved" stroke="#22c55e" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} name="Proposal Approved" />
                            <Line type="monotone" dataKey="lgu_approved" stroke="#3b82f6" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} name="LGU Approved" />
                            <Line type="monotone" dataKey="proposal_rejected" stroke="#ef4444" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} name="Proposal Rejected" />
                            <Line type="monotone" dataKey="lgu_rejected" stroke="#9333ea" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} name="LGU Rejected" />
                            <Line type="monotone" dataKey="lgu_pending" stroke="#f59e0b" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} name="LGU Pending" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-between gap-2 border-t border-pink-200/50 px-3 py-3 text-center dark:border-pink-700/50 sm:px-6 sm:py-4">
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">Total Approved</p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400 sm:text-base">{totalApproved}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">Total Rejected</p>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400 sm:text-base">{totalRejected}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">Total Pending</p>
                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 sm:text-base">{totalPending}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventStatusChart;