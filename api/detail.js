import { fetchWithRotation, normalizeDramaUrl, sanitizeResponse } from "./_melolo.js";

export default async function handler(req, res) {
  let raw = req.query && req.query.url ? String(req.query.url) : "";
  if (!raw) return res.status(400).json({ status: false, message: "Param 'url' kosong." });

  // Many clients send the url already encoded; try to decode once.
  try {
    raw = decodeURIComponent(raw);
  } catch (_) {}

  const url = normalizeDramaUrl(raw);
  const data = await fetchWithRotation("/drama/melolo/detail", { url });

  res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
  res.status(200).json(sanitizeResponse(data));
}
