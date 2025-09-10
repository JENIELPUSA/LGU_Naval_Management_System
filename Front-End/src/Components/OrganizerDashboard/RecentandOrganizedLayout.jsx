import RecentRegistrations from "../AdminDashboard/RecentRegistrations";
import EventRevenueChart from "../AdminDashboard/EventRevenueChart"

const RecentandOrganizedLayout = ({ theme }) => {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
                <RecentRegistrations />
            </div>
            <div>
                <EventRevenueChart />
            </div>
        </div>
    );
};

export default RecentandOrganizedLayout;

