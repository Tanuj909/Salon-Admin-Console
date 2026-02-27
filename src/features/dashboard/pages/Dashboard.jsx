import { useAuth } from "@/features/auth/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <div className="page active">
      <div className="admin-page-header">
        <h1>Good morning, {user?.name || "Admin"} 👋</h1>
        <p>Here's what's happening on your platform today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </div>
          <div className="stat-body">
            <div className="stat-number">1,284</div>
            <div className="stat-label">Total Salons</div>
            <div className="stat-change">↑ 8.4% this month</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
          </div>
          <div className="stat-body">
            <div className="stat-number">12</div>
            <div className="stat-label">Pending Salons</div>
            <div className="stat-change down">↑ 3 new today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
          </div>
          <div className="stat-body">
            <div className="stat-number">1,247</div>
            <div className="stat-label">Verified Salons</div>
            <div className="stat-change">↑ 5.2% this month</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="stat-body">
            <div className="stat-number">34</div>
            <div className="stat-label">Total Admins</div>
            <div className="stat-change">↑ 2 new this week</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="section-title">Recent Pending Salons</div>
              <div className="section-subtitle" style={{fontSize: '12px', marginTop: '2px'}}>Awaiting review & approval</div>
            </div>
            <button className="admin-btn admin-btn-ghost admin-btn-sm">View All</button>
          </div>
          <div className="admin-card-body table-wrap">
            <table className="admin-table">
              <thead><tr>
                <th>Salon Name</th><th>Owner</th><th>City</th><th>Submitted</th><th>Actions</th>
              </tr></thead>
              <tbody>
                <tr><td><strong>Luxe & Co Salon</strong></td><td className="td-muted">Aisha Noor</td><td className="td-muted">Dubai</td><td className="td-muted">Feb 26, 2026</td><td><div className="flex gap-2"><button className="admin-btn admin-btn-green admin-btn-sm">Approve</button><button className="admin-btn admin-btn-ghost admin-btn-sm">View</button></div></td></tr>
                <tr><td><strong>The Mane Studio</strong></td><td className="td-muted">Rahul Kapoor</td><td className="td-muted">Mumbai</td><td className="td-muted">Feb 25, 2026</td><td><div className="flex gap-2"><button className="admin-btn admin-btn-green admin-btn-sm">Approve</button><button className="admin-btn admin-btn-ghost admin-btn-sm">View</button></div></td></tr>
                <tr><td><strong>Bliss Beauty Bar</strong></td><td className="td-muted">Sara Ahmed</td><td className="td-muted">Riyadh</td><td className="td-muted">Feb 24, 2026</td><td><div className="flex gap-2"><button className="admin-btn admin-btn-green admin-btn-sm">Approve</button><button className="admin-btn admin-btn-ghost admin-btn-sm">View</button></div></td></tr>
                <tr><td><strong>Glow & Glam</strong></td><td className="td-muted">Priya Mehta</td><td className="td-muted">Delhi</td><td className="td-muted">Feb 23, 2026</td><td><div className="flex gap-2"><button className="admin-btn admin-btn-green admin-btn-sm">Approve</button><button className="admin-btn admin-btn-ghost admin-btn-sm">View</button></div></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="section-title">Admin Activity</div>
              <div className="section-subtitle" style={{fontSize: '12px', marginTop: '2px'}}>Recent actions</div>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="activity-list">
              <div className="activity-item"><div className="activity-dot green"></div><div><div className="activity-text"><strong>Omar Farouq</strong> approved Luxe Hair Studio</div><div className="activity-time">2 min ago</div></div></div>
              <div className="activity-item"><div className="activity-dot blue"></div><div><div className="activity-text"><strong>Meera S.</strong> added new category "Bridal"</div><div className="activity-time">1 hr ago</div></div></div>
              <div className="activity-item"><div className="activity-dot red"></div><div><div className="activity-text"><strong>System</strong> rejected Golden Cuts (docs missing)</div><div className="activity-time">3 hr ago</div></div></div>
              <div className="activity-item"><div className="activity-dot amber"></div><div><div className="activity-text"><strong>Nadia K.</strong> suspended Bold Blades Barbershop</div><div className="activity-time">5 hr ago</div></div></div>
              <div className="activity-item"><div className="activity-dot blue"></div><div><div className="activity-text"><strong>Admin</strong> added new admin user</div><div className="activity-time">Yesterday</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
