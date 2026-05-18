import { useEffect, useState } from "react";
import {
  Download as DownloadIcon,
  Trash2,
  RefreshCcw,
  Bookmark,
  Clock3,
  Heart,
  Share2,
  Activity,
} from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";
import GlassCard from "../components/GlassCard.jsx";
import ApiStatusBadge from "../components/ApiStatusBadge.jsx";
import { useToast } from "../components/Toast.jsx";
import {
  getLibrary,
  clearHistory,
  clearLibrary,
  resetLocalData,
} from "../lib/storage.js";

function useInstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBefore = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    const standalone =
      window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) setInstalled(true);
    window.addEventListener("beforeinstallprompt", onBefore);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return false;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferred(null);
    return outcome === "accepted";
  };

  return { canInstall: !!deferred && !installed, installed, install };
}

function Stat({ icon: Icon, label, value }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-muted">{label}</span>
        <Icon size={14} className="text-amber" />
      </div>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </GlassCard>
  );
}

export default function Profile() {
  const { toast } = useToast();
  const [lib, setLib] = useState(getLibrary());
  const { canInstall, installed, install } = useInstallPrompt();

  useEffect(() => {
    const h = () => setLib(getLibrary());
    window.addEventListener("rm:library", h);
    return () => window.removeEventListener("rm:library", h);
  }, []);

  return (
    <AppLayout headerActive="profile">
      {/* Identity card */}
      <div className="mt-2 glass-amber rounded-3xl p-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-[rgba(255,138,31,0.12)] border border-[rgba(255,138,31,0.45)] grid place-items-center shadow-[0_0_24px_rgba(255,138,31,0.25)]">
          <span className="font-serif italic text-2xl text-gradient-amber">rm</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold">rxyz</p>
          <p className="text-xs text-ink-muted">Personal Member Client</p>
          <p className="text-xs text-amber mt-0.5">Free Rotation Mode</p>
        </div>
        <ApiStatusBadge active label="API OK" />
      </div>

      {/* PWA install card — only shows when installable & not installed */}
      {(canInstall || !installed) && (
        <GlassCard amber className="mt-4 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl glass grid place-items-center">
            <DownloadIcon size={18} className="text-amber" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Install ke layar utama</p>
            <p className="text-xs text-ink-muted">
              {canInstall
                ? "Tambah rm. ke home screen biar buka tinggal tap."
                : installed
                  ? "Sudah terpasang di perangkat ini."
                  : "Buka di Chrome/Edge atau “Add to Home Screen” di Safari."}
            </p>
          </div>
          <button
            disabled={!canInstall}
            onClick={async () => {
              const ok = await install();
              if (ok) toast("rm. terpasang di layar utama");
            }}
            className={
              "rounded-full px-4 py-2 text-sm font-medium transition " +
              (canInstall
                ? "bg-amber text-bg-0 hover:bg-amber-glow"
                : "glass text-ink-muted cursor-not-allowed")
            }
          >
            {installed ? "Terpasang" : "Install"}
          </button>
        </GlassCard>
      )}

      {/* API status card */}
      <GlassCard className="mt-4 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">API Status</p>
          <Activity size={14} className="text-rmok" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-ink-muted">Auto Rotate</p>
            <p className="mt-1 text-rmok font-medium">Active</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-ink-muted">Mode</p>
            <p className="mt-1 font-medium">Server Proxy</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-ink-muted">Primary</p>
            <p className="mt-1 font-medium">Radcore</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-ink-muted">Backup</p>
            <p className="mt-1 font-medium">Env</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Key diputar otomatis kalau salah satu limit. API key aman di server, bukan di frontend.
        </p>
      </GlassCard>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat icon={Bookmark} label="Drama disimpan" value={lib.favorites.length + lib.watchLater.length} />
        <Stat icon={Clock3} label="Riwayat nonton" value={lib.history.length} />
        <Stat icon={Heart} label="Favorite" value={lib.favorites.length} />
        <Stat icon={DownloadIcon} label="Watch later" value={lib.watchLater.length} />
      </div>

      {/* Settings */}
      <GlassCard className="mt-4 p-2">
        <button
          onClick={() => {
            clearHistory();
            toast("History dibersihin");
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5"
        >
          <Clock3 size={16} className="text-ink-muted" />
          <span className="text-sm">Clear History</span>
        </button>
        <button
          onClick={() => {
            clearLibrary();
            toast("Library dibersihin");
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5"
        >
          <Trash2 size={16} className="text-ink-muted" />
          <span className="text-sm">Clear Library</span>
        </button>
        <button
          onClick={() => {
            resetLocalData();
            toast("Semua data lokal direset");
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5"
        >
          <RefreshCcw size={16} className="text-ink-muted" />
          <span className="text-sm">Reset Local Data</span>
        </button>
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-3">
            <Share2 size={16} className="text-ink-muted" />
            <span className="text-sm">Theme</span>
          </div>
          <span className="text-xs text-amber">Dark Amber</span>
        </div>
      </GlassCard>

      {/* App info */}
      <GlassCard className="mt-4 p-4 text-xs text-ink-muted leading-relaxed">
        <p className="text-ink text-sm font-medium mb-2">Tentang rm.</p>
        <p>
          rm. dibuat untuk pengalaman nonton drama pendek yang lebih rapi. Data library
          disimpan di browser lu — jadi aman, lokal, dan personal.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-y-1">
          <span>Nama</span><span className="text-ink">rm.</span>
          <span>Versi</span><span className="text-ink">1.0.0</span>
          <span>Framework</span><span className="text-ink">Vite + React</span>
          <span>Routing</span><span className="text-ink">React Router DOM</span>
          <span>Styling</span><span className="text-ink">Tailwind CSS</span>
          <span>Backend</span><span className="text-ink">Vercel Serverless</span>
          <span>Developer</span><span className="text-ink">—</span>
        </div>
      </GlassCard>

      <p className="text-center text-xs text-ink-muted mt-6 mb-4">
        rm. © {new Date().getFullYear()}
      </p>
    </AppLayout>
  );
}
