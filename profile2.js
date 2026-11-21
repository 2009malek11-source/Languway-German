/* Languway German – profile: account, progress, certificates, what is left, honest assessment */
(function () {
  'use strict';
  var LG = window.LG, C = LG.C, D = LG.D, esc = LG.esc, ic = LG.ic;
  function assess(real, avg, done, p) {
    var due = LG.dueWords().length;
    if (!real.length) return { tone: 'idle', t: 'Noch keine Einschätzung', d: 'Mache deinen ersten Test, dann kann dir die App sagen, wie du vorankommst.', tips: ['Starte den Einstufungstest oder die erste Lektion.'] };
    var tips = [];
    if (due) tips.push(due + ' Wörter sind zur Wiederholung fällig.');
    if (avg >= 88 && done >= 3) return { tone: 'top', t: 'Fortgeschritten', d: 'Dein Durchschnitt liegt bei ' + avg + ' %. Du lernst sicher und schnell – du kannst schwerere Stufen angehen.', tips: tips.concat(['Versuche die Abschlussprüfung deines Niveaus.']) };
    if (avg >= 75) return { tone: 'good', t: 'Gut auf Kurs', d: 'Dein Durchschnitt liegt bei ' + avg + ' %. Mit regelmäßiger Wiederholung erreichst du bald das nächste Niveau.', tips: tips.concat(['Lerne täglich, auch nur 10 Minuten.']) };
    return { tone: 'low', t: 'Mehr Übung nötig', d: 'Dein Durchschnitt liegt bei ' + avg + ' % – unter den 75 %, die du zum Bestehen brauchst. Wiederhole die Wörter und Lektionen, bevor du weitergehst.', tips: tips.concat(['Übe die Fehlerwörter im Bereich „Wiederholen“.', 'Höre die Lektions-Dialoge noch einmal.']) };
  }
  LG.views.profile = function () {
    var u = LG.S.user, p = LG.pg, n = C.currentLevel(p), done = LG.passedCount(), lv = D.LEVELS[n - 1];
    var real = p.tests.filter(function (t) { return t.kind !== 'placement'; }), avg = real.length ? Math.round(real.reduce(function (a, t) { return a + t.pct; }, 0) / real.length) : 0;
    var stages = C.STAGES.filter(function (s) { return p.stagePassed[s] && !p.stagePassed[s].skipped; }).length;
    var certs = 0, i; for (i = 1; i <= 30; i++) if (p.passed[i] && !p.passed[i].skipped) certs++; certs += stages + (p.stagePassed.FINAL ? 1 : 0);
    var left = 30 - done, a = assess(real, avg, done, p), pct = Math.round(done / 30 * 100);
    var ach = LG.achList.map(function (x) { var on = !!p.ach[x.id]; return '<div class="ach' + (on ? '' : ' off') + '"><span class="ic">' + ic(x.icon) + '</span><div><b>' + esc(x.title) + '</b><span>' + esc(x.desc) + '</span></div></div>'; }).join('');
    return { title: 'Profil', heading: 'Profil', html:
      '<section class="gl pad prof"><span class="avatar big">' + esc((u.name || '?').trim().charAt(0).toUpperCase()) + '</span><div class="prof__t"><h2>' + esc(u.name) + '</h2><div class="muted">@' + esc(u.username) + '</div><div class="row"><span class="tag">' + lv.c + ' · Stufe ' + n + '</span><span class="tag">' + LG.hm(p.minutes || 0) + ' Lernzeit</span></div></div></section>' +
      '<section class="gl pad"><h3>' + ic('user') + ' Konto</h3><div class="setrows">' +
      '<div class="setrow"><span>Benutzername</span><b dir="ltr">' + esc(u.username) + '</b></div>' +
      '<div class="setrow"><span>E-Mail</span><b>Nicht erforderlich – Anmeldung mit Benutzername</b></div>' +
      '<div class="setrow"><span>Passwort</span><b dir="ltr">••••••••</b><button class="btn sm soft" data-act="chpw">Ändern</button></div>' +
      (u.created_at ? '<div class="setrow"><span>Mitglied seit</span><b>' + esc(LG.fmtDate(u.created_at)) + '</b></div>' : '') + '</div><p class="muted small">Aus Sicherheitsgründen wird dein Passwort nur verschlüsselt gespeichert und kann nicht angezeigt werden.</p></section>' +
      '<section class="gl pad assess ' + a.tone + '"><h3>' + ic('trend') + ' Einschätzung</h3><div class="assess__h"><b>' + esc(a.t) + '</b></div><p>' + esc(a.d) + '</p><ul>' + a.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>' +
      '<div class="grid c4"><div class="card stat"><b>' + done + '/30</b><span>Stufen geschafft</span></div><div class="card stat"><b>' + left + '</b><span>Stufen noch offen</span></div><div class="card stat"><b>' + (real.length ? avg + ' %' : '–') + '</b><span>Durchschnitt (' + real.length + ' Tests)</span></div><div class="card stat"><b>' + certs + '</b><span>Zertifikate erhalten</span></div></div>' +
      '<section class="gl pad"><h3>' + ic('trophy') + ' Fortschritt</h3><div class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div><p class="muted">' + pct + ' % des Kurses · ' + stages + ' von 6 Abschlussprüfungen · ' + (p.stagePassed.FINAL ? 'Gesamtprüfung bestanden' : 'Gesamtprüfung noch offen') + '</p><div class="row"><a class="btn" href="#/certificates">' + ic('award') + ' Meine Zertifikate</a><a class="btn soft" href="#/progress">' + ic('trend') + ' Mein Fortschritt</a></div></section>' +
      '<section class="gl pad"><h3>Erfolge</h3><div class="grid c2">' + ach + '</div></section>' };
  };
})();
