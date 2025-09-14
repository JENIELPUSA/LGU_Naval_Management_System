import React, { useContext, useState, useEffect } from "react";
import { PlusCircleIcon, UserPlusIcon, UsersIcon, ClipboardDocumentListIcon, CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";
import { LguDisplayContext } from "../../../contexts/LguContext/LguContext";
import { EventDisplayContext } from "../../../contexts/EventContext/EventContext";
import { TEamContext } from "../../../contexts/TeamContext/TeamContext";
import MemberManagement from "./MemberManagement";
import TeamOverview from "./TeamOverview";
import TeamSummary from "./TeamSummary";

export default function ManageTeam() {
    const { AddTeam, deleteTeam, UpdateTeam } = useContext(TEamContext);
    const { isDropdownEvent } = useContext(EventDisplayContext);
  const {BroadcastEmail,isLgu,UpdatedataAssign, Getsummary, isSummary } = useContext(LguDisplayContext);

    const [teams, setTeams] = useState([]);
    const [members, setMembers] = useState([]);
    const [newTeamName, setNewTeamName] = useState("");
    const [selectedMember, setSelectedMember] = useState("");
    const [showSummaryTable, setShowSummaryTable] = useState(false);
    const [newTaskInputs, setNewTaskInputs] = useState({});
    const [selectedEvent, setSelectedEvent] = useState("");
    const [editingTeam, setEditingTeam] = useState(null);
    const [editTeamName, setEditTeamName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch summary data when an event is selected
    useEffect(() => {
        const fetchSummaryData = async () => {
            if (selectedEvent) {
                setIsLoading(true);
                try {
                    await Getsummary(selectedEvent);
                } catch (error) {
                    console.error("Error fetching summary:", error);
                    alert("Error fetching team data: " + error.message);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchSummaryData();
    }, [selectedEvent, Getsummary]);

    useEffect(() => {
        if (isSummary && Array.isArray(isSummary)) {
            // Filter teams that belong to the selected event
            const validTeams = selectedEvent ? isSummary.filter((team) => team.event && team.event._id === selectedEvent) : isSummary;

            setTeams(validTeams);

            // Extract and set members from all teams
            const allMembers = [];
            validTeams.forEach((team) => {
                if (team.officers && Array.isArray(team.officers)) {
                    team.officers.forEach((officer) => {
                        // Check if officer already exists to avoid duplicates
                        const existingMember = allMembers.find((m) => m._id === officer._id);
                        if (!existingMember) {
                            allMembers.push({
                                _id: officer._id,
                                full_name: `${officer.first_name} ${officer.last_name}`,
                                first_name: officer.first_name,
                                teamIds: [team._id], // Only one team allowed
                                tasks: officer.task || [],
                            });
                        } else {
                            // If member exists, update their team assignment (only one team allowed)
                            existingMember.teamIds = [team._id];
                            // Merge tasks
                            if (officer.task && Array.isArray(officer.task)) {
                                officer.task.forEach((task) => {
                                    if (!existingMember.tasks.includes(task)) {
                                        existingMember.tasks.push(task);
                                    }
                                });
                            }
                        }
                    });
                }
            });
            setMembers(allMembers);
        }
    }, [isSummary, selectedEvent]);

    // Create officer members with their actual data from the database
    const officerMembers = isLgu.map((officer) => ({
        _id: officer._id,
        name: `${officer.first_name} ${officer.last_name}`,
        teamIds: officer.teamId || [],
        tasks: officer.task || [],
    }));

    const sendBroadCast=async(data)=>{
    await BroadcastEmail(data)
    }

      const eventsArray = Array.isArray(isDropdownEvent) ? isDropdownEvent : [isDropdownEvent];

    const events = eventsArray.map((event) => ({
        id: event._id,
        name: event.title,
        date: event.eventDate,
    }));

    const addTeam = async () => {
        if (!selectedEvent) {
            alert("Please select an event first");
            return;
        }

        if (newTeamName.trim() !== "") {
            try {
                await AddTeam({
                    teamName: newTeamName,
                    event_id: selectedEvent,
                });
                setNewTeamName("");
                // Refresh the summary data after adding a team
                await Getsummary(selectedEvent);
            } catch (error) {
                alert("Error creating team: " + error.message);
            }
        }
    };

    const removeTeam = async (teamId) => {
        try {
            await deleteTeam(teamId);
            // Refresh the summary data after deleting a team
            if (selectedEvent) {
                await Getsummary(selectedEvent);
            }
        } catch (error) {
            alert("Error deleting team: " + error.message);
        }
    };

    const updateTeam = async (teamId, updates) => {

        console.log("updates",updates)
        try {
            await UpdateTeam(teamId, updates);
            setEditingTeam(null);
            setEditTeamName("");
            // Refresh the summary data after updating a team
            if (selectedEvent) {
                await Getsummary(selectedEvent);
            }
        } catch (error) {
            alert("Error updating team: " + error.message);
        }
    };

    const updateOfficerData = async (officerId, updates) => {
        try {
            await UpdatedataAssign(officerId, updates);
            // Refresh the summary data after updating an officer
            if (selectedEvent) {
                await Getsummary(selectedEvent);
            }
        } catch (error) {
            console.error("Error updating officer:", error);
            alert("Error updating officer: " + error.message);
        }
    };

    const addMember = () => {
        if (selectedMember) {
            const existingMember = members.find((m) => m._id === selectedMember);
            if (!existingMember) {
                const selectedOfficerMember = officerMembers.find((m) => m._id === selectedMember);
                if (selectedOfficerMember) {
                    setMembers([
                        ...members,
                        {
                            ...selectedOfficerMember,
                            full_name: selectedOfficerMember.name,
                        },
                    ]);
                }
            }
            setSelectedMember("");
        }
    };

    const addTaskToMember = async (memberId) => {
        const taskText = newTaskInputs[memberId] || "";
        if (taskText.trim() === "") return;

        // Update local state
        const updatedMembers = members.map((member) => (member._id === memberId ? { ...member, tasks: [...member.tasks, taskText] } : member));
        setMembers(updatedMembers);

        // Update the officer in the database using UpdateOfficer
        const memberToUpdate = updatedMembers.find((m) => m._id === memberId);
        if (memberToUpdate) {
            await updateOfficerData(memberId, {
                task: memberToUpdate.tasks,
                teamId: memberToUpdate.teamIds,
            });
        }

        setNewTaskInputs({ ...newTaskInputs, [memberId]: "" });
    };

    const removeTaskFromMember = async (memberId, taskIndex) => {
        // Update local state
        const updatedMembers = members.map((member) =>
            member._id === memberId
                ? {
                      ...member,
                      tasks: member.tasks.filter((_, index) => index !== taskIndex),
                  }
                : member,
        );
        setMembers(updatedMembers);

        // Update the officer in the database using UpdateOfficer
        const memberToUpdate = updatedMembers.find((m) => m._id === memberId);
        if (memberToUpdate) {
            await updateOfficerData(memberId, {
                task: memberToUpdate.tasks,
                teamId: memberToUpdate.teamIds,
            });
        }
    };

    const updateNewTaskInput = (memberId, value) => {
        setNewTaskInputs({ ...newTaskInputs, [memberId]: value });
    };

    const assignMemberToTeam = async (memberId, teamId) => {
        // For single team assignment, we only allow one team at a time
        // If teamId is "0", clear all teams
        const updatedTeamIds = teamId === "0" ? [] : [teamId];

        // Update local state
        const updatedMembers = members.map((member) => (member._id === memberId ? { ...member, teamIds: updatedTeamIds } : member));
        setMembers(updatedMembers);

        // Update the officer in the database using UpdateOfficer
        const memberToUpdate = updatedMembers.find((m) => m._id === memberId);
        if (memberToUpdate) {
            await updateOfficerData(memberId, {
                task: memberToUpdate.tasks,
                teamId: memberToUpdate.teamIds,
            });
        }
    };

    const removeMember = async (memberId) => {
        // Remove from local state
        setMembers(members.filter((member) => member._id !== memberId));

        // Clear team assignments in the database using UpdateOfficer
        await updateOfficerData(memberId, {
            teamId: [],
            // Keep existing tasks
        });
    };

    const toggleSummaryTable = () => {
        setShowSummaryTable(!showSummaryTable);
    };

    const startEditingTeam = (team) => {
        console.log("team",team.teamName)
        setEditingTeam(team._id);
        setEditTeamName(team.teamName || team.teams?.teamName || "");
    };

    const cancelEditing = () => {
        setEditingTeam(null);
        setEditTeamName("");
    };

    // Filter teams based on selected event
    const filteredTeams = selectedEvent ? teams.filter((team) => team.event && team.event._id === selectedEvent) : teams;

    const unassignedMembers = members.filter((member) => member.teamIds.length === 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-slate-900 p-2 dark:bg-blue-600">
                                <BuildingOfficeIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Team</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Organize and manage your teams efficiently</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden items-center space-x-6 text-sm text-slate-600 dark:text-slate-400 sm:flex">
                                <div className="flex items-center space-x-2">
                                    <UsersIcon className="h-5 w-5" />
                                    <span>{members.length} Members</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ClipboardDocumentListIcon className="h-5 w-5" />
                                    <span>{teams.length} Teams</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    <span>{events.length} Events</span>
                                </div>
                            </div>
                            <button
                                onClick={toggleSummaryTable}
                                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                <PlusCircleIcon className="h-5 w-5" />
                                <span>Summary</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showSummaryTable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-h-[80vh] w-full max-w-4xl overflow-auto rounded-xl bg-white shadow-lg dark:bg-slate-800">
                        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Teams Summary</h2>
                            <button
                                onClick={toggleSummaryTable}
                                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {teams.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 dark:bg-slate-700">
                                                <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200">Team Name</th>
                                                <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200">Event</th>
                                                <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200">Members</th>
                                                <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-200">Tasks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teams.map((team) => {
                                                const event = events.find((e) => e.id === (team.event ? team.event._id : null));
                                                return (
                                                    <tr
                                                        key={team._id}
                                                        className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
                                                    >
                                                        <td className="p-3 font-medium text-slate-900 dark:text-white">{team.teamName || team.teams?.teamName}</td>
                                                        <td className="p-3 text-slate-700 dark:text-slate-300">{event ? event.name : "N/A"}</td>
                                                        <td className="p-3">
                                                            {team.officers && team.officers.length > 0 ? (
                                                                <ul className="list-inside list-disc text-slate-700 dark:text-slate-300">
                                                                    {team.officers.map((officer) => (
                                                                        <li key={officer._id}>{officer.first_name}</li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <span className="text-slate-400">No members</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            {team.officers && team.officers.length > 0 ? (
                                                                <ul className="list-inside text-slate-700 dark:text-slate-300">
                                                                    {team.officers.map((officer) => (
                                                                        <li
                                                                            key={officer._id}
                                                                            className="truncate"
                                                                        >
                                                                            <span className="font-medium">{officer.first_name}:</span>
                                                                            {officer.task && officer.task.length > 0
                                                                                ? officer.task.join(", ")
                                                                                : "No tasks"}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <span className="text-slate-400">No tasks</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <ClipboardDocumentListIcon className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
                                    <p className="text-slate-500 dark:text-slate-400">No teams created yet</p>
                                    <p className="text-sm text-slate-400 dark:text-slate-500">Create your first team to see it here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-4 flex items-center">
                        <CalendarIcon className="mr-2 h-6 w-6 text-slate-700 dark:text-slate-300" />
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Select Event</h2>
                    </div>
                    <div className="flex space-x-3">
                        <select
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400"
                        >
                            <option value="">Choose an event...</option>
                            {events.map((event) => (
                                <option
                                    key={event.id}
                                    value={event.id}
                                >
                                    {event.name} - {new Date(event.date).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedEvent && (
                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                Selected: <span className="font-medium">{events.find((e) => e.id === selectedEvent)?.name}</span>
                            </p>
                        </div>
                    )}
                    {isLoading && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Loading team data...</p>
                        </div>
                    )}
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center">
                            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                                <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Members</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{members.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center">
                            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Teams</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredTeams.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center">
                            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                <UserPlusIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Assigned Members</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{members.filter((m) => m.teamIds.length > 0).length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                    <MemberManagement
                        members={members}
                        officerMembers={isLgu}
                        filteredTeams={filteredTeams}
                        selectedMember={selectedMember}
                        setSelectedMember={setSelectedMember}
                        addMember={addMember}
                        removeMember={removeMember}
                        newTaskInputs={newTaskInputs}
                        updateNewTaskInput={updateNewTaskInput}
                        addTaskToMember={addTaskToMember}
                        removeTaskFromMember={removeTaskFromMember}
                        assignMemberToTeam={assignMemberToTeam}
                        unassignedMembers={unassignedMembers}
                    />

                    <TeamOverview
                        filteredTeams={filteredTeams}
                        teams={teams}
                        newTeamName={newTeamName}
                        setNewTeamName={setNewTeamName}
                        addTeam={addTeam}
                        removeTeam={removeTeam}
                        startEditingTeam={startEditingTeam}
                        editingTeam={editingTeam}
                        editTeamName={editTeamName}
                        setEditTeamName={setEditTeamName}
                        updateTeam={updateTeam}
                        cancelEditing={cancelEditing}
                        selectedEvent={selectedEvent}
                    />

                    <TeamSummary
                        showSummaryTable={showSummaryTable}
                        toggleSummaryTable={toggleSummaryTable}
                        teams={teams}
                        events={events}
                        sendBroadCast={sendBroadCast}
                    />
                </div>
            </div>
        </div>
    );
}