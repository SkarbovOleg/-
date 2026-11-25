/* «Великий гусь» — офлайн-режим.
   Кэшируем оболочку сайта, страницы отдаём из сети с откатом в кэш. */
var CACHE = 'great-goose-v2';

var ASSETS = [
    './',
    './index.html',
    './404.html',
    './manifest.webmanifest',
    './assets/css/styles.css',
    './assets/js/app.js',
    './assets/img/favicon.svg',
    './assets/img/icon-192.png',
    './assets/img/icon-512.png',
    './assets/img/og-cover.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE)
            .then(function (cache) { return cache.addAll(ASSETS); })
            .then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (key) {
                if (key !== CACHE) return caches.delete(key);
            }));
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function (event) {
    var request = event.request;
    if (request.method !== 'GET') return;

    var url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(function (response) {
                    var copy = response.clone();
                    caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
                    return response;
                })
                .catch(function () {
                    return caches.match(request).then(function (cached) {
                        return cached || caches.match('./index.html');
                    });
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(function (cached) {
            var network = fetch(request).then(function (response) {
                if (response && response.ok) {
                    var copy = response.clone();
                    caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
                }
                return response;
            }).catch(function () { return cached; });

            return cached || network;
        })
    );
});
