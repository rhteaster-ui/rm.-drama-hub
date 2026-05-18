import { fetchWithRotation, normalizeDramaUrl, sanitizeResponse } from "./_melolo.js";

export default async function handler(req, res) {
  let raw = req.query && req.query.url ? String(req.query.url) : "";
  if (!raw) return res.status(400).json({ status: false, message: "Param 'url' kosong." });

  try {
    raw = decodeURIComponent(raw);
  } catch (_) {}

  const url = normalizeDramaUrl(raw);

  try {
    const data = await fetchWithRotation("/drama/melolo/category", { url });
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(sanitizeResponse(data));
  } catch (err) {
    return res.status(200).json({
      status: false,
      message: "Kategori tidak bisa dimuat saat ini.",
      error: String(err && err.message ? err.message : err),
    });
  }
}
