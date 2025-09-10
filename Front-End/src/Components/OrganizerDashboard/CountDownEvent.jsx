import React, { useState, useEffect } from "react";

// Component para sa isang unit ng oras
const TimeUnit = ({ value, label }) => {
  return (
    <div className="text-center transform transition-transform duration-300 hover:scale-105">
      <div className="bg-gradient-to-b from-blue-800 to-gray-900 rounded-lg p-3 md:p-4 shadow-md border border-gray-700 relative overflow-hidden light:from-blue-200 light:to-gray-200 light:border-gray-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse light:from-blue-300/10 light:to-purple-300/10"></div>
        <div className="relative">
          <div className="text-xl md:text-2xl font-bold text-white mb-1 tracking-wide light:text-gray-900">
            {value}
          </div>
          <div className="text-blue-300 text-xs md:text-sm font-medium light:text-blue-600">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

// Pangunahing Countdown Timer Component
const CountdownTimer = () => {
  const lguEventData = {
    eventName: "Founding Anniversary ng Lungsod",
    eventTargetDate: new Date("December 1, 2025 09:00:00").getTime(),
  };

  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [isEventOver, setIsEventOver] = useState(false);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = lguEventData.eventTargetDate - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        setIsEventOver(true);
        return;
      }

      const calculatedDays = Math.floor(distance / (1000 * 60 * 60 * 24));
      const calculatedHours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const calculatedMinutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const calculatedSeconds = Math.floor((distance % (1000 * 60)) / 1000);

      setDays(String(calculatedDays).padStart(2, "0"));
      setHours(String(calculatedHours).padStart(2, "0"));
      setMinutes(String(calculatedMinutes).padStart(2, "0"));
      setSeconds(String(calculatedSeconds).padStart(2, "0"));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [lguEventData.eventTargetDate]);

  const formattedDate = new Date(lguEventData.eventTargetDate).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="w-full bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-700 light:bg-gray-100 light:bg-opacity-70 light:border-gray-300">
      <div className="p-4 md:p-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight light:text-gray-800">
            Event Countdown
          </h1>
          <p className="text-blue-300 text-sm md:text-base light:text-blue-500">
            Paghihintay para sa isang mahalagang kaganapan ng LGU
          </p>
        </div>

        <div className="bg-gradient-to-b from-blue-900 to-gray-900 rounded-xl p-4 md:p-5 shadow-inner light:from-blue-300 light:to-gray-300">
          <h2 className="text-lg md:text-xl font-bold text-center text-blue-400 mb-4 tracking-wide light:text-blue-700">
            {lguEventData.eventName}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <TimeUnit value={days} label="Araw" />
            <TimeUnit value={hours} label="Oras" />
            <TimeUnit value={minutes} label="Minuto" />
            <TimeUnit value={seconds} label="Segundo" />
          </div>

          {isEventOver && (
            <div className="mt-6 text-center animate-pulse">
              <p className="text-green-400 text-sm md:text-base font-semibold bg-green-900 bg-opacity-20 py-2 px-4 rounded-full inline-block light:text-green-600 light:bg-green-200">
                Ang {lguEventData.eventName} ay nagsimula na! 🎉
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden light:bg-gray-300">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out light:from-blue-600 light:to-purple-700"
              style={{
                width: `${Math.max(0, 100 - (Number(days) / 365) * 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-gray-400 text-xs mt-2 light:text-gray-500">
            Progress patungo sa {lguEventData.eventName}
          </p>
        </div>
      </div>

      <div className="bg-gray-900 bg-opacity-50 py-2 text-center light:bg-gray-200 light:bg-opacity-50">
        <p className="text-gray-500 text-xs light:text-gray-600">
          Maghihintay hanggang {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;