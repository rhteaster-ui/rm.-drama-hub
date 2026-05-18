import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onClick,
  placeholder = "Cari drama, genre, atau vibes...",
  readOnly = false,
  showFilter = true,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit(value);
      }}
      className="flex items-center gap-3"
    >
      <label
        className="glass flex-1 flex items-center gap-3 rounded-2xl px-4 h-12 cursor-text"
        onClick={onClick}
      >
        <Search size={18} className="text-ink-muted" />
        <input
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-muted"
        />
      </label>
      {showFilter && (
        <button
          type="button"
          aria-label="Filter"
          className="glass grid place-items-center h-12 w-12 rounded-2xl text-ink/80"
        >
          <SlidersHorizontal size={18} />
        </button>
      )}
    </form>
  );
}
