import { useEffect } from "react";

/* ---------------------------
   Possible toast notification types
--------------------------- */
type ToastType = "success" | "error";

/* ---------------------------
   Props for the Toast component
--------------------------- */
interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

/* ---------------------------
   Toast notification component
   Displays a message at the bottom-right of the screen.
   Auto-dismisses after 3 seconds.
--------------------------- */
export default function Toast({ message, type, onClose }: ToastProps) {

  /* Auto-close the toast after 3 seconds */
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}
