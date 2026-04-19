import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

/* ── Stat card ── */
function StatCard({
  label, value, icon, accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`bg-cyber-card border rounded-lg p-5 flex items-center gap-4 transition-all hover:shadow-glow-sm ${
      accent ? "border-cyber-accent/40" : "border-cyber-border"
    }`}>
      <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
        accent ? "bg-cyber-accent/15 text-cyber-accent" : "bg-cyber-dim/60 text-cyber-muted"
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${accent ? "text-cyber-accent" : "text-cyber-text"}`}>{value}</p>
      </div>
    </div>
  );
}

/* ── SVG line chart ── */
function LineChart() {
  const pts = [
    [0,90],[67,75],[134,80],[201,62],[268,55],[335,46],[402,38],[469,28],[536,20],[600,10]
  ];

  const linePath  = pts.map(([x,y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath  = linePath + ` L600,110 L0,110 Z`;

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"];

  return (
    <div>
      <svg viewBox="0 0 600 120" className="w-full" preserveAspectRatio="none" style={{ height: 120 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4b8" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#00d4b8" stopOpacity="0"/>
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)"/>
        {/* Grid lines */}
        {[30,60,90].map(y => (
          <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#1a2d4a" strokeWidth="1"/>
        ))}
        {/* Line */}
        <path d={linePath} fill="none" stroke="#00d4b8" strokeWidth="2" filter="url(#lineGlow)"/>
        {/* Dots */}
        {pts.map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#00d4b8" filter="url(#lineGlow)"/>
        ))}
      </svg>
      {/* X axis labels */}
      <div className="flex justify-between mt-1 px-0">
        {months.map(m => (
          <span key={m} className="text-[9px] text-cyber-muted">{m}</span>
        ))}
      </div>
    </div>
  );
}

/* ── SVG donut chart ── */
function DonutChart() {
  const r = 40;
  const circ = 2 * Math.PI * r; // ≈ 251

  const segments = [
    { label: "Enterprise", pct: 35, color: "#4f8ef7" },
    { label: "SMB",        pct: 25, color: "#00d4b8" },
    { label: "Startup",    pct: 22, color: "#a78bfa" },
    { label: "Other",      pct: 18, color: "#f43f5e" },
  ];

  let offset = -circ * 0.25; // start at 12 o'clock
  const slices = segments.map(seg => {
    const len = circ * (seg.pct / 100);
    const el = { ...seg, dashArray: `${len} ${circ - len}`, dashOffset: offset };
    offset -= len;
    return el;
  });

  return (
    <div>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 100 100" className="w-24 h-24 flex-shrink-0">
          {/* Background track */}
          <circle cx="50" cy="50" r={r} fill="none" stroke="#1a2d4a" strokeWidth="14"/>
          {slices.map((s, i) => (
            <circle
              key={i} cx="50" cy="50" r={r} fill="none"
              stroke={s.color} strokeWidth="14"
              strokeDasharray={s.dashArray}
              strokeDashoffset={s.dashOffset}
            />
          ))}
          <text x="50" y="53" textAnchor="middle" fill="#c8d6ea" fontSize="10" fontWeight="bold">100%</text>
        </svg>
        <ul className="space-y-1.5 text-xs">
          {segments.map(s => (
            <li key={s.label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }}/>
              <span className="text-cyber-muted">{s.label}</span>
              <span className="text-cyber-text font-medium ml-auto">{s.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [contactCount, setContactCount] = useState<number | null>(null);

  /* Live clock */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Fetch counts */
  useEffect(() => {
    axios.get(`${API}/customers`).then(res => setCustomerCount(res.data.length)).catch(() => {});
    axios.get(`${API}/contacts`).then(res => setContactCount(res.data.length)).catch(() => {});
  }, []);

  const date = currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const time = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Header bar */}
      <div className="flex items-center justify-between bg-cyber-card border border-cyber-border rounded-lg px-5 py-3">
        <div>
          <p className="text-[9px] tracking-widest text-cyber-muted uppercase">Admin Dashboard · CRM Portal</p>
          <h2 className="text-base font-semibold text-cyber-text mt-0.5">Overview</h2>
        </div>
        <div className="text-right">
          <p className="text-cyber-accent text-sm font-mono font-semibold">{time}</p>
          <p className="text-cyber-muted text-[10px] mt-0.5">{date}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          accent
          label="Total Customers"
          value={customerCount !== null ? customerCount : "—"}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          }
        />
        <StatCard
          label="Open Deals"
          value="—"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          }
        />
        <StatCard
          label="Revenue"
          value="—"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          }
        />
        <StatCard
          label="Active Contacts"
          value={contactCount !== null ? contactCount : "—"}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          }
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Line chart — spans 2 cols */}
        <div className="lg:col-span-2 bg-cyber-card border border-cyber-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-cyber-text tracking-wide">Customer Growth</p>
            <span className="text-[9px] text-cyber-muted bg-cyber-dim/60 px-2 py-0.5 rounded tracking-widest uppercase">Line Graph</span>
          </div>
          <LineChart />
        </div>

        {/* Donut chart */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-cyber-text tracking-wide">Distribution</p>
            <span className="text-[9px] text-cyber-muted bg-cyber-dim/60 px-2 py-0.5 rounded tracking-widest uppercase">By Type</span>
          </div>
          <DonutChart />
        </div>

      </div>

      {/* Recent activity table */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
        <p className="text-xs font-semibold text-cyber-text tracking-wide mb-4">Recent Activity</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cyber-border">
                <th className="text-left text-[9px] tracking-widest text-cyber-muted uppercase pb-2 pr-4">Event</th>
                <th className="text-left text-[9px] tracking-widest text-cyber-muted uppercase pb-2 pr-4">Type</th>
                <th className="text-left text-[9px] tracking-widest text-cyber-muted uppercase pb-2 pr-4">Status</th>
                <th className="text-left text-[9px] tracking-widest text-cyber-muted uppercase pb-2">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/60">
              {[
                { event: "New customer added",     type: "Customer",   status: "Active",  time: "Just now" },
                { event: "Deal stage updated",     type: "Deal",       status: "Pending", time: "2m ago" },
                { event: "Contact note created",   type: "Note",       status: "Active",  time: "15m ago" },
                { event: "Calendar event created", type: "Calendar",   status: "Active",  time: "1h ago" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 pr-4 text-cyber-text">{row.event}</td>
                  <td className="py-2.5 pr-4 text-cyber-muted">{row.type}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold tracking-wide uppercase ${
                      row.status === "Active"
                        ? "bg-cyber-accent/10 text-cyber-accent"
                        : "bg-cyber-pink/10 text-cyber-pink"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-cyber-muted">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
