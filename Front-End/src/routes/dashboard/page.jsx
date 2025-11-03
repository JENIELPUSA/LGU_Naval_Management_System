// src/pages/DashboardPage.jsx
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
const DashboardPage = () => {
    const { role } = useContext(AuthContext);
    const { theme } = useTheme();
    const { bgtheme, FontColor } = useContext(PersonilContext);
    return (
        <div className="flex flex-col gap-y-4">
            <DashboardHeader
                bgtheme={bgtheme}
                FontColor={FontColor}
            />
            <h1 className="title text-slate-900 dark:text-slate-100">Event Dashboard</h1>
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
    );
};

export default DashboardPage;
