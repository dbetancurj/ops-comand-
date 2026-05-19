// OPS Command · Service Worker v4
const CACHE = 'ops-command-v4';
const ASSETS = ['./', './index.html', './manifest.json', './firebase-config.js', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('firestore.googleapis.com') || e.request.url.includes('firebase')) return;
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
    if (r && r.status === 200) { const c = r.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); }
    return r;
  })));
});
