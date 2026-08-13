/**
 * Service worker — offline-first caching for the FFF frontend.
 *
 * Strategy:
 *   - On install: cache the app shell.
 *   - On fetch: stale-while-revalidate for our own assets;
 *     network-first with offline fallback for API GETs.
 *   - All API mutations (POST) just hit the network — IndexedDB in
 *     the app handles the offline buffer.
 */

const VERSION = "fff-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL_ASSETS = [
    "/",
    "/index.html",
    "/styles.css",
    "/app.js",
    "/manifest.webmanifest",
    "/icon.svg",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE).then((cache) =>
            cache.addAll(SHELL_ASSETS).catch((err) => {
                console.warn("Shell cache failed (ok during dev):", err);
            })
        )
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => !k.startsWith(VERSION))
                    .map((k) => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle http(s)
    if (!url.protocol.startsWith("http")) return;

    // GET only — let mutations through to the network
    if (request.method !== "GET") return;

    // API GETs: network-first, fallback to cache
    if (url.pathname.startsWith("/api/")) {
        event.respondWith(networkFirst(request));
        return;
    }

    // App shell: stale-while-revalidate
    event.respondWith(staleWhileRevalidate(request));
});

async function staleWhileRevalidate(request) {
    const cache = await caches.open(SHELL_CACHE);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request)
        .then((response) => {
            if (response && response.ok) {
                cache.put(request, response.clone()).catch(() => {});
            }
            return response;
        })
        .catch(() => cached);
    return cached || fetchPromise;
}

async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    try {
        const response = await fetch(request);
        if (response && response.ok) {
            cache.put(request, response.clone()).catch(() => {});
        }
        return response;
    } catch (e) {
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response(
            JSON.stringify({ error: "offline", detail: "No cached response" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }
}
