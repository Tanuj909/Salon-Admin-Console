import { useAuth } from "@/features/auth/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <div className="page active">
      <div className="admin-page-header mb-12">
        <h1 className="text-4xl md:text-5xl font-display text-black-deep mb-2 italic">Good morning, {user?.name || "Admin"} 👋</h1>
        <p className="text-secondary text-lg font-light italic">Here's what's happening on your platform today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card bg-cream border border-gold/5 rounded-3xl p-8 shadow-sm flex items-start gap-6 hover:shadow-luxe transition-all group">
          <div className="stat-icon w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black-deep transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
          </div>
          <div className="stat-body">
            <div className="stat-number text-3xl font-display text-black-deep">1,284</div>
            <div className="stat-label text-xs uppercase tracking-widest text-secondary font-bold mt-1">Total Salons</div>
            <div className="stat-change text-[10px] text-gold font-bold mt-2 italic">↑ 8.4% this month</div>
          </div>
        </div>
        <div className="stat-card bg-cream border border-gold/5 rounded-3xl p-8 shadow-sm flex items-start gap-6 hover:shadow-luxe transition-all group">
          <div className="stat-icon w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black-deep transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
          </div>
          <div className="stat-body">
            <div className="stat-number text-3xl font-display text-black-deep">12</div>
            <div className="stat-label text-xs uppercase tracking-widest text-secondary font-bold mt-1">Pending Salons</div>
            <div className="stat-change text-[10px] text-gold font-bold mt-2 italic">↑ 3 new today</div>
          </div>
        </div>
        <div className="stat-card bg-cream border border-gold/5 rounded-3xl p-8 shadow-sm flex items-start gap-6 hover:shadow-luxe transition-all group">
          <div className="stat-icon w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black-deep transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" /></svg>
          </div>
          <div className="stat-body">
            <div className="stat-number text-3xl font-display text-black-deep">1,247</div>
            <div className="stat-label text-xs uppercase tracking-widest text-secondary font-bold mt-1">Verified Salons</div>
            <div className="stat-change text-[10px] text-gold font-bold mt-2 italic">↑ 5.2% this month</div>
          </div>
        </div>
        <div className="stat-card bg-cream border border-gold/5 rounded-3xl p-8 shadow-sm flex items-start gap-6 hover:shadow-luxe transition-all group">
          <div className="stat-icon w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black-deep transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div className="stat-body">
            <div className="stat-number text-3xl font-display text-black-deep">34</div>
            <div className="stat-label text-xs uppercase tracking-widest text-secondary font-bold mt-1">Total Admins</div>
            <div className="stat-change text-[10px] text-gold font-bold mt-2 italic">↑ 2 new this week</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12 text-left">
        <div className="admin-card bg-cream border border-gold/5 rounded-[40px] overflow-hidden shadow-sm">
          <div className="admin-card-header px-10 py-8 border-b border-gold/10 flex justify-between items-center bg-cream/50 backdrop-blur-md">
            <div>
              <div className="text-3xl font-display text-black-deep italic">Recent Pending Salons</div>
              <div className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-1">Awaiting review & approval</div>
            </div>
            <button className="px-6 py-2 rounded-full border border-gold/20 text-gold text-[10px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black-deep transition-all cursor-pointer bg-transparent">View All</button>
          </div>
          <div className="admin-card-body table-wrap p-0">
            <table className="admin-table w-full border-collapse">
              <thead><tr className="bg-beige/50">
                <th className="px-10 py-4 text-left text-[10px] uppercase tracking-widest text-secondary font-bold border-b border-gold/5">Salon Name</th>
                <th className="px-10 py-4 text-left text-[10px] uppercase tracking-widest text-secondary font-bold border-b border-gold/5">Owner</th>
                <th className="px-10 py-4 text-left text-[10px] uppercase tracking-widest text-secondary font-bold border-b border-gold/5">City</th>
                <th className="px-10 py-4 text-left text-[10px] uppercase tracking-widest text-secondary font-bold border-b border-gold/5">Submitted</th>
                <th className="px-10 py-4 text-left text-[10px] uppercase tracking-widest text-secondary font-bold border-b border-gold/5">Actions</th>
              </tr></thead>
              <tbody>
                <tr className="border-b border-gold/5 hover:bg-beige/30 transition-all"><td className="px-10 py-6"><strong className="font-display text-lg text-black-deep">Luxe & Co Salon</strong></td><td className="px-10 py-6 text-secondary text-sm">Aisha Noor</td><td className="px-10 py-6 text-secondary text-sm font-light italic">Dubai</td><td className="px-10 py-6 text-secondary text-sm">Feb 26, 2026</td><td className="px-10 py-6"><div className="flex gap-2"><button className="px-4 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black-deep transition-all bg-transparent border-0 cursor-pointer">Approve</button><button className="px-4 py-1 rounded-full border border-gold/20 text-secondary text-[10px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black-deep transition-all bg-transparent cursor-pointer">View</button></div></td></tr>
                <tr className="border-b border-gold/5 hover:bg-beige/30 transition-all"><td className="px-10 py-6"><strong className="font-display text-lg text-black-deep">The Mane Studio</strong></td><td className="px-10 py-6 text-secondary text-sm">Rahul Kapoor</td><td className="px-10 py-6 text-secondary text-sm font-light italic">Mumbai</td><td className="px-10 py-6 text-secondary text-sm">Feb 25, 2026</td><td className="px-10 py-6"><div className="flex gap-2"><button className="px-4 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black-deep transition-all bg-transparent border-0 cursor-pointer">Approve</button><button className="px-4 py-1 rounded-full border border-gold/20 text-secondary text-[10px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black-deep transition-all bg-transparent cursor-pointer">View</button></div></td></tr>
                <tr className="border-b border-gold/5 hover:bg-beige/30 transition-all"><td className="px-10 py-6"><strong className="font-display text-lg text-black-deep">Bliss Beauty Bar</strong></td><td className="px-10 py-6 text-secondary text-sm">Sara Ahmed</td><td className="px-10 py-6 text-secondary text-sm font-light italic">Riyadh</td><td className="px-10 py-6 text-secondary text-sm">Feb 24, 2026</td><td className="px-10 py-6"><div className="flex gap-2"><button className="px-4 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black-deep transition-all bg-transparent border-0 cursor-pointer">Approve</button><button className="px-4 py-1 rounded-full border border-gold/20 text-secondary text-[10px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black-deep transition-all bg-transparent cursor-pointer">View</button></div></td></tr>
                <tr className="border-b border-gold/5 hover:bg-beige/30 transition-all"><td className="px-10 py-6"><strong className="font-display text-lg text-black-deep">Glow & Glam</strong></td><td className="px-10 py-6 text-secondary text-sm">Priya Mehta</td><td className="px-10 py-6 text-secondary text-sm font-light italic">Delhi</td><td className="px-10 py-6 text-secondary text-sm">Feb 23, 2026</td><td className="px-10 py-6"><div className="flex gap-2"><button className="px-4 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black-deep transition-all bg-transparent border-0 cursor-pointer">Approve</button><button className="px-4 py-1 rounded-full border border-gold/20 text-secondary text-[10px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black-deep transition-all bg-transparent cursor-pointer">View</button></div></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card bg-cream border border-gold/5 rounded-[40px] overflow-hidden shadow-sm">
          <div className="admin-card-header px-10 py-8 border-b border-gold/10 bg-cream/50 backdrop-blur-md">
            <div>
              <div className="text-3xl font-display text-black-deep italic">Admin Activity</div>
              <div className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-1">Recent actions</div>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="activity-list">
              <div className="activity-item flex items-start gap-4 p-8 border-b border-gold/5 last:border-0 hover:bg-beige/30 transition-all">
                <div className="activity-dot w-3 h-3 rounded-full mt-1.5 bg-gold shadow-[0_0_10px_rgba(200,169,81,0.5)]"></div>
                <div>
                  <div className="activity-text text-black-deep"><strong>Omar Farouq</strong> approved Luxe Hair Studio </div>
                  <div className="activity-time text-xs text-secondary font-light italic mt-1">2 min ago</div>
                </div>
              </div>
              <div className="activity-item flex items-start gap-4 p-8 border-b border-gold/5 last:border-0 hover:bg-beige/30 transition-all">
                <div className="activity-dot w-3 h-3 rounded-full mt-1.5 bg-black-deep/40 shadow-[0_0_10px_rgba(0,0,0,0.1)]"></div>
                <div>
                  <div className="activity-text text-black-deep"><strong>Meera S.</strong> added new category "Bridal"</div>
                  <div className="activity-time text-xs text-secondary font-light italic mt-1">1 hr ago</div>
                </div>
              </div>
              <div className="activity-item flex items-start gap-4 p-8 border-b border-gold/5 last:border-0 hover:bg-beige/30 transition-all">
                <div className="activity-dot w-3 h-3 rounded-full mt-1.5 bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]"></div>
                <div>
                  <div className="activity-text text-black-deep"><strong>System</strong> rejected Golden Cuts (docs missing)</div>
                  <div className="activity-time text-xs text-secondary font-light italic mt-1">3 hr ago</div>
                </div>
              </div>
              <div className="activity-item flex items-start gap-4 p-8 border-b border-gold/5 last:border-0 hover:bg-beige/30 transition-all">
                <div className="activity-dot w-3 h-3 rounded-full mt-1.5 bg-gold/60 shadow-[0_0_10px_rgba(200,169,81,0.3)]"></div>
                <div>
                  <div className="activity-text text-black-deep"><strong>Nadia K.</strong> suspended Bold Blades Barbershop</div>
                  <div className="activity-time text-xs text-secondary font-light italic mt-1">5 hr ago</div>
                </div>
              </div>
              <div className="activity-item flex items-start gap-4 p-8 border-b border-gold/5 last:border-0 hover:bg-beige/30 transition-all">
                <div className="activity-dot w-3 h-3 rounded-full mt-1.5 bg-black-deep shadow-[0_0_10px_rgba(0,0,0,0.15)]"></div>
                <div>
                  <div className="activity-text text-black-deep"><strong>Admin</strong> added new admin user</div>
                  <div className="activity-time text-xs text-secondary font-light italic mt-1">Yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;