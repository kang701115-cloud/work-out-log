// ========== Workout App Service Worker ==========
// 버전 번호를 바꾸면 강제 업데이트됨.
const CACHE_VERSION = "v3";
const CACHE_NAME = `workout-cache-${CACHE_VERSION}`;

const ASSETS = [
  "/",             // 루트
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// ★ 설치되자마자 바로 새 서비스워커 활성화
self.addEventListener("install", (event) => {
  self.skipWaiting(); // ← 강제 적용
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// ★ 기존 서비스워커 자리 뺏기
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  clients.claim(); // ← 새 서비스워커 즉시 적용
});

// ★ 요청 가로채기
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((resp) => {
          return resp;
        })
      );
    })
  );
});

