import { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ForgotPassword from "../Login/ForgotPassword";
import logo from "@/assets/logo-login.png";
import { Lock, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginStatusModal from "../../ReusableFolder/LogInStatusModal";
import { PersonilContext } from "../../contexts/PersonelContext/PersonelContext";

export default function AuthForm({ isOpen, onClose }) {
    const { bgtheme } = useContext(PersonilContext);
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

    const handleStatusClose = () => {
        setLoginStatus((prev) => ({ ...prev, show: false }));
        if (loginStatus.status === "success") navigate("/dashboard");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Modal Box */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                            onClick={(e) => e.stopPropagation()} 
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
                    >
                        {/* X Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Login Status Modal */}
                        <LoginStatusModal
                            isOpen={loginStatus.show}
                            onClose={handleStatusClose}
                            status={loginStatus.status}
                            customMessage={loginStatus.message}
                        />

                        {/* LOGO */}
                        <div className="mb-6 flex flex-col items-center sm:mb-8">
                            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-blue-100 p-1.5 sm:h-24 sm:w-24 sm:p-2">
                                <img
                                    src={logo}
                                    alt="LGU Naval Logo"
                                    className="h-12 w-12 object-contain sm:h-16 sm:w-16"
                                />
                            </div>
                            <h1 className="text-center text-xl font-bold text-gray-800 sm:text-2xl">
                                LGU Naval EMS
                            </h1>
                            <p className="mt-1 text-center text-sm text-gray-600">
                                Event Management System
                            </p>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleInput}
                                        disabled={isLoading}
                                        placeholder="name@mail.com"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:opacity-70 sm:py-3"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                                        Password
                                    </label>
                                    <a
                                        onClick={() => setForgotPassword(true)}
                                        className="cursor-pointer text-xs font-medium text-gray-500 hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleInput}
                                        disabled={isLoading}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:opacity-70 sm:py-3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-xs text-gray-800 sm:text-sm">
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{ background: bgtheme }}
                                className={`flex w-full items-center justify-center rounded-xl py-2.5 font-medium text-white shadow-lg transition-all sm:py-3.5 ${
                                    isLoading
                                        ? "cursor-not-allowed opacity-70"
                                        : "cursor-pointer hover:shadow-xl active:scale-[0.98]"
                                }`}
                            >
                                {isLoading ? "Signing In..." : "Sign In to Account"}
                            </button>
                        </form>

                        <div className="mt-5 text-center text-xs text-gray-500">
                            For government officials use only. Unauthorized access prohibited.
                        </div>
                    </motion.div>

                    {/* Forgot Password Popup */}
                    <ForgotPassword show={isForgotPassword} onClose={() => setForgotPassword(false)} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
