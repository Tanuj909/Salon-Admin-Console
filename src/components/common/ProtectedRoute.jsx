import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />; // Or an unauthorized page
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;