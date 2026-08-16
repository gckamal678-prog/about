const CACHE_NAME = 'kamalgc-cache-v4';

// अफलाइन सेभ गरिने फाइलहरू (Exact Root-Relative Paths)
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

// १. Install Event: सबै फाइलहरू क्यास गर्ने
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// २. Activate Event: पुरानो क्यास फालेर नयाँ लागू गर्ने
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ३. Fetch Event: अफलाइन हुँदा क्यासबाट फाइल देखाउने
self.addEventListener('fetch', (e) => {
  // केवल GET Request मात्र क्यास गर्ने
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        // यदि इन्टरनेट छैन र फाइल क्यासमा भेटिएन भने index.html खोल्ने
        return caches.match('/index.html');
      });
    })
  );
});
