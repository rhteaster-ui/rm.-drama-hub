export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="glass rounded-3xl px-6 py-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl glass-amber grid place-items-center mb-3">
        <span className="font-serif italic text-gradient-amber text-lg">rm.</span>
      </div>
      <h3 className="font-semibold text-[17px]">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
