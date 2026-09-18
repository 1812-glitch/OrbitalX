import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-orbital-bg">
      <Sidebar />
      <TopBar />

      {/* Main content area — offset by sidebar width + topbar height */}
      <main className="ml-60 mt-12 p-6 min-h-[calc(100vh-3rem)]">
        <Outlet />
      </main>
    </div>
  );
}
