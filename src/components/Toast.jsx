import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

const ToastCtx = createContext(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) return { toast: () => {} };
  return ctx;
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const toast = useCallback((msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setItems((x) => [...x, { id, msg, type: opts.type || "success" }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), opts.duration || 2400);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none">
        {items.map((it) => {
          const Icon =
            it.type === "error" ? AlertCircle : it.type === "info" ? Info : CheckCircle2;
          const color =
            it.type === "error"
              ? "text-rmerror border-[rgba(255,77,77,0.35)]"
              : it.type === "info"
                ? "text-ink border-white/15"
                : "text-rmok border-[rgba(34,197,94,0.35)]";
          return (
            <div
              key={it.id}
              className={
                "glass rounded-full px-4 py-2.5 text-sm flex items-center gap-2 border " + color
              }
            >
              <Icon size={16} />
              <span className="text-ink">{it.msg}</span>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
