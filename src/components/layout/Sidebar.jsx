import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
        { path: "/admin/timings", label: "Timings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
        { path: "/admin/bookings", label: "Bookings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
        { path: "/admin/complete-booking", label: "Complete Booking", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="2" /><path d="M9 14l2 2 4-4" /></svg> },
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
        { path: "/admin/super-admin/dashboard", label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
        { path: "/admin/super-admin/analyze", label: "Analyze", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
      ]
    },
    {
      label: "Salons",
      items: [
        { path: "/admin/super-admin/pending-salons", label: "Pending Salons", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>, badge: 12 },
        { path: "/admin/super-admin/verified-salons", label: "Verified Salons", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" /></svg> },
        { path: "/admin/super-admin/all-salons", label: "All Salons", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg> },
      ]
    },
    {
      label: "Management",
      items: [
        { path: "/admin/super-admin/categories", label: "Categories", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> },
        // { path: "/admin/super-admin/admins", label: "All Admins", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
      ]
    }
  ];

  const receptionistMenu = [
    {
      label: "Overview",
      items: [
        { path: "/admin/receptionist/dashboard", label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
      ]
    },
    {
      label: "Salon Management",
      items: [
        // { path: "/admin/receptionist/my-salon", label: "My Salon", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg> },
        { path: "/admin/receptionist/timings", label: "Timings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
        { path: "/admin/receptionist/bookings", label: "Bookings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
        { path: "/admin/receptionist/complete-booking", label: "Complete Booking", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="2" /><path d="M9 14l2 2 4-4" /></svg> },
        { path: "/admin/receptionist/reviews", label: "Reviews", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
      ]
    }
  ];

  const staffMenu = [
    {
      label: "Overview",
      items: [
        { path: "/admin/staff/dashboard", label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
      ]
    },
    {
      label: "My Work",
      items: [
        { path: "/admin/staff/my-bookings", label: "My Bookings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="2" /><path d="M9 14l2 2 4-4" /></svg> },
        { path: "/admin/staff/reviews", label: "My Reviews", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
      ]
    }
  ];

  const menuSections = role === "SUPER_ADMIN" ? superAdminMenu : role === "RECEPTIONIST" ? receptionistMenu : role === "STAFF" ? staffMenu : adminMenu;

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-[100] flex flex-col h-screen bg-black-deep text-white border-r border-white/5 transition-all duration-300 ease-in-out font-jost
          ${collapsed ? 'w-20' : 'w-72'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        id="sidebar"
      >
        {/* LOGO AREA */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b border-white/5 h-20 sm:h-24 shrink-0 transition-all ${collapsed ? 'border-b-transparent' : ''}`}>
          <div 
            className={`flex items-center gap-4 cursor-pointer transition-transform active:scale-95 ${collapsed ? 'justify-center w-full' : 'justify-start'}`}
            onClick={() => navigate('/admin')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center text-black-deep shadow-[0_4px_20px_-5px_rgba(200,169,81,0.5)] flex-shrink-0 overflow-hidden p-1">
              <img src="/logo/fastbooking.png" alt="FastBooking Logo" className="w-full h-full object-contain" />
            </div>

            {!collapsed && (
              <div className="flex flex-col justify-center overflow-hidden whitespace-nowrap opacity-100 transition-opacity duration-300 text-left">
                <div className="font-display text-lg sm:text-xl leading-tight italic tracking-wide">FastBooking</div>
                <div className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold mt-0.5">{role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'RECEPTIONIST' ? 'Receptionist' : 'Admin Console'}</div>
              </div>
            )}
          </div>

          {/* MOBILE CLOSE BUTTON */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
            aria-label="Close Sidebar"
          >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* NAVIGATION AREA */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-6 space-y-8">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="px-4">
              {!collapsed && (
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 mb-3 px-3">
                  {section.label}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname.includes(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`group relative flex items-center ${collapsed ? 'justify-center py-3 px-0' : 'gap-3 px-4 py-3'} rounded-xl transition-all duration-300 
                        ${isActive ? 'bg-gold/10 text-gold font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}
                      `}
                      title={collapsed ? item.label : ""}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-r-md"></div>
                      )}

                      {/* Icon */}
                      <span className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-white'}`}>
                        {item.icon}
                      </span>

                      {/* Label */}
                      {!collapsed && (
                        <span className="flex-1 text-sm whitespace-nowrap tracking-wide">{item.label}</span>
                      )}

                      {/* Badge */}
                      {!collapsed && item.badge && (
                        <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}

                      {/* Collapsed Badge Dot */}
                      {collapsed && item.badge && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gold border border-black-deep"></span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER COLLAPSE TOGGLE */}
        <div className="p-4 border-t border-white/5 shrink-0 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start px-4'} gap-3 py-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all cursor-pointer`}
          >
            <svg
              className={`transition-transform duration-500 flex-shrink-0 ${collapsed ? 'rotate-180' : ''}`}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="15,18 9,12 15,6" />
            </svg>

            {!collapsed && (
              <span className="text-xs font-semibold uppercase tracking-[0.1em] whitespace-nowrap">Collapse Menu</span>
            )}
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setMobileOpen(false)}
      ></div>
    </>
  );
};

export default Sidebar;