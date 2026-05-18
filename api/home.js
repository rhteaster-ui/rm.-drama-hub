import { fetchWithRotation, normalizeDramaUrl, sanitizeResponse } from "./_melolo.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  const data = await fetchWithRotation("/drama/melolo");

  if (data && Array.isArray(data.data)) {
    data.data = data.data.map((item) => ({
      ...item,
      url: normalizeDramaUrl(item.url || ""),
    }));
  }

  res.status(200).json(sanitizeResponse(data));
}
