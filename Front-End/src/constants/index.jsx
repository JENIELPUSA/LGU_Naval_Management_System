import { CalendarDays, Home, FileText, Package, CalendarCheck, Settings, Wrench, UserCheck, UserPlus, Users, Bell } from "lucide-react";

import ProfileImage from "@/assets/profile-image.jpg";
import ProductImage from "@/assets/product-image.jpg";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/",
            },
        ],
    },
    {
        title: "Notification",
        links: [
            {
                label: "Notification",
                icon: Bell,
                path: "/dashboard/notification",
            },
        ],
    },
    {
        title: "Event Schedule",
        links: [
            {
                label: "Schedule",
                icon: CalendarDays,
                path: "/dashboard/Calendar",
            },
        ],
    },
    {
        title: "Manage User",
        links: [
            {
                label: "Admin",
                icon: UserPlus,
                path: "/dashboard/admin",
            },
            {
                label: "Organizer",
                icon: UserPlus,
                path: "/dashboard/organizer",
            },
            {
                label: "LGU",
                icon: UserPlus,
                path: "/dashboard/lgu",
            },
        ],
    },

    {
        title: "Managemet",
        links: [
            {
                label: "Proposals",
                icon: FileText,
                path: "/dashboard/proposal",
            },
            {
                label: "Participants",
                icon: UserPlus,
                path: "/dashboard/participants",
            },
            {
                label: "Events",
                icon: CalendarCheck,
                path: "/dashboard/events",
            },
            {
                label: "Reports",
                icon: UserCheck,
                path: "/dashboard/reports",
            },
            {
                label: "Resources",
                icon: Wrench,
                path: "/dashboard/resources",
            },
            {
                label: "Manage Team",
                icon: Users,
                path: "/dashboard/manage-team",
            },
            {
                label: "LGU Response",
                icon: UserCheck,
                path: "/dashboard/lgu-response",
            },
        ],
    },

    {
        title: "Settings",
        links: [
            {
                label: "Settings",
                icon: Settings,
                path: "/dashboard/settings",
            },
        ],
    },
];
