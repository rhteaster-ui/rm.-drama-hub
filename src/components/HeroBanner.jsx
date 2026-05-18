import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback.jsx";
import { encodeDramaUrl } from "../lib/normalizeUrl.js";
import { FALLBACK_DESC } from "../lib/constants.js";

export default function HeroBanner({ items = [], loading = false }) {
  const [idx, setIdx] = useState(0);
  const list = items.length ? items : [];

  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [list.length]);

  if (loading) {
    return (
      <div className="relative h-[300px] md:h-[420px] rounded-3xl overflow-hidden skeleton" />
    );
  }
  if (!list.length) return null;

  const item = list[idx % list.length];
  const desc = (item.description || "").trim() || FALLBACK_DESC;

  return (
    <div className="relative h-[320px] md:h-[440px] rounded-3xl overflow-hidden glass">
      <ImageWithFallback
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-between p-5 md:p-8">
        <div>
          <span className="inline-block text-amber text-xs font-medium tracking-wide">
            {item.category || "Featured"}
          </span>
          <h2 className="mt-2 font-serif italic text-4xl md:text-6xl leading-[1.05] max-w-[80%] md:max-w-[55%]">
            {item.title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-ink-muted max-w-[80%] md:max-w-[50%]">
            {desc.length > 110 ? desc.slice(0, 108) + "…" : desc}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={"/detail?url=" + encodeDramaUrl(item.url)}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,138,31,0.55)] text-amber px-5 py-2.5 text-sm font-medium hover:bg-[rgba(255,138,31,0.08)] transition"
          >
            <PlayCircle size={18} />
            Play
          </Link>

          <div className="flex items-center gap-1.5">
            {list.slice(0, Math.min(5, list.length)).map((_, i) => (
              <span
                key={i}
                className={
                  "h-1.5 rounded-full transition-all " +
                  (i === idx % Math.min(5, list.length)
                    ? "w-5 bg-amber"
                    : "w-1.5 bg-white/30")
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
