/* Languway German – runtime: state, server API, accounts, progress sync, router, audio, helpers */
(function () {
  'use strict';
  var C = window.LGCore, D = window.LGContent;
  var P = C.parseAll(D);
  var LG = window.LG = { C: C, D: D, P: P, act: {}, views: {}, S: { user: null, token: null, offline: false, sync: 'idle' }, pg: C.emptyProgress() };
  var KEY = { session: 'lg.session', theme: 'lg.theme', settings: 'lg.settings', lastUser: 'lg.lastUser', panel: 'lg.panel', splash: 'lg.splash' };

  /* ---------- tiny helpers ---------- */
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  LG.lsGet = lsGet; LG.lsSet = lsSet;
  LG.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  LG.$ = function (s, r) { return (r || document).querySelector(s); };
  LG.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  LG.fmtDate = function (ts) { try { return new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }); } catch (e) { return ''; } };
  LG.go = function (p) { if (location.hash === '#' + p) LG.route(); else location.hash = '#' + p; };

  var ICON = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 7h6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
    play: '<path d="M7 4v16l13-8z" fill="currentColor"/>',
    check: '<path d="m4 12 5 5L20 6"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    flame: '<path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14 4l2-2"/><path d="M20 20v-5h-5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', arrowr: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    swap: '<path d="M7 7h13l-3-3M17 17H4l3 3"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    printer: '<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><path d="M6 14h12v7H6z"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 11 7.6-4M8.2 13l7.6 4"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', pencil: '<path d="M4 20l1-5L16 4l4 4L9 19z"/>',
    phones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>', stop: '<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/>'
  };
  LG.ic = function (n, cls) { return '<svg class="i ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICON[n] || '') + '</svg>'; };

  /* ---------- toast + modal ---------- */
  var toastT;
  LG.toast = function (msg, err) { var t = LG.$('#toast'); t.textContent = msg; t.className = 'toast show' + (err ? ' err' : ''); clearTimeout(toastT); toastT = setTimeout(function () { t.className = 'toast' + (err ? ' err' : ''); }, 3400); };
  LG.modal = function (html, onMount) {
    var m = LG.$('#modal'); m.innerHTML = '<div class="modal__box" role="dialog" aria-modal="true">' + html + '</div>'; m.hidden = false;
    m.onclick = function (e) { if (e.target === m) LG.closeModal(); };
    if (onMount) onMount(m); var f = m.querySelector('input,button'); if (f) f.focus();
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var m = document.getElementById('modal'); if (m && !m.hidden) LG.closeModal(); } });
  LG.closeModal = function () { var m = LG.$('#modal'); m.hidden = true; m.innerHTML = ''; };
  LG.act.closemodal = function () { LG.closeModal(); };
  LG.confirm = function (title, msg, ok, danger) {
    return new Promise(function (res) {
      LG.modal('<h3>' + LG.esc(title) + '</h3><p class="muted">' + LG.esc(msg) + '</p><div class="modal__actions"><button class="btn soft" data-r="0">Abbrechen</button><button class="btn ' + (danger ? 'danger' : '') + '" data-r="1">' + LG.esc(ok || 'OK') + '</button></div>',
        function (m) { m.querySelectorAll('[data-r]').forEach(function (b) { b.onclick = function () { LG.closeModal(); res(b.dataset.r === '1'); }; }); });
    });
  };
  LG.askPassword = function (title, msg, ok) {
    return new Promise(function (res) {
      LG.modal('<h3>' + LG.esc(title) + '</h3><p class="muted">' + LG.esc(msg) + '</p><div class="field"><input type="password" id="pwq" autocomplete="current-password" dir="ltr"></div><div class="modal__actions"><button class="btn soft" data-r="0">Abbrechen</button><button class="btn danger" data-r="1">' + LG.esc(ok) + '</button></div>',
        function (m) { m.querySelectorAll('[data-r]').forEach(function (b) { b.onclick = function () { var v = m.querySelector('#pwq').value; LG.closeModal(); res(b.dataset.r === '1' ? v : null); }; }); });
    });
  };

  /* ---------- crypto helpers (pure JS SHA-256 / HMAC, WebCrypto PBKDF2 when available) ---------- */
  var K256 = (function () { var k = [], p = 2, n = 0; function isP(x) { for (var i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; } while (n < 64) { if (isP(p)) { k[n++] = (Math.pow(p, 1 / 3) % 1 * 4294967296) | 0; } p++; } return k; })();
  function sha256(bytes) {
    var H = [], i, j, p = 2, n = 0; while (n < 8) { var ok = true; for (i = 2; i * i <= p; i++) if (p % i === 0) { ok = false; break; } if (ok) H[n++] = (Math.pow(p, .5) % 1 * 4294967296) | 0; p++; }
    var l = bytes.length, bl = l * 8, padLen = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(padLen); m.set(bytes); m[l] = 0x80;
    var dv = new DataView(m.buffer); dv.setUint32(padLen - 4, bl >>> 0); dv.setUint32(padLen - 8, Math.floor(bl / 4294967296));
    var w = new Array(64);
    for (var o = 0; o < padLen; o += 64) {
      for (i = 0; i < 16; i++) w[i] = dv.getInt32(o + i * 4);
      for (i = 16; i < 64; i++) { var x = w[i - 15], y = w[i - 2]; var s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3), s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7)), ch = (e & f) ^ (~e & g), t1 = (h + S1 + ch + K256[i] + w[i]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10)), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = new Uint8Array(32); for (i = 0; i < 8; i++) { out[i * 4] = H[i] >>> 24; out[i * 4 + 1] = H[i] >>> 16; out[i * 4 + 2] = H[i] >>> 8; out[i * 4 + 3] = H[i]; } return out;
  }
  function utf8(str) { return new TextEncoder().encode(str); }
  function hex(u8) { return Array.prototype.map.call(u8, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  LG.sha256hex = function (str) { return hex(sha256(utf8(str))); };
  /* ---------- messages (account screens are in English) ---------- */
  var MSG = { bad_credentials: 'Incorrect username or password.', username_taken: 'This username is already taken. Please choose another one.', invalid_name: 'Please enter your name (up to 60 characters).', invalid_username: 'Username: 3–20 characters, letters a–z, digits, "_", "-" or ".".', invalid_password: 'The password must be 8–72 characters long.', locked: 'Too many wrong attempts. Please wait a few minutes and try again.', busy: 'Too many new accounts right now. Please try again later.', weak_password: 'This password is too easy to guess. Please choose a less common one that does not contain your username.', rate_limited: 'Too many requests from your connection. Please wait a minute and try again.', network: 'No internet connection. Please check your connection and try again.', session: 'Your session has expired. Please log in again.', server_error: 'Something went wrong. Please try again.' };
  LG.errText = function (code) { return MSG[code] || MSG.server_error; };

  /* ---------- progress: local storage (no server) ---------- */
  function union(a, b) { var s = {}, o = []; (a || []).concat(b || []).forEach(function (x) { if (!s[x]) { s[x] = 1; o.push(x); } }); return o; }
  LG.merge = function (a, b) {
    a = Object.assign(C.emptyProgress(), a || {}); b = Object.assign(C.emptyProgress(), b || {});
    var r = C.emptyProgress();
    r.placementDone = a.placementDone || b.placementDone; r.startLevel = Math.max(a.startLevel || 1, b.startLevel || 1);
    ['passed', 'stagePassed', 'done', 'ach', 'notif', 'certs', 'last', 'todayXP'].forEach(function (k) {
      var x = a[k] || {}, y = b[k] || {}, o = Object.assign({}, y, x);
      Object.keys(y).forEach(function (id) { if (x[id] && typeof x[id] === 'object' && typeof y[id] === 'object' && ((y[id].score || y[id].ts || 0) > (x[id].score || x[id].ts || 0))) o[id] = y[id]; });
      r[k] = o;
    });
    var seen = {}; r.tests = (a.tests || []).concat(b.tests || []).filter(function (t) { var k = t.ts + ':' + t.kind + ':' + t.level; if (seen[k]) return false; seen[k] = 1; return true; }).sort(function (x, y) { return x.ts - y.ts; }).slice(-300);
    r.words = union(a.words, b.words);
    r.mistakes = Object.assign({}, a.mistakes); Object.keys(b.mistakes || {}).forEach(function (k) { r.mistakes[k] = Math.max(r.mistakes[k] || 0, b.mistakes[k]); });
    r.srs = Object.assign({}, a.srs); Object.keys(b.srs || {}).forEach(function (k) { if (!r.srs[k] || (b.srs[k].ts || 0) > (r.srs[k].ts || 0)) r.srs[k] = b.srs[k]; });
    r.minutes = Math.max(a.minutes || 0, b.minutes || 0); r.rev = Math.max(a.rev || 0, b.rev || 0);
    r.xp = Math.max(a.xp || 0, b.xp || 0); r.days = union(a.days, b.days).sort().slice(-400);
    return r;
  };
  /* ---------- Languway German backend (Supabase, isolated schema "german" + RPC functions german_*) ---------- */
  var API = 'https://fsuwmmtierimmuoxmhrx.supabase.co/rest/v1/rpc/';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdXdtbXRpZXJpbW11b3htaHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjY1NTEsImV4cCI6MjEwOTY0MjU1MX0.F34AJVyAczSczN0UUFdnY_uyYrDVxLP-S0dNqjhBV-I';
  function err(code, extra) { var e = { code: code }; if (extra) for (var k in extra) e[k] = extra[k]; return e; }
  LG.rpc = function (fn, args, keepalive) {
    var ctl = window.AbortController ? new AbortController() : null, t = ctl && setTimeout(function () { ctl.abort(); }, 20000);
    return fetch(API + fn, { method: 'POST', keepalive: !!keepalive, signal: ctl ? ctl.signal : undefined, headers: { 'content-type': 'application/json', apikey: ANON, Authorization: 'Bearer ' + ANON }, body: JSON.stringify(args || {}) })
      .then(function (r) { if (t) clearTimeout(t); if (!r.ok) throw err('server_error'); return r.json(); }, function () { if (t) clearTimeout(t); throw err('network'); });
  };
  function ok(r) { if (r && r.ok) return r; throw err((r && r.error) || 'server_error', r && r.wait ? { wait: r.wait } : null); }
  function cacheKey() { return 'lg.pg.' + (LG.S.user ? LG.S.user.username : '_'); }
  function token() { var s = lsGet(KEY.session, null); return s && s.token; }

  /* progress: always saved locally at once, pushed to Supabase a moment later (works offline, syncs later) */
  var dirty = false, pushing = null, timer = 0, lastPull = 0;
  LG.setSync = function (s) {
    LG.S.sync = s; var el = LG.$('#syncdot'); if (!el) return; el.className = 'tag' + (s === 'offline' ? ' warn' : '');
    el.textContent = s === 'saving' ? 'Speichere …' : s === 'offline' ? 'Offline – wird später gesichert' : 'Gespeichert';
  };
  LG.save = function () {
    if (!LG.S.user) return; LG.pg.rev = Date.now(); lsSet(cacheKey(), LG.pg); dirty = true; LG.setSync('saving');
    clearTimeout(timer); timer = setTimeout(LG.flush, 1500);
  };
  LG.push = LG.save;
  LG.flush = function (keepalive) {
    clearTimeout(timer); if (!LG.S.user || !token()) return Promise.resolve();
    if (pushing) return pushing.then(function () { return dirty ? LG.flush(keepalive) : null; });
    if (!dirty) { LG.setSync('saved'); return Promise.resolve(); }
    dirty = false;
    var pre = Date.now() - lastPull > 120000 ? LG.rpc('german_session', { p_token: token() }).then(function (r) { if (r && r.ok) { lastPull = Date.now(); mergeIn(r.progress); } }) : Promise.resolve();
    pushing = pre.then(function () { return LG.rpc('german_save', { p_token: token(), p_data: LG.pg }, keepalive); }).then(function (r) {
      if (r && r.error === 'session') { dirty = true; return LG.setSync('offline'); } ok(r); LG.setSync(dirty ? 'saving' : 'saved');
    }).catch(function () { dirty = true; LG.setSync('offline'); }).then(function () { pushing = null; });
    return pushing;
  };
  function mergeIn(server) {
    if (!server || typeof server !== 'object') return;
    var m = LG.merge(LG.pg, server); Object.keys(LG.pg).forEach(function (k) { delete LG.pg[k]; }); Object.assign(LG.pg, m); lsSet(cacheKey(), LG.pg);
  }
  addEventListener('online', function () { dirty = true; LG.flush(); });

  function startSession(res, tok) {
    LG.S.user = { name: res.name, username: res.username }; lsSet(KEY.session, { username: res.username, name: res.name, token: tok }); lsSet(KEY.lastUser, res.username);
    LG.pg = LG.merge(lsGet(cacheKey(), {}), res.progress || {}); lsSet(cacheKey(), LG.pg); lastPull = Date.now(); dirty = true; LG.flush();
  }
  LG.signup = function (name, username, password) {
    name = String(name || '').trim(); username = String(username || '').trim().toLowerCase();
    if (!name || name.length > 60) return Promise.reject(err('invalid_name'));
    if (!/^[a-z0-9_.-]{3,20}$/.test(username)) return Promise.reject(err('invalid_username'));
    if (password.length < 8 || password.length > 72) return Promise.reject(err('invalid_password'));
    return LG.rpc('german_signup', { p_name: name, p_user: username, p_pass: password }).then(function (r) { ok(r); lsDel('lg.pg.' + username); startSession(r, r.token); });
  };
  LG.login = function (username, password) {
    username = String(username || '').trim().toLowerCase();
    return LG.rpc('german_login', { p_user: username, p_pass: password }).then(function (r) { ok(r); startSession(r, r.token); });
  };
  LG.clearLocal = function () { LG.S.user = null; LG.pg = C.emptyProgress(); lsDel(KEY.session); LG.certCache = {}; };
  LG.logout = function () {
    var t = token(); return LG.flush(true).then(function () { if (t) LG.rpc('german_logout', { p_token: t }, true).catch(function () {}); LG.clearLocal(); LG.go('/'); });
  };
  LG.deleteAccount = function (pw) {
    return LG.rpc('german_delete_account', { p_token: token(), p_pass: pw }).then(function (r) { ok(r); var u = LG.S.user.username; lsDel('lg.pg.' + u); lsDel('lg.certs.' + u); lsDel(KEY.lastUser); LG.clearLocal(); });
  };
  LG.changePassword = function (o, n) {
    if (n.length < 8 || n.length > 72) return Promise.reject(err('invalid_password'));
    return LG.rpc('german_change_password', { p_token: token(), p_old: o, p_new: n }).then(ok);
  };
  /* certificates are issued by the server (random code that exists only in the database) */
  LG.certCache = {};
  function certStore() { return 'lg.certs.' + (LG.S.user ? LG.S.user.username : '_'); }
  LG.getCert = function (kind, n) {
    var k = kind + n; if (!LG.certCache[k]) LG.certCache = Object.assign(lsGet(certStore(), {}), LG.certCache);
    if (LG.certCache[k]) return Promise.resolve(LG.certCache[k]);
    return LG.flush().then(function () { return LG.rpc('german_issue_cert', { p_token: token(), p_kind: kind, p_n: n }); }).then(function (r) {
      ok(r); LG.certCache[k] = r; lsSet(certStore(), LG.certCache); return r;
    });
  };
  LG.verifyCert = function (code) { return LG.rpc('german_verify', { p_code: code }); };

  /* ---------- settings ---------- */
  LG.settings = Object.assign({ rate: 0.9, voice: '', reminders: true }, lsGet(KEY.settings, {}));
  LG.setSetting = function (k, v) { LG.settings[k] = v; lsSet(KEY.settings, LG.settings); };
  LG.theme = function (t) { if (t) { document.documentElement.setAttribute('data-theme', t); lsSet(KEY.theme, t); var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = t === 'dark' ? '#0B1912' : '#16865B'; } return document.documentElement.getAttribute('data-theme'); };
  try { var tt = localStorage.getItem(KEY.theme); if (tt) { LG.theme(JSON.parse(tt)); } } catch (e) {}

  /* ---------- audio (device voices only, no external service) ---------- */
  var voices = [];
  function loadVoices() { if (window.speechSynthesis) voices = speechSynthesis.getVoices().filter(function (v) { return /^de/i.test(v.lang); }); }
  if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  LG.voices = function () { loadVoices(); return voices; };
  var FEM = /anna|petra|katja|hedda|marlene|vicki|google deutsch|female|weiblich|helena|amala|vicki/i, MAL = /markus|stefan|yannick|conrad|hans|jonas|male|männlich|killian|bernd|florian/i;
  LG.pickVoice = function (role) {
    var vs = LG.voices(); if (!vs.length) return null;
    if (LG.settings.voice) { var f = vs.filter(function (v) { return v.name === LG.settings.voice; })[0]; if (f && role !== 'b') return f; }
    var re = role === 'b' ? MAL : FEM, pick = vs.filter(function (v) { return re.test(v.name); })[0];
    if (!pick) pick = vs.filter(function (v) { return /de-DE/i.test(v.lang); })[0] || vs[0];
    return pick;
  };
  LG.canSpeak = function () { return !!window.speechSynthesis && !!window.SpeechSynthesisUtterance; };
  LG.stopSpeak = function () { if (window.speechSynthesis) speechSynthesis.cancel(); };
  LG.speak = function (text, o) {
    o = o || {};
    return new Promise(function (res) {
      if (!LG.canSpeak()) { LG.toast('Dieses Gerät kann keine Sprache ausgeben.', true); return res(); }
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text); u.lang = 'de-DE'; u.rate = o.rate || LG.settings.rate || 0.9;
      var v = LG.pickVoice(o.role); if (v) { u.voice = v; u.lang = v.lang; } else if (!LG.voices().length && !LG._warned) { LG._warned = 1; LG.toast('Keine deutsche Stimme gefunden. Installiere eine deutsche Sprachausgabe auf deinem Gerät.', true); }
      if (o.role === 'b' && (!v || !MAL.test(v.name))) u.pitch = .75;
      u.onend = u.onerror = function () { res(); };
      speechSynthesis.speak(u);
    });
  };
  LG.playLines = function (lines, rate, onLine, token) {
    var i = 0; LG._playTok = token = {};
    function next() { if (LG._playTok !== token || i >= lines.length) { if (onLine) onLine(-1); return Promise.resolve(); } var l = lines[i], idx = i++; if (onLine) onLine(idx);
      return LG.speak(l.replace(/^[AB]: /, ''), { rate: rate, role: /^B:/.test(l) ? 'b' : 'a' }).then(next); }
    return next();
  };

  /* ---------- level / progress helpers ---------- */
  LG.passedCount = function () { var n = 0; for (var i = 1; i <= 30; i++) if (LG.pg.passed[i]) n++; return n; };
  LG.levelStatus = function (n) { if (LG.pg.passed[n]) return 'done'; if (!C.isUnlocked(LG.pg, n)) return 'lock'; return n === C.currentLevel(LG.pg) ? 'cur' : 'open'; };
  LG.levelWords = function (n) { return P.words.filter(function (w) { return w.level === n; }); };
  LG.needed = function (total) { return Math.ceil(total * 0.75); };
  LG.stageDone = function (s) { return !!LG.pg.stagePassed[s]; };
  LG.stageLevelsDone = function (si) { var r = C.RANGES[si]; for (var n = r[1]; n <= r[2]; n++) if (!LG.pg.passed[n]) return false; return true; };
  LG.allStagesDone = function () { return C.STAGES.every(function (s) { return !!LG.pg.stagePassed[s]; }); };
  LG.nextExam = function () { for (var i = 0; i < C.STAGES.length; i++) if (!LG.pg.stagePassed[C.STAGES[i]]) return i + 1; return 'final'; };
  LG.addWords = function (n) {
    var now = Date.now();
    LG.levelWords(n).forEach(function (w) { if (LG.pg.words.indexOf(w.id) < 0) LG.pg.words.push(w.id); if (!LG.pg.srs[w.id]) LG.pg.srs[w.id] = { box: 0, due: now, ts: now }; });
  };
  LG.completeLevel = function (n, score, total) {
    var prev = LG.pg.passed[n]; LG.pg.passed[n] = { score: Math.round(score / total * 100), date: Date.now(), first: prev && prev.first || Date.now() }; if (!prev || prev.skipped) LG.addXP(50); LG.markSkill('test'); LG.addWords(n); LG.checkAch(); LG.save();
  };
  LG.recordTest = function (kind, level, correct, total) {
    LG.pg.tests.push({ kind: kind, level: level, score: correct, total: total, pct: Math.round(correct / total * 100), ts: Date.now() }); if (LG.pg.tests.length > 200) LG.pg.tests.shift();
  };
  LG.srsAnswer = function (id, ok) {
    var s = LG.pg.srs[id] || { box: 0 }, INT = [0, 1, 3, 7, 14, 30], now = Date.now();
    if (ok) { s.box = Math.min(5, (s.box || 0) + 1); s.due = now + INT[s.box] * 864e5; if (LG.pg.mistakes[id] > 0 && s.box >= 3) LG.pg.mistakes[id]--; }
    else { s.box = 0; s.due = now + 10 * 60e3; LG.pg.mistakes[id] = (LG.pg.mistakes[id] || 0) + 1; }
    LG.addXP(ok ? 2 : 1); LG.markSkill('review'); s.ts = now; LG.pg.srs[id] = s; if (LG.pg.words.indexOf(id) < 0) LG.pg.words.push(id);
  };
  LG.dueWords = function () { var now = Date.now(); return Object.keys(LG.pg.srs).filter(function (id) { return LG.pg.srs[id].due <= now && P.byId[id]; }).sort(function (a, b) { return (LG.pg.mistakes[b] || 0) - (LG.pg.mistakes[a] || 0) || LG.pg.srs[a].due - LG.pg.srs[b].due; }); };
  var ACH = [
    ['first', 'star', 'Erster Schritt', 'Ersten Test bestanden', function (p) { return Object.keys(p.passed).some(function (k) { return !p.passed[k].skipped; }); }],
    ['five', 'target', 'Fünf Stufen', '5 Stufen geschafft', function (p) { return Object.keys(p.passed).length >= 5; }],
    ['pre', 'award', 'Pre-A1 abgeschlossen', 'Abschlussprüfung Pre-A1 bestanden', function (p) { return !!p.stagePassed['Pre-A1'] && !p.stagePassed['Pre-A1'].skipped; }],
    ['streak3', 'flame', 'Drei Tage in Folge', '3 Tage hintereinander gelernt', function (p) { return LG.streak() >= 3; }],
    ['xp500', 'star', '500 XP', '500 Erfahrungspunkte gesammelt', function (p) { return (p.xp || 0) >= 500; }],
    ['a1', 'award', 'A1 abgeschlossen', 'Abschlussprüfung A1 bestanden', function (p) { return !!p.stagePassed.A1 && !p.stagePassed.A1.skipped; }],
    ['words50', 'book', '50 Wörter', '50 Wörter gelernt', function (p) { return p.words.length >= 50; }],
    ['words200', 'bulb', '200 Wörter', '200 Wörter gelernt', function (p) { return p.words.length >= 200; }],
    ['perfect', 'check', 'Fehlerfrei', 'Einen Test mit 100 % bestanden', function (p) { return p.tests.some(function (t) { return t.pct === 100 && t.kind !== 'placement'; }); }],
    ['hour', 'clock', 'Eine Stunde', '60 Minuten gelernt', function (p) { return p.minutes >= 60; }],
    ['half', 'flame', 'Halbzeit', '15 Stufen geschafft', function (p) { return Object.keys(p.passed).length >= 15; }],
    ['c1', 'shield', 'C1 erreicht', 'Abschlussprüfung B2 bestanden', function (p) { return !!p.stagePassed.B2 && !p.stagePassed.B2.skipped; }],
    ['c2', 'award', 'Meister:in', 'Gesamtprüfung bestanden', function (p) { return !!p.stagePassed.FINAL; }]
  ];
  LG.achList = ACH.map(function (a) { return { id: a[0], icon: a[1], title: a[2], desc: a[3], test: a[4] }; });
  LG.checkAch = function () {
    LG.achList.forEach(function (a) { if (!LG.pg.ach[a.id] && a.test(LG.pg)) { LG.pg.ach[a.id] = { ts: Date.now() }; LG.toast('Erfolg freigeschaltet: ' + a.title); } });
  };
  LG.confetti = function () {
    var cols = ['#16865B', '#1fa874', '#B7E4CC', '#f5cf34', '#ffffff'];
    for (var i = 0; i < 40; i++) { var e = document.createElement('i'); e.className = 'confetti'; e.style.left = Math.random() * 100 + 'vw'; e.style.background = cols[i % cols.length]; e.style.animationDelay = Math.random() * .6 + 's'; document.body.appendChild(e); setTimeout(function (x) { x.remove(); }.bind(null, e), 3200); }
  };

  /* ---------- days, streak, xp ---------- */
  LG.today = function () { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  LG.touchDay = function () { var t = LG.today(); LG.pg.days = LG.pg.days || []; if (LG.pg.days.indexOf(t) < 0) { LG.pg.days.push(t); LG.save(); } };
  LG.streak = function () {
    var days = LG.pg.days || [], set = {}, n = 0, d = new Date(); days.forEach(function (x) { set[x] = 1; });
    function key(dt) { return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); }
    if (!set[key(d)]) d.setDate(d.getDate() - 1);
    while (set[key(d)]) { n++; d.setDate(d.getDate() - 1); } return n;
  };
  LG.addXP = function (n) { LG.pg.xp = (LG.pg.xp || 0) + n; LG.pg.todayXP = LG.pg.todayXP || {}; var t = LG.today(); LG.pg.todayXP[t] = (LG.pg.todayXP[t] || 0) + n; };
  LG.markSkill = function (skill) { LG.pg.last = LG.pg.last || {}; LG.pg.last[skill] = { ts: Date.now() }; };

  /* ---------- time tracking ---------- */
  var lastInput = Date.now();
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) { addEventListener(ev, function () { lastInput = Date.now(); }, { passive: true }); });
  setInterval(function () {
    if (LG.S.user && document.visibilityState === 'visible' && Date.now() - lastInput < 90000) { LG.pg.minutes = Math.round((LG.pg.minutes + 0.5) * 10) / 10; LG.touchDay(); LG._tick = (LG._tick || 0) + 1; if (LG._tick % 4 === 0) LG.save(); else lsSet(cacheKey(), LG.pg); }
  }, 30000);

  /* ---------- router + shell ---------- */
  var ROUTES = [
    [/^\/$/, 'home'], [/^\/auth\/(login|signup)$/, 'auth'], [/^\/verify\/([A-Za-z0-9_.~-]+)$/, 'verify'], [/^\/placement$/, 'placement'], [/^\/welcome$/, 'welcome'],
    [/^\/levels$/, 'levels'], [/^\/level\/(\d+)$/, 'lesson'], [/^\/test\/(\d+)$/, 'levelTest'], [/^\/exam\/([1-7]|final)$/, 'stageExam'],
    [/^\/translator$/, 'translator'], [/^\/wordbook$/, 'wordbook'], [/^\/review$/, 'review'], [/^\/profile$/, 'profile'], [/^\/settings$/, 'settings'], [/^\/certificates$/, 'certificates'], [/^\/certificate\/([A-Za-z0-9]+)$/, 'certificate'], [/^\/tutor$/, 'tutor'], [/^\/game$/, 'game']
  ];
  var PUBLIC = { home: 1, auth: 1, verify: 1 };
  LG.curRoute = null;
  LG.route = function () {
    LG.stopSpeak(); if (LG.cleanup) { try { LG.cleanup(); } catch (e) {} LG.cleanup = null; }
    var path = (location.hash || '#/').slice(1).split('?')[0] || '/', q = (location.hash.split('?')[1]) || '';
    var name = 'home', params = [];
    for (var i = 0; i < ROUTES.length; i++) { var m = ROUTES[i][0].exec(path); if (m) { name = ROUTES[i][1]; params = m.slice(1); break; } if (i === ROUTES.length - 1) { name = 'home'; } }
    var logged = !!LG.S.user;
    if (!logged && !PUBLIC[name]) return LG.go('/auth/login');
    if (logged && name === 'auth') return LG.go('/');
    if (logged && name === 'home' && LG.onboarded && !LG.onboarded()) return LG.go('/welcome');
    var NEEDS_LEVEL = { levels: 1, lesson: 1, levelTest: 1, stageExam: 1, review: 1, game: 1 };
    if (logged && !LG.pg.placementDone && NEEDS_LEVEL[name]) return LG.go('/placement');
    LG.curRoute = { name: name, params: params, path: path, q: new URLSearchParams(q) };
    var v = LG.views[name]; if (!v) return;
    Promise.resolve(v(params, LG.curRoute.q)).then(function (view) { if (!view || LG.curRoute.path !== path) return; LG.render(view, name); window.scrollTo(0, 0); });
  };
  var NAV = [['/', 'home', 'Start'], ['/levels', 'book', 'Lernen'], ['/translator', 'globe', 'Übersetzer'], ['/wordbook', 'list', 'Wörter'], ['/review', 'refresh', 'Wiederholen'], ['/game', 'target', 'Spiel'], ['/tutor', 'bulb', 'KI-Tutor'], ['/certificates', 'award', 'Zertifikate'], ['/profile', 'user', 'Profil'], ['/settings', 'settings', 'Einstellungen']];
  var BOTTOM = [['/', 'home', 'Start'], ['/levels', 'book', 'Lernen'], ['/translator', 'globe', 'Übersetzer'], ['/wordbook', 'list', 'Wörter'], ['/profile', 'user', 'Profil']];
  function isOn(p, cur) { return p === '/' ? cur === '/' : cur.indexOf(p) === 0 || (p === '/levels' && /^\/(level|test|exam)\b/.test(cur)); }
  LG.render = function (view, name) {
    var root = LG.$('#root'); document.title = (view.title ? view.title + ' – ' : '') + 'Languway German';
    if (view.bare || !LG.S.user) { root.innerHTML = view.html; if (view.mount) view.mount(root); return; }
    var cur = LG.curRoute.path, collapsed = lsGet(KEY.panel, false), u = LG.S.user, ini = LG.esc((u.name || '?').trim().charAt(0).toUpperCase());
    var due = LG.dueWords().length;
    var SEP = { '/review': 1, '/tutor': 1, '/settings': 1 };
    var items = NAV.map(function (n) { return (SEP[n[0]] ? '<div class="divider"></div>' : '') + '<a class="menu-item' + (isOn(n[0], cur) ? ' on' : '') + '" href="#' + n[0] + '" title="' + n[2] + '">' + LG.ic(n[1]) + '<span>' + n[2] + '</span>' + (n[0] === '/review' && due ? '<b class="badge">' + due + '</b>' : '') + '</a>'; }).join('');
    root.innerHTML =
      '<div class="shell"><aside class="panel' + (collapsed ? ' collapsed' : '') + '" id="panel"><div class="header"><h2><img src="logo-mark.png" alt=""><span>Menü</span></h2><button class="close" data-act="panelx" aria-label="Menü ein- oder ausklappen">' + LG.ic(collapsed ? 'menu' : 'x') + '</button></div>' +
      '<form class="search-box" id="psearch" role="search">' + LG.ic('search') + '<input type="search" placeholder="Wort suchen …" aria-label="Wort suchen"></form><div class="divider"></div>' + items +
      '<div class="grow"></div><div class="divider"></div><a class="me menu-item" href="#/profile" style="padding:10px"><span class="avatar">' + ini + '</span><div><b>' + LG.esc(u.name) + '</b><small>@' + LG.esc(u.username) + '</small></div></a></aside><div class="panel-scrim" data-act="panelx"></div>' +
      '<main class="main" id="main"><header class="topbar"><button class="iconbtn menu" data-act="panelopen" aria-label="Menü öffnen">' + LG.ic('menu') + '</button><h1>' + LG.esc(view.heading || view.title || '') + '</h1><span id="syncdot" class="tag"></span>' +
      '' + (LG.langSwitch ? LG.langSwitch() : '') + '<button class="dn" data-act="theme" aria-label="Tag- und Nachtmodus wechseln"><span class="stars"></span><span class="cloud"></span><span class="knob"></span></button></header>' + view.html + '</main></div>' +
      '<nav class="liquid-nav" aria-label="Hauptnavigation"><div class="liquid-glare-container"><span class="liquid-glare"></span></div>' + BOTTOM.map(function (n) { return '<a href="#' + n[0] + '" class="' + (isOn(n[0], cur) ? 'on' : '') + '" aria-label="' + n[2] + '">' + LG.ic(n[1]) + '<span>' + n[2] + '</span></a>'; }).join('') + '<i class="nav-sep"></i><button type="button" class="nav-theme" data-act="theme" aria-label="Tag- und Nachtmodus wechseln"><span class="i-moon">' + LG.ic('moon') + '</span><span class="i-sun">' + LG.ic('sun') + '</span></button></nav>';
    LG.setSync('saved');
    var ps = LG.$('#psearch'); ps.onsubmit = function (e) { e.preventDefault(); var v = ps.querySelector('input').value.trim(); LG.$('#panel').classList.remove('open'); LG.go('/wordbook?q=' + encodeURIComponent(v)); };
    if (collapsed) LG.$('#psearch').addEventListener('click', function () { if (LG.$('#panel').classList.contains('collapsed')) { LG.$('#panel').classList.remove('collapsed'); lsSet(KEY.panel, false); ps.querySelector('input').focus(); } });
    LG.$$('#panel a').forEach(function (a) { a.addEventListener('click', function () { LG.$('#panel').classList.remove('open'); }); });
    if (view.mount) view.mount(LG.$('#main'));
  };
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return; var f = LG.act[t.dataset.act]; if (f) f(t, e);
  });
  LG.act.panelx = function () { var p = LG.$('#panel'); if (matchMedia('(max-width:900px)').matches) p.classList.remove('open'); else { var c = !p.classList.contains('collapsed'); p.classList.toggle('collapsed', c); lsSet(KEY.panel, c); var cb = p.querySelector('.close'); if (cb) cb.innerHTML = LG.ic(c ? 'menu' : 'x'); } };
  LG.act.panelopen = function () { LG.$('#panel').classList.add('open'); };
  LG.act.theme = function () { LG.theme(LG.theme() === 'dark' ? 'light' : 'dark'); };
  LG.act.speak = function (t) { LG.speak(t.dataset.say, { rate: LG.settings.rate }); };
  LG.act.slow = function (t) { LG.speak(t.dataset.say, { rate: 0.6 }); };

  /* ---------- boot ---------- */
  LG.boot = function () {
    var splash = LG.$('#splash'), fresh = !sessionStorage.getItem(KEY.splash);
    try { sessionStorage.setItem(KEY.splash, '1'); } catch (e) {}
    function hide() { splash.classList.add('out'); setTimeout(function () { splash.remove(); }, 700); }
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(function () {});
    var ses = lsGet(KEY.session, null), check = Promise.resolve();
    if (ses && ses.token && ses.username) {
      LG.S.user = { name: ses.name || ses.username, username: ses.username }; LG.pg = Object.assign(C.emptyProgress(), lsGet(cacheKey(), {}));
      check = Promise.race([LG.rpc('german_session', { p_token: ses.token }), new Promise(function (r) { setTimeout(function () { r(null); }, 2800); })]).then(function (r) {
        if (r && r.ok) { LG.S.user.name = r.name; lastPull = Date.now(); mergeIn(r.progress); dirty = true; LG.flush(); }
        else if (r && r.ok === false) { LG.clearLocal(); }
      }).catch(function () {});
    } else lsDel(KEY.session);
    var minWait = new Promise(function (r) { setTimeout(r, fresh ? 3000 : 0); });
    Promise.all([minWait, check]).then(function () { if (LG.S.user) LG.touchDay(); LG.route(); hide(); });
    addEventListener('hashchange', LG.route);
    document.addEventListener('visibilitychange', function () { if (LG.S.user && document.visibilityState === 'hidden') { dirty = true; LG.flush(true); } });
  };
})();
