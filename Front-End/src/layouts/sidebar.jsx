import { forwardRef, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "@/constants";
import { AuthContext } from "../contexts/AuthContext";
import avatarPlaceholder from "@/assets/profile-image.jpg";
import { NotificationDisplayContext } from "../contexts/NotificationContext/NotificationContext";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import LoadingOverlay from "../ReusableFolder/LoadingOverlay";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { last_name, first_name, logout, role } = useContext(AuthContext);
    const { isunread } = useContext(NotificationDisplayContext);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true); // show overlay immediately
        setTimeout(async () => {
            try {
                await logout(); // call the original logout after delay
            } catch (error) {
                console.error(error);
                setIsLoggingOut(false); // hide overlay if logout fails
            }
        }, 1000); // 1000ms = 1 second delay
    };

    const roleLabel = role === "admin" ? "Administrator" : role === "organizer" ? "Organizer" : role === "lgu" ? "LGU" : role;

    const user = {
        name: `${first_name} ${last_name}`,
        role: roleLabel,
    };

    const rolePermissions = {
        organizer: [
            "/",
            "/dashboard/proposal",
            "/dashboard/events",
            "/dashboard/resources",
            "/dashboard/notification",
            "/dashboard/manage-team",
            "/dashboard/officer",
            "/dashboard/Calendar",
            "/dashboard/participants",
        ],
        lgu: ["/", "/dashboard/Calendar", "/dashboard/notification", "/dashboard/lgu-response"],
        admin: [
            "/",
            "/dashboard/proposal",
            "/dashboard/events",
            "/dashboard/resources",
            "/dashboard/reports",
            "/dashboard/notification",
            "/dashboard/admin",
            "/dashboard/officer",
            "/dashboard/organizer",
            "/dashboard/lgu",
            "/dashboard/lgu-response",
            "/dashboard/participants",
        ],
    };

    return (
        <>
            {isLoggingOut && <LoadingOverlay />} {/* overlay */}
            <aside
                ref={ref}
                className={cn(
                    "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 [background:linear-gradient(180deg,#FF9EED_0%,#89C6F9_100%)] [transition:width_300ms_cubic-bezier(0.4,0,0.2,1),left_300ms_cubic-bezier(0.4,0,0.2,1)] dark:border-slate-700 dark:[background:linear-gradient(180deg,#C00070_0%,#0040A0_100%)]",
                    collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                    collapsed ? "max-md:-left-full" : "max-md:left-0",
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-3 border-y border-blue-200/50 p-3 dark:border-blue-800/50",
                        collapsed && "md:justify-center",
                    )}
                >
                    <div className="relative">
                        <img
                            src={avatarPlaceholder}
                            alt="User"
                            className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-slate-800"
                        />
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800"></div>
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="truncate font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
                            <p className="truncate text-xs text-slate-600 dark:text-slate-300">{user.role}</p>
                        </div>
                    )}
                </div>

                <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                    {navbarLinks.map((navbarLink) => {
                        const filteredLinks = navbarLink.links.filter((link) => rolePermissions[role]?.includes(link.path));

                        if (filteredLinks.length === 0) return null;

                        return (
                            <nav
                                key={navbarLink.title}
                                className={cn("sidebar-group", collapsed && "md:items-center")}
                            >
                                <p className={cn("sidebar-group-title text-slate-800 dark:text-slate-100", collapsed && "md:w-[45px]")}>
                                    {navbarLink.title}
                                </p>
                                {filteredLinks.map((link) => (
                                    <NavLink
                                        key={link.label}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            cn(
                                                "sidebar-item text-slate-700 hover:bg-white/30 dark:text-slate-200 dark:hover:bg-black/30",
                                                isActive && "!bg-white/50 dark:!bg-black/50",
                                                collapsed && "md:w-[45px]",
                                            )
                                        }
                                    >
                                        <div className="relative flex-shrink-0">
                                            <link.icon size={22} />
                                            {link.label === "Notification" && isunread > 0 && collapsed && (
                                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white shadow-sm">
                                                    {isunread > 9 ? "9+" : isunread}
                                                </span>
                                            )}
                                        </div>
                                        {!collapsed && (
                                            <p className="flex items-center justify-between whitespace-nowrap">
                                                {link.label}
                                                {link.label === "Notification" && isunread > 0 && (
                                                    <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white shadow-sm transition-all duration-200">
                                                        {isunread > 99 ? "99+" : isunread}
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </NavLink>
                                ))}
                            </nav>
                        );
                    })}
                </div>

                <div className="mt-auto border-t border-blue-200 p-4 dark:border-blue-800">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex w-full items-center gap-2 rounded-lg py-2",
                            "text-sm font-medium transition-all duration-200",
                            "text-blue-800 hover:bg-blue-100 dark:text-blue-200 dark:hover:bg-blue-800/30",
                            collapsed ? "md:w-[45px] md:justify-center md:px-0 md:py-3" : "px-3",
                            "mx-1",
                        )}
                    >
                        {!collapsed && <p className="whitespace-nowrap">Logout</p>}
                    </button>
                </div>
            </aside>
        </>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
