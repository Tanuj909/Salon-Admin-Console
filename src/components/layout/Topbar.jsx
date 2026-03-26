import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import NotificationBell from "@/components/layout/NotificationBell";

const Topbar = ({ onMenuClick, isMobile }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pageTitles = {
    '/super-admin/dashboard': 'Dashboard',
    '/super-admin/pending-salons': 'Pending Salons',
    '/super-admin/verified-salons': 'Verified Salons',
    '/super-admin/categories': 'Categories',
    '/super-admin/all-salons': 'All Salons',
    '/super-admin/admins': 'All Admins',
    '/admin/dashboard': 'Overview',
    '/admin/my-salon': 'My Salon',
    '/admin/services': 'Service Menu',
    '/admin/staff': 'Staff Management',
    '/admin/reviews': 'Client Reviews',
    '/admin/bookings': 'Appointments'
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topbar-container bg-cream/80 backdrop-blur-xl border-b border-gold/10 px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between sticky top-0 z-[60]">
      <div className="topbar-left flex items-center gap-4 sm:gap-8">
        {isMobile && (
          <button
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black-deep transition-all"
            onClick={onMenuClick}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <h1 className="page-title font-display text-xl sm:text-2xl text-black-deep italic truncate max-w-[150px] sm:max-w-none">
          {currentTitle}
        </h1>
      </div>

      <div className="topbar-right flex items-center gap-3 sm:gap-6">

        {/* ── Notification Bell ── */}
        <NotificationBell />

        <div className="w-px h-8 bg-gold/10 hidden sm:block"></div>

        {/* ── Profile Dropdown ── */}
        <div
          className="profile-btn flex items-center gap-2 sm:gap-4 p-1 sm:p-2 pl-2 pr-2 sm:pr-4 rounded-full border border-gold/10 hover:bg-gold/5 transition-all cursor-pointer relative"
          onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
          ref={dropdownRef}
        >
          <div className="avatar w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold flex items-center justify-center text-black-deep font-bold text-[10px] sm:text-xs ring-2 sm:ring-4 ring-gold/10 shadow-sm overflow-hidden">
            {user?.fullName
              ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
              : user?.role === 'SUPER_ADMIN' ? 'SA' : 'AD'
            }
          </div>

          <div className="profile-info hidden md:flex flex-col text-left">
            <div className="profile-name text-sm font-bold text-black-deep leading-none mb-1">
              {user?.fullName || (user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Salon Admin')}
            </div>
            <div className="profile-role text-[10px] uppercase tracking-widest text-secondary font-bold leading-none">
              {user?.role || "Role Not Found"}
            </div>
          </div>

          <svg
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`text-secondary transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>

          {/* Profile dropdown menu */}
          <div
            className={`dropdown-menu absolute top-full right-0 mt-4 bg-cream/95 backdrop-blur-xl border border-gold/10 rounded-3xl shadow-luxe p-3 min-w-[200px] sm:min-w-[220px] transition-all transform origin-top-right ${
              dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-info flex md:hidden flex-col text-left p-4 border-b border-gold/10 mb-2">
                <div className="profile-name text-sm font-bold text-black-deep leading-none mb-1">
                {user?.fullName || (user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Salon Admin')}
                </div>
                <div className="profile-role text-[10px] uppercase tracking-widest text-secondary font-bold leading-none">
                {user?.role || "Role Not Found"}
                </div>
            </div>

            <div className="dropdown-item flex items-center gap-3 p-4 rounded-2xl hover:bg-gold/10 text-black-deep text-sm transition-all cursor-pointer group" onClick={logout}>
              <div className="w-8 h-8 rounded-full bg-red-400/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <span className="font-bold uppercase tracking-widest text-[10px]">Sign Out</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Topbar;
