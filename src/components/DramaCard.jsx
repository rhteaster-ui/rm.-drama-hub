import { Link } from "react-router-dom";
import { Flame, Star } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback.jsx";
import { encodeDramaUrl } from "../lib/normalizeUrl.js";

// variant:
//   "poster" — vertical poster card with overlay title and meta footer (home row)
//   "horizontal" — 2-col layout: poster left + info right (home grid section)
//   "grid" — uniform grid card for search/category results
export default function DramaCard({ item, variant = "poster" }) {
  const href = "/detail?url=" + encodeDramaUrl(item.url || "");

  if (variant === "horizontal") {
    return (
      <Link to={href} className="glass rounded-2xl overflow-hidden flex h-[120px] hover:border-[rgba(255,138,31,0.35)] transition">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="h-full w-[90px] object-cover shrink-0"
        />
        <div className="flex-1 p-3 flex flex-col justify-between">
          <h3 className="font-serif italic text-[17px] leading-tight line-clamp-2">
            {item.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">
              {item.episodes ? "Ep " + item.episodes : item.category || "Drama"}
            </span>
            <span className="inline-flex items-center gap-1 glass rounded-md px-1.5 py-0.5 text-xs">
              <Star size={11} className="text-amber fill-amber" />
              <span className="font-medium">{item.rating || "9.0"}</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "grid") {
    return (
      <Link to={href} className="block group">
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass">
          <ImageWithFallback
            src={item.image}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-serif italic text-base leading-tight line-clamp-2">
              {item.title}
            </h3>
          </div>
        </div>
      </Link>
    );
  }

  // poster (home row)
  return (
    <Link to={href} className="shrink-0 w-[150px] block group">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="font-serif italic text-[15px] leading-tight line-clamp-2">
            {item.title}
          </h3>
        </div>
      </div>
      <div className="glass rounded-xl mt-2 px-3 py-2">
        <p className="text-[13px] text-ink truncate">{item.title}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
          <Flame size={12} className="text-amber" />
          <span>{item.episodes ? "Ep " + item.episodes : (item.category || "Drama")}</span>
        </div>
      </div>
    </Link>
  );
}
