import RecentRegistrations from "../AdminDashboard/RecentRegistrations";
import EventRevenueChart from "../AdminDashboard/EventRevenueChart"

const RecentandOrganizedLayout = ({ theme }) => {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Recent Registrations (40%) */}
            <div className="lg:col-span-2">
                <RecentRegistrations />
            </div>

            {/* Countdown Timer (60%) */}
            <div className="lg:col-span-3">
                <EventRevenueChart />
            </div>
        </div>
    );
};

export default RecentandOrganizedLayout;
