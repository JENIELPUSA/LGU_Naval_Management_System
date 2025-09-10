import React, { useState } from "react";
import { PlusCircleIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import TeamCard from "./TeamCard";

export default function TeamOverview({
  filteredTeams,
  teams,
  newTeamName,
  setNewTeamName,
  addTeam,
  removeTeam,
  startEditingTeam,
  editingTeam,
  editTeamName,
  setEditTeamName,
  updateTeam,
  cancelEditing,
  selectedEvent
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-lg font-semibold text-slate-900 dark:text-slate-100">
            <ClipboardDocumentListIcon className="mr-2 h-5 w-5 text-slate-700 dark:text-slate-400" />
            Team Overview
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {selectedEvent ? `${filteredTeams.length} teams for selected event` : `${teams.length} total teams`}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTeam()}
              placeholder="Enter team name..."
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-green-500"
            />
            <button
              onClick={addTeam}
              className="flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-green-700"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Create</span>
            </button>
          </div>
          {!selectedEvent && <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">Please select an event first</p>}
        </div>

        <div className="max-h-96 space-y-4 overflow-y-auto">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <TeamCard
                key={team._id}
                team={team}
                removeTeam={removeTeam}
                startEditingTeam={startEditingTeam}
                editingTeam={editingTeam}
                editTeamName={editTeamName}
                setEditTeamName={setEditTeamName}
                updateTeam={updateTeam}
                cancelEditing={cancelEditing}
              />
            ))
          ) : (
            <div className="py-8 text-center">
              <ClipboardDocumentListIcon className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 dark:text-slate-400">{selectedEvent ? "No teams for this event" : "No teams created yet"}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {selectedEvent ? "Create your first team above" : "Select an event first"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}