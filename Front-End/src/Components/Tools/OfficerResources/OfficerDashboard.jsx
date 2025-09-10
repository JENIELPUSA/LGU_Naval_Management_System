import React, { useState } from 'react';
import {
  LayoutGrid, Calendar, ClipboardList, UserCheck, Package,
  Bell, FileText, UserCircle, LogOut, Menu, X, LoaderCircle,
  CheckCircle, Clock, MapPin, User
} from 'lucide-react';

// Main App component
const App = () => {
    // State to manage which dashboard section is visible
    const [currentSection, setCurrentSection] = useState('dashboard');
    // State for mobile sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // State to manage the task filter
    const [activeTaskFilter, setActiveTaskFilter] = useState('ongoing');

    // --- Mock Data ---
    // This data simulates what would come from a backend API or database.
    const mockData = {
        events: [
            {
                title: 'Grand Opening ng Bagong Cafe',
                date: 'Nobyembre 15, 2025',
                time: '9:00 AM - 5:00 PM',
                venue: 'Event Hall A',
                organizer: 'Maria Santos (0917-123-4567)'
            },
            {
                title: 'Annual Company Meeting',
                date: 'Disyembre 2, 2025',
                time: '1:00 PM - 4:00 PM',
                venue: 'Conference Room 3',
                organizer: 'Organizing Committee'
            },
            {
                title: 'Christmas Party para sa mga Bata',
                date: 'Disyembre 20, 2025',
                time: '10:00 AM - 1:00 PM',
                venue: 'Open Grounds',
                organizer: 'Mr. Reyes (0999-987-6543)'
            }
        ],
        tasks: [
            {
                id: 1,
                title: 'Ayusin ang upuan sa Event Hall A',
                status: 'ongoing'
            },
            {
                id: 2,
                title: 'Subukan ang sound system',
                status: 'ongoing'
            },
            {
                id: 3,
                title: 'Suriin ang mga inumin',
                status: 'ongoing'
            },
            {
                id: 4,
                title: 'Suriin ang listahan ng mga dadalo',
                status: 'completed'
            },
            {
                id: 5,
                title: 'I-setup ang registration booth',
                status: 'completed'
            }
        ],
        announcements: [
            {
                title: 'Mahalagang Pagbabago: Bagong Venue!',
                date: '10:30 AM, Nobyembre 10, 2025',
                message: 'Ang Grand Opening ng Bagong Cafe ay inilipat sa Event Hall A dahil sa inaasahang dami ng tao.'
            }
        ]
    };

    // Handler function to change the active section
    const handleSectionChange = (section) => {
        setCurrentSection(section);
        // Close sidebar on mobile after selection
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    // Handler function to change the task filter
    const handleTaskFilter = (filter) => {
        setActiveTaskFilter(filter);
    };

    // Component to render Assigned Events section
    const AssignedEvents = () => (
        <section id="assigned-events">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">My Assigned Events</h2>
            <div id="events-list" className="space-y-4">
                {mockData.events.map((event, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                        <div className="mt-4 space-y-2 text-gray-600">
                            <p className="flex items-center space-x-2"><Calendar className="text-lg text-indigo-500" /><span>{event.date}</span></p>
                            <p className="flex items-center space-x-2"><Clock className="text-lg text-indigo-500" /><span>{event.time}</span></p>
                            <p className="flex items-center space-x-2"><MapPin className="text-lg text-indigo-500" /><span>{event.venue}</span></p>
                            <p className="flex items-center space-x-2"><User className="text-lg text-indigo-500" /><span>{event.organizer}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

    // Component to render Task Management section
    const TaskManagement = () => (
        <section id="tasks">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Task Management</h2>
            <div className="bg-white rounded-2xl shadow-md border border-gray-200">
                <div className="flex p-4 border-b border-gray-200">
                    <button
                        className={`task-filter-btn px-4 py-2 rounded-full font-medium transition-colors duration-200 ${activeTaskFilter === 'ongoing' ? 'text-gray-700 bg-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => handleTaskFilter('ongoing')}
                    >
                        Ongoing Tasks
                    </button>
                    <button
                        className={`task-filter-btn px-4 py-2 rounded-full font-medium transition-colors duration-200 ml-2 ${activeTaskFilter === 'completed' ? 'text-gray-700 bg-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => handleTaskFilter('completed')}
                    >
                        Completed Tasks
                    </button>
                </div>
                <div id="tasks-list" className="p-4 space-y-4">
                    {mockData.tasks
                        .filter(task => task.status === activeTaskFilter)
                        .map(task => (
                            <div key={task.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex items-center space-x-3">
                                    {task.status === 'completed' ? (
                                        <CheckCircle className="text-green-500 text-xl" />
                                    ) : (
                                        <LoaderCircle className="animate-spin text-yellow-500 text-xl" />
                                    )}
                                    <span className="font-medium text-gray-800">{task.title}</span>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {task.status === 'completed' ? 'Natapos' : 'Ongoing'}
                                </span>
                            </div>
                        ))}
                    {mockData.tasks.filter(task => task.status === activeTaskFilter).length === 0 && (
                        <p className="text-center text-gray-500">Walang mga gawain sa ilalim ng status na ito.</p>
                    )}
                </div>
            </div>
        </section>
    );

    // Component to render Attendance & Registration section
    const Attendance = () => (
        <section id="attendance">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Attendance & Registration</h2>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <p className="text-gray-600 mb-4">Ito ay isang sample na pahina. Ang tunay na Check-in/Check-out system ay mangangailangan ng backend integration.</p>
                <div className="flex space-x-4">
                    <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors duration-200">
                        Check-in
                    </button>
                    <button className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors duration-200">
                        Check-out
                    </button>
                </div>
            </div>
        </section>
    );

    // Component to render Resource Monitoring section
    const Resources = () => (
        <section id="resources">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Resource Monitoring</h2>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Equipment Assigned</h3>
                <ul className="list-disc pl-5 text-gray-600">
                    <li>Laptop (Serial No: XYZ123)</li>
                    <li>Microphone (Serial No: ABC456)</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Venue Support</h3>
                <p className="text-gray-600">Assigned sa Hall B: Pagsasaayos ng upuan at sound system.</p>
            </div>
        </section>
    );

    // Component to render Announcements section
    const Announcements = () => (
        <section id="announcements">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Announcements</h2>
            <div id="announcements-list" className="space-y-4">
                {mockData.announcements.map((announcement, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-bold mb-2 text-red-600">{announcement.title}</h3>
                        <p className="text-gray-500 text-sm mb-4">{announcement.date}</p>
                        <p className="text-gray-700">{announcement.message}</p>
                    </div>
                ))}
            </div>
        </section>
    );
    
    // Component to render Reports / Feedback section
    const Reports = () => (
        <section id="reports">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Reports / Feedback</h2>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Incident Report Form</h3>
                <form>
                    <div className="mb-4">
                        <label htmlFor="incident-title" className="block text-gray-700 font-medium mb-1">Paksa</label>
                        <input type="text" id="incident-title" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="incident-details" className="block text-gray-700 font-medium mb-1">Mga Detalye</label>
                        <textarea id="incident-details" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors duration-200">Isumite ang Report</button>
                </form>
            </div>
        </section>
    );

    // Component to render Profile & Settings section
    const Profile = () => (
        <section id="profile">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">My Profile</h2>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Staff Details</h3>
                <div className="space-y-2 text-gray-600">
                    <p><strong>Pangalan:</strong> Juan Dela Cruz</p>
                    <p><strong>Email:</strong> juan.dcruz@example.com</p>
                    <p><strong>Role:</strong> Event Staff</p>
                </div>
            </div>
        </section>
    );

    // The main render logic for the entire dashboard
    const renderSection = () => {
        switch (currentSection) {
            case 'dashboard':
                return (
                    <>
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">Assigned Events</h3>
                                <p className="text-4xl font-bold text-indigo-600">{mockData.events.length}</p>
                                <p className="text-gray-500">Upcoming events</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">Ongoing Tasks</h3>
                                <p className="text-4xl font-bold text-yellow-500">{mockData.tasks.filter(t => t.status === 'ongoing').length}</p>
                                <p className="text-gray-500">Tasks to complete</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">New Announcements</h3>
                                <p className="text-4xl font-bold text-red-500">{mockData.announcements.length}</p>
                                <p className="text-gray-500">Unread notifications</p>
                            </div>
                        </div>
                    </>
                );
            case 'assigned-events':
                return <AssignedEvents />;
            case 'tasks':
                return <TaskManagement />;
            case 'attendance':
                return <Attendance />;
            case 'resources':
                return <Resources />;
            case 'announcements':
                return <Announcements />;
            case 'reports':
                return <Reports />;
            case 'profile':
                return <Profile />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen font-sans bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <aside className={`w-64 bg-gray-900 text-gray-100 p-6 flex flex-col transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 shadow-lg`}>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-white">Staff Portal</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-white md:hidden focus:outline-none">
                        <X />
                    </button>
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        <li>
                            <a href="#" onClick={() => handleSectionChange('dashboard')} className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 ${currentSection === 'dashboard' ? 'bg-gray-700' : ''}`}>
                                <LayoutGrid className="text-lg" />
                                <span className="font-medium">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleSectionChange('assigned-events')} className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 ${currentSection === 'assigned-events' ? 'bg-gray-700' : ''}`}>
                                <Calendar className="text-lg" />
                                <span className="font-medium">Assigned Events</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleSectionChange('tasks')} className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 ${currentSection === 'tasks' ? 'bg-gray-700' : ''}`}>
                                <ClipboardList className="text-lg" />
                                <span className="font-medium">Task Management</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleSectionChange('attendance')} className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 ${currentSection === 'attendance' ? 'bg-gray-700' : ''}`}>
                                <UserCheck className="text-lg" />
                                <span className="font-medium">Attendance & Registration</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleSectionChange('resources')} className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 ${currentSection === 'resources' ? 'bg-gray-700' : ''}`}>
                                <Package className="text-lg" />
                                <span className="font-medium">Resource Monitoring</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleSectionChange('announcements')} className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 ${currentSection === 'announcements' ? 'bg-gray-700' : ''}`}>
                                <Bell className="text-lg" />
                                <span className="font-medium">Announcements</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleSectionChange('reports')} className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 ${currentSection === 'reports' ? 'bg-gray-700' : ''}`}>
                                <FileText className="text-lg" />
                                <span className="font-medium">Reports / Feedback</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="mt-8 pt-4 border-t border-gray-700">
                    <a href="#" onClick={() => handleSectionChange('profile')} className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 ${currentSection === 'profile' ? 'bg-gray-700' : ''}`}>
                        <UserCircle className="text-lg" />
                        <span className="font-medium">My Profile</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200">
                        <LogOut className="text-lg" />
                        <span className="font-medium">Logout</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 transition-all duration-300">
                <header className="flex items-center justify-between mb-8 md:hidden">
                    <h2 className="text-3xl font-semibold text-gray-900">Dashboard</h2>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-900 focus:outline-none text-2xl">
                        <Menu />
                    </button>
                </header>
                {renderSection()}
            </main>
        </div>
    );
};

export default App;
