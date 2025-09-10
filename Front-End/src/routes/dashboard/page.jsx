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
import CountDownEvent from "../../Components/OrganizerDashboard/CountDownEvent";
import RecentRegistrations from "../../Components/AdminDashboard/RecentRegistrations";
import RecentandOrganizedLayout from "../../Components/OrganizerDashboard/RecentandOrganizedLayout";
import LguCard from "../../Components/LGUDashboard/LGUCard"
const DashboardPage = () => {
    const { role } = useContext(AuthContext);
    const { theme } = useTheme();

    return (
        <div className="flex flex-col gap-y-4">
            <DashboardHeader />
            <h1 className="title text-slate-900 dark:text-slate-100">Event Dashboard</h1>
            {role === "admin" ? (
                <>
                    <StatCardGrid />
                    <AnalyticsSection theme={theme} />
                    <UpcomingEventsTable />
                </>
            ) : role === "organizer" ? (
                <>
                    <OrganizerCard />
                    <RecentandOrganizedLayout />
                    <UpcomingEventsTable />
                </>
            ) : role === "lgu" ? (
                <>
                    <LguCard/>
                    <UpcomingEventsTable />
                </>
            ) : null}

            <Footer />
        </div>
    );
};

export default DashboardPage;
