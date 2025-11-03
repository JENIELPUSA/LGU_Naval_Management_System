const StatCard = ({ icon, title, value, change, description, gradient, progress, bgtheme, FontColor }) => {
    return (
        <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br shadow transition-all duration-300 hover:scale-[1.01] hover:shadow-md sm:rounded-xl sm:hover:scale-[1.02] sm:hover:shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 transition-opacity duration-500 group-hover:opacity-30`}></div>

            <div className="relative h-full rounded-lg border border-white/30 bg-white/80 p-2.5 backdrop-blur-sm dark:border-slate-700/30 dark:bg-slate-900/70 sm:rounded-xl sm:p-4">
                <div className="flex items-start justify-between">
                    <div
                        style={{ background: bgtheme, color: FontColor }}
                        className="rounded-md p-1.5 shadow-sm sm:rounded-lg sm:p-2.5"
                    >
                        {icon}
                    </div>
                </div>

                <h3 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white sm:mt-3 sm:text-2xl">
                    {value}
                    <span className="ml-1 text-[9px] font-normal text-slate-500 dark:text-slate-400 sm:ml-1.5 sm:text-[10px]">this month</span>
                </h3>

                <div className="mt-0.5 sm:mt-1.5">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">{title}</h4>
                    <p className="mt-0.5 text-[11px] leading-tight text-slate-600 dark:text-slate-400 sm:mt-1 sm:text-xs">{description}</p>
                </div>

                <div className="mt-1.5 sm:mt-3">
                    <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700 sm:h-1.5">
                        <div
                            style={{ background: bgtheme, width: `${progress}%` }}
                            className="h-full rounded-full"
                        ></div>
                    </div>
                    <div className="mt-0.5 flex justify-between text-[9px] text-slate-500 dark:text-slate-400 sm:mt-1 sm:text-[10px]">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden rounded-lg sm:rounded-xl">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-pulse rounded-full bg-white opacity-5"
                        style={{
                            width: `${Math.random() * 10 + 3}px`,
                            height: `${Math.random() * 10 + 3}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 6 + 2}s`,
                            animationDelay: `${Math.random() * 1.5}s`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default StatCard;
