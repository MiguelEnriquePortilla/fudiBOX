/* Cache only the generic offline notice. Never cache accounts, orders or OAuth. */
const OFFLINE_CACHE = 'fudibox-offline-v1';
const OFFLINE_URL = '/offline.html';
self.addEventListener('install', event => {
 event.waitUntil(caches.open(OFFLINE_CACHE).then(cache => cache.add(new Request(OFFLINE_URL, { cache: 'reload' }))));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('fudibox-offline-') && key !== OFFLINE_CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
 // All mutations, API traffic and RSC requests go straight to the network.
 if (event.request.method !== 'GET' || event.request.mode !== 'navigate' || new URL(event.request.url).origin !== self.location.origin) return;
 event.respondWith(fetch(event.request).catch(async () => {
  const cached = await caches.match(OFFLINE_URL, { cacheName: OFFLINE_CACHE });
  return cached || new Response('Sin conexión. Conéctate a internet y vuelve a abrir fudiBOX.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
 }));
});
