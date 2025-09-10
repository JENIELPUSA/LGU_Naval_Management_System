import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, Users, FileText, Settings, LogOut, Search, Bell, PlusCircle, TrendingUp, ClipboardList, BarChart, ChevronDown, MapPin, Clock, Eye, Edit } from 'lucide-react';

// Main App component
export default function App() {
  // Use useState to manage dashboard data
  const [metrics, setMetrics] = useState({
    totalEvents: 7,
    totalAttendees: 1530,
    activeEvents: 3,
    pendingRegistrations: 45
  });

  const [events, setEvents] = useState([
    { name: "LGU Health and Wellness Caravan", date: "September 15, 2025", location: "Town Plaza", attendees: 500, status: "Active", priority: "High" },
    { name: "Youth Leadership Summit", date: "October 20, 2025", location: "LGU Convention Center", attendees: 320, status: "Active", priority: "Medium" },
    { name: "Clean-up Drive: River Ecosystem", date: "November 5, 2025", location: "Pasig River", attendees: 150, status: "Active", priority: "High" },
    { name: "Tree Planting Initiative", date: "December 1, 2025", location: "Watershed Area", attendees: 200, status: "Scheduled", priority: "Medium" },
    { name: "Paskuhan sa Bayan", date: "December 20, 2025", location: "LGU Park", attendees: 360, status: "Scheduled", priority: "Low" }
  ]);

  const [activities, setActivities] = useState([
    { action: "John added 'Tree Planting Initiative'.", time: "2 hours ago", type: "create" },
    { action: "Maria Gomez registered for 'Youth Leadership Summit'.", time: "4 hours ago", type: "registration" },
    { action: "Status of 'LGU Health and Wellness Caravan' was updated.", time: "6 hours ago", type: "update" },
    { action: "The attendee list was downloaded.", time: "1 day ago", type: "download" }
  ]);

  // Use useEffect to handle initial data loading or fetching
  useEffect(() => {
    // In a real application, you would fetch data here from an API.
    // For this example, we'll just log to the console.
    console.log("Dashboard component has mounted and data is ready.");
  }, []); // The empty dependency array ensures this runs only once

  const getActivityIcon = (type) => {
    switch(type) {
      case 'create': return <PlusCircle className="w-4 h-4 text-green-500" />;
      case 'registration': return <Users className="w-4 h-4 text-blue-500" />;
      case 'update': return <Edit className="w-4 h-4 text-orange-500" />;
      case 'download': return <BarChart className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* Enhanced Dashboard Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col justify-between shadow-xl">
        <div className="p-6">
          {/* Enhanced Sidebar Header */}
          <div className="flex items-center space-x-3 mb-8 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">LGU</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">LGU Events</h1>
              <p className="text-indigo-100 text-xs">Management System</p>
            </div>
          </div>

          {/* Enhanced Sidebar Navigation */}
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg transform transition-all duration-200 hover:shadow-xl">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-4 rounded-xl hover:bg-slate-100 transition-all duration-200 text-slate-700 hover:text-slate-900 group">
              <CalendarDays className="w-5 h-5 group-hover:text-indigo-500 transition-colors" />
              <span>Events</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-4 rounded-xl hover:bg-slate-100 transition-all duration-200 text-slate-700 hover:text-slate-900 group">
              <Users className="w-5 h-5 group-hover:text-indigo-500 transition-colors" />
              <span>Attendees</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-4 rounded-xl hover:bg-slate-100 transition-all duration-200 text-slate-700 hover:text-slate-900 group">
              <FileText className="w-5 h-5 group-hover:text-indigo-500 transition-colors" />
              <span>Reports</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-4 rounded-xl hover:bg-slate-100 transition-all duration-200 text-slate-700 hover:text-slate-900 group">
              <Settings className="w-5 h-5 group-hover:text-indigo-500 transition-colors" />
              <span>Settings</span>
            </a>
          </nav>
        </div>

        {/* Enhanced Sidebar Footer */}
        <div className="p-6 border-t border-slate-200/50">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 rounded-xl">
            <img src="https://placehold.co/40x40/6366f1/ffffff?text=A" alt="Admin" className="w-10 h-10 rounded-lg border-2 border-indigo-400" />
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">Admin User</p>
              <p className="text-slate-500 text-xs">admin@lgu.gov.ph</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 group">
            <LogOut className="w-5 h-5 group-hover:text-red-700 transition-colors" />
            <span className="font-medium">Log Out</span>
          </a>
        </div>
      </aside>

      {/* Enhanced Main Dashboard Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Enhanced Main Content Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">Dashboard</h2>
            <p className="text-lg text-slate-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Welcome back, Organizer!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input type="text" placeholder="Search events..." className="pl-12 pr-6 py-3 w-80 rounded-2xl border-0 bg-white/70 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:shadow-xl transition-all duration-300 text-slate-700 placeholder-slate-400" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
            <button className="p-3 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 group relative">
              <Bell className="w-6 h-6 text-slate-600 group-hover:text-indigo-500 transition-colors" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Enhanced Key Metrics */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Enhanced Card 1: Number of Events */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <CalendarDays className="w-8 h-8 text-blue-100" />
                  <span className="text-2xl font-bold opacity-70">📅</span>
                </div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Events</p>
                <p className="text-3xl font-bold">{metrics.totalEvents}</p>
                <div className="flex items-center mt-2 text-blue-100 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+2 this month</span>
                </div>
              </div>
            </div>

            {/* Enhanced Card 2: Total Attendees */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-green-100" />
                  <span className="text-2xl font-bold opacity-70">👥</span>
                </div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Attendees</p>
                <p className="text-3xl font-bold">{metrics.totalAttendees.toLocaleString()}</p>
                <div className="flex items-center mt-2 text-green-100 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+12% vs last month</span>
                </div>
              </div>
            </div>

            {/* Enhanced Card 3: Active Events */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-100" />
                  <span className="text-2xl font-bold opacity-70">⚡</span>
                </div>
                <p className="text-orange-100 text-sm font-medium mb-1">Active Events</p>
                <p className="text-3xl font-bold">{metrics.activeEvents}</p>
                <div className="flex items-center mt-2 text-orange-100 text-xs">
                  <span className="w-2 h-2 bg-orange-200 rounded-full mr-2"></span>
                  <span>Live now</span>
                </div>
              </div>
            </div>

            {/* Enhanced Card 4: Pending Registrations */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <ClipboardList className="w-8 h-8 text-purple-100" />
                  <span className="text-2xl font-bold opacity-70">📋</span>
                </div>
                <p className="text-purple-100 text-sm font-medium mb-1">Pending Registrations</p>
                <p className="text-3xl font-bold">{metrics.pendingRegistrations}</p>
                <div className="flex items-center mt-2 text-purple-100 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Needs attention</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Quick Actions */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <PlusCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-2">Add New Event</h4>
                <p className="text-slate-600 text-sm">Create and schedule a new event</p>
              </div>
            </button>
            <button className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-2">Manage Attendees</h4>
                <p className="text-slate-600 text-sm">View and manage event participants</p>
              </div>
            </button>
            <button className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-2">View Reports</h4>
                <p className="text-slate-600 text-sm">Generate detailed analytics</p>
              </div>
            </button>
          </div>
        </section>

        {/* Enhanced Active Events */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></span>
              Active Events
            </h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors">
              <Eye className="w-4 h-4" />
              <span>View All</span>
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-slate-700">Event Details</th>
                    <th className="py-4 px-6 text-left font-semibold text-slate-700 hidden lg:table-cell">Date & Location</th>
                    <th className="py-4 px-6 text-left font-semibold text-slate-700 hidden md:table-cell">Attendees</th>
                    <th className="py-4 px-6 text-left font-semibold text-slate-700">Status</th>
                    <th className="py-4 px-6 text-left font-semibold text-slate-700">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length > 0 ? (
                    events.map((event, index) => {
                      const statusColor = event.status === 'Active' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-blue-100 text-blue-700 border-blue-200';
                      return (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200">
                          <td className="py-6 px-6">
                            <div>
                              <h4 className="font-semibold text-slate-800 text-lg mb-1">{event.name}</h4>
                              <div className="lg:hidden">
                                <p className="text-slate-600 text-sm flex items-center mb-1">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {event.date}
                                </p>
                                <p className="text-slate-600 text-sm flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {event.location}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6 hidden lg:table-cell">
                            <div>
                              <p className="text-slate-800 font-medium flex items-center mb-1">
                                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                {event.date}
                              </p>
                              <p className="text-slate-600 flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                {event.location}
                              </p>
                            </div>
                          </td>
                          <td className="py-6 px-6 hidden md:table-cell">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                                <Users className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{event.attendees}</p>
                                <p className="text-slate-500 text-sm">registered</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6">
                            <span className={`inline-flex items-center px-3 py-2 text-xs font-semibold rounded-full border ${statusColor}`}>
                              <span className={`w-2 h-2 rounded-full mr-2 ${event.status === 'Active' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                              {event.status}
                            </span>
                          </td>
                          <td className="py-6 px-6">
                            <span className={`inline-flex items-center px-3 py-2 text-xs font-semibold rounded-full border ${getPriorityColor(event.priority)}`}>
                              {event.priority}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center">
                          <CalendarDays className="w-12 h-12 text-slate-300 mb-4" />
                          <p className="text-lg">No active events at the moment.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Enhanced Recent Activities */}
        <section>
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></span>
            Recent Activities
          </h3>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors duration-200 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 group-hover:shadow-md transition-shadow">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">{activity.action}</p>
                    <p className="text-slate-500 text-sm flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-300 transition-colors">
                      <Eye className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}