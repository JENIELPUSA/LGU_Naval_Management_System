import React from "react";
import { FaUser } from "react-icons/fa";

const ProfileAvatar = () => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="rounded-full border-4 border-white bg-blue-100 p-5 shadow-lg dark:border-gray-800 dark:bg-blue-900/50">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white">
          <FaUser className="text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatar;
