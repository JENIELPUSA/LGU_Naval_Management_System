// src/components/EventStatusChart.jsx
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

    // Calculate totals
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
            <div className="card-header flex items-center justify-between">
                <p className="card-title text-slate-800 dark:text-slate-200">Proposal and LGU Status Trend</p>
                <div className="flex flex-wrap items-center gap-2">
                    {/* Legend for Approved, Rejected, Pending */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                        <div className="flex items-center gap-1 dark:text-stone-50">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-xs">Approved</span>
                        </div>
                        <div className="flex items-center gap-1 dark:text-stone-50">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <span className="text-xs">Rejected</span>
                        </div>
                        <div className="flex items-center gap-1 dark:text-stone-50">
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <span className="text-xs">Pending</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <LineChart
                        data={combinedData}
                        margin={{ top: 15, right: 20, left: 10, bottom: 15 }}
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
                            tickMargin={10}
                            tick={{ fill: theme === "light" ? "#64748b" : "#94a3b8" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            tick={{ fill: theme === "light" ? "#64748b" : "#94a3b8" }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border border-gray-200/50 bg-white p-3 shadow-lg dark:border-gray-700/50 dark:bg-slate-800">
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{payload[0].payload.name}</p>
                                            {payload.map((p, index) => (
                                                <p
                                                    key={index}
                                                    style={{ color: p.stroke }}
                                                    className="text-md font-bold"
                                                >
                                                    {p.name.replace("_", " ")}: {p.value}
                                                </p>
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        {/* Approved Lines */}
                        <Line
                            type="monotone"
                            dataKey="proposal_approved"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                            name="Proposal Approved"
                        />
                        <Line
                            type="monotone"
                            dataKey="lgu_approved"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                            name="LGU Approved"
                        />

                        {/* Rejected Lines */}
                        <Line
                            type="monotone"
                            dataKey="proposal_rejected"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                            name="Proposal Rejected"
                        />
                        <Line
                            type="monotone"
                            dataKey="lgu_rejected"
                            stroke="#9333ea"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                            name="LGU Rejected"
                        />

                        {/* Pending Line */}
                        <Line
                            type="monotone"
                            dataKey="lgu_pending"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                            name="LGU Pending"
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-between border-t border-pink-200/50 px-6 py-4 dark:border-pink-700/50">
                    <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total Approved</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">{totalApproved}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total Rejected</p>
                        <p className="font-semibold text-red-600 dark:text-red-400">{totalRejected}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total Pending</p>
                        <p className="font-semibold text-yellow-600 dark:text-yellow-400">{totalPending}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventStatusChart;
