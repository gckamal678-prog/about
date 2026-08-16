const CACHE_NAME = 'my-pwa-cache-v1';

// अफलाइनमा चलाउन सेभ गरिने फाइलहरू
const filesToCache = [
  './',
  './index.html',
  './tech.html',
  './about.html',
  './blog.html',
  './emergency.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// फाइलहरू सेभ (Cache) गर्ने
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

// अफलाइन हुँदा सेभ भएका फाइल देखाउने
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
