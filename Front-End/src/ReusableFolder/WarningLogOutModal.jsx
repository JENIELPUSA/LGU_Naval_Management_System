import React, { useEffect } from "react";
import { XCircle, LogOut, AlertTriangle } from "lucide-react";

const WarningLogoutModal = ({ isOpen, onClose, onLogout }) => {
    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Close modal when clicking outside
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300"
            onClick={handleBackdropClick}
        >
            <div className="w-11/12 max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 dark:bg-gray-800/95 dark:backdrop-blur-lg">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
                    <div className="flex items-center justify-center rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                        <AlertTriangle 
                            size={24}
                            className="text-red-600 dark:text-red-400"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Action Required</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Session interruption detected</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                        <XCircle size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="py-6">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center rounded-full bg-amber-100 p-2 dark:bg-amber-900/20">
                            <XCircle 
                                size={20}
                                className="text-amber-600 dark:text-amber-400"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Complete Your Action
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                You need to log out from your current dashboard session to proceed with this action. 
                                Any unsaved changes will be lost.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-white transition-all hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 animate-pulse"
                    >
                        <LogOut size={18} />
                        Log Out Now
                    </button>
                </div>

                {/* Warning Note */}
                <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                    <p className="text-xs text-amber-800 dark:text-amber-200 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Please click <span className="font-semibold underline">Log Out</span> to apply the changes. 
                        Unsaved changes will be lost if you leave without logging out.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WarningLogoutModal;
