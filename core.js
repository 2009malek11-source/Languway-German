/* Language German - core logic (UMD): word parsing, conjugation, tests, scoring, unlocking, PDF. */
(function (root) {
  'use strict';
  var ART = { m: 'der', f: 'die', n: 'das' };
  var RANGES = [['Pre-A1', 1, 2], ['A1', 3, 5], ['A2', 6, 10], ['B1', 11, 15], ['B2', 16, 20], ['C1', 21, 25], ['C2', 26, 30]];
  var STAGES = RANGES.map(function (r) { return r[0]; });

  // ---------- helpers ----------
  function mulberry(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(a, rnd) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor((rnd || Math.random)() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a, n, rnd) { return shuffle(a, rnd).slice(0, n); }
  function norm(s) { return String(s || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function normExact(s) { return String(s || '').toLowerCase().replace(/[.,!?;:"„“”]/g, '').replace(/\s+/g, ' ').trim(); }
  function stageIdx(n) { for (var i = 0; i < RANGES.length; i++) if (n >= RANGES[i][1] && n <= RANGES[i][2]) return i; return RANGES.length - 1; }
  function stageOf(n) { return STAGES[stageIdx(n)]; }
  function isStageEnd(n) { return RANGES[stageIdx(n)][2] === n; }

  // ---------- word parsing ----------
  function parseWord(line, id, level) {
    var f = line.split('|'), t = f[0], w = { id: id, type: t, level: level };
    if (t === 'n') { w.gender = f[1]; w.lemma = f[2]; w.plural = f[3]; w.en = f[4]; w.defDE = f[5]; w.defEN = f[6]; w.ex = f[7]; w.article = ART[f[1]]; w.display = ART[f[1]] + ' ' + f[2]; }
    else if (t === 'v') { w.lemma = f[1]; w.erForm = f[2]; w.pret = f[3]; w.pp = f[4]; w.en = f[5]; w.defDE = f[6]; w.defEN = f[7]; w.ex = f[8]; w.display = f[1]; }
    else if (t === 'a') { w.lemma = f[1]; w.comp = f[2]; w.sup = f[3]; w.en = f[4]; w.defDE = f[5]; w.defEN = f[6]; w.ex = f[7]; w.display = f[1]; }
    else { w.lemma = f[1]; w.pos = ({ Pron: 'Pronomen', Konj: 'Konjunktion', Adv: 'Adverb', Part: 'Partikel', Interj: 'Interjektion', Präp: 'Präposition', Prep: 'Präposition', Num: 'Zahlwort', Art: 'Artikel' })[f[2]] || f[2]; w.en = f[3]; w.defDE = f[4]; w.defEN = f[5]; w.ex = f[6]; w.display = f[1]; }
    w.gloss = (w.en || '').split(/[,;]/)[0].trim();
    return w;
  }
  function parseAll(content) {
    var words = [], byId = {};
    content.LEVELS.forEach(function (lv, i) { lv.w.forEach(function (l, j) { var w = parseWord(l, 'w' + (i + 1) + '_' + j, i + 1); words.push(w); byId[w.id] = w; }); });
    (content.EXTRA || []).forEach(function (l, j) { var w = parseWord(l, 'x' + j, 0); words.push(w); byId[w.id] = w; });
    return { words: words, byId: byId };
  }

  // ---------- conjugation ----------
  var needE = /(t|d|[bdfgkpt]n|[bdfgkpt]m|chn|chm)$/;
  var PRON = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];
  var PRET_DU = { 'aß': 'aßest', 'saß': 'saßest', 'maß': 'maßest', 'vergaß': 'vergaßest' };
  function conjugate(w) {
    if (w.type !== 'v') return null;
    var inf = w.lemma, stem = inf.replace(/e?n$/, ''), pres;
    if (w.erForm && w.erForm.indexOf(',') > -1) {
      pres = w.erForm.split(',').map(function (s) { return s.trim(); });
    } else {
      var ich = (/eln$/.test(inf) ? stem.slice(0, -2) + 'l' : stem) + 'e', er, du, esc = /[sßxz]$/;
      if (w.erForm && w.erForm !== '-') {
        er = w.erForm; var es = er.replace(/t$/, '');
        du = esc.test(es) ? es + 't' : es + 'st';
      } else {
        er = stem + (needE.test(stem) ? 'et' : 't');
        du = stem + (esc.test(stem) ? 't' : (needE.test(stem) ? 'est' : 'st'));
      }
      pres = [ich, du, er, inf, stem + (needE.test(stem) ? 'et' : 't'), inf];
    }
    var p = w.pret, pretT;
    if (/,/.test(p)) pretT = p.split(',').map(function (s) { return s.trim(); });
    else {
      var weak = /te$/.test(p), duF;
      if (PRET_DU[p]) duF = PRET_DU[p];
      else if (weak) duF = p + 'st';
      else duF = p + (/[sßxz]$/.test(p) ? 't' : (/[td]$/.test(p) ? 'est' : 'st'));
      var wirF = /e$/.test(p) ? p + 'n' : p + 'en';
      var ihrF = weak ? p + 't' : (/[td]$/.test(p) ? p + 'et' : p + 't');
      pretT = [p, duF, p, wirF, ihrF, wirF];
    }
    var m = /^([hs]):(.*)$/.exec(w.pp), aux = m[1] === 's' ? 'sein' : 'haben', pp = m[2];
    var auxF = aux === 'sein' ? ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'] : ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'];
    var perf = auxF.map(function (a) { return a + ' ' + pp; });
    return { pres: pres, pret: pretT, perf: perf, aux: aux, pp: pp, pron: PRON };
  }
  function allForms(w) {
    var s = [];
    if (w.type === 'v') { var c = conjugate(w); s = c.pres.concat(c.pret, [c.pp, w.lemma]); }
    else if (w.type === 'n') { s = [w.lemma]; if (w.plural && w.plural !== '-') s.push(w.plural); }
    else if (w.type === 'a') { s = [w.lemma]; if (w.comp && w.comp !== '-') s.push(w.comp); if (w.sup && w.sup !== '-') s.push(w.sup.replace(/^am /, '').replace(/en$/, '')); }
    else s = [w.lemma];
    return s.filter(Boolean);
  }

  // ---------- question builders ----------
  function distract(words, w, n, rnd, getter) {
    var pool = words.filter(function (x) { return x.id !== w.id && x.type === w.type && getter(x) !== getter(w); });
    if (pool.length < n) pool = words.filter(function (x) { return x.id !== w.id && getter(x) !== getter(w); });
    var seen = {}, out = [];
    shuffle(pool, rnd).forEach(function (x) { var g = getter(x); if (!seen[g] && out.length < n) { seen[g] = 1; out.push(g); } });
    return out;
  }
  function optsWith(correct, wrong, rnd) { var o = shuffle([correct].concat(wrong), rnd); return { o: o, a: o.indexOf(correct) }; }
  function tokens(s) { return s.replace(/[.!?]$/, '').split(' '); }

  function qDeEn(w, pool, rnd) {
    var x = optsWith(w.gloss, distract(pool, w, 3, rnd, function (y) { return y.gloss; }), rnd);
    return { wid: w.id, t: 'mcq', k: 'Wortschatz', q: 'Was bedeutet „' + w.display + '“?', o: x.o, a: x.a, exp: w.display + ' = ' + w.en + '. ' + w.ex };
  }
  function qEnDe(w, pool, rnd) {
    var x = optsWith(w.display, distract(pool, w, 3, rnd, function (y) { return y.display; }), rnd);
    return { wid: w.id, t: 'mcq', k: 'Wortschatz', q: 'Wie sagt man „' + w.gloss + '“ auf Deutsch?', o: x.o, a: x.a, exp: w.display + ' = ' + w.en + '. ' + w.ex };
  }
  function qArticle(w, rnd) {
    var o = ['der', 'die', 'das'];
    return { wid: w.id, t: 'mcq', k: 'Grammatik', q: 'Welcher Artikel passt? ___ ' + w.lemma, o: o, a: o.indexOf(w.article), exp: w.display + ' (Plural: ' + (w.plural === '-' ? 'kein Plural' : 'die ' + w.plural) + '). ' + w.ex };
  }
  function qGap(w, pool, rnd) {
    var forms = allForms(w).sort(function (a, b) { return b.length - a.length; }), toks = w.ex.split(' '), idx = -1, hit = null, i, j;
    for (i = 0; i < toks.length && idx < 0; i++) {
      var bare = toks[i].replace(/[.,!?;:]/g, '');
      for (j = 0; j < forms.length; j++) { if (bare.toLowerCase() === forms[j].toLowerCase() && forms[j].indexOf(' ') < 0) { idx = i; hit = bare; break; } }
    }
    if (idx < 0 || toks.length < 3) return null;
    var wrong;
    if (w.type === 'v') { var c = conjugate(w); wrong = shuffle(c.pres.filter(function (f) { return f !== hit && f.indexOf(' ') < 0 && f.indexOf('/') < 0; }).filter(function (f, k, a) { return a.indexOf(f) === k; }), rnd).slice(0, 3); }
    else wrong = distract(pool, w, 3, rnd, function (y) { return y.lemma; });
    if (wrong.length < 2) return null;
    var tail = toks[idx].replace(/^[^.,!?;:]*/, ''), g = toks.slice(); g[idx] = '___' + tail;
    var x = optsWith(hit, wrong, rnd);
    return { wid: w.id, t: 'mcq', k: 'Grammatik', q: g.join(' '), o: x.o, a: x.a, exp: w.ex };
  }
  function qOrder(w, rnd) {
    var tk = tokens(w.ex);
    if (tk.length < 3 || tk.length > 9) return null;
    var sh = shuffle(tk, rnd), tries = 0;
    while (sh.join(' ') === tk.join(' ') && tries++ < 20) sh = shuffle(tk, rnd);
    return { wid: w.id, t: 'order', k: 'Satzbau', q: 'Bilde den Satz.', tokens: sh, ans: w.ex.replace(/[.!?]$/, ''), exp: w.ex };
  }
  function qType(w) {
    var acc = [w.display];
    return { wid: w.id, t: 'type', k: 'Schreiben', q: 'Schreibe auf Deutsch: „' + w.gloss + '“' + (w.type === 'n' ? ' (mit Artikel)' : ''), ans: acc, strict: w.type === 'n' ? [w.display] : null, exp: w.display + ' – ' + w.ex };
  }
  function readQs(lv, rnd) {
    return lv.rd.q.map(function (s) { var p = s.split('|'), x = optsWith(p[1], p.slice(2), rnd); return { t: 'mcq', k: 'Lesen', text: lv.rd.text, q: p[0], o: x.o, a: x.a, exp: 'Richtig: ' + p[1] }; });
  }
  function listenQs(lv, rnd) {
    var say = lv.ls.lines.map(function (l) { return l.replace(/^[A-Z]: /, ''); }).join(' ');
    return lv.ls.q.map(function (s) { var p = s.split('|'), x = optsWith(p[1], p.slice(2), rnd); return { t: 'mcq', k: 'Hören', audio: say, q: p[0], o: x.o, a: x.a, exp: 'Richtig: ' + p[1] }; });
  }
  function wordQuestions(lvWords, pool, rnd) {
    var out = [];
    lvWords.forEach(function (w) {
      out.push(qDeEn(w, pool, rnd), qEnDe(w, pool, rnd));
      if (w.type === 'n') out.push(qArticle(w, rnd));
      var g = qGap(w, lvWords.length > 4 ? lvWords : pool, rnd); if (g) out.push(g);
      var o = qOrder(w, rnd); if (o) out.push(o);
      if (w.type === 'n' || w.type === 'v') out.push(qType(w));
    });
    return out;
  }
  function makeLevelTest(content, parsed, n, rnd) {
    rnd = rnd || Math.random;
    var lv = content.LEVELS[n - 1], lvWords = parsed.words.filter(function (w) { return w.level === n; });
    var core = readQs(lv, rnd).slice(0, 2).concat(listenQs(lv, rnd).slice(0, 2));
    var wq = shuffle(wordQuestions(lvWords, parsed.words, rnd), rnd), pick6 = [], kinds = {};
    wq.forEach(function (q) { var key = q.t + q.k; if (pick6.length < 6 && (kinds[key] || 0) < 2) { pick6.push(q); kinds[key] = (kinds[key] || 0) + 1; } });
    wq.forEach(function (q) { if (pick6.length < 6 && pick6.indexOf(q) < 0) pick6.push(q); });
    return shuffle(core.concat(pick6), rnd);
  }
  function levelPool(content, parsed, n, rnd) {
    var lv = content.LEVELS[n - 1], lvWords = parsed.words.filter(function (w) { return w.level === n; });
    return { rl: shuffle(readQs(lv, rnd).concat(listenQs(lv, rnd)), rnd), wq: shuffle(wordQuestions(lvWords, parsed.words, rnd), rnd) };
  }
  function makeStageExam(content, parsed, stageIdx0, rnd) {
    rnd = rnd || Math.random;
    var r = RANGES[stageIdx0], pools = [], qs = [], n, guard = 0;
    for (n = r[1]; n <= r[2]; n++) pools.push(levelPool(content, parsed, n, rnd));
    pools.forEach(function (p) { if (p.rl.length) qs.push(p.rl.pop()); });
    while (qs.length < 20 && guard++ < 200) { var p2 = pools[guard % pools.length]; var q = p2.wq.pop() || p2.rl.pop(); if (q) qs.push(q); }
    return shuffle(qs, rnd);
  }
  // comprehensive final exam: 40 questions spread over all 30 levels
  function makeFinalExam(content, parsed, rnd) {
    rnd = rnd || Math.random;
    var pools = [], qs = [], n, guard = 0;
    for (n = 1; n <= 30; n++) pools.push(levelPool(content, parsed, n, rnd));
    pools.forEach(function (p, i) { var q = (i % 2 ? p.rl.pop() : p.wq.pop()) || p.wq.pop() || p.rl.pop(); if (q) qs.push(q); });
    while (qs.length < 40 && guard++ < 400) { var p2 = pools[20 + (guard % 10)]; var q2 = p2.rl.pop() || p2.wq.pop(); if (q2) qs.push(q2); }
    return shuffle(qs, rnd);
  }

  // shuffle the options of a multiple-choice question and keep the answer index right
  function prepareQ(q, rnd) {
    if (q.t !== 'mcq') return q;
    var idx = q.o.map(function (_, i) { return i; }), sh = shuffle(idx, rnd), c = {};
    for (var k in q) c[k] = q[k];
    c.o = sh.map(function (i) { return q.o[i]; });
    c.a = sh.indexOf(q.a);
    return c;
  }

  // ---------- answer checking ----------
  function checkAnswer(q, given) {
    if (q.t === 'mcq') return given === q.a;
    if (q.t === 'order') return normExact(given) === normExact(q.ans);
    if (q.t === 'type') {
      var g = norm(given); if (!g) return false;
      var ok = q.ans.some(function (a) { return norm(a) === g; });
      if (ok && q.strict) {
        // nouns: article required and the noun itself must be written with a capital letter
        var parts = String(given).trim().split(/\s+/), last = parts[parts.length - 1];
        ok = q.strict.some(function (a) { return norm(a) === g; }) && /^[A-ZÄÖÜ]/.test(last);
      }
      return ok;
    }
    return false;
  }

  // ---------- placement ----------
  function scorePlacement(questions, answers) {
    var band = [0, 0, 0, 0, 0, 0], skills = {};
    questions.forEach(function (q, i) {
      var ok = answers[i] !== undefined && answers[i] !== null && checkAnswer(q, answers[i]);
      if (ok) band[Math.floor(i / 5)]++;
      var s = skills[q.k] || (skills[q.k] = { ok: 0, n: 0 }); s.n++; if (ok) s.ok++;
    });
    var k = 0; while (k < 6 && band[k] >= 4) k++;
    var start = k >= 6 ? 30 : k === 0 ? (band[0] >= 3 ? 3 : 1) : Math.min(30, 5 * k + 1 + (band[k] >= 3 ? 1 : 0));
    return { band: band, skills: skills, start: start, total: band.reduce(function (a, b) { return a + b; }, 0) };
  }

  // ---------- progress / unlocking ----------
  function emptyProgress() { return { v: 1, rev: 0, placementDone: false, startLevel: 1, passed: {}, tests: [], words: [], mistakes: {}, srs: {}, minutes: 0, stagePassed: {}, done: {}, ach: {}, notif: {}, xp: 0, days: [], certs: {}, last: {}, todayXP: {} }; }
  function isUnlocked(p, n) {
    if (n <= 1) return true;
    if (!p.passed[n - 1]) return false;
    if (isStageEnd(n - 1) && !p.stagePassed[stageOf(n - 1)]) return false;
    return true;
  }
  function applyPlacement(p, start) {
    p.placementDone = true; p.startLevel = start;
    for (var i = 1; i < start; i++) { if (!p.passed[i]) p.passed[i] = { score: null, skipped: true }; if (isStageEnd(i) && !p.stagePassed[stageOf(i)]) p.stagePassed[stageOf(i)] = { skipped: true }; }
    return p;
  }
  function currentLevel(p) { for (var n = 1; n <= 30; n++) if (!p.passed[n]) return n; return 30; }

  // ---------- PDF (one JPEG page) ----------
  function pdfFromJpeg(jpeg, wPx, hPx) {
    var enc = new TextEncoder(), chunks = [], offs = [], len = 0;
    function add(x) { var b = typeof x === 'string' ? enc.encode(x) : x; chunks.push(b); len += b.length; }
    function obj(n, body) { offs[n] = len; add(n + ' 0 obj\n'); add(body); add('\nendobj\n'); }
    add('%PDF-1.4\n');
    obj(1, '<</Type/Catalog/Pages 2 0 R>>');
    obj(2, '<</Type/Pages/Kids[3 0 R]/Count 1>>');
    obj(3, '<</Type/Page/Parent 2 0 R/MediaBox[0 0 842 595]/Resources<</XObject<</Im0 4 0 R>>>>/Contents 5 0 R>>');
    offs[4] = len; add('4 0 obj\n<</Type/XObject/Subtype/Image/Width ' + wPx + '/Height ' + hPx + '/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ' + jpeg.length + '>>\nstream\n'); add(jpeg); add('\nendstream\nendobj\n');
    var content = 'q 842 0 0 595 0 0 cm /Im0 Do Q';
    obj(5, '<</Length ' + content.length + '>>\nstream\n' + content + '\nendstream');
    var xref = len; add('xref\n0 6\n0000000000 65535 f \n');
    for (var i = 1; i <= 5; i++) add(('0000000000' + offs[i]).slice(-10) + ' 00000 n \n');
    add('trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n' + xref + '\n%%EOF');
    var out = new Uint8Array(len), p = 0; chunks.forEach(function (c) { out.set(c, p); p += c.length; });
    return out;
  }

  var api = { ART: ART, STAGES: STAGES, RANGES: RANGES, stageIdx: stageIdx, isStageEnd: isStageEnd, makeFinalExam: makeFinalExam, mulberry: mulberry, shuffle: shuffle, pick: pick, norm: norm, normExact: normExact, stageOf: stageOf,
    parseWord: parseWord, parseAll: parseAll, conjugate: conjugate, allForms: allForms, makeLevelTest: makeLevelTest, makeStageExam: makeStageExam,
    checkAnswer: checkAnswer, scorePlacement: scorePlacement, emptyProgress: emptyProgress, isUnlocked: isUnlocked, applyPlacement: applyPlacement,
    currentLevel: currentLevel, prepareQ: prepareQ, wordQuestions: wordQuestions, qDeEn: qDeEn, qEnDe: qEnDe, qArticle: qArticle, qType: qType, pdfFromJpeg: pdfFromJpeg, readQs: readQs, listenQs: listenQs, optsWith: optsWith };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.LGCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
