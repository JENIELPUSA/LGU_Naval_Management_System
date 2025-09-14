import React, { useState } from "react";
import { TrashIcon, XMarkIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { PlusCircle } from "lucide-react";

export default function MemberManagement({
    teams,
    members,
    officerMembers,
    filteredTeams,
    selectedMember,
    setSelectedMember,
    addMember,
    removeMember,
    newTaskInputs,
    updateNewTaskInput,
    addTaskToMember,
    removeTaskFromMember,
    assignMemberToTeam,
    unassignedMembers,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-slate-100">
                        <UserPlusIcon className="mr-2 h-5 w-5 text-slate-700 dark:text-slate-400" />
                        Member Management
                    </h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{unassignedMembers.length} available</span>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <div className="flex space-x-3">
                        <select
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-500"
                        >
                            <option value="">Select a member...</option>
                            {officerMembers.map((member) => (
                                <option
                                    key={member._id}
                                    value={member._id}
                                >
                                    {member.first_name} {member.middle_name} {member.last_name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={addMember}
                            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700"
                        >
                            <PlusCircle className="h-5 w-5" />
                            <span className="hidden sm:inline">Add</span>
                        </button>
                    </div>
                </div>

                <div className="max-h-96 space-y-4 overflow-y-auto">
                    {members.length > 0 ? (
                        members.map((member) => (
                            <div
                                key={member._id}
                                className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-700 dark:hover:border-slate-600"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <h3 className="font-medium text-slate-900 dark:text-slate-100">{member.full_name || member.name}</h3>
                                    <button
                                        onClick={() => removeMember(member._id)}
                                        className="p-1 text-slate-400 transition-colors duration-200 hover:text-red-500 dark:hover:text-red-400"
                                        title="Remove member"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={newTaskInputs[member._id] || ""}
                                                onChange={(e) => updateNewTaskInput(member._id, e.target.value)}
                                                placeholder="Add new task..."
                                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500"
                                            />
                                           <button
                                                type="button"
                                                onClick={() => addTaskToMember(member._id)}
                                                className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {member.tasks && member.tasks.length > 0 && (
                                            <div className="rounded border border-slate-200 bg-white p-2 dark:border-slate-600 dark:bg-slate-800">
                                                <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">Tasks:</p>
                                                <ul className="space-y-1">
                                                    {member.tasks.map((task, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300"
                                                        >
                                                            <span>{task}</span>
                                                            <button
                                                                onClick={() => removeTaskFromMember(member._id, index)}
                                                                className="text-red-400 hover:text-red-600 dark:hover:text-red-500"
                                                                title="Remove task"
                                                            >
                                                                <XMarkIcon className="h-4 w-4" />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {filteredTeams.length > 0 && (
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Assign to Team:</label>
                                            <select
                                                value={member.teamId || ""}
                                                onChange={(e) => assignMemberToTeam(member._id, e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-blue-500"
                                            >
                                                <option value="">No team assigned</option>
                                                {filteredTeams.map((team) => (
                                                    <option
                                                        key={team._id}
                                                        value={team._id}
                                                    >
                                                        {team.teamName || team.teams?.teamName}
                                                    </option>
                                                ))}
                                            </select>

                                            {member.teamId && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Assigned to:</p>
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {(() => {
                                                            const team = teams?.find((t) => t._id === member.teamId);
                                                            return team ? (
                                                                <span
                                                                    key={team._id}
                                                                    className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                                >
                                                                    {team.teamName || team.teams?.teamName}
                                                                </span>
                                                            ) : null;
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center">
                            <UsersIcon className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
                            <p className="text-slate-500 dark:text-slate-400">No members available</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500">Add members using the form above</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}