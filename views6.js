/* Languway German – views part 6: settings (accordion sections), install, share, notifications */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, esc = LG.esc, ic = LG.ic, S = LG.settings;
  Object.keys({ goal: 50, notif: false, notifTime: '18:00', nDue: true, nStreak: true, nGoal: true, fontSize: 'm', calm: false, lastNotif: '' }).forEach(function (k) {
    var d = { goal: 50, notif: false, notifTime: '18:00', nDue: true, nStreak: true, nGoal: true, fontSize: 'm', calm: false, lastNotif: '' }; if (S[k] === undefined) S[k] = d[k];
  });
  function applyLook() {
    var h = document.documentElement; h.style.fontSize = { s: '15px', m: '', l: '18px' }[S.fontSize] || ''; h.classList.toggle('calm', !!S.calm);
  }
  applyLook();

  /* ---------- install (PWA) ---------- */
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; var b = document.getElementById('s-install'); if (b) b.hidden = false; });
  window.addEventListener('appinstalled', function () { deferred = null; LG.toast('Die App wurde installiert.'); var b = document.getElementById('s-install'); if (b) b.hidden = true; });
  function standalone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  LG.installApp = function () {
    if (!deferred) { LG.toast('Folge der Anleitung unten für dein Gerät.'); return; }
    deferred.prompt(); deferred.userChoice.then(function () { deferred = null; var b = document.getElementById('s-install'); if (b) b.hidden = true; });
  };

  /* ---------- notifications (only work while the app is open: there is no server to push) ---------- */
  LG.notifSupported = function () { return 'Notification' in window; };
  LG.notify = function (title, body) {
    if (!LG.notifSupported() || Notification.permission !== 'granted') return false;
    var opt = { body: body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'lg-reminder' };
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) navigator.serviceWorker.getRegistration().then(function (r) { if (r && r.showNotification) r.showNotification(title, opt); else new Notification(title, opt); }).catch(function () { try { new Notification(title, opt); } catch (e) {} });
    else try { new Notification(title, opt); } catch (e) {}
    return true;
  };
  function dailyMessage() {
    var due = LG.dueWords().length, xp = (LG.pg.todayXP || {})[LG.today()] || 0, st = LG.streak();
    if (S.nDue && due > 0) return ['Wörter wiederholen', due + ' Wörter warten auf deine Wiederholung. Nur ein paar Minuten!'];
    if (S.nStreak && st > 0 && xp === 0) return ['Deine Serie wartet', 'Lerne heute kurz, damit deine Serie von ' + st + ' Tagen nicht endet.'];
    if (S.nGoal && xp < (S.goal || 50)) return ['Tagesziel', 'Dir fehlen noch ' + ((S.goal || 50) - xp) + ' XP für dein Tagesziel.'];
    return null;
  }
  function tick() {
    if (!S.notif || !LG.S.user || !LG.notifSupported() || Notification.permission !== 'granted') return;
    var now = new Date(), hm = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2), t = LG.today();
    if (hm >= (S.notifTime || '18:00') && S.lastNotif !== t + ':' + LG.S.user.username) {
      var m = dailyMessage(); LG.setSetting('lastNotif', t + ':' + LG.S.user.username); if (m) LG.notify(m[0], m[1]);
    }
  }
  setInterval(tick, 60000); setTimeout(tick, 5000);

  /* ---------- share ---------- */
  function siteUrl() { return location.href.split('#')[0].replace(/index\.html$/, ''); }
  function shareText() { return 'Languway German – Deutsch lernen von Pre-A1 bis C2, kostenlos: ' + siteUrl(); }

  /* ---------- accordion section helper ---------- */
  function sec(id, icon, title, sub, body, open) {
    return '<details class="acc" id="acc-' + id + '"' + (open ? ' open' : '') + '><summary><span class="acc__ic">' + ic(icon) + '</span><span class="acc__t"><b>' + title + '</b><small>' + sub + '</small></span><span class="acc__ch">' + ic('chevron') + '</span></summary><div class="acc__b">' + body + '</div></details>';
  }
  function sw(id, label, desc, on) {
    return '<div class="setrow"><div><b>' + label + '</b>' + (desc ? '<div class="muted" style="font-size:13px">' + desc + '</div>' : '') + '</div><button class="switchbtn' + (on ? ' on' : '') + '" id="' + id + '" role="switch" aria-checked="' + !!on + '" aria-label="' + esc(label) + '"></button></div>';
  }
  function bindSwitch(root, id, key, msgOn, msgOff, after) {
    var b = LG.$('#' + id, root); if (!b) return;
    b.onclick = function () { var on = !LG.settings[key]; LG.setSetting(key, on); b.classList.toggle('on', on); b.setAttribute('aria-checked', on); if (msgOn) LG.toast(on ? msgOn : msgOff); if (after) after(on); };
  }

  LG.views.settings = function (params, q) {
    var u = LG.S.user, open = (q && q.get('open')) || '';
    var notifState = !LG.notifSupported() ? 'Dein Browser unterstützt keine Benachrichtigungen.' : Notification.permission === 'granted' ? 'Erlaubt ✔' : Notification.permission === 'denied' ? 'Blockiert – erlaube sie in den Browser-Einstellungen der Seite.' : 'Noch nicht erlaubt';
    var how =
      '<div class="how"><h4>Android (Chrome)</h4><ol><li>Öffne die Seite in Chrome.</li><li>Tippe auf „App installieren“ oben – oder auf ⋮ → „App installieren“ / „Zum Startbildschirm“.</li><li>Bestätige. Das Symbol erscheint auf deinem Startbildschirm.</li></ol>' +
      '<h4>iPhone / iPad (Safari)</h4><ol><li>Öffne die Seite in <b>Safari</b> (nicht in einem anderen Browser).</li><li>Tippe auf „Teilen“ (Quadrat mit Pfeil nach oben).</li><li>Wähle „Zum Home-Bildschirm“ und dann „Hinzufügen“.</li></ol>' +
      '<h4>Computer (Chrome / Edge)</h4><ol><li>Klicke in der Adressleiste auf das Installations-Symbol (Monitor mit Pfeil) – oder auf „App installieren“ oben.</li><li>Bestätige mit „Installieren“. Die App öffnet sich in einem eigenen Fenster.</li></ol>' +
      '<p class="muted" style="font-size:13px">Nach der Installation startet die App wie eine normale App, auch ohne Internet (außer für den KI-Tutor).</p></div>';
    var html =
      '<p class="muted" style="margin-bottom:12px">Tippe auf einen Bereich, um ihn zu öffnen.</p>' +
      sec('look', 'sun', 'Darstellung', 'Tag/Nacht, Schriftgröße, Animationen',
        '<div class="setrow"><div><b>Tag- und Nachtmodus</b><div class="muted" style="font-size:13px">Wird auf diesem Gerät gespeichert.</div></div><button class="dn" data-act="theme" aria-label="Tag- und Nachtmodus wechseln"><span class="stars"></span><span class="cloud"></span><span class="knob"></span></button></div>' +
        '<div class="setrow"><label for="s-fs"><b>Schriftgröße</b></label><select id="s-fs"><option value="s">Klein</option><option value="m">Normal</option><option value="l">Groß</option></select></div>' +
        sw('s-calm', 'Weniger Animationen', 'Schaltet Konfetti und Bewegungen aus.', S.calm), open === 'look') +
      sec('audio', 'speaker', 'Sprache und Hören', 'Geschwindigkeit und Stimme',
        '<div class="setrow"><label for="s-rate"><b>Sprechgeschwindigkeit</b><div class="muted" style="font-size:13px" id="s-ratev"></div></label><input type="range" id="s-rate" min="0.5" max="1.2" step="0.05" value="' + S.rate + '"></div>' +
        '<div class="setrow"><label for="s-voice"><b>Deutsche Stimme</b><div class="muted" style="font-size:13px" id="s-voicen"></div></label><select id="s-voice"></select></div>' +
        '<div class="setrow"><span></span><button class="btn sm soft" id="s-test">' + ic('speaker') + ' Stimme testen</button></div>', open === 'audio') +
      sec('learn', 'target', 'Lernen', 'Tagesziel und Hinweise',
        '<div class="setrow"><label for="s-goal"><b>Tagesziel</b><div class="muted" style="font-size:13px">Wie viele XP willst du pro Tag sammeln?</div></label><select id="s-goal"><option value="20">20 XP – leicht</option><option value="50">50 XP – normal</option><option value="100">100 XP – intensiv</option><option value="200">200 XP – Profi</option></select></div>' +
        sw('s-rem', 'Hinweise beim Öffnen', 'Zeigt beim Start, wenn Wörter fällig sind oder die nächste Lektion wartet.', S.reminders), open === 'learn') +
      sec('notif', 'bell', 'Benachrichtigungen', 'Erinnerungen auf deinem Gerät',
        '<p class="muted" style="font-size:14px">Status: <b id="s-nst">' + notifState + '</b></p>' +
        '<div class="setrow"><span></span><button class="btn sm" id="s-nperm">Benachrichtigungen erlauben</button></div>' +
        sw('s-notif', 'Tägliche Erinnerung', 'Eine Nachricht pro Tag zur gewählten Uhrzeit.', S.notif) +
        '<div class="setrow"><label for="s-ntime"><b>Uhrzeit</b></label><input type="time" id="s-ntime" value="' + esc(S.notifTime) + '"></div>' +
        sw('s-ndue', 'Fällige Wörter', 'Erinnert an Wörter zur Wiederholung.', S.nDue) +
        sw('s-nstreak', 'Serie retten', 'Warnt, wenn deine Tagesserie endet.', S.nStreak) +
        sw('s-ngoal', 'Tagesziel', 'Erinnert an dein Tagesziel.', S.nGoal) +
        '<div class="setrow"><span></span><button class="btn sm soft" id="s-ntest">Test-Nachricht senden</button></div>' +
        '<p class="note">Ehrlicher Hinweis: Ohne Server kann die App keine Nachrichten senden, wenn sie komplett geschlossen ist. Erinnerungen kommen, solange die App oder der Browser-Tab im Hintergrund geöffnet ist (installiert ist das am zuverlässigsten).</p>', open === 'notif') +
      sec('ai', 'bulb', 'KI-Tutor', 'Dein API-Schlüssel',
        '<p class="muted" style="font-size:14px">Der Tutor erklärt Grammatik und Fehler auf Deutsch und Englisch. Er nutzt deinen eigenen Anthropic-API-Schlüssel (console.anthropic.com). Der Schlüssel wird nur auf diesem Gerät gespeichert und nur an api.anthropic.com gesendet. Ohne Schlüssel gibt es die eingebauten Erklärungen.</p><div class="setrow"><label for="s-key"><b>API-Schlüssel</b></label><input type="password" id="s-key" dir="ltr" placeholder="sk-ant-…" autocomplete="off" value="' + esc(S.apiKey || '') + '" style="flex:1;min-width:0"></div><div class="setrow"><span class="muted" id="s-keyst" style="font-size:13px"></span><button class="btn sm soft" id="s-keysave">Speichern</button></div>', open === 'ai') +
      sec('install', 'download', 'App installieren', standalone() ? 'Schon installiert ✔' : 'Auf den Startbildschirm',
        '<div class="setrow"><div><b>Als App installieren</b><div class="muted" style="font-size:13px">Eigenes Symbol, Vollbild und schneller Start.</div></div><button class="btn sm" id="s-install"' + (deferred && !standalone() ? '' : ' hidden') + '>' + ic('download') + ' Installieren</button></div>' + (standalone() ? '<p class="note">Du nutzt die App bereits im installierten Modus.</p>' : '') + how, open === 'install') +
      sec('share', 'share', 'Teilen', 'Link, QR-Code und Nachrichten',
        '<p class="muted" style="font-size:14px">Empfiehl Languway German deinen Freunden.</p><div class="shareqr"><canvas id="s-qr" width="300" height="300" aria-label="QR-Code zur Website"></canvas></div>' +
        '<div class="row" style="flex-wrap:wrap;justify-content:center;margin-top:10px"><button class="btn sm" id="s-share">' + ic('share') + ' Teilen</button><button class="btn sm soft" id="s-copy">Link kopieren</button><button class="btn sm soft" id="s-qrdl">QR speichern</button></div>' +
        '<div class="row" style="flex-wrap:wrap;justify-content:center;margin-top:8px"><a class="btn sm soft" target="_blank" rel="noopener" id="s-wa">WhatsApp</a><a class="btn sm soft" target="_blank" rel="noopener" id="s-tg">Telegram</a><a class="btn sm soft" id="s-mail">E-Mail</a></div>', open === 'share') +
      sec('acct', 'user', 'Konto', esc(u.name) + ' · @' + esc(u.username),
        '<div class="setrow"><div><b>' + esc(u.name) + '</b><div class="muted" style="font-size:13px">@' + esc(u.username) + '</div></div><button class="btn sm" data-act="logout">Abmelden</button></div>' +
        '<div class="setrow"><div><b>Passwort ändern</b></div><button class="btn sm soft" data-act="chpw">Ändern</button></div>' +
        '<div class="setrow"><div><b>Fortschritt zurücksetzen</b><div class="muted" style="font-size:13px">Beginnt den Kurs neu mit dem Einstufungstest. Bereits ausgestellte Zertifikate bleiben gültig.</div></div><button class="btn sm danger" data-act="resetpg">Zurücksetzen</button></div>' +
        '<div class="setrow"><div><b>Konto löschen</b><div class="muted" style="font-size:13px">Löscht dein Konto und deinen gesamten Fortschritt endgültig.</div></div><button class="btn sm danger" data-act="delacc">Löschen</button></div>', open === 'acct') +
      sec('about', 'info', 'Über die App', 'Version, Datenschutz, Hilfe',
        '<p><b>Languway German</b> · Part of the Languway Series<br><span class="muted">Version 2.0 · 30 Stufen von Pre-A1 bis C2</span></p><p class="muted" style="font-size:14px">Datenschutz: Dein Konto und dein Fortschritt werden verschlüsselt übertragen und in deiner Languway-Datenbank gespeichert (Passwörter nur als Hash). Keine Werbung, kein Tracking. Nur wenn du den KI-Tutor mit deinem Schlüssel nutzt, wird deine Frage an Anthropic gesendet.</p><p class="muted" style="font-size:14px">Die Zertifikate sind Teilnahmezertifikate dieser Lern-App und kein offizieller Nachweis (Goethe, TestDaF, telc).</p>', open === 'about');
    return { title: 'Einstellungen', heading: 'Einstellungen', html: '<div class="accs">' + html + '</div>', mount: mount };
  };

  function mount(root) {
    // only one section open at a time
    LG.$$('details.acc', root).forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) LG.$$('details.acc', root).forEach(function (o) { if (o !== d) o.open = false; }); }); });
    var fs = LG.$('#s-fs', root); fs.value = S.fontSize; fs.onchange = function () { LG.setSetting('fontSize', fs.value); applyLook(); };
    bindSwitch(root, 's-calm', 'calm', 'Animationen reduziert.', 'Animationen an.', applyLook);
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
    var goal = LG.$('#s-goal', root); goal.value = String(S.goal); goal.onchange = function () { LG.setSetting('goal', +goal.value); LG.toast('Tagesziel: ' + goal.value + ' XP'); };
    bindSwitch(root, 's-rem', 'reminders', 'Hinweise sind an.', 'Hinweise sind aus.');
    // notifications
    var nst = LG.$('#s-nst', root);
    LG.$('#s-nperm', root).onclick = function () {
      if (!LG.notifSupported()) return LG.toast('Dieser Browser unterstützt keine Benachrichtigungen.', true);
      Notification.requestPermission().then(function (p) { nst.textContent = p === 'granted' ? 'Erlaubt ✔' : p === 'denied' ? 'Blockiert – erlaube sie in den Browser-Einstellungen der Seite.' : 'Noch nicht erlaubt'; if (p === 'granted') { LG.setSetting('notif', true); LG.$('#s-notif', root).classList.add('on'); LG.toast('Benachrichtigungen erlaubt.'); } });
    };
    bindSwitch(root, 's-notif', 'notif', 'Tägliche Erinnerung ist an.', 'Tägliche Erinnerung ist aus.', function (on) { if (on && LG.notifSupported() && Notification.permission === 'default') Notification.requestPermission().then(function (p) { nst.textContent = p === 'granted' ? 'Erlaubt ✔' : 'Noch nicht erlaubt'; }); });
    LG.$('#s-ntime', root).onchange = function (e) { LG.setSetting('notifTime', e.target.value || '18:00'); LG.setSetting('lastNotif', ''); LG.toast('Uhrzeit gespeichert.'); };
    bindSwitch(root, 's-ndue', 'nDue'); bindSwitch(root, 's-nstreak', 'nStreak'); bindSwitch(root, 's-ngoal', 'nGoal');
    LG.$('#s-ntest', root).onclick = function () {
      if (!LG.notifSupported() || Notification.permission !== 'granted') return LG.toast('Erlaube zuerst Benachrichtigungen.', true);
      LG.notify('Languway German', 'So sieht deine Erinnerung aus. Viel Erfolg beim Lernen!'); LG.toast('Test-Nachricht gesendet.');
    };
    // AI
    var kst = LG.$('#s-keyst', root); function keyst() { kst.textContent = LG.settings.apiKey ? 'Schlüssel gespeichert (nur auf diesem Gerät).' : 'Kein Schlüssel – eingebaute Erklärungen werden genutzt.'; } keyst();
    LG.$('#s-keysave', root).onclick = function () { LG.setSetting('apiKey', LG.$('#s-key', root).value.trim()); keyst(); LG.toast('Gespeichert.'); };
    // install
    LG.$('#s-install', root).onclick = LG.installApp;
    // share
    var url = siteUrl(), cv = LG.$('#s-qr', root), logo = new Image();
    logo.onload = function () { try { LGQR.drawStyled(cv, url, 600, logo); } catch (e) {} }; logo.src = 'logo-mark.png';
    try { LGQR.drawStyled(cv, url, 600, null); } catch (e) {}
    LG.$('#s-share', root).onclick = function () {
      if (navigator.share) navigator.share({ title: 'Languway German', text: shareText(), url: url }).catch(function () {});
      else copy();
    };
    function copy() { if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { LG.toast('Link kopiert.'); }, function () { LG.toast(url); }); else LG.toast(url); }
    LG.$('#s-copy', root).onclick = copy;
    LG.$('#s-qrdl', root).onclick = function () { cv.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'language-german-qr.png'; document.body.appendChild(a); a.click(); a.remove(); }); };
    LG.$('#s-wa', root).href = 'https://wa.me/?text=' + encodeURIComponent(shareText());
    LG.$('#s-tg', root).href = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent('Languway German – Deutsch lernen');
    LG.$('#s-mail', root).href = 'mailto:?subject=' + encodeURIComponent('Languway German') + '&body=' + encodeURIComponent(shareText());
  }

  LG.act.resetpg = function () {
    LG.confirm('Fortschritt zurücksetzen?', 'Alle Stufen, XP, Zertifikate und Wörter werden gelöscht. Dein Konto bleibt bestehen.', 'Zurücksetzen', true).then(function (ok) {
      if (!ok) return; LG.pg = C.emptyProgress(); LG.save(true); LG.toast('Fortschritt zurückgesetzt.'); LG.go('/placement');
    });
  };
})();
