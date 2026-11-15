const CACHE_NAME = 'nsis-browser-assets-20261115-v2';
const PRECACHE_URLS = [
    '/mobile.css?v=nsis-20261115',
    '/mobile.js?v=nsis-20261115',
    '/mobile.webmanifest',
    '/images/Logo.jpeg?v=nsis-20261115',
    '/school-theme.css?v=nsis-logo-panel-20261115-v2',
    '/school-branding.js?v=20261115',
    '/school-record-storage.js?v=20261115'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((key) => /^(readers-line|nsis-browser-assets)/.test(key) && key !== CACHE_NAME).map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    // User records and API responses always go to the network.
    if (request.method !== 'GET' || url.origin !== self.location.origin ||
        /^\/(api|socket\.io|health|uploads)(\/|$)/.test(url.pathname) ||
        !/\.(css|js|jpeg|jpg|png|webp|svg|ico|woff2?|webmanifest)$/.test(url.pathname)) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
            const response = await fetch(request);
            if (response.ok && response.type === 'basic' && !/no-store/.test(response.headers.get('Cache-Control') || '')) {
                await cache.put(request, response.clone());
            }
            return response;
        } catch (error) {
            const cached = await cache.match(request);
            if (cached) return cached;
            throw error;
        }
    })());
});
