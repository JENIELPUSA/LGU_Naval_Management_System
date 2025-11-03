import { Calendar } from "lucide-react";
import logo from "../../assets/logo-login.png";

const DashboardHeader = ({ bgtheme, FontColor }) => {
    return (
        <div
            style={{ background: bgtheme, color: FontColor }}
            className="rounded-md p-3 shadow"
        >
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="flex items-center gap-2">
                    <img
                        src={logo}
                        alt="LGU Logo"
                        className="h-12 w-12 rounded-full border object-cover shadow-sm sm:h-16 sm:w-16"
                        style={{ borderColor: FontColor }}
                    />
                    <div>
                        <h1
                            className="text-lg font-bold leading-tight sm:text-xl"
                            style={{ color: FontColor }}
                        >
                            LGU NAVAL EVENT MANAGEMENT SYSTEM
                        </h1>
                        <p
                            className="mt-0.5 text-[11px] sm:text-xs"
                            style={{ color: FontColor }}
                        >
                            Comprehensive platform for managing local government unit events
                        </p>
                    </div>
                </div>
                <div
                    className="flex items-center gap-2 rounded p-2 backdrop-blur-sm"
                    style={{ background: `${FontColor}20` }} // semi-transparent background based on FontColor
                >
                    <Calendar
                        size={20}
                        style={{ color: FontColor }}
                        className="sm:size-24"
                    />
                    <div>
                        <p
                            className="text-[11px] font-semibold sm:text-xs"
                            style={{ color: FontColor }}
                        >
                            Today's Date
                        </p>
                        <p
                            className="text-[11px] leading-tight sm:text-xs"
                            style={{ color: FontColor }}
                        >
                            {new Date().toLocaleDateString("en-PH", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
