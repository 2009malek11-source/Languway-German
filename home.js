/* Languway German – start page, intro, progress, exam hub, real landmark photos */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, D = LG.D, esc = LG.esc, ic = LG.ic;
  var SCENES = ['Brandenburg Gate', 'Rothenburg ob der Tauber', 'Cologne Cathedral', 'Neuschwanstein Castle', 'Heidelberg Castle', 'Zugspitze', 'Reichstag building', 'Hamburg'];
  var SK = 'lg.scenic', cache = {}, fetching = false;
  try { cache = JSON.parse(localStorage.getItem(SK) || '{}') || {}; } catch (e) { cache = {}; }

  /* real photographs from Wikipedia / Wikimedia Commons; SVG artwork stays visible until a photo has loaded */
  function hydrate() {
    LG.$$('[data-scenic]').forEach(function (el) {
      var u = cache[el.getAttribute('data-scenic')]; if (typeof u !== 'string' || el.dataset.ph) return; el.dataset.ph = '1';
      var im = new Image(); im.alt = ''; im.referrerPolicy = 'no-referrer'; im.onload = function () { el.style.backgroundImage = 'url("' + u + '")'; el.classList.add('has'); }; im.src = u;
    });
  }
  function load() {
    if (fetching || !window.fetch || navigator.onLine === false) return; var need = SCENES.filter(function (t) { return cache[t] === undefined; }); if (!need.length) return; fetching = true;
    fetch('https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&pithumbsize=1000&redirects=1&format=json&origin=*&titles=' + encodeURIComponent(need.join('|')), { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (!j || !j.query) return; var q = j.query, to = {}, by = {};
        (q.normalized || []).forEach(function (x) { to[x.from] = x.to; }); (q.redirects || []).forEach(function (x) { to[x.from] = x.to; });
        Object.keys(q.pages || {}).forEach(function (k) { var p = q.pages[k]; by[p.title] = p.thumbnail && /^https:\/\/upload\.wikimedia\.org\//.test(p.thumbnail.source) ? p.thumbnail.source : 0; });
        need.forEach(function (t) { var f = t; for (var i = 0; i < 3 && to[f]; i++) f = to[f]; if (by[f] !== undefined) cache[t] = by[f]; });
        try { localStorage.setItem(SK, JSON.stringify(cache)); } catch (e) { /* storage blocked */ }
      }).catch(function () { /* offline: artwork stays */ }).then(function () { fetching = false; hydrate(); });
  }
  var PH = ['scene1.jpg', 'scene2.jpg', 'scene3.jpg', 'scene4.jpg'];
  function scenic(i, cls) { var u = cls === 'lc__img' ? PH[i % PH.length] : 'hero.jpg'; return '<div class="' + cls + ' has" role="img" aria-label="Foto" style="background-image:url(' + u + ')"></div>'; }
  window.addEventListener('load', function () {
    var r = LG.$('#root'); if (window.MutationObserver && r) { var b = false; new MutationObserver(function () { if (b) return; b = true; setTimeout(function () { b = false; hydrate(); }, 60); }).observe(r, { childList: true, subtree: true }); }
    setTimeout(function () { load(); hydrate(); }, 300);
  });

  function days7() {
    var out = [], lab = [], x = LG.pg.todayXP || {}, W = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    for (var i = 6; i >= 0; i--) { var d = new Date(Date.now() - i * 864e5), k = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); out.push(x[k] || 0); lab.push(W[d.getDay()]); }
    return { v: out, l: lab };
  }
  function doneLessons() { return Object.keys(LG.pg.done).filter(function (k) { return LG.pg.done[k]; }).length; }
  function pct() { return Math.round(LG.passedCount() / 30 * 100); }
  var BADGES = { first: ['<path d="M5 13l4 4L19 7"/>', 'gold'], book: ['<path d="M4 5h7v14H4zM13 5h7v14h-7z"/>', 'blue'], star: ['<path d="m12 3 2.6 5.5 6 .9-4.3 4.2 1 6L12 16.8 6.7 19.6l1-6L3.4 9.4l6-.9z"/>', 'violet'], award: ['<circle cx="12" cy="9" r="5"/><path d="m9 13-1 7 4-2 4 2-1-7"/>', 'green'] };
  function badge(a) {
    var on = !!LG.pg.ach[a.id], g = BADGES[a.icon] || BADGES.star;
    return '<div class="bdg' + (on ? '' : ' off') + '">' + LG.art.shield(g[0], g[1]) + '<b>' + esc(a.title) + '</b><small>' + esc(a.desc) + '</small></div>';
  }
  LG.badge = badge;

  /* ---------- start page (logged in) ---------- */
  function dashboard() {
    var u = LG.S.user, n = C.currentLevel(LG.pg), cur = LG.currentLesson(), p = pct(), lv = D.LEVELS[n - 1], allDone = LG.passedCount() === 30, nx = LG.nextExam();
    var cta = allDone ? '#/exam/' + nx : LG.lessonHref(cur), ch = days7(), due = LG.dueWords().length;
    var list = LG.lessonList(n), startAt = Math.max(0, list.indexOf(list.filter(function (x) { return x.current; })[0])), cards = '';
    for (var k = 0; k < 4; k++) {
      var l = list[(startAt + k) % 8], st = l.done ? 'done' : l.locked ? 'lock' : l.current ? 'now' : '';
      cards += '<a class="lc ' + st + '" href="' + (l.locked ? '#/levels' : LG.lessonHref(l)) + '"' + (l.locked ? ' data-act="locked"' : '') + '>' + scenic(k, 'lc__img') + '<span class="lc__st">' + ic(l.done ? 'check' : l.locked ? 'lock' : 'play') + '</span><span class="lc__n">' + l.no + '</span><div class="lc__t"><b>' + l.title + '</b><small>Einheit ' + l.unit + ' · Lektion ' + l.no + '</small></div><span class="lc__go">' + ic('play') + '</span></a>';
    }
    var tools = [['/translator', 'globe', 'Übersetzer'], ['/wordbook', 'list', 'Wörterbuch'], ['/review', 'refresh', 'Wiederholen' + (due ? ' (' + due + ')' : '')], ['/game', 'pad', 'Spiele'], ['/tutor', 'spark', 'KI-Tutor'], ['/certificates', 'award', 'Zertifikate']].map(function (t) { return '<a class="tool" href="#' + t[0] + '">' + ic(t[1]) + '<span>' + t[2] + '</span></a>'; }).join('');
    var ach = LG.achList.slice(0, 4).map(badge).join('');
    return {
      title: 'Start', noHead: true, html: !LG.pg.placementDone ? LG.startCard() :
        '<section class="hero2"><div class="hero2__art">' + LG.art.sky() + scenic(0, 'hero2__photo') + '</div><div class="hero2__txt"><h1 class="hello"><span>Hallo,</span> ' + esc(u.name.split(' ')[0]) + '!</h1><p class="hl">Lass uns gemeinsam <em>Deutsch</em> lernen!</p><p class="hs">Träume größer. Sprich besser. Entdecke neue Horizonte.</p><a class="gold" href="' + cta + '">' + ic('play') + (allDone ? 'Zur Prüfung' : 'Weiterlernen') + '</a></div></section>' +
        '<section class="stats3"><a class="sc" href="#/progress">' + LG.art.ring(p) + '<div><small>Dein Fortschritt</small><b>Stufe ' + n + '</b><span>' + ic('trophy') + ' ' + (LG.pg.xp || 0) + ' Punkte</span></div>' + ic('forward') + '</a>' +
        '<a class="sc" href="' + cta + '"><span class="sc__ic">' + ic('calendar') + '</span><div><small>Nächste Lektion</small><b>' + LG.lessonLabel(cur) + '</b><span>' + ic('clock') + ' Heute · 10 Min.</span></div>' + ic('forward') + '</a>' +
        '<a class="sc" href="#/progress">' + LG.art.medal(lv.c) + '<div><small>Dein Niveau</small><b class="big">' + lv.c + '</b></div>' + ic('forward') + '</a></section>' +
        '<section class="tiles4"><a href="#/levels">' + ic('book') + '<span>Lektionen</span></a><a href="' + LG.lessonHref({ n: n, step: 'listen' }) + '">' + ic('phones') + '<span>Hören</span></a><a href="#/tests">' + ic('clipboard') + '<span>Prüfungen</span></a><a href="#/progress">' + ic('chart') + '<span>Statistik</span></a></section>' +
        '<div class="sh"><h2>' + ic('cap') + ' Meine Lektionen</h2><a href="#/levels">Alle ansehen ' + ic('forward') + '</a></div><div class="lcards">' + cards + '</div>' +
        '<div class="duo"><section class="gl pad"><div class="sh"><h2>' + ic('trophy') + ' Deine Erfolge</h2><a href="#/progress">Alle ansehen ' + ic('forward') + '</a></div><div class="bdgs">' + ach + '</div></section>' +
        '<section class="gl pad"><div class="sh"><h2>' + ic('chart') + ' Lernstatistik</h2></div><div class="lstat">' + LG.art.chart(ch.v, ch.l) + '<div class="chips2"><div><b>' + LG.hm(LG.pg.minutes || 0) + '</b><small>Lernzeit gesamt</small></div><div><b>' + doneLessons() + '</b><small>Lektionen erledigt</small></div></div></div></section></div>' +
        '<div class="sh"><h2>' + ic('spark') + ' Werkzeuge</h2></div><div class="tools">' + tools + '</div>' +
        LG.goalCard() +
        '<section class="banner"><span class="banner__ic">' + ic('target') + '</span><div><b>Du machst das großartig!</b><span>Bleib dran, um dein nächstes Niveau zu erreichen.</span></div><a class="gold sm" href="' + cta + '">Weiter ' + ic('arrowr') + '</a></section>',
      mount: function () { var d = LG.pg.notif || (LG.pg.notif = {}); d.lastOpen = Date.now(); LG.save(); if (LG.settings.reminders && !LG._remShown && LG.pg.placementDone) { LG._remShown = 1; var m = due ? 'Zeit, deinen Wortschatz zu wiederholen (' + due + ' Wörter).' : (LG.passedCount() < 30 ? 'Deine nächste Lektion ist bereit.' : ''); if (m) setTimeout(function () { LG.toast(m); }, 1200); } }
    };
  }
  LG.act.cont = function (t) { LG.go(t.dataset.href.slice(1)); };
  LG.act.locked = function (t, e) { e.preventDefault(); LG.toast('Das ist noch gesperrt. Schließe zuerst die vorherige Lektion oder Stufe ab.', true); };

  /* ---------- landing / intro (guests): no menu bar ---------- */
  function landing() {
    var feats = [['eye', 'Lesen', 'Texte für jede Stufe mit Verständnisfragen.'], ['pencil', 'Schreiben', 'Schreibaufgaben mit Hinweisen für sichere Sätze.'], ['bulb', 'Grammatik', 'Regeln Schritt für Schritt – mit Beispielen und Übungen.'], ['book', 'Wortschatz', 'Wörter mit Artikel, Plural, Foto und Beispielsatz.'], ['phones', 'Hören und Sprechen', 'Dialoge, Tempo wählen, nachsprechen.'], ['globe', 'Übersetzer', 'Erklärt jedes Wort: Bedeutung, Grammatik, Zeiten, Bild.']];
    var how = ['Konto erstellen – nur Name, Benutzername und Passwort.', 'Kurzen Einstufungstest machen oder bei null starten.', 'Stufe für Stufe lernen: Einheit → Lektion → Wörterbuch.', 'Mit Tests (75 %) freischalten, Zertifikate sammeln.'];
    return { title: 'Deutsch lernen von A1 bis C2', bare: true, html:
      '<div class="land2"><section class="intro">' + LG.art.sky() + scenic(0, 'intro__photo') + '<div class="intro__shade"></div>' +
      '<div class="intro__in"><div class="intro__logo"><span class="ring r1"></span><span class="ring r2"></span><img src="logo-round.png" alt="Languway German" width="132" height="132"></div>' +
      '<p class="intro__k">Languway German</p><h1 class="intro__h"><span>Hallo!</span> Lass uns gemeinsam <em>Deutsch</em> lernen!</h1><p class="intro__s">Träume größer. Sprich besser. Entdecke neue Horizonte – von A1 bis C2.</p>' +
      '<div class="row c"><a class="gold" href="#/auth/signup">' + ic('play') + 'Jetzt starten</a><a class="ghostbtn" href="#/auth/login">Anmelden</a></div><span class="intro__flag"><i></i><i></i><i></i></span></div></section>' +
      '<section class="sec2"><h2>Alles, was du zum Deutschlernen brauchst</h2><div class="fgrid">' + feats.map(function (f) { return '<div class="gl pad feat2"><span class="fic">' + ic(f[0]) + '</span><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div>'; }).join('') + '</div></section>' +
      '<section class="sec2"><h2>So funktioniert es</h2><ol class="how">' + how.map(function (h) { return '<li class="gl">' + h + '</li>'; }).join('') + '</ol></section>' +
      '<section class="sec2"><h2>Die sieben Niveaus</h2><div class="fgrid">' + LG.STAGES.map(function (s, i) { return '<div class="gl pad lvl7"><b>' + s[0] + '</b><span>' + s[1] + '</span><small>Stufen ' + C.RANGES[i][1] + '–' + C.RANGES[i][2] + '</small></div>'; }).join('') + '</div></section>' +
      '<footer class="footer">' + LG.langSwitch() + '<p>Languway German · Teil der Languway-Serie</p><p class="muted">Unabhängig und nicht mit dem Goethe-Institut verbunden. Die Zertifikate sind Zertifikate der Plattform, keine offiziellen Sprachdiplome.</p></footer></div>' };
  }
  LG.views.home = function () { return LG.S.user ? dashboard() : landing(); };

  /* ---------- my progress ---------- */
  LG.views.progress = function () {
    var n = C.currentLevel(LG.pg), p = pct(), lv = D.LEVELS[n - 1], ch = days7(), tests = LG.pg.tests.filter(function (t) { return t.kind !== 'placement'; }).slice(-6).reverse();
    var rows = tests.length ? tests.map(function (t) { return '<div class="resrow"><span>' + (t.kind === 'final' ? 'Gesamtprüfung' : t.kind === 'exam' ? 'Abschlussprüfung ' + LG.STAGES[t.level - 1][0] : t.kind === 'review' ? 'Wiederholung' : 'Stufe ' + t.level) + '</span><b>' + t.score + '/' + t.total + ' · ' + t.pct + ' %</b></div>'; }).join('') : '<div class="empty">Noch keine Tests. Starte mit deiner ersten Stufe!</div>';
    var map = LG.STAGES.map(function (s, i) { var a = C.RANGES[i][1], b = C.RANGES[i][2], d = 0; for (var k = a; k <= b; k++) if (LG.pg.passed[k]) d++; return '<div class="stg"><b>' + s[0] + '</b><div class="bar"><i style="width:' + Math.round(d / (b - a + 1) * 100) + '%"></i></div><small>' + d + '/' + (b - a + 1) + '</small></div>'; }).join('');
    return { title: 'Fortschritt', heading: 'Mein Fortschritt', html:
      '<section class="stats3"><div class="sc">' + LG.art.ring(p) + '<div><small>Gesamtfortschritt</small><b>' + LG.passedCount() + ' von 30 Stufen</b><span>' + ic('trophy') + ' ' + (LG.pg.xp || 0) + ' Punkte</span></div></div><div class="sc"><span class="sc__ic">' + ic('clock') + '</span><div><small>Lernzeit</small><b>' + LG.hm(LG.pg.minutes || 0) + '</b><span>' + doneLessons() + ' Lektionen erledigt</span></div></div><div class="sc">' + LG.art.medal(lv.c) + '<div><small>Dein Niveau</small><b class="big">' + lv.c + '</b></div></div></section>' +
      '<div class="duo"><section class="gl pad"><h3>Aktivität (7 Tage)</h3><div class="lstat">' + LG.art.chart(ch.v, ch.l) + '</div></section><section class="gl pad"><h3>Niveaus</h3><div class="stgs">' + map + '</div></section></div>' +
      '<div class="duo"><section class="gl pad"><h3>Testergebnisse</h3>' + rows + '<a class="btn soft sm" href="#/tests" style="margin-top:10px">Zu den Prüfungen</a></section><section class="gl pad"><h3>Erfolge</h3><div class="bdgs">' + LG.achList.map(badge).join('') + '</div></section></div>' +
      '<a class="gl pad linkrow" href="#/certificates">' + ic('award') + '<div><b>Meine Zertifikate</b><small>Ansehen, drucken und prüfen</small></div>' + ic('forward') + '</a>' };
  };

  /* ---------- exams hub ---------- */
  LG.views.tests = function () {
    var cur = C.currentLevel(LG.pg), rows = '';
    for (var n = 1; n <= Math.min(30, cur + 1); n++) { var l = LG.lessonList(n), ok = l.every(function (x) { return x.done; }), pass = LG.pg.passed[n]; rows += '<a class="gl pad linkrow' + (ok || pass ? '' : ' lk') + '" href="' + (ok || pass ? '#/test/' + n : '#/levels') + '">' + ic(pass ? 'check' : ok ? 'target' : 'lock') + '<div><b>Stufentest ' + n + ' · ' + esc(LG.lvTitle(n)) + '</b><small>' + (pass ? 'Bestanden' : ok ? 'Bereit · 75 % zum Bestehen' : 'Schließe zuerst alle 8 Lektionen ab') + '</small></div>' + ic('forward') + '</a>'; }
    var ex = LG.STAGES.map(function (s, i) { var ready = LG.stageLevelsDone(i), pass = LG.stageDone(s[0]); return '<a class="gl pad linkrow' + (ready || pass ? '' : ' lk') + '" href="' + (ready || pass ? '#/exam/' + (i + 1) : '#/levels') + '">' + ic(pass ? 'award' : ready ? 'target' : 'lock') + '<div><b>Abschlussprüfung ' + s[0] + '</b><small>' + (pass ? 'Bestanden' : ready ? 'Bereit' : 'Noch gesperrt') + '</small></div>' + ic('forward') + '</a>'; }).join('');
    return { title: 'Prüfungen', heading: 'Prüfungen', html: '<h3>Stufentests</h3><div class="stack">' + rows + '</div><h3 style="margin-top:22px">Abschlussprüfungen</h3><div class="stack">' + ex + '</div>' };
  };
})();
