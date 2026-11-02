// Offline support: the page is cached on first visit and refreshed from the network whenever online.
const CACHE = 'musicas-ipb-v2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
  'js/tema-inicial.js', 'js/nomes-antigos.js', 'js/edicoes-base.js', 'js/busca.js', 'js/cifras.js', 'js/atalhos.js',
  'js/menu-celular.js', 'js/menu-lateral.js', 'js/tema.js', 'js/tamanho-letra.js', 'js/caber-na-tela.js', 'js/anotacoes.js', 'js/edicoes.js', 'js/repertorio.js',
  'js/atualizacao.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // network first (always the latest version when online), cache as fallback (offline).
  // "no-cache": ask the server whether the file changed instead of reusing the browser's copy
  // (GitHub Pages allows 10 minutes), so index.html and the js files never mix versions.
  // A page request (mode "navigate") can't be copied with new options, so it is fetched by its address.
  const net = req.mode === 'navigate' ? fetch(req.url, {cache: 'no-cache'}) : fetch(req, {cache: 'no-cache'});
  e.respondWith(
    net
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, {ignoreSearch: true}).then((r) => r || caches.match('index.html')))
  );
});
