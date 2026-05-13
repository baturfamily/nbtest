const CACHE_NAME = 'nurten-saglik-v2';
const ASSETS = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
];

// Dosyaları ilk açılışta hafızaya al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Eski önbelleği temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// İstekleri yönet (Tasarımı hafızadan, Verileri internetten getir)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Google Scripts (API) ve Hava Durumu asla cache'e girmez, daima tazedir.
  if (url.hostname.includes('script.google.com') || url.hostname.includes('api.open-meteo.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // CSS, JS ve HTML gibi iskelet dosyaları önce hafızadan (Cache) bakılır.
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});