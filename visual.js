/* Languway German – visual vocabulary: local pictures (emoji), picture setting, guess-the-word game, picture map */
(function () {
  'use strict';
  var LG = window.LG;
  var PIC = {
    Alphabet: '🔤', Buchstabe: '🅰️', Wort: '💬', Haus: '🏠', Hallo: '👋', Tschüs: '👋', Land: '🗺️', Freund: '🧑‍🤝‍🧑', Familie: '👪', Mutter: '👩‍🍼', Vater: '👨‍🍼', Bruder: '👦', Schwester: '👧', Kind: '🧒', Jahr: '📅',
    Brot: '🍞', Wasser: '💧', Kaffee: '☕', Apfel: '🍎', Milch: '🥛', essen: '🍽️', trinken: '🥤', kaufen: '🛒', Tag: '☀️', Uhr: '🕒', Zeit: '⏳', Abend: '🌆', aufstehen: '🛏️', arbeiten: '💼', schlafen: '😴', heute: '📆',
    Stadt: '🏙️', Straße: '🛣️', gehen: '🚶', fahren: '🚗', Preis: '🏷️', Hose: '👖', Hemd: '👔', Schuh: '👟', kosten: '💶', tragen: '🧥', Wohnung: '🏢', Zimmer: '🚪', Küche: '🍳', Tisch: '🪑', Kopf: '🙂', Arzt: '🧑‍⚕️', Termin: '🗓️', Medikament: '💊',
    helfen: '🤝', krank: '🤒', gesund: '💪', Zug: '🚆', Flug: '✈️', Fahrkarte: '🎫', Gleis: '🛤️', abfahren: '🚉', reisen: '🧳', Bahnhof: '🚉', Schule: '🏫', links: '⬅️', rechts: '➡️', geradeaus: '⬆️', Hobby: '🎨', Musik: '🎵', Film: '🎬',
    spielen: '🎲', treffen: '🤝', schwimmen: '🏊', Beruf: '👷', Chef: '🧑‍💼', Bewerbung: '📄', verdienen: '💰', Umwelt: '🌍', Müll: '🗑️', Energie: '⚡', schützen: '🛡️', Nachricht: '✉️', Handy: '📱', Zeitung: '📰', Internet: '🌐', schicken: '📤', speichern: '💾',
    Prüfung: '📝', Kurs: '🎓', Fehler: '❌', wiederholen: '🔁', üben: '🏋️', Kultur: '🎭', feiern: '🎉', diskutieren: '🗣️', Wirtschaft: '📈', Regierung: '🏛️', Steuer: '🧾', Wahl: '🗳️', wählen: '🗳️', Wissenschaft: '🔬', Studie: '📊', Roboter: '🤖',
    Roman: '📖', Gesetz: '⚖️', Unternehmen: '🏭', Gewinn: '💹', Klimawandel: '🌡️', Ziel: '🎯', Herausforderung: '🧗', Zukunft: '🔮', Technologie: '💻', Journalist: '🎤', Autor: '✍️', Redewendung: '💭',
    ich: '🙋', du: '👉', wir: '👫', Montag: '1️⃣', Woche: '🗓️', Monat: '🗓️', Morgen: '🌅', Mittag: '🌞', Nacht: '🌙', Stunde: '🕐', Minute: '⏱️', rot: '🟥', blau: '🟦', grün: '🟩', gelb: '🟨', schwarz: '⬛', weiß: '⬜',
    klein: '🐜', schnell: '⚡', langsam: '🐌', kalt: '🥶', warm: '🌤️', heiß: '🔥', müde: '🥱', Buch: '📚', Auto: '🚗', Bus: '🚌', Tür: '🚪', Fenster: '🪟', Stuhl: '💺', Bett: '🛏️', Hund: '🐶', Katze: '🐱', Baum: '🌳', Sonne: '☀️', Wetter: '⛅', Regen: '🌧️', Schnee: '❄️',
    Mann: '👨', Frau: '👩', Mädchen: '👧', Junge: '👦', Lehrer: '🧑‍🏫', Arbeit: '🛠️', Geld: '💶', Hunger: '🍝', Durst: '🥵', Tee: '🍵', Reis: '🍚', Fleisch: '🥩', Käse: '🧀', Fisch: '🐟', Ei: '🥚', Tasche: '👜', Telefon: '☎️', Computer: '🖥️',
    sagen: '🗨️', sehen: '👀', geben: '🎁', lernen: '🎒', lesen: '📖', schreiben: '✏️', sprechen: '🗣️', hören: '👂', denken: '🤔', fragen: '❓', antworten: '💡', warten: '⌛', kochen: '👨‍🍳', laufen: '🏃', sitzen: '🪑', ja: '✅', nein: '🚫', danke: '🙏', bitte: '🙏',
    Messer: '🔪', Gabel: '🍴', Löffel: '🥄', Teller: '🍽️', Glas: '🥛', Tasse: '☕', Flasche: '🍼', Banane: '🍌', Orange: '🍊', Tomate: '🍅', Kartoffel: '🥔', Suppe: '🍲', Salat: '🥗', Kuchen: '🍰', Eis: '🍦', Saft: '🧃', Vogel: '🐦', Pferd: '🐴', Kuh: '🐄', Blume: '🌸', Mond: '🌙', Stern: '⭐', Berg: '⛰️', Meer: '🌊', Fluss: '🏞️', Wald: '🌲', Himmel: '🌤️', Fahrrad: '🚲', Flugzeug: '✈️', Schiff: '🚢', Brücke: '🌉', Kirche: '⛪', Moschee: '🕌', Krankenhaus: '🏥', Apotheke: '💊', Bank: '🏦', Supermarkt: '🛒', Restaurant: '🍴', Hotel: '🏨', Flughafen: '🛫', Koffer: '🧳', Schlüssel: '🔑', Lampe: '💡', Sofa: '🛋️', Spiegel: '🪞', Regenschirm: '☂️', Brille: '👓', Mütze: '🧢', Mantel: '🧥', Kleid: '👗', Kamera: '📷', Stift: '✏️', Heft: '📓', Foto: '🖼️', Fußball: '⚽', Herz: '❤️', Hand: '✋', Auge: '👁️', Ohr: '👂', Fuß: '🦶', Zahn: '🦷', schneiden: '✂️', öffnen: '🔓', singen: '🎤', tanzen: '💃', lachen: '😂', weinen: '😢', fliegen: '🕊️', malen: '🎨', waschen: '🧼'
  };
  LG.picOf = function (w) { return w && PIC[w.lemma] || ''; };
  LG.picMode = function () { var m = LG.settings.pics; return m === 'text' || m === 'image' ? m : 'both'; };
  /* big picture block for a word card; empty when no picture or text-only mode */
  LG.picBlock = function (w) { var p = LG.picOf(w); return p && LG.picMode() !== 'text' ? '<div class="wpic" role="img" aria-label="' + LG.esc(w.lemma) + '">' + p + '</div>' : ''; };
  LG.picSmall = function (w) { var p = LG.picOf(w); return p && LG.picMode() !== 'text' ? '<span class="wpic-s" aria-hidden="true">' + p + '</span>' : ''; };

  LG.picSettings = function () {
    var m = LG.picMode(), c = function (v, l) { return '<button type="button" class="chip' + (m === v ? ' on' : '') + '" data-act="setpics" data-v="' + v + '">' + l + '</button>'; };
    return '<div class="setrow"><div><b>Bilder beim Lernen</b><div class="muted" style="font-size:13px">Zeigt zu konkreten Wörtern ein Bild. Alles läuft lokal, ohne Internet.</div></div><div class="chips">' + c('both', 'Bedeutung + Bild') + c('text', 'Nur Bedeutung') + c('image', 'Nur Bild') + '</div></div>';
  };
  LG.act.setpics = function (t) { LG.setSetting('pics', t.dataset.v); LG.route(); LG.toast(LG.tr ? LG.tr('Gespeichert') : 'Gespeichert'); };

  /* ---------- guess-the-word + picture map (rendered inside the game view) ---------- */
  function picWords() { return LG.P.words.filter(function (w) { return LG.picOf(w); }); }
  LG.picMapHtml = function () {
    var ws = picWords(), srs = LG.pg.srs || {}, known = LG.pg.words || [], n = 0;
    var tiles = ws.map(function (w) {
      var s = srs[w.id], st = known.indexOf(w.id) < 0 ? 0 : (s && s.box >= 3 ? 2 : 1); if (st === 2) n++;
      return '<span class="ptile s' + st + '" title="' + LG.esc(w.display) + '"><i>' + LG.picOf(w) + '</i></span>';
    }).join('');
    return '<div class="card" style="margin-top:16px"><h3>Bilder-Karte</h3><p class="muted">' + n + ' von ' + ws.length + ' Bild-Wörtern sicher gelernt. Grau = noch nicht gelernt, blass = in Arbeit, bunt = sicher.</p><div class="pmap">' + tiles + '</div></div>';
  };
  LG.picGameCard = function () { return '<div class="card"><h3>Wort erraten</h3><p class="muted">Ein Bild – welches deutsche Wort passt? 8 Runden, +15 XP.</p><button class="btn" data-act="gguess">Bilderspiel starten</button></div>'; };
  LG.act.gguess = function () {
    var area = LG.$('#garea'); if (!area) return;
    var all = picWords(), cur = LG.pg.words || [], base = all.filter(function (w) { return cur.indexOf(w.id) > -1; });
    if (base.length < 8) base = all.filter(function (w) { return w.level <= Math.max(3, LG.C.currentLevel(LG.pg) + 1) || w.level === 0; });
    if (base.length < 4) base = all;
    var seen = {}, rounds = LG.C.shuffle(base, Math.random).filter(function (w) { if (seen[w.lemma]) return false; seen[w.lemma] = 1; return true; }).slice(0, 8), i = 0, ok = 0;
    function lab(w) { return w.type === 'n' ? w.display : w.lemma; }
    function step() {
      if (i >= rounds.length) { LG.recordTest('review', 0, ok, rounds.length); LG.addXP(15); LG.markSkill('vocab'); LG.save(); LG.confetti();
        area.innerHTML = '<div class="card"><h3>Geschafft: ' + ok + ' / ' + rounds.length + '</h3><button class="btn" data-act="gguess">Noch einmal</button></div>'; return; }
      var w = rounds[i], opts = [w].concat(LG.C.shuffle(all.filter(function (x) { return x.lemma !== w.lemma && x.type === w.type; }), Math.random).slice(0, 3)); opts = LG.C.shuffle(opts, Math.random);
      area.innerHTML = '<div class="card"><div class="row between"><h3>Wort erraten</h3><span class="muted">' + (i + 1) + ' / ' + rounds.length + '</span></div><div class="wpic big" role="img" aria-label="Bild">' + LG.picOf(w) + '</div><div class="gopts">' + opts.map(function (o, k) { return '<button class="btn soft" data-k="' + k + '">' + LG.esc(lab(o)) + '</button>'; }).join('') + '</div></div>';
      LG.$$('.gopts button', area).forEach(function (b) { b.onclick = function () {
        var o = opts[+b.dataset.k], good = o.lemma === w.lemma; if (good) ok++; LG.srsAnswer(w.id, good);
        LG.$$('.gopts button', area).forEach(function (x) { x.disabled = true; if (opts[+x.dataset.k].lemma === w.lemma) x.classList.add('right'); }); if (!good) b.classList.add('wrong');
        LG.speak(w.type === 'n' ? w.display : w.lemma); setTimeout(function () { i++; step(); }, 1100); }; });
    }
    step(); area.scrollIntoView({ behavior: 'smooth' });
  };
})();
(function () {
  var ctx;
  window.LG.sfx = function (ok) {
    if (window.LG.settings.sfx === false) return;
    try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); var t = ctx.currentTime, f = ok ? [660, 880] : [220, 180];
      f.forEach(function (hz, k) { var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = hz; o.type = ok ? 'sine' : 'triangle'; g.gain.setValueAtTime(0.0001, t + k * 0.12); g.gain.exponentialRampToValueAtTime(0.12, t + k * 0.12 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.12 + 0.14); o.connect(g); g.connect(ctx.destination); o.start(t + k * 0.12); o.stop(t + k * 0.12 + 0.16); });
    } catch (e) { /* audio unavailable */ }
  };
})();
