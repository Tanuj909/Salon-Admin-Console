import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Pages
import Login from '../pages/auth/Login';

// Super Admin Pages
import SuperAdminDashboard from '../pages/superadmin/SuperAdminDashboard';
import PendingSalons from '../pages/superadmin/PendingSalons';
import VerifiedSalons from '../pages/superadmin/VerifiedSalons';
import AllSalons from '../pages/superadmin/AllSalons';
import Admins from '../pages/superadmin/Admins';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminStaff from '../pages/admin/AdminStaff';
import AdminServices from '../pages/admin/AdminServices';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminReviews from '../pages/admin/AdminReviews';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>

                    {/* Super Admin Routes */}
                    <Route element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN']} />}>
                        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
                        <Route path="/super-admin/pending" element={<PendingSalons />} />
                        <Route path="/super-admin/verified" element={<VerifiedSalons />} />
                        <Route path="/super-admin/all-salons" element={<AllSalons />} />
                        <Route path="/super-admin/admins" element={<Admins />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/bookings" element={<AdminBookings />} />
                        <Route path="/admin/staff" element={<AdminStaff />} />
                        <Route path="/admin/services" element={<AdminServices />} />
                        <Route path="/admin/categories" element={<AdminCategories />} />
                        <Route path="/admin/reviews" element={<AdminReviews />} />
                    </Route>

                </Route>
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
