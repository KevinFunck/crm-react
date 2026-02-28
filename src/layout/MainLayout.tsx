import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import type { NavItem } from "../types/Navigation";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: "Dashboard", path: "/" },
    { name: "Customers", path: "/customers" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        items={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-gray-800 text-white shadow px-6 py-4">
          {/* Mobile burger button */}
          <button
            className="md:hidden text-2xl text-white hover:text-gray-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          {/* Page title */}
          <h1 className="text-lg font-semibold">
            {navItems.find((i) => i.path === window.location.pathname)?.name || "CRM"}
          </h1>

          {/* User / Profile placeholder */}
          <div className="text-gray-300">User</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}