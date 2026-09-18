import { useState, useEffect } from "react";
import { User, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function TopBar() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utcTime = time.toISOString().slice(11, 19);

  return (
    <header className="h-12 bg-orbital-card/80 backdrop-blur-sm border-b border-orbital-border flex items-center justify-between px-6 fixed top-0 left-60 right-0 z-30">
      {/* Left: Status indicators */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <span className="flex items-center gap-1.5">
          <span className="status-dot-success" />
          <span className="text-orbital-success">STATUS: RUNNING</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="status-dot-success" />
          <span className="text-orbital-text-dim">WS: CONNECTED</span>
        </span>
      </div>

      {/* Right: System time + icons */}
      <div className="flex items-center gap-4">
        {/* System Time */}
        <div className="px-3 py-1 rounded border border-orbital-border text-xs font-mono text-orbital-text">
          {utcTime} UTC
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate("/alerts")}
          className="relative text-orbital-muted hover:text-orbital-text transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orbital-danger" />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/settings")}
          className="text-orbital-muted hover:text-orbital-text transition-colors"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate("/settings")}
          className="text-orbital-muted hover:text-orbital-text transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
