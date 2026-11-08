/* Languway German – views part 4: profile, settings, certificate, public certificate check */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, D = LG.D, esc = LG.esc, ic = LG.ic;

  /* ---------- profile ---------- */
  LG.views.profile = function () {
    var u = LG.S.user, p = LG.pg, n = C.currentLevel(p), done = LG.passedCount();
    var stages = C.STAGES.filter(function (s) { return p.stagePassed[s] && !p.stagePassed[s].skipped; }).length, xp = p.xp || 0, streak = LG.streak();
    var real = p.tests.filter(function (t) { return t.kind !== 'placement'; }), avg = real.length ? Math.round(real.reduce(function (a, t) { return a + t.pct; }, 0) / real.length) : 0;
    var ach = LG.achList.map(function (a) { var on = !!p.ach[a.id]; return '<div class="ach' + (on ? '' : ' off') + '"><span class="ic">' + ic(a.icon) + '</span><div><b>' + esc(a.title) + '</b><span>' + esc(a.desc) + '</span></div></div>'; }).join('');
    var hrs = p.minutes >= 60 ? (Math.round(p.minutes / 6) / 10) + ' Std.' : Math.round(p.minutes) + ' Min.';
    var cert = !!p.stagePassed.FINAL;
    return { title: 'Profil', heading: 'Profil', html:
      '<div class="card welcome"><span class="avatar" style="width:64px;height:64px;font-size:28px">' + esc((u.name || '?').trim().charAt(0).toUpperCase()) + '</span><div><h2>' + esc(u.name) + '</h2><div class="muted">@' + esc(u.username) + (u.created_at ? ' · Mitglied seit ' + LG.fmtDate(u.created_at) : '') + '</div><div style="margin-top:6px"><span class="tag">' + D.LEVELS[n - 1].c + ' · Stufe ' + n + '</span></div></div></div>' +
      '<div class="grid c4" style="margin-top:16px"><div class="card stat"><b>' + done + '/30</b><span>Stufen geschafft</span></div><div class="card stat"><b>' + stages + '/6</b><span>Abschlussprüfungen</span></div><div class="card stat"><b>' + p.words.length + '</b><span>Wörter im Training</span></div><div class="card stat"><b>' + hrs + '</b><span>Lernzeit</span></div></div>' +
      '<div class="grid c2" style="margin-top:16px"><div class="card stat"><b>' + (real.length ? avg + ' %' : '–') + '</b><span>Durchschnitt aller Tests (' + real.length + ')</span></div><div class="card"><h3>Zertifikat</h3><p class="muted">' + (cert ? 'Glückwunsch! Du hast die Gesamtprüfung bestanden.' : 'Zertifikate gibt es für jede Stufe, jedes Niveau und nach der Gesamtprüfung.') + '</p><a class="btn ' + (cert ? '' : 'soft') + '" href="#/certificates">' + ic('award') + ' ' + (cert ? 'Zertifikate öffnen' : 'Meine Zertifikate') + '</a></div></div>' +
      '<div class="card" style="margin-top:16px"><h3>Erfolge</h3><div class="grid c2">' + ach + '</div></div>' };
  };

  /* ---------- settings ---------- */
  LG.act.logout = function () { LG.confirm('Abmelden?', 'Dein Fortschritt bleibt in diesem Browser gespeichert. Du kannst dich jederzeit mit Benutzername und Passwort wieder anmelden.', 'Abmelden').then(function (ok) { if (ok) LG.logout(); }); };
  LG.act.chpw = function () {
    LG.modal('<h3>Passwort ändern</h3><div class="formerr" id="cp-e" hidden></div><div class="field"><label for="cp-o">Aktuelles Passwort</label><input type="password" id="cp-o" dir="ltr" autocomplete="current-password"></div><div class="field"><label for="cp-n">Neues Passwort</label><input type="password" id="cp-n" dir="ltr" autocomplete="new-password"><small>8 bis 72 Zeichen</small></div><div class="modal__actions"><button class="btn soft" data-r="0">Abbrechen</button><button class="btn" data-r="1">Speichern</button></div>', function (m) {
      var e = m.querySelector('#cp-e');
      m.querySelector('[data-r="0"]').onclick = LG.closeModal;
      m.querySelector('[data-r="1"]').onclick = function (ev) {
        var b = ev.currentTarget, o = m.querySelector('#cp-o').value, n = m.querySelector('#cp-n').value; e.hidden = true;
        if (n.length < 8 || n.length > 72) { e.textContent = LG.errText('invalid_password'); e.hidden = false; return; }
        b.disabled = true;
        LG.changePassword(o, n).then(function () { LG.closeModal(); LG.toast('Passwort geändert.'); }).catch(function (er) { b.disabled = false; e.textContent = LG.errText(er.code); e.hidden = false; });
      };
    });
  };
  LG.act.delacc = function () {
    LG.confirm('Konto wirklich löschen?', 'Alle Daten und der Fortschritt werden unwiderruflich gelöscht. Ein gelöschtes Konto kann sich nicht mehr anmelden.', 'Weiter', true).then(function (ok) {
      if (!ok) return;
      LG.askPassword('Passwort bestätigen', 'Gib zur Sicherheit dein Passwort ein.', 'Konto löschen').then(function (pw) {
        if (pw == null) return;
        LG.deleteAccount(pw).then(function () { LG.toast('Dein Konto wurde gelöscht.'); LG.go('/'); }).catch(function (er) { LG.toast(LG.errText(er.code), true); });
      });
    });
  };

  /* ---------- certificates (signed, verifiable offline) ---------- */
  function verifyUrl(c) { return location.href.split('#')[0] + '#/verify/' + c.code; }
  function describe(kind, n) {
    if (kind === 'L') { var lv = D.LEVELS[n - 1]; return { head: 'Stufenzertifikat', title: 'Stufe ' + n + ' · ' + lv.t, sub: 'Niveau ' + lv.c }; }
    if (kind === 'S') return { head: 'Niveauzertifikat', title: 'Niveau ' + C.STAGES[n - 1], sub: 'Stufen ' + C.RANGES[n - 1][1] + '–' + C.RANGES[n - 1][2] };
    return { head: 'Abschlusszertifikat', title: 'Languway German · 30 Stufen', sub: 'Pre-A1 bis C2 · Gesamtprüfung bestanden' };
  }
  function entries() {
    var p = LG.pg, name = LG.S.user.name, out = [], n;
    for (n = 1; n <= 30; n++) { var x = p.passed[n]; if (x && !x.skipped) out.push({ code: 'L' + n, kind: 'L', n: n, name: name, score: x.score, ts: x.first || x.date }); }
    C.STAGES.forEach(function (s, i) { var x = p.stagePassed[s]; if (x && !x.skipped) out.push({ code: 'S' + (i + 1), kind: 'S', n: i + 1, name: name, score: x.score, ts: x.first || x.date }); });
    if (p.stagePassed.FINAL) out.push({ code: 'F', kind: 'F', n: 0, name: name, score: p.stagePassed.FINAL.score, ts: p.stagePassed.FINAL.first || p.stagePassed.FINAL.date });
    return out;
  }
  function loadImg(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; }); }
  function fit(ctx, text, max, size, weight, face) { var s = size; do { ctx.font = weight + ' ' + s + 'px ' + face; s -= 2; } while (ctx.measureText(text).width > max && s > 22); }
  function seal(x, cx, cy, R, sig, gold) {
    var bytes = []; for (var i = 0; i < sig.length; i += 2) bytes.push(parseInt(sig.substr(i, 2), 16));
    x.save(); x.translate(cx, cy);
    var g = x.createRadialGradient(0, 0, R * .1, 0, 0, R); g.addColorStop(0, gold ? '#f7e9a8' : '#2ca877'); g.addColorStop(1, gold ? '#c99a2e' : '#0D6042');
    x.fillStyle = g; x.beginPath(); for (var k = 0; k < 48; k++) { var a = k / 48 * Math.PI * 2, r = R * (k % 2 ? .93 : 1); x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill();
    x.strokeStyle = gold ? 'rgba(90,60,0,.55)' : 'rgba(255,255,255,.55)'; x.lineWidth = 2;
    for (var j = 0; j < 6; j++) {                                    // guilloche pattern derived from the signature
      var f1 = 3 + (bytes[j] % 5), f2 = 2 + (bytes[j + 6] % 4), ph = bytes[(j * 2) % 12] / 255 * Math.PI * 2;
      x.beginPath(); for (var t = 0; t <= 360; t += 2) { var a2 = t * Math.PI / 180, rr = R * (.55 + .12 * Math.sin(f1 * a2 + ph) + .08 * Math.cos(f2 * a2 + j)); x.lineTo(Math.cos(a2) * rr, Math.sin(a2) * rr); } x.closePath(); x.stroke();
    }
    x.beginPath(); x.arc(0, 0, R * .72, 0, Math.PI * 2); x.strokeStyle = gold ? '#7a5410' : '#fff'; x.lineWidth = 3; x.stroke();
    x.fillStyle = gold ? '#5b3d06' : '#fff'; x.textAlign = 'center'; x.font = '700 ' + Math.round(R * .2) + 'px Georgia, serif';
    x.fillText('LANGUWAY', 0, -R * .06); x.fillText('GERMAN', 0, R * .16);
    var txt = ('★ ZERTIFIZIERT ★ ' + sig.toUpperCase() + ' ').repeat(2), n = txt.length; x.font = '600 ' + Math.round(R * .085) + 'px monospace';
    for (var q = 0; q < n; q++) { var aa = q / n * Math.PI * 2 - Math.PI / 2; x.save(); x.rotate(aa); x.translate(0, -R * .84); x.fillText(txt[q], 0, 0); x.restore(); }
    x.restore();
  }
  function drawCert(c) {
    var W = 1600, H = 1131, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var x = cv.getContext('2d'), d = describe(c.kind, c.n), gold = c.kind === 'F';
    var sig = LG.sha256hex(c.code).slice(0, 24);
    return loadImg('logo-mark.png').then(function (logo) {
      var F = 'Georgia, "Times New Roman", serif', S = 'system-ui, "Segoe UI", Arial, sans-serif', main = gold ? '#8a6410' : '#16865B', dark = gold ? '#5b3d06' : '#0D6042';
      x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
      var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, gold ? '#fffaf0' : '#F3FAF6'); g.addColorStop(1, '#ffffff'); x.fillStyle = g; x.fillRect(30, 30, W - 60, H - 60);
      x.strokeStyle = main; x.lineWidth = 14; x.strokeRect(30, 30, W - 60, H - 60); x.strokeStyle = gold ? '#e8cf86' : '#B7E4CC'; x.lineWidth = 4; x.strokeRect(58, 58, W - 116, H - 116);
      x.textAlign = 'center';
      if (logo) x.drawImage(logo, W / 2 - 50, 95, 100, 100);
      x.font = '700 28px ' + S; x.fillStyle = main; x.fillText('LANGUWAY GERMAN', W / 2, 232); x.font = '500 19px ' + S; x.fillStyle = '#5a7a6b'; x.fillText('Part of the Languway Series', W / 2, 262);
      x.font = '700 70px ' + F; x.fillStyle = dark; x.fillText(d.head, W / 2, 360);
      x.font = '400 26px ' + S; x.fillStyle = '#333'; x.fillText('Herzlichen Glückwunsch und vielen Dank für dein Engagement,', W / 2, 415);
      fit(x, c.name, W - 380, 76, '700', F); x.fillStyle = '#102A20'; x.fillText(c.name, W / 2, 510);
      x.strokeStyle = main; x.lineWidth = 3; x.beginPath(); x.moveTo(300, 538); x.lineTo(W - 300, 538); x.stroke();
      x.font = '400 26px ' + S; x.fillStyle = '#333'; x.fillText(c.kind === 'F' ? 'hat alle 30 Stufen und die Gesamtprüfung erfolgreich abgeschlossen:' : 'hat erfolgreich abgeschlossen:', W / 2, 592);
      fit(x, d.title, W - 300, 46, '700', S); x.fillStyle = dark; x.fillText(d.title, W / 2, 656);
      x.font = '400 24px ' + S; x.fillStyle = '#333'; x.fillText(d.sub, W / 2, 698);
      x.font = '700 40px ' + S; x.fillStyle = main; x.fillText('Ergebnis: ' + c.score + ' %', W / 2, 765);
      var done = LG.passedCount(), left = Math.max(0, 30 - done);
      x.font = '400 22px ' + S; x.fillStyle = '#444';
      var line = c.kind === 'F' ? 'Alle 30 von 30 Stufen geschafft – du hast das Ziel erreicht!' : 'Fortschritt: ' + done + ' von 30 Stufen geschafft · noch ' + left + ' Stufen bis zum Abschlusszertifikat';
      x.fillText(line, W / 2, 812);
      x.textAlign = 'left'; x.font = '400 22px ' + S; x.fillStyle = '#333';
      x.fillText('Datum: ' + LG.fmtDate(c.achieved), 140, 905); x.fillText('Lernzeit insgesamt: ' + LG.hm((c.meta && c.meta.minutes) || LG.pg.minutes), 140, 940);
      x.font = '700 22px ' + S; x.fillText('Zertifikats-ID: ' + c.code, 140, 975);
      x.font = '400 16px ' + S; x.fillStyle = '#6b6b6b'; x.fillText('Echtheit online prüfen: QR-Code scannen.', 140, 1004);
      seal(x, W / 2 + 10, 932, 92, sig, gold);
      var qc = document.createElement('canvas'); LGQR.drawStyled(qc, verifyUrl(c), 640, logo); x.drawImage(qc, W - 130 - 215, 775, 215, 215);
      x.textAlign = 'center'; x.font = '400 16px ' + S; x.fillStyle = '#6b6b6b';
      x.fillText('Teilnahmezertifikat der Lern-App Languway German – KEIN offizielles Zertifikat, kein Goethe-, TestDaF- oder telc-Nachweis.', W / 2, 1060);
      return cv;
    });
  }
  LG.views.certificates = function () {
    var list = entries(), L = list.filter(function (e) { return e.kind === 'L'; }), S = list.filter(function (e) { return e.kind === 'S'; }), F = list.filter(function (e) { return e.kind === 'F'; });
    function card(e) { var d = describe(e.kind, e.n); return '<a class="card certitem" href="#/certificate/' + e.code + '"><div class="ic">' + ic('award') + '</div><div><b>' + esc(d.title) + '</b><span class="muted">' + e.score + ' % · ' + LG.fmtDate(e.ts) + '</span></div></a>'; }
    var h = '<p class="muted">Du erhältst ein Zertifikat für jede bestandene Stufe, jedes Niveau und für das Gesamtziel. Alle Zertifikate tragen deinen Namen, dein Ergebnis, ein Siegel und einen prüfbaren QR-Code.</p>';
    h += '<div class="card" style="margin-top:12px"><h3>Abschlusszertifikat</h3>' + (F.length ? F.map(card).join('') : '<p class="muted">Du bekommst es nach allen 30 Stufen, allen Niveauprüfungen und der Gesamtprüfung (' + (LG.allStagesDone() ? '<a href="#/exam/final">jetzt starten</a>' : 'noch nicht freigeschaltet') + ').</p>') + '</div>';
    h += '<div class="card" style="margin-top:16px"><h3>Niveauzertifikate (' + S.length + ' von 7)</h3>' + (S.length ? '<div class="grid c2">' + S.map(card).join('') + '</div>' : '<p class="muted">Noch keins – bestehe eine Abschlussprüfung.</p>') + '</div>';
    h += '<div class="card" style="margin-top:16px"><h3>Stufenzertifikate (' + L.length + ' von 30)</h3>' + (L.length ? '<div class="grid c2">' + L.map(card).join('') + '</div>' : '<p class="muted">Noch keins – bestehe deinen ersten Stufentest.</p>') + '<p class="note">Stufen, die du durch den Einstufungstest übersprungen hast, haben kein Zertifikat.</p></div>';
    return { title: 'Zertifikate', heading: 'Zertifikate', html: h };
  };
  LG.views.certificate = function (params) {
    var e = entries().filter(function (x) { return x.code === params[0]; })[0];
    if (!e) { LG.toast('Dieses Zertifikat hast du noch nicht erreicht.', true); return LG.go('/certificates'); }
    return { title: 'Zertifikat', heading: 'Zertifikat', html: '<div class="crumb"><a href="#/certificates">Zertifikate</a> › ' + esc(describe(e.kind, e.n).title) + '</div><div class="card" id="cbox"><p class="muted">Dein Zertifikat wird erstellt …</p></div>',
      mount: function (root) {
        var box = LG.$('#cbox', root);
        LG.getCert(e.kind, e.n).then(function (rec) { return drawCert(rec).then(function (cv) { show(box, rec, cv); }); }).catch(function (er) {
          box.innerHTML = '<p class="formerr">' + esc(er && er.code === 'network' ? 'Keine Internetverbindung. Zertifikate werden online ausgestellt – bitte versuche es mit Verbindung noch einmal.' : er && er.code === 'not_passed' ? 'Dieses Zertifikat ist noch nicht freigegeben.' : 'Das Zertifikat konnte nicht erstellt werden. Bitte versuche es später noch einmal.') + '</p><button class="btn" id="cretry">Erneut versuchen</button>';
          LG.$('#cretry', box).onclick = function () { LG.route(); };
        });
      } };
  };
  function show(box, c, cv) {
    var url = verifyUrl(c);
    box.innerHTML = '<div class="cert-wrap"></div><div class="row" style="margin-top:16px;flex-wrap:wrap"><button class="btn" id="c-pdf">PDF herunterladen</button><button class="btn soft" id="c-png">Bild speichern</button><button class="btn soft" id="c-print">Drucken</button><button class="btn soft" id="c-share">Teilen</button></div><p class="note" style="margin-top:14px">Zertifikats-ID: <b>' + esc(c.code) + '</b>. Die Echtheit prüft jeder online über den QR-Code oder den Link: Der Code wird in der Datenbank nachgeschlagen und gibt Name, Ergebnis und Datum zurück. Erfundene Codes existieren dort nicht.<br>Teilnahmezertifikat der App Languway German – kein Goethe-, TestDaF- oder telc-Zertifikat.</p>';
    cv.className = 'cert-canvas'; box.querySelector('.cert-wrap').appendChild(cv);
    var name = 'Languway-German-' + c.code;
    function dl(blob, fn) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000); }
    box.querySelector('#c-png').onclick = function () { cv.toBlob(function (b) { dl(b, name + '.png'); }, 'image/png'); };
    box.querySelector('#c-pdf').onclick = function () {
      var jpg = cv.toDataURL('image/jpeg', 0.92).split(',')[1], bin = atob(jpg), u8 = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      dl(new Blob([C.pdfFromJpeg(u8, cv.width, cv.height)], { type: 'application/pdf' }), name + '.pdf');
    };
    box.querySelector('#c-print').onclick = function () {
      var w = window.open('', '_blank'); if (!w) return LG.toast('Bitte erlaube Pop-ups zum Drucken.', true);
      w.document.write('<!doctype html><title>Zertifikat</title><style>@page{size:A4 landscape;margin:0}body{margin:0}img{width:100%;display:block}</style><img src="' + cv.toDataURL('image/png') + '">'); w.document.close();
      setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 600);
    };
    box.querySelector('#c-share').onclick = function () {
      var text = 'Mein Languway-German-Zertifikat: ' + url;
      function fallback() { if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { LG.toast('Prüf-Link kopiert.'); }, function () { LG.toast(url); }); else LG.toast(url); }
      if (!navigator.share) return fallback();
      cv.toBlob(function (b) {
        var f = new File([b], name + '.png', { type: 'image/png' }), data = { title: 'Languway German Zertifikat', text: text, url: url };
        if (navigator.canShare && navigator.canShare({ files: [f] })) data = { title: data.title, text: text, files: [f] };
        navigator.share(data).catch(function (e) { if (e && e.name !== 'AbortError') fallback(); });
      });
    };
  }

  /* ---------- public check: the code is looked up in the database (works without login) ---------- */
  LG.views.verify = function (params) {
    var code = String(params[0] || '');
    return { title: 'Zertifikat prüfen', bare: true, html: '<div class="auth-wrap"><div class="card" style="max-width:520px;margin:auto;text-align:center"><img src="logo-mark.png" alt="" width="80" height="80"><h2>Zertifikat prüfen</h2><div id="vres"><p class="muted">Wird geprüft …</p></div><a class="btn soft" href="#/" style="margin-top:12px">Zur Startseite</a></div></div>',
      mount: function (root) {
        var box = LG.$('#vres', root);
        LG.verifyCert(code).then(function (r) {
          if (!r || !r.ok) { box.innerHTML = '<p class="formerr">✘ Ungültig: Dieser Zertifikatscode existiert nicht.</p><p class="muted">Prüfe, ob du den Code richtig eingegeben oder den QR-Code vollständig gescannt hast.</p>'; return; }
          var d = describe(r.kind, r.n);
          box.innerHTML = '<p style="color:var(--primary);font-weight:800;font-size:20px">✔ Echtes Zertifikat</p><p>Inhaber:in: <b>' + esc(r.name) + '</b></p><p>' + esc(d.head) + ': ' + esc(d.title) + '</p><p>Ergebnis: <b>' + r.score + ' %</b></p><p>Datum: ' + esc(LG.fmtDate(r.achieved)) + '</p><p class="muted">Zertifikats-ID: ' + esc(r.code) + '</p>';
        }).catch(function () { box.innerHTML = '<p class="formerr">Keine Verbindung zum Prüfdienst. Bitte versuche es später noch einmal.</p>'; });
      } };
  };
})();
