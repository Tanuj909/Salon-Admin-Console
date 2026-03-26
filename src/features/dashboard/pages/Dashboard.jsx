import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col p-4 sm:p-6">
      <div className="responsive-container">
        {/* Page Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-responsive-h1 font-display text-slate-900 mb-2 italic leading-tight">
            Welcome back, {user?.fullName || user?.role || "User"} 👋
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-light">
            Here's the latest overview of your salon operations.
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 lg:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <svg width="32" height="32" sm:width="40" sm:height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display text-slate-900 mb-4 italic">
            Dashboard Analytics Coming Soon
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            We're currently building a powerful analytics suite to give you real-time insights into your salon network, including revenue tracking and growth metrics.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            {["Performance", "Revenue", "Growth", "Staff Efficiency"].map((tag) => (
              <span key={tag} className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-slate-50 text-slate-600 text-[8px] sm:text-[10px] font-bold tracking-widest uppercase border border-slate-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;