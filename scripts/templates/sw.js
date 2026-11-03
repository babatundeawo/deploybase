/* Deploybase service worker. Generated into dist/sw.js by scripts/build.mjs.
   VERSION changes on every build, so old caches are cleared automatically.

   - Pages: network first (always fresh when online), then the saved copy, then offline.html.
   - Styles and scripts: saved copy first, refreshed in the background.
   - Fonts and images: saved copy first.
   - A new version waits until the visitor taps Refresh, so nobody is stuck on stale content
     and nobody loses their place mid-read. */
const VERSION = "__VERSION__";
const PREFIX = "deploybase-";
const SHELL = PREFIX + "shell-" + VERSION;
const PAGES = PREFIX + "pages-" + VERSION;
const ASSETS = PREFIX + "assets-" + VERSION;
const PRECACHE = __PRECACHE__;
const OFFLINE = "offline.html";

const scope = new URL(self.registration.scope);
const abs = (p) => new URL(p, scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) =>
      // One missing file must not stop the whole install.
      Promise.all(PRECACHE.map((p) => cache.add(new Request(abs(p), { cache: "reload" })).catch(() => null)))
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && ![SHELL, PAGES, ASSETS].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));

async function pageStrategy(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await Promise.race([fetch(request), timeout(4500)]);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const hit = (await cache.match(request)) || (await caches.match(request, { ignoreSearch: true }));
    if (hit) return hit;
    const fallback = await caches.match(abs(OFFLINE));
    return fallback || new Response("You are offline.", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = (await cache.match(request)) || (await caches.match(request));
  const refresh = fetch(request).then((response) => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || (await refresh) || new Response("", { status: 504 });
}

async function cacheFirst(request) {
  const cached = (await caches.match(request));
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) (await caches.open(ASSETS)).put(request, response.clone());
    return response;
  } catch (err) {
    return new Response("", { status: 504 });
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin || !url.pathname.startsWith(scope.pathname)) return;
  if (url.pathname.endsWith("/sw.js")) return;

  if (request.mode === "navigate") { event.respondWith(pageStrategy(request)); return; }
  if (/\.(?:woff2|png|svg|ico|webp|avif|jpg)$/.test(url.pathname)) { event.respondWith(cacheFirst(request)); return; }
  if (/\.(?:css|js|webmanifest)$/.test(url.pathname)) { event.respondWith(staleWhileRevalidate(request, ASSETS)); return; }
  // Instruction and knowledge files: keep a copy so they can be opened offline after one visit.
  event.respondWith(staleWhileRevalidate(request, PAGES));
});
