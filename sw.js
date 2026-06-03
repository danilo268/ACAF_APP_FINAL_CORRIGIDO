const CACHE_NAME = "acaf-centro-performance-v24";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=acaf-final-profissional-20260601-2",
  "./script.js?v=acaf-final-profissional-20260601-2",
  "./manifest.webmanifest",
  "./assets/img/forca.jpg",
  "./assets/img/cardio.jpg",
  "./assets/img/costas.jpg",
  "./assets/img/peito.jpg",
  "./assets/img/pernas.jpg",
  "./assets/img/treino-profissional.png",
  "./assets/img/ombro-profissional.png",
  "./assets/videos/cardio.mp4",
  "./assets/videos/costas.mp4",
  "./assets/videos/ombro.mp4",
  "./assets/videos/peito.mp4",
  "./assets/videos/pernas.mp4"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response.ok && new URL(event.request.url).origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") return caches.match("./index.html");
          return cached;
        });
    })
  );
});
