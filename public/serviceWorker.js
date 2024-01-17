self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/static/js/bundle.js',
        '/static/js/0.chunk.js',
        '/static/js/main.chunk.js',
        '/manifest.json',
        // '/favicon.ico',
        // include other assets, such as scripts, styles, images, etc.
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});