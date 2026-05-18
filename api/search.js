import { fetchWithRotation, normalizeDramaUrl, sanitizeResponse } from "./_melolo.js";

export default async function handler(req, res) {
  const q = (req.query && req.query.q ? String(req.query.q) : "").trim();

  if (!q) {
    return res.status(400).json({ status: false, message: "Query 'q' kosong." });
  }

  const data = await fetchWithRotation("/drama/melolo/search", { q });

  if (data && Array.isArray(data.data)) {
    data.data = data.data.map((item) => ({
      ...item,
      url: normalizeDramaUrl(item.url || ""),
    }));
  }

  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
  res.status(200).json(sanitizeResponse(data));
}
