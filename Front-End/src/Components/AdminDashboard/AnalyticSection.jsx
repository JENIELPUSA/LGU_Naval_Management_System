// src/components/AnalyticsSection.jsx
import EventRevenueChart from "./EventRevenueChart";
import RecentRegistrations from "./RecentRegistrations";

const AnalyticsSection = ({ theme }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Line Graph - Event Revenue */}
      <EventRevenueChart theme={theme} />

      {/* Enhanced Recent Registrations */}
      <RecentRegistrations />
    </div>
  );
};

export default AnalyticsSection;