import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  PlayCircle,
  Star,
  ListVideo,
  Tags,
} from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import ImageWithFallback from "../components/ImageWithFallback.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { useToast } from "../components/Toast.jsx";
import { decodeDramaUrl, encodeDramaUrl } from "../lib/normalizeUrl.js";
import { getDetail } from "../lib/clientApi.js";
import {
  addFavorite,
  addHistory,
  addWatchLater,
  isFavorite,
  removeFavorite,
} from "../lib/storage.js";

export default function Detail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const rawUrl = params.get("url") || "";
  const dramaUrl = decodeDramaUrl(rawUrl);
  const fallbackTitle = params.get("title") || "";
  const fallbackImage = params.get("image") || "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [fav, setFav] = useState(isFavorite(dramaUrl));

  useEffect(() => {
    if (!dramaUrl) return;
    setLoading(true);
    setErr(false);
    getDetail(dramaUrl).then((r) => {
      if (!r || r.status === false) {
        setErr(true);
      } else {
        setData(r);
        // Save to history.
        const d = r.data || {};
        addHistory({
          title:
            (d.title && d.title.toLowerCase() !== "melolo" && d.title) ||
            fallbackTitle ||
            "Detail Drama",
          url: dramaUrl,
          image: d.cover_image || fallbackImage,
          category: Array.isArray(d.genres) ? d.genres[0] : "",
          episodes: d.total_episodes || "",
        });
      }
      setLoading(false);
    });
  }, [dramaUrl]);

  const d = data?.data || {};
  const title =
    (d.title && d.title.toLowerCase() !== "melolo" && d.title) ||
    fallbackTitle ||
    "Detail Drama";
  const desc =
    (d.description || "").trim() ||
    "Sinopsis belum tersedia, tapi dramanya sudah bisa kamu cek dari episode yang ada.";
  const cover = d.cover_image || fallbackImage;
  const genres = Array.isArray(d.genres) ? d.genres : [];

  const item = { title, url: dramaUrl, image: cover, category: genres[0] || "", episodes: d.total_episodes || "", rating: d.rating || "" };

  return (
    <div className="min-h-screen">
      {/* Background blur */}
      <div className="absolute inset-x-0 top-0 h-[420px] overflow-hidden -z-10">
        {cover && (
          <ImageWithFallback
            src={cover}
            alt=""
            className="w-full h-full object-cover opacity-30 blur-2xl scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-0/60 via-bg-0/85 to-bg-0" />
      </div>

      <div className="container-rm pt-4 pb-safe-nav">
        <button
          onClick={() => navigate(-1)}
          className="glass h-10 w-10 rounded-full grid place-items-center"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        {loading ? (
          <div className="mt-6">
            <div className="aspect-[2/3] max-w-[220px] mx-auto rounded-3xl skeleton" />
            <div className="mt-6 h-8 w-2/3 rounded-md skeleton" />
            <div className="mt-3 h-4 w-full rounded-md skeleton" />
          </div>
        ) : err ? (
          <div className="mt-6">
            <ErrorState
              title="Detail nggak bisa dimuat"
              subtitle="API lagi sibuk. Coba lagi sebentar."
              onRetry={() => navigate(0)}
            />
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start">
              <div className="w-[200px] md:w-[260px] aspect-[2/3] rounded-3xl overflow-hidden glass shrink-0">
                <ImageWithFallback
                  src={cover}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-serif italic text-3xl md:text-5xl leading-tight">
                  {title}
                </h1>
                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="glass-amber rounded-full px-3 py-1 text-xs text-amber"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 max-w-xs mx-auto md:mx-0">
                  <GlassCard className="p-3">
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <Star size={12} className="text-amber" /> Rating
                    </div>
                    <p className="mt-1 font-semibold">{d.rating || "—"}</p>
                  </GlassCard>
                  <GlassCard className="p-3">
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <ListVideo size={12} className="text-amber" /> Episodes
                    </div>
                    <p className="mt-1 font-semibold">{d.total_episodes || "—"}</p>
                  </GlassCard>
                </div>

                <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-2">
                  <Link
                    to={"/watch?url=" + encodeDramaUrl(dramaUrl)}
                    className="inline-flex items-center gap-2 rounded-full bg-amber text-bg-0 px-5 py-2.5 text-sm font-semibold shadow-[0_0_24px_rgba(255,138,31,0.35)] hover:bg-amber-glow transition"
                  >
                    <PlayCircle size={18} /> Mulai Nonton
                  </Link>
                  <button
                    onClick={() => {
                      addWatchLater(item);
                      toast("Disimpan ke library");
                    }}
                    className="inline-flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm"
                  >
                    <Bookmark size={16} /> Simpan
                  </button>
                  <button
                    aria-label="Favorite"
                    onClick={() => {
                      if (fav) {
                        removeFavorite(dramaUrl);
                        setFav(false);
                        toast("Hapus dari favorite", { type: "info" });
                      } else {
                        addFavorite(item);
                        setFav(true);
                        toast("Favorite ditambahin");
                      }
                    }}
                    className={
                      "h-11 w-11 grid place-items-center rounded-full glass " +
                      (fav ? "text-rmerror" : "text-ink/80")
                    }
                  >
                    <Heart size={18} fill={fav ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-[17px] font-semibold flex items-center gap-2">
                <Tags size={16} className="text-amber" /> Tentang kisah ini
              </h2>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{desc}</p>
            </section>

            <section className="mt-8">
              <h2 className="text-[17px] font-semibold">Drama lain dengan rasa yang mirip</h2>
              <div className="mt-3">
                <LoadingSkeleton kind="row" />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
