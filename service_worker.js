const CACHE_NAME = 'shalon-adonai-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/img/logo.png',
    '/img/cabelos.jpg',
    '/img/unhas.jpg',
    '/img/sobrancelhas.jpg',
    '/img/depilacao.jpg',
    '/img/podologia.jpg',
    '/cabelos.html',
    '/unhas.html',
    '/sobrancelhas.html',
    '/depilacao.html',
    '/podologia.html'
];

// Instala o Service Worker e armazena em cache os recursos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

// Intercepta requisições e serve do cache quando offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

// Limpa caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
});