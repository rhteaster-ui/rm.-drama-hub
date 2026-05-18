// Server-side only helper. Never imported by frontend.
// Vercel serverless functions live in /api at the repo root.

const BASE_URL = "https://api.theresav.biz.id";

// Key pertama hardcode di server only.
const PRIMARY_API_KEY = "SI6hI";

// Key kedua dari env Vercel.
const BACKUP_API_KEY = process.env.MELOLO_API_KEY_BACKUP;

function getApiKeys() {
  return [
    { name: "primary", key: PRIMARY_API_KEY },
    { name: "backup", key: BACKUP_API_KEY },
  ].filter((item) => item.key && item.key !== "ISI_KEY_PERTAMA_DI_SINI");
}

export function normalizeDramaUrl(url = "") {
  if (!url) return "";
  let clean = String(url).trim();

  // Fix double-prefix variants that come back from upstream.
  clean = clean.replace("https://melolo.comhttps://melolo.com", "https://melolo.com");
  clean = clean.replace("http://melolo.comhttp://melolo.com", "https://melolo.com");
  clean = clean.replace("http://melolo.comhttps://melolo.com", "https://melolo.com");
  clean = clean.replace("https://melolo.comhttp://melolo.com", "https://melolo.com");

  return clean;
}

function buildApiUrl(path, params = {}, apiKey) {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  url.searchParams.set("apikey", apiKey);
  return url.toString();
}

export async function fetchWithRotation(path, params = {}) {
  const keys = getApiKeys();
  let lastError = null;

  if (!keys.length) {
    return { status: false, message: "API key belum disiapkan." };
  }

  for (const item of keys) {
    try {
      const finalUrl = buildApiUrl(path, params, item.key);
      const res = await fetch(finalUrl, { headers: { Accept: "application/json" } });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data || data.status === false) {
        lastError = data || { message: "Request failed (" + res.status + ")" };
        continue;
      }

      return { ...data, _sourceKey: item.name };
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return {
    status: false,
    message: "Semua API key gagal, limit, atau tidak valid.",
    error: (lastError && lastError.message) || String(lastError) || null,
  };
}

export function sanitizeResponse(data) {
  return data;
}
