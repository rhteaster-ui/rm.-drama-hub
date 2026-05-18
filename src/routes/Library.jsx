import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import DramaCard from "../components/DramaCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useToast } from "../components/Toast.jsx";
import {
  getLibrary,
  removeFavorite,
  removeWatchLater,
  clearHistory,
  clearLibrary,
} from "../lib/storage.js";

function Section({ title, items, emptyText, onRemove }) {
  if (!items || !items.length) {
    return (
      <section className="mt-6">
        <h2 className="text-[17px] font-semibold mb-3">{title}</h2>
        <EmptyState title="Rak masih kosong." subtitle={emptyText} />
      </section>
    );
  }
  return (
    <section className="mt-6">
      <h2 className="text-[17px] font-semibold mb-3">
        {title} <span className="text-ink-muted font-normal text-sm">· {items.length}</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <div key={item.url + i} className="relative">
            <DramaCard item={item} variant="grid" />
            {onRemove && (
              <button
                onClick={() => onRemove(item.url)}
                className="absolute top-2 right-2 glass rounded-full px-2 py-0.5 text-[11px]"
              >
                Hapus
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Library() {
  const [lib, setLib] = useState(getLibrary());
  const { toast } = useToast();

  useEffect(() => {
    const h = () => setLib(getLibrary());
    window.addEventListener("rm:library", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("rm:library", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  return (
    <AppLayout headerActive="library">
      <div className="mt-2">
        <h1 className="text-2xl font-semibold">Rak tontonan lu</h1>
        <p className="text-sm text-ink-muted mt-1">
          Semua drama yang lu simpan, ada di sini.
        </p>
      </div>

      <Section
        title="Continue Watching"
        items={lib.continueWatching}
        emptyText="Mulai nonton drama, nanti muncul di sini."
      />
      <Section
        title="Favorite"
        items={lib.favorites}
        emptyText="Klik ❤ di halaman detail buat nambahin."
        onRemove={(u) => {
          removeFavorite(u);
          toast("Favorite dihapus", { type: "info" });
        }}
      />
      <Section
        title="Watch Later"
        items={lib.watchLater}
        emptyText="Simpan dulu, tonton kalau lagi senggang."
        onRemove={(u) => {
          removeWatchLater(u);
          toast("Watch later dihapus", { type: "info" });
        }}
      />
      <Section
        title="History"
        items={lib.history}
        emptyText="Riwayat nonton bakal muncul otomatis."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => {
            clearHistory();
            toast("History dibersihin");
          }}
          className="glass rounded-full px-4 py-2 text-sm text-ink/85"
        >
          Clear History
        </button>
        <button
          onClick={() => {
            clearLibrary();
            toast("Library dibersihin");
          }}
          className="rounded-full border border-[rgba(255,77,77,0.35)] text-rmerror px-4 py-2 text-sm hover:bg-[rgba(255,77,77,0.08)]"
        >
          Clear Library
        </button>
      </div>
    </AppLayout>
  );
}
