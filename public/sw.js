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