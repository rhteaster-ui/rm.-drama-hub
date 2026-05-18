# Plan: rm. — Mini Drama Streaming Client

## Catatan penting tentang stack

Project saat ini memakai template **TanStack Start** (SSR, file-based routing di `src/routes/`, wrangler/Cloudflare). Spec kamu meminta **Vite + React + React Router DOM + Vercel Serverless Functions di `/api**` — ini stack yang berbeda dan tidak kompatibel dengan template aslinya.

Rencana saya: **mengganti scaffold** project ke Vite + React murni sesuai spec kamu. File TanStack Start (`src/routes/`, `src/router.tsx`, `src/start.ts`, `src/server.ts`, `wrangler.jsonc`, `vite.config.ts` versi TanStack) akan dihapus, lalu disusun ulang sesuai struktur folder yang kamu mau. Tailwind v4 yang sudah ada akan diganti ke Tailwind v3 (lebih cocok dengan `tailwind.config.js` + `postcss.config.js` yang kamu spek-kan).

Konfirmasi implisit: jika kamu approve plan ini, saya akan rebuild scaffold.

---

## Scope

Streaming UI mobile-first dengan tampilan **wajib mirip screenshot** (dark cinematic + amber accent + glass), data dari API Melolo via proxy `/api/*` di Vercel, dengan Library/Favorite/History di localStorage.

## Struktur project final

```
rm/
├── api/
│   ├── _melolo.js        # helper: getApiKeys, fetchWithRotation, normalizeDramaUrl, buildApiUrl
│   ├── home.js
│   ├── search.js
│   ├── detail.js
│   ├── category.js
│   └── download.js
├── public/
│   ├── favicon.svg       # rounded square + "rm." amber gradient
│   └── og-banner.png     # 1200x630 generated
├── src/
│   ├── main.jsx
│   ├── App.jsx           # <BrowserRouter> + routes
│   ├── index.css         # tailwind + tokens
│   ├── routes/           # Home, Search, Category, Library, Profile, Detail, Watch
│   ├── components/       # AppLayout, Header, BottomNav, SearchBar, HeroBanner,
│   │                     # DramaCard, DramaRow, CategoryChip, GlassCard,
│   │                     # LoadingSkeleton, EmptyState, ErrorState,
│   │                     # ApiStatusBadge, Toast, ImageWithFallback, LogoText
│   └── lib/
│       ├── clientApi.js  # getHome/searchDrama/getDetail/getCategory/getDownload
│       ├── normalizeUrl.js
│       ├── storage.js    # localStorage key: rm_library
│       └── constants.js  # categories, recent searches, fallback copy
├── index.html            # SEO + OG + favicon
├── package.json          # scripts: dev/build/preview
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Tahapan implementasi

1. **Wipe scaffold lama** — hapus `src/routes/`, `src/router.tsx`, `src/start.ts`, `src/server.ts`, `src/routeTree.gen.ts`, `wrangler.jsonc`, TanStack deps di `package.json`.
2. **Setup Vite + React + Router + Tailwind v3** — `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html` (dengan semua meta OG/Twitter), `src/main.jsx`, `src/index.css` dengan CSS vars semua warna brand.
3. **API serverless `/api/***` — implement `_melolo.js` (helper rotation persis seperti contoh kamu), lalu 5 handler endpoint. Key primary diisi placeholder `"ISI_KEY_PERTAMA_DI_SINI"` di file (kamu ganti sendiri sebelum deploy — saya tidak punya key kamu).
4. **lib/** — `clientApi.js`, `normalizeUrl.js` (perbaiki double-URL `melolo.comhttps://melolo.com`), `storage.js` (favorites/watchLater/history/continueWatching), `constants.js`.
5. **Components** — semua komponen daftar di atas, dengan `GlassCard`, `ImageWithFallback` (fallback gradient + teks "rm."), `BottomNav` floating glass mobile + top-nav desktop, `LogoText` italic amber gradient dengan titik.
6. **Routes/Pages** — Home (hero carousel auto-slide + dots, category chips, 3 section list/card sesuai screenshot), Search (debounce 500ms, recent chips, grid result), Category (filter dari /api/home dulu, siap untuk /api/category), Detail (blur background dari cover, save history), Watch (renderer fleksibel untuk berbagai shape response), Library (4 section), Profile (stats + settings + API status badge, tanpa expose key).
7. **OG banner** — generate `public/og-banner.png` 1200×630 dark cinematic dengan logo + tagline.
8. **README** — instruksi env var `MELOLO_API_KEY_BACKUP` di Vercel + cara isi primary key.

## UI fidelity dengan screenshot

- Header: logo `rm.` kiri (orange gradient italic), nav center (Home/Genre/My List dengan underline orange di aktif), avatar bulat glass di kanan.
- Search bar full-width + filter button kotak terpisah di kanan.
- Hero banner besar `rounded-3xl`, genre chip orange kecil di pojok atas, title serif besar, deskripsi muted, tombol Play pill outline amber, dots indicator bawah-tengah.
- Row category chips horizontal scroll: CEO (active, border amber glow), Fantasy, Revenge, Billionaire, Romance — masing-masing icon Lucide di kiri.
- Section "Lagi ramai malam ini" — horizontal scroll, poster portrait + title overlay serif italic + meta card di bawah (title + 🔥 viewers).
- Section "Pilihan buat yang suka plot nekat" — grid 2 kolom, layout horizontal card (poster kiri kecil + info kanan dengan badge rating bintang).
- Bottom nav floating glass dengan 5 item, Home aktif orange glow.

## Detail teknis

- **Tailwind v3** + CSS variables di `:root` untuk semua token warna brand (background trio, accent amber trio, text, glass, border). Class utility custom: `.glass`, `.glass-amber`, `.glow-amber`.
- **Routing**: `react-router-dom` v6 `<BrowserRouter>` dengan `AppLayout` membungkus 5 route utama (Home/Search/Category/Library/Profile) supaya BottomNav persistent. Detail & Watch tetap pakai layout sama tapi dengan back button.
- **URL drama**: selalu `normalizeDramaUrl` → `encodeURIComponent` sebelum kirim ke `/api/*`. Server juga normalize sekali lagi (double safety).
- **API key**: hanya di `/api/_melolo.js` server-side. Frontend tidak pernah pegang key. `clientApi.js` hanya fetch ke `/api/*`. Logging response tanpa key.
- **Image fallback**: `<ImageWithFallback>` dengan `onError` → render div gradient dark + teks "rm." di tengah.
- **Toast**: implementasi kecil custom (provider + hook) — tanpa library tambahan.
- **Loading**: skeleton shimmer pakai Tailwind `animate-pulse` + bg glass.

## Vercel readiness

- Folder `/api` di root → Vercel otomatis treat sebagai serverless functions.
- `vite build` → `dist/` → Vercel auto-detect Vite preset.
- `vercel.json` tidak diperlukan kecuali butuh rewrite SPA — saya tambahkan `vercel.json` minimal dengan SPA fallback ke `/index.html` (kecuali path `/api/*`).
- Env var di-doc di README: `MELOLO_API_KEY_BACKUP`.

## Yang TIDAK saya kerjakan

- Tidak deploy ke Vercel (manual dari kamu).
- Tidak handle login/multi-user — single-client member experience sesuai spek.

YG DIKERJAKAN TARO KEY SALAH SATU DI HARDCORE 

- SI6hI
  Itu key nya utk endpoin 

Pastikan sesuai perintah harus wajib mirip dgn file screenshot.

&nbsp;

TERAKHIR PWA disini bagian profil wajib ada icon install add to home atau install utk tambah layar utama dimana akan muncul jika user tidak menginstalnya. Sisanya foto favicon, nama web, deskripsi, tech, framework yg digunakan, sama info developer (nnti ku isi sendiri)

Approve untuk mulai eksekusi?