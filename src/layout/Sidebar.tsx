import { NavLink } from "react-router-dom";
import type { NavItem } from "../types/Navigation";

type SidebarProps = {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
};

/* ── Inline SVG icons ── */
function IconDashboard() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
      <rect x="1" y="1" width="6" height="6" rx="1"/>
      <rect x="9" y="1" width="6" height="6" rx="1"/>
      <rect x="1" y="9" width="6" height="6" rx="1"/>
      <rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  );
}

function IconCustomers() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  );
}

function IconSettings() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  );
}

function IconContacts() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
    </svg>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <IconDashboard />,
  Customers: <IconCustomers />,
  Contacts:  <IconContacts />,
  Calendar:  <IconCalendar />,
  Settings:  <IconSettings />,
};

export default function Sidebar({ items, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-56 bg-cyber-surface border-r border-cyber-border flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-cyber-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded border border-cyber-accent/60 flex items-center justify-center shadow-glow-sm bg-cyber-accent/10">
              <svg className="w-3.5 h-3.5 text-cyber-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2zm0-8h2v6h-2z"/>
              </svg>
            </div>
            <div>
              <p className="text-cyber-text font-bold tracking-widest text-xs uppercase leading-none">CRM</p>
              <p className="text-cyber-muted text-[9px] tracking-widest uppercase mt-0.5">Portal</p>
            </div>
          </div>
          <button className="md:hidden text-cyber-muted hover:text-cyber-text text-lg" onClick={onClose}>✕</button>
        </div>

        {/* Section label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[9px] font-semibold tracking-widest text-cyber-muted uppercase">Navigation</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-cyber-accent/10 text-cyber-accent border-l-2 border-cyber-accent pl-[10px]"
                    : "text-cyber-muted hover:text-cyber-text hover:bg-white/5 border-l-2 border-transparent"
                }`
              }
            >
              {iconMap[item.name] ?? null}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-cyber-border">
          <p className="text-[9px] text-cyber-muted tracking-widest uppercase">© 2026 CRM Portal</p>
        </div>
      </div>
    </>
  );
}
