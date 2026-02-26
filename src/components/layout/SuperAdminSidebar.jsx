import { Link, useLocation } from "react-router-dom";

const SuperAdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/super-admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/super-admin/pending-salons", label: "Pending Salons", icon: "⌛" },
    { path: "/super-admin/verified-salons", label: "Verified Salons", icon: "✅" },
    { path: "/super-admin/categories", label: "Categories", icon: "🍱" },
    { path: "/super-admin/all-salons", label: "All Salons", icon: "💇‍♀️" },
    { path: "/super-admin/global-users", label: "Global Users", icon: "👥" },
    { path: "/super-admin/settings", label: "System Settings", icon: "⚙️" },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 italic tracking-tight">Super Admin</h2>

      <ul className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-indigo-200 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuperAdminSidebar;
