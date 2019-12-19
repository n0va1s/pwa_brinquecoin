var CACHE_NAME = 'STATIC-V6';
var FILES_TO_CACHE = [
    '/',
    '/index.php',
    '/offline.html',
    '/favicon.ico',
    '/js/app.js',
    '/js/fetch.js',
    '/js/idb.js',
    '/js/install.js',
    '/js/promise.js',
    '/js/utility.js',
    '/img/icons/app-icon-144-144.png',
    '/img/icons/app-icon-192-192.png',
    '/img/icons/app-icon-512-512.png',
    '/img/boards/feito.png',
    '/img/boards/nao-fez.png',
    '/img/boards/nao-pode.png',
    '/img/boards/ferias.jpg',
    '/img/boards/mesada.jpg',
    '/img/boards/tarefas.jpg',
    '/img/boards/habito.jpg',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css?family=Handlee&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css'
];

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((reg) => {
                console.log('[SW]Service worker registered.', reg);
            });
    });
}

self.addEventListener('install', function (event) {
    console.log('[SW]Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log('[SW] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[SW] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function (event) {

    if (event.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );
});

