import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import Topbar from "./Topbar";

const SuperAdminLayout = () => {
  return (
    <div className="flex h-screen">
      
      {/* Super Admin Sidebar */}
      <SuperAdminSidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <div className="flex-1 p-6 bg-slate-50 overflow-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default SuperAdminLayout;
