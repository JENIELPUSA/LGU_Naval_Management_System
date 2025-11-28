import { forwardRef, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "@/constants";
import { AuthContext } from "../contexts/AuthContext";
import avatarPlaceholder from "@/assets/profile-image.jpg";
import { NotificationDisplayContext } from "../contexts/NotificationContext/NotificationContext";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import LoadingOverlay from "../ReusableFolder/LoadingOverlay";

export const Sidebar = forwardRef(({ collapsed, bgtheme, FontColor }, ref) => {
    const { last_name, first_name, logout, role } = useContext(AuthContext);
    const { isunread } = useContext(NotificationDisplayContext);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(async () => {
            try {
                await logout();
            } catch (error) {
                console.error(error);
                setIsLoggingOut(false);
            }
        }, 1000);
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
            "/dashboard/participants",
            "/dashboard/settings",
            "/dashboard/lgu-response",
            "/dashboard/Feedback",
        ],
        lgu: ["/",  "/dashboard/events", "/dashboard/notification", "/dashboard/lgu-response", "/dashboard/settings"],
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
            "/dashboard/settings",
            "/dashboard/Feedback",
        ],
    };

    return (
        <>
            {isLoggingOut && <LoadingOverlay />}
            <aside
                ref={ref}
                style={{
                    background: bgtheme,
                    color: FontColor,
                }}
                className={cn(
                    "fixed z-[100] flex h-full flex-col overflow-x-hidden transition-all duration-300 ease-in-out",
                    collapsed ? "w-0 md:w-[70px]" : "w-full md:w-[240px]",
                    collapsed ? "max-md:-left-full" : "max-md:left-0 max-md:w-[220px]",
                )}
            >
                {/* User Info */}
                <div className={cn("flex items-center gap-2 p-2.5", collapsed && "md:justify-center")}>
                    <div className="relative">
                        <img
                            src={avatarPlaceholder}
                            alt="User"
                            className={cn(
                                "rounded-full border-2 border-white object-cover dark:border-slate-800",
                                collapsed ? "h-8 w-8" : "h-9 w-9",
                                "max-md:h-8 max-md:w-8",
                            )}
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-white bg-emerald-500 dark:border-slate-800"></div>
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p
                                className="truncate text-sm font-medium max-md:text-xs"
                                style={{ color: FontColor }}
                            >
                                {user.name}
                            </p>
                            <p
                                className="truncate text-[10px] opacity-80 max-md:text-[9px]"
                                style={{ color: FontColor }}
                            >
                                {user.role}
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar Links */}
                <div className="flex w-full flex-col gap-y-3 overflow-y-auto overflow-x-hidden p-2 [scrollbar-width:thin] max-md:p-1.5">
                    {navbarLinks.map((navbarLink) => {
                        const filteredLinks = navbarLink.links.filter((link) => rolePermissions[role]?.includes(link.path));

                        if (filteredLinks.length === 0) return null;

                        return (
                            <nav
                                key={navbarLink.title}
                                className={cn("sidebar-group", collapsed && "md:items-center")}
                            >
                                <p
                                    className={cn(
                                        "sidebar-group-title px-1 py-1 text-xs font-semibold max-md:text-[10px]",
                                        collapsed && "md:w-[45px]",
                                    )}
                                    style={{ color: FontColor }}
                                >
                                    {navbarLink.title}
                                </p>

                                {filteredLinks.map((link) => (
                                    <NavLink
                                        key={link.label}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            cn(
                                                "sidebar-item flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-white/30 max-md:gap-2 max-md:px-1.5 max-md:py-1 max-md:text-xs",
                                                isActive && "!bg-white/50",
                                                collapsed && "md:w-[45px] md:justify-center md:px-0",
                                            )
                                        }
                                        style={{ color: FontColor }}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <link.icon
                                                size={collapsed ? 18 : 20}
                                                color={FontColor}
                                            />
                                            {link.label === "Notification" && isunread > 0 && collapsed && (
                                                <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-medium text-white shadow-sm">
                                                    {isunread > 9 ? "9+" : isunread}
                                                </span>
                                            )}
                                        </div>
                                        {!collapsed && (
                                            <p
                                                className="flex items-center justify-between whitespace-nowrap"
                                                style={{ color: FontColor }}
                                            >
                                                {link.label}
                                                {link.label === "Notification" && isunread > 0 && (
                                                    <span className="ml-1.5 inline-flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-medium text-white shadow-sm max-md:h-3 max-md:min-w-[16px] max-md:text-[8px]">
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

                {/* Logout */}
                <div className="mt-auto p-2 max-md:p-1.5">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-sm font-medium transition-all duration-200 max-md:py-1 max-md:text-xs",
                            "hover:bg-white/30",
                            collapsed ? "md:w-[45px] md:px-0" : "px-2 max-md:px-1.5",
                            "mx-0.5",
                        )}
                        style={{ color: FontColor }}
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
    bgtheme: PropTypes.string,
    FontColor: PropTypes.string,
};
