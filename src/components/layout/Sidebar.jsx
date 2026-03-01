import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role;

  const adminMenu = [
    {
      label: "Overview",
      items: [
        { path: "/admin/dashboard", label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
      ]
    },
    {
      label: "Salon Management",
      items: [
        { path: "/admin/my-salon", label: "My Salon", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg> },
        { path: "/admin/bookings", label: "Bookings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
        { path: "/admin/services", label: "Services", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> },
        { path: "/admin/staff", label: "Staff members", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
        { path: "/admin/reviews", label: "Reviews", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
      ]
    }
  ];

  const superAdminMenu = [
    {
      label: "Overview",
      items: [
        { path: "/super-admin/dashboard", label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
      ]
    },
    {
      label: "Salons",
      items: [
        { path: "/super-admin/pending-salons", label: "Pending Salons", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>, badge: 12 },
        { path: "/super-admin/verified-salons", label: "Verified Salons", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" /></svg> },
        { path: "/super-admin/all-salons", label: "All Salons", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg> },
      ]
    },
    {
      label: "Management",
      items: [
        { path: "/super-admin/categories", label: "Categories", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> },
        { path: "/super-admin/admins", label: "All Admins", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
      ]
    }
  ];

  const menuSections = role === "SUPER_ADMIN" ? superAdminMenu : adminMenu;

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} id="sidebar">
        <div className="sidebar-logo p-8 flex items-center gap-4">
          <div className="logo-icon w-12 h-12 rounded-2xl bg-gold flex items-center justify-center text-black-deep shadow-luxe flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </div>
          <div className="logo-text overflow-hidden transition-all duration-300">
            <div className="logo-title font-display text-xl text-white italic">Salon Luxe</div>
            <div className="logo-subtitle text-[10px] uppercase tracking-widest text-secondary font-bold">{role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Console'}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div className="nav-section-label" style={sIdx > 0 ? { marginTop: '8px' } : {}}>{section.label}</div>
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  data-label={item.label}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer p-6 border-t border-white/5">
          <div className="collapse-btn flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all text-secondary hover:text-white cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
            <svg className={`transition-transform duration-500 ${collapsed ? 'rotate-180' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6" /></svg>
            <span className="text-sm font-medium uppercase tracking-widest text-[10px]">{collapsed ? "" : "Collapse Menu"}</span>
          </div>
        </div>
      </aside>

      <div
        className={`mobile-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      ></div>
    </>
  );
};

export default Sidebar;