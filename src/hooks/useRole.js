import { useAuth } from "./useAuth";
import { ROLES } from "@/utils/constants";

/**
 * Hook for role-based logic and access control
 */
export const useRole = () => {
  const { user, role } = useAuth();

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isAdmin = role === ROLES.ADMIN;
  const isReceptionist = role === ROLES.RECEPTIONIST;
  const isStaff = role === ROLES.STAFF;

  const hasRole = (allowedRoles) => {
    if (!allowedRoles) return true;
    return allowedRoles.includes(role);
  };

  return {
    user,
    role,
    isSuperAdmin,
    isAdmin,
    isReceptionist,
    isStaff,
    hasRole
  };
};

export default useRole;
