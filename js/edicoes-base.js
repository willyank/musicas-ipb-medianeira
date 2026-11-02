// músicas editadas no ensaio: guarda no aparelho e mostra no lugar da versão oficial
(function () {
  // songs edited during rehearsal: saved on this device and shown in place of the official version.
  // Runs before the transposer and the search, so both see the edited text.
  var KEY = 'edicoes-musicas', ed = {};
  try { ed = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { ed = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(ed)); } catch (e) {} }
  // the song as plain text, one line per line on screen. Walks everything in order, so text sitting
  // in a block that also holds other blocks is not lost.
  var LINE = '.para, .ln, li, p, h1, h2, h3, h4, h5, h6';
  var BLOCK = /^(DIV|PRE|P|LI|OL|UL|H[1-6]|BLOCKQUOTE|TABLE|TR|TD)$/;
  function textOf(body) {
    var out = [], cur = null;
    function flush() { if (cur !== null) cur.split('\n').forEach(function (l) { out.push(l); }); cur = null; }
    (function walk(node, inLine) {
      [].forEach.call(node.childNodes, function (c) {
        if (c.nodeType === 3) {
          // whitespace between blocks (e.g. the line breaks between the lines of a <pre>) is not text
          if (inLine || /\S/.test(c.nodeValue)) cur = (cur || '') + c.nodeValue;
          return;
        }
        if (c.nodeType !== 1) return;
        if (c.nodeName === 'BR') { out.push(cur || ''); cur = null; return; }
        var isLine = c.matches(LINE);
        if (!isLine && !BLOCK.test(c.nodeName)) { walk(c, inLine); return; }  // <b>, <i>, <span>...
        flush();
        var mark = out.length;
        walk(c, isLine);
        flush();
        if (isLine && out.length === mark && !c.querySelector(LINE)) out.push('');  // an empty line
      });
    })(body, false);
    flush();
    return clean(out.map(function (l) { return l.replace(/\u00a0/g, ' ').replace(/\s+$/, ''); }).join('\n'));
  }
  // accents as single characters (some songs came with "e" + separate accent), no trailing spaces or edge blank lines
  function clean(t) { return t.normalize('NFC').replace(/\r/g, '').replace(/[ \t]+$/gm, '').replace(/^\n+|\n+$/g, ''); }
  function render(body, text) {
    var pre = document.createElement('pre');
    pre.className = 'code';
    clean(text).split('\n').forEach(function (l) {
      var sp = document.createElement('span');
      sp.className = 'ln';
      sp.textContent = l;
      pre.appendChild(sp);
      pre.appendChild(document.createTextNode('\n'));
    });
    body.innerHTML = '';
    body.appendChild(pre);
  }

  var orig = {}, changed = false;
  [].forEach.call(document.querySelectorAll('.note'), function (n) {
    var k = n.getAttribute('data-key'), body = n.querySelector('.body');
    if (!body) return;
    orig[k] = textOf(body);
    var e = ed[k];
    if (!e) return;
    // the official version already has this change (it was applied to the file): nothing left to keep
    if (clean(e.text) === orig[k]) { delete ed[k]; changed = true; return; }
    render(body, e.text);
    n.classList.add('edited');
  });
  if (changed) save();

  window.EDICOES = {
    get: function (k) { return ed[k] || null; },
    all: function () { return JSON.parse(JSON.stringify(ed)); },
    count: function () { return Object.keys(ed).length; },
    original: function (k) { return orig[k]; },
    textOf: textOf,
    clean: clean,
    set: function (k, text) {
      text = clean(text);
      if (!text || text === orig[k]) delete ed[k];
      else ed[k] = {text: text, data: new Date().toISOString().slice(0, 10)};
      save();
    },
    del: function (k) { delete ed[k]; save(); }
  };
})();
