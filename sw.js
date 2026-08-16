const CACHE_NAME = 'my-pwa-cache-v2'; // Version बढाउनुहोस् (v1 बाट v2)

// Root Path '/' बाट सुरु गर्नुहोस्
const filesToCache = [
  '/',
  '/index.html',
  '/tech.html',
  '/about.html',
  '/blog.html',
  '/emergency.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // पुरानो क्यास हटाउने
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Offline Handling)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        // यदि इन्टरनेट छैन र क्यास पनि भेटिएन भने index.html देखाउने
        return caches.match('/index.html');
      });
    })
  );
});
