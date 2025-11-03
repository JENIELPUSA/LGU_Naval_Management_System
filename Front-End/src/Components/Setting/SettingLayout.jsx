import React, { useState, useEffect, useContext } from "react";
import DarkModeToggle from "./DarkModeToggle";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import PersonelComponent from "./Honorable/Honorable";
import { PersonilContext } from "../../contexts/PersonelContext/PersonelContext";
import AddContactForm from "./AddContactForm";
import { ContactContext } from "../../contexts/ContactContext/ContactInfoContext";

const AccountSettings = () => {
    const { AddContact } = useContext(ContactContext);
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { AddPersonel, isPersonel, UpdatePersonel, FetchPersonel, totalPages, currentPage, setCurrentPage, DeletePersonel } =
        useContext(PersonilContext);
    const [fullName, setFullName] = useState("Juan Dela Cruz");
    const [middleName, setMiddleName] = useState("M.");
    const [department, setDepartment] = useState("Office of the Mayor");
    const [position, setPosition] = useState("Mayor");
    const [email, setEmail] = useState("juan.delacruz@example.com");

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Check system preference on mount
    useEffect(() => {
        const isDarkMode =
            localStorage.getItem("darkMode") === "true" ||
            (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches);

        setDarkMode(isDarkMode);
        if (isDarkMode) document.documentElement.classList.add("dark");
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem("darkMode", newDarkMode.toString());
        if (newDarkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        alert(`Profile Updated!\nFull Name: ${fullName}\nDepartment: ${department}`);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("❌ New passwords do not match!");
            return;
        }
        alert("✅ Password Updated!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-700">
             {/*  <DarkModeToggle
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
            />
            <ProfileAvatar />
            */}
            <h3 className="mb-6 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">Account Settings</h3>
            <div className="space-y-6">
                {/* <ProfileForm
                    fullName={fullName}
                    setFullName={setFullName}
                    middleName={middleName}
                    setMiddleName={setMiddleName}
                    department={department}
                    setDepartment={setDepartment}
                    position={position}
                    email={email}
                    handleSubmit={handleProfileSubmit}
                />
                <PasswordForm
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    currentPassword={currentPassword}
                    setCurrentPassword={setCurrentPassword}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    handleSubmit={handlePasswordSubmit}
                />*/}
                <AddContactForm AddContact={AddContact} />
                <PersonelComponent
                    AddPersonel={AddPersonel}
                    isPersonel={isPersonel}
                    UpdatePersonel={UpdatePersonel}
                    FetchPersonel={FetchPersonel}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    DeletePersonel={DeletePersonel}
                />
            </div>
        </div>
    );
};

export default AccountSettings;
