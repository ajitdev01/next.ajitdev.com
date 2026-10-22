// AJITDEV Progressive Web App (PWA) Service Worker
// Version: 1.0.0
// Caches core offline shell assets and provides stale-while-revalidate strategy.

const CACHE_NAME = "ajitdev-pwa-v1";
const OFFLINE_URL = "/";

const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
];

// Install Event: Precaches core shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleans up old caches and claims clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-first for HTML navigation, Stale-While-Revalidate for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignore non-GET requests or external API mutations
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Don't intercept analytics or third-party tracking
  if (
    url.hostname.includes("clarity.ms") ||
    url.hostname.includes("googletagmanager.com") ||
    url.hostname.includes("posthog") ||
    url.hostname.includes("razorpay")
  ) {
    return;
  }

  // HTML page navigations: Network First, fallback to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Static assets (images, css, js, icons): Stale-While-Revalidate
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|css|js|json|woff2)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
