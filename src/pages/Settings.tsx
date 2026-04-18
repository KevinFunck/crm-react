/* Settings page — placeholder sections in cyber theme */
export default function Settings() {
  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg px-5 py-3">
        <p className="text-[9px] tracking-widest text-cyber-muted uppercase">Configuration</p>
        <h1 className="text-base font-semibold text-cyber-text mt-0.5">Settings</h1>
      </div>

      {/* Profile section */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-4">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">Profile</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">Display Name</label>
            <input
              disabled
              placeholder="Coming soon…"
              className="w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2 text-sm text-cyber-muted placeholder-cyber-muted/40 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">Email</label>
            <input
              disabled
              placeholder="Coming soon…"
              className="w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2 text-sm text-cyber-muted placeholder-cyber-muted/40 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Appearance section */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-4">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">Appearance</p>
        <div className="flex items-center justify-between py-2 border-b border-cyber-border/60">
          <div>
            <p className="text-sm text-cyber-text">Theme</p>
            <p className="text-xs text-cyber-muted mt-0.5">Dark cyber theme active</p>
          </div>
          <span className="text-xs bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent px-3 py-1 rounded tracking-wide">Active</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-cyber-text">Language</p>
            <p className="text-xs text-cyber-muted mt-0.5">English</p>
          </div>
          <span className="text-xs text-cyber-muted">Coming soon</span>
        </div>
      </div>

      {/* Notifications section */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-4">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">Notifications</p>
        {["Email notifications", "In-app alerts", "Weekly digest"].map((item) => (
          <div key={item} className="flex items-center justify-between py-2 border-b border-cyber-border/40 last:border-0">
            <p className="text-sm text-cyber-text">{item}</p>
            <span className="text-xs text-cyber-muted">Coming soon</span>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-cyber-card border border-cyber-pink/20 rounded-lg p-5 space-y-3">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-pink uppercase">Danger Zone</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cyber-text">Delete Account</p>
            <p className="text-xs text-cyber-muted mt-0.5">Permanently remove all data</p>
          </div>
          <button disabled className="text-xs border border-cyber-pink/30 text-cyber-pink px-3 py-1.5 rounded hover:bg-cyber-pink/10 transition-colors disabled:opacity-40 cursor-not-allowed">
            Delete
          </button>
        </div>
      </div>

    </div>
  );
}
