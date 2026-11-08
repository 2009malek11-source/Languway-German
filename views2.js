/* Language German – views part 2: quiz engine, speaking practice, level tests, exams, placement test */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, D = LG.D, P = LG.P, esc = LG.esc, ic = LG.ic;
  var LET = ['A', 'B', 'C', 'D', 'E'];

  /* ---------- generic quiz engine ---------- */
  LG.quiz = function (cfg) {
    var root = cfg.root, qs = cfg.qs, i = 0, answers = [], oks = [], locked = false, st;
    function correctText(q) { return q.t === 'mcq' ? q.o[q.a] : q.t === 'order' ? q.ans : q.ans[0]; }
    function head(q) {
      return '<div class="qhead"><span class="qk">' + esc(cfg.title || q.k) + '</span><div class="bar"><i style="width:' + Math.round(i / qs.length * 100) + '%"></i></div><b>' + (i + 1) + '/' + qs.length + '</b></div>';
    }
    function draw() {
      var q = qs[i]; locked = false; st = { picked: null, order: [] };
      var h = '<div class="qbox">' + head(q) + '<div class="qk" style="margin-bottom:4px">' + esc(q.k) + '</div>';
      if (q.text) h += '<div class="qpassage">' + esc(q.text) + '</div>';
      if (q.audio) h += '<div class="row" style="margin-bottom:10px"><button class="btn soft sm" data-qa="play">' + ic('speaker') + ' Anhören</button><button class="btn soft sm" data-qa="slow">Langsam</button></div>';
      h += '<div class="qtext">' + esc(q.q) + '</div>';
      if (q.t === 'mcq') h += '<div class="opts">' + q.o.map(function (o, k) { return '<button class="opt" data-k="' + k + '"><span class="k">' + LET[k] + '</span><span>' + esc(o) + '</span></button>'; }).join('') + '</div>';
      else if (q.t === 'order') h += '<div class="tok ans" id="qans" aria-label="Dein Satz"></div><div class="tok" id="qbank">' + q.tokens.map(function (t, k) { return '<button data-t="' + k + '">' + esc(t) + '</button>'; }).join('') + '</div><button class="btn" data-qa="check">Prüfen</button>';
      else h += '<input class="type" id="qin" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Deine Antwort"><div style="margin-top:12px"><button class="btn" data-qa="check">Prüfen</button></div>';
      h += '<div id="qfb"></div>';
      if (cfg.skip) h += '<div style="margin-top:14px"><button class="btn soft sm" data-qa="skip">Weiß nicht</button></div>';
      root.innerHTML = h + '</div>';
      var inp = LG.$('#qin', root); if (inp) { inp.focus(); inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } }; }
      LG.$$('.opt', root).forEach(function (b) { b.onclick = function () { if (!locked) pick(+b.dataset.k); }; });
      LG.$$('#qbank button', root).forEach(function (b) { b.onclick = function () { if (locked) return; var k = +b.dataset.t; st.order.push(k); b.hidden = true; renderOrder(); }; });
      LG.$$('[data-qa]', root).forEach(function (b) { b.onclick = function () { var a = b.dataset.qa; if (a === 'play') LG.speak(q.audio, { rate: LG.settings.rate }); else if (a === 'slow') LG.speak(q.audio, { rate: .6 }); else if (a === 'check') check(); else if (a === 'skip') finishQ(undefined, false); }; });
    }
    function renderOrder() {
      var q = qs[i], box = LG.$('#qans', root); box.innerHTML = st.order.map(function (k, n) { return '<button data-n="' + n + '">' + esc(q.tokens[k]) + '</button>'; }).join('');
      LG.$$('button', box).forEach(function (b) { b.onclick = function () { if (locked) return; var n = +b.dataset.n, k = st.order.splice(n, 1)[0]; LG.$('#qbank [data-t="' + k + '"]', root).hidden = false; renderOrder(); }; });
    }
    function pick(k) { finishQ(k, C.checkAnswer(qs[i], k)); }
    function check() {
      var q = qs[i]; if (locked) return;
      if (q.t === 'order') { if (!st.order.length) return; var s = st.order.map(function (k) { return q.tokens[k]; }).join(' '); finishQ(s, C.checkAnswer(q, s)); }
      else { var v = LG.$('#qin', root).value; if (!v.trim()) return; finishQ(v, C.checkAnswer(q, v)); }
    }
    function finishQ(ans, ok) {
      var q = qs[i]; if (locked) return; locked = true; answers[i] = ans; oks[i] = !!ok;
      if (q.wid) LG.srsAnswer(q.wid, !!ok);
      if (cfg.onAnswer) cfg.onAnswer(q, !!ok, i);
      if (!cfg.feedback) return next();
      if (q.t === 'mcq') LG.$$('.opt', root).forEach(function (b, k) { b.disabled = true; if (k === q.a) b.classList.add('right'); else if (k === ans) b.classList.add('wrong'); });
      var fb = LG.$('#qfb', root);
      fb.innerHTML = '<div class="feedback ' + (ok ? 'ok' : 'no') + '">' + (ok ? 'Richtig!' : (ans === undefined ? 'Die richtige Antwort:' : 'Leider falsch. Richtig ist:') + ' <b>' + esc(correctText(q)) + '</b>') + (q.exp ? '<div style="font-weight:500;margin-top:6px">' + esc(q.exp) + '</div>' : '') + '</div>' + (ok ? '' : '<div style="margin-top:10px"><button class="btn sm soft" id="qwhy">Warum falsch? / Why wrong?</button><div id="qwhybox"></div></div>') + '<div style="margin-top:12px"><button class="btn" id="qnext">' + (i + 1 < qs.length ? 'Weiter ›' : 'Ergebnis ansehen') + '</button></div>';
      var wb = LG.$('#qwhy', root); if (wb) wb.onclick = function () { wb.hidden = true; LG.explainWrong(q, ans, LG.$('#qwhybox', root)); };
      var nb = LG.$('#qnext', root); nb.focus(); nb.onclick = next;
      LG.$$('[data-qa=check],[data-qa=skip]', root).forEach(function (b) { b.hidden = true; });
    }
    function next() { i++; if (i < qs.length) draw(); else done(); }
    function done() {
      var correct = oks.filter(Boolean).length, res = { qs: qs, answers: answers, oks: oks, correct: correct, total: qs.length, pct: Math.round(correct / qs.length * 100) };
      if (cfg.onDone) cfg.onDone(res);
      if (cfg.finish) return cfg.finish(res, root);
      root.innerHTML = summary(res, cfg.title);
      if (cfg.again) { var ab = LG.$('#again', root); if (ab) ab.onclick = cfg.again; }
      LG.$$('.review-item[data-wk]', root).forEach(function (el) { var k = +el.dataset.wk, b = document.createElement('button'); b.className = 'btn sm soft'; b.style.marginTop = '8px'; b.textContent = 'Warum falsch? / Why wrong?'; var box = document.createElement('div'); el.appendChild(b); el.appendChild(box); b.onclick = function () { b.hidden = true; LG.explainWrong(res.qs[k], res.answers[k], box); }; });
    }
    draw();
  };
  function summary(res, title) {
    var wrong = res.qs.map(function (q, k) { return res.oks[k] ? '' : '<div class="review-item" data-wk="' + k + '"><b>' + esc(q.q) + '</b>Richtig: ' + esc(q.t === 'mcq' ? q.o[q.a] : q.t === 'order' ? q.ans : q.ans[0]) + (q.exp ? '<br><small class="muted">' + esc(q.exp) + '</small>' : '') + '</div>'; }).join('');
    return '<div class="qbox result"><h2>' + esc(title || 'Ergebnis') + '</h2><div class="ring" style="--p:' + res.pct + '"><div>' + res.pct + ' %</div></div><p><b>' + res.correct + ' von ' + res.total + '</b> richtig</p>' + (wrong ? '<h3 style="text-align:left">Zum Wiederholen</h3>' + wrong : '<p>Fehlerfrei! 🎉</p>') + '<button class="btn" id="again">Noch einmal</button></div>';
  }

  /* ---------- speaking practice ---------- */
  var rec = null;
  function diff(target, heard) {
    var t = target.replace(/[.,!?;:„“"]/g, '').split(/\s+/), h = heard.toLowerCase().replace(/[.,!?;:„“"]/g, '').split(/\s+/).filter(Boolean), pool = h.slice(), okc = 0;
    var html = t.map(function (w) { var k = pool.indexOf(w.toLowerCase()); if (k > -1) { pool.splice(k, 1); okc++; return '<span class="ok">' + esc(w) + '</span>'; } return '<span class="no">' + esc(w) + '</span>'; }).join(' ');
    return { html: html, score: Math.round(okc / t.length * 100) };
  }
  LG.recordSentence = function (btn) {
    var card = btn.closest('.speak'), out = LG.$('.out', card), text = btn.dataset.t, SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    LG.stopSpeak(); if (rec) { try { rec.stop(); } catch (e) {} rec = null; }
    function tally() { var n = LG.pg.speakTries = (LG.pg.speakTries || 0) + 1; if (n >= 2) { var m = /level\/(\d+)/.exec(location.hash); if (m) LG.markStep(+m[1], 'speak'); } }
    if (SR) {
      var r = rec = new SR(); r.lang = 'de-DE'; r.interimResults = false; r.maxAlternatives = 3;
      btn.classList.add('pulse'); out.textContent = 'Sprich jetzt …';
      r.onresult = function (e) { var best = e.results[0][0].transcript, d = diff(text, best); out.innerHTML = '<div class="diff">' + d.html + '</div><p style="margin:8px 0 0"><b>' + d.score + ' %</b> der Wörter erkannt. Erkannt: „' + esc(best) + '“</p>' + (d.score >= 100 ? '<p>Perfekt!</p>' : '<p class="muted">Rot = Wort wurde nicht erkannt. Höre den Satz noch einmal und versuche es erneut.</p>'); tally(); };
      r.onerror = function (e) { out.textContent = e.error === 'not-allowed' ? 'Mikrofon nicht erlaubt. Erlaube den Zugriff in den Browser-Einstellungen.' : e.error === 'no-speech' ? 'Nichts gehört. Versuche es noch einmal.' : 'Spracherkennung nicht möglich (' + e.error + ').'; };
      r.onend = function () { btn.classList.remove('pulse'); };
      try { r.start(); } catch (e) { out.textContent = 'Spracherkennung konnte nicht starten.'; }
      return;
    }
    if (!(navigator.mediaDevices && window.MediaRecorder)) { out.textContent = 'Aufnahme wird von diesem Browser nicht unterstützt.'; return; }
    if (btn._mr && btn._mr.state === 'recording') { btn._mr.stop(); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var chunks = [], mr = btn._mr = new MediaRecorder(stream); btn.classList.add('pulse'); btn.innerHTML = ic('stop') + ' Stopp'; out.textContent = 'Aufnahme läuft … (tippe auf Stopp)';
      mr.ondataavailable = function (e) { chunks.push(e.data); };
      mr.onstop = function () { stream.getTracks().forEach(function (t) { t.stop(); }); btn.classList.remove('pulse'); btn.innerHTML = ic('mic') + ' Aufnehmen'; var blob = new Blob(chunks, { type: mr.mimeType }), url = URL.createObjectURL(blob);
        out.innerHTML = '<p class="muted" style="margin:0 0 6px">Deine Aufnahme – vergleiche sie mit dem Original (ohne automatische Bewertung):</p><audio controls src="' + url + '" style="width:100%"></audio>'; tally(); };
      mr.start(); setTimeout(function () { if (mr.state === 'recording') mr.stop(); }, 12000);
    }).catch(function () { out.textContent = 'Mikrofon nicht erlaubt. Erlaube den Zugriff in den Browser-Einstellungen.'; });
  };

  /* ---------- level test ---------- */
  LG.views.levelTest = function (params) {
    var n = +params[0]; if (n < 1 || n > 30 || !C.isUnlocked(LG.pg, n)) { LG.toast('Diese Stufe ist gesperrt.', true); return LG.go('/levels'); }
    var lv = D.LEVELS[n - 1];
    return { title: 'Stufentest ' + n, heading: 'Stufentest · ' + lv.t, html: '<div class="crumb"><a href="#/levels">Lernen</a> › <a href="#/level/' + n + '">Stufe ' + n + '</a> › Test</div><div class="card" id="tbox"></div>',
      mount: function () { startTest(n); } };
  };
  function startTest(n) {
    var lv = D.LEVELS[n - 1], box = LG.$('#tbox');
    box.innerHTML = '<div class="qbox result"><h2>Stufentest ' + n + '</h2><p>' + esc(lv.t) + '</p><p class="muted">10 Fragen zu Wortschatz, Grammatik, Lesen, Hören und Satzbau. Zum Bestehen brauchst du mindestens <b>' + LG.needed(10) + ' richtige Antworten (75 %)</b>.</p><button class="btn" id="go">Test starten</button></div>';
    LG.$('#go', box).onclick = function () {
      var qs = C.makeLevelTest(D, P, n, Math.random).map(function (q) { return C.prepareQ(q); });
      LG.quiz({ root: box, qs: qs, feedback: true, title: 'Stufentest ' + n, finish: function (res) {
        var pass = res.correct >= LG.needed(res.total); LG.recordTest('level', n, res.correct, res.total);
        var prev = LG.pg.passed[n]; if (pass) { LG.completeLevel(n, res.correct, res.total); if (prev && prev.score > res.pct) LG.pg.passed[n].score = prev.score; LG.save(); LG.confetti(); } else LG.save();
        var next = (C.isStageEnd(n) && !LG.stageDone(D.LEVELS[n - 1].c)) ? '<a class="btn" href="#/exam/' + (C.stageIdx(n) + 1) + '">Abschlussprüfung ' + D.LEVELS[n - 1].c + ' ›</a>' : n < 30 ? '<a class="btn" href="#/level/' + (n + 1) + '">Nächste Stufe ›</a>' : '<a class="btn" href="#/exam/final">Gesamtprüfung ›</a>';
        box.innerHTML = summary(res, pass ? 'Bestanden!' : 'Noch nicht bestanden').replace('<button class="btn" id="again">Noch einmal</button>',
          '<p>' + (pass ? 'Starke Leistung! Die nächste Stufe ist freigeschaltet.' : 'Du brauchst ' + LG.needed(res.total) + ' richtige Antworten. Wiederhole die Lektion und versuche es erneut.') + '</p><div class="row" style="justify-content:center">' + (pass ? next : '<a class="btn" href="#/level/' + n + '">Lektion wiederholen</a>') + '<button class="btn soft" id="again">Test wiederholen</button></div>');
        LG.$('#again', box).onclick = function () { startTest(n); };
      } });
    };
  }

  /* ---------- stage exams and the comprehensive final exam ---------- */
  LG.views.stageExam = function (params) {
    var isFinal = params[0] === 'final', s = isFinal ? 0 : +params[0], name = isFinal ? 'Gesamtprüfung' : (LG.STAGES[s - 1] || [])[0];
    if (!name) return LG.go('/levels');
    if (isFinal ? !LG.allStagesDone() : !LG.stageLevelsDone(s - 1)) { LG.toast(isFinal ? 'Schließe zuerst alle Niveaus ab.' : 'Schließe zuerst alle Stufen dieses Niveaus ab.', true); return LG.go('/levels'); }
    var title = isFinal ? 'Gesamtprüfung' : 'Abschlussprüfung ' + name;
    return { title: title, heading: title, html: '<div class="crumb"><a href="#/levels">Lernen</a> › ' + title + '</div><div class="card" id="tbox"></div>', mount: function () { startExam(isFinal ? 'final' : s); } };
  };
  function startExam(s) {
    var isFinal = s === 'final', name = isFinal ? 'Gesamtprüfung' : LG.STAGES[s - 1][0], N = isFinal ? 40 : 20, box = LG.$('#tbox'), key = isFinal ? 'FINAL' : name;
    box.innerHTML = '<div class="qbox result"><h2>' + (isFinal ? 'Gesamtprüfung' : 'Abschlussprüfung ' + name) + '</h2><p class="muted">' + N + ' Fragen aus ' + (isFinal ? 'allen 30 Stufen' : 'allen Stufen dieses Niveaus') + '. Zum Bestehen brauchst du mindestens <b>' + LG.needed(N) + ' richtige Antworten (75 %)</b>.' + (isFinal ? ' Danach erhältst du dein Abschlusszertifikat mit deiner Punktzahl.' : ' Danach wird das nächste Niveau freigeschaltet.') + '</p><button class="btn" id="go">Prüfung starten</button></div>';
    LG.$('#go', box).onclick = function () {
      var qs = (isFinal ? C.makeFinalExam(D, P, Math.random) : C.makeStageExam(D, P, s - 1, Math.random)).map(function (q) { return C.prepareQ(q); });
      LG.quiz({ root: box, qs: qs, feedback: true, title: isFinal ? 'Gesamtprüfung' : 'Prüfung ' + name, finish: function (res) {
        var pass = res.correct >= LG.needed(res.total); LG.recordTest(isFinal ? 'final' : 'exam', isFinal ? 0 : s, res.correct, res.total);
        if (pass) { var old = LG.pg.stagePassed[key]; LG.pg.stagePassed[key] = { score: Math.max(res.pct, old && old.score || 0), date: old && old.date || Date.now(), first: old && old.first || Date.now() }; LG.addXP(isFinal ? 300 : 100); LG.checkAch(); LG.confetti(); }
        LG.save();
        var next = !pass ? '<a class="btn" href="#/levels">Stufen wiederholen</a>' : isFinal ? '<a class="btn" href="#/certificates">' + ic('award') + ' Zertifikate ansehen</a>' : s === LG.STAGES.length ? '<a class="btn" href="#/exam/final">Weiter zur Gesamtprüfung ›</a>' : '<a class="btn" href="#/level/' + (C.RANGES[s][1]) + '">Weiter mit ' + LG.STAGES[s] + ' ›</a>';
        box.innerHTML = summary(res, pass ? 'Prüfung bestanden!' : 'Noch nicht bestanden').replace('<button class="btn" id="again">Noch einmal</button>', '<div class="row" style="justify-content:center">' + next + '<button class="btn soft" id="again">Prüfung wiederholen</button></div>');
        LG.$('#again', box).onclick = function () { startExam(s); };
      } });
    };
  }

  /* ---------- placement test ---------- */
  LG.views.placement = function () {
    if (LG.pg.placementDone) return LG.go('/');
    return { title: 'Einstufungstest', heading: 'Einstufungstest', bare: false, html: '<div class="card" id="pbox"></div>', mount: function () { intro(); } };
  };
  function intro() {
    var box = LG.$('#pbox');
    box.innerHTML = '<div class="qbox result"><h2>Willkommen, ' + esc(LG.S.user.name.split(' ')[0]) + '!</h2><p>Bevor du startest, finden wir dein Niveau heraus. Der Test hat <b>30 Fragen</b> zu Wortschatz, Grammatik, Lesen, Hören, Satzbau und Schreiben – von leicht bis schwer.</p><p class="muted">Wähle „Weiß nicht“, wenn du eine Antwort nicht kennst. Ohne Vorkenntnisse beginnst du bei Stufe 1 (Pre-A1) mit Buchstaben und Zahlen. Für die Hörfragen brauchst du den Ton.</p><button class="btn" id="go">Test starten</button></div>';
    LG.$('#go', box).onclick = function () {
      var qs = D.PLACEMENT.map(function (q) { return C.prepareQ(q); });
      LG.quiz({ root: box, qs: qs, feedback: false, skip: true, title: 'Einstufungstest', finish: function (res) { result(qs, res.answers); } });
    };
  }
  function result(qs, answers) {
    var box = LG.$('#pbox'), r = C.scorePlacement(qs, answers), n = r.start, lv = D.LEVELS[n - 1], names = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    var skills = Object.keys(r.skills).map(function (k) { var s = r.skills[k], p = Math.round(s.ok / s.n * 100); return '<div class="skillrow"><span>' + esc(k) + '</span><div class="bar"><i style="width:' + p + '%"></i></div><b>' + p + ' %</b></div>'; }).join('');
    var sorted = Object.keys(r.skills).map(function (k) { return [k, r.skills[k].ok / r.skills[k].n]; }).sort(function (a, b) { return b[1] - a[1]; });
    var strong = sorted.filter(function (x) { return x[1] >= .6; }).slice(0, 2).map(function (x) { return x[0]; }), weak = sorted.filter(function (x) { return x[1] < .6; }).slice(-2).map(function (x) { return x[0]; });
    var bands = r.band.map(function (b, k) { return '<div class="resrow"><span>' + names[k] + '</span><b>' + b + ' / 5</b></div>'; }).join('');
    box.innerHTML = '<div class="qbox result"><h2>Dein Ergebnis</h2><div class="ring" style="--p:' + Math.round(r.total / 30 * 100) + '"><div>' + r.total + '/30</div></div><p>Dein Startpunkt: <b>Stufe ' + n + ' · ' + lv.c + '</b><br><span class="muted">' + esc(lv.t) + '</span></p>' +
      (n > 1 ? '<p class="note">Die Stufen 1–' + (n - 1) + ' gelten durch den Test als übersprungen. Du kannst sie jederzeit im Bereich „Lernen“ wiederholen.</p>' : '<p class="note">Du beginnst ganz am Anfang – genau richtig.</p>') +
      '<h3 style="text-align:left">Fertigkeiten</h3>' + skills + '<h3 style="text-align:left;margin-top:14px">Niveaus</h3>' + bands +
      '<p style="margin-top:14px;text-align:left">' + (strong.length ? '<b>Stärken:</b> ' + esc(strong.join(', ')) + '. ' : '') + (weak.length ? '<b>Du solltest üben:</b> ' + esc(weak.join(', ')) + '.' : 'Du hast keine auffälligen Schwächen.') + '</p><button class="btn" id="begin">Mit Stufe ' + n + ' beginnen ›</button></div>';
    LG.$('#begin', box).onclick = function () {
      C.applyPlacement(LG.pg, n); LG.pg.tests.push({ kind: 'placement', level: n, score: r.total, total: 30, pct: Math.round(r.total / 30 * 100), ts: Date.now() }); LG.save(true); LG.confetti(); LG.go('/');
    };
  }
})();
