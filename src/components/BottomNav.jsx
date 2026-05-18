import { NavLink } from "react-router-dom";
import { Home, Search, LayoutGrid, Bookmark, UserRound } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/search", label: "Search", icon: Search },
  { to: "/category", label: "Category", icon: LayoutGrid },
  { to: "/library", label: "Library", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function BottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div
        className="container-rm pointer-events-auto"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        <div className="glass rounded-3xl px-2 py-2 flex justify-between items-stretch">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                "flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition " +
                (isActive
                  ? "text-amber"
                  : "text-ink-muted hover:text-ink/90")
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={
                      "grid place-items-center h-8 w-8 rounded-xl " +
                      (isActive
                        ? "bg-[rgba(255,138,31,0.12)] border border-[rgba(255,138,31,0.45)] shadow-[0_0_18px_rgba(255,138,31,0.35)]"
                        : "")
                    }
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  <span className="text-[10.5px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
