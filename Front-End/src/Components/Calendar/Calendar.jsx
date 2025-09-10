import React, { useState, useContext } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  MoreHorizontal,
  Plus,
  User,
  List,
  Grid
} from 'lucide-react';
import { EventDisplayContext } from '../../contexts/EventContext/EventContext';
import { LguResponseContext } from '../../contexts/LGUResponseContext/LGUResponseContext';

const EventCalendarSchedule = () => {
  const { isEvent } = useContext(EventDisplayContext);
  const { isLguResponse } = useContext(LguResponseContext);

  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('schedule'); // 'schedule' or 'day'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

  const convertTo24Hour = (time12h) => {
    if (!time12h) return '00:00';
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}`;
  };

  console.log("isLguResponse",isLguResponse)

  const getEventsForDate = (date) => {
    if (!Array.isArray(isLguResponse)) return [];

    const dateStr = date.toISOString().split('T')[0];

    return isLguResponse
      .filter((event) => {
        const eventDate = event?.EventInfo?.eventDate;
        if (!eventDate) return false;
        const eventDateStr = new Date(eventDate).toISOString().split('T')[0];
        return eventDateStr === dateStr;
      })
      .sort((a, b) => {
        const timeA = convertTo24Hour(a?.EventInfo?.startTime);
        const timeB = convertTo24Hour(b?.EventInfo?.startTime);
        return timeA.localeCompare(timeB);
      });
  };

  const getAllEvents = () => {
    if (!Array.isArray(isLguResponse)) return [];
    
    return isLguResponse
      .filter(event => {
        if (filter === 'all') return true;
        
        const eventDate = new Date(event?.EventInfo?.eventDate || event?.eventDate);
        const now = new Date();
        
        if (filter === 'upcoming') return eventDate >= now;
        if (filter === 'past') return eventDate < now;
        
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a?.EventInfo?.eventDate || a?.eventDate);
        const dateB = new Date(b?.EventInfo?.eventDate || b?.eventDate);
        return dateA - dateB;
      });
  };

  const getEventTitle = (event) =>
    event?.proposalInfo?.title || event?.title || 'Untitled Event';

  const getEventDescription = (event) =>
    event?.proposalInfo?.description ||
    event?.description ||
    'No description available';

  const getEventOrganizer = (event) => {
    const org = event?.organizer;
    if (org && Object.keys(org).length > 0) {
      return `${org.first_name || ''} ${org.middle_name || ''} ${
        org.last_name || ''
      }`.trim();
    }
    return 'Unknown Organizer';
  };

  const getEventVenue = (event) =>
    event?.venue || event?.EventInfo?.venue || 'Location not specified';

  const getEventTime = (event) =>
    event?.EventInfo?.startTime || event?.startTime || 'Time not specified';

  const getEventDate = (event) =>
    event?.EventInfo?.eventDate || event?.eventDate;

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'schedule') {
      // For schedule view, navigate by month
      newDate.setMonth(currentDate.getMonth() + direction);
    } else {
      // For day view, navigate by day
      newDate.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const isToday = (date) => date.toDateString() === new Date().toDateString();

  // Event colors
  const eventColors = [
    'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-700',
    'bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-700',
    'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-700',
    'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700',
    'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-700',
  ];
  const getEventColor = (index) => eventColors[index % eventColors.length];

  // Group events by date for schedule view
  const groupEventsByDate = () => {
    const events = getAllEvents();
    const grouped = {};
    
    events.forEach(event => {
      const eventDate = new Date(getEventDate(event));
      const dateStr = eventDate.toDateString();
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = {
          date: eventDate,
          events: []
        };
      }
      
      grouped[dateStr].events.push(event);
    });
    
    return Object.values(grouped);
  };

  const groupedEvents = groupEventsByDate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Event Schedule
              </h1>
              <p className="text-gray-600 mt-1 text-sm dark:text-gray-400">
                Manage and view all scheduled events
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              Today
            </button>

            <div className="flex items-center">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 dark:hover:bg-gray-700"
              >
                <ChevronLeft
                  size={20}
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>

              <h2 className="text-xl font-semibold text-gray-900 min-w-[220px] text-center mx-2 dark:text-gray-100">
                {viewMode === 'schedule' 
                  ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : `${dayNames[currentDate.getDay()]}, ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`
                }
              </h2>

              <button
                onClick={() => navigateDate(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 dark:hover:bg-gray-700"
              >
                <ChevronRight
                  size={20}
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1 dark:bg-gray-700">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-3 py-1 text-sm rounded-md ${filter === 'upcoming' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-3 py-1 text-sm rounded-md ${filter === 'past' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Past
              </button>
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1 dark:bg-gray-700">
              <button
                onClick={() => setViewMode('schedule')}
                className={`p-2 rounded-md ${viewMode === 'schedule' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`p-2 rounded-md ${viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Schedule View */}
        {viewMode === 'schedule' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {groupedEvents.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {groupedEvents.map((group, index) => (
                  <div key={index} className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
                      {group.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </h3>
                    
                    <div className="space-y-4">
                      {group.events.map((event, eventIndex) => (
                        <div
                          key={event._id || eventIndex}
                          className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getEventColor(eventIndex)}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {getEventTitle(event)}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                                {getEventDescription(event)}
                              </p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                          
                          <div className="flex items-center mt-4 text-sm text-gray-600 space-x-4 dark:text-gray-400">
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              <span>{getEventTime(event)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              <span>{getEventVenue(event)}</span>
                            </div>
                            <div className="flex items-center">
                              <User size={14} className="mr-1" />
                              <span>{getEventOrganizer(event)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
                  <Calendar size={48} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No events found
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {filter === 'all' 
                    ? 'No events are scheduled.' 
                    : `No ${filter} events found.`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Day View */}
        {viewMode === 'day' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
            </div>
            
            {getEventsForDate(currentDate).length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {getEventsForDate(currentDate).map((event, eventIndex) => (
                  <div
                    key={event._id || eventIndex}
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors dark:hover:bg-gray-700/30"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {getEventTitle(event)}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                          {getEventDescription(event)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {getEventTime(event)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {getEventVenue(event)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 text-sm text-gray-600 space-x-4 dark:text-gray-400">
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        <span>{getEventOrganizer(event)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
                  <Calendar size={48} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No events scheduled
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  There are no events scheduled for this day.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {getEventTitle(selectedEvent)}
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 dark:bg-blue-950">
                    <Calendar
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Date
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(
                        selectedEvent?.EventInfo?.eventDate ||
                          selectedEvent?.eventDate
                      ).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 dark:bg-blue-950">
                    <Clock
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Time
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {getEventTime(selectedEvent)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 dark:bg-blue-950">
                    <MapPin
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {getEventVenue(selectedEvent)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 dark:bg-blue-950">
                    <User
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Organizer
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {getEventOrganizer(selectedEvent)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 dark:bg-blue-950">
                    <Users
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Resources
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedEvent?.resources?.length || 0} assigned
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
                    Description
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {getEventDescription(selectedEvent)}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3 dark:bg-gray-900">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendarSchedule;