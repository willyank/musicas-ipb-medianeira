// modo repertório, tela acesa, compartilhar o repertório por link e modo sem internet
(function () {
  var notes = [].slice.call(document.querySelectorAll('.note'));
  var byKey = {};
  notes.forEach(function (n) { byKey[n.getAttribute('data-key')] = n; });
  var A = window.musicasAtalhos, T = window.TONES;
  function setlist() { return A.get().map(function (k) { return byKey[k]; }).filter(Boolean); }
  function show(n) { n.scrollIntoView({behavior: 'smooth', block: 'start'}); }

  // 1) repertoire navigation: footer in each song with previous/next
  notes.forEach(function (n) {
    var d = document.createElement('div');
    d.className = 'setnav';
    d.innerHTML = '<button type="button" class="sprev">◀ anterior</button><span class="spos"></span><button type="button" class="snext"></button>';
    n.appendChild(d);
    d.querySelector('.sprev').addEventListener('click', function () { var l = setlist(), i = l.indexOf(n); if (i > 0) show(l[i - 1]); });
    d.querySelector('.snext').addEventListener('click', function () { var l = setlist(), i = l.indexOf(n); if (i > -1 && i < l.length - 1) show(l[i + 1]); });
  });
  function refresh() {
    var l = setlist();
    l.forEach(function (n, i) {
      var d = n.querySelector('.setnav'), x = d.querySelector('.snext');
      d.querySelector('.spos').textContent = (i + 1) + ' de ' + l.length;
      d.querySelector('.sprev').disabled = i === 0;
      x.disabled = i === l.length - 1;
      x.textContent = i < l.length - 1 ? 'próxima: ' + l[i + 1].getAttribute('data-title') + ' ▶' : 'fim do repertório';
    });
  }
  document.addEventListener('atalhos-mudou', refresh);
  refresh();

  // 2) keep the screen on while the page is open
  var WK = 'tela-acesa', wbtn = document.getElementById('wakebtn'), wl = null;
  var supported = 'wakeLock' in navigator;
  var wantOn = true;
  try { wantOn = localStorage.getItem(WK) !== 'off'; } catch (e) {}
  function upd() {
    wbtn.textContent = wantOn ? '☼ Tela acesa' : '☾ Tela livre';
    wbtn.classList.toggle('on', wantOn && !!wl);
    wbtn.title = wantOn ? 'A tela não apaga enquanto a página estiver aberta (clique para desligar)' : 'A tela pode apagar normalmente (clique para manter acesa)';
  }
  function req() {
    if (!supported || !wantOn || wl || document.visibilityState !== 'visible') { upd(); return; }
    navigator.wakeLock.request('screen').then(function (l) {
      wl = l;
      l.addEventListener('release', function () { wl = null; upd(); });
      upd();
    }).catch(function () { upd(); });
  }
  if (!supported) wbtn.hidden = true;
  wbtn.addEventListener('click', function () {
    wantOn = !wantOn;
    try { localStorage.setItem(WK, wantOn ? 'on' : 'off'); } catch (e) {}
    if (wantOn) req(); else { if (wl) wl.release(); wl = null; upd(); }
  });
  document.addEventListener('visibilitychange', req);
  document.addEventListener('click', req, {passive: true});
  document.addEventListener('touchstart', req, {passive: true});
  req();

  // 5) share the repertoire (order + agreed keys) as a link
  function b64e(str) { return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function b64d(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return decodeURIComponent(escape(atob(s))); }
  // short link (#repertorio=): each song is a 4-character code made from its name, plus the key change ("+2"),
  // e.g. #repertorio=xqBy.Wzmm+2.l1or; notes and songs edited in the rehearsal go after "!", compressed.
  // The old #r= links (full names) still open, and are still made if two names ever get the same code.
  var B62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function code(k) {
    var x = 2166136261, b = unescape(encodeURIComponent(k)), c = '', i;
    for (i = 0; i < b.length; i++) { x ^= b.charCodeAt(i); x = Math.imul(x, 16777619) >>> 0; }
    for (i = 0; i < 4; i++) { c += B62[x % 62]; x = Math.floor(x / 62); }
    return c;
  }
  // code -> name; old names (renamed or merged, REN/MRG at the top) too, so old short links keep working
  var byCode = {}, clash = {};
  function addCode(k) { var c = code(k); if (byCode[c] && byCode[c] !== k) clash[c] = 1; else byCode[c] = k; }
  Object.keys(byKey).forEach(addCode);
  if (typeof REN === 'object') Object.keys(REN).forEach(addCode);
  if (typeof MRG === 'object') Object.keys(MRG).forEach(addCode);
  function toB64(u) { var b = ''; for (var i = 0; i < u.length; i++) b += String.fromCharCode(u[i]); return btoa(b).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function fromB64(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function through(u, stream) { return new Response(new Blob([u]).stream().pipeThrough(stream)).arrayBuffer().then(function (b) { return new Uint8Array(b); }); }
  function pack(str) {  // "z" + compressed, or "j" + plain where the browser cannot compress
    var u = new TextEncoder().encode(str);
    try { return through(u, new CompressionStream('deflate-raw')).then(function (z) { return 'z' + toB64(z); }); }
    catch (e) { return Promise.resolve('j' + toB64(u)); }
  }
  function unpack(p) {
    var u = fromB64(p.slice(1));
    if (p[0] === 'j') return Promise.resolve(new TextDecoder().decode(u));
    return through(u, new DecompressionStream('deflate-raw')).then(function (b) { return new TextDecoder().decode(b); });
  }
  document.getElementById('favshare').addEventListener('click', function () {
    var l = A.get();
    if (!l.length) { alert('Adicione músicas aos atalhos primeiro: elas formam o repertório.'); return; }
    var N = window.NOTAS, ED = window.EDICOES, base = location.href.split('#')[0];
    var rows = l.map(function (k) { var e = ED && ED.get(k); return [k, T.get(k) || 0, N ? N.get(k) : '', e ? e.text : '']; });
    function longLink() {
      return base + '#r=' + b64e(JSON.stringify({v: 1, s: rows.map(function (x) {
        x = x.slice();
        while (x.length > 1 && !x[x.length - 1]) x.pop();
        return x;
      })}));
    }
    var now = new Date(), p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var title = 'Repertório ' + p2(now.getDate()) + '/' + p2(now.getMonth() + 1) + ' ' + p2(now.getHours()) + ':' + p2(now.getMinutes()) +
      ' (' + l.length + ' música' + (l.length > 1 ? 's' : '') + ')';  // e.g. "Repertório 01/11 13:36 (4 músicas)"
    // the native share sheet only accepts http(s) links: with the file opened from disk (file://)
    // Chrome/Edge kill the tab, so there the link is only copied
    var web = /^https?:$/.test(location.protocol);
    var note = web ? '' : '\n\nAtenção: este arquivo está aberto direto do computador, então o link só abre neste computador. ' +
      'Para enviar à equipe, use o site publicado (GitHub Pages).';
    function send(url) {
      function fallback() { prompt('Copie o link do repertório:' + note, url); }
      // after compressing, some phones no longer count it as a tap: then the link is shown to copy
      if (web && navigator.share) navigator.share({title: title, text: title, url: url}).catch(function (e) { if (e && e.name === 'NotAllowedError') fallback(); });
      else if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(function () { alert('Link do repertório copiado. Cole no WhatsApp ou onde quiser.' + note); }, fallback);
      else fallback();
    }
    if (rows.some(function (x) { var c = code(x[0]); return clash[c] || byCode[c] !== x[0]; })) { send(longLink()); return; }
    var head = rows.map(function (x) { return code(x[0]) + (x[1] > 0 ? '+' + x[1] : x[1] < 0 ? x[1] : ''); }).join('.');
    var extra = [];
    rows.forEach(function (x, i) { if (x[2] || x[3]) extra.push(x[3] ? [i, x[2], x[3]] : [i, x[2]]); });
    if (!extra.length) { send(base + '#repertorio=' + head); return; }
    pack(JSON.stringify(extra)).then(function (p) { send(base + '#repertorio=' + head + '!' + p); }, function () { send(longLink()); });
  });
  // rows: [name, key change, note, edited text], as in the old #r= links
  function openShared(rows) {
    var reloadEdits = false;
    // links made before a song was renamed or merged still work (novaChave: script at the top)
    var all = rows.map(function (x) {
      if (!x[0]) return x;
      // an edited song brings its own text: its key is not moved by the rename/merge table
      var r = window.novaChave ? novaChave(x[0]) : [x[0], 0], v = (x[1] || 0) + (x[3] ? 0 : r[1]);
      if (v > 11) v -= 12;
      if (v < -11) v += 12;
      return [r[0], v, x[2] || '', x[3] || ''];
    });
    var items = all.filter(function (x) { return byKey[x[0]]; }), miss = all.length - items.length;
    var memos = items.some(function (x) { return x[2]; }), edits = items.filter(function (x) { return x[3]; }).length;
    if (items.length && confirm('Abrir o repertório compartilhado com ' + items.length + ' música(s)?' +
        (miss ? ' (' + miss + ' não encontrada(s) neste arquivo)' : '') +
        '\n\nIsso substitui seus atalhos atuais e aplica os tons' + (memos ? ' e as anotações' : '') + ' combinados.' +
        (edits ? '\n\n' + edits + ' música(s) vêm com alterações do ensaio, que passam a aparecer neste aparelho.' : ''))) {
      A.set(items.map(function (x) { return x[0]; }));
      items.forEach(function (x) {
        var f = T.reg[x[0]];
        if (f) f(x[1]); else T.set(x[0], x[1]);
        if (x[2] && window.NOTAS) NOTAS.set(x[0], x[2]);
        if (x[3] && window.EDICOES) EDICOES.set(x[0], x[3]);
      });
      A.only(true);
      if (window.abrirAtalhos) abrirAtalhos();  // a shared repertoire always opens with the shortcuts unfolded
      reloadEdits = edits > 0;
    }
    if (reloadEdits) location.reload();  // edited songs are drawn when the page loads
  }
  function badLink() { alert('Este link de repertório está incompleto ou inválido.'); }
  var hash = location.hash;
  try { hash = decodeURIComponent(hash); } catch (e) {}  // some apps send "+" and "!" as %2B, %21
  var h = hash.match(/^#r=([A-Za-z0-9_-]+)/), h2 = hash.match(/^#repertorio=([0-9A-Za-z.+-]+?)(?:!([jz][A-Za-z0-9_-]+))?$/);
  if (/^#(r|repertorio)=/.test(hash)) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
  if (h) {
    var d = null;
    try { d = JSON.parse(b64d(h[1])); } catch (e) {}
    if (d) openShared(d.s || []); else badLink();
  } else if (h2) {
    var rows2 = h2[1].split('.').map(function (p) {
      var m = /^([0-9A-Za-z]{4})([+-]\d{1,2})?$/.exec(p);
      return [m && byCode[m[1]] || '', m && m[2] ? parseInt(m[2], 10) : 0, '', ''];
    });
    if (!h2[2]) openShared(rows2);
    else unpack(h2[2]).then(function (t) {
      JSON.parse(t).forEach(function (x) { if (rows2[x[0]]) { rows2[x[0]][2] = x[1] || ''; rows2[x[0]][3] = x[2] || ''; } });
      openShared(rows2);
    }).catch(badLink);
  } else if (/^#(r|repertorio)=/.test(hash)) badLink();

  // 4) offline support when served over http(s)
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
