
/* KAMAL G.C. PORTAL — SERVICE WORKER
   Version 5: Fix stale cache and broken page fallback
*/

const CACHE_NAME = "kamalgc-cache-v5";

const CORE_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await Promise.all(
        CORE_FILES.map(async file => {
          try {
            const response = await fetch(file, {
              cache: "reload"
            });

            if (response.ok) {
              await cache.put(file, response);
            }
          } catch (error) {
            console.warn("Cache skipped:", file);
          }
        })
      );
    })()
  );
});

// ACTIVATE — DELETE OLD CACHE
self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(key =>
            key.startsWith("kamalgc-cache-") &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

// FETCH
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  const isPageOrCode =
    request.mode === "navigate" ||
    request.destination === "document" ||
    /\.(html|css|js|json)$/i.test(url.pathname);

  // HTML, CSS, JS: NETWORK FIRST
  if (isPageOrCode) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request, {
            cache: "no-store"
          });

          if (response && response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }

          return response;

        } catch (error) {
          const cached = await caches.match(request);

          if (cached) return cached;

          if (request.mode === "navigate") {
            const offlinePage =
              await caches.match("./index.html");

            if (offlinePage) return offlinePage;
          }

          return new Response("Offline", {
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8"
            }
          });
        }
      })()
    );

    return;
  }

  // IMAGES AND OTHER ASSETS: CACHE FIRST
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);

      if (cached) return cached;

      try {
        const response = await fetch(request);

        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }

        return response;

      } catch (error) {
        return new Response("Offline", {
          status: 503
        });
      }
    })()
  );
});
