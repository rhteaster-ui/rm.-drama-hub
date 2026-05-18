const STORAGE_KEY = "rm_library";

function defaultData() {
  return { favorites: [], watchLater: [], history: [], continueWatching: [] };
}

export function getLibrary() {
  if (typeof window === "undefined") return defaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    return { ...defaultData(), ...parsed };
  } catch (_) {
    return defaultData();
  }
}

function persist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("rm:library"));
  } catch (_) {}
}

function shapeItem(item) {
  if (!item) return null;
  return {
    title: item.title || "Tanpa judul",
    url: item.url || "",
    image: item.image || item.cover_image || "",
    category: item.category || (Array.isArray(item.genres) ? item.genres[0] : "") || "",
    episodes: item.episodes || item.total_episodes || "",
    rating: item.rating || "",
    savedAt: Date.now(),
  };
}

export function isFavorite(url) {
  const lib = getLibrary();
  return lib.favorites.some((x) => x.url === url);
}

export function addFavorite(item) {
  const shaped = shapeItem(item);
  if (!shaped || !shaped.url) return;
  const lib = getLibrary();
  if (lib.favorites.some((x) => x.url === shaped.url)) return;
  lib.favorites = [shaped, ...lib.favorites];
  persist(lib);
}

export function removeFavorite(url) {
  const lib = getLibrary();
  lib.favorites = lib.favorites.filter((x) => x.url !== url);
  persist(lib);
}

export function addWatchLater(item) {
  const shaped = shapeItem(item);
  if (!shaped || !shaped.url) return;
  const lib = getLibrary();
  if (lib.watchLater.some((x) => x.url === shaped.url)) return;
  lib.watchLater = [shaped, ...lib.watchLater];
  persist(lib);
}

export function removeWatchLater(url) {
  const lib = getLibrary();
  lib.watchLater = lib.watchLater.filter((x) => x.url !== url);
  persist(lib);
}

export function addHistory(item) {
  const shaped = shapeItem(item);
  if (!shaped || !shaped.url) return;
  const lib = getLibrary();
  lib.history = [shaped, ...lib.history.filter((x) => x.url !== shaped.url)].slice(0, 60);
  persist(lib);
}

export function clearHistory() {
  const lib = getLibrary();
  lib.history = [];
  persist(lib);
}

export function clearLibrary() {
  const lib = getLibrary();
  lib.favorites = [];
  lib.watchLater = [];
  lib.continueWatching = [];
  persist(lib);
}

export function resetLocalData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("rm:library"));
  } catch (_) {}
}
