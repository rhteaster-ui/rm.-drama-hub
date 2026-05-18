import { ChevronRight } from "lucide-react";
import DramaCard from "./DramaCard.jsx";

export default function DramaRow({ title, items = [], onSeeAll }) {
  if (!items.length) return null;
  return (
    <section className="mt-7">
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-[19px] font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="inline-flex items-center gap-0.5 text-sm text-amber hover:text-amber-glow"
        >
          Lihat semua <ChevronRight size={14} />
        </button>
      </div>
      <div className="-mx-4 md:mx-0 px-4 md:px-0 flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {items.map((item, i) => (
          <DramaCard key={item.url + i} item={item} variant="poster" />
        ))}
      </div>
    </section>
  );
}
