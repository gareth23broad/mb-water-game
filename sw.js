// Lets the game open without a connection once it has been opened online.
// Change VERSION whenever you upload a new index.html so players get the update.
const VERSION = 'mb-water-v17';
const FILES = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-192.png', './icon-512.png', './music-main.mp3', './music-brutal.mp3', './music-puzzle.mp3'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;               // fonts etc. go straight to the network
  // Network first, so updates arrive as soon as you publish; fall back to the saved copy when offline.
  // 'no-cache' asks GitHub whether the file changed before using any copy the phone kept, so updates arrive straight away.
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
