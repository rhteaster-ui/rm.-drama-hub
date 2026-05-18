import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import CategoryChip from "../components/CategoryChip.jsx";
import DramaCard from "../components/DramaCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import { CATEGORIES } from "../lib/constants.js";
import { getHome } from "../lib/clientApi.js";

export default function Category() {
  const [params, setParams] = useSearchParams();
  const active = params.get("c") || "CEO";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHome().then((r) => {
      setData(r);
      setLoading(false);
    });
  }, []);

  const all = Array.isArray(data?.data) ? data.data : [];

  const filtered = useMemo(() => {
    const a = active.toLowerCase();
    return all.filter((x) => (x.category || "").toLowerCase() === a);
  }, [all, active]);

  return (
    <AppLayout headerActive="category">
      <div className="mt-2">
        <h1 className="text-2xl font-semibold">Kategori rasa drama</h1>
        <p className="text-sm text-ink-muted mt-1">Pilih mood, bukan cuma genre.</p>
      </div>

      <div className="mt-5 -mx-4 px-4 md:mx-0 md:px-0 flex gap-2.5 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.key}
            icon={c.icon}
            label={c.label}
            active={active === c.key}
            onClick={() => setParams({ c: c.key })}
          />
        ))}
      </div>

      <h2 className="mt-6 text-[17px] font-semibold">
        Drama dengan rasa {active}
      </h2>

      <div className="mt-3">
        {loading ? (
          <LoadingSkeleton kind="grid" />
        ) : filtered.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filtered.map((item, i) => (
              <DramaCard key={item.url + i} item={item} variant="grid" />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Kategori ini masih sepi."
            subtitle="Coba kategori lain — atau cek drama trending dulu."
          />
        )}
      </div>
    </AppLayout>
  );
}
