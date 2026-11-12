/* Languway German - languages: interface language, helper language (gradual), onboarding, cognates, compounds */
(function () {
  'use strict';
  var LG = window.LG, esc = LG.esc, ic = LG.ic;
  var AR1 = window.LGAR1 || { w: {}, p: {} }, AR2 = window.LGAR2 || { lv: [], gr: [], ui: {} };
  var LANGS = [['de', 'Deutsch', 'DE'], ['en', 'English', 'EN'], ['ar', 'العربية', 'ع']];
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- state ---------- */
  LG.lang = function () { var l = LG.settings.ui; return l === 'en' || l === 'ar' ? l : 'de'; };
  /* every language a learner may speak; HELPERS = those we ship explanation packs for */
  var ALLLANGS = [['ar', 'العربية'], ['en', 'English'], ['fr', 'Français'], ['es', 'Español'], ['tr', 'Türkçe'], ['ru', 'Русский'], ['fa', 'فارسی'], ['ur', 'اردو'], ['zh', '中文'], ['hi', 'हिन्दी'], ['id', 'Bahasa Indonesia'], ['pt', 'Português'], ['it', 'Italiano'], ['bn', 'বাংলা'], ['other', 'Andere · Other']];
  var HELPERS = ['ar', 'en', 'fr', 'es', 'tr', 'ru', 'fa', 'ur', 'zh', 'hi', 'id'];
  LG.HELPERS = HELPERS; LG.ALLLANGS = ALLLANGS;
  function langName(c) { for (var i = 0; i < ALLLANGS.length; i++) if (ALLLANGS[i][0] === c) return ALLLANGS[i][1]; return c; }
  LG.bestHelper = function (native, known) {
    var order = [native].concat(known || []); for (var i = 0; i < order.length; i++) if (order[i] && HELPERS.indexOf(order[i]) > -1) return order[i];
    return 'en';
  };
  LG.helper = function () {
    var h = LG.settings.helper;
    if (h === 'none' || (h && HELPERS.indexOf(h) > -1)) return h;
    if (LG.settings.native) return LG.bestHelper(LG.settings.native, LG.settings.known);
    return LG.lang() === 'ar' ? 'ar' : 'en';
  };
  var PK = {};
  function loadPack(c) {
    if (PK[c] || c === 'en' || c === 'none') return PK[c] || null;
    if (c === 'ar') { PK.ar = { name: 'العربية', dir: 'rtl', title: 'شرح بالعربية', w: AR1.w, p: AR1.p, gr: AR2.gr }; return PK.ar; }
    var g = window.LGPACK && window.LGPACK[c]; if (g) { PK[c] = g; return g; }
    if (!loadPack.req) loadPack.req = {};
    if (!loadPack.req[c]) { loadPack.req[c] = 1; var sc = document.createElement('script'); sc.src = 'lang-' + c + '.js'; sc.onload = function () { if (LG.curRoute) LG.route(); }; document.head.appendChild(sc); }
    return null;
  }
  LG.pack = function () { return loadPack(LG.helper()); };
  LG.helperName = function () { var h = LG.helper(); return h === 'none' ? 'English' : langName(h); };
  LG.hasChosenLang = function () { return !!LG.settings.ui; };

  /* ---------- dictionary ---------- */
  var MAP = {}, MAPLANG = '';
  function buildMap() {
    var l = LG.lang(); if (MAPLANG === l) return; MAPLANG = l; MAP = {};
    if (l === 'de') return;
    Object.keys(AR2.ui || {}).forEach(function (k) { var v = AR2.ui[k]; var t = v && v[l]; if (t && t !== k) MAP[k] = t; });
    if (l === 'ar') (AR2.lv || []).forEach(function (x, i) { var lv = LG.D && LG.D.LEVELS[i]; if (lv && x) { if (x.t) MAP[lv.t] = x.t; if (x.g && lv.g) MAP[lv.g] = x.g; } });
    var X = window.LGXTRA && window.LGXTRA[l]; if (X) Object.keys(X).forEach(function (k) { if (X[k] && X[k] !== k) MAP[k] = X[k]; });
  }
  LG.tr = function (s) { buildMap(); return MAP[s] || s; };

  var SKIP = '[data-nt],.readtext,.ln,.exlist,.ex,.msg,textarea,input,script,style,pre,.tile,.art,.wcard h3,.cmp,.cogs .de,.txt,.crow,.phrase,.defs .de';
  function trNode(n) {
    var s = n.nodeValue; if (!s || !s.trim()) return;
    var core = s.trim(), m = MAP[s] || MAP[core];
    if (!m && /\d/.test(core)) {
      var nums = core.match(/\d+/g), tk = core.replace(/\d+/g, '#'), t2 = MAP[tk];
      if (t2) { var i = 0; m = t2.replace(/#/g, function () { return nums[i++] || '#'; }); }
    }
    if (!m) return;
    if (n.parentNode && n.parentNode.closest && n.parentNode.closest(SKIP)) return;
    var nv = MAP[s] ? m : s.replace(core, m); if (nv !== s) n.nodeValue = nv;
  }
  function trTree(root) {
    if (!root || LG.lang() === 'de') return; buildMap();
    if (root.nodeType === 3) { trNode(root); return; }
    if (root.nodeType !== 1) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n, list = [];
    while ((n = w.nextNode())) list.push(n); list.forEach(trNode);
    var els = root.querySelectorAll ? root.querySelectorAll('[placeholder],[aria-label],[title],[alt]') : [];
    var all = [root].concat([].slice.call(els));
    all.forEach(function (el) { if (!el.getAttribute) return; ['placeholder', 'aria-label', 'title', 'alt'].forEach(function (a) { var v = el.getAttribute(a); if (v && MAP[v]) el.setAttribute(a, MAP[v]); }); });
  }
  var busy = false, obs = null;
  function startObs() {
    if (obs) return; obs = new MutationObserver(function (ms) {
      if (busy || LG.lang() === 'de') return; busy = true;
      try { ms.forEach(function (m) { if (m.type === 'childList') m.addedNodes.forEach(trTree); else if (m.type === 'characterData') trNode(m.target); }); } finally { busy = false; }
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function applyDir() {
    var l = LG.lang(), h = document.documentElement;
    h.setAttribute('lang', l); h.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    document.title = LG.tr(document.title);
  }
  LG.setLang = function (l) {
    LG.setSetting('ui', l); MAPLANG = ''; applyDir();
    if (!LG.settings.helper) { /* helper follows interface unless set explicitly */ }
    var ov = document.getElementById('langask'); if (ov) ov.remove();
    if (LG.curRoute) LG.route(); trTree(document.body);
  };
  LG.act.setui = function (t) { LG.setLang(t.dataset.v); };
    LG.act.setalways = function (t) { LG.setSetting('always', !LG.settings.always); LG.route(); };

  /* ---------- helper language: gradual fading ---------- */
  LG.helpMode = function (n) { if (LG.helper() === 'none') return 'off'; if (LG.settings.always) return 'open'; return n <= 10 ? 'open' : n <= 24 ? 'fold' : 'off'; };
  LG.helpHtml = function (n, g) {
    var mode = LG.helpMode(n); if (mode === 'off') return '';
    var pk = LG.pack(), txt = (pk && pk.gr && pk.gr[n - 1]) || g.en; if (!txt) return '';
    var title = pk && pk.gr && pk.gr[n - 1] ? pk.title : 'Explanation in English';
    return '<details class="enhelp" data-nt="1"' + (mode === 'open' ? ' open' : '') + ' dir="' + (pk && pk.dir || 'ltr') + '"><summary>' + esc(title) + '</summary>' + esc(txt) + '</details>';
  };
  LG.showDefEN = function (n) { return LG.helper() === 'en' && (n || 0) <= 20; };

  /* ---------- word glosses in the helper language ---------- */
  function patchWords() {
    (LG.P && LG.P.words || []).forEach(function (w) {
      if (w._p) return; w._p = true; var en = w.en, id = w.id;
      function cur() { var pk = LG.pack(); return (pk && pk.w && pk.w[id]) || en; }
      Object.defineProperty(w, 'enOrig', { value: en });
      Object.defineProperty(w, 'en', { get: cur, set: function (v) { en = v; }, enumerable: true, configurable: true });
      Object.defineProperty(w, 'gloss', { get: function () { return (cur() || '').split(/[,;،，]/)[0].trim(); }, set: function () {}, enumerable: true, configurable: true });
    });
  }
  LG.phraseGloss = function (de, en) { var pk = LG.pack(); return pk && pk.p && pk.p[de] || en; };

  /* ---------- compounds ---------- */
  var COMP = { Fahrkarte: ['Fahr', 'karte'], Bahnhof: ['Bahn', 'hof'], Wortschatz: ['Wort', 'schatz'], Arbeitsplatz: ['Arbeits', 'platz'], Schlagzeile: ['Schlag', 'zeile'], Klimawandel: ['Klima', 'wandel'], Redewendung: ['Rede', 'wendung'], Sprichwort: ['Sprich', 'wort'], Zusammenhang: ['Zusammen', 'hang'], Schlussfolgerung: ['Schluss', 'folgerung'], Voraussetzung: ['Voraus', 'setzung'], Fortschritt: ['Fort', 'schritt'], Herausforderung: ['Heraus', 'forderung'], Wissenschaft: ['Wissen', 'schaft'], Mittwoch: ['Mitt', 'woch'], Donnerstag: ['Donners', 'tag'], Freitag: ['Frei', 'tag'], Samstag: ['Sams', 'tag'], Sonntag: ['Sonn', 'tag'], Dienstag: ['Diens', 'tag'] };
  var COMP_EX = [
    ['Hand', 'Schuh', 'Handschuh', 'glove (hand + shoe)', 'قفاز (يد + حذاء)'], ['Haus', 'Tür', 'Haustür', 'front door (house + door)', 'باب البيت (بيت + باب)'],
    ['Haus', 'Aufgabe', 'Hausaufgabe', 'homework (house + task)', 'واجب منزلي (بيت + مهمة)'], ['Kranken', 'Haus', 'Krankenhaus', 'hospital (sick + house)', 'مستشفى (مرضى + بيت)'],
    ['Flug', 'Hafen', 'Flughafen', 'airport (flight + harbour)', 'مطار (طيران + ميناء)'], ['Zahn', 'Arzt', 'Zahnarzt', 'dentist (tooth + doctor)', 'طبيب أسنان (سنّ + طبيب)'],
    ['Schreib', 'Tisch', 'Schreibtisch', 'desk (write + table)', 'مكتب (كتابة + طاولة)'], ['Kühl', 'Schrank', 'Kühlschrank', 'fridge (cool + cupboard)', 'ثلاجة (تبريد + خزانة)'],
    ['Geburts', 'Tag', 'Geburtstag', 'birthday (birth + day)', 'عيد ميلاد (ولادة + يوم)'], ['Fuß', 'Ball', 'Fußball', 'football (foot + ball)', 'كرة القدم (قدم + كرة)'],
    ['Sonnen', 'Brille', 'Sonnenbrille', 'sunglasses (sun + glasses)', 'نظارة شمسية (شمس + نظارة)'], ['Wasser', 'Flasche', 'Wasserflasche', 'water bottle', 'زجاجة ماء (ماء + زجاجة)'],
    ['Staub', 'Sauger', 'Staubsauger', 'vacuum cleaner (dust + sucker)', 'مكنسة كهربائية (غبار + ماصّ)'], ['Kinder', 'Garten', 'Kindergarten', 'kindergarten (children + garden)', 'روضة أطفال (أطفال + حديقة)'],
    ['Auto', 'Bahn', 'Autobahn', 'motorway (car + track)', 'طريق سريع (سيارة + طريق)'], ['Reise', 'Büro', 'Reisebüro', 'travel agency (travel + office)', 'وكالة سفر (سفر + مكتب)']];
  function ensureCompStyle() { }
  LG.cmpHtml = function (lemma, display) {
    var p = COMP[lemma]; if (!p) return null;
    return '<span class="cmp"><span class="cp1">' + esc(p[0]) + '</span><span class="cp2">' + esc(lemma.slice(p[0].length)) + '</span></span>';
  };
  LG.compCard = function (n) {
    var k = (n - 1) % 4, items = COMP_EX.slice(k * 4, k * 4 + 4), h = LG.helper() === 'ar' ? 'ar' : LG.helper() === 'none' ? 'none' : 'en';
    return '<div class="card cmpcard" data-nt-card="1"><h3>' + ic('bulb') + ' Zusammengesetzte Wörter</h3><p class="muted">Im Deutschen werden Wörter zusammengeklebt. Jedes Teil hat eine eigene Farbe – so kannst du lange Wörter leichter lesen und merken.</p>' +
      items.map(function (x) {
        var say = x[0] + '. ' + x[1] + '. ' + x[2], gl = h === 'ar' ? x[4] : x[3];
        return '<div class="cmprow"><div class="cmp big"><span class="cp1">' + esc(x[0]) + '</span><span class="cp2">' + esc(x[1].toLowerCase() === x[1] ? x[1] : x[1].charAt(0).toLowerCase() + x[1].slice(1)) + '</span></div><div class="cmpgl" data-nt="1" dir="' + (h === 'ar' ? 'rtl' : 'ltr') + '">' + (h === 'none' ? '' : esc(gl)) + '</div>' +
          '<button class="btn sm soft" data-act="slow" data-say="' + esc(say) + '">Langsam</button><button class="iconbtn" data-act="speak" data-say="' + esc(x[2]) + '" aria-label="Anhören">' + ic('speaker') + '</button></div>';
      }).join('') + '</div>';
  };

  /* ---------- cognates ---------- */
  var COG = [['Wasser', 'water', 'ماء'], ['Haus', 'house', 'بيت'], ['Hand', 'hand', 'يد'], ['Buch', 'book', 'كتاب'], ['Apfel', 'apple', 'تفاحة'], ['Brot', 'bread', 'خبز'], ['Fisch', 'fish', 'سمكة'], ['Mutter', 'mother', 'أم'], ['Vater', 'father', 'أب'], ['Bruder', 'brother', 'أخ'], ['Schwester', 'sister', 'أخت'], ['Winter', 'winter', 'شتاء'], ['Sommer', 'summer', 'صيف'], ['Garten', 'garden', 'حديقة'], ['Finger', 'finger', 'إصبع'], ['Arm', 'arm', 'ذراع'], ['Bett', 'bed', 'سرير'], ['Name', 'name', 'اسم'], ['Hotel', 'hotel', 'فندق'], ['Telefon', 'telephone', 'هاتف'], ['Musik', 'music', 'موسيقى'], ['Taxi', 'taxi', 'سيارة أجرة'], ['Milch', 'milk', 'حليب'], ['Gold', 'gold', 'ذهب'], ['Sand', 'sand', 'رمل'], ['Schiff', 'ship', 'سفينة']];
  LG.cognateCard = function (n) {
    var h = LG.helper() === 'ar' ? 'ar' : 'en', part = n <= 1 ? COG.slice(0, 12) : COG.slice(12);
    return '<details class="card cogs"' + (n <= 1 ? ' open' : '') + '><summary><b>' + ic('globe') + ' Ähnliche Wörter (Kognaten)</b></summary><p class="muted">Diese deutschen Wörter sehen aus wie das englische Wort – ein leichter Start!</p><div class="cogrid">' +
      part.map(function (c) { return '<button class="cog" data-act="speak" data-say="' + esc(c[0]) + '"><b class="de" data-nt="1">' + esc(c[0]) + '</b><span data-nt="1">' + esc(c[1]) + '</span>' + (h === 'ar' ? '<small data-nt="1" dir="rtl">' + esc(c[2]) + '</small>' : '') + '</button>'; }).join('') + '</div></details>';
  };

  /* ---------- language buttons ---------- */
  LG.langSwitch = function () {
    var cur = LG.lang();
    return '<span class="langsw" role="group" aria-label="Sprache · Language · اللغة">' + LANGS.map(function (l) { return '<button type="button" data-act="setui" data-v="' + l[0] + '" class="' + (cur === l[0] ? 'on' : '') + '" lang="' + l[0] + '" aria-label="' + l[1] + '">' + l[2] + '</button>'; }).join('') + '</span>';
  };
  LG.langSettings = function () {
    var cur = LG.lang(), h = LG.helper(), nat = LG.settings.native || '', known = LG.settings.known || [];
    var chip = function (act, v, label, on) { return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-act="' + act + '" data-v="' + v + '" data-nt="1">' + label + '</button>'; };
    var opts = ALLLANGS.filter(function (l) { return l[0] !== 'other'; }).map(function (l) { return '<option value="' + l[0] + '"' + (nat === l[0] ? ' selected' : '') + '>' + l[1] + '</option>'; }).join('');
    var kn = ALLLANGS.map(function (l) { return chip('toggleknown', l[0], l[1], known.indexOf(l[0]) > -1); }).join('');
    var hl = HELPERS.map(function (c) { return chip('sethelper', c, langName(c), LG.settings.helper === c); }).join('');
    return '<div class="setrow"><div><b>Sprache der Oberfläche</b><div class="muted" style="font-size:13px">Menüs, Buttons und Hinweise.</div></div><div class="chips">' + LANGS.map(function (l) { return chip('setui', l[0], l[1], cur === l[0]); }).join('') + '</div></div>' +
      '<div class="setrow"><label for="s-native"><b>Muttersprache</b><div class="muted" style="font-size:13px">Die Sprache, in der du am schnellsten verstehst.</div></label><select id="s-native" data-nt="1"><option value="">–</option>' + opts + '</select></div>' +
      '<div class="setrow"><div><b>Weitere Sprachen, die du gut sprichst</b></div><div class="chips">' + kn + '</div></div>' +
      '<div class="setrow"><div><b>Erklärsprache</b><div class="muted" style="font-size:13px">Automatisch gewählt: <b data-nt="1">' + (h === 'none' ? '–' : langName(h)) + '</b>. <span>Hier kannst du sie selbst festlegen.</span></div></div><div class="chips">' + chip('sethelper', 'auto', 'Auto', !LG.settings.helper) + hl + chip('sethelper', 'none', 'Keine', LG.settings.helper === 'none') + '</div></div>' +
      '<div class="setrow"><div><b>Hilfe immer anzeigen</b><div class="muted" style="font-size:13px">Sonst wird die Erklärsprache ab Stufe 11 eingeklappt und ab Stufe 25 ausgeblendet.</div></div><button class="switchbtn' + (LG.settings.always ? ' on' : '') + '" data-act="setalways" role="switch" aria-checked="' + !!LG.settings.always + '" aria-label="Hilfe immer anzeigen"></button></div>';
  };
  LG.act.sethelper = function (t) { LG.setSetting('helper', t.dataset.v === 'auto' ? '' : t.dataset.v); LG.route(); LG.toast(LG.tr('Gespeichert')); };
  LG.act.toggleknown = function (t) { var k = (LG.settings.known || []).slice(), v = t.dataset.v, i = k.indexOf(v); if (i > -1) k.splice(i, 1); else k.push(v); LG.setSetting('known', k); LG.route(); };
  document.addEventListener('change', function (e) { if (e.target && e.target.id === 's-native') { LG.setSetting('native', e.target.value); LG.route(); } });
  function langAsk() {
    if (LG.hasChosenLang() || document.getElementById('langask') || LG.S.user) return;
    var d = document.createElement('div'); d.id = 'langask'; d.className = 'langask'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = '<div class="langask__box"><img src="logo-round.png" alt="" width="84" height="84"><h2>Welcome · أهلاً بك · Willkommen</h2><p>Choose the language of the interface and explanations.<br>اختر لغة الواجهة والشرح.<br>Wähle die Sprache der Oberfläche.</p><div class="langask__btns">' +
      '<button data-act="setui" data-v="ar">العربية</button><button data-act="setui" data-v="en">English</button><button data-act="setui" data-v="de">Deutsch</button></div></div>';
    document.body.appendChild(d);
  }

  /* ---------- welcome / onboarding ---------- */
  function onbKey() { return 'lg.onb.' + (LG.S.user && LG.S.user.username); }
  LG.onboarded = function () { return !!lsGet(onbKey(), false) || !!(LG.pg && LG.pg.placementDone); };
  LG.views.welcome = function () {
    var known = LG.settings.known || [], nat = LG.settings.native || '';
    var chk = function (v, label) { return '<label class="kchip"><input type="checkbox" value="' + v + '"' + (known.indexOf(v) > -1 ? ' checked' : '') + '><span data-nt="1">' + label + '</span></label>'; };
    var lvl = function (v, t, s, i) { return '<label class="lvlcard"><input type="radio" name="wl" value="' + v + '"' + (i === 0 ? ' checked' : '') + '><span><b>' + t + '</b><small>' + s + '</small></span></label>'; };
    var opts = '<option value="">–</option>' + ALLLANGS.filter(function (l) { return l[0] !== 'other'; }).map(function (l) { return '<option value="' + l[0] + '"' + (nat === l[0] ? ' selected' : '') + '>' + l[1] + '</option>'; }).join('') + '<option value="other">Andere · Other</option>';
    return Promise.resolve({
      title: 'Willkommen', heading: 'Willkommen', html:
        '<div class="card onb"><h2>Los geht\'s!</h2><p class="muted">Drei kurze Fragen. Wir wählen daraus die Sprache, in der wir dir Deutsch am besten erklären.</p>' +
        '<h3>1. Sprache der Oberfläche</h3>' + LG.langSwitch() +
        '<h3>2. Deine Muttersprache</h3><select id="wn" data-nt="1" class="wsel">' + opts + '</select>' +
        '<h3>3. Welche weiteren Sprachen sprichst du gut?</h3><div class="kchips" id="wk">' + ALLLANGS.map(function (l) { return chk(l[0], l[1]); }).join('') + '</div>' +
        '<p class="muted" id="wbest" style="margin-top:10px"></p>' +
        '<h3>4. Wie gut kannst du Deutsch?</h3><div class="lvlcards">' +
        lvl('beg', 'Anfänger:in', 'Ich fange bei null an – mit dem Alphabet.', 0) + lvl('mid', 'Mittel', 'Ich kenne Grundlagen – bitte teste mein Niveau.', 1) + lvl('adv', 'Fortgeschritten', 'Ich spreche schon gut – bitte teste mein Niveau.', 2) + '</div>' +
        '<div class="row" style="margin-top:16px"><button class="btn" id="wgo">Weiter ›</button></div></div>',
      mount: function (root) {
        function read() { return { nat: LG.$('#wn', root).value, ks: [].slice.call(root.querySelectorAll('#wk input:checked')).map(function (i) { return i.value; }) }; }
        function upd() { var r = read(), b = LG.bestHelper(r.nat, r.ks); LG.$('#wbest', root).innerHTML = LG.tr('Erklärsprache') + ': <b data-nt="1">' + langName(b) + '</b>' + (r.nat && b !== r.nat && r.nat !== 'other' ? ' <span data-nt="1">(' + LG.tr('Für deine Muttersprache haben wir noch keine Erklärungen – wir nehmen die beste Alternative.') + ')</span>' : ''); }
        root.addEventListener('change', upd); upd();
        LG.$('#wgo', root).onclick = function () {
          var r = read(), lv = (root.querySelector('input[name=wl]:checked') || {}).value || 'beg';
          LG.setSetting('native', r.nat); LG.setSetting('known', r.ks); LG.setSetting('helper', '');
          lsSet(onbKey(), true);
          if (lv === 'beg') { LG.C.applyPlacement(LG.pg, 1); LG.save(true); LG.go('/level/1'); } else LG.go('/placement');
        };
      } });
  };
  LG.skipOnboarding = function () { lsSet(onbKey(), true); };

  /* ---------- init ---------- */
  LG.i18nInit = function () { patchWords(); applyDir(); startObs(); buildMap(); langAsk(); trTree(document.body); };
  window.addEventListener('hashchange', function () { setTimeout(function () { langAsk(); }, 50); });
  if (document.readyState !== 'loading') LG.i18nInit(); else document.addEventListener('DOMContentLoaded', LG.i18nInit);
})();
