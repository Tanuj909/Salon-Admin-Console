import React from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Base layout for the entire application
 * Handles global styles and providers
 */
const MainLayout = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans antialiased text-slate-900 bg-slate-50">
      {children}
    </div>
  );
};

export default MainLayout;
