import { useEffect, useState } from "react";

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "Initializing system…",
    "Loading modules…",
    "Establishing connection…",
    "Ready.",
  ];

  /* Cycle status messages every 600ms, then trigger exit at 2.8s */
  useEffect(() => {
    const intervals: ReturnType<typeof setTimeout>[] = [];

    statusMessages.forEach((_, i) => {
      intervals.push(setTimeout(() => setStatusIndex(i), i * 600));
    });

    const exitTimer = setTimeout(() => setPhase("exit"), 2800);
    const doneTimer = setTimeout(onDone, 3400);

    return () => {
      intervals.forEach(clearTimeout);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-[100] bg-cyber-bg flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
      phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
    }`}>

      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Ambient glow orb */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyber-accent/5 blur-[120px] pointer-events-none animate-pulse" />

      {/* Corner decorations */}
      <Corner position="top-left" />
      <Corner position="top-right" />
      <Corner position="bottom-left" />
      <Corner position="bottom-right" />

      {/* Horizontal scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/30 to-transparent splash-scan" />
      </div>

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-6 px-8 text-center">

        {/* Logo ring + icon */}
        <div className="relative splash-logo-enter">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border border-cyber-accent/20 splash-ring-outer" />
          {/* Middle pulsing ring */}
          <div className="absolute inset-2 rounded-full border border-cyber-accent/30 animate-pulse" />
          {/* Icon container */}
          <div className="relative w-24 h-24 rounded-full bg-cyber-surface border border-cyber-accent/50 flex items-center justify-center shadow-glow">
            <svg className="w-10 h-10 text-cyber-accent" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 3h16.5M3.75 3v4.5M3.75 3H3m.75 0h16.5m0 0V3m0 0H21M3.75 7.5h16.5M3.75 7.5v9M3.75 7.5H3m17.25 0H21m-17.25 9h16.5m-16.5 0H3m17.25 0H21M3.75 16.5v3.75M20.25 16.5v3.75M3.75 20.25h16.5"/>
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div className="splash-text-enter" style={{ animationDelay: "300ms" }}>
          <h1 className="text-5xl font-black tracking-[0.3em] text-cyber-text uppercase">
            C<span className="text-cyber-accent">R</span>M
          </h1>
          <p className="text-[11px] tracking-[0.5em] text-cyber-muted uppercase mt-1">
            Customer Relations Portal
          </p>
        </div>

        {/* Divider line */}
        <div className="splash-bar-enter w-48 h-px bg-gradient-to-r from-transparent via-cyber-accent to-transparent"
          style={{ animationDelay: "600ms" }} />

        {/* Status text */}
        <div className="splash-text-enter h-5" style={{ animationDelay: "700ms" }}>
          <p className="text-[11px] tracking-widest text-cyber-accent uppercase font-mono">
            {statusMessages[statusIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="splash-text-enter w-64" style={{ animationDelay: "800ms" }}>
          <div className="w-full h-px bg-cyber-border rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyber-accent/50 to-cyber-accent shadow-glow-sm splash-progress" />
          </div>
        </div>

        {/* Version badge */}
        <p className="splash-text-enter text-[9px] tracking-[0.4em] text-cyber-muted/50 uppercase"
          style={{ animationDelay: "900ms" }}>
          v1.0 · 2026
        </p>

      </div>
    </div>
  );
}

/* Corner bracket decoration */
function Corner({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const base = "absolute w-8 h-8 splash-corner-enter";
  const styles: Record<string, string> = {
    "top-left":     "top-6 left-6 border-t border-l",
    "top-right":    "top-6 right-6 border-t border-r",
    "bottom-left":  "bottom-6 left-6 border-b border-l",
    "bottom-right": "bottom-6 right-6 border-b border-r",
  };

  return (
    <div className={`${base} ${styles[position]} border-cyber-accent/40`} />
  );
}
