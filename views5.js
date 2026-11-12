/* Languway German – views part 5: AI tutor (own API key), wrong-answer explainer, bilingual nudges, daily goal, games */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, D = LG.D, P = LG.P, esc = LG.esc, ic = LG.ic;
  var MODEL = 'claude-haiku-5-5';

  /* ---------- AI access (browser -> api.anthropic.com with the learner's own key) ---------- */
  function levelInfo() { var n = C.currentLevel(LG.pg); return { n: n, c: D.LEVELS[n - 1].c, t: D.LEVELS[n - 1].t }; }
  function system() {
    var l = levelInfo();
    return 'You are the friendly tutor inside the German-learning app "Languway German". The learner is currently at level ' + l.n + ' of 30 (CEFR ' + l.c + ', topic: ' + l.t + '). ' +
      'ALWAYS answer in two parts: first in simple German that fits the learner\'s level (short sentences), then the same explanation in ' + (LG.helper() === 'en' || LG.helper() === 'none' ? 'English after a line that says "EN:"' : LG.helperName() + ' after a line that says "HELP:"') + '. ' +
      'Explain grammar rules clearly with 2-3 correct example sentences (with English translations). When the learner made a mistake, say what is wrong, why, and give the corrected version. ' +
      'Be encouraging and concise (under 200 words in total). Only discuss learning German; politely refuse other topics. Use plain text with no markdown headings.';
  }
  LG.hasKey = function () { return !!(LG.settings.apiKey && LG.settings.apiKey.length > 20); };
  LG.ask = function (messages) {
    if (!LG.hasKey()) return Promise.reject({ code: 'nokey' });
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': LG.settings.apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: MODEL, max_tokens: 700, system: system(), messages: messages })
    }).then(function (r) {
      if (r.status === 401 || r.status === 403) throw { code: 'badkey' };
      if (r.status === 429) throw { code: 'limit' };
      if (!r.ok) throw { code: 'api' };
      return r.json();
    }).then(function (j) { return (j.content || []).map(function (b) { return b.text || ''; }).join('').trim(); }, function (e) { throw e && e.code ? e : { code: 'network' }; });
  };
  var AIERR = { nokey: 'Für den KI-Tutor fehlt dein API-Schlüssel (Einstellungen). / The AI tutor needs your API key (Settings).', badkey: 'Der API-Schlüssel wurde abgelehnt. / The API key was rejected.', limit: 'Zu viele Anfragen – bitte warte kurz. / Too many requests – please wait a moment.', api: 'Der Tutor ist gerade nicht erreichbar. / The tutor is not available right now.', network: 'Keine Internetverbindung zum Tutor. / No connection to the tutor.' };
  function fmt(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); }

  /* ---------- built-in grammar finder (works offline, used when no key is set) ---------- */
  function builtin(text) {
    var toks = C.norm(text).split(/[^a-zäöüß0-9]+/).filter(function (w) { return w.length > 3; }), best = null, bs = 0;
    D.LEVELS.forEach(function (lv, i) {
      var hay = C.norm([lv.gr.t, lv.gr.en, lv.gr.p.join(' '), lv.t].join(' ')), sc = 0;
      toks.forEach(function (t) { if (hay.indexOf(t) > -1) sc += (C.norm(lv.gr.t).indexOf(t) > -1 ? 4 : 1); });
      if (sc > bs) { bs = sc; best = { n: i + 1, lv: lv }; }
    });
    if (!best || bs < 2) return null;
    var g = best.lv.gr;
    return 'Das passt zu Stufe ' + best.n + ' (' + best.lv.c + '): ' + g.t + '\n' + g.p.join('\n') + '\nBeispiele: ' + g.ex.join(' · ') + '\n\nEN: ' + (g.en || '') + '\n\n(Eingebaute Erklärung. Für freie Fragen und Korrekturen füge in den Einstellungen deinen API-Schlüssel hinzu. / Built-in explanation. Add your API key in Settings for free questions and corrections.)';
  }

  /* ---------- tutor page ---------- */
  LG.views.tutor = function () {
    var chips = ['Erkläre den Unterschied zwischen der, die und das.', 'Explain the accusative case simply.', 'Wann benutze ich „haben“ und wann „sein“ im Perfekt?', 'Correct my sentence: Ich habe gestern nach Berlin gefahren.'];
    return { title: 'KI-Tutor', heading: 'KI-Tutor · AI tutor', html:
      '<div class="card chat"><div class="chat__log" id="clog" aria-live="polite"><div class="msg bot">Hallo! Ich bin dein Tutor. Frag mich nach Grammatik, Wörtern oder schreibe einen Satz, den ich korrigieren soll.<br><i>Hello! I am your tutor. Ask me about grammar or words, or write a sentence for me to correct.</i></div></div>' +
      (LG.hasKey() ? '' : '<p class="note">Kein API-Schlüssel gespeichert – ich antworte mit den eingebauten Grammatik-Erklärungen. Für den vollen KI-Tutor trage deinen Schlüssel in den <a href="#/settings">Einstellungen</a> ein. / No API key saved – I answer with built-in grammar notes. Add your key in <a href="#/settings">Settings</a> for the full AI tutor.</p>') +
      '<div class="filters">' + chips.map(function (c) { return '<button class="fchip" data-act="tchip" data-v="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<form class="chat__in" id="cform"><input id="cin" autocomplete="off" placeholder="Frage / Question …" maxlength="600"><button class="btn" type="submit">' + ic('arrowr') + '</button></form></div>',
      mount: function (root) {
        var log = LG.$('#clog', root), inp = LG.$('#cin', root), hist = [], busy = false;
        function add(cls, html) { var d = document.createElement('div'); d.className = 'msg ' + cls; d.innerHTML = html; log.appendChild(d); d.scrollIntoView({ block: 'nearest' }); return d; }
        function send(text) {
          text = String(text || '').trim(); if (!text || busy) return; busy = true; inp.value = ''; add('me', esc(text)); LG.markSkill('tutor');
          if (!LG.hasKey()) { var b = builtin(text); add('bot', b ? fmt(b) : 'Dazu habe ich keine eingebaute Erklärung. Frage nach einem Grammatikthema (z. B. Dativ, Perfekt, Konjunktiv) oder füge deinen API-Schlüssel hinzu.<br><i>I have no built-in explanation for that. Ask about a grammar topic (e.g. dative, perfect, subjunctive) or add your API key.</i>'); busy = false; return; }
          hist.push({ role: 'user', content: text }); var wait = add('bot', '…');
          LG.ask(hist.slice(-8)).then(function (a) { hist.push({ role: 'assistant', content: a }); wait.innerHTML = fmt(a); }).catch(function (e) { hist.pop(); wait.innerHTML = esc(AIERR[e.code] || AIERR.api); }).then(function () { busy = false; });
        }
        LG.$('#cform', root).onsubmit = function (e) { e.preventDefault(); send(inp.value); };
        LG.act.tchip = function (t) { send(t.dataset.v); };
      } };
  };

  /* ---------- "why is it wrong?" for quiz answers ---------- */
  LG.explainWrong = function (q, ans, host) {
    var correct = q.t === 'mcq' ? q.o[q.a] : q.t === 'order' ? q.ans : q.ans[0], given = ans === undefined ? '(keine Antwort / no answer)' : (q.t === 'mcq' ? q.o[ans] : ans);
    var l = levelInfo(), tip = D.LEVELS[l.n - 1].gr.en;
    host.innerHTML = '<div class="why"><b>Richtig / Correct:</b> ' + esc(correct) + (q.exp ? '<br>' + esc(q.exp) : '') + (tip ? '<br><small class="muted">Tip (' + l.c + '): ' + esc(tip) + '</small>' : '') + '<div id="whyai" style="margin-top:8px"></div></div>';
    if (!LG.hasKey()) { LG.$('#whyai', host).innerHTML = '<small class="muted">Mit deinem API-Schlüssel (Einstellungen) erklärt der KI-Tutor genau, warum deine Antwort falsch war. / With your API key (Settings) the AI tutor explains exactly why your answer was wrong.</small>'; return; }
    var box = LG.$('#whyai', host); box.textContent = '…';
    var prompt = 'The learner answered a question wrongly.\nQuestion: ' + q.q + (q.text ? '\nText: ' + q.text : '') + (q.audio ? '\nAudio sentence: ' + q.audio : '') + (q.o ? '\nOptions: ' + q.o.join(' | ') : '') + '\nLearner answer: ' + given + '\nCorrect answer: ' + correct + '\nExplain why the learner\'s answer is wrong and why the correct answer is right, and give one memory tip.';
    LG.markSkill('tutor'); LG.ask([{ role: 'user', content: prompt }]).then(function (a) { box.innerHTML = fmt(a); }).catch(function (e) { box.textContent = AIERR[e.code] || AIERR.api; });
  };

  /* ---------- bilingual nudges: what have you not practised for a while? ---------- */
  var SK = { vocab: ['Wortschatz', 'vocabulary'], grammar: ['Grammatik', 'grammar'], listen: ['Hören', 'listening'], speak: ['Sprechen', 'speaking'], read: ['Lesen', 'reading'], write: ['Schreiben', 'writing'], review: ['Wiederholung', 'review'] };
  LG.nudges = function () {
    var out = [], now = Date.now(), last = LG.pg.last || {}, DAY = 864e5, started = Object.keys(LG.pg.done).length > 0 || LG.pg.tests.length > 1;
    if (!started) return [{ de: 'Starte jetzt mit deiner ersten Lektion – ein kleiner Schritt reicht!', en: 'Start your first lesson now – one small step is enough!', href: '#/levels' }];
    var open = LG.pg.notif && LG.pg.notif.lastOpen;
    if (open && now - open > 2 * DAY) { var dd = Math.floor((now - open) / DAY); out.push({ de: 'Willkommen zurück! Du warst ' + dd + ' Tage nicht hier.', en: 'Welcome back! You have been away for ' + dd + ' days.', href: '#/levels' }); }
    Object.keys(SK).forEach(function (k) {
      var t = last[k] && last[k].ts; if (!t) return; var d = Math.floor((now - t) / DAY);
      if (d >= 3) out.push({ de: 'Du hast seit ' + d + ' Tagen nicht mehr „' + SK[k][0] + '“ geübt.', en: 'You have not practised ' + SK[k][1] + ' for ' + d + ' days.', href: k === 'review' ? '#/review' : '#/level/' + C.currentLevel(LG.pg) + '?step=' + (k === 'vocab' ? 'vocab' : k) });
    });
    var due = LG.dueWords().length; if (due > 0) out.push({ de: due + ' Wörter warten auf deine Wiederholung.', en: due + ' words are waiting for review.', href: '#/review' });
    var oldL = Object.keys(LG.pg.passed).filter(function (n) { var p = LG.pg.passed[n]; return p && !p.skipped && p.date && now - p.date > 14 * DAY; }).map(Number).sort(function (a, b) { return a - b; })[0];
    if (oldL) out.push({ de: 'Stufe ' + oldL + ' („' + D.LEVELS[oldL - 1].t + '“) hast du seit über zwei Wochen nicht wiederholt.', en: 'You have not revisited level ' + oldL + ' for over two weeks.', href: '#/level/' + oldL });
    return out.slice(0, 4);
  };
  LG.goalCard = function () {
    var t = LG.today(), xp = (LG.pg.todayXP || {})[t] || 0, goal = LG.settings.goal || 50, p = Math.min(100, Math.round(xp / goal * 100)), s = LG.streak();
    return '<div class="grid c3" style="margin-top:16px"><div class="card stat"><b>' + s + '</b><span>Tage in Folge</span></div><div class="card stat"><b>' + (LG.pg.xp || 0) + '</b><span>XP gesamt</span></div><div class="card"><b>Tagesziel</b><div class="bar" style="margin:8px 0 4px"><i style="width:' + p + '%"></i></div><small class="muted">' + xp + ' / ' + goal + ' XP' + (p >= 100 ? ' ✔' : '') + '</small></div></div>';
  };
  LG.startCard = function () {
    return '<a class="cta" href="#/placement" style="text-decoration:none"><ul><li>Einstufungstest</li><li><b>Finde dein Niveau</b> · 30 Fragen</li></ul></a>' +
      '<div class="grid c3" style="margin-top:16px"><a class="card stat" href="#/translator" style="text-decoration:none;color:inherit"><b>' + ic('globe') + '</b><span>Übersetzer</span></a><a class="card stat" href="#/tutor" style="text-decoration:none;color:inherit"><b>' + ic('bulb') + '</b><span>KI-Tutor</span></a><a class="card stat" href="#/settings" style="text-decoration:none;color:inherit"><b>' + ic('settings') + '</b><span>Einstellungen</span></a></div>';
  };
  LG.tutorCard = function () {
    var n = LG.nudges(); if (!n.length) return '<div class="card" style="margin-top:16px"><h3>' + ic('bulb') + ' Dein Tutor sagt · Your tutor says</h3><p class="muted">Alles im grünen Bereich – weiter so! <i>Everything is on track – keep going!</i></p></div>';
    return '<div class="card" style="margin-top:16px"><h3>' + ic('bulb') + ' Dein Tutor sagt · Your tutor says</h3>' + n.map(function (x) { return '<a class="nudge" href="' + x.href + '"><b>' + esc(x.de) + '</b><span>' + esc(x.en) + '</span></a>'; }).join('') + '</div>';
  };

  /* ---------- games: daily challenge + memory ---------- */
  function pool() {
    var ids = LG.pg.words.slice(), cur = C.currentLevel(LG.pg);
    if (ids.length < 8) LG.levelWords(cur).forEach(function (w) { if (ids.indexOf(w.id) < 0) ids.push(w.id); });
    if (ids.length < 8) P.words.filter(function (w) { return w.level > 0 && w.level <= cur + 1; }).forEach(function (w) { if (ids.indexOf(w.id) < 0) ids.push(w.id); });
    return ids.map(function (id) { return P.byId[id]; }).filter(Boolean);
  }
  LG.views.game = function () {
    var today = LG.today(), done = LG.pg.dailyDone && LG.pg.dailyDone[today];
    return { title: 'Spiel', heading: 'Tagesaufgabe und Spiele', html:
      '<div class="grid c2"><div class="card" id="gbox"><h3>' + ic('target') + ' Tagesaufgabe</h3><p class="muted">8 gemischte Fragen aus deinem Wortschatz. ' + (done ? 'Heute schon erledigt – du kannst trotzdem üben.' : 'Bonus: +25 XP einmal pro Tag.') + '</p><button class="btn" data-act="gdaily">' + (done ? 'Noch einmal üben' : 'Tagesaufgabe starten') + '</button></div>' +
      '<div class="card"><h3>' + ic('star') + ' Memory</h3><p class="muted">Finde die Paare: deutsches Wort und englische Bedeutung. +15 XP pro Spiel.</p><button class="btn" data-act="gmem">Memory spielen</button></div></div><div id="garea" style="margin-top:16px"></div>',
      mount: function () {
        var area = LG.$('#garea');
        LG.act.gdaily = function () {
          var ws = C.shuffle(pool(), Math.random).slice(0, 8), rnd = Math.random;
          var qs = ws.map(function (w) { var o = [C.qDeEn(w, P.words, rnd), C.qEnDe(w, P.words, rnd)]; if (w.type === 'n') o.push(C.qArticle(w, rnd)); return C.prepareQ(C.pick(o, 1, rnd)[0]); });
          area.innerHTML = '<div class="card" id="gq"></div>'; LG.markSkill('practice');
          LG.quiz({ root: LG.$('#gq'), qs: qs, feedback: true, title: 'Tagesaufgabe', onDone: function (res) {
            LG.recordTest('review', 0, res.correct, res.total); LG.pg.dailyDone = LG.pg.dailyDone || {}; var first = !LG.pg.dailyDone[LG.today()]; LG.pg.dailyDone[LG.today()] = true; if (first) { LG.addXP(25); LG.toast('+25 XP Tagesbonus!'); LG.confetti(); } LG.save(); }, again: function () { LG.route(); } });
          area.scrollIntoView({ behavior: 'smooth' });
        };
        LG.act.gmem = function () {
          var ws = C.shuffle(pool(), Math.random).slice(0, 6), cards = [];
          ws.forEach(function (w) { cards.push({ id: w.id, t: w.display }); cards.push({ id: w.id, t: w.gloss }); });
          cards = C.shuffle(cards, Math.random); var open = [], matched = 0, moves = 0, lock = false;
          area.innerHTML = '<div class="card"><div class="row between"><h3>Memory</h3><span class="muted" id="mm">0 Züge</span></div><div class="memgrid">' + cards.map(function (c, i) { return '<button class="mem" data-i="' + i + '" aria-label="Karte ' + (i + 1) + '"><span>?</span></button>'; }).join('') + '</div></div>';
          LG.$$('.mem', area).forEach(function (b) { b.onclick = function () {
            var i = +b.dataset.i; if (lock || b.classList.contains('up') || b.classList.contains('ok')) return;
            b.classList.add('up'); b.firstChild.textContent = cards[i].t; open.push(i);
            if (open.length === 2) { moves++; LG.$('#mm', area).textContent = moves + ' Züge'; lock = true;
              var a = open[0], c = open[1], ba = LG.$('.mem[data-i="' + a + '"]', area), bc = LG.$('.mem[data-i="' + c + '"]', area);
              if (cards[a].id === cards[c].id) { ba.classList.add('ok'); bc.classList.add('ok'); open = []; lock = false; matched++; if (matched === ws.length) { LG.addXP(15); LG.markSkill('vocab'); LG.save(); LG.confetti(); LG.toast('Geschafft in ' + moves + ' Zügen! +15 XP'); } }
              else setTimeout(function () { [ba, bc].forEach(function (x) { x.classList.remove('up'); x.firstChild.textContent = '?'; }); open = []; lock = false; }, 800);
            } }; });
          area.scrollIntoView({ behavior: 'smooth' });
        };
      } };
  };
})();
