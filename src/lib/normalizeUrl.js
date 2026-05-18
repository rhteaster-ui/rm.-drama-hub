// Client-side URL normalization. Mirrors the server-side helper so links
// inside the SPA stay clean before being shipped to /api proxy.

export function normalizeDramaUrl(url = "") {
  if (!url) return "";
  let clean = String(url).trim();
  clean = clean.replace("https://melolo.comhttps://melolo.com", "https://melolo.com");
  clean = clean.replace("http://melolo.comhttp://melolo.com", "https://melolo.com");
  clean = clean.replace("http://melolo.comhttps://melolo.com", "https://melolo.com");
  clean = clean.replace("https://melolo.comhttp://melolo.com", "https://melolo.com");
  return clean;
}

export function encodeDramaUrl(url = "") {
  return encodeURIComponent(normalizeDramaUrl(url));
}

export function decodeDramaUrl(encoded = "") {
  try {
    return normalizeDramaUrl(decodeURIComponent(encoded));
  } catch (_) {
    return normalizeDramaUrl(encoded);
  }
}
