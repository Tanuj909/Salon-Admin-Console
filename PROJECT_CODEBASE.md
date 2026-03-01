# Project Codebase Documentation

## Project Structure
```
.
|____jsconfig.json
|____index.html
|____vite.config.js
|____README.md
|____public
| |____vite.svg
|____package-lock.json
|____package.json
|____eslint.config.js
|____src
| |____context
| | |____AuthContext.jsx
| |____app
| | |____routes.jsx
| | |____App.jsx
| |____features
| | |____bookings
| | | |____pages
| | | |____services
| | |____auth
| | | |____hooks
| | | |____pages
| | | |____services
| | |____dashboard
| | | |____pages
| | |____salons
| | | |____hooks
| | | |____pages
| | | |____services
| | |____users
| | | |____pages
| | |____staff
| | | |____pages
| | | |____services
| | |____categories
| | | |____pages
| | | |____services
| | |____services
| | | |____pages
| | | |____services
| | |____reviews
| | | |____pages
| | | |____services
| |____utils
| | |____token.js
| | |____helpers.js
| |____index.css
| |____styles
| | |____admin.css
| |____components
| | |____layout
| | | |____DashboardLayout.jsx
| | | |____Sidebar.jsx
| | | |____Topbar.jsx
| | |____superadmin
| | |____admin
| | |____common
| | | |____Sidebar.jsx
| | | |____Topbar.jsx
| | | |____ProtectedRoute.jsx
| |____layouts
| | |____MainLayout.jsx
| |____hooks
| | |____useRole.js
| |____main.jsx
| |____App.jsx
| |____assets
| | |____images
| | |____styles
| | |____icons
| | |____react.svg
| |____pages
| | |____auth
| | | |____Login.jsx
| | |____superadmin
| | | |____SuperAdminDashboard.jsx
| | |____admin
| |____routes
| | |____PrivateRoute.jsx
| | |____index.jsx
| | |____RoleBasedRoute.jsx
| |____services
| | |____interceptors
| | | |____axiosInterceptor.js
| | |____apiEndpoints.js
| | |____api
| | | |____axiosConfig.js
| | |____axiosInstance.js
```

## Root Configurations
### package.json
```json
{
  "name": "console",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.2.1",
    "axios": "^1.13.5",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.1",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "vite": "^7.3.1"
  }
}
```

### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

```

### jsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

### eslint.config.js
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
```

### index.html
```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Salon Console</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=Jost:wght@300;400;500;600;700&display=swap"
    rel="stylesheet" />
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>

</html>```

## Source Code (src)
### src/App.jsx
```jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './routes';
import setupInterceptors from './services/interceptors/axiosInterceptor';

// Component to initialize axios interceptors with access to navigate/logout
const AxiosInitializer = ({ children }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        setupInterceptors(navigate, logout);
    }, [navigate, logout]);

    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AxiosInitializer>
                    <AppRoutes />
                </AxiosInitializer>
            </AuthProvider>
        </Router>
    );
}

export default App;
```

### src/app/App.jsx
```jsx
import AppRoutes from "./routes";
import { AuthProvider } from "@/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;```

### src/app/routes.jsx
```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PendingSalons from "@/features/salons/pages/PendingSalons";
import AllSalons from "@/features/salons/pages/AllSalons";
import VerifiedSalons from "@/features/salons/pages/VerifiedSalons";
import SalonDetails from "@/features/salons/pages/SalonDetails";
import Categories from "@/features/categories/pages/Categories";
import MyAdminSalon from "@/features/salons/pages/MyAdminSalon";
import Services from "@/features/services/pages/Services";
import Staff from "@/features/staff/pages/Staff";
import Admins from "@/features/users/pages/Admins";
import SalonReviews from "@/features/reviews/pages/SalonReviews";
import Bookings from "@/features/bookings/pages/Bookings";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        {/* Super Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/super-admin/dashboard" element={<Dashboard />} />
            <Route path="/super-admin/pending-salons" element={<PendingSalons />} />
            <Route path="/super-admin/all-salons" element={<AllSalons />} />
            <Route path="/super-admin/verified-salons" element={<VerifiedSalons />} />
            <Route path="/super-admin/salons/:id" element={<SalonDetails />} />
            <Route path="/super-admin/categories" element={<Categories />} />
            <Route path="/super-admin/admins" element={<Admins />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/my-salon" element={<MyAdminSalon />} />
            <Route path="/admin/services" element={<Services />} />
            <Route path="/admin/staff" element={<Staff />} />
            <Route path="/admin/reviews" element={<SalonReviews />} />
            <Route path="/admin/bookings" element={<Bookings />} />
          </Route>
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
```

### src/components/common/ProtectedRoute.jsx
```jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />; // Or an unauthorized page
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;```

### src/components/common/Sidebar.jsx
```jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    LayoutDashboard,
    Store,
    Users,
    Scissors,
    CalendarCheck,
    MessageSquare,
    CalendarDays,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Layers
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setCollapsed }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const role = user?.role;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const superAdminLinks = [
        { name: 'Dashboard', path: '/super-admin/dashboard', icon: LayoutDashboard },
        { name: 'Pending Salons', path: '/super-admin/pending', icon: ShieldCheck },
        { name: 'Verified Salons', path: '/super-admin/verified', icon: Store },
        { name: 'All Businesses', path: '/super-admin/all-salons', icon: Layers },
        { name: 'Admin Management', path: '/super-admin/admins', icon: Users },
    ];

    const adminLinks = [
        { name: 'My Salon', path: '/admin/dashboard', icon: Store },
        { name: 'Appointments', path: '/admin/bookings', icon: CalendarCheck },
        { name: 'Our Staff', path: '/admin/staff', icon: Users },
        { name: 'Services', path: '/admin/services', icon: Scissors },
        { name: 'Categories', path: '/admin/categories', icon: Layers },
        { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    ];

    const links = role === 'SUPER_ADMIN' ? superAdminLinks : adminLinks;

    return (
        <aside
            className={`relative h-screen bg-black-deep text-white transition-all duration-300 ease-in-out flex flex-col z-50
        ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shrink-0">
                    <Scissors className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                    <span className="ml-3 font-display italic text-lg tracking-wide whitespace-nowrap overflow-hidden">
                        Salon Luxe
                    </span>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 no-scrollbar">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? 'bg-gold text-black-deep shadow-luxe'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'}
                `}
                                title={isCollapsed ? link.name : ''}
                            >
                                <link.icon className={`w-5 h-5 shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium tracking-wide truncate">
                                        {link.name}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/10 shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
                >
                    <LogOut className={`w-5 h-5 shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                    {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                </button>

                {/* Toggle Button */}
                <button
                    onClick={() => setCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 bg-gold text-black-deep p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
```

### src/components/common/Topbar.jsx
```jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Search, User } from 'lucide-react';

const Topbar = ({ isSidebarCollapsed }) => {
    const { user } = useAuth();

    const getRoleDisplay = (role) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'Super Admin';
            case 'ADMIN': return 'Salon Admin';
            default: return 'User';
        }
    };

    return (
        <header className="h-16 border-b border-gold/10 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between shrink-0">
            {/* Left side: Contextual Title */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center bg-beige px-3 py-1.5 rounded-full border border-gold/10">
                    <Search className="w-4 h-4 text-secondary" />
                    <input
                        type="text"
                        placeholder="Search console..."
                        className="bg-transparent border-none outline-none text-xs ml-2 w-48 font-jost"
                    />
                </div>
            </div>

            {/* Right side: Tools & Profile */}
            <div className="flex items-center gap-3">
                <button className="p-2 text-secondary hover:text-gold transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="w-px h-6 bg-gold/20 mx-2"></div>

                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-black-deep tracking-wide group-hover:text-gold transition-colors">
                            {user?.name || 'Administrator'}
                        </p>
                        <p className="text-[10px] text-secondary font-medium tracking-widest uppercase">
                            {getRoleDisplay(user?.role)}
                        </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all">
                        {user?.name ? (
                            <span className="text-sm font-bold uppercase">{user.name.charAt(0)}</span>
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
```

### src/components/layout/DashboardLayout.jsx
```jsx
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setMobileOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="layout">

            {/* Dynamic Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Right Side */}
            <div className="main">

                {/* Topbar */}
                <Topbar onMenuClick={() => setMobileOpen(true)} isMobile={isMobile} />

                {/* Page Content */}
                <main className="admin-content">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;
```

### src/components/layout/Sidebar.jsx
```jsx
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

export default Sidebar;```

### src/components/layout/Topbar.jsx
```jsx
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

export default Topbar;```

### src/context/AuthContext.jsx
```jsx
import { createContext, useState } from "react";
import { getToken, setToken, removeToken } from "@/utils/token";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(getToken());

  // Initialize user from localStorage if available
  const getInitialUser = () => {
    try {
      const storedUser = localStorage.getItem("admin_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  };
  const [user, setUser] = useState(getInitialUser());

  const login = (data) => {
    const { accessToken, userId, role } = data;

    setToken(accessToken);
    setAuthToken(accessToken);

    const userData = {
      userId,
      role,
    };

    setUser(userData);
    localStorage.setItem("admin_user", JSON.stringify(userData));
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("admin_user");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};```

### src/features/auth/hooks/useAuth.js
```javascript
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};```

### src/features/auth/pages/Login.jsx
```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginApi(form);
      login(data);

      if (data.role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-ornament"></div>
      <div className="auth-bg-ornament-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title font-display text-4xl italic text-black-deep">Salon Luxe</h1>
          <p className="auth-subtitle text-secondary font-medium tracking-widest uppercase text-[10px] mt-2">Administrative Console</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="e.g. admin@salon.com"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <div className="flex justify-between items-center mb-2">
              <label className="auth-label mb-0">Password</label>
              <button type="button" className="text-[11px] font-bold text-gold hover:underline bg-transparent border-0 cursor-pointer">Forgot?</button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="auth-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8 select-none cursor-pointer group">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gold/20 accent-gold" />
            <label htmlFor="remember" className="text-xs text-secondary font-medium group-hover:text-black-deep cursor-pointer">Stay signed in for 30 days</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn flex items-center justify-center gap-3 bg-gold text-black-deep hover:bg-gold/80 hover:shadow-luxe transition-all cursor-pointer border-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black-deep/30 border-t-black-deep rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="font-bold uppercase tracking-widest text-xs">Enter Sanctuary</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Authorized Personnel Only • Powered by SalonFlow</p>
        </div>
      </div>
    </div>
  );
};

export default Login;```

### src/features/auth/services/authService.js
```javascript
import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const loginApi = async (credentials) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  return response.data;
};```

### src/features/bookings/pages/Bookings.jsx
```jsx
import { useState, useEffect } from "react";
import { getMyBusinessApi } from "@/features/salons/services/salonService";
import { getBookingsByBusinessApi, acceptBookingApi, rejectBookingApi, rescheduleBookingApi } from "../services/bookingService";
import { getStaffByServiceApi } from "@/features/staff/services/staffService";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Accept Booking Modal State
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [eligibleStaff, setEligibleStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [isAccepting, setIsAccepting] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);

  // Reject Booking Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Reschedule Booking Modal State
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    reason: "",
    alternativeStaffId: "",
    alternativeDate: "",
    alternativeStartTime: ""
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // desc or asc

  useEffect(() => {
    fetchMyBusinessAndBookings();
  }, [currentPage, sortOrder]);

  const fetchMyBusinessAndBookings = async () => {
    try {
      setLoading(true);
      let bId = businessId;
      if (!bId) {
        const business = await getMyBusinessApi();
        bId = business.id;
        setBusinessId(bId);
      }

      const sortParam = `bookingDate,${sortOrder}`;
      const data = await getBookingsByBusinessApi(bId, currentPage, 10, sortParam);
      setBookings(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAcceptModal = async (booking) => {
    setSelectedBooking(booking);
    setIsAcceptModalOpen(true);
    setSelectedStaffId(""); // Reset previously selected staff
    setStaffLoading(true);
    setEligibleStaff([]);

    try {
      // Assuming the booking has at least one service, we fetch staff based on the first service.
      // Adjust this logic if staff selection needs to handle multiple services differently.
      if (booking.services && booking.services.length > 0) {
        const serviceId = booking.services[0].id;
        const staffList = await getStaffByServiceApi(serviceId);
        // Filter to show only available staff visually, or just list them
        setEligibleStaff(staffList);
      }
    } catch (error) {
      console.error("Error fetching staff for service:", error);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleAcceptBooking = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !selectedStaffId) return;

    setIsAccepting(true);
    try {
      await acceptBookingApi(selectedBooking.id, selectedStaffId);
      setIsAcceptModalOpen(false);
      fetchMyBusinessAndBookings(); // Refresh the list
    } catch (error) {
      console.error("Error accepting booking:", error);
      alert("Failed to accept booking. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleOpenRejectModal = (booking) => {
    setSelectedBooking(booking);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const handleRejectBooking = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !rejectReason.trim()) return;

    setIsRejecting(true);
    try {
      await rejectBookingApi(selectedBooking.id, rejectReason);
      setIsRejectModalOpen(false);
      fetchMyBusinessAndBookings();
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleOpenRescheduleModal = async (booking) => {
    setSelectedBooking(booking);
    setRescheduleData({
      reason: "",
      alternativeStaffId: "",
      alternativeDate: "",
      alternativeStartTime: ""
    });
    setIsRescheduleModalOpen(true);
    setStaffLoading(true);
    setEligibleStaff([]);

    try {
      if (booking.services && booking.services.length > 0) {
        const serviceId = booking.services[0].id;
        const staffList = await getStaffByServiceApi(serviceId);
        setEligibleStaff(staffList);
      }
    } catch (error) {
      console.error("Error fetching staff for rescheduling:", error);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleRescheduleBooking = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !rescheduleData.reason || !rescheduleData.alternativeStaffId || !rescheduleData.alternativeDate || !rescheduleData.alternativeStartTime) return;

    setIsRescheduling(true);
    try {
      const payload = {
        status: "RESCHEDULED",
        reason: rescheduleData.reason,
        alternativeStaffId: parseInt(rescheduleData.alternativeStaffId, 10),
        alternativeDate: rescheduleData.alternativeDate,
        alternativeStartTime: rescheduleData.alternativeStartTime
      };
      await rescheduleBookingApi(selectedBooking.id, payload);
      setIsRescheduleModalOpen(false);
      fetchMyBusinessAndBookings();
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      alert("Failed to reschedule booking. Please try again.");
    } finally {
      setIsRescheduling(false);
    }
  };

  const formatDate = (dateString, timeString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeFormatted = timeString ? timeString.substring(0, 5) : "";
    return `${dateFormatted} ${timeFormatted}`;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.bookingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesPayment = !paymentFilter || booking.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-green';
      case 'PENDING': return 'badge-amber';
      case 'CANCELLED': return 'badge-red';
      case 'COMPLETED': return 'badge-blue';
      case 'RESCHEDULED': return 'badge-blue'; // Added for rescheduled status
      default: return 'badge-gray';
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case 'PAID': return 'badge-green';
      case 'PENDING': return 'badge-amber';
      case 'FAILED': return 'badge-red';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="page active" style={{ minHeight: '100vh', padding: '0' }}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@600;700&display=swap');

        .bookings-container {
          font-family: 'Jost', sans-serif;
          color: #1C1C1C;
          padding: 4rem;
          width: 100%;
          margin: 0 auto;
          background: #F7F3EE;
          min-height: 100vh;
        }

        .bookings-container *, .bookings-container *::before, .bookings-container *::after { 
            box-sizing: border-box; 
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .page-header-left h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          font-style: italic;
          font-weight: 400;
          color: #1C1C1C;
          margin: 0;
        }

        .page-header-left p {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7a7065;
          margin-top: 0.5rem;
        }

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 320px;
        }

        .search-wrap svg {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s;
        }

        .search-input:focus { border-color: #C8A951; }
        .search-input::placeholder { color: #9CA3AF; }

        .filter-select {
          padding: 8px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #374151;
          background: #FFFFFF;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 30px;
          transition: border-color 0.15s;
        }
        .filter-select:focus { border-color: #C8A951; }

        .table-container {
          background: #FDFAF6;
          border: 1px solid rgba(200, 169, 81, 0.1);
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 10px 40px -15px rgba(200, 169, 81, 0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          background: #F9FAFB;
          border-bottom: 1px solid #E5E7EB;
        }

        thead th {
          padding: 16px 20px;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7a7065;
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid #F3F4F6;
          transition: background 0.12s;
        }

        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #F8FAFC; }

        tbody td {
          padding: 14px 16px;
          vertical-align: middle;
          font-size: 13.5px;
          color: #374151;
        }

        .booking-id {
          font-weight: 600;
          font-size: 14px;
          color: #111827;
          margin-bottom: 3px;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .customer-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #F3F4F6;
          color: #6B7280;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600;
          font-size: 13px;
        }

        .customer-name {
          font-weight: 500;
          color: #111827;
        }

        .customer-email {
          font-size: 12px;
          color: #6B7280;
        }

        .service-list {
          font-size: 13px;
          color: #4B5563;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .badge-gray {
          background: #F3F4F6;
          color: #374151;
          border: 1px solid #E5E7EB;
        }

        .badge-green {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .badge-amber {
          background: #FFFBEB;
          color: #92400E;
          border: 1px solid #FCD34D;
        }

        .badge-red {
          background: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        .badge-blue {
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #BFDBFE;
        }

        .price-main {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid #E5E7EB;
          background: #FFFFFF;
          border-radius: 0 0 10px 10px;
        }

        .pagination-info {
          font-size: 13px;
          color: #6B7280;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .page-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .page-btn.current {
          background: #1B3F6E;
          border-color: #1B3F6E;
          color: white;
          cursor: default;
          opacity: 1;
        }

        .empty-row td {
          text-align: center;
          padding: 48px 0;
          color: #6B7280;
          font-size: 13.5px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #C8A951;
          color: #1C1C1C;
          border: none;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: 'Jost', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .btn-primary:hover { background: #B69843; box-shadow: 0 10px 20px -5px rgba(200, 169, 81, 0.4); transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal {
          background: #FFFFFF;
          width: 100%;
          max-width: 460px;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h3 {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
          padding: 4px;
          display: flex;
          transition: color 0.15s;
        }
        .modal-close:hover { color: #374151; }

        .modal-body {
          padding: 24px;
        }

        .modal-form-group {
          margin-bottom: 20px;
        }
        .modal-form-group:last-child { margin-bottom: 0; }

        .modal-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .modal-input, .modal-select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .modal-input:focus, .modal-select:focus {
          border-color: #1B3F6E;
          box-shadow: 0 0 0 3px rgba(27, 63, 110, 0.1);
        }

        .modal-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #E5E7EB;
          background: #F9FAFB;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-secondary {
          background: #FFFFFF;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-secondary:hover { background: #F3F4F6; }

        .btn-submit {
          background: #1B3F6E;
          color: white;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-submit:hover { background: #152f55; }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-danger {
          background: #DC2626;
        }
        .btn-danger:hover { background: #B91C1C; }

        .staff-summary {
          margin-top: 12px;
          padding: 12px;
          background: #F3F4F6;
          border-radius: 8px;
          font-size: 12.5px;
          color: #4B5563;
        }
        `}
      </style>

      <main className="bookings-container">
        {/* ── Page Header ── */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>Business Bookings</h1>
            <p>Manage and view all appointments &nbsp;·&nbsp; Business ID: {businessId || '...'} &nbsp;·&nbsp; Total: {totalElements}</p>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <div className="search-wrap">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search by ID or custom name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RESCHEDULED">Rescheduled</option> {/* Added for rescheduled status */}
          </select>
          <select
            className="filter-select"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* ── Table ── */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking ID & Date</th>
                <th>Customer</th>
                <th>Services</th>
                <th>Staff</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="empty-row">
                  <td colSpan="8">Loading bookings...</td> {/* Changed colspan to 8 */}
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="8">No bookings found for the selected filters.</td> {/* Changed colspan to 8 */}
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <div className="booking-id">{booking.bookingNumber}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>
                        {formatDate(booking.bookingDate, booking.startTime)}
                      </div>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {booking.customer?.firstName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="customer-name">{booking.customer?.firstName} {booking.customer?.lastName}</div>
                          <div className="customer-email">{booking.customer?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="service-list" title={booking.services?.map(s => s.name).join(', ')}>
                        {booking.services?.length > 0
                          ? booking.services[0].name + (booking.services.length > 1 ? ` (+${booking.services.length - 1})` : '')
                          : 'No services'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '500', color: '#374151' }}>
                        {booking.staff ? `${booking.staff.firstName} ${booking.staff.lastName}` : 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <span className="price-main">₹{booking.finalAmount?.toFixed(2) || '0.00'}</span>
                    </td>
                    <td>
                      <span className={`badge ${getPaymentBadgeClass(booking.paymentStatus)}`}>
                        {booking.paymentStatus || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {booking.status === 'PENDING' && (
                          <>
                            <button
                              className="btn-primary"
                              onClick={() => handleOpenAcceptModal(booking)}
                            >
                              Accept
                            </button>
                            <button
                              className="btn-secondary"
                              style={{ padding: '7px 14px', fontSize: '12.5px', color: '#DC2626', borderColor: '#FCA5A5', background: '#FEF2F2' }}
                              onClick={() => handleOpenRejectModal(booking)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                          <button
                            className="btn-secondary"
                            style={{ padding: '7px 14px', fontSize: '12.5px' }}
                            onClick={() => handleOpenRescheduleModal(booking)}
                          >
                            Reschedule
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <div className="pagination-info">
                Showing page {currentPage + 1} of {totalPages}
              </div>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    className={`page-btn ${currentPage === idx ? 'current' : ''}`}
                    onClick={() => setCurrentPage(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* ── Accept Booking Modal ── */}
      {isAcceptModalOpen && (
        <div className="modal-overlay" onClick={() => !isAccepting && setIsAcceptModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Accept Booking</h3>
              <button
                className="modal-close"
                onClick={() => setIsAcceptModalOpen(false)}
                disabled={isAccepting}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleAcceptBooking}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label className="modal-label">Assign Staff Member</label>
                  <div style={{ marginBottom: '8px', fontSize: '12px', color: '#6B7280' }}>
                    Required Service: <span style={{ fontWeight: 600, color: '#374151' }}>{selectedBooking?.services?.[0]?.name || 'N/A'}</span>
                  </div>
                  {staffLoading ? (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                      Loading available staff...
                    </div>
                  ) : (
                    <select
                      className="modal-select"
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      required
                      disabled={isAccepting || eligibleStaff.length === 0}
                    >
                      <option value="" disabled>Select a staff member</option>
                      {eligibleStaff.map(staff => (
                        <option key={staff.id} value={staff.id}>
                          {staff.userFullName} - {staff.designation} {staff.isAvailable ? '' : '(Busy)'}
                        </option>
                      ))}
                    </select>
                  )}

                  {!staffLoading && eligibleStaff.length === 0 && (
                    <div style={{ marginTop: '8px', color: '#DC2626', fontSize: '12.5px' }}>
                      No staff members setup for this service.
                    </div>
                  )}

                  {selectedStaffId && (
                    <div className="staff-summary">
                      {(() => {
                        const staff = eligibleStaff.find(s => s.id.toString() === selectedStaffId.toString());
                        if (!staff) return null;
                        return (
                          <>
                            <div style={{ fontWeight: 600 }}>{staff.userFullName}</div>
                            <div style={{ marginTop: '2px' }}>{staff.bio || 'No bio available'}</div>
                            <div style={{ marginTop: '4px', display: 'flex', gap: '12px' }}>
                              <span>⭐ {staff.averageRating || 'New'}</span>
                              <span>Bookings: {staff.totalBookings || 0}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAcceptModalOpen(false)}
                  disabled={isAccepting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isAccepting || !selectedStaffId}
                >
                  {isAccepting ? 'Accepting...' : 'Confirm & Accept'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reject Booking Modal ── */}
      {isRejectModalOpen && (
        <div className="modal-overlay" onClick={() => !isRejecting && setIsRejectModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Booking</h3>
              <button
                className="modal-close"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={isRejecting}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleRejectBooking}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label className="modal-label">Rejection Reason</label>
                  <textarea
                    className="modal-input modal-textarea"
                    placeholder="e.g. Staff not available, out of operational hours..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    required
                    disabled={isRejecting}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsRejectModalOpen(false)}
                  disabled={isRejecting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit btn-danger"
                  disabled={isRejecting || !rejectReason.trim()}
                >
                  {isRejecting ? 'Rejecting...' : 'Reject Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reschedule Booking Modal ── */}
      {isRescheduleModalOpen && (
        <div className="modal-overlay" onClick={() => !isRescheduling && setIsRescheduleModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reschedule Booking</h3>
              <button
                className="modal-close"
                onClick={() => setIsRescheduleModalOpen(false)}
                disabled={isRescheduling}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleRescheduleBooking}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label className="modal-label">Reason for Rescheduling</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="e.g. Staff unavailable, Client request..."
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                    required
                    disabled={isRescheduling}
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">Select Alternative Staff</label>
                  {staffLoading ? (
                    <div style={{ padding: '8px', color: '#6B7280', fontSize: '13px' }}>
                      Loading available staff...
                    </div>
                  ) : (
                    <select
                      className="modal-select"
                      value={rescheduleData.alternativeStaffId}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, alternativeStaffId: e.target.value })}
                      required
                      disabled={isRescheduling || eligibleStaff.length === 0}
                    >
                      <option value="" disabled>Select new staff member</option>
                      {eligibleStaff.map(staff => (
                        <option key={staff.id} value={staff.id}>
                          {staff.userFullName} - {staff.designation}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="modal-form-group">
                    <label className="modal-label">Alternative Date</label>
                    <input
                      type="date"
                      className="modal-input"
                      value={rescheduleData.alternativeDate}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, alternativeDate: e.target.value })}
                      required
                      disabled={isRescheduling}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-label">Alternative Time</label>
                    <input
                      type="time"
                      className="modal-input"
                      value={rescheduleData.alternativeStartTime}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, alternativeStartTime: e.target.value })}
                      required
                      disabled={isRescheduling}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  disabled={isRescheduling}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={
                    isRescheduling ||
                    !rescheduleData.reason ||
                    !rescheduleData.alternativeStaffId ||
                    !rescheduleData.alternativeDate ||
                    !rescheduleData.alternativeStartTime
                  }
                >
                  {isRescheduling ? 'Rescheduling...' : 'Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Bookings;
```

### src/features/bookings/services/bookingService.js
```javascript
import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getBookingsByBusinessApi = async (businessId, page = 0, size = 10, sort = 'bookingDate,desc') => {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_BY_BUSINESS(businessId), {
        params: {
            page,
            size,
            sort
        }
    });
    return response.data;
};

export const acceptBookingApi = async (bookingId, staffId) => {
    const response = await axiosInstance.put(API_ENDPOINTS.BOOKINGS.ACCEPT(bookingId, staffId));
    return response.data;
};

export const rejectBookingApi = async (bookingId, reason) => {
    const response = await axiosInstance.put(API_ENDPOINTS.BOOKINGS.REJECT(bookingId), null, {
        params: { reason }
    });
    return response.data;
};

export const rescheduleBookingApi = async (bookingId, payload) => {
    const response = await axiosInstance.put(API_ENDPOINTS.BOOKINGS.RESCHEDULE(bookingId), payload);
    return response.data;
};
```

### src/features/categories/pages/Categories.jsx
```jsx
import { useState, useEffect } from "react";
import { getCategoriesApi, createCategoryApi } from "../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    iconUrl: "",
    displayOrder: 1,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategoriesApi();
      setCategories(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createCategoryApi({
        ...form,
        displayOrder: parseInt(form.displayOrder)
      });
      setIsModalOpen(false);
      setForm({
        name: "",
        description: "",
        iconUrl: "",
        displayOrder: 1,
        isActive: true,
      });
      fetchCategories();
    } catch (err) {
      console.error("Failed to create category", err);
      alert("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page active">
      <div className="admin-page-header p-10 flex items-start justify-between border-b border-gold/10">
        <div>
          <h1 className="font-display text-4xl italic text-black-deep">Categories</h1>
          <p className="text-secondary text-sm mt-2 font-medium">Manage service categories shown on the platform.</p>
        </div>
        <button className="bg-gold text-black-deep px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:shadow-luxe transition-all flex items-center gap-2 border-0 cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Category
        </button>
      </div>

      <div className="categories-grid">
        {loading ? (
          <div className="col-span-full text-center py-20 text-slate-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 italic text-slate-400">
            No categories created yet.
          </div>
        ) : (
          categories.map((category) => (
            <div key={category?.id} className="category-card">
              <div className="cat-icon text-xl">
                {category?.iconUrl ? (
                  <img src={category.iconUrl} alt={category.name} className="w-6 h-6 object-contain" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.72 0 3.33.48 4.7 1.32" /></svg>
                )}
              </div>
              <div className="cat-name uppercase">{category?.name}</div>
              <div className="cat-count">Order: {category?.displayOrder}</div>
              <div className="cat-actions mt-auto">
                <button className="admin-btn admin-btn-ghost admin-btn-sm">Edit</button>
                <button className="admin-btn admin-btn-red admin-btn-sm">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black-deep/40 backdrop-blur-md z-[1001] flex items-center justify-center p-4">
          <div className="bg-cream rounded-[40px] w-full max-w-md shadow-luxe overflow-hidden border border-gold/20 animate-slide-up">
            <div className="bg-gold p-10 text-black-deep">
              <h2 className="font-display text-3xl italic">New Category</h2>
              <p className="text-black-deep/60 text-[10px] uppercase font-bold tracking-widest mt-1">Define a new business category</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. HAIR STYLING"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#4a7cf7] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this category..."
                  className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#4a7cf7] outline-none transition-all h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Icon URL</label>
                  <input
                    type="url"
                    name="iconUrl"
                    value={form.iconUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#4a7cf7] outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={form.displayOrder}
                    onChange={handleChange}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#4a7cf7] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#4a7cf7]"
                />
                <label htmlFor="isActive" className="text-sm text-slate-600 font-medium">Category is Active</label>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white border border-gold/20 text-secondary py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-beige transition-all border-0 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gold text-black-deep py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:shadow-luxe transition-all disabled:opacity-50 border-0 cursor-pointer"
                >
                  {submitting ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
```

### src/features/categories/services/categoryService.js
```javascript
import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getCategoriesApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.BASE);
  return response.data;
};

export const createCategoryApi = async (categoryData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
  return response.data;
};
```

### src/features/dashboard/pages/Dashboard.jsx
```jsx
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
                  <div className="activity-text text-black-deep"><strong>Omar Farouq</strong> approved Luxe Hair Studio</div>
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
```

### src/features/reviews/pages/SalonReviews.jsx
```jsx
import React, { useEffect, useState } from "react";
import { getMyBusinessApi } from "@/features/salons/services/salonService";
import { getReviewsByBusinessApi, deleteReviewApi, updateReviewApi } from "../services/reviewService";

const SalonReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [salonId, setSalonId] = useState(null);

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Edit Modal State
    const [editingReview, setEditingReview] = useState(null);
    const [editForm, setEditForm] = useState({ rating: 5, comment: "", isAnonymous: false });
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchReviews = async (sid, p) => {
        try {
            const reviewsData = await getReviewsByBusinessApi(sid, { page: p, size: pageSize });
            setReviews(reviewsData.content || []);
            setTotalPages(reviewsData.totalPages || 0);
            setTotalElements(reviewsData.totalElements || 0);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to load reviews.");
        }
    };

    useEffect(() => {
        const fetchSalonAndReviews = async () => {
            try {
                setLoading(true);
                const salonData = await getMyBusinessApi();
                if (salonData && salonData.id) {
                    setSalonId(salonData.id);
                    await fetchReviews(salonData.id, page);
                } else {
                    setError("Could not identify your salon.");
                }
            } catch (err) {
                console.error("Error fetching salon data:", err);
                setError("Failed to load salon details.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalonAndReviews();
    }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
        try {
            await deleteReviewApi(id);
            // Refresh reviews
            fetchReviews(salonId, page);
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete review.");
        }
    };

    const openEditModal = (review) => {
        setEditingReview(review);
        setEditForm({
            rating: review.rating,
            comment: review.comment,
            isAnonymous: review.isAnonymous || false
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            await updateReviewApi(editingReview.id, editForm);
            setEditingReview(null);
            fetchReviews(salonId, page);
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update review.");
        } finally {
            setIsUpdating(false);
        }
    };

    const renderStars = (rating, interactive = false, onRatingChange = null) => {
        return (
            <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        width={interactive ? "24" : "16"}
                        height={interactive ? "24" : "16"}
                        viewBox="0 0 24 24"
                        fill={i < Math.floor(rating) ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
                        onClick={() => interactive && onRatingChange(i + 1)}
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
                {!interactive && <span className="ml-2 text-sm font-semibold text-gray-700">{rating}</span>}
            </div>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading && page === 0) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Reviews</h1>
                    <p className="text-gray-500 mt-2">Manage and monitor what your customers are saying.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium">Total Feedback</div>
                    <div className="text-2xl font-bold text-indigo-600">{totalElements}</div>
                </div>
            </header>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}

            {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No reviews yet</h3>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md group">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        {renderStars(review.rating)}
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                {formatDate(review.createdAt)}
                                            </span>
                                            {/* Action Buttons */}
                                            <div className="hidden group-hover:flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(review)}
                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
                                                    title="Edit Review"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
                                                    title="Delete Review"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed text-lg italic">
                                        "{review.comment}"
                                    </p>
                                    {review.imageUrls && review.imageUrls.length > 0 && (
                                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                            {review.imageUrls.map((url, idx) => (
                                                <img key={idx} src={url} alt="Review attachment" className="w-24 h-24 object-cover rounded-xl border border-gray-100" />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="md:w-72 flex flex-col gap-4 pt-4 md:pt-0 md:border-l md:pl-6 border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={review.customer?.profileImageUrl || "https://ui-avatars.com/api/?name=" + (review.customer?.fullName || "A")}
                                            className="w-10 h-10 rounded-full border border-gray-100"
                                            alt="Customer"
                                        />
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{review.isAnonymous ? "Anonymous User" : review.customer?.fullName}</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Customer</div>
                                        </div>
                                    </div>

                                    {review.staff && (
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={review.staff?.profileImageUrl || "https://ui-avatars.com/api/?name=" + (review.staff?.fullName || "S")}
                                                className="w-10 h-10 rounded-full border border-gray-100"
                                                alt="Staff"
                                            />
                                            <div>
                                                <div className="text-sm font-semibold text-gray-700">{review.staff.fullName}</div>
                                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Specialist</div>
                                            </div>
                                        </div>
                                    )}

                                    {review.booking && (
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">Booking Ref</div>
                                            <div className="text-xs font-mono text-indigo-600 font-bold">{review.booking.bookingNumber}</div>
                                            <div className="text-[10px] text-gray-500 mt-1">{formatDate(review.booking.bookingDate)}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 pb-10">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <span className="text-sm font-medium text-gray-600">Page {page + 1} of {totalPages}</span>
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(page + 1)}
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal Overlay */}
            {editingReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Update Review</h3>
                            <button onClick={() => setEditingReview(null)} className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-8">
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Overall Rating</label>
                                {renderStars(editForm.rating, true, (val) => setEditForm(prev => ({ ...prev, rating: val })))}
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Review Comment</label>
                                <textarea
                                    className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-[inherit] resize-none"
                                    value={editForm.comment}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Write your updated feedback here..."
                                    required
                                />
                            </div>
                            <div className="mb-8 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isAnon"
                                    checked={editForm.isAnonymous}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="isAnon" className="text-sm text-gray-600 font-medium cursor-pointer">Post as Anonymous</label>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingReview(null)}
                                    className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all bg-white cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 border-0 cursor-pointer"
                                >
                                    {isUpdating ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalonReviews;
```

### src/features/reviews/services/reviewService.js
```javascript
import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getReviewsByBusinessApi = async (salonId, params = {}) => {
    const { page = 0, size = 10, sortBy = "rating", sortDir = "ASC" } = params;
    const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.GET_BY_BUSINESS(salonId), {
        params: { page, size, sortBy, sortDir },
    });
    return response.data;
};
export const deleteReviewApi = async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.REVIEWS.DELETE_BY_ID(id));
    return response.data;
};

export const updateReviewApi = async (id, data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.REVIEWS.UPDATE_BY_ID(id), data);
    return response.data;
};
```

### src/features/salons/pages/AllSalons.jsx
```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSalonsApi } from "../services/salonService";

const AllSalons = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchAllSalons();
  }, [currentPage]);

  const fetchAllSalons = async () => {
    try {
      setLoading(true);
      const data = await getAllSalonsApi(currentPage, pageSize);
      setSalons(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Failed to fetch salons list");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED': return <span className="status-badge verified">Verified</span>;
      case 'PENDING': return <span className="status-badge pending">Pending</span>;
      case 'REJECTED': return <span className="status-badge rejected">Rejected</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  if (error) return <div className="admin-content text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="page active">
      <div className="admin-page-header p-10 flex flex-col border-b border-gold/10">
        <h1 className="font-display text-4xl italic text-black-deep">All Salons</h1>
        <p className="text-secondary text-sm mt-2 font-medium">Complete directory of all registered businesses.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <div className="admin-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search all salons..." />
          </div>
          <select className="admin-filter-select">
            <option>All Status</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Salon Name</th>
                <th>City</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">Loading salons...</td>
                </tr>
              ) : salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">No salons found.</td>
                </tr>
              ) : (
                salons.map((salon) => (
                  <tr key={salon.id}>
                    <td><strong>{salon.name}</strong></td>
                    <td className="td-muted">{salon.city}</td>
                    <td>{getStatusBadge(salon.verificationStatus)}</td>
                    <td className="td-muted">
                      <div className="flex items-center gap-1">
                        <span>⭐</span> {salon.averageRating.toFixed(1)}
                      </div>
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => navigate(`/super-admin/salons/${salon.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="page-info">
              Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
            </span>
            <div className="page-btns">
              <button
                className="page-btn"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSalons;
```

### src/features/salons/pages/MyAdminSalon.jsx
```jsx
import { useState, useEffect } from "react";
import { getMyBusinessApi, updateMyBusinessApi, uploadBannerApi, uploadSalonImagesApi, deleteSalonImageApi } from "../services/salonService";
import { getHolidaysByBusinessApi, addHolidayApi, updateHolidayApi, deleteHolidayApi } from "../services/holidayService";

// ─── Custom Hooks ────────────────────────────────────────────────────────────
function useReveal() {
    const [ref, setRef] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!ref) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(ref);
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
        );
        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref]);

    return { setRef, visible };
}

function Reveal({ children, delay = 0, className = "" }) {
    const { setRef, visible } = useReveal();
    return (
        <div
            ref={setRef}
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function SectionHeading({ subtitle, title, description, align = "left", mb = "mb-12" }) {
    const words = title.split(" ");
    const lastWord = words.pop();
    const mainTitle = words.join(" ");

    return (
        <div className={`${mb} ${align === "center" ? "text-center mx-auto" : ""}`}>
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold font-semibold mb-4 opacity-90">
                {subtitle}
            </span>
            <h2
                className="font-display font-light text-black-deep leading-[1.1] mb-6"
                style={{ fontSize: "clamp(36px,5vw,52px)" }}
            >
                {mainTitle}{" "}
                <em className="italic text-gold block md:inline">{lastWord}</em>
            </h2>
            {description && (
                <p className="text-[#7a7065] text-[15px] leading-relaxed font-light opacity-80 max-w-3xl">
                    {description}
                </p>
            )}
        </div>
    );
}

function Badge({ children, variant = "gold" }) {
    const variants = {
        gold: "bg-gold text-black-deep",
        outline: "bg-transparent border border-gold text-gold",
        glass: "backdrop-blur-md bg-white/10 text-white border border-white/20",
        dark: "bg-black-deep text-gold",
    };

    return (
        <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide ${variants[variant]}`}
        >
            {children}
        </span>
    );
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MyAdminSalon = () => {
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [holidaysLoading, setHolidaysLoading] = useState(false);

    // Add Holiday State
    const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);
    const [holidayFormData, setHolidayFormData] = useState({
        holidayDate: "",
        description: "",
        isRepeatingYearly: false
    });
    const [isEditingHoliday, setIsEditingHoliday] = useState(false);
    const [currentHolidayId, setCurrentHolidayId] = useState(null);

    const today = DAY_NAMES[new Date().getDay()];

    const fetchMySalon = async () => {
        try {
            setLoading(true);
            const data = await getMyBusinessApi();
            setSalon(data);
            setFormData(data);
            if (data?.id) fetchHolidays(data.id);
        } catch (err) {
            setError("Failed to fetch your salon details. Please ensure you are an authorized admin.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMySalon();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await updateMyBusinessApi(formData);
            await fetchMySalon();
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update business details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingBanner(true);
            await uploadBannerApi(file);
            await fetchMySalon();
            alert("Banner updated successfully!");
        } catch (err) {
            console.error("Banner upload error:", err);
            alert("Failed to upload banner image.");
        } finally {
            setIsUploadingBanner(false);
        }
    };

    const handleImagesUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            setIsUploadingImages(true);
            await uploadSalonImagesApi(files);
            await fetchMySalon();
            alert(`${files.length} images uploaded successfully!`);
        } catch (err) {
            console.error("Gallery upload error:", err);
            alert("Failed to upload gallery images.");
        } finally {
            setIsUploadingImages(false);
        }
    };

    const handleDeleteImage = async (imageUrl) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            await deleteSalonImageApi(imageUrl);
            await fetchMySalon();
            alert("Image removed successfully!");
        } catch (err) {
            console.error("Delete image error:", err);
            alert("Failed to delete image.");
        }
    };

    const fetchHolidays = async (businessId) => {
        try {
            setHolidaysLoading(true);
            const data = await getHolidaysByBusinessApi(businessId);
            setHolidays(data || []);
        } catch (err) {
            console.error("Failed to fetch holidays:", err);
        } finally {
            setHolidaysLoading(false);
        }
    };

    const handleHolidayInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setHolidayFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditHoliday = (holiday) => {
        setHolidayFormData({
            holidayDate: holiday.holidayDate,
            description: holiday.description,
            isRepeatingYearly: holiday.isRepeatingYearly
        });
        setCurrentHolidayId(holiday.id);
        setIsEditingHoliday(true);
        setIsAddHolidayModalOpen(true);
    };

    const handleHolidaySubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (isEditingHoliday) {
                await updateHolidayApi(currentHolidayId, holidayFormData);
                alert("Holiday updated successfully!");
            } else {
                await addHolidayApi(salon.id, holidayFormData);
                alert("Holiday scheduled successfully!");
            }
            await fetchHolidays(salon.id);
            setIsAddHolidayModalOpen(false);
            setHolidayFormData({ holidayDate: "", description: "", isRepeatingYearly: false });
            setIsEditingHoliday(false);
            setCurrentHolidayId(null);
        } catch (err) {
            console.error("Holiday submit error:", err);
            alert(`Failed to ${isEditingHoliday ? 'update' : 'schedule'} holiday.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteHoliday = async (id) => {
        if (!window.confirm("Are you sure you want to delete this holiday? This action cannot be undone.")) return;

        try {
            setHolidaysLoading(true);
            await deleteHolidayApi(id);
            await fetchHolidays(salon.id);
            alert("Holiday deleted successfully!");
        } catch (err) {
            console.error("Delete holiday error:", err);
            alert("Failed to delete holiday.");
        } finally {
            setHolidaysLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date).replace(',', ' ·');
    };

    if (loading && !salon) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-beige to-cream flex flex-col items-center justify-center gap-4 font-jost">
                <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                <p className="text-secondary text-lg">Loading your salon profile...</p>
            </div>
        );
    }

    if (error && !salon) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-beige to-cream flex items-center justify-center p-8 font-jost">
                <div className="bg-white/80 backdrop-blur-sm p-12 rounded-[40px] shadow-2xl max-w-lg text-center border border-gold/20">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h3 className="font-display text-3xl text-black-deep mb-4">Access Error</h3>
                    <p className="text-secondary text-sm mb-8 leading-relaxed">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-10 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase hover:bg-gold/80 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!salon) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-beige to-cream flex flex-col items-center justify-center gap-4 font-jost">
                <p className="text-secondary text-lg">No salon data found for your account.</p>
            </div>
        );
    }

    const salonImg = salon.bannerImageUrl || (salon.imageUrls && salon.imageUrls.length > 0 ? salon.imageUrls[0] : null);
    const locationText = [salon.address, salon.city, salon.state, salon.postalCode, salon.country]
        .filter(Boolean)
        .join(", ") || salon.address;

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "gallery", label: "Gallery", icon: "🖼️" },
        { id: "business", label: "Business", icon: "💼" },
        { id: "contact", label: "Contact", icon: "📞" },
        { id: "seo", label: "SEO", icon: "🔍" },
        { id: "holidays", label: "Holidays", icon: "🎉" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-beige to-cream font-jost font-light">
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
                <div className="absolute inset-0">
                    {salonImg && (
                        <img
                            src={salonImg}
                            alt={salon.name}
                            className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-10000"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                </div>

                <div className="absolute inset-0 z-10 flex items-center px-8 md:px-16 lg:px-24">
                    <div className="max-w-4xl text-white">
                        <Reveal delay={100}>
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-all mb-8 group"
                            >
                                <svg className="group-hover:-translate-x-1 transition-transform" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                <span className="text-xs uppercase tracking-[0.2em] font-medium">Dashboard</span>
                            </button>
                        </Reveal>

                        <Reveal delay={200}>
                            <div className="flex items-center gap-3 mb-6 flex-wrap">
                                {salon.verificationStatus === "VERIFIED" && (
                                    <Badge variant="glass">
                                        <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                        Verified Salon
                                    </Badge>
                                )}
                                <Badge variant="glass">
                                    <span className={`w-2 h-2 rounded-full ${salon.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'} mr-1`}></span>
                                    {salon.isOpen ? "Open Now" : "Closed"}
                                </Badge>
                            </div>
                        </Reveal>

                        <Reveal delay={300}>
                            <h1 className="font-display font-bold leading-tight mb-4 text-white"
                                style={{ fontSize: "clamp(56px,8vw,96px)" }}>
                                {salon.name}
                            </h1>
                        </Reveal>

                        <Reveal delay={400}>
                            <div className="flex items-center gap-6 flex-wrap mb-10">
                                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-1 text-gold">
                                        <span className="text-lg font-bold">
                                            {salon.averageRating > 0 ? salon.averageRating.toFixed(1) : "New"}
                                        </span>
                                        <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    </div>
                                    <div className="w-px h-4 bg-white/20" />
                                    <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                                        {salon.totalReviews > 0 ? `${salon.totalReviews} Reviews` : "No Reviews Yet"}
                                    </span>
                                </div>

                                {salon.city && (
                                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <span>{salon.city}</span>
                                    </div>
                                )}
                            </div>
                        </Reveal>

                        <Reveal delay={500}>
                            <div className="flex gap-4 sm:gap-6 flex-wrap">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="group relative px-10 py-5 rounded-full bg-gold text-black-deep text-sm font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                                >
                                    <span className="relative z-10">Edit Business</span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>

                                <label className="group relative px-10 py-5 rounded-full border-2 border-white/30 text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-white/10 hover:border-white/50 cursor-pointer flex items-center justify-center">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleBannerUpload}
                                        disabled={isUploadingBanner}
                                    />
                                    <span className="flex items-center gap-2">
                                        {isUploadingBanner ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            "Upload Banner"
                                        )}
                                    </span>
                                </label>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Tab Navigation */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gold/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                        ? "bg-gold text-black-deep shadow-lg"
                                        : "text-secondary hover:text-black-deep hover:bg-white/50"
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {activeTab === "overview" && (
                    <Reveal>
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-secondary uppercase tracking-wider">Total Bookings</span>
                                    </div>
                                    <p className="text-3xl font-display text-black-deep font-bold">{salon.totalBookings || 0}</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-secondary uppercase tracking-wider">Average Rating</span>
                                    </div>
                                    <p className="text-3xl font-display text-black-deep font-bold">{salon.averageRating?.toFixed(1) || '0.0'}</p>
                                    <div className="flex text-gold text-sm mt-2">
                                        {"★".repeat(Math.round(salon.averageRating || 0))}{"☆".repeat(5 - Math.round(salon.averageRating || 0))}
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <line x1="9" y1="9" x2="15" y2="15" />
                                                <line x1="15" y1="9" x2="9" y2="15" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-secondary uppercase tracking-wider">QR Scans</span>
                                    </div>
                                    <p className="text-3xl font-display text-black-deep font-bold">{salon.qrCodeScanCount || 0}</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M5.5 20v-2a6 6 0 0 1 12 0v2" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-secondary uppercase tracking-wider">Total Reviews</span>
                                    </div>
                                    <p className="text-3xl font-display text-black-deep font-bold">{salon.totalReviews || 0}</p>
                                </div>
                            </div>

                            {/* Business Overview and Admin */}
                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <line x1="9" y1="3" x2="9" y2="21" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-2xl text-black-deep">Business Overview</h3>
                                            <p className="text-secondary text-xs">Key business information and identifiers</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Business ID</h4>
                                                <p className="text-sm font-medium text-black-deep bg-beige p-3 rounded-xl font-mono">#{salon.id}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Registration Number</h4>
                                                <p className="text-sm font-medium text-black-deep bg-beige p-3 rounded-xl font-mono">{salon.registrationNumber || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Created At</h4>
                                                <p className="text-sm text-black-deep bg-beige p-3 rounded-xl">{formatDate(salon.createdAt)}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Last Updated</h4>
                                                <p className="text-sm text-black-deep bg-beige p-3 rounded-xl">{formatDate(salon.updatedAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-2xl text-black-deep">Admin</h3>
                                            <p className="text-secondary text-xs">Account administrator</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center text-white text-xl font-bold">
                                            {salon.adminName?.[0]?.toUpperCase() || 'A'}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-black-deep text-lg">{salon.adminName}</h4>
                                            <p className="text-secondary text-sm">ID: #{salon.adminId}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gold/10">
                                        <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-3">Admin Email</h4>
                                        <a href={`mailto:${salon.adminEmail}`} className="text-gold hover:underline text-sm break-all">
                                            {salon.adminEmail}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {activeTab === "gallery" && (
                    <Reveal>
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <SectionHeading
                                    subtitle="Portfolio"
                                    title="Salon Gallery"
                                    description="Manage the visual showcase of your salon's interior and work."
                                    mb="mb-0"
                                />
                                <label className="group relative px-8 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex items-center justify-center shrink-0">
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImagesUpload}
                                        disabled={isUploadingImages}
                                    />
                                    <span className="relative z-10 flex items-center gap-2">
                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                        {isUploadingImages ? "Uploading..." : "Add Images"}
                                    </span>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {salon.imageUrls?.map((url, idx) => (
                                    <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-beige border border-gold/10 shadow-sm hover:shadow-xl transition-all">
                                        <img
                                            src={url}
                                            alt={`Salon ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                                            <button
                                                onClick={() => handleDeleteImage(url)}
                                                className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110"
                                                title="Delete Image"
                                            >
                                                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!salon.imageUrls || salon.imageUrls.length === 0) && (
                                    <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold">
                                            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <path d="M21 15l-5-5L5 21" />
                                            </svg>
                                        </div>
                                        <h4 className="text-black-deep font-semibold text-lg">No images in gallery</h4>
                                        <p className="text-secondary text-sm mt-2 max-w-sm">Upload your first set of images to showcase your business.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Reveal>
                )}

                {activeTab === "holidays" && (
                    <Reveal>
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <SectionHeading
                                    subtitle="Schedule"
                                    title="Salon Holidays"
                                    description="Scheduled closures and public holidays for your business."
                                    mb="mb-0"
                                />
                                <button
                                    onClick={() => {
                                        setHolidayFormData({ holidayDate: "", description: "", isRepeatingYearly: false });
                                        setIsEditingHoliday(false);
                                        setIsAddHolidayModalOpen(true);
                                    }}
                                    className="group relative px-8 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center shrink-0"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                        Schedule Holiday
                                    </span>
                                </button>
                            </div>

                            {holidaysLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {holidays.map((holiday) => (
                                        <div key={holiday.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                                                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                            <line x1="16" y1="2" x2="16" y2="6" />
                                                            <line x1="8" y1="2" x2="8" y2="6" />
                                                            <line x1="3" y1="10" x2="21" y2="10" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-display text-lg text-black-deep font-bold">{holiday.description}</h4>
                                                        <p className="text-gold text-sm">
                                                            {new Date(holiday.holidayDate).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                {holiday.isRepeatingYearly && (
                                                    <span className="px-3 py-1 bg-black-deep text-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                        Annual
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gold/10">
                                                <button
                                                    onClick={() => handleEditHoliday(holiday)}
                                                    className="px-4 py-2 rounded-full bg-gold/10 text-gold text-xs font-bold hover:bg-gold hover:text-black-deep transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteHoliday(holiday.id)}
                                                    className="px-4 py-2 rounded-full bg-red-50 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {holidays.length === 0 && (
                                        <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold">
                                                <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </div>
                                            <h4 className="text-black-deep font-semibold text-lg">No holidays found</h4>
                                            <p className="text-secondary text-sm mt-2 max-w-sm">Schedule your first holiday closure for your salon.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Reveal>
                )}

                {activeTab === "business" && (
                    <Reveal>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                <SectionHeading subtitle="About" title="Business Description" mb="mb-6" />
                                <p className="text-secondary text-lg leading-relaxed">{salon.description || "No description provided."}</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                <SectionHeading subtitle="Expertise" title="Categories" mb="mb-6" />
                                <div className="flex flex-wrap gap-3">
                                    {salon.categories?.length > 0 ? (
                                        salon.categories.map((cat) => (
                                            <span key={cat.id} className="px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium">
                                                {cat.name}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-secondary">No categories added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {activeTab === "contact" && (
                    <Reveal>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                <SectionHeading subtitle="Get in Touch" title="Contact Information" mb="mb-6" />
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                                            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Phone</h4>
                                            <p className="text-lg text-black-deep">{salon.phoneNumber || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                                            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                                <path d="m22 7-10 7L2 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Email</h4>
                                            <a href={`mailto:${salon.email}`} className="text-lg text-gold hover:underline">
                                                {salon.email || "Not provided"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                <SectionHeading subtitle="Visit Us" title="Location" mb="mb-6" />
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Address</h4>
                                        <p className="text-lg text-black-deep leading-relaxed">{locationText}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {activeTab === "seo" && (
                    <Reveal>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                            <SectionHeading subtitle="Search Engine" title="SEO Information" mb="mb-8" />
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Meta Description</h4>
                                    <div className="bg-beige p-5 rounded-2xl text-black-deep italic border border-gold/10">
                                        "{salon.metaDescription || `Luxury beauty treatments and hair services at ${salon.name}.`}"
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Meta Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {salon.metaKeywords?.split(',').map((kw, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-beige rounded-full text-sm text-black-deep border border-gold/10">
                                                {kw.trim()}
                                            </span>
                                        ))}
                                        {(!salon.metaKeywords || salon.metaKeywords.length === 0) && (
                                            <p className="text-secondary italic">No keywords set</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
                    <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative my-8 animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-10 py-8 border-b border-gold/10 flex justify-between items-center rounded-t-[40px] z-10">
                            <div>
                                <h3 className="font-display text-3xl text-black-deep">Edit Business</h3>
                                <p className="text-secondary text-xs uppercase tracking-widest font-bold mt-1">Refine your salon presence</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black-deep transition-all"
                            >
                                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdateSubmit} className="p-10">
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <h4 className="text-xs uppercase tracking-[0.3em] text-gold font-bold border-b border-gold/20 pb-2">Basic Info</h4>
                                    <div>
                                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Salon Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description || ''}
                                            onChange={handleInputChange}
                                            className="w-full h-32 px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep resize-none"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 bg-beige p-5 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="isOpen"
                                            name="isOpen"
                                            checked={formData.isOpen || false}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded accent-gold"
                                        />
                                        <label htmlFor="isOpen" className="text-sm font-bold text-black-deep cursor-pointer">Business is currently Open</label>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-6">
                                    <h4 className="text-xs uppercase tracking-[0.3em] text-black-deep font-bold border-b border-black-deep/10 pb-2">Contact Details</h4>
                                    <div>
                                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Business Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Latitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                name="latitude"
                                                value={formData.latitude || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Longitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                name="longitude"
                                                value={formData.longitude || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Info */}
                                <div className="md:col-span-2 space-y-6">
                                    <h4 className="text-xs uppercase tracking-[0.3em] text-gold font-bold border-b border-gold/20 pb-2">Location & SEO</h4>
                                    <div>
                                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">City</label>
                                            <input type="text" name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">State</label>
                                            <input type="text" name="state" value={formData.state || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Postal Code</label>
                                            <input type="text" name="postalCode" value={formData.postalCode || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Country</label>
                                            <input type="text" name="country" value={formData.country || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep" required />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Meta Description (SEO)</label>
                                            <textarea
                                                name="metaDescription"
                                                value={formData.metaDescription || ''}
                                                onChange={handleInputChange}
                                                className="w-full h-24 px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep resize-none"
                                                placeholder="Brief description for search engines"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Meta Keywords</label>
                                            <textarea
                                                name="metaKeywords"
                                                value={formData.metaKeywords || ''}
                                                onChange={handleInputChange}
                                                className="w-full h-24 px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep resize-none"
                                                placeholder="e.g. hair, nails, spa, luxury (comma separated)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 sticky bottom-0 bg-white/90 backdrop-blur-md py-6 border-t border-gold/10 rounded-b-[40px]">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-8 py-4 rounded-full border-2 border-black-deep/10 text-black-deep text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-8 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase shadow-lg hover:bg-gold/80 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Holiday Modal */}
            {isAddHolidayModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-gold/10 flex justify-between items-center rounded-t-[40px]">
                            <div>
                                <h3 className="font-display text-3xl text-black-deep">{isEditingHoliday ? 'Update' : 'Schedule'} Holiday</h3>
                                <p className="text-secondary text-xs uppercase tracking-widest font-bold mt-1">
                                    {isEditingHoliday ? 'Modify your closure details' : 'Mark your business as closed'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsAddHolidayModalOpen(false);
                                    setIsEditingHoliday(false);
                                }}
                                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black-deep transition-all"
                            >
                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleHolidaySubmit} className="p-10 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Holiday Date</label>
                                <input
                                    type="date"
                                    name="holidayDate"
                                    value={holidayFormData.holidayDate}
                                    onChange={handleHolidayInputChange}
                                    className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="e.g. Holi Festival, New Year's Day"
                                    value={holidayFormData.description}
                                    onChange={handleHolidayInputChange}
                                    className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3 bg-beige p-5 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="isRepeatingYearly"
                                    name="isRepeatingYearly"
                                    checked={holidayFormData.isRepeatingYearly}
                                    onChange={handleHolidayInputChange}
                                    className="w-5 h-5 rounded accent-gold cursor-pointer"
                                />
                                <label htmlFor="isRepeatingYearly" className="text-sm font-bold text-black-deep cursor-pointer">
                                    Repeats Annually
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-full bg-black-deep text-gold text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-black disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                                        {isEditingHoliday ? "Updating..." : "Scheduling..."}
                                    </span>
                                ) : (
                                    isEditingHoliday ? "Update Holiday" : "Schedule Holiday"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default MyAdminSalon;```

### src/features/salons/pages/PendingSalons.jsx
```jsx
import { useState, useEffect } from "react";
import { getPendingSalonsApi, verifySalonApi } from "../services/salonService";

const PendingSalons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchPendingSalons();
  }, [currentPage]);

  const fetchPendingSalons = async () => {
    try {
      setLoading(true);
      const data = await getPendingSalonsApi(currentPage, pageSize);
      setSalons(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Failed to fetch pending salons");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      setActionLoading(id);
      await verifySalonApi(id, status);
      fetchPendingSalons();
    } catch (err) {
      alert(`Failed to ${status.toLowerCase()} salon. Please try again.`);
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (error) return <div className="admin-content text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="page active">
      <div className="admin-page-header p-10 flex flex-col border-b border-gold/10">
        <h1 className="font-display text-4xl italic text-black-deep">Pending Salons</h1>
        <p className="text-secondary text-sm mt-2 font-medium">Review and approve salon registration requests.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <select className="admin-filter-select">
            <option>All Submissions</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="admin-toolbar-right">
          <div className="admin-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search salons..." />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Salon Name</th>
                <th>City</th>
                <th>Owner ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">Loading pending salons...</td>
                </tr>
              ) : salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">No pending salons found.</td>
                </tr>
              ) : (
                salons.map((salon) => (
                  <tr key={salon.id}>
                    <td><strong>{salon.name}</strong></td>
                    <td className="td-muted">{salon.city}</td>
                    <td className="td-mono">{salon.ownerUserId}</td>
                    <td>
                      <span className="status-badge pending">Pending</span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="admin-btn admin-btn-green admin-btn-sm"
                          onClick={() => handleVerify(salon.id, 'VERIFIED')}
                          disabled={actionLoading === salon.id}
                        >
                          {actionLoading === salon.id ? "..." : "Approve"}
                        </button>
                        <button
                          className="admin-btn admin-btn-red admin-btn-sm"
                          onClick={() => handleVerify(salon.id, 'REJECTED')}
                          disabled={actionLoading === salon.id}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="page-info">
              Showing {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
            </span>
            <div className="page-btns">
              <button
                className="page-btn"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingSalons;
```

### src/features/salons/pages/SalonDetails.jsx
```jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSalonByIdApi } from "../services/salonService";

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        setLoading(true);
        const data = await getSalonByIdApi(id);
        setSalon(data);
      } catch (err) {
        setError("Failed to fetch salon details. It might not exist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id]);

  if (loading) return (
    <div className="page active">
        <div className="text-center py-20 text-slate-400 animate-pulse">Loading Salon Profile...</div>
    </div>
  );
  
  if (error) return (
    <div className="page active">
        <div className="admin-card max-w-lg mx-auto mt-12 p-8 text-center border-red-100">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-red-600 font-bold text-lg mb-2">Error</h3>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <button onClick={() => navigate(-1)} className="admin-btn admin-btn-primary">Go Back</button>
        </div>
    </div>
  );

  if (!salon) return null;

  return (
    <div className="page active">
      {/* Header / Navigation */}
      <div className="admin-page-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap'}}>
        <div className="flex items-center gap-4">
            <button 
            onClick={() => navigate(-1)}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            style={{width: '32px', height: '32px', padding: '0', justifyContent: 'center'}}
            >
                ‹
            </button>
            <div>
                <h1 className="flex items-center gap-3">
                    {salon.name}
                    <span className={`status-badge ${salon.verificationStatus === 'VERIFIED' ? 'verified' : 'pending'}`} style={{fontSize: '10px'}}>
                        {salon.verificationStatus}
                    </span>
                </h1>
                <p>Business Profile & Verification Details.</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="admin-btn admin-btn-red">Suspend Business</button>
            <button className="admin-btn admin-btn-primary">Verify Documentation</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Essential Info */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="admin-card overflow-hidden">
            <div className="h-56 bg-slate-100 relative group">
                {salon.bannerImageUrl ? (
                    <img src={salon.bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold bg-gradient-to-br from-slate-50 to-slate-100">
                        No Banner Provided
                    </div>
                )}
            </div>
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Business Description</h3>
                        <p className="text-slate-700 leading-relaxed italic text-sm">"{salon.description}"</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                            <span className="text-slate-400">Registration #</span>
                            <span className="font-mono font-bold text-slate-900">{salon.registrationNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                            <span className="text-slate-400">Official Email</span>
                            <span className="font-bold text-[#4a7cf7]">{salon.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                            <span className="text-slate-400">Contact Phone</span>
                            <span className="font-bold text-slate-900">{salon.phoneNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                            <span className="text-slate-400">On-boarded Date</span>
                            <span className="font-bold text-slate-600">{salon.createdAt?.split('T')[0]}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-card p-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    📍 Location Details
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-slate-900 font-bold text-sm">{salon.address}</p>
                        <p className="text-slate-500 text-xs mt-1">{salon.city}, {salon.state}</p>
                        <p className="text-slate-400 text-[10px] uppercase font-bold mt-2">{salon.country} (CP: {salon.postalCode})</p>
                    </div>
                </div>
            </div>

            <div className="admin-card p-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    🌐 Domain Identity
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Domain</label>
                        <a href={salon.fullDomainUrl} target="_blank" rel="noreferrer" className="block text-[#4a7cf7] font-bold truncate hover:underline text-sm">
                            {salon.domainName}
                        </a>
                    </div>
                    <div className="pt-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Keywords</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {salon.metaKeywords?.split(',').map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] rounded font-bold uppercase">
                                    {kw.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="admin-card p-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Mapped Categories</h3>
            <div className="flex flex-wrap gap-2">
                {salon.categories?.map((cat) => (
                    <div key={cat.id} className="status-badge active" style={{padding: '6px 14px', borderRadius: '12px'}}>
                        {cat.name}
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Admin & Stats */}
        <div className="space-y-6">
            <div className="admin-card p-8 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4a7cf7] rounded-full blur-[80px] opacity-20"></div>
                <h3 className="text-[10px] font-bold text-[#4a7cf7] uppercase tracking-[0.2em] mb-8 text-center relative z-10">Owner Identity</h3>
                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="avatar" style={{width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)'}}>
                        {salon.adminName?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-white">{salon.adminName}</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase">Account ID: #{salon.adminId}</p>
                    </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 relative z-10">
                    <p className="text-[9px] font-bold text-[#4a7cf7] uppercase tracking-widest mb-1">Official Email</p>
                    <p className="text-xs font-medium truncate">{salon.adminEmail || salon.email}</p>
                </div>
            </div>

            <div className="admin-card p-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Business Metrics</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-bold text-slate-900">{salon.averageRating?.toFixed(1) || '0.0'}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Rating</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-bold text-slate-900">{salon.totalReviews || 0}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Reviews</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-bold text-slate-900">{salon.totalBookings || 0}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Bookings</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-bold text-slate-900">{salon.qrCodeScanCount || 0}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Scans</p>
                    </div>
                </div>
            </div>

            <div className="admin-card p-8 text-center border-dashed border-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-slate-400">Access Key Profile</h3>
                <div className="w-32 h-32 bg-slate-50 mx-auto rounded-2xl mb-4 flex items-center justify-center p-3 border border-slate-100">
                    {salon.qrCodeUrl ? (
                        <img src={salon.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-4xl">📱</span>
                    )}
                </div>
                <button className="w-full admin-btn admin-btn-ghost admin-btn-sm justify-center">
                    Re-generate Domain
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SalonDetails;
```

### src/features/salons/pages/VerifiedSalons.jsx
```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVerifiedSalonsApi } from "../services/salonService";

const VerifiedSalons = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchVerifiedSalons();
  }, [currentPage]);

  const fetchVerifiedSalons = async () => {
    try {
      setLoading(true);
      const data = await getVerifiedSalonsApi(currentPage, pageSize);
      setSalons(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Failed to fetch verified salons");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (error) return <div className="admin-content text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="page active">
      <div className="admin-page-header p-10 flex flex-col border-b border-gold/10">
        <h1 className="font-display text-4xl italic text-black-deep">Verified Salons</h1>
        <p className="text-secondary text-sm mt-2 font-medium">All approved and active salons on the platform.</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <select className="admin-filter-select">
            <option>All Cities</option>
            <option>Dubai</option>
            <option>Mumbai</option>
            <option>Riyadh</option>
            <option>Delhi</option>
          </select>
        </div>
        <div className="admin-toolbar-right">
          <div className="admin-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search verified salons..." />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Salon Name</th>
                <th>City</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">Loading verified salons...</td>
                </tr>
              ) : salons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">No verified salons found.</td>
                </tr>
              ) : (
                salons.map((salon) => (
                  <tr key={salon.id}>
                    <td><strong>{salon.name}</strong></td>
                    <td className="td-muted">{salon.city}</td>
                    <td className="td-muted">⭐ {salon.averageRating.toFixed(1)}</td>
                    <td>
                      <span className="status-badge verified">Verified</span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => navigate(`/super-admin/salons/${salon.id}`)}
                        >
                          View Details
                        </button>
                        <button className="admin-btn admin-btn-red admin-btn-sm">Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="page-info">
              Showing {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
            </span>
            <div className="page-btns">
              <button
                className="page-btn"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedSalons;
```

### src/features/salons/services/holidayService.js
```javascript
import axiosInstance from "../../../services/axiosInstance";
import { API_ENDPOINTS } from "../../../services/apiEndpoints";

export const getHolidaysByBusinessApi = async (businessId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.HOLIDAYS.GET_BY_BUSINESS(businessId));
    return response.data;
};

export const addHolidayApi = async (businessId, holidayData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.HOLIDAYS.ADD(businessId), holidayData);
    return response.data;
};

export const updateHolidayApi = async (id, holidayData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.HOLIDAYS.UPDATE_BY_ID(id), holidayData);
    return response.data;
};

export const deleteHolidayApi = async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.HOLIDAYS.DELETE_BY_ID(id));
    return response.data;
};
```

### src/features/salons/services/salonService.js
```javascript
import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getPendingSalonsApi = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_PENDING, {
    params: { page, size },
  });
  return response.data;
};
export const getAllSalonsApi = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_ALL, {
    params: { page, size },
  });
  return response.data;
};

export const getVerifiedSalonsApi = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_VERIFIED, {
    params: { page, size },
  });
  return response.data;
};

export const getSalonByIdApi = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_BY_ID(id));
  return response.data;
};

export const getMyBusinessApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_MY_BUSINESS);
  return response.data;
};

export const updateMyBusinessApi = async (data) => {
  const response = await axiosInstance.put(API_ENDPOINTS.SALONS.UPDATE_MY_BUSINESS, data);
  return response.data;
};

export const uploadBannerApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(API_ENDPOINTS.SALONS.UPLOAD_BANNER, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const uploadSalonImagesApi = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await axiosInstance.post(API_ENDPOINTS.SALONS.UPLOAD_IMAGES, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteSalonImageApi = async (imageUrl) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.SALONS.DELETE_IMAGE, {
    params: { imageUrl },
  });
  return response.data;
};

export const verifySalonApi = async (id, status) => {
  const response = await axiosInstance.put(API_ENDPOINTS.SALONS.VERIFY(id), null, {
    params: { status },
  });
  return response.data;
};
```

### src/features/services/pages/Services.jsx
```jsx
import { useState, useEffect } from "react";
import { getServicesByBusinessApi, createServiceApi, updateServiceApi, deleteServiceApi } from "../services/serviceService";
import { getMyBusinessApi } from "@/features/salons/services/salonService";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create service form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    durationMinutes: 30,
    category: "Salon",
    imageUrl: "",
    isActive: true,
    isPopular: false
  });
  const [submitting, setSubmitting] = useState(false);

  // Update service state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    price: 0,
    discountedPrice: 0,
    durationMinutes: 30,
    category: "Salon",
    imageUrl: "",
    isPopular: false
  });
  const [updating, setUpdating] = useState(false);

  // Delete service state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [deletingServiceName, setDeletingServiceName] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [popularOnly, setPopularOnly] = useState(false);


  useEffect(() => {
    fetchMyBusinessAndServices();
  }, [currentPage]);

  const fetchMyBusinessAndServices = async () => {
    try {
      setLoading(true);
      let bId = businessId;
      if (!bId) {
        const business = await getMyBusinessApi();
        bId = business.id;
        setBusinessId(bId);
      }

      const data = await getServicesByBusinessApi(bId, currentPage, 10);
      setServices(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : (type === "number" ? parseFloat(value) : value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createServiceApi(form);
      setIsModalOpen(false);
      setForm({
        name: "",
        description: "",
        price: 0,
        discountedPrice: 0,
        durationMinutes: 30,
        category: "Salon",
        imageUrl: "",
        isActive: true,
        isPopular: false
      });
      fetchMyBusinessAndServices();
    } catch (err) {
      console.error("Error creating service", err);
      alert("Failed to create service");
    } finally {
      setSubmitting(false);
    }
  };

  // Open update modal pre-filled with selected service data
  const openUpdateModal = (service) => {
    setEditingService(service);
    setUpdateForm({
      name: service.name || "",
      price: service.price || 0,
      discountedPrice: service.discountedPrice || 0,
      durationMinutes: service.durationMinutes || 30,
      category: service.category || "Salon",
      imageUrl: service.imageUrl || "",
      isPopular: service.isPopular || false
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateForm({
      ...updateForm,
      [name]: type === "checkbox" ? checked : (type === "number" ? parseFloat(value) : value)
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      setUpdating(true);
      await updateServiceApi(editingService.id, updateForm);
      setIsUpdateModalOpen(false);
      setEditingService(null);
      fetchMyBusinessAndServices();
    } catch (err) {
      console.error("Error updating service", err);
      alert("Failed to update service");
    } finally {
      setUpdating(false);
    }
  };

  // Delete service
  const openDeleteModal = (service) => {
    setDeletingServiceId(service.id);
    setDeletingServiceName(service.name);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteService = async () => {
    if (!deletingServiceId) return;
    try {
      setDeleting(true);
      await deleteServiceApi(deletingServiceId);
      setIsDeleteModalOpen(false);
      setDeletingServiceId(null);
      setDeletingServiceName("");
      fetchMyBusinessAndServices();
    } catch (err) {
      console.error("Error deleting service", err);
      alert("Failed to delete service");
    } finally {
      setDeleting(false);
    }
  };


  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || service.category === categoryFilter;
    const matchesStatus = !statusFilter || (statusFilter === "active" ? service.isActive : !service.isActive);
    const matchesPopular = !popularOnly || service.isPopular;
    return matchesSearch && matchesCategory && matchesStatus && matchesPopular;
  });


  return (
    <div className="page active" style={{ minHeight: '100vh', padding: '0' }}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@600;700&display=swap');

        .services-container {
          font-family: 'Jost', sans-serif;
          color: #1C1C1C;
          padding: 4rem;
          width: 100%;
          margin: 0 auto;
          background: #F7F3EE;
          min-height: 100vh;
        }

        .services-container *, .services-container *::before, .services-container *::after { 
            box-sizing: border-box; 
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .page-header-left h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          font-style: italic;
          font-weight: 400;
          color: #1C1C1C;
          margin: 0;
        }

        .page-header-left p {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7a7065;
          margin-top: 0.5rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #C8A951;
          color: #1C1C1C;
          border: none;
          padding: 1rem 2rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: 'Jost', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .btn-primary:hover { 
          background: #B69843; 
          box-shadow: 0 10px 30px -10px rgba(200, 169, 81, 0.5);
          transform: translateY(-2px);
        }

        /* Removed stats bar styles */

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 320px;
        }

        .search-wrap svg {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s;
        }

        .search-input:focus { border-color: #C8A951; }
        .search-input::placeholder { color: #9CA3AF; }

        .filter-select {
          padding: 8px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #374151;
          background: #FFFFFF;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 30px;
          transition: border-color 0.15s;
        }
        .filter-select:focus { border-color: #C8A951; }

        .toggle-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #6B7280;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          user-select: none;
        }
        .toggle-pill:hover { border-color: #1B3F6E; color: #1B3F6E; }
        .toggle-pill.on {
          background: #EFF4FB;
          border-color: #BFDBFE;
          color: #1B3F6E;
          font-weight: 500;
        }

        .table-container {
          background: #FDFAF6;
          border: 1px solid rgba(200, 169, 81, 0.1);
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 10px 40px -15px rgba(200, 169, 81, 0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          background: #F9FAFB;
          border-bottom: 1px solid #E5E7EB;
        }

        thead th {
          padding: 11px 16px;
          text-align: left;
          font-size: 11.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #6B7280;
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid #F3F4F6;
          transition: background 0.12s;
        }

        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #F8FAFC; }

        tbody td {
          padding: 14px 16px;
          vertical-align: middle;
          font-size: 13.5px;
          color: #374151;
        }

        .svc-image {
          width: 58px; height: 58px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #E5E7EB;
          background: #F9FAFB;
          display: block;
        }

        .img-placeholder {
          width: 58px; height: 58px;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          background: #F9FAFB;
          display: flex; align-items: center; justify-content: center;
          color: #9CA3AF;
        }

        .svc-name {
          font-weight: 600;
          font-size: 14px;
          color: #111827;
          margin-bottom: 3px;
        }

        .svc-desc {
          font-size: 12px;
          color: #6B7280;
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 500;
        }

        .badge-gray {
          background: #F3F4F6;
          color: #374151;
          border: 1px solid #E5E7EB;
        }

        .badge-green {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .badge-amber {
          background: #FFFBEB;
          color: #92400E;
          border: 1px solid #FCD34D;
        }

        .badge-popular {
          background: #FEFCE8;
          color: #854D0E;
          border: 1px solid #FDE68A;
        }

        .badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-badges { display: flex; flex-direction: column; gap: 5px; }

        .price-original {
          font-size: 12px;
          color: #9CA3AF;
          text-decoration: line-through;
          display: block;
        }

        .price-main {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
        }

        .price-label {
          font-size: 11px;
          color: #6B7280;
          margin-top: 2px;
        }

        .staff-zero {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #92400E;
        }

        .action-wrap { position: relative; }

        .btn-update {
          background: #EFF4FB;
          color: #1B3F6E;
          border: 1px solid #BFDBFE;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-update:hover { background: #DCE7F5; }

        .btn-delete {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          margin-left: 6px;
        }
        .btn-delete:hover { background: #FEE2E2; }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .delete-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .delete-modal {
          background: #FFFFFF;
          width: 100%;
          max-width: 420px;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          text-align: center;
        }

        .delete-modal-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #FEF2F2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .delete-modal-body {
          padding: 32px 32px 24px;
        }

        .delete-modal-body h3 {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px;
        }

        .delete-modal-body p {
          font-size: 13.5px;
          color: #6B7280;
          margin: 0;
          line-height: 1.5;
        }

        .delete-modal-body .service-name-highlight {
          font-weight: 600;
          color: #DC2626;
        }

        .delete-modal-actions {
          display: flex;
          gap: 10px;
          padding: 0 32px 28px;
        }

        .delete-modal-actions button {
          flex: 1;
          padding: 11px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
        }

        .btn-cancel-delete {
          background: #F3F4F6;
          color: #6B7280;
        }
        .btn-cancel-delete:hover { background: #E5E7EB; }

        .btn-confirm-delete {
          background: #DC2626;
          color: white;
        }
        .btn-confirm-delete:hover { background: #B91C1C; }
        .btn-confirm-delete:disabled { opacity: 0.5; cursor: not-allowed; }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid #E5E7EB;
          background: #FFFFFF;
          border-radius: 0 0 10px 10px;
        }

        .pagination-info {
          font-size: 13px;
          color: #6B7280;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .page-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .page-btn.current {
          background: #1B3F6E;
          border-color: #1B3F6E;
          color: white;
          cursor: default;
          opacity: 1;
        }

        .empty-row td {
          text-align: center;
          padding: 48px 0;
          color: #6B7280;
          font-size: 13.5px;
        }
        `}
      </style>

      <main className="services-container">
        {/* ── Page Header ── */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>Services — Desert Pearl Beauty Lounge</h1>
            <p>Manage all services offered by this business &nbsp;·&nbsp; Business ID: {businessId || '...'} &nbsp;·&nbsp; Dubai</p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add New Service
          </button>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <div className="search-wrap">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search services…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(services.map(s => s.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div
            className={`toggle-pill ${popularOnly ? 'on' : ''}`}
            onClick={() => setPopularOnly(!popularOnly)}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Popular Only
          </div>
        </div>

        {/* ── Table ── */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '74px' }}>Image</th>
                <th>Service Name</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Pricing</th>
                <th>Status</th>
                <th>Bookings</th>
                <th>Staff</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="empty-row">
                  <td colSpan="9">Loading services...</td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="9">No services match your filters.</td>
                </tr>
              ) : (
                filteredServices.map(service => (
                  <tr key={service.id}>
                    <td>
                      {service.imageUrl ? (
                        <img className="svc-image" src={service.imageUrl} alt={service.name} />
                      ) : (
                        <div className="img-placeholder">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="svc-name">{service.name}</div>
                      <div className="svc-desc">{service.description}</div>
                    </td>
                    <td>
                      <span className="badge badge-gray">{service.category}</span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: '#111827', fontWeight: '500' }}>
                      {service.durationMinutes} min
                    </td>
                    <td>
                      {service.discountedPrice < service.price && (
                        <span className="price-original">₹{service.price.toFixed(2)}</span>
                      )}
                      <span className="price-main">₹{service.effectivePrice.toFixed(2)}</span>
                      <div className="price-label">Effective: ₹{service.effectivePrice.toFixed(2)}</div>
                    </td>
                    <td>
                      <div className="status-badges">
                        {service.isActive
                          ? <span className="badge badge-green"><span className="badge-dot"></span>Active</span>
                          : <span className="badge badge-gray"><span className="badge-dot"></span>Inactive</span>
                        }
                        {service.isPopular && (
                          <span className="badge badge-popular">⭐ Popular</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: '500', color: '#111827' }}>{service.totalBookings || 0}</td>
                    <td>
                      {(service.staffCount || 0) === 0 ? (
                        <span className="staff-zero">
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                          0 Staff
                        </span>
                      ) : (
                        <span style={{ fontWeight: '500', color: '#111827' }}>{service.staffCount} Staff</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-update" onClick={() => openUpdateModal(service)}>
                          Update
                        </button>
                        <button className="btn-delete" onClick={() => openDeleteModal(service)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <span className="pagination-info">
                Showing page {currentPage + 1} of {totalPages}
              </span>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <div className="page-btn current">{currentPage + 1}</div>
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal - Create Service (Keep original modal look or slightly modernise it? User mock didn't show modal, so I'll keep the existing one but styled better) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1001] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1B3F6E] p-8 text-white relative">
              <h2 className="text-2xl font-bold leading-none mb-2">ADD NEW SERVICE</h2>
              <p className="text-white opacity-80 font-bold text-xs uppercase tracking-widest">Expand your business menu</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                    placeholder="e.g. Hair Cut & Styling"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all h-20 text-sm"
                    placeholder="Detail what makes this service special..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Duration (Min)</label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={form.durationMinutes}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Offer Price (₹)</label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={form.discountedPrice}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-[#1B3F6E]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#1B3F6E]"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={form.isPopular}
                    onChange={handleChange}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Popular</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#1B3F6E] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#152f55] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Update Service */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1001] flex items-center justify-center p-4" onClick={() => setIsUpdateModalOpen(false)}>
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1B3F6E] p-8 text-white relative">
              <h2 className="text-2xl font-bold leading-none mb-2">UPDATE SERVICE</h2>
              <p className="text-white opacity-80 font-bold text-xs uppercase tracking-widest">Edit service details</p>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    value={updateForm.name}
                    onChange={handleUpdateChange}
                    required
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                    placeholder="e.g. Premium Hair Cut & Styling"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={updateForm.category}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Duration (Min)</label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={updateForm.durationMinutes}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={updateForm.price}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Offer Price (₹)</label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={updateForm.discountedPrice}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all font-bold text-[#1B3F6E]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={updateForm.imageUrl}
                    onChange={handleUpdateChange}
                    className="w-full bg-slate-50 border-transparent border focus:border-[#1B3F6E] outline-none p-3 rounded-xl transition-all text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={updateForm.isPopular}
                    onChange={handleUpdateChange}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Popular</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-[#1B3F6E] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#152f55] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="delete-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-body">
              <div className="delete-modal-icon">
                <svg width="28" height="28" fill="none" stroke="#DC2626" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <h3>Delete Service</h3>
              <p>Are you sure you want to delete <span className="service-name-highlight">{deletingServiceName}</span>? This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button className="btn-cancel-delete" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="btn-confirm-delete" disabled={deleting} onClick={handleDeleteService}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
```

### src/features/services/services/serviceService.js
```javascript
import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getServicesByBusinessApi = async (businessId, page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.GET_BY_BUSINESS(businessId), {
    params: { page, size }
  });
  return response.data;
};

export const createServiceApi = async (serviceData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.SERVICES.BASE, serviceData);
  return response.data;
};

export const updateServiceApi = async (serviceId, serviceData) => {
  const response = await axiosInstance.put(API_ENDPOINTS.SERVICES.UPDATE_BY_ID(serviceId), serviceData);
  return response.data;
};

export const deleteServiceApi = async (serviceId) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.SERVICES.DELETE_BY_ID(serviceId));
  return response.data;
};
```

### src/features/staff/pages/Staff.jsx
```jsx
import { useState, useEffect } from "react";
import { getStaffByBusinessApi, createStaffApi, updateStaffApi, getStaffByIdApi, deleteStaffApi, assignServicesToStaffApi, removeServicesFromStaffApi } from "../services/staffService";
import { getMyBusinessApi } from "@/features/salons/services/salonService";
import { getServicesByBusinessApi } from "@/features/services/services/serviceService";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);

  const [form, setForm] = useState({
    designation: "",
    bio: "",
    commission: 10.0,
    isAvailable: true,
    workStartTime: "09:00",
    workEndTime: "18:00",
    weeklyOffDays: ["SUNDAY"],
    role: "STAFF",
    userId: "",
    serviceIds: [],
  });
  const [submitting, setSubmitting] = useState(false);

  // Update staff state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    designation: "",
    bio: "",
    commission: 10.0,
    isAvailable: true,
    workStartTime: "09:00",
    workEndTime: "18:00",
    weeklyOffDays: ["SUNDAY"],
    serviceIds: [],
  });
  const [updating, setUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => { fetchStaffAndBusiness(); }, [currentPage]);

  const fetchStaffAndBusiness = async () => {
    try {
      setLoading(true);
      let bId = businessId;
      if (!bId) {
        const business = await getMyBusinessApi();
        bId = business.id;
        setBusinessId(bId);
        const servicesData = await getServicesByBusinessApi(bId, 0, 100);
        setAvailableServices(servicesData.content || []);
      }
      const data = await getStaffByBusinessApi(bId, currentPage, 10);
      setStaffList(data.body?.content || data.content || []);
      setTotalPages(data.body?.totalPages || data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching staff", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "serviceIds") {
      const id = parseInt(value);
      setForm((prev) => ({
        ...prev,
        serviceIds: prev.serviceIds.includes(id)
          ? prev.serviceIds.filter((s) => s !== id)
          : [...prev.serviceIds, id],
      }));
    } else if (name === "weeklyOffDays") {
      setForm((prev) => ({
        ...prev,
        weeklyOffDays: prev.weeklyOffDays.includes(value)
          ? prev.weeklyOffDays.filter((d) => d !== value)
          : [...prev.weeklyOffDays, value],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createStaffApi({
        ...form,
        userId: parseInt(form.userId),
        workStartTime: form.workStartTime + ":00",
        workEndTime: form.workEndTime + ":00",
      });
      setIsModalOpen(false);
      setForm({ designation: "", bio: "", commission: 10.0, isAvailable: true, workStartTime: "09:00", workEndTime: "18:00", weeklyOffDays: ["SUNDAY"], role: "STAFF", userId: "", serviceIds: [] });
      fetchStaffAndBusiness();
    } catch (err) {
      alert("Failed to create staff member");
    } finally {
      setSubmitting(false);
    }
  };

  // Profile view state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Delete staff state
  const [isDeleteStaffOpen, setIsDeleteStaffOpen] = useState(false);
  const [deletingStaffId, setDeletingStaffId] = useState(null);
  const [deletingStaffName, setDeletingStaffName] = useState("");
  const [deletingStaff, setDeletingStaff] = useState(false);

  const openDeleteStaffModal = (staff) => {
    setDeletingStaffId(staff.id);
    setDeletingStaffName(staff.userFullName);
    setIsDeleteStaffOpen(true);
  };

  const handleDeleteStaff = async () => {
    if (!deletingStaffId) return;
    try {
      setDeletingStaff(true);
      await deleteStaffApi(deletingStaffId);
      setIsDeleteStaffOpen(false);
      setDeletingStaffId(null);
      setDeletingStaffName("");
      fetchStaffAndBusiness();
    } catch (err) {
      console.error("Error deleting staff", err);
      alert("Failed to delete staff member");
    } finally {
      setDeletingStaff(false);
    }
  };

  // Assign services state
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignStaffId, setAssignStaffId] = useState(null);
  const [assignStaffName, setAssignStaffName] = useState("");
  const [assignSelectedIds, setAssignSelectedIds] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const openAssignModal = (staff) => {
    setAssignStaffId(staff.id);
    setAssignStaffName(staff.userFullName);
    // Pre-select current services
    const currentIds = staff.specializedServices
      ? staff.specializedServices.map(s => s.id || s)
      : (staff.serviceIds || []);
    setAssignSelectedIds(currentIds);
    setIsAssignOpen(true);
  };

  const toggleAssignService = (id) => {
    setAssignSelectedIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAssignServices = async () => {
    if (!assignStaffId) return;
    try {
      setAssigning(true);
      await assignServicesToStaffApi(assignStaffId, assignSelectedIds);
      setIsAssignOpen(false);
      // Refresh profile if open
      if (isProfileOpen && profileData && profileData.id === assignStaffId) {
        const data = await getStaffByIdApi(assignStaffId);
        setProfileData(data.body || data);
      }
      fetchStaffAndBusiness();
    } catch (err) {
      console.error("Error assigning services", err);
      alert("Failed to assign services");
    } finally {
      setAssigning(false);
    }
  };

  const openProfileModal = async (staff) => {
    try {
      setProfileLoading(true);
      setProfileData(staff); // show basic data immediately
      setIsProfileOpen(true);
      const data = await getStaffByIdApi(staff.id);
      setProfileData(data.body || data);
    } catch (err) {
      console.error("Error fetching staff profile", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Open update modal pre-filled with selected staff data (fetches fresh data)
  const openUpdateModal = async (staff) => {
    try {
      setEditingStaff(staff);
      setIsUpdateModalOpen(true);
      // Fetch full staff details from the API
      const data = await getStaffByIdApi(staff.id);
      const detail = data.body || data;
      setEditingStaff(detail);
      setUpdateForm({
        designation: detail.designation || "",
        bio: detail.bio || "",
        commission: detail.commission ?? 10.0,
        isAvailable: detail.isAvailable ?? true,
        workStartTime: detail.workStartTime ? detail.workStartTime.slice(0, 5) : "09:00",
        workEndTime: detail.workEndTime ? detail.workEndTime.slice(0, 5) : "18:00",
        weeklyOffDays: detail.weeklyOffDays || ["SUNDAY"],
        serviceIds: detail.specializedServices
          ? detail.specializedServices.map(s => s.id || s)
          : (detail.serviceIds || []),
      });
    } catch (err) {
      console.error("Error fetching staff details", err);
      // Fallback to list data
      setUpdateForm({
        designation: staff.designation || "",
        bio: staff.bio || "",
        commission: staff.commission ?? 10.0,
        isAvailable: staff.isAvailable ?? true,
        workStartTime: staff.workStartTime ? staff.workStartTime.slice(0, 5) : "09:00",
        workEndTime: staff.workEndTime ? staff.workEndTime.slice(0, 5) : "18:00",
        weeklyOffDays: staff.weeklyOffDays || ["SUNDAY"],
        serviceIds: staff.serviceIds || [],
      });
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "serviceIds") {
      const id = parseInt(value);
      setUpdateForm((prev) => ({
        ...prev,
        serviceIds: prev.serviceIds.includes(id)
          ? prev.serviceIds.filter((s) => s !== id)
          : [...prev.serviceIds, id],
      }));
    } else if (name === "weeklyOffDays") {
      setUpdateForm((prev) => ({
        ...prev,
        weeklyOffDays: prev.weeklyOffDays.includes(value)
          ? prev.weeklyOffDays.filter((d) => d !== value)
          : [...prev.weeklyOffDays, value],
      }));
    } else {
      setUpdateForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
      }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    try {
      setUpdating(true);
      await updateStaffApi(editingStaff.id, {
        ...updateForm,
        workStartTime: updateForm.workStartTime + ":00",
        workEndTime: updateForm.workEndTime + ":00",
      });
      setIsUpdateModalOpen(false);
      setEditingStaff(null);
      fetchStaffAndBusiness();
    } catch (err) {
      console.error("Error updating staff", err);
      alert("Failed to update staff member");
    } finally {
      setUpdating(false);
    }
  };

  const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const DAYS_FULL = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  const AVATAR_COLORS = ["#E8F0FE", "#E6F4EA", "#FEF3E2", "#FCE8E6", "#F3E8FD", "#E8F5E9", "#FFF3E0"];
  const AVATAR_TEXT = ["#1967D2", "#1E8E3E", "#E37400", "#D93025", "#8430CE", "#1B5E20", "#E65100"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .s-root {
          font-family: 'Jost', sans-serif;
          background: #F7F3EE;
          min-height: 100vh;
          padding: 3rem 4rem;
          color: #1C1C1C;
        }

        .s-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.75rem;
        }

        .s-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          font-style: italic;
          font-weight: 400;
          color: #1C1C1C;
          margin: 0;
        }

        .s-subtitle {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #7a7065;
          margin-top: 0.5rem;
        }

        .s-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #C8A951;
          color: #1C1C1C;
          border: none;
          border-radius: 100px;
          padding: 1rem 2rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .s-btn-primary:hover {
          background: #B69843;
          box-shadow: 0 10px 30px -10px rgba(200, 169, 81, 0.5);
          transform: translateY(-2px);
        }

        /* Stats */
        .s-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .s-stat {
          background: #FDFAF6;
          border: 1px solid rgba(200, 169, 81, 0.1);
          border-radius: 40px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px -15px rgba(200, 169, 81, 0.1);
          transition: all 0.4s ease;
        }

        .s-stat-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.4rem;
        }

        .s-stat-val {
          font-size: 1.6rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .s-stat-sub {
          font-size: 0.72rem;
          color: #9CA3AF;
          margin-top: 0.3rem;
        }

        /* Table card */
        .s-card {
          background: #FDFAF6;
          border: 1px solid rgba(200, 169, 81, 0.1);
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 10px 40px -15px rgba(200, 169, 81, 0.1);
        }

        .s-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid #F3F4F6;
        }

        .s-card-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
        }

        .s-card-count {
          font-size: 0.75rem;
          color: #9CA3AF;
          background: #F3F4F6;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-weight: 500;
        }

        table { width: 100%; border-collapse: collapse; }

        th {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          padding: 0.75rem 1.25rem;
          text-align: left;
          background: #FAFAFA;
          border-bottom: 1px solid #F3F4F6;
        }

        td {
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid #F9FAFB;
          font-size: 0.8125rem;
          vertical-align: middle;
        }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #FAFAFA; }

        .s-name-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .s-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
          overflow: hidden;
        }

        .s-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .s-name { font-weight: 600; color: #111827; line-height: 1.3; }
        .s-role { font-size: 0.75rem; color: #6B7280; margin-top: 0.1rem; }

        .s-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
          color: #111827;
        }

        .s-star { color: #F59E0B; font-size: 0.8rem; }

        .s-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 20px;
        }

        .s-dot { width: 5px; height: 5px; border-radius: 50%; }

        .s-badge.on { background: #DCFCE7; color: #16A34A; }
        .s-badge.on .s-dot { background: #16A34A; }
        .s-badge.off { background: #F3F4F6; color: #6B7280; }
        .s-badge.off .s-dot { background: #9CA3AF; }

        .s-action {
          background: none;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 0.35rem 0.7rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-action:hover {
          border-color: #C8A951;
          color: #1C1C1C;
          background: #C8A951;
        }

        .s-actions-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .s-action-view {
          background: none;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 0.35rem 0.7rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-action-view:hover {
          border-color: #8B5CF6;
          color: #8B5CF6;
          background: #F5F3FF;
        }

        .s-action-delete {
          background: none;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 0.35rem 0.7rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-action-delete:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: #FEF2F2;
        }

        .sd-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,0.5);
          backdrop-filter: blur(4px);
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: sfo 0.15s ease;
        }

        .sd-modal {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          animation: ssu 0.2s ease;
          text-align: center;
          overflow: hidden;
        }

        .sd-body {
          padding: 2rem 2rem 1.25rem;
        }

        .sd-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #FEF2F2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .sd-body h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.4rem;
        }

        .sd-body p {
          font-size: 0.8125rem;
          color: #6B7280;
          line-height: 1.5;
          margin: 0;
        }

        .sd-name {
          font-weight: 600;
          color: #EF4444;
        }

        .sd-actions {
          display: flex;
          gap: 0.625rem;
          padding: 0 2rem 1.75rem;
        }

        .sd-actions button {
          flex: 1;
          padding: 0.65rem;
          border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
        }

        .sd-cancel {
          background: #F3F4F6;
          color: #6B7280;
        }
        .sd-cancel:hover { background: #E5E7EB; }

        .sd-confirm {
          background: #EF4444;
          color: #fff;
        }
        .sd-confirm:hover { background: #DC2626; }
        .sd-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Empty & Loading */
        .s-empty {
          padding: 4rem 2rem;
          text-align: center;
        }

        .s-empty-icon {
          width: 48px;
          height: 48px;
          background: #F3F4F6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .s-empty-h { font-weight: 600; color: #374151; margin-bottom: 0.35rem; font-size: 0.9rem; }
        .s-empty-p { font-size: 0.8125rem; color: #9CA3AF; margin-bottom: 1.25rem; }

        .s-loading {
          padding: 4rem;
          text-align: center;
          font-size: 0.8125rem;
          color: #9CA3AF;
        }

        /* Pagination */
        .s-pager {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.3rem;
          padding: 0.875rem 1.25rem;
          border-top: 1px solid #F3F4F6;
        }

        .s-pg {
          width: 32px;
          height: 32px;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          background: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-pg:hover, .s-pg.active {
          background: #C8A951;
          border-color: #C8A951;
          color: #1C1C1C;
        }

        /* MODAL */
        .s-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,0.5);
          backdrop-filter: blur(4px);
          z-index: 1001;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: sfo 0.15s ease;
        }

        @keyframes sfo { from { opacity: 0; } to { opacity: 1; } }

        .s-modal {
          background: #fff;
          border-radius: 14px;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          animation: ssu 0.2s ease;
          overflow: hidden;
        }

        @keyframes ssu {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .s-mhead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F3F4F6;
          flex-shrink: 0;
        }

        .s-mtitle { font-size: 1rem; font-weight: 700; color: #111827; margin: 0; }
        .s-msub { font-size: 0.78rem; color: #6B7280; margin: 0.15rem 0 0 0; }

        .s-xbtn {
          width: 32px;
          height: 32px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          background: none;
          color: #6B7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          transition: all 0.15s;
        }

        .s-xbtn:hover { background: #F3F4F6; color: #111827; }

        .s-mbody {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .s-mbody::-webkit-scrollbar { width: 4px; }
        .s-mbody::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }

        .s-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .s-full { grid-column: 1 / -1; }

        .s-field { display: flex; flex-direction: column; gap: 0.35rem; }

        .s-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
        }

        .s-input, .s-textarea {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 0.6rem 0.875rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
          box-sizing: border-box;
        }

        .s-input:focus, .s-textarea:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        .s-input::placeholder, .s-textarea::placeholder { color: #9CA3AF; }
        .s-textarea { resize: none; height: 72px; }

        .s-sec {
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.625rem;
        }

        .s-days { display: flex; gap: 0.4rem; flex-wrap: wrap; }

        .s-day {
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          background: #fff;
          padding: 0.375rem 0.65rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-day.off {
          background: #FEF2F2;
          border-color: #FECACA;
          color: #EF4444;
        }

        .s-svcs {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.5rem;
        }

        .s-svc {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
          background: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .s-svc:hover { border-color: #93C5FD; }

        .s-svc.sel {
          border-color: #2563EB;
          background: #EFF6FF;
          color: #2563EB;
          font-weight: 600;
        }

        .s-mfoot {
          display: flex;
          gap: 0.75rem;
          padding: 1.125rem 1.5rem;
          border-top: 1px solid #F3F4F6;
          flex-shrink: 0;
        }

        .s-cancel {
          flex: 1;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          background: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
          padding: 0.7rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .s-cancel:hover { background: #F9FAFB; }

        .s-submit {
          flex: 2;
          border: none;
          border-radius: 8px;
          background: #2563EB;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #fff;
          padding: 0.7rem;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s;
        }

        .s-submit:hover:not(:disabled) {
          background: #1D4ED8;
          box-shadow: 0 4px 12px rgba(37,99,235,0.28);
        }

        .s-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .s-time-row { display: flex; align-items: center; gap: 0.5rem; }
        .s-sep { color: #9CA3AF; font-size: 0.8rem; flex-shrink: 0; }

        /* Profile Modal */
        .sp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,0.5);
          backdrop-filter: blur(4px);
          z-index: 1001;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: sfo 0.15s ease;
        }

        .sp-modal {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          animation: ssu 0.2s ease;
        }

        .sp-modal::-webkit-scrollbar { width: 4px; }
        .sp-modal::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }

        .sp-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 1.5rem 0;
        }

        .sp-avatar {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          flex-shrink: 0;
          overflow: hidden;
        }

        .sp-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .sp-info h2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .sp-info .sp-designation {
          font-size: 0.8125rem;
          color: #6B7280;
          margin-top: 0.15rem;
        }

        .sp-info .sp-availability { margin-top: 0.35rem; }

        .sp-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 32px;
          height: 32px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          background: none;
          color: #6B7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          transition: all 0.15s;
        }

        .sp-close:hover { background: #F3F4F6; color: #111827; }

        .sp-bio {
          padding: 1rem 1.5rem;
          font-size: 0.8125rem;
          color: #6B7280;
          line-height: 1.6;
          border-bottom: 1px solid #F3F4F6;
        }

        .sp-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-bottom: 1px solid #F3F4F6;
        }

        .sp-stat-item {
          text-align: center;
          padding: 1rem 0.5rem;
          border-right: 1px solid #F3F4F6;
        }

        .sp-stat-item:last-child { border-right: none; }

        .sp-stat-val {
          font-size: 1.3rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .sp-stat-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.2rem;
        }

        .sp-section {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #F3F4F6;
        }

        .sp-section:last-child { border-bottom: none; }

        .sp-section-title {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.75rem;
        }

        .sp-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .sp-detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .sp-detail-label {
          font-size: 0.6875rem;
          font-weight: 500;
          color: #9CA3AF;
        }

        .sp-detail-value {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #111827;
        }

        .sp-services-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .sp-svc-tag {
          font-size: 0.75rem;
          font-weight: 500;
          background: #EFF6FF;
          color: #2563EB;
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          border: 1px solid #BFDBFE;
        }

        .sp-days-list { display: flex; gap: 0.35rem; }

        .sp-day-tag {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.3rem 0.55rem;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          color: #6B7280;
          background: #fff;
        }

        .sp-day-tag.off {
          background: #FEF2F2;
          border-color: #FECACA;
          color: #EF4444;
        }

        .sp-loading {
          padding: 3rem;
          text-align: center;
          font-size: 0.8125rem;
          color: #9CA3AF;
        }

        .sp-assign-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          border: 1px dashed #93C5FD;
          border-radius: 8px;
          background: #EFF6FF;
          color: #2563EB;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          width: 100%;
          justify-content: center;
        }

        .sp-assign-btn:hover {
          background: #DBEAFE;
          border-color: #2563EB;
        }

        .sp-remove-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          border: 1px dashed #FECACA;
          border-radius: 8px;
          background: #FEF2F2;
          color: #EF4444;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          flex: 1;
          justify-content: center;
        }

        .sp-remove-btn:hover {
          background: #FEE2E2;
          border-color: #EF4444;
        }

        .sp-service-actions {
          display: flex;
          gap: 0.5rem;
        }

        .sp-assign-btn {
          flex: 1;
        }

        .sp-svc-tag-removable {
          font-size: 0.75rem;
          font-weight: 500;
          background: #EFF6FF;
          color: #2563EB;
          padding: 0.3rem 0.5rem 0.3rem 0.65rem;
          border-radius: 6px;
          border: 1px solid #BFDBFE;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .sp-svc-remove {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #93C5FD;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          font-size: 0.65rem;
          transition: all 0.15s;
        }

        .sp-svc-remove:hover {
          background: #DC2626;
          color: #fff;
        }

        /* Assign Services Modal */
        .sa-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,0.5);
          backdrop-filter: blur(4px);
          z-index: 1003;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: sfo 0.15s ease;
        }

        .sa-modal {
          background: #fff;
          border-radius: 14px;
          width: 100%;
          max-width: 520px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          animation: ssu 0.2s ease;
          overflow: hidden;
        }

        .sa-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F3F4F6;
          flex-shrink: 0;
        }

        .sa-head h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .sa-head p {
          font-size: 0.78rem;
          color: #6B7280;
          margin: 0.15rem 0 0 0;
        }

        .sa-body {
          padding: 1.25rem 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .sa-body::-webkit-scrollbar { width: 4px; }
        .sa-body::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }

        .sa-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: #2563EB;
          margin-bottom: 0.75rem;
        }

        .sa-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.5rem;
        }

        .sa-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.75rem;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
          background: #fff;
        }

        .sa-item:hover { border-color: #93C5FD; }

        .sa-item.selected {
          border-color: #2563EB;
          background: #EFF6FF;
        }

        .sa-check {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 2px solid #D1D5DB;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .sa-item.selected .sa-check {
          background: #2563EB;
          border-color: #2563EB;
        }

        .sa-svc-name {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #374151;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sa-item.selected .sa-svc-name {
          color: #2563EB;
          font-weight: 600;
        }

        .sa-foot {
          display: flex;
          gap: 0.75rem;
          padding: 1.125rem 1.5rem;
          border-top: 1px solid #F3F4F6;
          flex-shrink: 0;
        }

        .sa-foot .s-cancel { flex: 1; }
        .sa-foot .s-submit { flex: 2; }
      `}</style>

      <div className="s-root">
        <div className="s-header">
          <div>
            <h1 className="s-title">Staff Management</h1>
            <p className="s-subtitle">Manage your team of professional service providers</p>
          </div>
          <button className="s-btn-primary" onClick={() => setIsModalOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Team Member
          </button>
        </div>

        <div className="s-card">
          <div className="s-card-header">
            <span className="s-card-title">Team Members</span>
            {!loading && <span className="s-card-count">{staffList.length} members</span>}
          </div>

          {loading && staffList.length === 0 ? (
            <div className="s-loading">Loading team members…</div>
          ) : staffList.length === 0 ? (
            <div className="s-empty">
              <div className="s-empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="s-empty-h">No staff members yet</p>
              <p className="s-empty-p">Add your first team member to get started.</p>
              <button className="s-btn-primary" onClick={() => setIsModalOpen(true)}>Add Team Member</button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Bookings</th>
                  <th>Reviews</th>
                  <th>Services</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, i) => {
                  const ci = i % AVATAR_COLORS.length;
                  return (
                    <tr key={staff.id}>
                      <td>
                        <div className="s-name-cell">
                          <div className="s-avatar" style={{ background: AVATAR_COLORS[ci], color: AVATAR_TEXT[ci] }}>
                            {staff.userProfileImageUrl
                              ? <img src={staff.userProfileImageUrl} alt={staff.userFullName} />
                              : getInitials(staff.userFullName)}
                          </div>
                          <div>
                            <div className="s-name">{staff.userFullName}</div>
                            <div className="s-role">{staff.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="s-rating">
                          <span className="s-star">★</span>
                          {(staff.averageRating ?? 0).toFixed(1)}
                        </div>
                      </td>
                      <td style={{ color: "#374151", fontWeight: 500 }}>{staff.totalBookings ?? 0}</td>
                      <td style={{ color: "#374151", fontWeight: 500 }}>{staff.totalReviews ?? 0}</td>
                      <td style={{ color: "#374151", fontWeight: 500 }}>{staff.serviceCount}</td>
                      <td>
                        <span className={`s-badge ${staff.isAvailable ? "on" : "off"}`}>
                          <span className="s-dot" />
                          {staff.isAvailable ? "Available" : "Off Duty"}
                        </span>
                      </td>
                      <td>
                        <div className="s-actions-row">
                          <button className="s-action-view" onClick={() => openProfileModal(staff)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '3px', verticalAlign: '-1px' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            View
                          </button>
                          <button className="s-action" onClick={() => openUpdateModal(staff)}>Manage</button>
                          <button className="s-action-delete" onClick={() => openDeleteStaffModal(staff)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {totalPages > 1 && (
            <div className="s-pager">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`s-pg ${i === currentPage ? "active" : ""}`} onClick={() => setCurrentPage(i)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="s-overlay" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="s-modal">
            <div className="s-mhead">
              <div>
                <h2 className="s-mtitle">Add Team Member</h2>
                <p className="s-msub">Register a new professional service provider</p>
              </div>
              <button className="s-xbtn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "contents" }}>
              <div className="s-mbody">
                <div className="s-grid">
                  <div className="s-field">
                    <label className="s-label">User ID</label>
                    <input type="number" name="userId" value={form.userId} onChange={handleChange} required className="s-input" placeholder="e.g. 4" />
                  </div>
                  <div className="s-field">
                    <label className="s-label">Designation</label>
                    <input type="text" name="designation" value={form.designation} onChange={handleChange} required className="s-input" placeholder="e.g. Senior Hair Stylist" />
                  </div>
                  <div className="s-field s-full">
                    <label className="s-label">Biography</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} className="s-textarea" placeholder="Brief professional summary visible to clients…" />
                  </div>
                  <div className="s-field">
                    <label className="s-label">Work Hours</label>
                    <div className="s-time-row">
                      <input type="time" name="workStartTime" value={form.workStartTime} onChange={handleChange} className="s-input" style={{ flex: 1 }} />
                      <span className="s-sep">–</span>
                      <input type="time" name="workEndTime" value={form.workEndTime} onChange={handleChange} className="s-input" style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="s-field">
                    <label className="s-label">Commission (%)</label>
                    <input type="number" name="commission" step="0.1" value={form.commission} onChange={handleChange} className="s-input" />
                  </div>
                </div>

                <div>
                  <p className="s-sec">Days Off</p>
                  <div className="s-days">
                    {DAYS.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleChange({ target: { name: "weeklyOffDays", value: DAYS_FULL[i] } })}
                        className={`s-day ${form.weeklyOffDays.includes(DAYS_FULL[i]) ? "off" : ""}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {availableServices.length > 0 && (
                  <div>
                    <p className="s-sec">Services {form.serviceIds.length > 0 && <span style={{ color: "#2563EB" }}>({form.serviceIds.length} selected)</span>}</p>
                    <div className="s-svcs">
                      {availableServices.map((svc) => (
                        <div
                          key={svc.id}
                          onClick={() => handleChange({ target: { name: "serviceIds", value: svc.id } })}
                          className={`s-svc ${form.serviceIds.includes(svc.id) ? "sel" : ""}`}
                        >
                          {svc.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="s-mfoot">
                <button type="button" className="s-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="s-submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Add Team Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Update Staff */}
      {isUpdateModalOpen && (
        <div className="s-overlay" onClick={(e) => e.target === e.currentTarget && setIsUpdateModalOpen(false)}>
          <div className="s-modal">
            <div className="s-mhead">
              <div>
                <h2 className="s-mtitle">Update Staff Member</h2>
                <p className="s-msub">Edit {editingStaff?.userFullName}'s details</p>
              </div>
              <button className="s-xbtn" onClick={() => setIsUpdateModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} style={{ display: "contents" }}>
              <div className="s-mbody">
                <div className="s-grid">
                  <div className="s-field s-full">
                    <label className="s-label">Designation</label>
                    <input type="text" name="designation" value={updateForm.designation} onChange={handleUpdateChange} required className="s-input" placeholder="e.g. Senior Hair Stylist" />
                  </div>
                  <div className="s-field s-full">
                    <label className="s-label">Biography</label>
                    <textarea name="bio" value={updateForm.bio} onChange={handleUpdateChange} className="s-textarea" placeholder="Brief professional summary visible to clients…" />
                  </div>
                  <div className="s-field">
                    <label className="s-label">Work Hours</label>
                    <div className="s-time-row">
                      <input type="time" name="workStartTime" value={updateForm.workStartTime} onChange={handleUpdateChange} className="s-input" style={{ flex: 1 }} />
                      <span className="s-sep">–</span>
                      <input type="time" name="workEndTime" value={updateForm.workEndTime} onChange={handleUpdateChange} className="s-input" style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="s-field">
                    <label className="s-label">Commission (%)</label>
                    <input type="number" name="commission" step="0.1" value={updateForm.commission} onChange={handleUpdateChange} className="s-input" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={updateForm.isAvailable}
                    onChange={handleUpdateChange}
                    id="update-available"
                    style={{ width: '16px', height: '16px', accentColor: '#2563EB' }}
                  />
                  <label htmlFor="update-available" className="s-label" style={{ margin: 0, cursor: 'pointer' }}>Available</label>
                </div>

                <div>
                  <p className="s-sec">Days Off</p>
                  <div className="s-days">
                    {DAYS.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleUpdateChange({ target: { name: "weeklyOffDays", value: DAYS_FULL[i] } })}
                        className={`s-day ${updateForm.weeklyOffDays.includes(DAYS_FULL[i]) ? "off" : ""}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {availableServices.length > 0 && (
                  <div>
                    <p className="s-sec">Services {updateForm.serviceIds.length > 0 && <span style={{ color: "#2563EB" }}>({updateForm.serviceIds.length} selected)</span>}</p>
                    <div className="s-svcs">
                      {availableServices.map((svc) => (
                        <div
                          key={svc.id}
                          onClick={() => handleUpdateChange({ target: { name: "serviceIds", value: svc.id } })}
                          className={`s-svc ${updateForm.serviceIds.includes(svc.id) ? "sel" : ""}`}
                        >
                          {svc.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="s-mfoot">
                <button type="button" className="s-cancel" onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
                <button type="submit" className="s-submit" disabled={updating}>
                  {updating ? "Updating…" : "Update Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Staff Profile View */}
      {isProfileOpen && (
        <div className="sp-overlay" onClick={(e) => e.target === e.currentTarget && setIsProfileOpen(false)}>
          <div className="sp-modal" style={{ position: 'relative' }}>
            <button className="sp-close" onClick={() => setIsProfileOpen(false)}>✕</button>

            {profileData && (
              <>
                <div className="sp-header">
                  <div className="sp-avatar" style={{ background: '#E8F0FE', color: '#1967D2' }}>
                    {profileData.userProfileImageUrl
                      ? <img src={profileData.userProfileImageUrl} alt={profileData.userFullName} />
                      : getInitials(profileData.userFullName)}
                  </div>
                  <div className="sp-info">
                    <h2>{profileData.userFullName}</h2>
                    <div className="sp-designation">{profileData.designation}</div>
                    <div className="sp-availability">
                      <span className={`s-badge ${profileData.isAvailable ? 'on' : 'off'}`}>
                        <span className="s-dot" />
                        {profileData.isAvailable ? 'Available' : 'Off Duty'}
                      </span>
                    </div>
                  </div>
                </div>

                {profileData.bio && (
                  <div className="sp-bio">{profileData.bio}</div>
                )}

                <div className="sp-stats">
                  <div className="sp-stat-item">
                    <div className="sp-stat-val">{(profileData.averageRating ?? 0).toFixed(1)}</div>
                    <div className="sp-stat-label">★ Rating</div>
                  </div>
                  <div className="sp-stat-item">
                    <div className="sp-stat-val">{profileData.totalBookings ?? 0}</div>
                    <div className="sp-stat-label">Bookings</div>
                  </div>
                  <div className="sp-stat-item">
                    <div className="sp-stat-val">{profileData.totalReviews ?? 0}</div>
                    <div className="sp-stat-label">Reviews</div>
                  </div>
                </div>

                <div className="sp-section">
                  <div className="sp-section-title">Contact Information</div>
                  <div className="sp-detail-grid">
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Email</span>
                      <span className="sp-detail-value">{profileData.userEmail || '—'}</span>
                    </div>
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Phone</span>
                      <span className="sp-detail-value">{profileData.userPhoneNumber || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="sp-section">
                  <div className="sp-section-title">Work Schedule</div>
                  <div className="sp-detail-grid">
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Start Time</span>
                      <span className="sp-detail-value">{profileData.workStartTime ? profileData.workStartTime.slice(0, 5) : '—'}</span>
                    </div>
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">End Time</span>
                      <span className="sp-detail-value">{profileData.workEndTime ? profileData.workEndTime.slice(0, 5) : '—'}</span>
                    </div>
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Commission</span>
                      <span className="sp-detail-value">{profileData.commission ?? 0}%</span>
                    </div>
                    <div className="sp-detail-item">
                      <span className="sp-detail-label">Business</span>
                      <span className="sp-detail-value">{profileData.businessName || '—'}</span>
                    </div>
                  </div>
                </div>

                {profileData.weeklyOffDays && profileData.weeklyOffDays.length > 0 && (
                  <div className="sp-section">
                    <div className="sp-section-title">Weekly Off Days</div>
                    <div className="sp-days-list">
                      {DAYS_FULL.map(day => (
                        <span
                          key={day}
                          className={`sp-day-tag ${profileData.weeklyOffDays.includes(day) ? 'off' : ''}`}
                        >
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profileData.specializedServices && profileData.specializedServices.length > 0 && (
                  <div className="sp-section">
                    <div className="sp-section-title">Specialized Services</div>
                    <div className="sp-services-list">
                      {profileData.specializedServices.map(svc => (
                        <span key={svc.id || svc} className="sp-svc-tag-removable">
                          {svc.name || svc}
                          <button
                            className="sp-svc-remove"
                            onClick={() => handleRemoveService(profileData.id, svc.id || svc, svc.name || svc)}
                            title={`Remove ${svc.name || svc}`}
                          >✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Action Buttons */}
                <div className="sp-section" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
                  <div className="sp-service-actions">
                    <button
                      className="sp-assign-btn"
                      onClick={() => openAssignModal(profileData)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                      Assign Services
                    </button>
                  </div>
                </div>

                {profileData.createdAt && (
                  <div className="sp-section">
                    <div className="sp-detail-grid">
                      <div className="sp-detail-item">
                        <span className="sp-detail-label">Joined</span>
                        <span className="sp-detail-value">{new Date(profileData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="sp-detail-item">
                        <span className="sp-detail-label">Last Updated</span>
                        <span className="sp-detail-value">{profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {profileLoading && (
              <div className="sp-loading">Loading full profile…</div>
            )}
          </div>
        </div>
      )}

      {/* Modal - Delete Staff Confirmation */}
      {isDeleteStaffOpen && (
        <div className="sd-overlay" onClick={(e) => e.target === e.currentTarget && setIsDeleteStaffOpen(false)}>
          <div className="sd-modal">
            <div className="sd-body">
              <div className="sd-icon">
                <svg width="26" height="26" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <h3>Delete Staff Member</h3>
              <p>Are you sure you want to remove <span className="sd-name">{deletingStaffName}</span> from your team? This action cannot be undone.</p>
            </div>
            <div className="sd-actions">
              <button className="sd-cancel" onClick={() => setIsDeleteStaffOpen(false)}>Cancel</button>
              <button className="sd-confirm" disabled={deletingStaff} onClick={handleDeleteStaff}>
                {deletingStaff ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Assign Services */}
      {isAssignOpen && (
        <div className="sa-overlay" onClick={(e) => e.target === e.currentTarget && setIsAssignOpen(false)}>
          <div className="sa-modal">
            <div className="sa-head">
              <div>
                <h3>Assign Services</h3>
                <p>Select services for {assignStaffName}</p>
              </div>
              <button className="s-xbtn" onClick={() => setIsAssignOpen(false)}>✕</button>
            </div>
            <div className="sa-body">
              {assignSelectedIds.length > 0 && (
                <div className="sa-count">{assignSelectedIds.length} service{assignSelectedIds.length !== 1 ? 's' : ''} selected</div>
              )}
              <div className="sa-grid">
                {availableServices.map(svc => (
                  <div
                    key={svc.id}
                    className={`sa-item ${assignSelectedIds.includes(svc.id) ? 'selected' : ''}`}
                    onClick={() => toggleAssignService(svc.id)}
                  >
                    <div className="sa-check">
                      {assignSelectedIds.includes(svc.id) && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                    </div>
                    <span className="sa-svc-name">{svc.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sa-foot">
              <button className="s-cancel" onClick={() => setIsAssignOpen(false)}>Cancel</button>
              <button className="s-submit" disabled={assigning} onClick={handleAssignServices}>
                {assigning ? 'Assigning…' : `Assign ${assignSelectedIds.length} Service${assignSelectedIds.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Staff;```

### src/features/staff/services/staffService.js
```javascript
import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getStaffByBusinessApi = async (businessId, page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STAFF.GET_BY_BUSINESS(businessId), {
    params: { page, size }
  });
  return response.data;
};

export const getStaffByServiceApi = async (serviceId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STAFF.GET_BY_SERVICE(serviceId));
  return response.data;
};

export const getStaffByIdApi = async (staffId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STAFF.GET_BY_ID(staffId));
  return response.data;
};

export const createStaffApi = async (staffData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.STAFF.BASE, staffData);
  return response.data;
};

export const updateStaffApi = async (staffId, staffData) => {
  const response = await axiosInstance.put(API_ENDPOINTS.STAFF.UPDATE_BY_ID(staffId), staffData);
  return response.data;
};

export const deleteStaffApi = async (staffId) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.STAFF.DELETE_BY_ID(staffId));
  return response.data;
};

export const assignServicesToStaffApi = async (staffId, serviceIds) => {
  const response = await axiosInstance.post(API_ENDPOINTS.STAFF.ASSIGN_SERVICES(staffId), serviceIds);
  return response.data;
};

export const removeServicesFromStaffApi = async (staffId, serviceIds) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.STAFF.REMOVE_SERVICES(staffId), {
    data: serviceIds
  });
  return response.data;
};
```

### src/features/users/pages/Admins.jsx
```jsx
const Admins = () => {
  const admins = [
    { id: 1, name: "Super Admin", role: "Super Admin", email: "admin@salon.com", status: "Active", date: "Jan 1, 2025" },
    { id: 2, name: "Omar Farouq", role: "Admin", email: "omar@salon.com", status: "Active", date: "Mar 14, 2025" },
    { id: 3, name: "Nadia Karim", role: "Admin", email: "nadia@salon.com", status: "Active", date: "May 22, 2025" },
    { id: 4, name: "Meera Singh", role: "Admin", email: "meera@salon.com", status: "Inactive", date: "Jul 8, 2025" },
    { id: 5, name: "James Thompson", role: "Admin", email: "james@salon.com", status: "Active", date: "Sep 3, 2025" },
  ];

  return (
    <div className="page active">
      <div className="admin-page-header p-10 flex items-start justify-between border-b border-gold/10">
        <div>
          <h1 className="font-display text-4xl italic text-black-deep">All Admins</h1>
          <p className="text-secondary text-sm mt-2 font-medium">Manage admin access and permissions.</p>
        </div>
        <button className="bg-gold text-black-deep px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:shadow-luxe transition-all flex items-center gap-2 border-0 cursor-pointer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Admin
        </button>
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <strong>{admin.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge active" style={{ background: admin.role === 'Super Admin' ? '#eff6ff' : '#f3f0ff', color: admin.role === 'Super Admin' ? '#2563eb' : '#7c3aed' }}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="td-mono">{admin.email}</td>
                  <td>
                    <span className={`status-badge ${admin.status === 'Active' ? 'verified' : 'inactive'}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="td-muted">{admin.date}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="admin-btn admin-btn-ghost admin-btn-sm">Edit</button>
                      {admin.status === 'Active' ? (
                        <button className="admin-btn admin-btn-red admin-btn-sm">Deactivate</button>
                      ) : (
                        <button className="admin-btn admin-btn-green admin-btn-sm">Activate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination">
          <span className="page-info">Showing 1–5 of {admins.length} entries</span>
          <div className="page-btns">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admins;
```

### src/hooks/useRole.js
```javascript
```

### src/index.css
```css
/* @import "tailwindcss";

@theme {
  --font-jost: "Jost", sans-serif;
  --font-display: "Cormorant Garamond", serif;

  --color-gold: #C8A951;
  --color-beige: #F7F3EE;
  --color-black-deep: #1C1C1C;
  --color-cream: #FDFAF6;

  --shadow-luxe: 0 20px 50px -20px rgba(200, 169, 81, 0.15);
}

@layer base {
  :root {
    --bg: #F7F3EE;
    --card: #FDFAF6;
    --border: #e2e8f0;
    --border-gold: #C8A951;
    --text-primary: #1C1C1C;
    --text-secondary: #7a7065;
    --accent: #C8A951;
    --error: #ef4444;
  }

  body {
    background-color: var(--bg);
    color: var(--text-primary);
    min-height: 100vh;
    font-family: var(--font-jost);
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-display);
  }
}

@layer utilities {
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gold/20 rounded-full hover:bg-gold/40 transition-colors;
  }

  .glass-effect {
    @apply backdrop-blur-md bg-white/10 border border-white/20;
  }
} */

@import "tailwindcss";

@theme {
  --font-jost: "Jost", sans-serif;
  --font-display: "Cormorant Garamond", serif;

  --color-gold: #C8A951;
  --color-beige: #F7F3EE;
  --color-black-deep: #1C1C1C;
  --color-cream: #FDFAF6;
  --color-secondary: #7a7065;

  --shadow-luxe: 0 20px 50px -20px rgba(200, 169, 81, 0.15);
  
  /* Add animation keyframes if needed */
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-zoom-in: zoom-in 0.3s ease-out;
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes zoom-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
}

@layer base {
  :root {
    --bg: #F7F3EE;
    --card: #FDFAF6;
    --border: #e2e8f0;
    --border-gold: #C8A951;
    --text-primary: #1C1C1C;
    --text-secondary: #7a7065;
    --accent: #C8A951;
    --error: #ef4444;
  }

  body {
    background-color: var(--bg);
    color: var(--text-primary);
    min-height: 100vh;
    font-family: var(--font-jost);
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-display);
  }
}

@layer utilities {
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--color-gold) 20%, transparent);
    border-radius: 9999px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--color-gold) 40%, transparent);
  }

  .glass-effect {
    backdrop-filter: blur(8px);
    background: color-mix(in srgb, white 10%, transparent);
    border: 1px solid color-mix(in srgb, white 20%, transparent);
  }
  
  /* Add any missing utility classes */
  .animate-in {
    animation: fade-in 0.3s ease-out, zoom-in 0.3s ease-out;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}```

### src/layouts/MainLayout.jsx
```jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';

const MainLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-beige overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Topbar */}
                <Topbar isSidebarCollapsed={sidebarCollapsed} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
```

### src/main.jsx
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";
import "./styles/admin.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);```

### src/pages/auth/Login.jsx
```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginApi(form);
      login(data);

      if (data.role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-ornament"></div>
      <div className="auth-bg-ornament-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title font-display text-4xl italic text-black-deep">Salon Luxe</h1>
          <p className="auth-subtitle text-secondary font-medium tracking-widest uppercase text-[10px] mt-2">Administrative Console</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="e.g. admin@salon.com"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <div className="flex justify-between items-center mb-2">
              <label className="auth-label mb-0">Password</label>
              <button type="button" className="text-[11px] font-bold text-gold hover:underline bg-transparent border-0 cursor-pointer">Forgot?</button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="auth-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8 select-none cursor-pointer group">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gold/20 accent-gold" />
            <label htmlFor="remember" className="text-xs text-secondary font-medium group-hover:text-black-deep cursor-pointer">Stay signed in for 30 days</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn flex items-center justify-center gap-3 bg-gold text-black-deep hover:bg-gold/80 hover:shadow-luxe transition-all cursor-pointer border-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black-deep/30 border-t-black-deep rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="font-bold uppercase tracking-widest text-xs">Enter Sanctuary</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Authorized Personnel Only • Powered by SalonFlow</p>
        </div>
      </div>
    </div>
  );
};

export default Login;```

### src/pages/superadmin/SuperAdminDashboard.jsx
```jsx
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
                  <div className="activity-text text-black-deep"><strong>Omar Farouq</strong> approved Luxe Hair Studio</div>
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
```

### src/routes/PrivateRoute.jsx
```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-beige">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
```

### src/routes/RoleBasedRoute.jsx
```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleBasedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    const isAuthorized = user && allowedRoles.includes(user.role);

    if (!isAuthorized) {
        // Redirtect to appropriate dashboard if role is wrong
        return <Navigate to={user?.role === 'SUPER_ADMIN' ? '/super-admin/dashboard' : '/admin/dashboard'} replace />;
    }

    return <Outlet />;
};

export default RoleBasedRoute;
```

### src/routes/index.jsx
```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Pages
import Login from '../pages/auth/Login';

// Super Admin Pages
import SuperAdminDashboard from '../pages/superadmin/SuperAdminDashboard';
import PendingSalons from '../pages/superadmin/PendingSalons';
import VerifiedSalons from '../pages/superadmin/VerifiedSalons';
import AllSalons from '../pages/superadmin/AllSalons';
import Admins from '../pages/superadmin/Admins';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminStaff from '../pages/admin/AdminStaff';
import AdminServices from '../pages/admin/AdminServices';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminReviews from '../pages/admin/AdminReviews';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>

                    {/* Super Admin Routes */}
                    <Route element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN']} />}>
                        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
                        <Route path="/super-admin/pending" element={<PendingSalons />} />
                        <Route path="/super-admin/verified" element={<VerifiedSalons />} />
                        <Route path="/super-admin/all-salons" element={<AllSalons />} />
                        <Route path="/super-admin/admins" element={<Admins />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/bookings" element={<AdminBookings />} />
                        <Route path="/admin/staff" element={<AdminStaff />} />
                        <Route path="/admin/services" element={<AdminServices />} />
                        <Route path="/admin/categories" element={<AdminCategories />} />
                        <Route path="/admin/reviews" element={<AdminReviews />} />
                    </Route>

                </Route>
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
```

### src/services/api/axiosConfig.js
```javascript
import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosConfig;
```

### src/services/apiEndpoints.js
```javascript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },

  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: (id) => `/users/${id}`,
  },

  SALONS: {
    GET_ALL: "/businesses",
    GET_PENDING: "/businesses/pending",
    GET_VERIFIED: "/businesses/verified",
    GET_BY_ID: (id) => `/businesses/${id}`,
    GET_MY_BUSINESS: "/businesses/my-business",
    UPDATE_MY_BUSINESS: "/businesses/my-business",
    UPLOAD_BANNER: "/businesses/banner",
    UPLOAD_IMAGES: "/businesses/images",
    DELETE_IMAGE: "/businesses/images",
    VERIFY: (id) => `/businesses/${id}/verify`,
  },

  CATEGORIES: {
    BASE: "/categories",
  },

  SERVICES: {
    BASE: "/services",
    GET_BY_BUSINESS: (businessId) => `/services/business/${businessId}`,
    UPDATE_BY_ID: (id) => `/services/${id}`,
    DELETE_BY_ID: (id) => `/services/${id}`,
  },

  STAFF: {
    BASE: "/staff",
    GET_BY_BUSINESS: (businessId) => `/staff/business/${businessId}`,
    GET_BY_SERVICE: (serviceId) => `/staff/service/${serviceId}`,
    GET_BY_ID: (id) => `/staff/${id}`,
    UPDATE_BY_ID: (id) => `/staff/${id}`,
    DELETE_BY_ID: (id) => `/staff/${id}`,
    ASSIGN_SERVICES: (id) => `/staff/${id}/services`,
    REMOVE_SERVICES: (id) => `/staff/${id}/services`,
  },
  REVIEWS: {
    GET_BY_BUSINESS: (businessId) => `/reviews/business/${businessId}`,
    UPDATE_BY_ID: (id) => `/reviews/${id}`,
    DELETE_BY_ID: (id) => `/reviews/${id}`,
  },
  HOLIDAYS: {
    GET_BY_BUSINESS: (businessId) => `/business-holidays/business/${businessId}`,
    ADD: (businessId) => `/business-holidays/business/${businessId}`,
    UPDATE_BY_ID: (id) => `/business-holidays/${id}`,
    DELETE_BY_ID: (id) => `/business-holidays/${id}`,
  },
  BOOKINGS: {
    GET_BY_BUSINESS: (businessId) => `/bookings/business/${businessId}`,
    ACCEPT: (bookingId, staffId) => `/bookings/${bookingId}/accept?staffId=${staffId}`,
    REJECT: (bookingId) => `/bookings/${bookingId}/reject`,
    RESCHEDULE: (bookingId) => `/bookings/${bookingId}/reschedule`,
  },
};```

### src/services/axiosInstance.js
```javascript
import axios from "axios";
import { getToken, removeToken } from "../utils/token";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ================================
   RESPONSE INTERCEPTOR
================================ */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Unauthorized → Token expired / invalid
      if (status === 401) {
        removeToken();

        // Redirect to login page
        window.location.href = "/login";
      }

      // Forbidden
      if (status === 403) {
        console.error("Access Denied");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;```

### src/services/interceptors/axiosInterceptor.js
```javascript
import axiosConfig from './axiosConfig';

const setupInterceptors = (navigate, logout) => {
    // Request Interceptor
    axiosConfig.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    axiosConfig.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Handle 401 Unauthorized
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                // If we had a refresh token flow, it would go here
                // For now, we logout on 401
                logout();
                navigate('/login');
                return Promise.reject(error);
            }

            // Handle 403 Forbidden
            if (error.response?.status === 403) {
                // Handle role-based access denial
                console.error('Access forbidden');
            }

            return Promise.reject(error);
        }
    );
};

export default setupInterceptors;
```

### src/styles/admin.css
```css
/* Global Resets */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  color: var(--color-text-primary);
  background: var(--color-bg);
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

/* Admin Portal Styling */
:root {
  --sidebar-w: 280px;
  --sidebar-collapsed-w: 80px;
  --topbar-h: 80px;

  --color-bg: #F7F3EE;
  --color-surface: #FDFAF6;
  --color-sidebar: #1C1C1C;
  --color-sidebar-hover: #262626;
  --color-sidebar-active: #C8A951;
  --color-accent: #C8A951;
  --color-accent-light: rgba(200, 169, 81, 0.1);
  --color-text-primary: #1C1C1C;
  --color-text-secondary: #7a7065;
  --color-text-muted: #9ca3af;
  --color-border: rgba(200, 169, 81, 0.1);
  --color-border-light: rgba(200, 169, 81, 0.05);
  --color-sidebar-text: #F7F3EE;
  --color-sidebar-muted: #7a7065;

  --radius: 40px;
  --radius-sm: 16px;
  --shadow-sm: 0 10px 40px -15px rgba(200, 169, 81, 0.1);
  --shadow: 0 20px 50px -20px rgba(200, 169, 81, 0.15);
  --shadow-md: 0 30px 60px -25px rgba(200, 169, 81, 0.2);
  --shadow-lg: 0 40px 80px -30px rgba(200, 169, 81, 0.25);
  --transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ─── LAYOUT ─── */
.layout {
  display: flex;
  width: 100vw;
  max-width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--color-bg);
  position: relative;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* ─── SIDEBAR ─── */
.sidebar {
  width: var(--sidebar-w);
  min-width: var(--sidebar-w);
  background: var(--color-sidebar);
  display: flex;
  flex-direction: column;
  transition: width var(--transition), min-width var(--transition);
  overflow: hidden;
  z-index: 100;
  position: relative;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-w);
  min-width: var(--sidebar-collapsed-w);
}

.sidebar-logo {
  padding: 20px 16px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #252930;
  min-height: 72px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: var(--color-accent);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon svg {
  color: white;
}

.logo-text {
  overflow: hidden;
  white-space: nowrap;
}

.logo-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 11px;
  color: var(--color-sidebar-muted);
  margin-top: 1px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

.nav-section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-sidebar-muted);
  padding: 8px 8px 4px;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity var(--transition);
}

.sidebar.collapsed .nav-section-label {
  opacity: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 8px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-sidebar-text);
  font-size: 13.5px;
  font-weight: 450;
  white-space: nowrap;
  transition: background var(--transition), color var(--transition);
  position: relative;
  user-select: none;
  margin-bottom: 2px;
}

.nav-item:hover {
  background: var(--color-sidebar-hover);
  color: #e8eaf0;
}

.nav-item.active {
  background: var(--color-sidebar-active);
  color: #ffffff;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  background: var(--color-accent);
  border-radius: 0 3px 3px 0;
}

.nav-item svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.nav-item span {
  overflow: hidden;
  transition: opacity var(--transition);
}

.sidebar.collapsed .nav-item span {
  opacity: 0;
  width: 0;
}

.nav-badge {
  margin-left: auto;
  background: var(--color-accent);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 20px;
  transition: opacity var(--transition);
}

.sidebar.collapsed .nav-badge {
  opacity: 0;
}

.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid #252930;
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-sidebar-muted);
  font-size: 13px;
  transition: background var(--transition), color var(--transition);
  white-space: nowrap;
}

.collapse-btn:hover {
  background: var(--color-sidebar-hover);
  color: var(--color-sidebar-text);
}

.collapse-btn svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  transition: transform var(--transition);
}

.sidebar.collapsed .collapse-btn svg {
  transform: rotate(180deg);
}

.collapse-btn span {
  transition: opacity var(--transition);
}

.sidebar.collapsed .collapse-btn span {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

/* ─── TOPBAR ─── */
.topbar-container {
  height: var(--topbar-h);
  width: 100%;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
  z-index: 50;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: background var(--transition), color var(--transition);
  position: relative;
}

.icon-btn:hover {
  background: var(--color-bg);
  color: var(--color-text-primary);
}

.notif-dot {
  width: 7px;
  height: 7px;
  background: var(--color-accent);
  border-radius: 50%;
  position: absolute;
  top: 7px;
  right: 7px;
  border: 1.5px solid white;
}

.topbar-divider {
  width: 1px;
  height: 28px;
  background: var(--color-border);
  margin: 0 4px;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px 6px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
  background: transparent;
  transition: background var(--transition);
  position: relative;
}

.profile-btn:hover {
  background: var(--color-bg);
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a7cf7, #6b94f8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.02em;
}

.profile-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.profile-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.profile-role {
  font-size: 11px;
  color: var(--color-text-muted);
  line-height: 1.2;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  min-width: 160px;
  padding: 4px;
  display: none;
  z-index: 200;
}

.dropdown-menu.open {
  display: block;
  animation: fadeIn 0.12s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 13px;
  transition: background var(--transition), color var(--transition);
}

.dropdown-item:hover {
  background: var(--color-bg);
  color: var(--color-text-primary);
}

.dropdown-item.danger:hover {
  background: var(--color-red-bg);
  color: var(--color-red);
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: 4px 0;
}

/* ─── CONTENT ─── */
.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.admin-content::-webkit-scrollbar {
  width: 6px;
}

.admin-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 6px;
}

/* ─── STATS CARDS ─── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: box-shadow var(--transition), transform var(--transition);
  cursor: default;
}

.stat-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.blue {
  background: var(--color-accent-light);
  color: var(--color-accent);
}

.stat-icon.amber {
  background: var(--color-amber-bg);
  color: var(--color-amber);
}

.stat-icon.green {
  background: var(--color-green-bg);
  color: var(--color-green);
}

.stat-icon.purple {
  background: #f3f0ff;
  color: #7c3aed;
}

.stat-body {
  flex: 1;
}

.stat-number {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.stat-change {
  font-size: 11.5px;
  color: var(--color-green);
  margin-top: 6px;
  font-weight: 500;
}

.stat-change.down {
  color: var(--color-red);
}

/* ─── SECTION HEADER ─── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.section-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 1px;
}

/* ─── CARDS ─── */
.admin-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
  overflow: hidden;
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.admin-card-header {
  padding: 32px 40px;
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(253, 250, 246, 0.5);
  backdrop-filter: blur(10px);
}

.admin-card-body {
  padding: 40px;
}

/* ─── TABLES ─── */
.table-wrap {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table thead th {
  padding: 16px 40px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.admin-table tbody tr {
  border-bottom: 1px solid var(--color-border-light);
  transition: background var(--transition);
}

.admin-table tbody tr:last-child {
  border-bottom: none;
}

.admin-table tbody tr:hover {
  background: #fafafa;
}

.admin-table td {
  padding: 24px 40px;
  font-size: 14px;
  color: var(--color-text-primary);
  vertical-align: middle;
  border-bottom: 1px solid var(--color-border-light);
}

.td-muted {
  color: var(--color-text-secondary);
  font-weight: 300;
  font-style: italic;
}

.td-mono {
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* ─── BADGES ─── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 500;
}

.status-badge::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge.verified {
  background: var(--color-green-bg);
  color: var(--color-green);
}

.status-badge.pending {
  background: var(--color-amber-bg);
  color: var(--color-amber);
}

.status-badge.rejected {
  background: var(--color-red-bg);
  color: var(--color-red);
}

.status-badge.active {
  background: var(--color-blue-bg);
  color: var(--color-blue);
}

.status-badge.inactive {
  background: var(--color-border-light);
  color: var(--color-text-muted);
}

/* ─── BUTTONS ─── */
.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all var(--transition);
  white-space: nowrap;
  font-family: inherit;
}

.admin-btn-primary {
  background: var(--color-accent);
  color: white;
}

.admin-btn-primary:hover {
  background: #3d6ef0;
}

.admin-btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.admin-btn-ghost:hover {
  background: var(--color-bg);
  color: var(--color-text-primary);
}

.admin-btn-green {
  background: var(--color-green-bg);
  color: var(--color-green);
  border: 1px solid #bbf7d0;
}

.admin-btn-green:hover {
  background: #dcfce7;
}

.admin-btn-red {
  background: var(--color-red-bg);
  color: var(--color-red);
  border: 1px solid #fecaca;
}

.admin-btn-red:hover {
  background: #fee2e2;
}

.admin-btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 6px;
}

/* ─── FORM ELEMENTS ─── */
.admin-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 13.5px;
  font-family: inherit;
  width: 220px;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.admin-search-box input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-size: 13.5px;
  font-family: inherit;
  color: var(--color-text-primary);
}

.admin-search-box input::placeholder {
  color: var(--color-text-muted);
}

.admin-search-box:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(74, 124, 247, 0.1);
}

select.admin-filter-select {
  padding: 8px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text-primary);
  cursor: pointer;
  outline: none;
  transition: border-color var(--transition);
}

select.admin-filter-select:focus {
  border-color: var(--color-accent);
}

/* ─── TOOLBAR ─── */
.admin-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ─── CATEGORY GRID ─── */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.category-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: box-shadow var(--transition), transform var(--transition);
}

.category-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.cat-icon {
  width: 38px;
  height: 38px;
  background: var(--color-accent-light);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
}

.cat-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.cat-count {
  font-size: 12.5px;
  color: var(--color-text-muted);
}

.cat-actions {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}

/* ─── PAGE HEADER ─── */
.admin-page-header {
  margin-bottom: 22px;
}

.admin-page-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
}

.admin-page-header p {
  font-size: 13.5px;
  color: var(--color-text-muted);
  margin-top: 3px;
}

/* ─── ACTIVITY LOG ─── */
.activity-list {
  padding: 8px 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.activity-dot.blue {
  background: var(--color-accent);
}

.activity-dot.green {
  background: var(--color-green);
}

.activity-dot.red {
  background: var(--color-red);
}

.activity-dot.amber {
  background: var(--color-amber);
}

.activity-text {
  font-size: 13.5px;
  color: var(--color-text-primary);
  flex: 1;
}

.activity-text strong {
  font-weight: 500;
}

.activity-time {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

/* ─── PAGINATION ─── */
.admin-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid var(--color-border-light);
}

.page-info {
  font-size: 13px;
  color: var(--color-text-muted);
}

.page-btns {
  display: flex;
  gap: 4px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition);
}

.page-btn:hover {
  background: var(--color-bg);
}

.page-btn.active {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

/* ─── RESPONSIVE ─── */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1000;
    transform: translateX(-100%);
    width: var(--sidebar-w) !important;
    min-width: var(--sidebar-w) !important;
    transition: transform var(--transition);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
  }

  .mobile-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }

  .mobile-overlay.active {
    display: block;
  }
}

/* ─── TOOLTIP on collapse ─── */
.sidebar.collapsed .nav-item {
  position: relative;
}

.sidebar.collapsed .nav-item:hover::after {
  content: attr(data-label);
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  background: #1a1d23;
  color: #e8eaf0;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 300;
  box-shadow: var(--shadow);
  pointer-events: none;
}

/* ─── AUTH PAGES ─── */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.auth-bg-ornament {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(74, 124, 247, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.auth-bg-ornament-2 {
  position: absolute;
  bottom: -15%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(74, 124, 247, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background: var(--color-surface);
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.04);
  padding: 48px;
  position: relative;
  z-index: 10;
  border: 1px solid var(--color-border-light);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo-box {
  width: 56px;
  height: 56px;
  background: var(--color-accent);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  box-shadow: 0 10px 20px rgba(74, 124, 247, 0.2);
}

.auth-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
}

.auth-form-group {
  margin-bottom: 20px;
}

.auth-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.auth-input {
  width: 100%;
  height: 50px;
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  color: var(--color-text-primary);
  transition: all var(--transition);
  outline: none;
}

.auth-input:focus {
  background: white;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(74, 124, 247, 0.1);
}

.auth-btn {
  width: 100%;
  height: 52px;
  background: var(--color-sidebar);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  margin-top: 10px;
}

.auth-btn:hover {
  background: #252930;
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.auth-btn:active {
  transform: translateY(0);
}

.auth-footer {
  margin-top: 32px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
  font-size: 13px;
  color: var(--color-text-muted);
}```

### src/utils/helpers.js
```javascript
```

### src/utils/token.js
```javascript
const TOKEN_KEY = "admin_token";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};```

