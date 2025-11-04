import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/footer";
import DashboardHeader from "../../Components/AdminDashboard/DashboardHeader";
import StatCardGrid from "../../Components/AdminDashboard/StatCardGrid";
import AnalyticsSection from "../../Components/AdminDashboard/AnalyticSection";
import UpcomingEventsTable from "../../Components/AdminDashboard/UpcomingEventsTable";
import { AuthContext } from "../../contexts/AuthContext";
import OrganizerCard from "../../Components/OrganizerDashboard/OrganizedCard";
import { useContext } from "react";
import LguCard from "../../Components/LGUDashboard/LGUCard";
import { PersonilContext } from "../../contexts/PersonelContext/PersonelContext";
import LogsAndAudit from "../../Components/LogsAndAudit/LogsAndAudit";

const DashboardPage = () => {
    const { role } = useContext(AuthContext);
    const { theme } = useTheme();
    const { bgtheme, FontColor } = useContext(PersonilContext);

    return (
        //  Full viewport background with responsive padding
        <div className="flex min-h-screen flex-col bg-slate-100 p-2 dark:bg-slate-950 sm:p-3 md:p-4">
            <div className="mx-auto w-full max-w-[1400px] space-y-3 sm:space-y-4">
                <DashboardHeader
                    bgtheme={bgtheme}
                    FontColor={FontColor}
                />

                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">Event Dashboard</h1>

                {role === "admin" ? (
                    <>
                        <StatCardGrid
                            bgtheme={bgtheme}
                            FontColor={FontColor}
                        />
                        <AnalyticsSection theme={theme} />
                        <UpcomingEventsTable
                            bgtheme={bgtheme}
                            FontColor={FontColor}
                        />
                        <LogsAndAudit />
                    </>
                ) : role === "organizer" ? (
                    <>
                        <OrganizerCard />
                        <AnalyticsSection theme={theme} />
                        <UpcomingEventsTable
                            bgtheme={bgtheme}
                            FontColor={FontColor}
                        />
                    </>
                ) : role === "lgu" ? (
                    <>
                        <LguCard />
                        <UpcomingEventsTable
                            bgtheme={bgtheme}
                            FontColor={FontColor}
                        />
                    </>
                ) : null}

                <Footer />
            </div>
        </div>
    );
};

export default DashboardPage;
