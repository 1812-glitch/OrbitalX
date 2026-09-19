import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Satellite,
  Wifi,
  AlertTriangle,
  WifiOff,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import api from "../lib/api";

function KPICard({ icon: Icon, label, value, color = "primary" }) {
  const colorMap = {
    primary: "text-orbital-primary border-orbital-primary/30",
    success: "text-orbital-success border-orbital-success/30",
    warning: "text-orbital-warning border-orbital-warning/30",
    danger: "text-orbital-danger border-orbital-danger/30",
  };

  return (
    <div className={`card border-t-2 ${colorMap[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="label-mono">{label}</span>
        <Icon className={`w-4 h-4 ${colorMap[color].split(" ")[0]}`} />
      </div>
      <p className="text-3xl font-bold font-mono">{value}</p>
    </div>
  );
}

function HealthBadge({ health }) {
  if (health >= 80) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orbital-success/15 text-orbital-success border border-orbital-success/30">
        <span className="w-1.5 h-1.5 rounded-full bg-orbital-success" />
        HEALTHY
      </span>
    );
  }
  if (health >= 50) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orbital-warning/15 text-orbital-warning border border-orbital-warning/30">
        <span className="w-1.5 h-1.5 rounded-full bg-orbital-warning" />
        WARNING
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orbital-danger/15 text-orbital-danger border border-orbital-danger/30">
      <span className="w-1.5 h-1.5 rounded-full bg-orbital-danger" />
      CRITICAL
    </span>
  );
}

function BatteryBar({ level }) {
  let color = "bg-orbital-success";
  if (level < 30) color = "bg-orbital-danger";
  else if (level < 60) color = "bg-orbital-warning";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-orbital-elevated rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${level}%` }} />
      </div>
      <span className="text-xs font-mono">{level}%</span>
    </div>
  );
}

export default function SatelliteFleet() {
  const navigate = useNavigate();
  const [satellites, setSatellites] = useState([]);
  const [stats, setStats] = useState({ total: 0, connected: 0, warning: 0, critical: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orbitFilter, setOrbitFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    loadData();
  }, [search, statusFilter, orbitFilter, page]);

  const loadData = async () => {
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (orbitFilter) params.orbitType = orbitFilter;

      const [satRes, statsRes] = await Promise.all([
        api.get("/satellites", { params }),
        api.get("/satellites/stats"),
      ]);

      setSatellites(satRes.data.data.data || []);
      setPagination(satRes.data.data.pagination || { total: 0, pages: 1 });
      setStats(statsRes.data.data);
    } catch (err) {
      console.error("Failed to load satellites:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatLastUpdate = (sat) => {
    const ts = sat.currentTelemetry?.lastUpdated || sat.updatedAt;
    if (!ts) return "—";
    return new Date(ts).toISOString().slice(11, 19) + " UTC";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Satellite Fleet</h1>
        <p className="text-orbital-muted text-sm mt-1">
          Monitor and manage the OrbitalX satellite constellation. Real-time telemetry and operational status.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Satellite} label="Total Satellites" value={stats.total} color="primary" />
        <KPICard icon={Wifi} label="Connected" value={stats.connected} color="success" />
        <KPICard icon={AlertTriangle} label="Warning" value={stats.warning} color="warning" />
        <KPICard icon={WifiOff} label="Critical / Offline" value={stats.critical} color="danger" />
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orbital-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search satellite ID or name..."
            className="input pl-9"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-auto min-w-[130px]"
        >
          <option value="">Status: All</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={orbitFilter}
          onChange={(e) => setOrbitFilter(e.target.value)}
          className="input w-auto min-w-[120px]"
        >
          <option value="">Orbit: All</option>
          <option value="LEO">LEO</option>
          <option value="MEO">MEO</option>
          <option value="GEO">GEO</option>
          <option value="HEO">HEO</option>
        </select>

        {/* Add Satellite button — hidden until creation flow is implemented */}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-orbital-border">
                <th className="text-left px-4 py-3 label-mono">Satellite</th>
                <th className="text-left px-4 py-3 label-mono">Orbit</th>
                <th className="text-left px-4 py-3 label-mono">Altitude</th>
                <th className="text-left px-4 py-3 label-mono">Speed</th>
                <th className="text-left px-4 py-3 label-mono">Temp</th>
                <th className="text-left px-4 py-3 label-mono">Battery</th>
                <th className="text-left px-4 py-3 label-mono">Signal</th>
                <th className="text-left px-4 py-3 label-mono">Health</th>
                <th className="text-left px-4 py-3 label-mono">Last Update</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-orbital-muted">
                    <div className="w-6 h-6 border-2 border-orbital-primary/30 border-t-orbital-primary rounded-full animate-spin mx-auto mb-2" />
                    Loading satellites...
                  </td>
                </tr>
              ) : satellites.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-orbital-muted">
                    No satellites found.
                  </td>
                </tr>
              ) : (
                satellites.map((sat) => {
                  const t = sat.currentTelemetry || {};
                  const health = t.health || 0;
                  const isWarning = health < 80 && health >= 50;
                  const isCritical = health < 50;
                  const rowClass = isCritical
                    ? "border-l-2 border-orbital-danger"
                    : isWarning
                    ? "border-l-2 border-orbital-warning"
                    : "";

                  return (
                    <motion.tr
                      key={sat._id}
                      className={`border-b border-orbital-border/50 hover:bg-orbital-elevated/50 cursor-pointer transition-colors ${rowClass}`}
                      onClick={() => navigate(`/satellites/${sat._id}`)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <span className={`font-bold ${isCritical ? "text-orbital-danger" : isWarning ? "text-orbital-warning" : "text-orbital-text"}`}>
                            {sat.name}
                          </span>
                          <p className={`text-xs font-mono ${isCritical ? "text-orbital-danger/70" : "text-orbital-muted"}`}>
                            {sat.satelliteId}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-orbital-primary font-mono text-xs">{sat.orbitType}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {(t.altitude || 0).toLocaleString()} km
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-orbital-primary font-mono text-xs">{t.speed || 0} km/s</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs ${(t.temperature || 0) > 80 ? "text-orbital-danger" : ""}`}>
                          {t.temperature || 0} °C
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <BatteryBar level={t.battery || 0} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {t.signal || 0} dBm
                      </td>
                      <td className="px-4 py-3">
                        <HealthBadge health={health} />
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-orbital-muted">
                        {formatLastUpdate(sat)}
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-orbital-muted" />
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-orbital-muted font-mono">
            Showing {satellites.length} of {pagination.total} satellites
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-mono border border-orbital-border rounded hover:bg-orbital-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="text-xs font-mono text-orbital-muted">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-3 py-1.5 text-xs font-mono border border-orbital-border rounded hover:bg-orbital-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
