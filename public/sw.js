
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
    console.log('Workbox is loaded');
    workbox.precaching.precacheAndRoute([
  {
    "url": "favicon.ico",
    "revision": "21b275af1a58f4d527e62529dc2cabcb"
  },
  {
    "url": "index.php",
    "revision": "b9901d13f00ef92e0793e2d9fcd57431"
  },
  {
    "url": "manifest.json",
    "revision": "5d0d71697a8a5376a542bf6df66e7da0"
  },
  {
    "url": "mix-manifest.json",
    "revision": "207fd484b7c2ceeff7800b8c8a11b3b6"
  },
  {
    "url": "offline.html",
    "revision": "73beeb77d139447e043bcf8501b10cea"
  },
  {
    "url": "robots.txt",
    "revision": "b6216d61c03e6ce0c9aea6ca7808f7ca"
  },
  {
    "url": "web.config",
    "revision": "df72170f1cdffd64352bb4dafbd6efa0"
  }
]);

    /* cache images in the e.g others folder; edit to other folders you got
    and config in the sw-config.js file
      */
    workbox.routing.registerRoute(
        /(.*)others(.*)\.(?:png|gif|jpg)/,
        new workbox.strategies.CacheFirst({
            cacheName: 'images',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                })
            ]
        })
    );
    /* Make your JS and CSS ⚡ fast by returning the assets from the cache,
  while making sure they are updated in the background for the next use.
  */
    workbox.routing.registerRoute(
        // cache js, css, scc files
        /.*\.(?:css|js|scss|)/,
        // use cache but update in the background ASAP
        new workbox.strategies.StaleWhileRevalidate({
            // use a custom cache name
            cacheName: 'assets',
        })
    );

    // cache google fonts
    workbox.routing.registerRoute(
        new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
        new workbox.strategies.CacheFirst({
            cacheName: 'google-fonts',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        })
    );

    // add offline analytics
    workbox.googleAnalytics.initialize();

    /* Install a new service worker and have it update
    and control a web page as soon as possible
    */

    workbox.core.skipWaiting();
    workbox.core.clientsClaim();

} else {
    console.log('Oops! Workbox didnt load');
}
