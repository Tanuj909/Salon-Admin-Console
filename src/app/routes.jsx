import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";

// Features
import Login from "@/features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import AdminDashboard from "@/features/dashboard/pages/AdminDashboard";
import SuperAdminDashboard from "@/features/dashboard/pages/SuperAdminDashboard";
import StaffDashboard from "@/features/dashboard/pages/StaffDashboard";
import Analyze from "@/features/dashboard/pages/Analyze";
import ReceptionistDashboard from "@/features/dashboard/pages/ReceptionistDashboard";
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
import StaffBookingManager from "@/features/bookings/pages/StaffBookingManager";
import StaffReviews from "@/features/reviews/pages/StaffReviews";

// Layouts
import DashboardLayout from "@/components/layout/DashboardLayout";

// Components
import ProtectedRoute from "@/components/common/ProtectedRoute";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <AuthLayout>
                  <Login />
                </AuthLayout>
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          {/* Authenticated Routes - All start with /admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/admin/dashboard-redirect" replace />} />
              
              {/* Common Redirect based on role */}
              <Route path="dashboard-redirect" element={<DashboardRedirect />} />

              {/* Super Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
                <Route path="super-admin/dashboard" element={<SuperAdminDashboard />} />
                <Route path="super-admin/analyze" element={<Analyze />} />
                <Route path="super-admin/pending-salons" element={<PendingSalons />} />
                <Route path="super-admin/all-salons" element={<AllSalons />} />
                <Route path="super-admin/verified-salons" element={<VerifiedSalons />} />
                <Route path="super-admin/salons/:id" element={<SalonDetails />} />
                <Route path="super-admin/categories" element={<Categories />} />
                <Route path="super-admin/admins" element={<Admins />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="my-salon" element={<MyAdminSalon />} />
                <Route path="timings" element={<BusinessTimings />} />
                <Route path="services" element={<Services />} />
                <Route path="staff" element={<Staff />} />
                <Route path="reviews" element={<SalonReviews />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="complete-booking" element={<CompleteBooking />} />
              </Route>

              {/* Receptionist Routes */}
              <Route element={<ProtectedRoute allowedRoles={["RECEPTIONIST"]} />}>
                <Route path="receptionist/dashboard" element={<ReceptionistDashboard />} />
                <Route path="receptionist/timings" element={<BusinessTimings />} />
                <Route path="receptionist/reviews" element={<SalonReviews />} />
                <Route path="receptionist/bookings" element={<Bookings />} />
                <Route path="receptionist/complete-booking" element={<CompleteBooking />} />
              </Route>

              {/* Staff Routes */}
              <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
                <Route path="staff/dashboard" element={<StaffDashboard />} />
                <Route path="staff/my-bookings" element={<StaffBookingManager />} />
                <Route path="staff/reviews" element={<StaffReviews />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

// Helper component to redirect users based on their role
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case "SUPER_ADMIN":
      return <Navigate to="/admin/super-admin/dashboard" replace />;
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "RECEPTIONIST":
      return <Navigate to="/admin/receptionist/dashboard" replace />;
    case "STAFF":
      return <Navigate to="/admin/staff/my-bookings" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default AppRoutes;
