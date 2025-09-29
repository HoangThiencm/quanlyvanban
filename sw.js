// This service worker provides basic offline capabilities.

const CACHE_NAME = 'quanlyvanban-cache-v2'; // Changed cache name
// List of files to cache on installation.
const urlsToCache = [
  '/',
  '/index.html',
  // popup.html is no longer needed with Firebase Auth sign-in popup
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js', // Added Firebase Auth library
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js' // Added Firebase Storage library
];

// Install event: opens a cache and adds the core files to it.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serves cached content when offline.
self.addEventListener('fetch', event => {
  // We use a "network falling back to cache" strategy for most requests
  // to ensure data is fresh, but the app still works offline.
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Activate event: cleans up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

