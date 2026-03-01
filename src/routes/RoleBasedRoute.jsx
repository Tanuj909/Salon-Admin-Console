import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleBasedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    const isAuthorized = user && allowedRoles.includes(user.role);

    if (!isAuthorized) {
        // Redirtect to appropriate dashboard if role is wrong
        return <Navigate to={user?.role === 'SUPER_ADMIN' ? '/super-admin/dashboard' : '/admin/dashboard'} replace />;
    }

    return <Outlet />;
};

export default RoleBasedRoute;
