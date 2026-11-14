/* runs before first paint: theme + clickjacking guard (GitHub Pages cannot send frame-ancestors headers) */
(function () {
  try {
    if (window.top !== window.self) { document.documentElement.style.display = 'none'; window.top.location = window.self.location; }
  } catch (e) { document.documentElement.style.display = 'none'; }
  try {
    var t = localStorage.getItem('lg.theme');
    if (t) t = JSON.parse(t);
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
