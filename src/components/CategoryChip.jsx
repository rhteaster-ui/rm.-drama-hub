export default function CategoryChip({ active = false, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "shrink-0 inline-flex items-center gap-2 rounded-2xl px-4 h-11 text-sm font-medium transition " +
        (active
          ? "glass-amber text-ink border-[rgba(255,138,31,0.55)] shadow-[0_0_18px_rgba(255,138,31,0.25)]"
          : "glass text-ink/85 hover:text-ink")
      }
    >
      {Icon && <Icon size={16} className={active ? "text-amber" : "text-amber/90"} />}
      {label}
    </button>
  );
}
