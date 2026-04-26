import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setMobileOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex w-full h-screen overflow-hidden bg-beige">
            {/* Dynamic Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Right Side - Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 w-full h-full overflow-hidden transition-all duration-300 ease-in-out ${!isMobile ? (collapsed ? 'ml-20' : 'ml-64') : 'ml-0'}`}>
                {/* Topbar */}
                <Topbar onMenuClick={() => setMobileOpen(true)} isMobile={isMobile} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#FDFBF7]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;