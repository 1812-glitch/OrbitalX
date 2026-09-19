import { useState, useEffect } from "react";
import { User, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useStore from "../store/useStore";
import api from "../lib/api";

export default function TopBar() {
  const { user } = useAuthStore();
  const socketConnected = useStore((state) => state.socketConnected);
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [apiStatus, setApiStatus] = useState("CHECKING");
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(null);
  const [alertsUnavailable, setAlertsUnavailable] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkSystemHealth = async () => {
      try {
        const res = await api.get("/health");
        if (isMounted) {
          if (res.data?.success) {
            setApiStatus("RUNNING");
          } else {
            setApiStatus("OFFLINE");
          }
        }
      } catch {
        if (isMounted) {
          setApiStatus("OFFLINE");
        }
      }
    };

    const fetchAlertCount = async () => {
      try {
        const res = await api.get("/alerts/stats");
        if (isMounted) {
          setUnreadAlertsCount(res.data?.data?.total ?? 0);
          setAlertsUnavailable(false);
        }
      } catch {
        if (isMounted) {
          // Preserve last successful count; flag alerts state as unavailable
          setAlertsUnavailable(true);
        }
      }
    };

    checkSystemHealth();
    fetchAlertCount();

    const healthInterval = setInterval(checkSystemHealth, 30000);
    const alertInterval = setInterval(fetchAlertCount, 30000);

    return () => {
      isMounted = false;
      clearInterval(healthInterval);
      clearInterval(alertInterval);
    };
  }, []);

  const utcTime = time.toISOString().slice(11, 19);

  return (
    <header className="h-12 bg-orbital-card/80 backdrop-blur-sm border-b border-orbital-border flex items-center justify-between px-6 fixed top-0 left-60 right-0 z-30">
      {/* Left: Status indicators */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <span className="flex items-center gap-1.5" title={`System status: ${apiStatus}`}>
          <span
            className={
              apiStatus === "RUNNING"
                ? "status-dot-success"
                : apiStatus === "CHECKING"
                ? "status-dot-warning"
                : "status-dot-danger"
            }
          />
          <span
            className={
              apiStatus === "RUNNING"
                ? "text-orbital-success"
                : apiStatus === "CHECKING"
                ? "text-orbital-warning"
                : "text-orbital-danger"
            }
          >
            STATUS: {apiStatus}
          </span>
        </span>
        <span
          className="flex items-center gap-1.5"
          title={`WebSocket: ${socketConnected ? "CONNECTED" : "DISCONNECTED"}`}
        >
          <span
            className={socketConnected ? "status-dot-success" : "status-dot-muted"}
          />
          <span
            className={
              socketConnected ? "text-orbital-text-dim" : "text-orbital-muted"
            }
          >
            WS: {socketConnected ? "CONNECTED" : "DISCONNECTED"}
          </span>
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
          title={
            alertsUnavailable
              ? unreadAlertsCount !== null
                ? `Alerts (${unreadAlertsCount} active, connection lost)`
                : "Alert service unavailable"
              : unreadAlertsCount > 0
              ? `Alerts (${unreadAlertsCount} active)`
              : "No active alerts"
          }
          aria-label={
            alertsUnavailable
              ? unreadAlertsCount !== null
                ? `Alerts (${unreadAlertsCount} active, connection lost)`
                : "Alert service unavailable"
              : unreadAlertsCount > 0
              ? `Alerts (${unreadAlertsCount} active)`
              : "Alerts"
          }
          className="relative text-orbital-muted hover:text-orbital-text transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 ? (
            <span
              className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                alertsUnavailable ? "bg-orbital-warning" : "bg-orbital-danger"
              }`}
            />
          ) : alertsUnavailable ? (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orbital-warning" />
          ) : null}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/settings")}
          aria-label="User Profile"
          className="text-orbital-muted hover:text-orbital-text transition-colors"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate("/settings")}
          aria-label="Settings"
          className="text-orbital-muted hover:text-orbital-text transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
