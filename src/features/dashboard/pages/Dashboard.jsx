import { useAuth } from "@/features/auth/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const roleDisplay = user?.role === "SUPER_ADMIN" ? "Superadmin" : "Admin";

  return (
    <div className="w-full font-jost min-h-[calc(100vh-80px)] flex flex-col">
      <div className="mx-auto px-6 lg:px-10 pb-12 pt-4 bg-transparent max-w-[1600px] flex-1 flex flex-col">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-black-deep mb-2 italic">
            Welcome, {user?.role || "User"} 👋
          </h1>
          <p className="text-secondary text-lg font-light italic">
            Here's what's happening on your platform today.
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
          <div className="w-24 h-24 rounded-3xl bg-gold/10 flex items-center justify-center text-gold mx-auto mb-8 border border-gold/20 shadow-sm">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-display text-black-deep italic mb-4">
            Dashboard Coming Soon!
          </h2>
          <p className="text-secondary text-base max-w-md mx-auto leading-relaxed">
            We're currently building a powerful analytics suite to give you real-time insights into your salon network.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 rounded-full bg-gold/5 text-gold text-xs font-bold tracking-widest uppercase border border-gold/10">Performance</span>
            <span className="px-4 py-2 rounded-full bg-gold/5 text-gold text-xs font-bold tracking-widest uppercase border border-gold/10">Revenue</span>
            <span className="px-4 py-2 rounded-full bg-gold/5 text-gold text-xs font-bold tracking-widest uppercase border border-gold/10">Growth</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;