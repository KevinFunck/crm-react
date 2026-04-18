import { useEffect } from "react";

type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

/* Auto-dismisses after 3 seconds */
export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-glow text-sm font-medium ${
      type === "success"
        ? "bg-cyber-card border-cyber-accent/40 text-cyber-accent"
        : "bg-cyber-card border-cyber-pink/40 text-cyber-pink"
    }`}>
      <span className="text-base">{type === "success" ? "✓" : "⚠"}</span>
      {message}
    </div>
  );
}
