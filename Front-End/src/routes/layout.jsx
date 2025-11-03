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

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="box-border flex min-h-screen bg-slate-100 dark:bg-slate-950">
            {/* Overlay */}
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
                )}
            />

            <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
                bgtheme={bgtheme}
                FontColor={FontColor}
            />

            <div className={cn("flex-1 transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    bgtheme={bgtheme}
                    FontColor={FontColor}
                />

                {/* Content */}
                <div className="box-border max-h-[calc(100vh-60px)] overflow-y-auto p-2 sm:p-4">
                    <div className="text-xs sm:text-sm">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
