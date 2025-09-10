import React, { useState } from "react";
import { 
  XMarkIcon, 
  ClipboardDocumentListIcon, 
  MegaphoneIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

export default function TeamSummary({ showSummaryTable, toggleSummaryTable, teams, sendBroadCast, events }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         team.teams?.teamName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === "all" || 
                        (team.event ? team.event._id === selectedEvent : false);
    return matchesSearch && matchesEvent;
  });
  
  const sortedTeams = React.useMemo(() => {
    if (!sortConfig.key) return filteredTeams;
    
    return [...filteredTeams].sort((a, b) => {
      let valueA, valueB;
      
      if (sortConfig.key === 'teamName') {
        valueA = a.teamName || a.teams?.teamName || '';
        valueB = b.teamName || b.teams?.teamName || '';
      } else if (sortConfig.key === 'event') {
        const eventA = events.find(e => e.id === (a.event ? a.event._id : null));
        const eventB = events.find(e => e.id === (b.event ? b.event._id : null));
        valueA = eventA ? eventA.name : 'N/A';
        valueB = eventB ? eventB.name : 'N/A';
      } else if (sortConfig.key === 'members') {
        valueA = a.officers ? a.officers.length : 0;
        valueB = b.officers ? b.officers.length : 0;
      }
      
      if (valueA < valueB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTeams, sortConfig, events]);
  
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <ChevronUpDownIcon 
        className={`h-4 w-4 ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} 
      />
    );
  };

  return (
    <>
      {showSummaryTable && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-xl bg-white shadow-2xl dark:bg-slate-900 dark:shadow-none">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Teams Summary</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {sortedTeams.length} of {teams.length} teams
                </p>
              </div>
              <button
                onClick={toggleSummaryTable}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close summary table"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Filters and Search */}
            <div className="flex flex-col gap-4 p-6 border-b border-slate-200 dark:border-slate-700 sm:flex-row">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search teams..."
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full sm:w-48">
                <select
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  <option value="all">All Events</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="p-6">
              {sortedTeams.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800">
                        <th 
                          className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => handleSort('teamName')}
                        >
                          <div className="flex items-center gap-1">
                            Team Name
                            {getSortIndicator('teamName')}
                          </div>
                        </th>
                        <th 
                          className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => handleSort('event')}
                        >
                          <div className="flex items-center gap-1">
                            Event
                            {getSortIndicator('event')}
                          </div>
                        </th>
                        <th 
                          className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => handleSort('members')}
                        >
                          <div className="flex items-center gap-1">
                            Members
                            {getSortIndicator('members')}
                          </div>
                        </th>
                        <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200">Tasks</th>
                        <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTeams.map((team) => {
                        const event = events.find((e) => e.id === (team.event ? team.event._id : null));
                        return (
                          <tr
                            key={team._id}
                            className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors duration-150"
                          >
                            <td className="p-3 font-medium text-slate-900 dark:text-white">
                              {team.teamName || team.teams?.teamName}
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {event ? event.name : "N/A"}
                              </span>
                            </td>
                            <td className="p-3">
                              {team.officers && team.officers.length > 0 ? (
                                <div className="flex -space-x-2">
                                  {team.officers.slice(0, 4).map((officer) => (
                                    <div 
                                      key={officer._id} 
                                      className="relative inline-block h-8 w-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 text-xs flex items-center justify-center text-slate-600 dark:text-slate-300"
                                      title={`${officer.first_name} ${officer.last_name}`}
                                    >
                                      {officer.first_name.charAt(0)}{officer.last_name.charAt(0)}
                                    </div>
                                  ))}
                                  {team.officers.length > 4 && (
                                    <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                      +{team.officers.length - 4}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-slate-400 dark:text-slate-500">No members</span>
                              )}
                            </td>
                            <td className="p-3">
                              {team.officers && team.officers.length > 0 ? (
                                <div className="space-y-2">
                                  {team.officers.map((officer) => (
                                    <div key={officer._id} className="text-sm">
                                      <div className="font-medium text-slate-900 dark:text-slate-200">
                                        {officer.first_name}:
                                      </div>
                                      {officer.task && officer.task.length > 0 ? (
                                        <ul className="mt-1 space-y-1">
                                          {officer.task.map((task, index) => (
                                            <li key={index} className="flex items-start">
                                              <span className="text-slate-400 dark:text-slate-500 mr-2">•</span>
                                              <span className="text-slate-600 dark:text-slate-400 text-sm">{task}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <span className="text-slate-400 dark:text-slate-500 text-sm">No tasks</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500">No tasks</span>
                              )}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => sendBroadCast(team._id)}
                                disabled={!team.officers || team.officers.length === 0}
                                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
                              >
                                <MegaphoneIcon className="mr-1.5 h-4 w-4" />
                                Broadcast
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <ClipboardDocumentListIcon className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {teams.length > 0 ? "No teams match your filters" : "No teams created yet"}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    {teams.length > 0 ? "Try adjusting your search or filter" : "Create your first team to see it here"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}