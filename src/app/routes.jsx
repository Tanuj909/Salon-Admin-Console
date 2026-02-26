import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import PendingSalons from "@/features/salons/pages/PendingSalons";
import AllSalons from "@/features/salons/pages/AllSalons";
import VerifiedSalons from "@/features/salons/pages/VerifiedSalons";
import SalonDetails from "@/features/salons/pages/SalonDetails";
import Categories from "@/features/categories/pages/Categories";
import MyAdminSalon from "@/features/salons/pages/MyAdminSalon";
import Services from "@/features/services/pages/Services";
import Staff from "@/features/staff/pages/Staff";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />

        {/* Super Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/super-admin/dashboard" element={<Dashboard />} />
            <Route path="/super-admin/pending-salons" element={<PendingSalons />} />
            <Route path="/super-admin/all-salons" element={<AllSalons />} />
            <Route path="/super-admin/verified-salons" element={<VerifiedSalons />} />
            <Route path="/super-admin/salons/:id" element={<SalonDetails />} />
            <Route path="/super-admin/categories" element={<Categories />} />
            {/* Add more super admin routes here */}
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/my-salon" element={<MyAdminSalon />} />
            <Route path="/admin/services" element={<Services />} />
            <Route path="/admin/staff" element={<Staff />} />
            {/* Add more admin routes here */}
          </Route>
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
