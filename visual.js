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
  var WT = {"Haus": "House", "Brot": "Bread", "Wasser": "Water", "Kaffee": "Coffee", "Apfel": "Apple", "Milch": "Milk", "Uhr": "Clock", "Stadt": "City", "Straße": "Street", "Hose": "Trousers", "Hemd": "Shirt", "Schuh": "Shoe", "Wohnung": "Apartment", "Küche": "Kitchen", "Tisch": "Table (furniture)", "Kopf": "Head", "Arzt": "Physician", "Medikament": "Medication", "Zug": "Train", "Gleis": "Track (rail transport)", "Bahnhof": "Train station", "Schule": "School", "Handy": "Mobile phone", "Zeitung": "Newspaper", "Roboter": "Robot", "Roman": "Novel", "Buch": "Book", "Auto": "Car", "Bus": "Bus", "Tür": "Door", "Fenster": "Window", "Stuhl": "Chair", "Bett": "Bed", "Hund": "Dog", "Katze": "Cat", "Baum": "Tree", "Sonne": "Sun", "Regen": "Rain", "Schnee": "Snow", "Mann": "Man", "Frau": "Woman", "Tee": "Tea", "Reis": "Rice", "Fleisch": "Meat", "Käse": "Cheese", "Fisch": "Fish", "Ei": "Egg", "Tasche": "Handbag", "Telefon": "Telephone", "Computer": "Computer", "Messer": "Knife", "Gabel": "Fork", "Löffel": "Spoon", "Teller": "Plate (dishware)", "Glas": "Drinking glass", "Tasse": "Cup", "Flasche": "Bottle", "Banane": "Banana", "Orange": "Orange (fruit)", "Tomate": "Tomato", "Kartoffel": "Potato", "Suppe": "Soup", "Salat": "Salad", "Kuchen": "Cake", "Eis": "Ice cream", "Saft": "Juice", "Vogel": "Bird", "Pferd": "Horse", "Kuh": "Cattle", "Blume": "Flower", "Mond": "Moon", "Stern": "Star", "Berg": "Mountain", "Meer": "Sea", "Fluss": "River", "Wald": "Forest", "Himmel": "Sky", "Fahrrad": "Bicycle", "Flugzeug": "Airplane", "Schiff": "Ship", "Brücke": "Bridge", "Kirche": "Church (building)", "Moschee": "Mosque", "Krankenhaus": "Hospital", "Apotheke": "Pharmacy", "Bank": "Bank", "Supermarkt": "Supermarket", "Restaurant": "Restaurant", "Hotel": "Hotel", "Flughafen": "Airport", "Koffer": "Suitcase", "Schlüssel": "Key (lock)", "Lampe": "Lamp", "Sofa": "Couch", "Spiegel": "Mirror", "Regenschirm": "Umbrella", "Brille": "Glasses", "Mütze": "Hat", "Mantel": "Overcoat", "Kleid": "Dress", "Kamera": "Camera", "Stift": "Pen", "Heft": "Notebook", "Foto": "Photograph", "Fußball": "Association football", "Herz": "Heart", "Hand": "Hand", "Auge": "Eye", "Ohr": "Ear", "Fuß": "Foot", "Zahn": "Tooth", "Lehrer": "Teacher", "Kind": "Child", "Geld": "Money", "Wetter": "Weather", "schwimmen": "Swimming", "kochen": "Cooking", "laufen": "Running", "singen": "Singing", "tanzen": "Dance", "malen": "Painting", "schlafen": "Sleep", "lachen": "Laughter", "weinen": "Crying", "essen": "Eating", "lesen": "Reading (process)", "schreiben": "Writing", "fliegen": "Flight", "waschen": "Hand washing", "schneiden": "Cutting", "rot": "Red", "blau": "Blue", "grün": "Green", "gelb": "Yellow", "schwarz": "Black", "weiß": "White", "Mutter": "Mother", "Vater": "Father", "Familie": "Family", "Musik": "Music", "Film": "Film", "Kultur": "Culture"};
  LG.picOf = function (w) { return w && PIC[w.lemma] || ''; };
  LG.picMode = function () { var m = LG.settings.pics; return m === 'text' || m === 'image' ? m : 'both'; };
  /* big picture block for a word card; empty when no picture or text-only mode */
  var CK = 'lg.pimg', cache = {};
  try { cache = JSON.parse(localStorage.getItem(CK) || '{}') || {}; } catch (e) { cache = {}; }
  function saveCache() { try { localStorage.setItem(CK, JSON.stringify(cache)); } catch (e) { /* storage full or blocked */ } }
  function photoOf(w) { var u = w && WT[w.lemma] && cache[WT[w.lemma]]; return typeof u === 'string' ? u : ''; }
  function pic(w, cls, label) {
    var e = LG.picOf(w); if (!e || LG.picMode() === 'text') return '';
    var t = WT[w.lemma], u = photoOf(w);
    return '<div class="wpic' + (cls ? ' ' + cls : '') + '" role="img" aria-label="' + LG.esc(label || w.lemma) + '"' + (t ? ' data-pt="' + LG.esc(t) + '"' : '') + '>' + (u ? '<img src="' + LG.esc(u) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '<span class="emo">' + e + '</span>') + '</div>';
  }
  LG.picBlock = function (w) { return pic(w, ''); };
  LG.picBig = function (w, label) { return pic(w, 'big', label); };
  LG.picSmall = function (w) { var p = LG.picOf(w); if (!p || LG.picMode() === 'text') return ''; var t = WT[w.lemma], u = photoOf(w); return '<span class="wpic-s" aria-hidden="true"' + (t ? ' data-pt="' + LG.esc(t) + '"' : '') + '>' + (u ? '<img src="' + LG.esc(u) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : p) + '</span>'; };
  /* swap emoji for real photos once known; falls back to emoji if a photo fails to load */
  function hydrate() {
    LG.$$('[data-pt]').forEach(function (el) {
      var u = cache[el.getAttribute('data-pt')]; if (typeof u !== 'string' || el.querySelector('img')) return;
      var img = new Image(); img.alt = ''; img.referrerPolicy = 'no-referrer'; img.loading = 'lazy';
      var keep = el.innerHTML; img.addEventListener('error', function () { el.innerHTML = keep; cache[el.getAttribute('data-pt')] = 0; });
      img.addEventListener('load', function () { el.innerHTML = ''; el.appendChild(img); });
      img.src = u;
    });
  }
  var fetching = false;
  function loadPhotos() {
    if (fetching || !window.fetch || navigator.onLine === false) return;
    var all = Object.keys(WT).map(function (k) { return WT[k]; }).filter(function (t, i, a) { return a.indexOf(t) === i && cache[t] === undefined; });
    if (!all.length) return; fetching = true;
    var jobs = []; for (var i = 0; i < all.length; i += 50) jobs.push(all.slice(i, i + 50));
    Promise.all(jobs.map(function (ts) {
      var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&pithumbsize=360&redirects=1&format=json&origin=*&titles=' + encodeURIComponent(ts.join('|'));
      return fetch(url, { credentials: 'omit' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (!j || !j.query) return; var q = j.query, to = {};
        (q.normalized || []).forEach(function (n) { to[n.from] = n.to; }); (q.redirects || []).forEach(function (n) { to[n.from] = n.to; });
        var byTitle = {}; Object.keys(q.pages || {}).forEach(function (k) { var p = q.pages[k]; byTitle[p.title] = p.thumbnail && /^https:\/\/upload\.wikimedia\.org\//.test(p.thumbnail.source) ? p.thumbnail.source : 0; });
        ts.forEach(function (t) { var f = t; for (var n = 0; n < 3 && to[f]; n++) f = to[f]; if (byTitle[f] !== undefined) cache[t] = byTitle[f]; });
      }).catch(function () { /* offline: keep emoji */ });
    })).then(function () { fetching = false; saveCache(); hydrate(); });
  }
  LG.picInit = function () {
    var root = document.getElementById('root'); if (!root || !window.MutationObserver) return;
    var busy = false; new MutationObserver(function () { if (busy) return; busy = true; setTimeout(function () { busy = false; hydrate(); }, 60); }).observe(root, { childList: true, subtree: true });
    loadPhotos(); hydrate();
  };
  window.addEventListener('load', function () { setTimeout(LG.picInit, 400); });
  window.addEventListener('online', loadPhotos);

  LG.picSettings = function () {
    var m = LG.picMode(), c = function (v, l) { return '<button type="button" class="chip' + (m === v ? ' on' : '') + '" data-act="setpics" data-v="' + v + '">' + l + '</button>'; };
    return '<div class="setrow"><div><b>Bilder beim Lernen</b><div class="muted" style="font-size:13px">Zeigt zu konkreten Wörtern ein echtes Foto (Wikipedia / Wikimedia Commons, freie Lizenzen). Ohne Internet erscheint stattdessen ein Symbol.</div></div><div class="chips">' + c('both', 'Bedeutung + Bild') + c('text', 'Nur Bedeutung') + c('image', 'Nur Bild') + '</div></div>';
  };
  LG.act.setpics = function (t) { LG.setSetting('pics', t.dataset.v); LG.route(); LG.toast(LG.tr ? LG.tr('Gespeichert') : 'Gespeichert'); };

  /* ---------- guess-the-word + picture map (rendered inside the game view) ---------- */
  function picWords() { return LG.P.words.filter(function (w) { return LG.picOf(w); }); }
  LG.picMapHtml = function () {
    var ws = picWords(), srs = LG.pg.srs || {}, known = LG.pg.words || [], n = 0;
    var tiles = ws.map(function (w) {
      var s = srs[w.id], st = known.indexOf(w.id) < 0 ? 0 : (s && s.box >= 3 ? 2 : 1); if (st === 2) n++;
      return '<span class="ptile s' + st + '" title="' + LG.esc(w.display) + '"' + (WT[w.lemma] ? ' data-pt="' + LG.esc(WT[w.lemma]) + '"' : '') + '><i>' + LG.picOf(w) + '</i></span>';
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
      area.innerHTML = '<div class="card"><div class="row between"><h3>Wort erraten</h3><span class="muted">' + (i + 1) + ' / ' + rounds.length + '</span></div>' + LG.picBig(w, 'Bild') + '<div class="gopts">' + opts.map(function (o, k) { return '<button class="btn soft" data-k="' + k + '">' + LG.esc(lab(o)) + '</button>'; }).join('') + '</div></div>';
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
