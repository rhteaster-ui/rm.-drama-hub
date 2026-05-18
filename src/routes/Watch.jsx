import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download as DownloadIcon, Link as LinkIcon, PlayCircle, ListVideo } from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import { useToast } from "../components/Toast.jsx";
import { decodeDramaUrl } from "../lib/normalizeUrl.js";
import { getDownload } from "../lib/clientApi.js";

function extractEpisodes(data) {
  if (!data) return [];
  // Many possible shapes. Walk through known suspects.
  const candidates = [
    data.episodes,
    data.episode,
    data.data,
    data.results,
    data.list,
  ].filter(Array.isArray);

  for (const arr of candidates) {
    if (arr.length && arr.some((x) => x && (x.video || x.video_url || x.download || x.download_url || x.link || x.url))) {
      return arr;
    }
  }
  // Sometimes data.data is itself an object with episodes
  if (data.data && typeof data.data === "object" && Array.isArray(data.data.episodes)) {
    return data.data.episodes;
  }
  return [];
}

function pickLink(ep) {
  return (
    ep?.video ||
    ep?.video_url ||
    ep?.download ||
    ep?.download_url ||
    ep?.link ||
    ep?.url ||
    ""
  );
}

export default function Watch() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const url = decodeDramaUrl(params.get("url") || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    getDownload(url).then((r) => {
      setData(r);
      setLoading(false);
    });
  }, [url]);

  const episodes = extractEpisodes(data?.data ? data : { data });
  const singleLink = !episodes.length
    ? pickLink(data?.data) || pickLink(data)
    : "";

  return (
    <div className="min-h-screen">
      <div className="container-rm pt-4 pb-safe-nav">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="glass h-10 w-10 rounded-full grid place-items-center"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs text-ink-muted">Watch</p>
            <h1 className="text-xl font-semibold">Mulai nonton</h1>
          </div>
        </div>

        {loading ? (
          <div className="mt-6">
            <LoadingSkeleton kind="horizontal" />
          </div>
        ) : episodes.length ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {episodes.map((ep, i) => {
              const link = pickLink(ep);
              const label = ep.title || ep.name || "Episode " + (ep.episode || ep.ep || i + 1);
              return (
                <GlassCard key={i} className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl glass-amber grid place-items-center">
                    <ListVideo size={16} className="text-amber" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{label}</p>
                    <p className="text-xs text-ink-muted truncate">{link || "Link belum tersedia"}</p>
                  </div>
                  {link && (
                    <>
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="h-9 w-9 grid place-items-center rounded-full bg-amber text-bg-0"
                      >
                        <PlayCircle size={16} />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(link);
                          toast("Link disalin");
                        }}
                        className="h-9 w-9 grid place-items-center rounded-full glass"
                      >
                        <LinkIcon size={14} />
                      </button>
                      <a
                        href={link}
                        download
                        className="h-9 w-9 grid place-items-center rounded-full glass"
                      >
                        <DownloadIcon size={14} />
                      </a>
                    </>
                  )}
                </GlassCard>
              );
            })}
          </div>
        ) : singleLink ? (
          <GlassCard className="mt-6 p-5">
            <p className="text-sm font-medium">Tersedia 1 link</p>
            <p className="mt-1 text-xs text-ink-muted break-all">{singleLink}</p>
            <div className="mt-4 flex gap-2">
              <a
                href={singleLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber text-bg-0 px-4 py-2 text-sm font-medium"
              >
                <PlayCircle size={16} /> Play
              </a>
              <a
                href={singleLink}
                download
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm"
              >
                <DownloadIcon size={14} /> Download
              </a>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(singleLink);
                  toast("Link disalin");
                }}
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm"
              >
                <LinkIcon size={14} /> Copy
              </button>
            </div>
          </GlassCard>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="Episode belum bisa dimuat."
              subtitle="Coba lagi nanti atau buka detail drama."
            />
          </div>
        )}
      </div>
    </div>
  );
}
