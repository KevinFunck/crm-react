import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const { login, loginAsGuest } = useAuth();
  const { tr } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError(tr.login.error);
    } finally {
      setLoading(false);
    }
  }

  function handleGuestLogin() {
    loginAsGuest();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-cyber-bg dot-grid flex items-center justify-center">

      <div className="absolute w-80 h-80 rounded-full bg-cyber-accent/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-8 shadow-glow">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg border border-cyber-accent/50 bg-cyber-accent/10 flex items-center justify-center shadow-glow-sm">
              <svg className="w-5 h-5 text-cyber-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <div>
              <p className="text-cyber-text font-bold tracking-widest text-sm uppercase">CRM Portal</p>
              <p className="text-cyber-muted text-[10px] tracking-widest">Admin Access</p>
            </div>
          </div>

          <p className="text-cyber-muted text-xs mb-6">{tr.login.subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-widest text-cyber-muted uppercase mb-1.5">
                {tr.login.email}
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="name@example.com"
                className="w-full bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-cyber-text placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-accent/60 focus:ring-1 focus:ring-cyber-accent/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-widest text-cyber-muted uppercase mb-1.5">
                {tr.login.password}
              </label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full bg-cyber-surface border border-cyber-border rounded-md px-3 py-2.5 text-sm text-cyber-text placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-accent/60 focus:ring-1 focus:ring-cyber-accent/30 transition-colors"
              />
            </div>

            {error && (
              <p className="text-cyber-pink text-xs flex items-center gap-1.5">
                <span>⚠</span> {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-cyber-accent text-cyber-bg rounded-md py-2.5 text-sm font-bold tracking-wide hover:bg-cyber-accent-dim disabled:opacity-40 transition-colors shadow-glow-sm mt-1"
            >
              {loading ? tr.login.signingIn : tr.login.signIn}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyber-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-cyber-card px-3 text-[10px] text-cyber-muted uppercase tracking-widest">{tr.common.or}</span>
            </div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full border border-cyber-border text-cyber-muted rounded-md py-2.5 text-sm font-medium hover:border-cyber-accent/40 hover:text-cyber-text transition-colors"
          >
            {tr.login.guestLogin}
          </button>

        </div>

        <p className="text-center text-[10px] text-cyber-muted/50 mt-4 tracking-widest uppercase">
          {tr.login.secureAccess}
        </p>
      </div>
    </div>
  );
}
