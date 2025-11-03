import React from "react";
import { FaLock, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordForm = ({ showPassword, setShowPassword, currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, handleSubmit }) => {
  const passwordInput = (label, value, onChange) => (
    <div className="mb-5">
      <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <FaLock className="text-gray-400" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <h4 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-white">
        <FaLock className="mr-2 text-blue-500" /> Password Settings
      </h4>

      {passwordInput("Current Password", currentPassword, (e) => setCurrentPassword(e.target.value))}
      {passwordInput("New Password", newPassword, (e) => setNewPassword(e.target.value))}
      {passwordInput("Confirm New Password", confirmPassword, (e) => setConfirmPassword(e.target.value))}

      <button
        type="submit"
        className="mt-2 flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition duration-200 hover:bg-blue-700"
      >
        <FaKey className="mr-2" /> Change Password
      </button>
    </form>
  );
};

export default PasswordForm;
