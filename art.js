/* Languway German – SVG artwork: aurora sky, landmarks, medals, badges (no emoji, no bitmap art) */
(function () {
  'use strict';
  var LG = window.LG, uid = 0;
  function id(p) { uid += 1; return p + uid; }
  var A = LG.art = {};

  /* animated aurora + stars + orbit rings used behind hero blocks */
  A.sky = function () {
    var g = id('sk'), stars = '';
    for (var i = 0; i < 46; i++) { var x = (i * 97 + 31) % 1000, y = (i * 53 + 17) % 520, r = (i % 4 === 0) ? 1.6 : 0.9; stars += '<circle class="twk" cx="' + x + '" cy="' + y + '" r="' + r + '" style="animation-delay:' + ((i % 9) * 0.45) + 's"/>'; }
    return '<svg class="art-sky" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
      '<linearGradient id="' + g + 'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050A26"/><stop offset=".55" stop-color="#1A2A7A"/><stop offset="1" stop-color="#7A4BC0"/></linearGradient>' +
      '<radialGradient id="' + g + 'b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFC24A" stop-opacity=".85"/><stop offset="1" stop-color="#FFC24A" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + g + 'c" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#4DA3FF" stop-opacity=".7"/><stop offset="1" stop-color="#4DA3FF" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + g + 'f"><feGaussianBlur stdDeviation="28"/></filter></defs>' +
      '<rect width="1000" height="520" fill="url(#' + g + 'a)"/>' +
      '<g filter="url(#' + g + 'f)"><ellipse class="aur a1" cx="250" cy="340" rx="330" ry="120" fill="url(#' + g + 'c)"/><ellipse class="aur a2" cx="760" cy="420" rx="340" ry="110" fill="url(#' + g + 'b)"/></g>' +
      '<g fill="#fff">' + stars + '</g>' +
      '<g fill="none" stroke="#FFD35C" stroke-opacity=".35" stroke-width="1.2"><ellipse class="orb o1" cx="760" cy="200" rx="260" ry="70" transform="rotate(-18 760 200)"/><ellipse class="orb o2" cx="760" cy="200" rx="340" ry="96" transform="rotate(-18 760 200)" stroke-opacity=".18"/></g>' +
      '<g class="shards" fill="none" stroke="#9DB4FF" stroke-opacity=".5"><path d="M120 90l34 18-12 38-36-14z"/><path d="M880 60l26 26-26 26-26-26z"/><path d="M60 330l22 10-8 24-24-8z"/></g></svg>';
  };

  /* Brandenburg Gate silhouette (own vector drawing, used when no photo is available) */
  A.gate = function () {
    var cols = '';
    for (var i = 0; i < 6; i++) cols += '<rect x="' + (90 + i * 44) + '" y="118" width="22" height="92" rx="2"/>';
    return '<svg class="art-gate" viewBox="0 0 400 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><linearGradient id="gtg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE29A"/><stop offset="1" stop-color="#C98A2B"/></linearGradient></defs>' +
      '<g fill="url(#gtg)"><rect x="70" y="104" width="260" height="14" rx="3"/><rect x="60" y="92" width="280" height="12" rx="3"/><rect x="84" y="76" width="232" height="16" rx="3"/>' + cols + '<rect x="70" y="210" width="260" height="12" rx="3"/>' +
      '<path d="M150 76c6-30 20-44 50-44s44 14 50 44z" opacity=".9"/><path d="M176 40l24-22 24 22z"/><circle cx="200" cy="12" r="6"/></g></svg>';
  };

  /* city skyline with TV tower for the sidebar footer */
  A.skyline = function () {
    return '<svg class="art-skyline" viewBox="0 0 240 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="skl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6D7FE8" stop-opacity=".55"/><stop offset="1" stop-color="#1B2A80" stop-opacity=".1"/></linearGradient></defs>' +
      '<g fill="url(#skl)"><rect x="0" y="86" width="22" height="34"/><rect x="26" y="70" width="18" height="50"/><rect x="48" y="92" width="26" height="28"/><path d="M100 120V50h4l2-30h-3l5-12 5 12h-3l2 30h4v70z"/><circle cx="106" cy="46" r="9"/>' +
      '<rect x="128" y="76" width="22" height="44"/><path d="M156 120V80l12-14 12 14v40z"/><rect x="186" y="64" width="20" height="56"/><rect x="210" y="90" width="30" height="30"/></g></svg>';
  };

  /* metallic medal with level text */
  A.medal = function (txt, tone) {
    var g = id('md'), c = tone === 'blue' ? ['#9DB8FF', '#4A63D8'] : tone === 'green' ? ['#7DF2C4', '#139C6B'] : tone === 'violet' ? ['#C6A2FF', '#6B3FC9'] : ['#FFE08A', '#D9930E'];
    return '<svg class="art-medal" viewBox="0 0 120 140" aria-hidden="true"><defs><linearGradient id="' + g + 'a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient><linearGradient id="' + g + 'r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5483C"/><stop offset="1" stop-color="#9C1F1F"/></linearGradient></defs>' +
      '<path d="M32 4h22l8 40-30 8z" fill="url(#' + g + 'r)"/><path d="M88 4H66l-8 40 30 8z" fill="url(#' + g + 'r)" opacity=".9"/>' +
      '<circle cx="60" cy="86" r="40" fill="url(#' + g + 'a)"/><circle cx="60" cy="86" r="32" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/><circle cx="60" cy="86" r="26" fill="#000" fill-opacity=".12"/>' +
      '<text x="60" y="95" text-anchor="middle" font-size="' + (String(txt).length > 2 ? 20 : 26) + '" font-weight="800" fill="#fff" stroke="rgba(0,0,0,.25)" stroke-width=".8">' + LG.esc(txt) + '</text></svg>';
  };

  /* shield badge with an inner glyph */
  A.shield = function (glyph, tone) {
    var g = id('sh'), c = tone === 'green' ? ['#47E3A8', '#0C7A55'] : tone === 'violet' ? ['#B58CFF', '#5A2FC0'] : tone === 'blue' ? ['#7FA2FF', '#2845C0'] : ['#FFD25C', '#C98200'];
    return '<svg class="art-shield" viewBox="0 0 100 116" aria-hidden="true"><defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs>' +
      '<path d="M50 4l42 14v34c0 28-18 46-42 58C26 98 8 80 8 52V18z" fill="url(#' + g + ')"/><path d="M50 12l34 11v29c0 22-14 38-34 48C30 90 16 74 16 52V23z" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>' +
      '<g transform="translate(26 28) scale(2)" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + glyph + '</g></svg>';
  };

  /* gradient progress ring */
  A.ring = function (p, label) {
    var g = id('rg'), c = 2 * Math.PI * 52;
    return '<svg class="art-ring" viewBox="0 0 120 120" role="img" aria-label="' + p + ' %"><defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2EE6A6"/><stop offset="1" stop-color="#3AA8FF"/></linearGradient></defs>' +
      '<circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="11"/><circle cx="60" cy="60" r="52" fill="none" stroke="url(#' + g + ')" stroke-width="11" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - p / 100)).toFixed(1) + '" transform="rotate(-90 60 60)"/>' +
      '<text x="60" y="68" text-anchor="middle" font-size="26" font-weight="800" fill="currentColor">' + (label || p + '%') + '</text></svg>';
  };

  /* line chart of the last 7 days */
  A.chart = function (vals, labels) {
    var g = id('ch'), W = 300, H = 120, mx = Math.max.apply(null, vals.concat([1])), n = vals.length, pts = vals.map(function (v, i) { return [10 + i * (W - 20) / (n - 1), H - 14 - (v / mx) * (H - 34)]; });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    return '<svg class="art-chart" viewBox="0 0 ' + W + ' ' + (H + 18) + '" role="img" aria-label="Lernaktivität der letzten 7 Tage"><defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC21A" stop-opacity=".45"/><stop offset="1" stop-color="#FFC21A" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + d + ' L' + pts[n - 1][0] + ' ' + (H - 14) + ' L' + pts[0][0] + ' ' + (H - 14) + 'z" fill="url(#' + g + ')"/><path d="' + d + '" fill="none" stroke="#FFC21A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      pts.map(function (p) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4" fill="#FFC21A"/>'; }).join('') +
      labels.map(function (l, i) { return '<text x="' + pts[i][0].toFixed(1) + '" y="' + (H + 10) + '" text-anchor="middle" font-size="10" fill="currentColor" opacity=".6">' + LG.esc(l) + '</text>'; }).join('') + '</svg>';
  };
})();
