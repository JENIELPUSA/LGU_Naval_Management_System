import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ForgotPassword from "../Login/ForgotPassword";
import logo from "@/assets/logo-login.png";
import { Lock, Mail, X } from "lucide-react";
import { motion } from "framer-motion";
import LoginStatusModal from "../../ReusableFolder/LogInStatusModal";

export default function AuthFormModal({ isOpen, onClose }) {
    const [isForgotPassword, setForgotPassword] = useState(false);
    const [loginStatus, setLoginStatus] = useState({
        show: false,
        status: "success",
        message: "",
    });
    const [values, setValues] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleInput = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await login(values.email, values.password);
        setIsLoading(false);
        setLoginStatus({
            show: true,
            status: response.success ? "success" : "error",
            message: response.success ? "Login successful!" : response.message || "Login failed",
        });
    };

    const handleModalClose = () => {
        setLoginStatus((prev) => ({ ...prev, show: false }));
        if (loginStatus.status === "success") navigate("/dashboard");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <LoginStatusModal
                isOpen={loginStatus.show}
                onClose={handleModalClose}
                status={loginStatus.status}
                customMessage={loginStatus.message}
            />

            <motion.div
                className="relative w-full max-w-md p-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                <div className="relative rounded-3xl bg-white p-8 shadow-xl">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-200"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>

                    {/* Logo & Header */}
                    <div className="mb-8 flex flex-col items-center">
                        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 p-2 shadow-inner">
                            <img
                                src={logo}
                                alt="LGU Naval Logo"
                                className="h-16 w-16 object-contain"
                            />
                        </div>
                        <h1 className="text-center text-2xl font-bold text-gray-800">LGU Naval EMS</h1>
                        <p className="mt-1 text-center text-gray-600">Event Management System</p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleLoginSubmit}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleInput}
                                    disabled={isLoading}
                                    placeholder="name@mail.com"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:opacity-70"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <a
                                    onClick={() => setForgotPassword(true)}
                                    className="cursor-pointer text-xs font-medium text-pink-600 hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleInput}
                                    disabled={isLoading}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:opacity-70"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-800"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex w-full items-center justify-center rounded-xl py-3.5 font-medium text-white shadow-lg transition-all ${
                                isLoading
                                    ? "cursor-not-allowed bg-gradient-to-r from-pink-400 to-blue-400"
                                    : "bg-gradient-to-r from-pink-500 to-blue-600 hover:from-pink-600 hover:to-blue-700 active:scale-[0.98]"
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="mr-2 h-5 w-5 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Signing In...
                                </>
                            ) : (
                                "Sign In to Account"
                            )}
                        </button>
                    </form>
                    <div className="mt-6 text-center text-xs text-gray-500">For government officials use only. Unauthorized access prohibited.</div>
                </div>
            </motion.div>

            <ForgotPassword
                show={isForgotPassword}
                onClose={() => setForgotPassword(false)}
            />
        </div>
    );
}
