/* Languway German – study path: Level > Unit > Lesson, one wordbook per lesson (opens after the lesson is done) */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, D = LG.D, esc = LG.esc, ic = LG.ic;
  var STEPS = LG.STEPS, STEP = {}; STEPS.forEach(function (s) { STEP[s[0]] = s; });
  var UNITS = [{ t: 'Verstehen', steps: ['intro', 'vocab', 'grammar', 'listen'] }, { t: 'Anwenden', steps: ['speak', 'read', 'write', 'practice'] }];
  var SRC = { grammar: 'g', listen: 'ls', speak: 'sp', read: 'rd', write: 'wr' };
  LG.UNITS = UNITS;
  function done(n, s) { return !!LG.pg.done['L' + n + ':' + s]; }
  LG.lessonDone = done;

  /* the 8 lessons of a level with unit / number / state */
  LG.lessonList = function (n) {
    var out = [], prevOk = true, passed = !!LG.pg.passed[n];
    UNITS.forEach(function (u, ui) {
      u.steps.forEach(function (s, k) {
        var d = passed || done(n, s), locked = !prevOk && !d;
        out.push({ n: n, step: s, unit: ui + 1, no: k + 1, title: STEP[s][2], icon: STEP[s][1], done: d, locked: locked, current: false });
        prevOk = prevOk && d;
      });
    });
    for (var i = 0; i < out.length; i++) if (!out[i].done && !out[i].locked) { out[i].current = true; break; }
    return out;
  };
  LG.currentLesson = function () {
    var n = C.currentLevel(LG.pg), l = LG.lessonList(n).filter(function (x) { return x.current; })[0];
    return l || { n: n, step: 'test', unit: 2, no: 4, title: 'Stufentest', done: false, locked: false, current: true };
  };
  LG.lessonHref = function (l) { return l.step === 'test' ? '#/test/' + l.n : '#/level/' + l.n + '?step=' + l.step; };
  LG.lessonLabel = function (l) { return l.step === 'test' ? 'Stufentest' : 'Einheit ' + l.unit + ' · Lektion ' + l.no; };

  /* words that belong to one lesson: the vocabulary lesson owns all words of the level, other lessons own the words they use */
  function forms(w) {
    var f = [w.lemma]; ['plural', 'comp', 'sup'].forEach(function (k) { if (w[k] && w[k] !== '-') f.push(w[k]); });
    if (w.type === 'v') { try { var c = C.conjugate(w); f = f.concat(c.pres.slice(0, 6), c.pret.slice(0, 6), [c.pp]); } catch (e) { /* no forms */ } }
    return f.map(function (x) { return String(x).toLowerCase().split(/[\s/]+/).pop(); }).filter(function (x) { return x.length > 2; });
  }
  function textOf(lv, step) {
    var v = lv[SRC[step]]; if (!v) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.join(' ');
    return [v.t, v.title, (v.p || []).join(' '), (v.ex || []).join(' '), (v.lines || []).join(' '), v.text].join(' ');
  }
  LG.lessonWords = function (n, step) {
    var all = LG.levelWords(n);
    if (step === 'vocab' || step === 'practice' || step === 'intro') return all;
    var t = textOf(D.LEVELS[n - 1], step).toLowerCase(), hit = all.filter(function (w) { return forms(w).some(function (f) { return t.indexOf(f) > -1; }); });
    if (hit.length) return hit;
    var i = Object.keys(SRC).indexOf(step), per = Math.max(1, Math.ceil(all.length / 5)); return all.slice(i * per, i * per + per);
  };

  /* ---------- level list: levels > units > lessons ---------- */
  LG.views.levels = function () {
    var out = '', hidden = false, cur = LG.currentLesson();
    LG.STAGES.forEach(function (s, si) {
      if (hidden) return;
      var from = C.RANGES[si][1], to = C.RANGES[si][2];
      if (!C.isUnlocked(LG.pg, from)) { hidden = true; out += '<div class="stagehead"><span class="tag">' + s[0] + '</span><h2>Noch gesperrt</h2></div><div class="exambox lock">' + ic('lock') + '<div><b>Niveau ' + s[0] + '</b><div class="muted">Schließe zuerst alle Stufen und die Abschlussprüfung des vorherigen Niveaus ab.</div></div></div>'; return; }
      var cards = '';
      for (var n = from; n <= to; n++) {
        var st = LG.levelStatus(n), list = st === 'lock' ? [] : LG.lessonList(n), nd = list.filter(function (x) { return x.done; }).length, lv = D.LEVELS[n - 1];
        if (st === 'lock') { cards += '<div class="lvc lock" data-act="locked"><span class="lvc__n">' + n + '</span><div><b>Stufe ' + n + ' gesperrt</b><small>Bestehe zuerst Stufe ' + (n - 1) + '.</small></div>' + ic('lock') + '</div>'; continue; }
        var open = n === cur.n;
        cards += '<details class="lvc ' + st + '"' + (open ? ' open' : '') + '><summary><span class="lvc__n">' + n + '</span><div><b>' + esc(lv.t) + '</b><div class="bar"><i style="width:' + (st === 'done' ? 100 : Math.round(nd / 8 * 100)) + '%"></i></div><small>' + (st === 'done' ? 'Abgeschlossen' : nd + ' von 8 Lektionen') + '</small></div>' + ic('chevron') + '</summary><div class="lvc__body">' +
          UNITS.map(function (u, ui) {
            return '<div class="unit"><h4>Einheit ' + (ui + 1) + ' · ' + u.t + '</h4>' + list.filter(function (x) { return x.unit === ui + 1; }).map(function (l) {
              var wb = l.done ? '<a class="les__wb" href="#/level/' + n + '/words/' + l.step + '">' + ic('list') + ' Wörter</a>' : '<span class="les__wb off" title="Schließe die Lektion ab, um die Wörter zu öffnen">' + ic('lock') + ' Wörter</span>';
              return '<div class="les' + (l.current ? ' now' : '') + (l.done ? ' ok' : '') + (l.locked ? ' lk' : '') + '">' + (l.locked ? '<span class="les__i" data-act="locked">' + ic('lock') + '</span>' : '<a class="les__i" href="' + LG.lessonHref(l) + '">' + ic(l.done ? 'check' : l.icon) + '</a>') + '<div class="les__t">' + (l.locked ? '<b>Lektion ' + l.no + ' · ' + l.title + '</b>' : '<a href="' + LG.lessonHref(l) + '"><b>Lektion ' + l.no + ' · ' + l.title + '</b></a>') + '<small>' + (l.done ? 'Erledigt' : l.locked ? 'Gesperrt' : l.current ? 'Als Nächstes' : 'Bereit') + '</small></div>' + wb + '</div>';
            }).join('') + '</div>';
          }).join('') + '<a class="les test' + (nd === 8 ? '' : ' lk') + '" href="' + (nd === 8 ? '#/test/' + n : '#/levels') + '" data-act="' + (nd === 8 ? '' : 'locked') + '"><span class="les__i">' + ic(nd === 8 ? 'target' : 'lock') + '</span><div class="les__t"><b>Stufentest</b><small>75 % zum Bestehen</small></div></a></div></details>';
      }
      var ready = LG.stageLevelsDone(si), passed = LG.stageDone(s[0]);
      out += '<div class="stagehead"><span class="tag">' + s[0] + '</span><h2>' + s[1] + ' – ' + s[2] + '</h2></div><div class="lvlist">' + cards + '</div><div class="exambox' + (ready || passed ? '' : ' lock') + '">' + ic(passed ? 'award' : ready ? 'target' : 'lock') + '<div style="flex:1;min-width:0"><b>Abschlussprüfung ' + s[0] + '</b><div class="muted">' + (passed ? 'Bestanden' : ready ? '20 Fragen · 75 % zum Bestehen' : 'Schließe zuerst alle Stufen dieses Niveaus ab.') + '</div></div>' + (ready && !passed ? '<a class="btn sm" href="#/exam/' + (si + 1) + '">Starten</a>' : '') + '</div>';
    });
    if (!hidden) { var fin = LG.pg.stagePassed.FINAL, ok = LG.allStagesDone(); out += '<div class="stagehead"><span class="tag">Final</span><h2>Gesamtprüfung</h2></div><div class="exambox' + (ok ? '' : ' lock') + '">' + ic(fin ? 'award' : ok ? 'target' : 'lock') + '<div style="flex:1;min-width:0"><b>Umfassende Gesamtprüfung</b><div class="muted">' + (fin ? 'Bestanden' : ok ? '40 Fragen · danach erhältst du das Abschlusszertifikat' : 'Wird nach allen Niveaus freigeschaltet.') + '</div></div>' + (ok && !fin ? '<a class="btn sm" href="#/exam/final">Starten</a>' : '') + '</div>'; }
    return { title: 'Lektionen', heading: 'Meine Lektionen', html: '<p class="muted">Stufe → Einheit → Lektion. Jede Lektion hat ihr eigenes Wörterbuch; es öffnet sich, sobald du die Lektion abgeschlossen hast.</p>' + out };
  };

  /* ---------- wordbook of one lesson ---------- */
  LG.views.lessonWords = function (params) {
    var n = +params[0], step = params[1];
    if (!STEP[step] || n < 1 || n > 30 || !C.isUnlocked(LG.pg, n)) return LG.go('/levels');
    if (!LG.pg.passed[n] && !done(n, step)) { LG.toast('Schließe zuerst diese Lektion ab, dann öffnet sich ihr Wörterbuch.', true); return LG.go('/levels'); }
    var ws = LG.lessonWords(n, step), l = LG.lessonList(n).filter(function (x) { return x.step === step; })[0];
    return { title: 'Wörterbuch', heading: 'Wörterbuch · Lektion ' + l.no, back: '/levels', html: '<div class="crumb">Stufe ' + n + ' › Einheit ' + l.unit + ' › Lektion ' + l.no + ' · ' + l.title + '</div>' + (ws.length ? ws.map(LG.wordCard).join('') : '<div class="card empty">In dieser Lektion kommen keine neuen Wörter vor.</div>') + '<div class="row" style="margin-top:14px"><a class="btn soft" href="#/levels">' + ic('back') + ' Zurück zu den Lektionen</a></div>' };
  };

  /* ---------- lesson page: sequential tabs, locked until previous lesson is done ---------- */
  var oldStep = LG.act.step;
  LG.act.step = function (t) {
    var l = LG.lessonList(+t.dataset.n).filter(function (x) { return x.step === t.dataset.s; })[0];
    if (l && l.locked) { LG.toast('Schließe zuerst die vorherige Lektion ab.', true); return; }
    oldStep(t);
  };
  var oldLesson = LG.views.lesson;
  LG.views.lesson = function (params, q) {
    var n = +params[0], req = q.get('step');
    if (req && STEP[req]) { var li = LG.lessonList(n).filter(function (x) { return x.step === req; })[0]; if (li && li.locked) { LG.toast('Schließe zuerst die vorherige Lektion ab.', true); return LG.go('/level/' + n); } }
    return oldLesson(params, q);
  };
})();
