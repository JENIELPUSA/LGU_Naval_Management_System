import StatCard from "./StatCard";
import { Calendar, DollarSign, Package, Users } from "lucide-react";
import { EventDisplayContext } from "../../contexts/EventContext/EventContext";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";
import { OfficerDisplayContext } from "../../contexts/OfficerContext/OfficerContext";
import { useContext } from "react";
import { AdminDisplayContext } from "../../contexts/AdminContext/AdminContext";
import { LguDisplayContext } from "../../contexts/LguContext/LguContext";

const StatCardGrid = () => {
  const{isTotalOfficer}=useContext(OfficerDisplayContext)
  const { isTotalEvent, isTotalUpcomingEvent } = useContext(EventDisplayContext);
  const { isTotalParticipant } = useContext(ParticipantDisplayContext);
  const {isTotalAdmin}=useContext(AdminDisplayContext)
  const {isTotalLgu}=useContext(LguDisplayContext)

  const TotalAccount=isTotalOfficer + isTotalAdmin + isTotalLgu;

  const statsData = [
    {
      icon: <Calendar size={26} />,
      title: "Total Events",
      value: isTotalEvent,
      description: "All events created",
      gradient: "from-pink-500 to-blue-500",
    },
    {
      icon: <Users size={26} />,
      title: "Participants",
      value: isTotalParticipant,
      description: "Total attendees registered",
      gradient: "from-pink-500 via-purple-500 to-blue-500",
    },
    {
      icon: <DollarSign size={26} />,
      title: "Total User Accounts",
      value: TotalAccount, // convert to number para maisama sa progress calc
      description: "Total accounts generated",
      gradient: "from-blue-500 to-pink-500",
    },
    {
      icon: <Package size={26} />,
      title: "Upcoming Events",
      value: isTotalUpcomingEvent,
      description: "Scheduled for next 30 days",
      gradient: "from-pink-500 to-blue-400",
    },
  ];

  const maxValue = Math.max(...statsData.map((stat) => Number(stat.value) || 0));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          progress={
            maxValue > 0 ? Math.round((Number(stat.value) / maxValue) * 100) : 0
          }
        />
      ))}
    </div>
  );
};

export default StatCardGrid;
