// src/components/DashboardHeader.jsx
import { Calendar } from "lucide-react";
import logo from "../../assets/logo-login.png";

const DashboardHeader = () => {
  return (
    <div className="rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="LGU Logo"
            className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold">LGU NAVAL EVENT MANAGEMENT SYSTEM</h1>
            <p className="mt-1 text-pink-100">Comprehensive platform for managing local government unit events</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-white/20 p-3 backdrop-blur-sm md:mt-0">
          <Calendar size={32} className="text-white" />
          <div>
            <p className="font-semibold">Today's Date</p>
            <p>
              {new Date().toLocaleDateString("en-PH", {
                weekday: "long",
                year: "numeric",
                month: "long",
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