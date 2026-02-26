import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/admin/my-salon", label: "My Salon", icon: "💇‍♂️" },
    { path: "/admin/services", label: "Services", icon: "✂️" },
    { path: "/admin/appointments", label: "Appointments", icon: "📅" },
    { path: "/admin/staff", label: "Staff", icon: "👥" },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-white tracking-tight">Salon Admin</h2>

      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? "bg-white/10 text-white shadow-inner"
                  : "hover:bg-white/5 hover:text-white"
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

export default Sidebar;