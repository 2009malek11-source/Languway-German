/* Language German – views part 4: profile, settings, certificate, public certificate check */
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
  LG.views.settings = function () {
    var s = LG.settings, u = LG.S.user;
    return { title: 'Einstellungen', heading: 'Einstellungen', html:
      '<div class="card"><h3>Darstellung</h3><div class="setrow"><div><b>Tag- und Nachtmodus</b><div class="muted" style="font-size:13px">Wird auf diesem Gerät gespeichert.</div></div><button class="dn" data-act="theme" aria-label="Tag- und Nachtmodus wechseln"><span class="stars"></span><span class="cloud"></span><span class="knob"></span></button></div></div>' +
      '<div class="card" style="margin-top:16px"><h3>Sprache und Hören</h3>' +
      '<div class="setrow"><label for="s-rate"><b>Sprechgeschwindigkeit</b><div class="muted" style="font-size:13px" id="s-ratev"></div></label><input type="range" id="s-rate" min="0.5" max="1.2" step="0.05" value="' + s.rate + '"></div>' +
      '<div class="setrow"><label for="s-voice"><b>Deutsche Stimme</b><div class="muted" style="font-size:13px" id="s-voicen"></div></label><select id="s-voice"></select></div>' +
      '<div class="setrow"><span></span><button class="btn sm soft" id="s-test">' + ic('speaker') + ' Stimme testen</button></div></div>' +
      '<div class="card" style="margin-top:16px"><h3>Erinnerungen</h3><div class="setrow"><div><b>Lern-Erinnerungen in der App</b><div class="muted" style="font-size:13px">Beim Öffnen zeigt dir die App, wenn Wörter zur Wiederholung fällig sind oder die nächste Lektion wartet.</div></div><button class="switchbtn' + (s.reminders ? ' on' : '') + '" id="s-rem" role="switch" aria-checked="' + !!s.reminders + '" aria-label="Erinnerungen"></button></div></div>' +
      '<div class="card" style="margin-top:16px"><h3>KI-Tutor</h3><p class="muted" style="font-size:14px">Der Tutor erklärt Grammatik und Fehler auf Deutsch und Englisch. Er nutzt deinen eigenen Anthropic-API-Schlüssel (console.anthropic.com). Der Schlüssel wird nur auf diesem Gerät gespeichert und nur an api.anthropic.com gesendet – niemals an uns. Ohne Schlüssel gibt es die eingebauten Erklärungen.</p><div class="setrow"><label for="s-key"><b>API-Schlüssel</b></label><input type="password" id="s-key" dir="ltr" placeholder="sk-ant-…" autocomplete="off" value="' + esc(LG.settings.apiKey || '') + '" style="flex:1;min-width:0"></div><div class="setrow"><span class="muted" id="s-keyst" style="font-size:13px"></span><button class="btn sm soft" id="s-keysave">Speichern</button></div></div>' +
      '<div class="card" style="margin-top:16px"><h3>Sicherung und Gerätewechsel</h3><p class="muted" style="font-size:14px">Dein Konto und dein Fortschritt liegen nur in diesem Browser (kein Server). Lade eine Sicherungsdatei herunter, um sie auf einem anderen Gerät wiederherzustellen oder um Datenverlust (z. B. beim Löschen der Browserdaten) vorzubeugen.</p><div class="row"><button class="btn sm" id="s-bk">Sicherung herunterladen</button><button class="btn sm soft" id="s-bkr">Sicherung einlesen</button><input type="file" id="s-bkf" accept=".json,application/json" hidden></div></div>' +
      '<div class="card" style="margin-top:16px"><h3>Konto</h3><div class="setrow"><div><b>' + esc(u.name) + '</b><div class="muted" style="font-size:13px">@' + esc(u.username) + '</div></div><button class="btn sm" data-act="logout">Abmelden</button></div>' +
      '<div class="setrow"><div><b>Passwort ändern</b></div><button class="btn sm soft" data-act="chpw">Ändern</button></div>' +
      '<div class="setrow"><div><b>Konto löschen</b><div class="muted" style="font-size:13px">Löscht dein Konto und deinen gesamten Fortschritt endgültig. Danach ist keine Anmeldung mehr möglich.</div></div><button class="btn sm danger" data-act="delacc">Löschen</button></div></div>',
      mount: function (root) {
        var rate = LG.$('#s-rate', root), rv = LG.$('#s-ratev', root), sel = LG.$('#s-voice', root), vn = LG.$('#s-voicen', root);
        function lab() { rv.textContent = 'Aktuell: ' + Number(LG.settings.rate).toFixed(2) + '×'; } lab();
        rate.oninput = function () { LG.setSetting('rate', parseFloat(rate.value)); lab(); };
        function voices() {
          var vs = ('speechSynthesis' in window) ? speechSynthesis.getVoices().filter(function (v) { return /^de/i.test(v.lang); }) : [];
          if (!vs.length) { sel.innerHTML = '<option>Keine deutsche Stimme gefunden</option>'; sel.disabled = true; vn.textContent = 'Dein Gerät bietet keine deutsche Sprachausgabe an. Installiere in den Systemeinstellungen eine deutsche Stimme.'; return; }
          sel.disabled = false; vn.textContent = vs.length + ' Stimme(n) auf diesem Gerät';
          sel.innerHTML = '<option value="">Automatisch</option>' + vs.map(function (v) { return '<option value="' + esc(v.name) + '"' + (v.name === LG.settings.voice ? ' selected' : '') + '>' + esc(v.name) + ' (' + esc(v.lang) + ')</option>'; }).join('');
        }
        voices(); if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = voices;
        sel.onchange = function () { LG.setSetting('voice', sel.value); };
        LG.$('#s-test', root).onclick = function () { LG.speak('Guten Tag! Ich freue mich, Deutsch zu lernen.', { rate: LG.settings.rate }); };
        var kst = LG.$('#s-keyst', root); function keyst() { kst.textContent = LG.settings.apiKey ? 'Schlüssel gespeichert (nur auf diesem Gerät).' : 'Kein Schlüssel – eingebaute Erklärungen werden genutzt.'; } keyst();
        LG.$('#s-keysave', root).onclick = function () { LG.setSetting('apiKey', LG.$('#s-key', root).value.trim()); keyst(); LG.toast('Gespeichert.'); };
        LG.$('#s-bk', root).onclick = function () { var b = new Blob([LG.exportBackup()], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'language-german-backup-' + LG.S.user.username + '.json'; document.body.appendChild(a); a.click(); a.remove(); LG.toast('Sicherung heruntergeladen.'); };
        LG.$('#s-bkr', root).onclick = function () { LG.$('#s-bkf', root).click(); };
        LG.$('#s-bkf', root).onchange = function (ev) { var f = ev.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { try { var u = LG.importBackup(String(r.result)); if (u === LG.S.user.username) { LG.pg = Object.assign(C.emptyProgress(), LG.lsGet('lg.pg.' + u, {})); LG.toast('Sicherung eingelesen.'); LG.route(); } else LG.toast('Sicherung für „' + u + '“ eingelesen. Du kannst dich jetzt mit diesem Konto anmelden.'); } catch (e) { LG.toast('Diese Sicherungsdatei ist ungültig.', true); } }; r.readAsText(f); ev.target.value = ''; };
        var rem = LG.$('#s-rem', root); rem.onclick = function () { var on = !LG.settings.reminders; LG.setSetting('reminders', on); rem.classList.toggle('on', on); rem.setAttribute('aria-checked', on); LG.toast(on ? 'Erinnerungen sind an.' : 'Erinnerungen sind aus.'); };
      } };
  };
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
  var SEAL_KEY = ['LG', 'DE', 'seal', 'v1', 'Languway'].join('|');
  function b64u(str) { return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64u(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; return decodeURIComponent(escape(atob(t))); }
  function sigOf(payload) { var h = LG.hmac(SEAL_KEY, payload), o = ''; for (var i = 0; i < 12; i++) o += ('0' + h[i].toString(16)).slice(-2); return o; }
  function certCode(sig) { var s = sig.toUpperCase(); return 'LG-' + s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8, 12); }
  function token(c) { var p = [c.kind, c.n, c.name, c.score, c.ts].join('~'), sg = sigOf(p); return b64u(p) + '.' + sg; }
  function parseToken(t) {
    var i = t.lastIndexOf('.'); if (i < 1) return null;
    try { var p = unb64u(t.slice(0, i)), f = p.split('~'); if (f.length !== 5 || sigOf(p) !== t.slice(i + 1)) return null; return { kind: f[0], n: +f[1], name: f[2], score: +f[3], ts: +f[4], sig: t.slice(i + 1) }; } catch (e) { return null; }
  }
  function verifyUrl(c) { return location.href.split('#')[0] + '#/verify/' + token(c); }
  function describe(kind, n) {
    if (kind === 'L') { var lv = D.LEVELS[n - 1]; return { head: 'Stufenzertifikat', title: 'Stufe ' + n + ' · ' + lv.t, sub: 'Niveau ' + lv.c }; }
    if (kind === 'S') return { head: 'Niveauzertifikat', title: 'Niveau ' + C.STAGES[n - 1], sub: 'Stufen ' + C.RANGES[n - 1][1] + '–' + C.RANGES[n - 1][2] };
    return { head: 'Abschlusszertifikat', title: 'Language German · 30 Stufen', sub: 'Pre-A1 bis C2 · Gesamtprüfung bestanden' };
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
    x.fillText('LANGUAGE', 0, -R * .06); x.fillText('GERMAN', 0, R * .16);
    var txt = ('★ ZERTIFIZIERT ★ ' + sig.toUpperCase() + ' ').repeat(2), n = txt.length; x.font = '600 ' + Math.round(R * .085) + 'px monospace';
    for (var q = 0; q < n; q++) { var aa = q / n * Math.PI * 2 - Math.PI / 2; x.save(); x.rotate(aa); x.translate(0, -R * .84); x.fillText(txt[q], 0, 0); x.restore(); }
    x.restore();
  }
  function drawCert(c) {
    var W = 1600, H = 1131, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var x = cv.getContext('2d'), d = describe(c.kind, c.n), gold = c.kind === 'F';
    var sig = sigOf([c.kind, c.n, c.name, c.score, c.ts].join('~'));
    return loadImg('logo-mark.png').then(function (logo) {
      var F = 'Georgia, "Times New Roman", serif', S = 'system-ui, "Segoe UI", Arial, sans-serif', main = gold ? '#8a6410' : '#16865B', dark = gold ? '#5b3d06' : '#0D6042';
      x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
      var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, gold ? '#fffaf0' : '#F3FAF6'); g.addColorStop(1, '#ffffff'); x.fillStyle = g; x.fillRect(30, 30, W - 60, H - 60);
      x.strokeStyle = main; x.lineWidth = 14; x.strokeRect(30, 30, W - 60, H - 60); x.strokeStyle = gold ? '#e8cf86' : '#B7E4CC'; x.lineWidth = 4; x.strokeRect(58, 58, W - 116, H - 116);
      x.textAlign = 'center';
      if (logo) x.drawImage(logo, W / 2 - 50, 95, 100, 100);
      x.font = '700 28px ' + S; x.fillStyle = main; x.fillText('LANGUAGE GERMAN', W / 2, 232); x.font = '500 19px ' + S; x.fillStyle = '#5a7a6b'; x.fillText('Part of the Languway Series', W / 2, 262);
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
      x.fillText('Datum: ' + LG.fmtDate(c.ts), 140, 905); x.fillText('Lernzeit insgesamt: ' + LG.hm(LG.pg.minutes), 140, 940);
      x.font = '700 22px ' + S; x.fillText('Zertifikats-ID: ' + certCode(sig), 140, 975);
      x.font = '400 16px ' + S; x.fillStyle = '#6b6b6b'; x.fillText('Echtheit prüfen: QR-Code scannen.', 140, 1004);
      seal(x, W / 2 + 10, 932, 92, sig, gold);
      var qc = document.createElement('canvas'); LGQR.draw(qc, verifyUrl(c), 4, 2); x.drawImage(qc, W - 140 - 170, 800, 170, 170);
      x.textAlign = 'center'; x.font = '400 16px ' + S; x.fillStyle = '#6b6b6b';
      x.fillText('Teilnahmezertifikat der Lern-App Language German – KEIN offizielles Zertifikat, kein Goethe-, TestDaF- oder telc-Nachweis.', W / 2, 1060);
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
      mount: function (root) { var box = LG.$('#cbox', root); drawCert(e).then(function (cv) { show(box, e, cv); }); } };
  };
  function show(box, c, cv) {
    var url = verifyUrl(c), sig = sigOf([c.kind, c.n, c.name, c.score, c.ts].join('~'));
    box.innerHTML = '<div class="cert-wrap"></div><div class="row" style="margin-top:16px;flex-wrap:wrap"><button class="btn" id="c-pdf">PDF herunterladen</button><button class="btn soft" id="c-png">Bild speichern</button><button class="btn soft" id="c-print">Drucken</button><button class="btn soft" id="c-share">Teilen</button></div><p class="note" style="margin-top:14px">Zertifikats-ID: <b>' + esc(certCode(sig)) + '</b>. Die Echtheit prüfst du über den QR-Code oder den Link. Name, Ergebnis und Datum sind durch eine Signatur geschützt: Wird eines davon verändert, schlägt die Prüfung fehl.<br>Teilnahmezertifikat der App Language German – kein Goethe-, TestDaF- oder telc-Zertifikat.</p>';
    cv.className = 'cert-canvas'; box.querySelector('.cert-wrap').appendChild(cv);
    var name = 'Language-German-' + c.code;
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
      var text = 'Mein Language-German-Zertifikat: ' + url;
      function fallback() { if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { LG.toast('Prüf-Link kopiert.'); }, function () { LG.toast(url); }); else LG.toast(url); }
      if (!navigator.share) return fallback();
      cv.toBlob(function (b) {
        var f = new File([b], name + '.png', { type: 'image/png' }), data = { title: 'Language German Zertifikat', text: text, url: url };
        if (navigator.canShare && navigator.canShare({ files: [f] })) data = { title: data.title, text: text, files: [f] };
        navigator.share(data).catch(function (e) { if (e && e.name !== 'AbortError') fallback(); });
      });
    };
  }

  /* ---------- public check (works without login and without server) ---------- */
  LG.views.verify = function (params) {
    var r = parseToken(params[0]), body;
    if (!r) body = '<p class="formerr">✘ Ungültig: Der Prüfcode ist beschädigt oder wurde verändert.</p>';
    else { var d = describe(r.kind, r.n); body = '<p style="color:var(--primary);font-weight:800;font-size:20px">✔ Signatur gültig</p><p>Inhaber:in: <b>' + esc(r.name) + '</b></p><p>' + esc(d.head) + ': ' + esc(d.title) + '</p><p>Ergebnis: <b>' + r.score + ' %</b></p><p>Ausgestellt am: ' + LG.fmtDate(r.ts) + '</p><p dir="ltr" class="muted">' + esc(certCode(r.sig)) + '</p><p class="note">Die Signatur beweist, dass Name, Ergebnis und Datum nicht nachträglich verändert wurden. Teilnahmezertifikat der App Language German – kein Goethe-, TestDaF- oder telc-Zertifikat.</p>'; }
    return { title: 'Zertifikat prüfen', bare: true, html: '<div class="auth-wrap"><div class="card" style="max-width:520px;margin:auto;text-align:center"><img src="logo-mark.png" alt="" width="80" height="80"><h2>Zertifikat prüfen</h2>' + body + '<a class="btn soft" href="#/" style="margin-top:12px">Zur Startseite</a></div></div>' };
  };
})();
