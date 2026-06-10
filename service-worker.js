const CACHE_NAME = "calendar-v1";

const urls = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(
            caches.open(CACHE_NAME)
            .then(cache =>
                cache.addAll(urls)
            )
        );
    }
);

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(
            caches.match(event.request)
            .then(response =>
                response ||
                fetch(event.request)
            )
        );
    }
);
