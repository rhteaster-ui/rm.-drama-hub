import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";
import LogoText from "./LogoText.jsx";
import { TAGLINE } from "../lib/constants.js";

export default function Header({ active = "home" }) {
  const navItem = (label, to, key) => (
    <Link
      to={to}
      className={
        "relative px-2 py-1 text-[15px] transition-colors " +
        (active === key ? "text-amber" : "text-ink/85 hover:text-ink")
      }
    >
      {label}
      {active === key && (
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-[2px] w-7 rounded-full bg-amber shadow-[0_0_10px_rgba(255,138,31,0.7)]" />
      )}
    </Link>
  );

  return (
    <header className="container-rm pt-4 pb-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <LogoText className="text-3xl" />
          <span className="hidden md:inline text-xs text-ink-muted ml-2">{TAGLINE}</span>
        </Link>

        <nav className="flex items-center gap-7 md:gap-10">
          {navItem("Home", "/", "home")}
          {navItem("Genre", "/category", "category")}
          {navItem("My List", "/library", "library")}
        </nav>

        <Link
          to="/profile"
          aria-label="Profile"
          className="grid h-9 w-9 place-items-center rounded-full glass"
        >
          <UserRound size={18} className="text-ink/80" />
        </Link>
      </div>
    </header>
  );
}
