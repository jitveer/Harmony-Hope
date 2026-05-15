// service-worker.js

const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
    "/",               // home page
    "/index.html",     // main HTML
    "/manifest.json",  // manifest file
    "/vite.svg",    // favicon
];



// Install event (pehli baar jab service worker install hota hai)
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});


// Fetch event (jab bhi koi request hoti hai)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Agar cache me mile to wahi return karo, warna network se fetch karo
            return response || fetch(event.request);
        })
    );
});


// Activate event (purane cache delete karne ke liye)
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Clearing old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});
