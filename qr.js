/* Minimal QR Code encoder (byte mode, error correction L/M/Q/H, versions 1-25).
   Written for Languway German; no dependencies. Exposes LGQR.matrix(text). */
(function (root) {
  'use strict';
  // Nayuki-style tables, versions 1..25. Level order: L, M, Q, H (format-bit indicators 1, 0, 3, 2)
  var ECC = {
    L: [7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26],
    M: [10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28],
    Q: [13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30],
    H: [17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30]
  };
  var BLK = {
    L: [1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12],
    M: [1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21],
    Q: [1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29],
    H: [1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35]
  };
  var FMT = { L: 1, M: 0, Q: 3, H: 2 };
  var ECC_PER_BLOCK, NUM_BLOCKS, FMTBITS = 1, MAXV = 25;

  function rawModules(ver) {
    var r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) { var n = Math.floor(ver / 7) + 2; r -= (25 * n - 10) * n - 55; if (ver >= 7) r -= 36; }
    return r;
  }
  function dataCodewords(ver) {
    return Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[ver - 1] * NUM_BLOCKS[ver - 1];
  }
  function gfMul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; }
    return z;
  }
  function rsDivisor(deg) {
    var res = [], i, j;
    for (i = 0; i < deg - 1; i++) res.push(0);
    res.push(1);
    var root = 1;
    for (i = 0; i < deg; i++) {
      for (j = 0; j < res.length; j++) { res[j] = gfMul(res[j], root); if (j + 1 < res.length) res[j] ^= res[j + 1]; }
      root = gfMul(root, 0x02);
    }
    return res;
  }
  function rsRemainder(data, div) {
    var res = div.map(function () { return 0; });
    data.forEach(function (b) {
      var f = b ^ res.shift();
      res.push(0);
      div.forEach(function (c, i) { res[i] ^= gfMul(c, f); });
    });
    return res;
  }
  function utf8(str) {
    var out = [];
    var s = unescape(encodeURIComponent(str));
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return out;
  }

  function encode(text, lvl) {
    lvl = lvl || 'L'; ECC_PER_BLOCK = ECC[lvl]; NUM_BLOCKS = BLK[lvl]; FMTBITS = FMT[lvl];
    var bytes = utf8(text), ver, cap, ccBits;
    for (ver = 1; ver <= MAXV; ver++) {
      ccBits = ver < 10 ? 8 : 16;
      if (4 + ccBits + bytes.length * 8 <= dataCodewords(ver) * 8) break;
    }
    if (ver > MAXV) throw new Error('QR: text too long');
    var bits = [];
    function put(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    put(4, 4); put(bytes.length, ccBits);
    bytes.forEach(function (b) { put(b, 8); });
    cap = dataCodewords(ver) * 8;
    put(0, Math.min(4, cap - bits.length));
    put(0, (8 - bits.length % 8) % 8);
    for (var pad = 0xEC; bits.length < cap; pad ^= 0xEC ^ 0x11) put(pad, 8);
    var data = [];
    for (var i = 0; i < bits.length; i += 8) {
      var v = 0; for (var k = 0; k < 8; k++) v = (v << 1) | bits[i + k]; data.push(v);
    }
    // blocks + interleave
    var nb = NUM_BLOCKS[ver - 1], el = ECC_PER_BLOCK[ver - 1];
    var raw = Math.floor(rawModules(ver) / 8), shortCount = nb - raw % nb, shortLen = Math.floor(raw / nb);
    var blocks = [], div = rsDivisor(el), p = 0;
    for (i = 0; i < nb; i++) {
      var dat = data.slice(p, p + shortLen - el + (i < shortCount ? 0 : 1)); p += dat.length;
      var ecc = rsRemainder(dat, div);
      if (i < shortCount) dat.push(0);
      blocks.push(dat.concat(ecc));
    }
    var all = [];
    for (i = 0; i < blocks[0].length; i++) {
      blocks.forEach(function (blk, j) { if (i !== shortLen - el || j >= shortCount) all.push(blk[i]); });
    }
    return build(ver, all);
  }

  function build(ver, codewords) {
    var size = ver * 4 + 17, m = [], fn = [], x, y;
    for (y = 0; y < size; y++) { m.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }
    function setFn(px, py, dark) { m[py][px] = dark; fn[py][px] = true; }
    for (var i = 0; i < size; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }
    function finder(cx, cy) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var d = Math.max(Math.abs(dx), Math.abs(dy)), xx = cx + dx, yy = cy + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) setFn(xx, yy, d !== 2 && d !== 4);
      }
    }
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    var pos = [];
    if (ver > 1) {
      var na = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (na * 2 - 2)) * 2;
      pos = [6];
      for (var ps = size - 7; pos.length < na; ps -= step) pos.splice(1, 0, ps);
    }
    pos.forEach(function (ax, ia) {
      pos.forEach(function (ay, ib) {
        if ((ia === 0 && ib === 0) || (ia === 0 && ib === pos.length - 1) || (ia === pos.length - 1 && ib === 0)) return;
        for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) setFn(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      });
    });
    function formatBits(mask) {
      var d = (FMTBITS << 3) | mask, rem = d, k;
      for (k = 0; k < 10; k++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var bits = ((d << 10) | rem) ^ 0x5412;
      function b(n) { return ((bits >>> n) & 1) !== 0; }
      for (k = 0; k <= 5; k++) setFn(8, k, b(k));
      setFn(8, 7, b(6)); setFn(8, 8, b(7)); setFn(7, 8, b(8));
      for (k = 9; k < 15; k++) setFn(14 - k, 8, b(k));
      for (k = 0; k < 8; k++) setFn(size - 1 - k, 8, b(k));
      for (k = 8; k < 15; k++) setFn(8, size - 15 + k, b(k));
      setFn(8, size - 8, true);
    }
    formatBits(0);
    if (ver >= 7) {
      var rem = ver;
      for (i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      var vb = (ver << 12) | rem;
      for (i = 0; i < 18; i++) {
        var bit = ((vb >>> i) & 1) !== 0, a = size - 11 + i % 3, b2 = Math.floor(i / 3);
        setFn(a, b2, bit); setFn(b2, a, bit);
      }
    }
    // zig-zag data placement
    var idx = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) for (var j = 0; j < 2; j++) {
        x = right - j;
        var up = ((right + 1) & 2) === 0;
        y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && idx < codewords.length * 8) {
          m[y][x] = ((codewords[idx >>> 3] >>> (7 - (idx & 7))) & 1) !== 0; idx++;
        }
      }
    }
    function applyMask(mask) {
      for (var yy = 0; yy < size; yy++) for (var xx = 0; xx < size; xx++) {
        var inv;
        switch (mask) {
          case 0: inv = (xx + yy) % 2 === 0; break;
          case 1: inv = yy % 2 === 0; break;
          case 2: inv = xx % 3 === 0; break;
          case 3: inv = (xx + yy) % 3 === 0; break;
          case 4: inv = (Math.floor(xx / 3) + Math.floor(yy / 2)) % 2 === 0; break;
          case 5: inv = xx * yy % 2 + xx * yy % 3 === 0; break;
          case 6: inv = (xx * yy % 2 + xx * yy % 3) % 2 === 0; break;
          default: inv = ((xx + yy) % 2 + xx * yy % 3) % 2 === 0;
        }
        if (!fn[yy][xx] && inv) m[yy][xx] = !m[yy][xx];
      }
    }
    function penalty() {
      var score = 0, r, c, run, dark = 0;
      for (r = 0; r < size; r++) {
        run = 1;
        for (c = 1; c < size; c++) { if (m[r][c] === m[r][c - 1]) { run++; if (run === 5) score += 3; else if (run > 5) score++; } else run = 1; }
      }
      for (c = 0; c < size; c++) {
        run = 1;
        for (r = 1; r < size; r++) { if (m[r][c] === m[r - 1][c]) { run++; if (run === 5) score += 3; else if (run > 5) score++; } else run = 1; }
      }
      for (r = 0; r < size - 1; r++) for (c = 0; c < size - 1; c++) {
        var v = m[r][c]; if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
      }
      for (r = 0; r < size; r++) for (c = 0; c < size; c++) if (m[r][c]) dark++;
      var total = size * size;
      score += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
      return score;
    }
    var best = 0, bestScore = Infinity;
    for (var mk = 0; mk < 8; mk++) {
      applyMask(mk); formatBits(mk);
      var sc = penalty();
      if (sc < bestScore) { bestScore = sc; best = mk; }
      applyMask(mk);
    }
    applyMask(best); formatBits(best);
    return m;
  }

  var api = {
    matrix: encode,
    draw: function (canvas, text, px, margin) {
      var mat = encode(text), n = mat.length, q = margin == null ? 4 : margin;
      canvas.width = canvas.height = (n + q * 2) * px;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0d3b2a';
      for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (mat[y][x]) ctx.fillRect((x + q) * px, (y + q) * px, px, px);
    },
    /* rounded green QR with a round logo in the middle (uses error correction H) */
    drawStyled: function (canvas, text, size, logo) {
      var mat = encode(text, 'H'), n = mat.length, q = 3, tot = n + q * 2, cell = size / tot, ctx;
      canvas.width = canvas.height = size; ctx = canvas.getContext('2d');
      function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
      ctx.clearRect(0, 0, size, size);
      rr(1.5, 1.5, size - 3, size - 3, size * 0.09); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = Math.max(2, size * 0.008); ctx.strokeStyle = '#B7E4CC'; ctx.stroke();
      var g = ctx.createLinearGradient(0, 0, size, size); g.addColorStop(0, '#16865B'); g.addColorStop(1, '#0D6042');
      var c = tot / 2, rad = n * 0.125 + 0.4;
      function inFinder(x, y) { return (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8); }
      ctx.fillStyle = g;
      for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
        if (!mat[y][x] || inFinder(x, y)) continue;
        var dx = x + q + 0.5 - c, dy = y + q + 0.5 - c; if (dx * dx + dy * dy < (rad + 0.9) * (rad + 0.9)) continue;
        rr((x + q) * cell + cell * 0.02, (y + q) * cell + cell * 0.02, cell * 0.96, cell * 0.96, cell * 0.34); ctx.fill();
      }
      [[0, 0], [n - 7, 0], [0, n - 7]].forEach(function (p) {
        var X = (p[0] + q) * cell, Y = (p[1] + q) * cell;
        ctx.fillStyle = g; rr(X, Y, 7 * cell, 7 * cell, cell * 2.2); ctx.fill();
        ctx.fillStyle = '#fff'; rr(X + cell, Y + cell, 5 * cell, 5 * cell, cell * 1.5); ctx.fill();
        ctx.fillStyle = g; rr(X + 2 * cell, Y + 2 * cell, 3 * cell, 3 * cell, cell * 1.0); ctx.fill();
      });
      var cx = size / 2, R = rad * cell;
      ctx.beginPath(); ctx.arc(cx, cx, R + cell * 0.5, 0, 7); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cx, R, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
      if (logo && logo.width) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cx, R - cell * 0.35, 0, 7); ctx.clip(); var L = (R - cell * 0.35) * 2 * 0.92; ctx.drawImage(logo, cx - L / 2, cx - L / 2, L, L); ctx.restore(); }
      return canvas;
    },
    svg: function (text, px) {
      var mat = encode(text), n = mat.length, q = 4, d = '';
      for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (mat[y][x]) d += 'M' + (x + q) + ' ' + (y + q) + 'h1v1h-1z';
      var s = (n + q * 2);
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + s + ' ' + s + '" width="' + (px || s * 4) + '" height="' + (px || s * 4) + '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#0d3b2a"/></svg>';
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.LGQR = api;
})(typeof window !== 'undefined' ? window : globalThis);
