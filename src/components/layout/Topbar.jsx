import { useAuth } from "@/features/auth/hooks/useAuth";

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
      <h1 className="font-semibold text-lg text-slate-800">Overview</h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600 font-medium">
          ID: {user?.userId || "Guest"}
        </div>
        <button 
          onClick={logout}
          className="px-4 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;