/* Languway German – views part 1: landing, accounts, dashboard, levels, lessons */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, D = LG.D, P = LG.P, esc = LG.esc, ic = LG.ic;
  var STAGES = [['Pre-A1', 'Starter', 'Alphabet und Zahlen'], ['A1', 'Beginner', 'Erste Schritte'], ['A2', 'Elementary', 'Grundlagen'], ['B1', 'Intermediate', 'Mittelstufe'], ['B2', 'Upper Intermediate', 'Gehobene Mittelstufe'], ['C1', 'Advanced', 'Fortgeschritten'], ['C2', 'Proficiency', 'Meisterstufe']];
  var STEPS = [['intro', 'bulb', 'Einführung'], ['vocab', 'book', 'Wortschatz'], ['grammar', 'pencil', 'Grammatik'], ['listen', 'phones', 'Hören'], ['speak', 'mic', 'Sprechen'], ['read', 'eye', 'Lesen'], ['write', 'pencil', 'Schreiben'], ['practice', 'target', 'Übung']];
  LG.STAGES = STAGES; LG.STEPS = STEPS; var RANGES = C.RANGES;
  LG.lvTitle = function (n) { return D.LEVELS[n - 1].t; };
  function pct() { return Math.round(LG.passedCount() / 30 * 100); }
  function stepDone(n, s) { return !!LG.pg.done['L' + n + ':' + s]; }
  function nextStep(n) { for (var i = 0; i < STEPS.length; i++) if (!stepDone(n, STEPS[i][0])) return STEPS[i][0]; return 'test'; }
  LG.markStep = function (n, s) { var sk = { vocab: 'vocab', grammar: 'grammar', listen: 'listen', speak: 'speak', read: 'read', write: 'write', practice: 'practice' }[s]; if (sk) LG.markSkill(sk); if (!LG.pg.done['L' + n + ':' + s]) { LG.pg.done['L' + n + ':' + s] = true; LG.addXP(10); LG.save(); } };
  function ring(p) { var c = 2 * Math.PI * 36; return '<svg class="pring" viewBox="0 0 80 80"><circle class="bg" cx="40" cy="40" r="36"/><circle class="fg" cx="40" cy="40" r="36" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - p / 100)).toFixed(1) + '"/></svg>'; }
  function hm(min) { min = Math.round(min); return min < 60 ? min + ' Min.' : Math.floor(min / 60) + ' Std. ' + (min % 60) + ' Min.'; }
  LG.hm = hm;

  /* ---------- landing / dashboard ---------- */
  LG.views.home = function () { return LG.S.user ? dashboard() : landing(); };

  function landing() {
    var feats = [['eye', 'Lesen', 'Texte für jede Stufe mit Verständnisfragen – von „Hallo, ich bin Lena“ bis zu wissenschaftlichen Artikeln.'], ['pencil', 'Schreiben', 'Schreibaufgaben mit Hinweisen, damit du Sätze und Absätze sicher formulierst.'], ['bulb', 'Grammatik', 'Regeln Schritt für Schritt erklärt, mit richtigen Beispielen und Übungen.'], ['book', 'Wortschatz', 'Wörter mit Artikel (der, die, das), Plural, Bedeutung, Definition und Beispielsatz.'], ['phones', 'Hören & Sprechen', 'Dialoge anhören, Tempo wählen, Sätze nachsprechen und mit dem Mikrofon üben.'], ['globe', 'Übersetzer', 'Deutsch ⇄ Englisch mit Definitionen in beiden Sprachen, Artikeln und Verbformen.']];
    var how = ['Erstelle dein Konto mit Namen, Benutzernamen und Passwort.', 'Mache den Einstufungstest mit 30 Fragen – oder starte ohne Vorkenntnisse beim Alphabet.', 'Lerne in 30 Stufen von leicht bis schwer: Buchstaben, Zahlen, Wörter, Sätze, Lesen, Schreiben, Hören, Sprechen.', 'Bestehe Stufentests (75 %) und Niveauprüfungen. Spaced Repetition, XP und Tagesziele halten dich motiviert.', 'Hole dir Zertifikate für jede Stufe, jedes Niveau und das Abschlusszertifikat nach der Gesamtprüfung.'];
    return {
      title: 'Deutsch lernen von A1 bis C2', bare: true, html:
        '<div class="land"><nav class="land__nav"><div class="brand"><img src="logo-mark.png" alt="">Languway German</div>' + LG.langSwitch() + '<button class="dn" data-act="theme" aria-label="Tag- und Nachtmodus wechseln"><span class="stars"></span><span class="cloud"></span><span class="knob"></span></button><a class="btn ghost sm" href="#/auth/login">Anmelden</a><a class="btn sm" href="#/auth/signup">Konto erstellen</a></nav>' +
        '<section class="hero"><div><span class="tag">Teil der Languway-Serie</span><h1>Deutsch lernen, <em>Schritt für Schritt</em> von A1 bis C2.</h1><p class="lead">Eine vollständige Lernplattform: 30 Stufen, Einstufungstest, Hören, Sprechen, Übersetzer und Abschlusszertifikat – du beginnst bei null – mit dem Alphabet – und kommst bis zum souveränen Deutsch.</p>' +
        '<div class="row"><a class="btn" href="#/auth/signup">' + ic('arrowr') + ' Jetzt lernen</a><a class="btn ghost" href="#/auth/signup">Konto erstellen</a><a class="btn soft" href="#/auth/login">Anmelden</a></div></div>' +
        '<div class="hero__art"><span class="bubble b1">Hallo!</span><span class="bubble b2">der · die · das</span><span class="bubble b3">Guten Tag</span><span class="bubble b4">ä ö ü ß</span><img class="logo" src="logo-round.png" alt="Languway German Logo" width="260" height="260"></div></section>' +
        '<section class="sec"><h2>Alles, was du zum Deutschlernen brauchst</h2><p class="sub">Alle Fertigkeiten in einer Plattform.</p><div class="grid c3">' + feats.map(function (f) { return '<div class="card feat"><div class="ic">' + ic(f[0]) + '</div><h3>' + f[1] + '</h3><p>' + f[2] + '</p></div>'; }).join('') + '</div></section>' +
        '<section class="sec"><h2>So funktioniert die Plattform</h2><p class="sub">Fünf klare Schritte.</p><div class="card"><ol class="steps">' + how.map(function (h) { return '<li>' + h + '</li>'; }).join('') + '</ol></div></section>' +
        '<section class="sec"><h2>Die sieben Niveaus</h2><p class="sub">Pre-A1 und die sechs Niveaus A1 bis C2 – jedes mit Stufentests und Abschlussprüfung.</p><div class="grid c3">' +
        STAGES.map(function (s, i) { return '<div class="card stagecard"><b>' + s[0] + '</b><div><strong>' + s[1] + '</strong></div><div class="muted">Stufen ' + RANGES[i][1] + '–' + RANGES[i][2] + '</div></div>'; }).join('') + '</div></section>' +
        '<section class="sec"><div class="card"><h2>Dein Lernsystem</h2><p>Jede Stufe enthält Einführung, Wortschatz, Grammatik, Hören, Sprechen, Lesen, Schreiben und Übung. Danach folgt der Stufentest: Mit mindestens 75 % schaltest du die nächste Stufe frei. Nach jedem Niveau wartet eine Abschlussprüfung, am Ende die Gesamtprüfung. Fehler landen automatisch in deiner Wiederholung.</p><a class="btn" href="#/auth/signup">Jetzt starten</a></div></section>' +
        '<footer class="footer">Languway German · Teil der Languway-Serie<br>Die Plattform ist unabhängig und nicht mit dem Goethe-Institut verbunden. Die Zertifikate sind Zertifikate der Plattform, keine offiziellen Sprachdiplome.</footer></div>'
    };
  }

  function dashboard() {
    var u = LG.S.user, n = C.currentLevel(LG.pg), st = LG.pg.passed[30] ? 'test' : nextStep(n), p = pct(), due = LG.dueWords().length;
    var done = LG.passedCount(), tests = LG.pg.tests.filter(function (t) { return t.kind !== 'placement'; }).slice(-5).reverse();
    var stepLabel = st === 'test' ? 'Stufentest' : STEPS.filter(function (s) { return s[0] === st; })[0][2];
    var allDone = LG.passedCount() === 30, nx = LG.nextExam();
    var cta = allDone ? '#/exam/' + nx : (st === 'test' ? '#/test/' + n : '#/level/' + n + '?step=' + st);
    var ach = LG.achList.map(function (a) { var on = !!LG.pg.ach[a.id]; return '<div class="ach' + (on ? '' : ' off') + '"><div class="ic">' + ic(a.icon) + '</div><div><b>' + a.title + '</b><span>' + a.desc + '</span></div></div>'; }).join('');
    var res = tests.length ? tests.map(function (t) { return '<div class="resrow"><span>' + (t.kind === 'final' ? 'Gesamtprüfung' : t.kind === 'exam' ? 'Abschlussprüfung ' + STAGES[t.level - 1][0] : t.kind === 'review' ? 'Wiederholung' : 'Stufe ' + t.level) + '</span><b>' + t.score + '/' + t.total + ' · ' + t.pct + ' %</b></div>'; }).join('') : '<div class="empty">Noch keine Tests. Starte mit deiner ersten Stufe!</div>';
    var unitsDone = STAGES.filter(function (s, i) { return LG.stageDone(s[0]); }).length;
    return {
      title: 'Start', heading: 'Start', html: !LG.pg.placementDone ? LG.startCard() : 
        '<div class="card welcome"><button class="pbtn" data-act="cont" data-href="' + cta + '" aria-label="Weiterlernen">' + ring(p) + ic('play') + '</button><div><h2>Hallo, ' + esc(u.name.split(' ')[0]) + '!</h2><div>' + (allDone ? (nx === 'final' ? 'Alle Niveaus geschafft – jetzt die Gesamtprüfung.' : 'Alle Stufen geschafft – jetzt die Abschlussprüfung.') : 'Aktuelle Stufe: <b>' + n + ' · ' + esc(LG.lvTitle(n)) + '</b> (' + D.LEVELS[n - 1].c + ')') + '</div><div class="bar" style="margin:10px 0 4px"><i style="width:' + p + '%"></i></div><small>' + p + ' % des Kurses · ' + done + ' von 30 Stufen</small></div></div>' +
        '<a class="cta" href="' + cta + '" style="margin-top:16px;text-decoration:none"><ul><li>' + (allDone ? (nx === 'final' ? 'Gesamtprüfung' : 'Abschlussprüfung') : 'Nächste Lektion: Stufe ' + n + ' – ' + esc(LG.lvTitle(n))) + '</li><li><b>' + (allDone ? 'Prüfung starten' : stepLabel) + '</b> · Weiterlernen</li></ul></a>' +
        LG.goalCard() + LG.tutorCard() + '<div class="grid c4" style="margin-top:16px"><div class="card stat"><b>' + D.LEVELS[n - 1].c + '</b><span>Aktuelles Niveau</span></div><div class="card stat"><b>' + done + '</b><span>Stufen geschafft</span></div><div class="card stat"><b>' + unitsDone + '</b><span>Niveaus abgeschlossen</span></div><div class="card stat"><b>' + LG.pg.words.length + '</b><span>Wörter gelernt</span></div><div class="card stat"><b>' + hm(LG.pg.minutes) + '</b><span>Lernzeit</span></div></div>' +
        '<div class="grid c2" style="margin-top:16px;align-items:start"><div class="card"><h3>Testergebnisse</h3>' + res + '</div><div class="card"><h3>Wiederholung</h3><p class="muted">' + (due ? due + ' Wörter warten auf deine Wiederholung.' : 'Heute ist nichts fällig. Gut gemacht!') + '</p><a class="btn' + (due ? '' : ' soft') + '" href="#/review">' + ic('refresh') + ' Wiederholen</a></div></div>' +
        '<div class="card" style="margin-top:16px"><h3>Erfolge</h3><div class="grid c2">' + ach + '</div></div>',
      mount: function () { var d = LG.pg.notif || (LG.pg.notif = {}); var now = Date.now(); d.lastOpen = now; LG.save(); reminders(due); }
    };
  }
  function reminders(due) {
    if (!LG.settings.reminders || LG._remShown) return; LG._remShown = 1;
    var msg = due ? 'Zeit, deinen Wortschatz zu wiederholen (' + due + ' Wörter).' : null;
    if (!msg && LG.passedCount() < 30) msg = 'Deine nächste Lektion ist bereit.';
    if (msg) setTimeout(function () { LG.toast(msg); }, 1200);
  }
  LG.act.cont = function (t) { LG.go(t.dataset.href.slice(1)); };

  /* ---------- authentication (login / signup with sweeping blade) ---------- */
  LG.views.auth = function (params) {
    var mode = params[0] || 'login', last = LG.lsGet('lg.lastUser', '');
    var html = '<div class="auth-wrap"><div class="auth-lang">' + LG.langSwitch() + '</div><div class="auth" id="auth" data-mode="' + mode + '" dir="ltr">' +
      '<div class="auth__brand"><img src="logo-mark.png" alt="Languway German"><div><h2>Languway German</h2><p class="sub">Learn German from zero to C2.</p></div></div>' +
      '<div class="auth__panes">' +
      '<section class="auth__pane' + (mode === 'login' ? ' is-on' : '') + '" id="pane-login"' + (mode === 'login' ? '' : ' inert') + '><h2>Log in</h2><p class="hint">Enter your username and password. Your progress is saved to your account, so you can continue on any device.</p>' +
      '<form id="f-login" novalidate><div class="formerr" id="e-login" hidden></div><div class="field"><label for="l-user">Username</label><input id="l-user" dir="ltr" autocomplete="username" autocapitalize="none" spellcheck="false" value="' + esc(last) + '"></div>' +
      '<div class="field"><label for="l-pass">Password</label><div class="pw"><input id="l-pass" type="password" dir="ltr" autocomplete="current-password"><button type="button" data-act="pw" data-t="l-pass" aria-label="Show password">' + ic('eye') + '</button></div></div>' +
      '<button class="btn block" type="submit">Log in</button></form><div class="switch">No account yet? <button type="button" data-act="authsw" data-to="signup">Create one</button></div><div class="switch"><a href="#/">Back to home page</a></div></section>' +
      '<section class="auth__pane' + (mode === 'signup' ? ' is-on' : '') + '" id="pane-signup"' + (mode === 'signup' ? '' : ' inert') + '><h2>Create your account</h2><p class="hint">Your name, a username and a password. No e-mail or external account needed.</p>' +
      '<form id="f-signup" novalidate><div class="formerr" id="e-signup" hidden></div><div class="field"><label for="s-name">Name</label><input id="s-name" autocomplete="name" maxlength="60"></div>' +
      '<div class="field"><label for="s-user">Username</label><input id="s-user" dir="ltr" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20"><small>3–20 characters: a–z, digits, _ - .</small></div>' +
      '<div class="field"><label for="s-pass">Password</label><div class="pw"><input id="s-pass" type="password" dir="ltr" autocomplete="new-password" maxlength="72"><button type="button" data-act="pw" data-t="s-pass" aria-label="إظهار كلمة السر">' + ic('eye') + '</button></div><small>At least 8 characters</small></div>' +
      '<div class="field"><label for="s-pass2">Confirm password</label><input id="s-pass2" type="password" dir="ltr" autocomplete="new-password" maxlength="72"></div>' +
      '<button class="btn block" type="submit">Create account</button></form><div class="switch">Already registered? <button type="button" data-act="authsw" data-to="login">Log in</button></div></section></div>' +
      '<div class="auth__band" id="band" aria-hidden="true"><span class="band__edge band__edge--trail"></span><span class="band__edge band__edge--lead"></span><div class="band__inner"><div class="band__page" id="bandpage"><h3 class="welcome__title" id="bandtitle"></h3></div></div></div></div>' +
      '<p class="auth-note">Your account and progress are stored securely online. Passwords are never saved in plain text. You can log in on any device with the same username and password.</p></div>';
    return {
      title: mode === 'login' ? 'Anmelden' : 'Konto erstellen', bare: true, html: html,
      mount: function (root) {
        var auth = LG.$('#auth'), busy = false;
        function show(id, msg) { var e = LG.$(id); e.textContent = msg; e.hidden = !msg; }
        LG.act.authsw = function (t) {
          var next = t.dataset.to, cur = auth.dataset.mode; if (busy || next === cur) return; busy = true;
          var band = LG.$('#band'), page = LG.$('#bandpage'), cw = auth.clientWidth, ch = auth.clientHeight, B = cw * 1.5;
          LG.$('#bandtitle').innerHTML = next === 'login' ? 'Welcome back<em>.</em>' : 'Let\'s start <em>together.</em>';
          band.style.width = B + 'px'; page.style.width = cw + 'px'; page.style.height = ch * .92 + 'px'; band.classList.add('run');
          var from = -(B + 80), to = cw + 80, panes = { login: LG.$('#pane-login'), signup: LG.$('#pane-signup') }, other = cur;
          function swap() { auth.dataset.mode = next; panes[next].classList.add('is-on'); panes[other].classList.remove('is-on'); panes[other].inert = true; panes[next].inert = false; var f = panes[next].querySelector('input'); if (f && !matchMedia('(pointer:coarse)').matches) f.focus(); history.replaceState(null, '', '#/auth/' + next); show('#e-login', ''); show('#e-signup', ''); }
          var done = function () { band.classList.remove('run'); band.style.removeProperty('--sweep'); busy = false; };
          if (band.animate && window.CSS && CSS.registerProperty !== undefined) {
            var a = band.animate({ '--sweep': [from + 'px', to + 'px'] }, { duration: 1100, easing: 'cubic-bezier(.65,0,.35,1)' });
            setTimeout(swap, 520); a.onfinish = done; a.oncancel = done;
          } else { swap(); done(); }
        };
        LG.act.pw = function (t) { var i = LG.$('#' + t.dataset.t); i.type = i.type === 'password' ? 'text' : 'password'; };
        LG.$('#f-login').onsubmit = function (e) {
          e.preventDefault(); var u = LG.$('#l-user').value.trim(), p = LG.$('#l-pass').value, b = e.target.querySelector('button[type=submit]');
          if (!u || !p) return show('#e-login', 'Please enter your username and password.');
          b.disabled = true; show('#e-login', '');
          LG.login(u, p).then(function () { LG.go('/'); }).catch(function (er) { show('#e-login', LG.errText(er.code)); b.disabled = false; });
        };
        LG.$('#f-signup').onsubmit = function (e) {
          e.preventDefault(); var n = LG.$('#s-name').value.trim(), u = LG.$('#s-user').value.trim(), p = LG.$('#s-pass').value, p2 = LG.$('#s-pass2').value, b = e.target.querySelector('button[type=submit]');
          if (!n) return show('#e-signup', LG.errText('invalid_name'));
          if (!/^[A-Za-z0-9_.-]{3,20}$/.test(u)) return show('#e-signup', LG.errText('invalid_username'));
          if (p.length < 8) return show('#e-signup', LG.errText('invalid_password'));
          if (p !== p2) return show('#e-signup', 'The two passwords do not match.');
          b.disabled = true; show('#e-signup', '');
          LG.signup(n, u, p).then(function () { LG.go('/'); }).catch(function (er) { show('#e-signup', LG.errText(er.code, 'ar')); b.disabled = false; });
        };
      }
    };
  };

  /* ---------- levels overview ---------- */
  LG.views.levels = function () {
    var out = '', hidden = false;
    STAGES.forEach(function (s, si) {
      if (hidden) return;                                  // stages after the next locked one stay invisible
      var from = RANGES[si][1], to = RANGES[si][2], cards = '';
      if (!C.isUnlocked(LG.pg, from)) {                     // teaser only: no titles are revealed
        hidden = true;
        out += '<div class="stagehead"><span class="tag">' + s[0] + '</span><h2>Noch gesperrt</h2></div><div class="exambox lock">' + ic('lock') + '<div style="flex:1"><b>Niveau ' + s[0] + '</b><div class="muted">Schließe zuerst alle Stufen und die Abschlussprüfung des vorherigen Niveaus ab. Was danach kommt, siehst du erst, wenn du es freigeschaltet hast.</div></div></div>'; return;
      }
      for (var n = from; n <= to; n++) {
        var stt = LG.levelStatus(n), steps = STEPS.filter(function (x) { return stepDone(n, x[0]); }).length, lv = D.LEVELS[n - 1];
        if (stt === 'lock') { cards += '<div class="lv lock" data-act="locked"><span class="n">STUFE ' + n + '</span><h3>Gesperrt</h3><small class="muted">Bestehe zuerst Stufe ' + (n - 1) + '.</small><span class="st">' + ic('lock') + '</span></div>'; continue; }
        cards += '<a class="lv ' + stt + '" href="#/level/' + n + '"><span class="n">STUFE ' + n + '</span><h3>' + esc(lv.t) + '</h3><div class="bar"><i style="width:' + (stt === 'done' ? 100 : Math.round(steps / 8 * 100)) + '%"></i></div><small class="muted">' + (stt === 'done' ? (LG.pg.passed[n].skipped ? 'Übersprungen (Einstufungstest)' : 'Bestanden · ' + LG.pg.passed[n].score + ' %') : steps + ' von 8 Schritten') + '</small><span class="st">' + (stt === 'done' ? ic('check') : stt === 'cur' ? ic('play') : '') + '</span></a>';
      }
      var ready = LG.stageLevelsDone(si), passed = LG.stageDone(s[0]), cnt = to - from + 1;
      out += '<div class="stagehead"><span class="tag">' + s[0] + '</span><h2>' + s[1] + ' – ' + s[2] + '</h2></div><div class="levels">' + cards + '</div>' +
        '<div class="exambox' + (ready || passed ? '' : ' lock') + '">' + ic(passed ? 'award' : ready ? 'target' : 'lock') + '<div style="flex:1"><b>Abschlussprüfung ' + s[0] + '</b><div class="muted">' + (passed ? (LG.pg.stagePassed[s[0]].skipped ? 'Durch den Einstufungstest übersprungen' : 'Bestanden · ' + LG.pg.stagePassed[s[0]].score + ' %') : ready ? '20 Fragen · 75 % zum Bestehen · schaltet das nächste Niveau frei' : 'Schließe zuerst ' + (cnt === 1 ? 'die Stufe' : 'alle ' + cnt + ' Stufen') + ' ab.') + '</div></div>' + (ready && !passed ? '<a class="btn" href="#/exam/' + (si + 1) + '">Prüfung starten</a>' : passed && !LG.pg.stagePassed[s[0]].skipped ? '<a class="btn soft" href="#/exam/' + (si + 1) + '">Wiederholen</a>' : '') + '</div>';
    });
    if (!hidden) {
      var fin = LG.pg.stagePassed.FINAL, ok = LG.allStagesDone();
      out += '<div class="stagehead"><span class="tag">Final</span><h2>Gesamtprüfung</h2></div><div class="exambox' + (ok ? '' : ' lock') + '">' + ic(fin ? 'award' : ok ? 'target' : 'lock') + '<div style="flex:1"><b>Umfassende Gesamtprüfung</b><div class="muted">' + (fin ? 'Bestanden · ' + fin.score + ' %' : ok ? '40 Fragen aus allen 30 Stufen · 75 % zum Bestehen · danach erhältst du das Abschlusszertifikat' : 'Schließe zuerst alle Niveaus ab.') + '</div></div>' + (ok ? '<a class="btn' + (fin ? ' soft' : '') + '" href="#/exam/final">' + (fin ? 'Wiederholen' : 'Prüfung starten') + '</a>' : '') + '</div>';
    }
    return { title: 'Lernen', heading: '30 Stufen von Pre-A1 bis C2', html: '<p class="muted">Lerne in Reihenfolge: Jede Stufe wird durch den Stufentest freigeschaltet (mindestens 75 %). Spätere Stufen bleiben verborgen, bis du sie erreichst.</p>' + out };
  };
  LG.act.locked = function (t, e) { e.preventDefault(); LG.toast('Diese Stufe ist noch gesperrt. Bestehe zuerst die vorherige Stufe.', true); };

  /* ---------- lesson ---------- */
  LG.views.lesson = function (params, q) {
    var n = +params[0]; if (n < 1 || n > 30) return LG.go('/levels');
    if (!C.isUnlocked(LG.pg, n)) { LG.toast('Diese Stufe ist noch gesperrt.', true); return LG.go('/levels'); }
    var lv = D.LEVELS[n - 1], step = q.get('step') || nextStep(n); if (step === 'test') step = 'intro';
    var tabs = STEPS.map(function (s) { return '<button class="tab' + (s[0] === step ? ' on' : '') + (stepDone(n, s[0]) ? ' ok' : '') + '" data-act="step" data-n="' + n + '" data-s="' + s[0] + '">' + ic(s[1]) + ' ' + s[2] + '</button>'; }).join('') + '<a class="tab" href="#/test/' + n + '">' + ic('target') + ' Stufentest</a>';
    return {
      title: 'Stufe ' + n, heading: 'Stufe ' + n + ' · ' + lv.t, html: '<div class="crumb"><a href="#/levels">Lernen</a> › ' + lv.c + ' › Stufe ' + n + '</div><div class="tabs" id="tabs">' + tabs + '</div>' + (function () { var d = STEPS.filter(function (s) { return stepDone(n, s[0]); }).length, pc = Math.round(d / STEPS.length * 100); return '<div class="lessonbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pc + '"><div class="bar"><i style="width:' + pc + '%"></i></div><small>' + d + ' von ' + STEPS.length + ' Schritten · ' + pc + ' %</small></div>'; })() + '<div id="stepbox"></div>',
      mount: function () { showStep(n, step); }
    };
  };
  LG.act.step = function (t) { showStep(+t.dataset.n, t.dataset.s); history.replaceState(null, '', '#/level/' + t.dataset.n + '?step=' + t.dataset.s); };
  function showStep(n, s) {
    LG.stopSpeak(); var box = LG.$('#stepbox'); if (!box) return;
    LG.$$('#tabs .tab').forEach(function (b) { b.classList.toggle('on', b.dataset.s === s); if (b.dataset.s) b.classList.toggle('ok', stepDone(n, b.dataset.s)); });
    var r = LG.stepRender[s](n, D.LEVELS[n - 1]); box.innerHTML = r.html + nav(n, s); if (r.mount) r.mount(box);
    var cur = LG.$('#tabs .tab.on'); if (cur && cur.scrollIntoView) cur.scrollIntoView({ inline: 'center', block: 'nearest' });
  }
  function nav(n, s) {
    var i = STEPS.map(function (x) { return x[0]; }).indexOf(s), nx = STEPS[i + 1];
    return '<div class="row between" style="margin-top:18px">' + (i > 0 ? '<button class="btn soft" data-act="step" data-n="' + n + '" data-s="' + STEPS[i - 1][0] + '">‹ Zurück</button>' : '<span></span>') +
      (nx ? '<button class="btn" data-act="stepnext" data-n="' + n + '" data-s="' + s + '" data-nx="' + nx[0] + '">Weiter ›</button>' : '<a class="btn" href="#/test/' + n + '" data-act="stepdone" data-n="' + n + '" data-s="' + s + '">Zum Stufentest ›</a>') + '</div>';
  }
  LG.act.stepnext = function (t) { LG.markStep(+t.dataset.n, t.dataset.s); showStep(+t.dataset.n, t.dataset.nx); history.replaceState(null, '', '#/level/' + t.dataset.n + '?step=' + t.dataset.nx); window.scrollTo(0, 0); };
  LG.act.stepdone = function (t) { LG.markStep(+t.dataset.n, t.dataset.s); };
  function sp(text, label) { return '<button class="iconbtn" data-act="speak" data-say="' + esc(text) + '" aria-label="' + (label || 'Anhören') + '">' + ic('speaker') + '</button>'; }
  LG.spBtn = sp;

  function wordCard(w) {
    var h = '<div class="card wcard"><div><h3>' + (w.type === 'n' ? '<span class="art ' + w.article + '">' + w.article + '</span>' + (LG.cmpHtml(w.lemma) || esc(w.lemma)) : esc(w.lemma)) + '</h3></div><div>' + sp(w.type === 'n' ? w.display : w.lemma) + '</div>';
    var meta = [];
    if (w.type === 'n') meta.push('Plural: ' + (w.plural === '-' ? 'kein Plural' : 'die ' + esc(w.plural)));
    if (w.type === 'a' && w.comp !== '-') meta.push(esc(w.lemma) + ' – ' + esc(w.comp) + ' – ' + esc(w.sup));
    if (w.type === 'v') { var c = C.conjugate(w); meta.push('Partizip II: ' + esc(c.pp) + ' (' + c.aux + ')'); }
    if (w.type === 'o' && w.pos) meta.push(esc(w.pos));
    h += '<div class="meta"><b>' + esc(w.en) + '</b>' + (meta.length ? ' · ' + meta.join(' · ') : '') + '</div>';
    h += '<div class="meta">' + esc(w.defDE) + (LG.showDefEN(w.level) ? '<br><i>' + esc(w.defEN) + '</i>' : '') + '</div><div class="ex">' + esc(w.ex) + ' <button class="iconbtn" style="width:32px;height:32px" data-act="speak" data-say="' + esc(w.ex) + '" aria-label="Satz anhören">' + ic('speaker') + '</button></div>';
    if (w.type === 'v') h += conjTable(w);
    return h + '</div>';
  }
  function conjTable(w) {
    var c = C.conjugate(w), T = [['pres', 'Präsens'], ['pret', 'Präteritum'], ['perf', 'Perfekt']];
    var tabs = '<div class="ctabs" role="tablist">' + T.map(function (t, k) { return '<button type="button" role="tab" class="ctab' + (k === 0 ? ' on' : '') + '" data-act="conjtab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
    var panes = T.map(function (t, k) {
      return '<div class="cpane" data-pane="' + t[0] + '"' + (k ? ' hidden' : '') + '>' + [0, 1, 2, 3, 4, 5].map(function (i) { var f = c[t[0]][i]; return '<button type="button" class="crow" data-act="speak" data-say="' + esc(c.pron[i] + ' ' + f) + '"><span class="cp">' + c.pron[i] + '</span><b>' + esc(f) + '</b><span class="cs">' + ic('speaker') + '</span></button>'; }).join('') + '</div>';
    }).join('');
    return '<details class="more"><summary>Verbformen anzeigen</summary><div class="conj2">' + tabs + panes + '<p class="muted" style="font-size:13px;margin:8px 0 0">Tippe auf eine Form, um sie zu hören.</p></div></details>';
  }
  LG.act.conjtab = function (t) { var box = t.closest('.conj2'); LG.$$('.ctab', box).forEach(function (b) { b.classList.toggle('on', b === t); }); LG.$$('.cpane', box).forEach(function (p) { p.hidden = p.dataset.pane !== t.dataset.t; }); };
  LG.wordCard = wordCard; LG.conjTable = conjTable;

  var ALPHA = [['A','Apfel'],['B','Bus'],['C','Computer'],['D','Danke'],['E','Ei'],['F','Fisch'],['G','gut'],['H','Haus'],['I','Insel'],['J','Jahr'],['K','Kaffee'],['L','Lampe'],['M','Mutter'],['N','Name'],['O','Obst'],['P','Park'],['Q','Quelle'],['R','rot'],['S','Sonne'],['T','Tisch'],['U','Uhr'],['V','Vater'],['W','Wasser'],['X','Xylofon'],['Y','Yoga'],['Z','Zeit'],['Ä','Äpfel'],['Ö','Öl'],['Ü','Übung'],['ß','Straße']];
  var NUMS = ['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn','zwanzig'];
  function alphaGrid() { return '<h3>Tippe auf einen Buchstaben</h3><div class="tiles">' + ALPHA.map(function (a) { return '<button class="tile" data-act="speak" data-say="' + esc(a[0] + '. ' + a[1]) + '"><b>' + a[0] + (a[0] === 'ß' ? '' : a[0].toLowerCase()) + '</b><span>' + a[1] + '</span></button>'; }).join('') + '</div>'; }
  function numGrid() { var t = NUMS.map(function (w, i) { return [i, w]; }).concat([[30, 'dreißig'], [40, 'vierzig'], [50, 'fünfzig'], [60, 'sechzig'], [70, 'siebzig'], [80, 'achtzig'], [90, 'neunzig'], [100, 'hundert']]); return '<h3>Tippe auf eine Zahl</h3><div class="tiles">' + t.map(function (a) { return '<button class="tile" data-act="speak" data-say="' + a[1] + '"><b>' + a[0] + '</b><span>' + a[1] + '</span></button>'; }).join('') + '</div>'; }

  LG.stepRender = {
    intro: function (n, lv) {
      var ws = LG.levelWords(n);
      return { html: '<div class="card"><span class="tag">' + lv.c + ' · Stufe ' + n + '</span><h2 style="margin-top:8px">' + esc(lv.t) + '</h2><p>' + esc(lv.g) + '</p><div class="grid c2"><div class="ach"><div class="ic">' + ic('book') + '</div><div><b>' + ws.length + ' neue Wörter</b><span>mit Artikel, Plural und Beispiel</span></div></div><div class="ach"><div class="ic">' + ic('pencil') + '</div><div><b>' + esc(lv.gr.t) + '</b><span>Grammatik</span></div></div><div class="ach"><div class="ic">' + ic('phones') + '</div><div><b>' + esc(lv.ls.title) + '</b><span>Hören</span></div></div><div class="ach"><div class="ic">' + ic('eye') + '</div><div><b>' + esc(lv.rd.title) + '</b><span>Lesen</span></div></div></div></div>' };
    },
    vocab: function (n) {
      var ws = LG.levelWords(n);
      return { html: '<p class="muted">Tippe auf das Lautsprecher-Symbol, um die Aussprache zu hören.</p>' + (n <= 2 ? LG.cognateCard(n) : '') + (n >= 2 && n <= 17 ? LG.compCard(n) : '') + ws.map(wordCard).join('') + '<div class="row" style="margin-top:14px"><button class="btn soft" data-act="learned" data-n="' + n + '">' + ic('check') + ' Ich habe alle Wörter gelernt</button></div>' };
    },
    grammar: function (n, lv) {
      var g = lv.gr;
      var extra = lv.alpha ? alphaGrid() : lv.nums ? numGrid() : '';
      return { html: '<div class="card gr"><h2>' + esc(g.t) + '</h2>' + LG.helpHtml(n, g) + g.p.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('') + extra + '<h3>Beispiele</h3><ul class="exlist">' + g.ex.map(function (x) { return '<li>' + sp(x) + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' };
    },
    listen: function (n, lv) {
      var ls = lv.ls;
      return { html: '<div class="card"><h2>' + esc(ls.title) + '</h2><p class="muted">Höre den Dialog zuerst ohne Text und beantworte dann die Fragen.</p><div class="row"><button class="btn" id="playall">' + ic('play') + ' Dialog abspielen</button><button class="btn soft" id="stopall">' + ic('stop') + ' Stopp</button><button class="btn soft" id="showtxt">Text anzeigen</button></div>' +
        '<div class="speedrow" style="margin-top:12px"><span class="muted">Tempo:</span>' + [[0.6, 'Langsam'], [0.8, 'Normal'], [1, 'Schnell']].map(function (s) { return '<button data-rate="' + s[0] + '" class="' + (Math.abs((LG.settings.rate || .9) - s[0]) < .15 ? 'on' : '') + '">' + s[1] + '</button>'; }).join('') + '</div>' +
        '<div class="dlg" id="dlg" hidden>' + ls.lines.map(function (l, i) { return '<div class="ln ' + (/^B:/.test(l) ? 'b' : '') + '" data-i="' + i + '">' + esc(l) + '</div>'; }).join('') + '</div></div><div class="card" id="lq"></div>',
        mount: function (box) {
          var rate = LG.settings.rate || .9;
          LG.$$('.speedrow button', box).forEach(function (b) { b.onclick = function () { rate = +b.dataset.rate; LG.setSetting('rate', rate); LG.$$('.speedrow button', box).forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
          LG.$('#playall', box).onclick = function () { LG.playLines(ls.lines, rate, function (i) { LG.$$('.ln', box).forEach(function (l) { l.classList.toggle('playing', +l.dataset.i === i); }); }); };
          LG.$('#stopall', box).onclick = function () { LG.stopSpeak(); LG._playTok = null; };
          LG.$('#showtxt', box).onclick = function () { var d = LG.$('#dlg', box); d.hidden = !d.hidden; this.textContent = d.hidden ? 'Text anzeigen' : 'Text verbergen'; };
          LG.quiz({ root: LG.$('#lq', box), qs: LG.C.listenQs(lv, Math.random).map(function (q) { return C.prepareQ(q); }), feedback: true, title: 'Fragen zum Hören', onDone: function () { LG.markStep(n, 'listen'); } });
        } };
    },
    speak: function (n, lv) {
      var canRec = !!(window.SpeechRecognition || window.webkitSpeechRecognition), canMedia = !!(navigator.mediaDevices && window.MediaRecorder);
      return { html: '<div class="card"><h2>Sprechen</h2><p class="muted">Höre den Satz, sprich ihn nach und vergleiche. ' + (canRec ? 'Die Spracherkennung deines Browsers prüft, welche Wörter erkannt wurden.' : 'Dein Browser hat keine Spracherkennung. Du kannst dich aufnehmen und mit dem Original vergleichen – eine automatische Bewertung gibt es hier nicht.') + '</p>' +
        lv.sp.map(function (t, i) { return '<div class="speak" data-i="' + i + '"><div class="txt">' + esc(t) + '</div><div class="row"><button class="btn sm soft" data-act="speak" data-say="' + esc(t) + '">' + ic('speaker') + ' Anhören</button><button class="btn sm soft" data-act="slow" data-say="' + esc(t) + '">Langsam</button>' + (canRec || canMedia ? '<button class="btn sm" data-act="rec" data-i="' + i + '" data-t="' + esc(t) + '">' + ic('mic') + ' Aufnehmen</button>' : '') + '</div><div class="out" style="margin-top:10px"></div></div>'; }).join('') + '</div>' };
    },
    read: function (n, lv) {
      var rd = lv.rd;
      return { html: '<div class="card"><h2>' + esc(rd.title) + '</h2><div class="readtext">' + esc(rd.text) + '</div><div class="row">' + sp(rd.text, 'Text vorlesen') + '<button class="btn soft sm" id="entr">Englische Übersetzung</button></div><p class="note" id="enbox" hidden style="margin-top:10px">' + esc(rd.en) + '</p></div><div class="card" id="rq"></div>',
        mount: function (box) { LG.$('#entr', box).onclick = function () { var e = LG.$('#enbox', box); e.hidden = !e.hidden; }; LG.quiz({ root: LG.$('#rq', box), qs: LG.C.readQs(lv, Math.random).map(function (q) { q.text = rd.text; return C.prepareQ(q); }), feedback: true, title: 'Fragen zum Text', onDone: function () { LG.markStep(n, 'read'); } }); } };
    },
    write: function (n, lv) {
      var parts = lv.wr.split('|');
      return { html: '<div class="card"><h2>Schreiben</h2><p><b>' + esc(parts[0]) + '</b></p><textarea class="write" id="wr" placeholder="Schreibe hier auf Deutsch …" aria-label="Deine Antwort"></textarea><div class="row" style="margin-top:10px"><button class="btn" id="wrcheck">Prüfen</button><span class="muted" id="wrcount">0 Wörter</span></div><div id="wrfb"></div></div>',
        mount: function (box) {
          var ta = LG.$('#wr', box); ta.oninput = function () { LG.$('#wrcount', box).textContent = (ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0) + ' Wörter'; };
          LG.$('#wrcheck', box).onclick = function () {
            var txt = ta.value.trim(), words = txt ? txt.split(/\s+/).length : 0, low = txt.toLowerCase(), groups = parts.slice(1).join(',').split(',').filter(Boolean), miss = [], fb = LG.$('#wrfb', box);
            groups.forEach(function (g) { var alts = g.split('/'); if (!alts.some(function (a) { return low.indexOf(a.trim().toLowerCase()) > -1; })) miss.push(g.replace(/\//g, ' / ')); });
            if (words < 4) { fb.innerHTML = '<div class="feedback no">Schreibe mindestens vier Wörter. Versuche einen vollständigen Satz.</div>'; return; }
            if (miss.length) { fb.innerHTML = '<div class="feedback no">Fast! Versuche noch diese Elemente zu verwenden: <b>' + esc(miss.join(', ')) + '</b>. Prüfe auch Großschreibung der Nomen und die Verbposition.</div>'; return; }
            LG.markStep(n, 'write'); fb.innerHTML = '<div class="feedback ok">Sehr gut! Alle Aufgabenelemente sind enthalten. Lies deinen Text noch einmal laut und prüfe Artikel und Endungen.</div>';
          };
        } };
    },
    practice: function (n, lv) {
      var ws = LG.levelWords(n), rnd = Math.random, qs = C.shuffle(C.wordQuestions(ws, P.words, rnd), rnd).slice(0, 8).map(function (q) { return C.prepareQ(q); });
      return { html: '<div class="card" id="pq"></div>', mount: function (box) { LG.quiz({ root: LG.$('#pq', box), qs: qs, feedback: true, title: 'Übung', retryOnly: true, onDone: function () { LG.markStep(n, 'practice'); }, words: true }); } };
    }
  };
  LG.act.learned = function (t) { var n = +t.dataset.n; LG.addWords(n); LG.markStep(n, 'vocab'); LG.save(); LG.toast('Wörter gespeichert. Du findest sie im Wörterbuch.'); };
  LG.act.rec = function (t) { LG.recordSentence(t); };
})();
