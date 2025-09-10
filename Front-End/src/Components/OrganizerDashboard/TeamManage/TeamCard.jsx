import React from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default function TeamCard({
  team,
  removeTeam,
  startEditingTeam,
  editingTeam,
  editTeamName,
  setEditTeamName,
  updateTeam,
  cancelEditing
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 transition-colors duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          {editingTeam === team._id ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editTeamName}
                onChange={(e) => setEditTeamName(e.target.value)}
                className="rounded-lg border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
              <button
                onClick={() =>
                  updateTeam(team._id, {
                    ...team,
                    teamName: editTeamName,
                  })
                }
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{team.teamName || team.teams?.teamName}</h3>
              <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {team.officers ? team.officers.length : 0} members
              </span>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => startEditingTeam(team)}
            className="p-1 text-slate-400 transition-colors duration-200 hover:text-blue-500 dark:hover:text-blue-400"
            title="Edit team"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => removeTeam(team._id)}
            className="p-1 text-slate-400 transition-colors duration-200 hover:text-red-500 dark:hover:text-red-400"
            title="Remove team"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Team Overview using isSummary data */}
      <div className="space-y-3">
        {team.officers && team.officers.length > 0 ? (
          team.officers.map((officer) => (
            <div
              key={officer._id}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-700"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{officer.first_name}</span>
              </div>
              {officer.task && officer.task.length > 0 ? (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tasks:</p>
                  <ul className="pl-2 text-xs text-slate-600 dark:text-slate-300">
                    {officer.task.map((task, index) => (
                      <li
                        key={index}
                        className="truncate"
                      >
                        • {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <span className="text-xs italic text-slate-400 dark:text-slate-500">No tasks assigned</span>
              )}
            </div>
          ))
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">No members assigned</p>
          </div>
        )}
      </div>
    </div>
  );
}