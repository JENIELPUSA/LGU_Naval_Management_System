const StatCard = ({ icon, title, value, change, description, gradient, progress }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      {/* Animated Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 transition-opacity duration-500 group-hover:opacity-30`}></div>

      {/* Glossy Glass Effect */}
      <div className="relative h-full rounded-2xl border border-white/30 bg-white/80 p-5 backdrop-blur-lg dark:border-slate-700/30 dark:bg-slate-900/70">
        <div className="flex items-start justify-between">
          {/* Icon with floating effect */}
          <div className="rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 p-3 shadow-lg transition-transform duration-300 group-hover:-translate-y-1 text-white">
            {icon}
          </div>
        </div>

        {/* Main Value */}
        <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
          {value}
          <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">this month</span>
        </h3>

        {/* Title and Description */}
        <div className="mt-2">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>

        {/* Progress bar */}
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

export default StatCard;