const IMAGE_CACHE = "WatchList-image-cache";

self.addEventListener("fetch", event => {
    const request = event.request;

    // Only cache images
    if (request.destination === "image") {
        event.respondWith(
            caches.open(IMAGE_CACHE).then(cache =>
                cache.match(request).then(response => {
                    if (response) return response;

                    return fetch(request).then(networkResponse => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                })
            )
        );
    }
});

const CACHE_NAME = "offline-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(OFFLINE_URL);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Only intercept page navigations.
  if (event.request.mode !== "navigate") {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(OFFLINE_URL);
    })
  );
});