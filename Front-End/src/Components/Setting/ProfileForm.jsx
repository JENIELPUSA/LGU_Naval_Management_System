import React from "react";
import { FaUser, FaEnvelope, FaBriefcase } from "react-icons/fa";

const ProfileForm = ({ fullName, setFullName, middleName, setMiddleName, department, setDepartment, position, email, handleSubmit }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <h4 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-white">
        <FaUser className="mr-2 text-blue-500" /> Profile Information
      </h4>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Full Name */}
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            />
          </div>
        </div>

        {/* Middle Name */}
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Middle Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            />
          </div>
        </div>

        {/* Department */}
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Department
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaBriefcase className="text-gray-400" />
            </div>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
            />
          </div>
        </div>

        {/* Position */}
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Position
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaBriefcase className="text-gray-400" />
            </div>
            <input
              type="text"
              value={position}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2.5 pl-10 pr-4 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative col-span-full">
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="text"
              value={email}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2.5 pl-10 pr-4 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition duration-200 hover:bg-blue-700"
      >
        <FaUser className="mr-2" /> Update Profile
      </button>
    </form>
  );
};

export default ProfileForm;
