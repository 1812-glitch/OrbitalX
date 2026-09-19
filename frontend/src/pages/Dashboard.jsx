import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Satellite,
  Globe,
  Radio,
  AlertTriangle,
  Activity,
  Thermometer,
  Gauge,
  Mountain,
  Battery,
  Signal,
} from "lucide-react";
import api from "../lib/api";
import useStore from "../store/useStore";

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

function KPICard({ icon: Icon, label, value, sub, color = "primary" }) {
  const colorMap = {
    primary: "text-orbital-primary border-orbital-primary/30",
    success: "text-orbital-success border-orbital-success/30",
    warning: "text-orbital-warning border-orbital-warning/30",
    danger: "text-orbital-danger border-orbital-danger/30",
  };

  return (
    <motion.div
      className={`card border-l-2 ${colorMap[color]} hover:bg-orbital-elevated/50 transition-colors`}
      {...fadeIn}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="label-mono">{label}</span>
        <Icon className={`w-4 h-4 ${colorMap[color].split(" ")[0]}`} />
      </div>
      <p className="text-3xl font-bold font-mono">{value}</p>
      {sub && <p className={`text-xs mt-1 ${colorMap[color].split(" ")[0]}`}>{sub}</p>}
    </motion.div>
  );
}

function TelemetryFeed({ socketConnected }) {
  const [logs, setLogs] = useState([
    { time: "09:40:12", tag: "SYS", text: "Nominal operation on GS-ALPHA link.", type: "info" },
    { time: "09:39:55", tag: "SAT-003", text: "Minor packet loss detected. Retrying...", type: "warn" },
    { time: "09:38:22", tag: "CMD", text: "Orbital adjustment confirmed for SAT-001.", type: "info" },
    { time: "09:35:10", tag: "GND-2", text: "Handshake complete with Ground Station BETA.", type: "info" },
    { time: "09:30:00", tag: "SYS", text: "Hourly telemetry dump initiated.", type: "info" },
    { time: "09:28:45", tag: "SAT-003", text: "Thruster response timeout.", type: "error" },
    { time: "09:25:12", tag: "SYS", text: "Nominal operation on GS-ALPHA link.", type: "info" },
    { time: "09:22:30", tag: "SAT-01", text: "Solar array position updated.", type: "info" },
    { time: "09:20:15", tag: "SAT-04", text: "Telemetry packet recv 256b", type: "info" },
    { time: "09:18:42", tag: "SAT-05", text: "Comm burst sent.", type: "info" },
  ]);

  const tagColor = (type) => {
    if (type === "warn") return "text-orbital-warning";
    if (type === "error") return "text-orbital-danger";
    return "text-orbital-primary";
  };

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="label-mono">Real-Time Telemetry</h3>
        <span
          className={socketConnected ? "status-dot-success" : "status-dot-muted"}
          title={socketConnected ? "Telemetry stream live" : "Telemetry stream disconnected"}
        />
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-orbital-muted shrink-0">[{log.time}]</span>
            <span className={`shrink-0 ${tagColor(log.type)}`}>[{log.tag}]</span>
            <span className={log.type === "error" ? "text-orbital-danger" : log.type === "warn" ? "text-orbital-warning" : "text-orbital-text-dim"}>
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertCard({ severity, satellite, message }) {
  const styles = {
    critical: "border-orbital-danger bg-orbital-danger/5",
    warning: "border-orbital-warning bg-orbital-warning/5",
  };
  const colors = {
    critical: "text-orbital-danger",
    warning: "text-orbital-warning",
  };

  return (
    <div className={`border rounded-md p-3 ${styles[severity]}`}>
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className={`w-3.5 h-3.5 ${colors[severity]}`} />
        <span className={`text-xs font-mono uppercase font-bold ${colors[severity]}`}>
          {severity} — {satellite}
        </span>
      </div>
      <p className="text-xs text-orbital-text-dim">{message}</p>
    </div>
  );
}

function HealthDonut({ stats }) {
  if (!stats || !stats.total) {
    return (
      <div className="card">
        <h3 className="label-mono mb-4">Satellite Health Distribution</h3>
        <div className="flex flex-col items-center justify-center h-44 text-orbital-muted text-xs font-mono">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-orbital-border flex items-center justify-center mb-2">
            <span className="text-orbital-muted text-lg">—</span>
          </div>
          <span>{!stats ? "Data Unavailable" : "No Satellites in Fleet"}</span>
        </div>
      </div>
    );
  }

  const total = stats.total;
  const warningCount = stats.warning || 0;
  const criticalCount = stats.critical || 0;
  const healthyCount = Math.max(0, total - warningCount - criticalCount);

  // Exact ratios without premature rounding
  const healthyRatio = healthyCount / total;
  const warningRatio = warningCount / total;
  const criticalRatio = criticalCount / total;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const healthyDash = healthyRatio * circumference;
  const warningDash = warningRatio * circumference;
  const criticalDash = criticalRatio * circumference;

  // Use actual counts for health-state decisions to prevent small ratios from disappearing
  const centerColor =
    criticalCount > 0
      ? "text-orbital-danger"
      : warningCount > 0
      ? "text-orbital-warning"
      : "text-orbital-success";
  const centerLabel =
    criticalCount > 0 ? "DEGRADED" : warningCount > 0 ? "CAUTION" : "NOMINAL";

  // Round percentages only for display text
  const healthyPercent = Math.round(healthyRatio * 100);

  return (
    <div className="card">
      <h3 className="label-mono mb-4">Satellite Health Distribution</h3>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="120" height="120" className="-rotate-90">
            {/* Background circle */}
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
            {/* Healthy */}
            {healthyCount > 0 && (
              <circle
                cx="60" cy="60" r={radius} fill="none"
                stroke="#10b981" strokeWidth="12"
                strokeDasharray={`${healthyDash} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
            )}
            {/* Warning */}
            {warningCount > 0 && (
              <circle
                cx="60" cy="60" r={radius} fill="none"
                stroke="#f59e0b" strokeWidth="12"
                strokeDasharray={`${warningDash} ${circumference}`}
                strokeDashoffset={`${-healthyDash}`}
                strokeLinecap="round"
              />
            )}
            {/* Critical */}
            {criticalCount > 0 && (
              <circle
                cx="60" cy="60" r={radius} fill="none"
                stroke="#ef4444" strokeWidth="12"
                strokeDasharray={`${criticalDash} ${circumference}`}
                strokeDashoffset={`${-(healthyDash + warningDash)}`}
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold font-mono ${centerColor}`}>{healthyPercent}%</span>
            <span className="text-[10px] text-orbital-muted font-mono">{centerLabel}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-3 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orbital-success" />Healthy ({healthyCount})</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orbital-warning" />Warning ({warningCount})</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orbital-danger" />Critical ({criticalCount})</span>
      </div>
    </div>
  );
}

function CommBursts() {
  const bars = [3, 5, 4, 6, 2, 7, 5, 8, 6, 9, 7, 10];
  const maxBar = Math.max(...bars);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="label-mono">Active Communication Bursts</h3>
        <span className="text-xs text-orbital-muted font-mono">Last 60 mins</span>
      </div>
      <div className="flex items-end gap-1.5 h-28">
        {bars.map((val, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-500"
            style={{
              height: `${(val / maxBar) * 100}%`,
              background: i >= bars.length - 3
                ? "linear-gradient(to top, #06b6d4, #22d3ee)"
                : "#1e3a5f",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-orbital-muted font-mono">
        <span>-60m</span>
        <span>-30m</span>
        <span>Now</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const socketConnected = useStore((state) => state.socketConnected);
  const [stats, setStats] = useState(null);
  const [criticalAlertsCount, setCriticalAlertsCount] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [alertsError, setAlertsError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAlertsError(null);

        // Fetch each section independently using Promise.allSettled so a failure in one does not discard the others
        const [statsResult, criticalAlertsResult, alertResult] = await Promise.allSettled([
          api.get("/satellites/stats"),
          api.get("/alerts?resolved=false&severity=critical&limit=1"),
          api.get("/alerts?resolved=false&limit=5"),
        ]);

        if (!isMounted) return;

        const errorMessages = [];

        // 1. Process satellite fleet stats
        if (statsResult.status === "fulfilled") {
          setStats(statsResult.value.data.data);
        } else {
          setStats(null);
          errorMessages.push("Fleet statistics unavailable");
        }

        // 2. Process unresolved critical alerts count
        if (criticalAlertsResult.status === "fulfilled") {
          const criticalTotal =
            criticalAlertsResult.value.data?.data?.pagination?.total ??
            criticalAlertsResult.value.data?.data?.total ??
            0;
          setCriticalAlertsCount(criticalTotal);
        } else {
          setCriticalAlertsCount(null);
          errorMessages.push("Critical alert metric unavailable");
        }

        // 3. Process active alerts feed
        if (alertResult.status === "fulfilled") {
          const alertData = alertResult.value.data.data.data || alertResult.value.data.data;
          setAlerts(Array.isArray(alertData) ? alertData.slice(0, 5) : []);
          setAlertsError(null);
        } else {
          setAlerts(null);
          setAlertsError("Failed to load active alerts.");
          errorMessages.push("Alerts feed unavailable");
        }

        if (errorMessages.length > 0) {
          setError(`Data partially unavailable: ${errorMessages.join(" • ")}.`);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load operational data. Some values may be unavailable.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeSatellites = stats?.active ?? "—";
  const criticalAlerts = criticalAlertsCount !== null ? criticalAlertsCount : "—";
  const total = stats?.total ?? "—";
  const groundLinks = stats ? `${stats.connected}/${stats.total}` : "—/—";
  const globalCoverage =
    stats && stats.total > 0
      ? `${((stats.active / stats.total) * 100).toFixed(1)}%`
      : "—";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">System Overview</h1>
        <p className="text-orbital-muted text-sm mt-1">
          Real-time status of LEO satellite constellation and ground station links.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-orbital-warning/10 border border-orbital-warning/30 rounded-md px-4 py-3 text-sm text-orbital-warning">
          ⚠ {error}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Satellite}
          label="Active Satellites"
          value={loading ? "…" : activeSatellites}
          sub={stats ? `↗ ${total} total` : "Loading..."}
          color="primary"
        />
        <KPICard
          icon={Globe}
          label="Global Coverage"
          value={loading ? "…" : globalCoverage}
          sub={stats ? "Target: 95.0%" : "Loading..."}
          color="success"
        />
        <KPICard
          icon={Radio}
          label="Ground Station Links"
          value={loading ? "…" : groundLinks}
          sub={
            stats
              ? stats.connected === stats.total
                ? "● All Links Active"
                : `▲ ${stats.total - stats.connected} Link(s) Inactive`
              : "Loading..."
          }
          color={stats && stats.connected === stats.total ? "success" : "warning"}
        />
        <KPICard
          icon={AlertTriangle}
          label="Critical Alerts"
          value={loading ? "…" : criticalAlerts}
          sub={
            criticalAlertsCount === null
              ? "Loading..."
              : criticalAlertsCount === 0
              ? "System Stable"
              : `${criticalAlertsCount} Active`
          }
          color={criticalAlertsCount && criticalAlertsCount > 0 ? "danger" : "primary"}
        />
      </div>

      {/* Orbital Snapshot + Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orbital Snapshot Placeholder */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="label-mono">Orbital Snapshot</h3>
            <div className="flex gap-1">
              <button className="px-2.5 py-1 text-xs font-mono rounded border border-orbital-border text-orbital-muted hover:text-orbital-text hover:border-orbital-primary transition-colors">2D</button>
              <button className="px-2.5 py-1 text-xs font-mono rounded bg-orbital-primary/20 border border-orbital-primary text-orbital-primary">3D</button>
            </div>
          </div>
          <div className="h-72 bg-orbital-bg rounded border border-orbital-border flex items-center justify-center relative overflow-hidden">
            {/* Star field */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.2,
                }}
              />
            ))}
            {/* Earth circle */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900 border border-blue-700/40 shadow-[0_0_40px_rgba(59,130,246,0.15)] relative">
              <div className="absolute inset-2 rounded-full border border-blue-600/20" />
            </div>
            {/* Orbit ring */}
            <div className="absolute w-56 h-56 rounded-full border border-orbital-primary/20 border-dashed" />
            {/* Satellite dots */}
            <div className="absolute top-16 left-[60%] flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-orbital-primary shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              <span className="text-[9px] font-mono text-orbital-primary mt-1">SAT-001</span>
            </div>
            <div className="absolute bottom-20 right-[30%] flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-orbital-success shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[9px] font-mono text-orbital-success mt-1">SAT-002</span>
            </div>
            <div className="absolute top-[45%] left-[25%] flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-orbital-danger shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <span className="text-[9px] font-mono text-orbital-danger mt-1">SAT-003</span>
            </div>
          </div>
        </div>

        {/* Telemetry Feed */}
        <TelemetryFeed socketConnected={socketConnected} />
      </div>

      {/* Health + Comms + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <HealthDonut stats={stats} />
        <CommBursts />

        {/* Active Alerts — rendered from API data */}
        <div className="card">
          <h3 className="label-mono mb-3">Active Alerts</h3>
          <div className="space-y-2.5">
            {alertsError ? (
              <p className="text-xs text-orbital-danger text-center py-4">
                ⚠ {alertsError}
              </p>
            ) : loading && alerts === null ? (
              <p className="text-xs text-orbital-muted text-center py-4">
                Loading alerts...
              </p>
            ) : alerts && alerts.length > 0 ? (
              alerts.map((alert) => (
                <AlertCard
                  key={alert._id}
                  severity={alert.severity}
                  satellite={alert.satelliteId?.name || alert.satelliteId || "Unknown"}
                  message={alert.message}
                />
              ))
            ) : (
              <p className="text-xs text-orbital-muted text-center py-4">
                No active alerts. System nominal.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
