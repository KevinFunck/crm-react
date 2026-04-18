import { useLanguage } from "../context/LanguageContext";
import { LANGUAGES } from "../i18n/translations";

export default function Settings() {
  const { tr, language, setLanguage } = useLanguage();

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg px-5 py-3">
        <p className="text-[9px] tracking-widest text-cyber-muted uppercase">{tr.settings.configuration}</p>
        <h1 className="text-base font-semibold text-cyber-text mt-0.5">{tr.settings.title}</h1>
      </div>

      {/* Language */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-4">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">{tr.settings.language}</p>
        <p className="text-xs text-cyber-muted -mt-2">{tr.settings.selectLanguage}</p>

        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => {
            const active = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                  active
                    ? "border-cyber-accent/60 bg-cyber-accent/10 shadow-glow-sm"
                    : "border-cyber-border hover:border-cyber-accent/30 hover:bg-white/[0.02]"
                }`}
              >
                <span className="text-2xl leading-none">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${active ? "text-cyber-accent" : "text-cyber-text"}`}>
                    {lang.native}
                  </p>
                  <p className="text-[10px] text-cyber-muted mt-0.5">{lang.english}</p>
                </div>
                {active && (
                  <span className="w-4 h-4 rounded-full bg-cyber-accent flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-cyber-bg" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-4">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">{tr.settings.profile}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">{tr.settings.displayName}</label>
            <input disabled placeholder={tr.common.comingSoon + "…"} className="w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2 text-sm text-cyber-muted placeholder-cyber-muted/40 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">{tr.login.email}</label>
            <input disabled placeholder={tr.common.comingSoon + "…"} className="w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2 text-sm text-cyber-muted placeholder-cyber-muted/40 cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-4">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">{tr.settings.appearance}</p>
        <div className="flex items-center justify-between py-2 border-b border-cyber-border/60">
          <div>
            <p className="text-sm text-cyber-text">{tr.settings.theme}</p>
            <p className="text-xs text-cyber-muted mt-0.5">{tr.settings.themeActive}</p>
          </div>
          <span className="text-xs bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent px-3 py-1 rounded tracking-wide">Active</span>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-4">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">{tr.settings.notifications}</p>
        {[tr.settings.emailNotif, tr.settings.inAppAlerts, tr.settings.weeklyDigest].map((item) => (
          <div key={item} className="flex items-center justify-between py-2 border-b border-cyber-border/40 last:border-0">
            <p className="text-sm text-cyber-text">{item}</p>
            <span className="text-xs text-cyber-muted">{tr.common.comingSoon}</span>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-cyber-card border border-cyber-pink/20 rounded-lg p-5 space-y-3">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-pink uppercase">{tr.settings.dangerZone}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cyber-text">{tr.settings.deleteAccount}</p>
            <p className="text-xs text-cyber-muted mt-0.5">{tr.settings.deleteAccountDesc}</p>
          </div>
          <button disabled className="text-xs border border-cyber-pink/30 text-cyber-pink px-3 py-1.5 rounded hover:bg-cyber-pink/10 transition-colors disabled:opacity-40 cursor-not-allowed">
            {tr.common.delete}
          </button>
        </div>
      </div>

    </div>
  );
}
