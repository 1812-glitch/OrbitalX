import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SatelliteFleet from "./pages/SatelliteFleet";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Placeholder page for routes not yet built
function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-orbital-primary mb-2">{title}</h1>
        <p className="text-orbital-muted text-sm">This page will be built in upcoming phases.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — Dashboard Layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/satellites" element={<SatelliteFleet />} />
          <Route path="/orbital-viewer" element={<PlaceholderPage title="Orbital Viewer" />} />
          <Route path="/telemetry" element={<PlaceholderPage title="Telemetry Analytics" />} />
          <Route path="/missions" element={<PlaceholderPage title="Mission Control" />} />
          <Route path="/communications" element={<PlaceholderPage title="Communications" />} />
          <Route path="/ground-stations" element={<PlaceholderPage title="Ground Stations" />} />
          <Route path="/alerts" element={<PlaceholderPage title="Alerts & Incidents" />} />
          <Route path="/analytics" element={<PlaceholderPage title="Fleet Analytics" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="/support" element={<PlaceholderPage title="Support" />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
