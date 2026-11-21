/* Languway German – views part 1: landing, accounts, dashboard, levels, lessons */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, D = LG.D, P = LG.P, esc = LG.esc, ic = LG.ic;
  var STAGES = [['Pre-A1', 'Starter', 'Alphabet und Zahlen'], ['A1', 'Beginner', 'Erste Schritte'], ['A2', 'Elementary', 'Grundlagen'], ['B1', 'Intermediate', 'Mittelstufe'], ['B2', 'Upper Intermediate', 'Gehobene Mittelstufe'], ['C1', 'Advanced', 'Fortgeschritten'], ['C2', 'Proficiency', 'Meisterstufe']];
  var STEPS = [['intro', 'bulb', 'Einführung'], ['vocab', 'book', 'Wortschatz'], ['grammar', 'pencil', 'Grammatik'], ['listen', 'phones', 'Hören'], ['speak', 'mic', 'Sprechen'], ['read', 'eye', 'Lesen'], ['write', 'pencil', 'Schreiben'], ['practice', 'target', 'Übung']];
  LG.STAGES = STAGES; LG.STEPS = STEPS;
  LG.lvTitle = function (n) { return D.LEVELS[n - 1].t; };
  function stepDone(n, s) { return !!LG.pg.done['L' + n + ':' + s]; }
  function nextStep(n) { for (var i = 0; i < STEPS.length; i++) if (!stepDone(n, STEPS[i][0])) return STEPS[i][0]; return 'test'; }
  LG.markStep = function (n, s) { var sk = { vocab: 'vocab', grammar: 'grammar', listen: 'listen', speak: 'speak', read: 'read', write: 'write', practice: 'practice' }[s]; if (sk) LG.markSkill(sk); if (!LG.pg.done['L' + n + ':' + s]) { LG.pg.done['L' + n + ':' + s] = true; LG.addXP(10); LG.save(); } };
  function hm(min) { min = Math.round(min); return min < 60 ? min + ' Min.' : Math.floor(min / 60) + ' Std. ' + (min % 60) + ' Min.'; }
  LG.hm = hm;

  /* ---------- authentication (login / signup with sweeping blade) ---------- */
  LG.views.auth = function (params) {
    var mode = params[0] || 'login', last = LG.lsGet('lg.lastUser', '');
    var html = '<div class="auth-wrap"><div class="auth-lang">' + LG.langSwitch() + '</div><div class="auth" id="auth" data-mode="' + mode + '" dir="ltr">' +
      '<div class="auth__brand"><img src="logo-mark.png" alt="Languway German"><div><h1>Languway German</h1><p class="sub">Learn German from zero to C2.</p></div></div>' +
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
  /* ---------- lesson ---------- */
  LG.views.lesson = function (params, q) {
    var n = +params[0]; if (n < 1 || n > 30) return LG.go('/levels');
    if (!C.isUnlocked(LG.pg, n)) { LG.toast('Diese Stufe ist noch gesperrt.', true); return LG.go('/levels'); }
    var lv = D.LEVELS[n - 1], step = q.get('step') || nextStep(n); if (step === 'test') step = 'intro';
    var ll = LG.lessonList(n), tabs = ll.map(function (l) { return '<button class="tab' + (l.step === step ? ' on' : '') + (l.done ? ' ok' : '') + (l.locked ? ' lk' : '') + '" data-act="step" data-n="' + n + '" data-s="' + l.step + '">' + ic(l.locked ? 'lock' : l.done ? 'check' : l.icon) + ' ' + l.no + '. ' + l.title + '</button>'; }).join('') + '<a class="tab' + (ll.every(function (l) { return l.done; }) ? '' : ' lk') + '" href="#/test/' + n + '">' + ic('target') + ' Stufentest</a>';
    var cl = ll.filter(function (l) { return l.step === step; })[0];
    return {
      title: 'Stufe ' + n, heading: 'Stufe ' + n + ' · ' + lv.t, back: '/levels', html: '<div class="crumb"><a href="#/levels">Lernen</a> › ' + lv.c + ' › Stufe ' + n + ' › Einheit ' + cl.unit + ' › Lektion ' + cl.no + '</div><div class="tabs" id="tabs">' + tabs + '</div>' + (function () { var d = STEPS.filter(function (s) { return stepDone(n, s[0]); }).length, pc = Math.round(d / STEPS.length * 100); return '<div class="lessonbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pc + '"><div class="bar"><i style="width:' + pc + '%"></i></div><small>' + d + ' von ' + STEPS.length + ' Schritten · ' + pc + ' %</small></div>'; })() + '<div id="stepbox"></div>',
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
    var h = '<div class="card wcard">' + LG.picBlock(w) + '<div><h3>' + (w.type === 'n' ? '<span class="art ' + w.article + '">' + w.article + '</span>' + (LG.cmpHtml(w.lemma) || esc(w.lemma)) : esc(w.lemma)) + '</h3></div><div>' + sp(w.type === 'n' ? w.display : w.lemma) + '</div>';
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
