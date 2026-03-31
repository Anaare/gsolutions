import {
  LayoutDashboard,
  Users,
  Store,
  Briefcase,
  ChevronRight,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", to: "/", icon: LayoutDashboard },
  { name: "Employees", to: "/employees", icon: User },
  { name: "Projects", to: "/projects", icon: Briefcase },
  { name: "Clients", to: "/clients", icon: Users },
  { name: "Vendors", to: "/vendors", icon: Store },
];

const SideBar = () => {
  return (
    <aside className="bg-gs-dark min-h-screen text-white p-4">
      <div className="mb-8 px-4">
        <h1 className="text-3xl font-bold text-gs-primary">Menu</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gs-primary text-white shadow-lg shadow-gs-primary/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} strokeWidth={2} />
              <span className="font-medium">{item.name}</span>
            </div>

            <ChevronRight
              size={14}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
