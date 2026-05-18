import { AlertTriangle } from "lucide-react";

export default function ErrorState({ title = "Ada yang error", subtitle, onRetry }) {
  return (
    <div className="glass rounded-3xl px-6 py-8 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-[rgba(255,77,77,0.1)] border border-[rgba(255,77,77,0.35)] grid place-items-center mb-3">
        <AlertTriangle size={20} className="text-rmerror" />
      </div>
      <h3 className="font-semibold text-[17px]">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded-full border border-[rgba(255,138,31,0.55)] text-amber px-4 py-2 text-sm hover:bg-[rgba(255,138,31,0.08)]"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
