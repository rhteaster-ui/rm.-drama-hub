import { useEffect, useRef, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import DramaCard from "../components/DramaCard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { RECENT_QUERIES } from "../lib/constants.js";
import { searchDrama } from "../lib/clientApi.js";

export default function Search() {
  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const debRef = useRef();

  const run = (val) => {
    if (!val || val.trim().length < 2) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr(false);
    searchDrama(val.trim()).then((r) => {
      if (!r || r.status === false) {
        setErr(true);
        setData(null);
      } else {
        setData(r);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => run(q), 500);
    return () => clearTimeout(debRef.current);
  }, [q]);

  const results = Array.isArray(data?.data) ? data.data : [];

  return (
    <AppLayout headerActive="search">
      <div className="mt-2">
        <h1 className="text-2xl font-semibold">Cari yang cocok sama mood lu</h1>
        <p className="text-sm text-ink-muted mt-1">
          Judul, genre, atau vibe drama — masukin aja.
        </p>
      </div>

      <div className="mt-4">
        <SearchBar value={q} onChange={setQ} onSubmit={run} />
      </div>

      {!q && (
        <div className="mt-5">
          <p className="text-xs text-ink-muted mb-2">Pencarian populer</p>
          <div className="flex flex-wrap gap-2">
            {RECENT_QUERIES.map((r) => (
              <button
                key={r}
                onClick={() => setQ(r)}
                className="glass rounded-full px-3.5 py-1.5 text-sm text-ink/85 hover:text-ink"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        {loading && <LoadingSkeleton kind="grid" />}
        {!loading && err && (
          <ErrorState
            title="Gagal nyari drama. Coba lagi bentar."
            subtitle="Server lagi pegel, atau koneksi lu yang ngambek."
            onRetry={() => run(q)}
          />
        )}
        {!loading && !err && q && results.length === 0 && (
          <EmptyState
            title="Belum nemu dramanya."
            subtitle="Coba keyword lain yang lebih pendek."
          />
        )}
        {!loading && !err && results.length > 0 && (
          <>
            <p className="text-sm text-ink-muted mb-3">
              {results.length} hasil untuk “{q}”
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {results.map((item, i) => (
                <DramaCard key={item.url + i} item={item} variant="grid" />
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
