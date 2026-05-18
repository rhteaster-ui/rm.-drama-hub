// Frontend only ever talks to our internal /api proxy. API keys never leave
// the server. If a call fails we still resolve a structured payload so UI
// components can render error/empty states without try/catch noise.

async function safeFetch(path) {
  try {
    const res = await fetch(path, { headers: { Accept: "application/json" } });
    const data = await res.json().catch(() => null);
    if (!data) return { status: false, message: "Respons kosong dari server." };
    return data;
  } catch (err) {
    return { status: false, message: "Koneksi terputus.", error: String(err && err.message) };
  }
}

export function getHome() {
  return safeFetch("/api/home");
}

export function searchDrama(q) {
  return safeFetch("/api/search?q=" + encodeURIComponent(q || ""));
}

export function getDetail(url) {
  return safeFetch("/api/detail?url=" + encodeURIComponent(url || ""));
}

export function getCategory(url) {
  return safeFetch("/api/category?url=" + encodeURIComponent(url || ""));
}

export function getDownload(url) {
  return safeFetch("/api/download?url=" + encodeURIComponent(url || ""));
}
