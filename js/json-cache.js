var RecipeCache = (function () {
  var cacheData = null;
  var CACHE_KEY = 'yemekler5_json';

  async function get() {
    if (cacheData) return cacheData;
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        cacheData = JSON.parse(raw);
        return cacheData;
      }
    } catch (e) {}
    try {
      if ('caches' in window) {
        var cache = await caches.open('recipe-cache-v1');
        var cachedRes = await cache.match(CACHE_KEY);
        if (cachedRes && cachedRes.ok) {
          cacheData = await cachedRes.json();
          return cacheData;
        }
      }
    } catch (e) {}
    return null;
  }

  async function set(data) {
    cacheData = data;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {}
    try {
      if ('caches' in window) {
        var cache = await caches.open('recipe-cache-v1');
        var res = new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=3600' }
        });
        cache.put(CACHE_KEY, res);
      }
    } catch (e) {}
  }

  async function getOrFetch(url) {
    var cached = await get();
    if (cached) return cached;
    var res = await fetch(url);
    if (!res.ok) throw new Error('JSON yüklenemedi: ' + url);
    var data = await res.json();
    await set(data);
    return data;
  }

  return { getOrFetch: getOrFetch };
})();
