import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Satellite,
  Globe,
  BarChart3,
  Compass,
  Radio,
  Building2,
  Bell,
  LineChart,
  Settings,
  HelpCircle,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Satellites", icon: Satellite, path: "/satellites" },
  { label: "Orbital Viewer", icon: Globe, path: "/orbital-viewer" },
  { label: "Telemetry", icon: BarChart3, path: "/telemetry" },
  { label: "Mission Control", icon: Compass, path: "/missions" },
  { label: "Communications", icon: Radio, path: "/communications" },
  { label: "Ground Stations", icon: Building2, path: "/ground-stations" },
  { label: "Alerts", icon: Bell, path: "/alerts" },
  { label: "Analytics", icon: LineChart, path: "/analytics" },
];

const bottomItems = [
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "Support", icon: HelpCircle, path: "/support" },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-orbital-card border-r border-orbital-border flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-orbital-border">
        <h1 className="text-orbital-primary font-bold text-lg italic tracking-wide">
          OrbitalX
        </h1>
        <p className="text-orbital-muted text-xs font-mono mt-0.5">
          LEO Ops Unit
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-orbital-primary/10 text-orbital-primary border-l-2 border-orbital-primary"
                  : "text-orbital-text-dim hover:text-orbital-text hover:bg-orbital-elevated"
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Emergency Override - hidden until emergency override modal/handler is implemented */}
      {/*
      <div className="px-3 mb-2">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-orbital-danger/40 text-orbital-danger text-sm font-mono hover:bg-orbital-danger/10 transition-colors">
          <AlertTriangle className="w-4 h-4" />
          Emergency Override
        </button>
      </div>
      */}

      {/* Bottom Links */}
      <div className="px-3 pb-2 space-y-1 border-t border-orbital-border pt-2">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "text-orbital-primary"
                  : "text-orbital-muted hover:text-orbital-text"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User Profile */}
      <div className="px-3 pb-4 border-t border-orbital-border pt-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orbital-elevated border border-orbital-border flex items-center justify-center text-orbital-primary text-xs font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-orbital-text truncate">
              {user?.callsign || user?.name || "Unknown"}
            </p>
            <p className="text-xs text-orbital-muted capitalize">
              {user?.role || "viewer"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-orbital-muted hover:text-orbital-danger transition-colors p-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
