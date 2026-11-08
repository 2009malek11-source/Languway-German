/* Languway German – views part 3: translator (DE <-> EN), wordbook, smart review */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, D = LG.D, P = LG.P, esc = LG.esc, ic = LG.ic;

  /* ---------- dictionary index (built once, fully offline) ---------- */
  var IDX = null, UNIQ = null;
  function add(map, k, w) { if (!k) return; (map[k] = map[k] || []); if (map[k].indexOf(w) < 0) map[k].push(w); }
  function build() {
    if (IDX) return IDX; IDX = { de: {}, en: {} }; UNIQ = {};
    P.words.forEach(function (w) { var k = w.lemma + '|' + w.type; if (!UNIQ[k] || (UNIQ[k].level === 0 && w.level > 0)) UNIQ[k] = w; });
    Object.keys(UNIQ).forEach(function (k) {
      var w = UNIQ[k];
      C.allForms(w).concat([w.lemma, w.display]).forEach(function (f) { add(IDX.de, C.norm(f), w); });
      w.en.split(/[,;]/).forEach(function (m) { m = m.replace(/\(.*?\)/g, '').trim().toLowerCase(); if (!m) return; add(IDX.en, m, w); add(IDX.en, m.replace(/^to /, ''), w); add(IDX.en, m.replace(/^(a|an|the) /, ''), w); });
    });
    return IDX;
  }
  LG.uniqWords = function () { build(); return Object.keys(UNIQ).map(function (k) { return UNIQ[k]; }); };
  function lev(a, b) { var m = [], i, j; for (i = 0; i <= a.length; i++) m[i] = [i]; for (j = 1; j <= b.length; j++) m[0][j] = j; for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return m[a.length][b.length]; }
  function suggest(key, map) { var out = []; Object.keys(map).forEach(function (k) { if (Math.abs(k.length - key.length) <= 2) { var d = lev(key, k); if (d <= (key.length > 5 ? 2 : 1)) out.push([d, k]); } }); out.sort(function (a, b) { return a[0] - b[0]; }); var seen = {}, r = []; out.forEach(function (x) { map[x[1]].forEach(function (w) { if (!seen[w.id] && r.length < 5) { seen[w.id] = 1; r.push(w); } }); }); return r; }
  var ARTS = /^(der|die|das|ein|eine|einen|einem|einer|the|a|an|to)\s+/i;
  function lookupDE(tok) { var map = build().de, k = C.norm(tok); return map[k] || map[C.norm(tok.replace(ARTS, ''))] || null; }
  function lookupEN(tok) { var map = build().en, k = tok.toLowerCase().trim().replace(/[.!?]+$/, ''); return map[k] || map[k.replace(/^(a|an|the|to) /, '')] || null; }
  function findPhrase(text, dir) {
    var t = C.normExact(text).replace(/\s+/g, ' ');
    for (var i = 0; i < D.PHRASES.length; i++) {
      var p = D.PHRASES[i].split('|'), de = p[0], en = p[1];
      if (dir === 'de' && C.normExact(de) === t) return { de: de, en: en };
      if (dir === 'en') { var alts = en.split(/ \/ | \(/)[0].split(' / '); if ([en].concat(alts).some(function (a) { return C.normExact(a) === t; })) return { de: de, en: en }; }
    }
    return null;
  }

  function entryCard(w) {
    var saved = LG.pg.words.indexOf(w.id) > -1 || LG.pg.words.some(function (id) { return P.byId[id] && P.byId[id].lemma === w.lemma && P.byId[id].type === w.type; });
    var typeName = { n: 'Nomen', v: 'Verb', a: 'Adjektiv', o: w.pos || 'Wort' }[w.type];
    var h = '<div class="card entry"><div class="row between"><h3>' + (w.type === 'n' ? '<span class="art ' + w.article + '">' + w.article + '</span>' + esc(w.lemma) : esc(w.lemma)) + '</h3><div class="row">' + LG.spBtn(w.display) + '</div></div>';
    h += '<span class="tag">' + typeName + '</span>' + (w.level ? ' <span class="tag">Stufe ' + w.level + ' · ' + D.LEVELS[w.level - 1].c + '</span>' : '');
    h += '<div class="defs"><div><b>Englisch:</b> ' + esc(w.en) + '</div><div><b>Definition (Deutsch):</b> ' + esc(w.defDE) + '</div><div><b>Definition (English):</b> ' + esc(w.defEN) + '</div>';
    if (w.type === 'n') h += '<div><b>Artikel:</b> ' + w.article + ' · <b>Plural:</b> ' + (w.plural === '-' ? 'kein Plural' : 'die ' + esc(w.plural)) + '</div>';
    if (w.type === 'a' && w.comp !== '-') h += '<div><b>Steigerung:</b> ' + esc(w.lemma) + ' – ' + esc(w.comp) + ' – ' + esc(w.sup) + '</div>';
    if (w.type === 'v') { var c = C.conjugate(w); h += '<div><b>Infinitiv:</b> ' + esc(w.lemma) + ' · <b>Partizip II:</b> ' + esc(c.pp) + ' · <b>Hilfsverb:</b> ' + c.aux + '</div>'; }
    h += '<div><b>Beispiel:</b> ' + esc(w.ex) + ' ' + LG.spBtn(w.ex, 'Satz anhören') + '</div></div>';
    if (w.type === 'v') h += LG.conjTable(w).replace('<details class="more">', '<details class="more" open>');
    h += '<div class="row" style="margin-top:12px"><button class="btn sm ' + (saved ? 'soft' : '') + '" data-act="save" data-id="' + w.id + '">' + ic(saved ? 'check' : 'star') + (saved ? ' Gemerkt' : ' Merken') + '</button></div></div>';
    return h;
  }
  LG.entryCard = entryCard;
  LG.act.save = function (t) {
    var id = t.dataset.id, w = P.byId[id]; if (!w) return;
    if (LG.pg.words.indexOf(id) < 0) LG.pg.words.push(id); if (!LG.pg.srs[id]) LG.pg.srs[id] = { box: 0, due: Date.now(), ts: Date.now() };
    LG.save(); t.className = 'btn sm soft'; t.innerHTML = ic('check') + ' Gemerkt'; LG.toast('Zum Wiederholen gespeichert.');
  };

  /* ---------- translator ---------- */
  LG.views.translator = function () {
    var count = LG.uniqWords().length;
    return { title: 'Übersetzer', heading: 'Übersetzer Deutsch ⇄ Englisch', html:
      '<div class="tr-wrap"><div class="dirbar"><div class="lang" id="l1">Deutsch</div><button class="iconbtn" id="swap" aria-label="Richtung wechseln">' + ic('swap') + '</button><div class="lang" id="l2">Englisch</div></div>' +
      '<div class="sbar" style="max-width:none"><input id="trin" type="search" placeholder=" " autocomplete="off" autocapitalize="none" spellcheck="false"><label for="trin" id="trlabel">Wort oder Satz eingeben</label><button class="go" id="trgo" aria-label="Übersetzen">' + ic('search') + '</button></div>' +
      '<div class="note">Das Wörterbuch arbeitet vollständig in der App (ohne externe Dienste) und enthält ' + count + ' Wörter und ' + D.PHRASES.length + ' Redewendungen mit Artikeln, Plural, Definitionen in beiden Sprachen und Verbformen. Für ganze Sätze ohne Eintrag zeigt dir der Übersetzer die Bedeutung jedes Wortes.</div><div id="trout"></div></div>',
      mount: function (root) {
        var dir = 'de', inp = LG.$('#trin', root), out = LG.$('#trout', root);
        function labels() { LG.$('#l1', root).textContent = dir === 'de' ? 'Deutsch' : 'Englisch'; LG.$('#l2', root).textContent = dir === 'de' ? 'Englisch' : 'Deutsch'; LG.$('#trlabel', root).textContent = dir === 'de' ? 'Deutsches Wort oder Satz eingeben' : 'Type an English word or sentence'; }
        LG.$('#swap', root).onclick = function () { dir = dir === 'de' ? 'en' : 'de'; labels(); if (inp.value.trim()) run(); };
        function run() {
          var text = inp.value.trim(); if (!text) { out.innerHTML = ''; return; }
          var ph = findPhrase(text, dir), toks = text.replace(/[.!?,;:„“"]/g, ' ').split(/\s+/).filter(Boolean), h = '';
          if (ph) {
            h += '<div class="card"><div class="muted" style="font-size:13px">' + (dir === 'de' ? 'DEUTSCH' : 'ENGLISH') + '</div><div class="phrase">' + esc(dir === 'de' ? ph.de : ph.en) + '</div><div class="muted" style="font-size:13px;margin-top:10px">' + (dir === 'de' ? 'ENGLISCH' : 'DEUTSCH') + '</div><div class="phrase">' + esc(dir === 'de' ? ph.en : ph.de) + ' ' + (dir === 'en' ? LG.spBtn(ph.de) : '') + '</div>' + (dir === 'de' ? '<div style="margin-top:8px">' + LG.spBtn(ph.de) + '</div>' : '') + '</div>';
            out.innerHTML = h; return;
          }
          var single = toks.length === 1 || (toks.length === 2 && ARTS.test(toks[0] + ' '));
          if (single || toks.length === 2 && dir === 'en') {
            var res = dir === 'de' ? lookupDE(text) : lookupEN(text);
            if (res) { out.innerHTML = res.slice(0, 5).map(entryCard).join(''); return; }
            var other = dir === 'de' ? lookupEN(text) : lookupDE(text);
            if (other) { out.innerHTML = '<div class="note">„' + esc(text) + '“ ist ' + (dir === 'de' ? 'kein deutsches Wort im Wörterbuch, aber ein englisches' : 'kein englisches Wort im Wörterbuch, aber ein deutsches') + ' – hier der Eintrag:</div>' + other.slice(0, 5).map(entryCard).join(''); return; }
            var sug = suggest(C.norm(text.replace(ARTS, '')), build()[dir]);
            out.innerHTML = '<div class="card empty">Kein Eintrag für „' + esc(text) + '“ gefunden.' + (sug.length ? '<div style="margin-top:12px">Meintest du: ' + sug.map(function (w) { return '<button class="fchip" data-act="trsug" data-v="' + esc(dir === 'de' ? w.lemma : w.gloss) + '">' + esc(dir === 'de' ? w.display : w.gloss) + '</button>'; }).join(' ') + '</div>' : '') + '</div>';
            return;
          }
          var rows = toks.map(function (tk) { var r = dir === 'de' ? lookupDE(tk) : lookupEN(tk); if (!r) return '<div><b>' + esc(tk) + '</b><span class="muted">kein Eintrag</span></div>'; var w = r[0]; return '<div><b>' + esc(tk) + '</b><span>' + (dir === 'de' ? esc(w.en) + ' <span class="muted">(' + esc(w.display) + ')</span>' : esc(w.display) + ' <span class="muted">(' + esc(w.gloss) + ')</span>') + '</span></div>'; }).join('');
          out.innerHTML = '<div class="card"><h3>Wort für Wort</h3><p class="note">Für diesen Satz gibt es keine fertige Übersetzung im Wörterbuch. Hier ist die Bedeutung der einzelnen Wörter – die Wortstellung und Endungen unterscheiden sich im Deutschen oft vom Englischen.</p><div class="gloss">' + rows + '</div></div>';
        }
        LG.act.trsug = function (t) { inp.value = t.dataset.v; run(); };
        LG.$('#trgo', root).onclick = run; inp.onkeydown = function (e) { if (e.key === 'Enter') run(); }; inp.oninput = function () { clearTimeout(inp._t); inp._t = setTimeout(run, 350); };
        labels(); var q = LG.curRoute.q.get('q'); if (q) { inp.value = q; run(); }
      } };
  };

  /* ---------- wordbook ---------- */
  LG.views.wordbook = function (params, q) {
    var init = q.get('q') || '';
    return { title: 'Wörterbuch', heading: 'Wörterbuch', html: '<div class="sbar"><input id="wbq" type="search" placeholder=" " autocomplete="off" autocapitalize="none" value="' + esc(init) + '"><label for="wbq">Deutsch oder Englisch suchen</label><span class="go">' + ic('search') + '</span></div><div class="filters" id="wbf"></div><p class="muted" id="wbc"></p><div class="wlist" id="wbl"></div>',
      mount: function (root) {
        var all = LG.uniqWords().slice().sort(function (a, b) { return (a.level || 99) - (b.level || 99) || a.lemma.localeCompare(b.lemma, 'de'); }), f = { stage: 'all', type: 'all', learned: false }, limit = 120;
        var chips = [['all', 'Alle'], ['learned', 'Gelernt']].concat(LG.STAGES.map(function (s) { return [s[0], s[0]]; })).concat([['n', 'Nomen'], ['v', 'Verben'], ['a', 'Adjektive'], ['o', 'Sonstige']]);
        function drawChips() { LG.$('#wbf', root).innerHTML = chips.map(function (c) { var on = c[0] === 'all' ? (f.stage === 'all' && f.type === 'all' && !f.learned) : c[0] === 'learned' ? f.learned : (c[0] === f.stage || c[0] === f.type); return '<button class="fchip' + (on ? ' on' : '') + '" data-act="wbchip" data-c="' + c[0] + '">' + c[1] + '</button>'; }).join(''); }
        LG.act.wbchip = function (t) { var c = t.dataset.c; if (c === 'all') { f = { stage: 'all', type: 'all', learned: false }; } else if (c === 'learned') f.learned = !f.learned; else if (/^[ABC][12]$/.test(c)) f.stage = f.stage === c ? 'all' : c; else f.type = f.type === c ? 'all' : c; limit = 120; drawChips(); draw(); };
        function draw() {
          var qv = LG.$('#wbq', root).value.trim(), nk = C.norm(qv), lk = qv.toLowerCase();
          var list = all.filter(function (w) {
            if (f.stage !== 'all' && (!w.level || D.LEVELS[w.level - 1].c !== f.stage)) return false; if (f.type !== 'all' && w.type !== f.type) return false;
            if (f.learned && !LG.pg.words.some(function (id) { var x = P.byId[id]; return x && x.lemma === w.lemma && x.type === w.type; })) return false;
            if (!qv) return true; return C.norm(w.lemma).indexOf(nk) > -1 || w.en.toLowerCase().indexOf(lk) > -1 || C.allForms(w).some(function (x) { return C.norm(x) === nk; });
          });
          LG.$('#wbc', root).textContent = list.length + ' Wörter';
          LG.$('#wbl', root).innerHTML = list.length ? list.slice(0, limit).map(function (w) { return '<div class="wrow" data-act="wbopen" data-id="' + w.id + '">' + (w.type === 'n' ? '<span class="art ' + w.article + '" style="font-size:13px;padding:1px 8px;border-radius:8px;color:#fff">' + w.article + '</span>' : '') + '<b>' + esc(w.lemma) + '</b><span class="tag">' + (w.level ? D.LEVELS[w.level - 1].c : '·') + '</span><span class="en">' + esc(w.gloss) + '</span></div>'; }).join('') + (list.length > limit ? '<button class="btn soft" data-act="wbmore">Mehr anzeigen</button>' : '') : '<div class="card empty">Keine Wörter gefunden.</div>';
        }
        LG.act.wbmore = function () { limit += 400; draw(); };
        LG.act.wbopen = function (t) { var w = P.byId[t.dataset.id]; LG.modal(entryCard(w) + '<div class="modal__actions"><button class="btn soft" onclick="LG.closeModal()">Schließen</button></div>'); };
        LG.$('#wbq', root).oninput = function () { limit = 120; draw(); };
        drawChips(); draw();
      } };
  };

  /* ---------- smart review (spaced repetition + mistake log) ---------- */
  LG.views.review = function () {
    var due = LG.dueWords(), learned = LG.pg.words.length, mist = Object.keys(LG.pg.mistakes).filter(function (id) { return LG.pg.mistakes[id] > 0 && P.byId[id]; }).sort(function (a, b) { return LG.pg.mistakes[b] - LG.pg.mistakes[a]; });
    var ml = mist.slice(0, 8).map(function (id) { var w = P.byId[id]; return '<div class="resrow"><span>' + esc(w.display) + ' <span class="muted">– ' + esc(w.gloss) + '</span></span><b>' + LG.pg.mistakes[id] + '×</b></div>'; }).join('');
    return { title: 'Wiederholen', heading: 'Intelligente Wiederholung', html:
      '<div class="grid c3"><div class="card stat"><b>' + due.length + '</b><span>fällig heute</span></div><div class="card stat"><b>' + learned + '</b><span>Wörter im Training</span></div><div class="card stat"><b>' + mist.length + '</b><span>Fehlerwörter</span></div></div>' +
      '<div class="card" style="margin-top:16px" id="rbox"><h3>Wiederholungs-Training</h3><p class="muted">Die Fragen richten sich nach deinen Ergebnissen: Fehlerwörter und fällige Wörter kommen zuerst. Richtige Antworten verlängern den Abstand bis zur nächsten Wiederholung (1, 3, 7, 14, 30 Tage).</p>' +
      (learned ? '<div class="row"><button class="btn" data-act="rstart" data-m="due">' + ic('refresh') + ' ' + (due.length ? 'Fällige Wörter üben' : 'Trotzdem üben') + '</button>' + (mist.length ? '<button class="btn soft" data-act="rstart" data-m="err">Fehlerwörter üben</button>' : '') + '</div>' : '<div class="empty">Du hast noch keine Wörter im Training. Schließe Stufen ab oder tippe im Wörterbuch auf „Merken“.</div>') + '</div>' +
      (ml ? '<div class="card"><h3>Fehlerprotokoll</h3>' + ml + '</div>' : ''),
      mount: function () {
        LG.act.rstart = function (t) {
          var ids = t.dataset.m === 'err' ? mist : (due.length ? due : LG.pg.words.slice()), rnd = Math.random;
          ids = (t.dataset.m === 'due' && !due.length ? C.shuffle(ids, rnd) : ids).slice(0, 10);
          var qs = ids.map(function (id) { var w = P.byId[id]; if (!w) return null; var opts = [C.qDeEn(w, P.words, rnd), C.qEnDe(w, P.words, rnd)]; if (w.type === 'n') opts.push(C.qArticle(w, rnd), C.qType(w)); if (w.type === 'v') opts.push(C.qType(w)); return C.prepareQ(C.pick(opts, 1, rnd)[0]); }).filter(Boolean);
          if (!qs.length) return LG.toast('Keine Wörter zum Üben.', true);
          LG.quiz({ root: LG.$('#rbox'), qs: qs, feedback: true, title: 'Wiederholung', onDone: function (res) { LG.recordTest('review', 0, res.correct, res.total); LG.save(); }, again: function () { LG.route(); } });
        };
      } };
  };
})();
