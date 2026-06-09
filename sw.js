const CACHE_NAME = "acaf-centro-performance-v40-premium-performance";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=acaf-premium-20260609-9",
  "./script.js?v=acaf-premium-20260609-9",
  "./manifest.webmanifest",
  "./assets/img/forca.jpg",
  "./assets/img/cardio.jpg",
  "./assets/img/costas.jpg",
  "./assets/img/peito.jpg",
  "./assets/img/pernas.jpg",
  "./assets/img/treino-profissional.png",
  "./assets/img/ombro-profissional.png",
  "./assets/videos/supino-reto.mp4",
  "./assets/videos/crossover-cabo.mp4",
  "./assets/videos/triceps-polia-barra.mp4",
  "./assets/videos/puxada-frontal.mp4",
  "./assets/videos/remada-baixa.mp4",
  "./assets/videos/rosca-direta.mp4",
  "./assets/videos/leg-press-45.mp4",
  "./assets/videos/cadeira-extensora.mp4",
  "./assets/videos/levantamento-romeno.mp4",
  "./assets/videos/panturrilha-leg-press.mp4",
  "./assets/videos/avanco-halteres.mp4",
  "./assets/videos/prancha-abdominal.mp4",
  "./assets/videos/desenvolvimento-militar.mp4",
  "./assets/videos/face-pull-corda.mp4"
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
    fetch(event.request)
      .then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => {
        if (cached) return cached;
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return undefined;
      }))
  );
});
