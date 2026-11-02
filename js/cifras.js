// acordes: reconhecer linhas de cifra e mudar o tom (transposição)
var SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
var FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
var PCS = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
var CH = /^([\[(,]*)([A-G][#b]?)((?:m|M|maj|min|dim|aug|sus|add|[0-9]|[°º+\-]|\([^)]*\))*)(?:\/([A-G][#b]?))?([\])>]*[*.,]*)$/;
var FILL = /^(?:[|:.\-–—%\/\\]+|\d*x\d*|\(\d*x\d*\)|[\[\]()]+|\[[^\]\d]{2,}\]|\(?\d+\)?|\d+[ªº]|vez)$/;
var FLAT_MAJORS = {1: 1, 3: 1, 5: 1, 8: 1, 10: 1};

function rootPc(r) {
  var p = PCS[r.charAt(0)];
  if (r.charAt(1) === '#') p++;
  else if (r.charAt(1) === 'b') p--;
  return (p + 12) % 12;
}

function isChordLine(text) {
  var m = text.match(/^(\s*(?:\[[^\]]*\]|[A-Za-zÀ-ÿ0-9 ,.\-]{2,40}):\s*)(.*)$/);
  var rest = m ? m[2] : text;
  // a comment at the end of a chord line, e.g. "D  Bm (para cima, segura mais)" or "E <segura mais tempo>"
  rest = rest.replace(/\s+[(<][^()<>]*[A-Za-zÀ-ÿ]{3}[^()<>]*[)>]?\s*$/, '');
  var toks = rest.split(/\s+/).filter(function (x) { return x; });
  if (!toks.length) return false;
  var chords = 0;
  for (var i = 0; i < toks.length; i++) {
    if (CH.test(toks[i])) chords++;
    else if (!FILL.test(toks[i])) return false;
  }
  return chords > 0;
}

// preferred spelling for a given tonic (pc) + minor flag: true = flats
function useFlats(tonicPc, minor) {
  var maj = minor ? (tonicPc + 3) % 12 : tonicPc;
  return !!FLAT_MAJORS[maj];
}

function transToken(tok, shift, flats) {
  var m = CH.exec(tok);
  if (!m) return tok;
  var names = flats ? FLAT : SHARP;
  var r = names[(rootPc(m[2]) + shift + 120) % 12];
  var out = m[1] + r + m[3];
  if (m[4]) out += '/' + names[(rootPc(m[4]) + shift + 120) % 12];
  return out + m[5];
}

// parts: strings of the text nodes of one line; spacing is adjusted to keep columns aligned
function fixParts(parts, shift, flats) {
  var carry = 0, seen = false, out = [];
  parts.forEach(function (p) {
    var seg = p.split(/(\s+)/), s = '';
    seg.forEach(function (x) {
      if (x === '') return;
      if (/^\s+$/.test(x)) {
        if (seen && carry !== 0) {
          var w = x.length, ch = x.charAt(0);
          if (carry > 0) { var r = Math.min(carry, w - 1); w -= r; carry -= r; }
          else { w += -carry; carry = 0; }
          x = new Array(w + 1).join(ch);
        }
        s += x;
      } else {
        seen = true;
        var n = transToken(x, shift, flats);
        carry += n.length - x.length;
        s += n;
      }
    });
    out.push(s);
  });
  return out;
}

// "Tom: X ..." label lines: transpose only the key that follows "Tom:"
var TOMLINE = /^(\s*Tom\s*:\s*)([A-G][#b]?)(m(?!aj))?(?![A-Za-z0-9#])/;
function fixTom(parts, shift, flats) {
  var full = parts.join('');
  var m = /Tom\s*:\s*([A-G][#b]?)(?![A-Za-z0-9#])/.exec(full);
  if (!m) return parts;
  var start = m.index + m[0].length - m[1].length, end = start + m[1].length;
  var repl = (flats ? FLAT : SHARP)[(rootPc(m[1]) + shift + 120) % 12];
  var pos = 0, placed = false;
  return parts.map(function (p) {
    var s = pos, e = pos + p.length;
    pos = e;
    if (e <= start || s >= end) return p;
    var a = Math.max(start, s) - s, b = Math.min(end, e) - s, out = p.slice(0, a);
    if (!placed) { out += repl; placed = true; }
    return out + p.slice(b);
  });
}

// key of a song from its text: "Tom: X" label, otherwise the first chord
function detectKey(fullText, firstChordText) {
  var m = /(?:^|[\s\[])Tom\s*:\s*([A-G][#b]?)(m(?!aj))?/.exec(fullText);
  if (m) return {name: m[1], pc: rootPc(m[1]), minor: !!m[2]};
  var toks = (firstChordText || '').split(/\s+/);
  for (var i = 0; i < toks.length; i++) {
    var c = CH.exec(toks[i]);
    if (c) return {name: c[2], pc: rootPc(c[2]), minor: /^m(?!aj)/.test(c[3])};
  }
  return null;
}

if (typeof module !== 'undefined') module.exports = {isChordLine: isChordLine, transToken: transToken, fixParts: fixParts, fixTom: fixTom, TOMLINE: TOMLINE, useFlats: useFlats, detectKey: detectKey, SHARP: SHARP, FLAT: FLAT};

var TONES = (function () {
  var K = 'tom-musicas', m = {};
  try { m = JSON.parse(localStorage.getItem(K) || '{}') || {}; } catch (e) { m = {}; }
  return {
    reg: {},
    get: function (k) { var v = m[k]; return typeof v === 'number' ? v : 0; },
    set: function (k, v) { if (v) m[k] = v; else delete m[k]; try { localStorage.setItem(K, JSON.stringify(m)); } catch (e) {} }
  };
})();
window.TONES = TONES;
(function () {
  function textNodes(el) {
    var tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), out = [], n;
    while ((n = tw.nextNode())) out.push(n);
    return out;
  }

  var INSTR = /^\s*\(?\s*(?:aten[cç][aã]o|repet(?:e|ir))\b/i, REMIND = /^\s*↻/;
  var INSTR_IN = /\((?:aten[cç][aã]o|repet(?:e|ir))\b[^)]*\)?/i;
  function markInstr(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var m = INSTR_IN.exec(nodes[i].nodeValue);
      if (!m) continue;
      var part = nodes[i].splitText(m.index);
      part.splitText(m[0].length);
      var sp = document.createElement('span');
      sp.className = 'instr';
      part.parentNode.insertBefore(sp, part);
      sp.appendChild(part);
      return;
    }
  }

  function collect(note) {
    var body = note.querySelector('.body'), units = [], prev = false;
    if (!body) return units;
    [].forEach.call(body.querySelectorAll('.para, span.ln'), function (d) {
      var nodes = textNodes(d);
      if (!nodes.length) { prev = false; return; }
      var parts = nodes.map(function (x) { return x.nodeValue; });
      var line = parts.join('');
      var ch = isChordLine(line);
      // instructions for how to play ("(ATENÇÃO: vai direto para...)", "(repete: ...)") are shown in grey, smaller:
      // the whole line, or just the part in parentheses when it sits at the end of a verse
      if (INSTR.test(line)) d.classList.add('instr');
      else if (REMIND.test(line)) d.classList.add('remind');  // "↻ repete o verso": grey, but full size
      else if (!ch) markInstr(nodes);
      // lines whose columns matter (chords, the lyric under them, spaced-out text) never wrap
      if (ch || prev || /\S[ \u00a0]{2,}\S/.test(line)) d.classList.add('nw');
      if (ch) { d.classList.add('chord'); units.push({nodes: nodes, orig: parts}); }
      else if (TOMLINE.test(line)) { d.classList.add('tomln'); units.push({nodes: nodes, orig: parts, tom: true}); }
      prev = ch;
    });
    return units;
  }

  function firstChordText(unit) {
    if (!unit) return '';
    if (unit.pre) {
      for (var i = 0; i < unit.lines.length; i++) if (unit.flags[i]) return unit.lines[i];
      return '';
    }
    return unit.orig.join('');
  }

  function apply(st) {
    var shift = ((st.shift % 12) + 12) % 12, flats = false;
    if (st.key) flats = useFlats((st.key.pc + shift) % 12, st.key.minor);
    st.units.forEach(function (u) {
      if (u.pre) {
        u.node.nodeValue = shift === 0 ? u.orig : u.lines.map(function (l, i) {
          return u.flags[i] ? fixParts([l], shift, flats)[0] : l;
        }).join('\n');
      } else {
        var np = shift === 0 ? u.orig : (u.tom ? fixTom : fixParts)(u.orig, shift, flats);
        u.nodes.forEach(function (n, i) { n.nodeValue = np[i]; });
      }
    });
    var lab = st.bar.querySelector('.tlabel');
    var sign = st.shift > 0 ? '+' + st.shift : String(st.shift);
    var tom = 'tom';
    if (st.key) tom = 'Tom: ' + (shift === 0 ? st.key.name : (flats ? FLAT : SHARP)[(st.key.pc + shift) % 12]) + (st.key.minor ? 'm' : '');
    lab.textContent = st.shift === 0 ? (st.key ? tom : 'tom original') : tom + ' · ' + sign;
    lab.classList.toggle('mod', st.shift !== 0);
    lab.title = st.shift === 0 ? 'Tom original' : 'Tocar para voltar ao tom original';
  }

  [].forEach.call(document.querySelectorAll('.note'), function (note) {
    var units = collect(note);
    if (!units.length) return;
    var st = {units: units, shift: 0};
    st.key = detectKey(note.textContent.replace(/ /g, ' '), firstChordText(units[0]));
    var bar = document.createElement('div');
    bar.className = 'tbar';
    bar.innerHTML = '<span class="tgrp"><button type="button" class="tdown" title="Descer meio tom">−</button>' +
      '<button type="button" class="tlabel"></button>' +
      '<button type="button" class="tup" title="Subir meio tom">+</button></span>';
    st.bar = bar;
    note.querySelector('h2').insertAdjacentElement('afterend', bar);
    var tkey = note.getAttribute('data-key');
    function setShift(v) { st.shift = Math.max(-11, Math.min(11, v)); apply(st); TONES.set(tkey, st.shift); }
    bar.querySelector('.tdown').addEventListener('click', function () { setShift(st.shift - 1); });
    bar.querySelector('.tup').addEventListener('click', function () { setShift(st.shift + 1); });
    bar.querySelector('.tlabel').addEventListener('click', function () { setShift(0); });
    TONES.reg[tkey] = setShift;
    st.shift = TONES.get(tkey);
    apply(st);
  });
})();
