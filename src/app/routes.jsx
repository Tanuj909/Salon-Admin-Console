import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PendingSalons from "@/features/salons/pages/PendingSalons";
import AllSalons from "@/features/salons/pages/AllSalons";
import VerifiedSalons from "@/features/salons/pages/VerifiedSalons";
import SalonDetails from "@/features/salons/pages/SalonDetails";
import Categories from "@/features/categories/pages/Categories";
import MyAdminSalon from "@/features/salons/pages/MyAdminSalon";
import BusinessTimings from "@/features/salons/pages/BusinessTimings";
import Services from "@/features/services/pages/Services";
import Staff from "@/features/staff/pages/Staff";
import Admins from "@/features/users/pages/Admins";
import SalonReviews from "@/features/reviews/pages/SalonReviews";
import Bookings from "@/features/bookings/pages/Bookings";
import CompleteBooking from "@/features/bookings/pages/CompleteBooking";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        {/* Global Authenticated Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* Super Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
              <Route path="/super-admin/dashboard" element={<Dashboard />} />
              <Route path="/super-admin/pending-salons" element={<PendingSalons />} />
              <Route path="/super-admin/all-salons" element={<AllSalons />} />
              <Route path="/super-admin/verified-salons" element={<VerifiedSalons />} />
              <Route path="/super-admin/salons/:id" element={<SalonDetails />} />
              <Route path="/super-admin/categories" element={<Categories />} />
              <Route path="/super-admin/admins" element={<Admins />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/my-salon" element={<MyAdminSalon />} />
              <Route path="/admin/timings" element={<BusinessTimings />} />
              <Route path="/admin/services" element={<Services />} />
              <Route path="/admin/staff" element={<Staff />} />
              <Route path="/admin/reviews" element={<SalonReviews />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/complete-booking" element={<CompleteBooking />} />
            </Route>

            {/* Receptionist Routes */}
            <Route element={<ProtectedRoute allowedRoles={["RECEPTIONIST"]} />}>
              <Route path="/receptionist/dashboard" element={<Dashboard />} />
              <Route path="/receptionist/timings" element={<BusinessTimings />} />
              <Route path="/receptionist/reviews" element={<SalonReviews />} />
              <Route path="/receptionist/bookings" element={<Bookings />} />
              <Route path="/receptionist/complete-booking" element={<CompleteBooking />} />
            </Route>

          </Route>
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
