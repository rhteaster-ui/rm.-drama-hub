import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import HeroBanner from "../components/HeroBanner.jsx";
import CategoryChip from "../components/CategoryChip.jsx";
import DramaRow from "../components/DramaRow.jsx";
import DramaCard from "../components/DramaCard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { CATEGORIES } from "../lib/constants.js";
import { getHome } from "../lib/clientApi.js";

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [activeCat, setActiveCat] = useState("CEO");

  const load = () => {
    setLoading(true);
    setErr(false);
    getHome().then((r) => {
      if (!r || r.status === false) {
        setErr(true);
      } else {
        setData(r);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const list = Array.isArray(data?.data) ? data.data : [];

  const { banners, rowList, gridList, cardList } = useMemo(() => {
    return {
      banners: list.filter((x) => x.type === "banner").slice(0, 5),
      rowList: list.filter((x) => x.type === "list"),
      gridList: list.filter((x) => x.type === "list").slice(0, 4),
      cardList: list.filter((x) => x.type === "card"),
    };
  }, [list]);

  return (
    <AppLayout headerActive="home">
      <div className="mt-2">
        <SearchBar
          readOnly
          onClick={() => navigate("/search")}
          value=""
        />
      </div>

      <div className="mt-5">
        {loading ? (
          <HeroBanner loading />
        ) : err ? (
          <ErrorState
            title="Gagal memuat drama"
            subtitle="Mungkin koneksi atau API key sedang sibuk. Coba lagi sebentar."
            onRetry={load}
          />
        ) : (
          <HeroBanner items={banners.length ? banners : list.slice(0, 3)} />
        )}
      </div>

      <div className="mt-5 -mx-4 px-4 md:mx-0 md:px-0 flex gap-2.5 overflow-x-auto no-scrollbar">
        {CATEGORIES.slice(0, 5).map((c) => (
          <CategoryChip
            key={c.key}
            icon={c.icon}
            label={c.label}
            active={activeCat === c.key}
            onClick={() => {
              setActiveCat(c.key);
              navigate("/category?c=" + encodeURIComponent(c.key));
            }}
          />
        ))}
      </div>

      {loading ? (
        <div className="mt-7">
          <div className="h-5 w-44 rounded-md skeleton mb-3" />
          <LoadingSkeleton kind="row" />
        </div>
      ) : (
        <DramaRow
          title="Lagi ramai malam ini"
          items={rowList}
          onSeeAll={() => navigate("/category")}
        />
      )}

      {loading ? null : (
        <section className="mt-7">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-[19px] font-semibold">Pilihan buat yang suka plot nekat</h2>
            <button
              type="button"
              onClick={() => navigate("/category")}
              className="text-sm text-amber hover:text-amber-glow"
            >
              Lihat semua ›
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gridList.map((item, i) => (
              <DramaCard key={item.url + i} item={item} variant="horizontal" />
            ))}
          </div>
        </section>
      )}

      {!loading && cardList.length > 0 && (
        <section className="mt-7">
          <h2 className="text-[19px] font-semibold mb-3">Drama singkat buat sekali duduk</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cardList.map((item, i) => (
              <DramaCard key={item.url + i} item={item} variant="grid" />
            ))}
          </div>
        </section>
      )}
    </AppLayout>
  );
}
