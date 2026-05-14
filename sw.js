const CACHE_NAME = 'nurten-saglik-v101'; // Numarayı 100 yaptık

const ASSETS = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Beklemeyi reddet, hemen kurul
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Anında kontrolü ele al
});

// KESİN ÇÖZÜM: AĞ ÖNCELİKLİ (NETWORK-FIRST) STRATEJİSİ
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // İnternet varsa ve başarılıysa, yenisini getirip hafızayı da günceller
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // İnternet yoksa hafızadakini gösterir
        return caches.match(event.request);
      })
  );
});
