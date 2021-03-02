let CACHE_NAME = 'my-site-cache-v6';
let urlsToCache = [
  '/',
  '/index.html',
  '/js/main.js',
  '/assets/images/avatar_tie.webp',
  '/assets/images/appediary.png',
  '/assets/images/movie-guru.webp',
  '/assets/images/laralib.webp',
  '/assets/images/mi-dukaan.png',
  '/assets/images/theimp.png',
  '/assets/images/todo.png',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(
        function (response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          let responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function (cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      );
    })
  );
});
