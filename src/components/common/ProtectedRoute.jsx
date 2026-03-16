import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Component to protect routes based on authentication and roles
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, isLoading } = useAuth();

  // Wait for session restoration
  if (isLoading) {
    return null; // MainLayout handles global loading spinner
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to a default page for their role if they try to access unauthorized pages
    return <Navigate to="/dashboard-redirect" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;