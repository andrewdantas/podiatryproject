const CACHE_NAME = 'shalom_adonai'
const ASSETS = [
    '/',
    '/index.html',
    '/bootstrap/css/bootstrap.min.css',
    '/bootstrap/js/bootstrap.min.js',
    '/assets/css/style.css',
    '/pages/agendamento.html',
    '/assets/js/agendamento.js', 
    '/assets/js/jquery.min.js', 
    '/assets/js/popper.min.js',  
    '/assets/js/scripts.js',
    '/assets/js/pwa.js',
    '/manifest.json',
    '/assets/img/cabelos.jpg',      
    '/assets/img/unhas.jpg',        
    '/assets/img/sobrancelhas.jpg', 
    '/assets/img/depilacao.jpg',    
    '/assets/img/podologia.jpg',    
    '/assets/img/salao.jpg'         
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        })
    )
})