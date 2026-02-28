import { NavLink } from "react-router-dom";
import type { NavItem } from "../types/Navigation";

type SidebarProps = {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ items, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo / Title */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">CRM</h2>
            {/* Close button for mobile */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 flex flex-col space-y-2">
            {items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white" // Active link
                      : "text-gray-300 hover:bg-gray-800 hover:text-white" // Inactive link hover
                  }`
                }
                onClick={onClose} // Close sidebar on mobile
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer / optional */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">© 2026 CRM</p>
          </div>
        </div>
      </div>
    </>
  );
}