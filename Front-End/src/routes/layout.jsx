import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState, useContext } from "react";
import { PersonilContext } from "../contexts/PersonelContext/PersonelContext";

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);
    const { bgtheme, FontColor } = useContext(PersonilContext);

    // Adjust sidebar state on screen resize
    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    // Close sidebar on outside click (mobile only)
    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="box-border flex min-h-screen bg-slate-100 dark:bg-slate-950">
            {/* Mobile overlay (when sidebar is open) */}
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity duration-300",
                    !collapsed && "max-md:pointer-events-auto max-md:z-40 max-md:opacity-30"
                )}
            />

            {/* Sidebar */}
            <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
                bgtheme={bgtheme}
                FontColor={FontColor}
            />

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex flex-1 flex-col transition-[margin] duration-300 ease-in-out",
                    collapsed ? "md:ml-[70px]" : "md:ml-[240px]"
                )}
            >
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    bgtheme={bgtheme}
                    FontColor={FontColor}
                />

                {/* Scrollable Content */}
                <main className="box-border flex-1 overflow-y-auto bg-slate-100 p-2 dark:bg-slate-950 sm:p-4">
                    <div className="mx-auto w-full max-w-[1400px]">
                        <div className="text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;