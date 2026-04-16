import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import type { NavItem } from "../types/Navigation";

export default function MainLayout() {

  /* ---------------------------
     Controls whether the mobile sidebar drawer is open
  --------------------------- */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---------------------------
     Current route path — used to resolve the active page title
  --------------------------- */
  const location = useLocation();

  /* ---------------------------
     Navigation items shown in the sidebar
  --------------------------- */
  const navItems: NavItem[] = [
    { name: "Dashboard", path: "/" },
    { name: "Customers", path: "/customers" },
    { name: "Calendar", path: "/calendar" },
    { name: "Settings", path: "/settings" },
  ];

  /* ---------------------------
     Resolve the current page title from the nav items list.
     Falls back to "CRM" if no match is found.
  --------------------------- */
  const pageTitle =
    navItems.find((i) => i.path === location.pathname)?.name || "CRM";

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar navigation */}
      <Sidebar
        items={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">

        {/* Top header bar */}
        <header className="flex items-center justify-between bg-gray-800 text-white shadow px-6 py-4">

          {/* Mobile hamburger button — hidden on desktop */}
          <button
            className="md:hidden text-2xl text-white hover:text-gray-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          {/* Dynamic page title */}
          <h1 className="text-lg font-semibold">{pageTitle}</h1>

          {/* User / profile placeholder */}
          <div className="text-gray-300">User</div>

        </header>

        {/* Routed page content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
