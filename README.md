# rm.

> Drama pendek, plot padat, rasa candu.

Mini drama streaming/library client untuk komunitas — UI dark cinematic dengan aksen amber, dibangun pakai **Vite + React + React Router DOM + Tailwind CSS**, dengan **Vercel Serverless Functions** sebagai proxy ke API Melolo.

## Stack

- Vite + React 18
- React Router DOM v6
- Tailwind CSS v3
- Lucide React (icons)
- LocalStorage (Library / Favorite / History)
- Vercel Serverless Functions (`/api/*`)
- PWA-ready (manifest + install prompt)

## Struktur

```
rm/
├── api/                # Vercel serverless functions (server-side only)
│   ├── _melolo.js      # helper: key rotation, normalize url, fetch upstream
│   ├── home.js
│   ├── search.js
│   ├── detail.js
│   ├── category.js
│   └── download.js
├── public/
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── og-banner.png
│   └── manifest.webmanifest
├── src/
│   ├── components/
│   ├── lib/
│   ├── routes/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── package.json
```

## Development

```bash
bun install   # atau: npm install
bun dev       # buka http://localhost:8080
```

Folder `/api` di-mock secara lokal oleh plugin di `vite.config.js` — jadi `/api/home`, `/api/search?q=...`, dll. langsung jalan saat `vite dev`. Di production, Vercel yang menangani.

## Environment variable (Vercel)

| Key | Required | Catatan |
| --- | --- | --- |
| `MELOLO_API_KEY_BACKUP` | opsional, sangat disarankan | Key cadangan kalau primary kena limit |

Set lewat **Vercel Dashboard → Project → Settings → Environment Variables**.

> **API key keamanan**: key primary ada di `api/_melolo.js` (server-side only). Frontend tidak pernah memegang key. Jangan letakkan API key di folder `src/` atau pakai prefix `VITE_`.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Import di Vercel — preset Vite akan terdeteksi otomatis.
3. Set env var `MELOLO_API_KEY_BACKUP` (opsional).
4. Deploy.

`vercel.json` sudah berisi SPA rewrite supaya semua route React Router jalan, dengan pengecualian `/api/*`.

## Routes

- `/` Home — hero carousel, kategori, drama trending
- `/search` Search dengan debounce 500ms
- `/category` Kategori (filter dari home + siap untuk endpoint category)
- `/library` Favorite, Watch Later, History (localStorage)
- `/profile` API status, install PWA, settings
- `/detail?url=...` Detail drama
- `/watch?url=...` Episode list / download

## Developer

Isi sendiri.
