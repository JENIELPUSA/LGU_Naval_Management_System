import React, { useState, useEffect, useContext } from "react";
import PersonelComponent from "./Honorable/Honorable";
import { PersonilContext } from "../../contexts/PersonelContext/PersonelContext";
import AddContactForm from "./AddContactForm";
import { ContactContext } from "../../contexts/ContactContext/ContactInfoContext";
import AccountSetting from "../../Components/Setting/AccountSettings";
import { AuthContext } from "../../contexts/AuthContext";

const AccountSettings = () => {
    const { AddContact } = useContext(ContactContext);
    const { role } = useContext(AuthContext); // Get role from context
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { bgtheme, FontColor, AddPersonel, isPersonel, UpdatePersonel, FetchPersonel, totalPages, currentPage, setCurrentPage, DeletePersonel } =
        useContext(PersonilContext);

    // Check system preference on mount
    useEffect(() => {
        const isDarkMode =
            localStorage.getItem("darkMode") === "true" ||
            (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches);

        setDarkMode(isDarkMode);
        if (isDarkMode) document.documentElement.classList.add("dark");
    }, []);

    return (
        <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="mb-6 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">Settings</h3>

            <div className="space-y-6">
                {/* Always show account setting */}
                <AccountSetting
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    bgtheme={bgtheme}
                    FontColor={FontColor}
                />

                {/* Show only if user is admin */}
                {role === "admin" && (
                    <>
                        <AddContactForm
                            AddContact={AddContact}
                            bgtheme={bgtheme}
                            FontColor={FontColor}
                        />
                        <PersonelComponent
                            AddPersonel={AddPersonel}
                            isPersonel={isPersonel}
                            UpdatePersonel={UpdatePersonel}
                            FetchPersonel={FetchPersonel}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            DeletePersonel={DeletePersonel}
                            bgtheme={bgtheme}
                            FontColor={FontColor}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;
