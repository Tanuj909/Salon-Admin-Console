import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

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
    <header className="topbar-container bg-cream/80 backdrop-blur-xl border-b border-gold/10 px-10 h-20 flex items-center justify-between sticky top-0 z-[60]">
      <div className="topbar-left flex items-center gap-8">
        {isMobile && (
          <button className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black-deep transition-all" onClick={onMenuClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        )}
        <h1 className="page-title font-display text-2xl text-black-deep italic">{currentTitle}</h1>
      </div>

      <div className="topbar-right flex items-center gap-6">
        <button className="w-12 h-12 rounded-full border border-gold/10 flex items-center justify-center text-secondary hover:bg-gold hover:text-black-deep transition-all relative group cursor-pointer bg-transparent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-gold rounded-full border-2 border-cream group-hover:border-gold transition-all"></span>
        </button>
        <div className="w-px h-8 bg-gold/10"></div>
        <div className="profile-btn flex items-center gap-4 p-2 pl-2 pr-4 rounded-full border border-gold/10 hover:bg-gold/5 transition-all cursor-pointer relative" onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }} ref={dropdownRef}>
          <div className="avatar w-10 h-10 rounded-full bg-gold flex items-center justify-center text-black-deep font-bold text-xs ring-4 ring-gold/10 shadow-sm">
            {user?.role === 'SUPER_ADMIN' ? 'SA' : 'AD'}
          </div>
          <div className="profile-info hidden md:flex flex-col text-left">
            <div className="profile-name text-sm font-bold text-black-deep leading-none mb-1">
              {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Salon Admin'}
            </div>
            <div className="profile-role text-[10px] uppercase tracking-widest text-secondary font-bold leading-none">
              {user?.role === 'SUPER_ADMIN' ? 'Administrator' : 'Business Manager'}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-secondary transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}><polyline points="6,9 12,15 18,9" /></svg>

          <div
            className={`dropdown-menu absolute top-full right-0 mt-4 bg-cream/95 backdrop-blur-xl border border-gold/10 rounded-3xl shadow-luxe p-3 min-w-[220px] transition-all transform origin-top-right ${dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dropdown-item flex items-center gap-3 p-4 rounded-2xl hover:bg-gold/10 text-black-deep text-sm transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <span className="font-bold uppercase tracking-widest text-[10px]">Profile Settings</span>
            </div>
            <div className="dropdown-item flex items-center gap-3 p-4 rounded-2xl hover:bg-gold/10 text-black-deep text-sm transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              </div>
              <span className="font-bold uppercase tracking-widest text-[10px]">Business Settings</span>
            </div>
            <div className="h-px bg-gold/10 my-2 mx-4"></div>
            <div className="dropdown-item flex items-center gap-3 p-4 rounded-2xl hover:bg-gold/10 text-black-deep text-sm transition-all cursor-pointer group" onClick={logout}>
              <div className="w-8 h-8 rounded-full bg-red-400/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
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