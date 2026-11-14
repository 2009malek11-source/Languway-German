/* Languway German – service worker: caches the static app shell */
const V = 'lg-v11';
const SHELL = ['./', 'index.html', 'app.css', 'views.css', 'app.js', 'views1.js', 'views2.js', 'views3.js', 'views4.js', 'views5.js', 'views6.js', 'core.js', 'content.js', 'theme-init.js', 'boot.js', 'qr.js', 'ar1.js', 'ar2.js', 'ar3.js', 'ar4.js', 'lang-fr.js', 'lang-es.js', 'lang-tr.js', 'lang-ru.js', 'lang-id.js', 'lang-fa.js', 'lang-ur.js', 'lang-zh.js', 'lang-hi.js', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'i18n.js', 'manifest.webmanifest', 'logo.png','logo-round.png', 'logo-mark.png', 'favicon.png', 'icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
