import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import type { NavItem } from "../types/Navigation";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: "Dashboard", path: "/" },
    { name: "Customers", path: "/customers" },
    { name: "Calendar", path: "/calendar" },
    { name: "Settings", path: "/settings" },
  ];

  const pageTitle = navItems.find((i) => i.path === location.pathname)?.name ?? "CRM";

  return (
    <div className="flex h-screen bg-cyber-bg overflow-hidden">

      <Sidebar items={navItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="flex items-center justify-between bg-cyber-surface border-b border-cyber-border px-6 py-3 flex-shrink-0">

          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-cyber-muted hover:text-cyber-text"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div>
              <p className="text-[9px] text-cyber-muted tracking-widest uppercase">Admin Dashboard</p>
              <h1 className="text-sm font-semibold text-cyber-text tracking-wide">{pageTitle}</h1>
            </div>
          </div>

          {/* Right: user + logout */}
          <div className="flex items-center gap-3">
            {/* Online indicator */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent shadow-glow-sm"/>
              <span className="text-xs text-cyber-muted">Online</span>
            </div>

            {/* User badge */}
            <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border rounded px-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-cyber-accent/20 border border-cyber-accent/40 flex items-center justify-center">
                <span className="text-[9px] font-bold text-cyber-accent uppercase">
                  {user?.email?.[0] ?? "G"}
                </span>
              </div>
              <span className="text-xs text-cyber-text hidden sm:block max-w-32 truncate">{user?.email ?? "Guest"}</span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="text-xs text-cyber-muted hover:text-cyber-accent border border-cyber-border hover:border-cyber-accent/50 rounded px-3 py-1.5 transition-colors"
            >
              Sign Out
            </button>
          </div>

        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto bg-cyber-bg dot-grid">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
