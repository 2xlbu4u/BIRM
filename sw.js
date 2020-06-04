var cacheName = 'birm2';
var filesToCache = [
 // '/',
  'index.html'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then( function(cache) 
	{ 
		console.log("adding files to cache");
		return cache.addAll(filesToCache);
    
	}).catch(function(err) {
		  console.log(err);
	  }))
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
