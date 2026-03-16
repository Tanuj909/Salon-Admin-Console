import React from "react";

/**
 * Layout for authentication-related pages
 * Standardized to use the gold/beige theme
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F8F4EE]">
      {children}
    </div>
  );
};

export default AuthLayout;
