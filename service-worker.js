var dataCacheName = 'PWA-demo-data-v0.0.1';
var cacheName = 'PWA-demo-v0.0.1';
var filesToCache = [
    '/PWA-demo/',
    '/PWA-demo/index.html',
    '/PWA-demo/scripts/app.js',
    '/PWA-demo/styles/normalize.css',
    '/PWA-demo/styles/main.css',
    '/PWA-demo/images/ic_refresh_white_24px.svg'
];

// on install
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

// on fetch
self.addEventListener('fetch', function (event) {
    var dataUrl = 'https://api.github.com/';
    if (event.request.url.indexOf(dataUrl) > -1) {
        event.respondWith(
            caches.open(dataCacheName).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // 激活worker
    return self.clients.claim();
});