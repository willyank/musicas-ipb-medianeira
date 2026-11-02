// atalhos (☆) = repertório do culto: ordem, "só atalhos", exportar/importar
(function () {
  var KEY = 'atalhos-musicas-v1';
  var notes = [].slice.call(document.querySelectorAll('.note'));
  var links = [].slice.call(document.querySelectorAll('#nav a'));
  var byKey = {}, idx = {};
  notes.forEach(function (n, i) { byKey[n.getAttribute('data-key')] = n; idx[n.getAttribute('data-key')] = i; });
  var favEl = document.getElementById('favs'), cnt = document.getElementById('favcount');
  var onlyBtn = document.getElementById('favonly'), q = document.getElementById('q');
  var list = [], dragFrom = -1;

  try { list = JSON.parse(localStorage.getItem(KEY) || '[]').filter(function (k) { return byKey[k]; }); } catch (e) { list = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  function title(k) { return byKey[k].getAttribute('data-title'); }

  // star button in each song header
  notes.forEach(function (n) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'star';
    b.addEventListener('click', function () { toggle(n.getAttribute('data-key')); });
    n.querySelector('h2').appendChild(b);
  });

  function toggle(k) {
    var i = list.indexOf(k);
    if (i === -1) list.push(k); else list.splice(i, 1);
    save(); render();
  }

  function move(from, to) {
    if (to < 0 || to >= list.length) return;
    list.splice(to, 0, list.splice(from, 1)[0]);
    save(); render();
  }

  function go(k) {
    var n = byKey[k];
    if (n.classList.contains('hide')) { q.value = ''; q.dispatchEvent(new Event('input')); }
    setTimeout(function () { n.scrollIntoView({behavior: 'smooth', block: 'start'}); }, n.classList.contains('hide') ? 220 : 0);
  }

  function render() {
    favEl.innerHTML = '';
    if (!list.length) {
      var e = document.createElement('div');
      e.className = 'favempty';
      e.textContent = 'Nenhum atalho ainda. Use ☆ no título de uma música para adicioná-la aqui.';
      favEl.appendChild(e);
    }
    function btn(cls, txt, tip, off, fn) {
      var x = document.createElement('button');
      x.type = 'button'; x.className = cls; x.textContent = txt; x.title = tip; x.disabled = off;
      x.addEventListener('click', fn);
      return x;
    }
    list.forEach(function (k, i) {
      var c = document.createElement('div');
      c.className = 'chip'; c.draggable = true; c.title = 'Arraste ou use ▲ ▼ para mudar a ordem';
      var num = document.createElement('span');
      num.className = 'num'; num.textContent = (i + 1) + '.';
      var a = document.createElement('a');
      a.href = '#' + byKey[k].id; a.textContent = title(k);
      a.addEventListener('click', function (ev) { ev.preventDefault(); go(k); });
      c.appendChild(num); c.appendChild(a);
      c.appendChild(btn('cup', '▲', 'Subir na ordem', i === 0, function () { move(i, i - 1); }));
      c.appendChild(btn('cdown', '▼', 'Descer na ordem', i === list.length - 1, function () { move(i, i + 1); }));
      c.appendChild(btn('cdel', '×', 'Remover atalho', false, function () { toggle(k); }));
      c.addEventListener('dragstart', function (ev) { dragFrom = i; ev.dataTransfer.effectAllowed = 'move'; try { ev.dataTransfer.setData('text/plain', k); } catch (e2) {} });
      c.addEventListener('dragover', function (ev) { ev.preventDefault(); c.classList.add('over'); });
      c.addEventListener('dragleave', function () { c.classList.remove('over'); });
      c.addEventListener('drop', function (ev) {
        ev.preventDefault();
        if (dragFrom < 0 || dragFrom === i) return;
        var from = dragFrom;
        dragFrom = -1;
        move(from, i);
      });
      favEl.appendChild(c);
    });
    notes.forEach(function (n, i) {
      var pos = list.indexOf(n.getAttribute('data-key')), on = pos !== -1;
      n.style.order = on ? pos : '';
      links[i].style.order = on ? pos : '';
      n.classList.toggle('fav', on);
      links[i].classList.toggle('fav', on);
      var s = n.querySelector('.star');
      s.classList.toggle('on', on);
      s.innerHTML = on ? '★<span class="mtxt"> nos atalhos</span>' : '☆ atalho';
      s.title = on ? 'Remover dos atalhos' : 'Adicionar aos atalhos';
    });
    cnt.textContent = list.length ? '(' + list.length + ')' : '';
    onlyBtn.hidden = !list.length;  // nothing to filter without shortcuts
    if (!list.length && document.body.classList.contains('onlyfav')) setOnly(false);
    document.dispatchEvent(new Event('atalhos-mudou'));
  }

  function setOnly(v) {
    document.body.classList.toggle('onlyfav', v);
    onlyBtn.classList.toggle('on', v);
    onlyBtn.textContent = v ? 'ver todas' : 'só atalhos';
    try { if (v) sessionStorage.setItem('so-atalhos', '1'); else sessionStorage.removeItem('so-atalhos'); } catch (e) {}
    if (v) window.scrollTo(0, 0);
    document.dispatchEvent(new Event('atalhos-mudou'));
  }
  onlyBtn.addEventListener('click', function () { if (list.length || document.body.classList.contains('onlyfav')) setOnly(!document.body.classList.contains('onlyfav')); });
  document.getElementById('favclear').addEventListener('click', function () {
    if (list.length && confirm('Remover todos os atalhos?')) { list = []; save(); render(); }
  });
  // backup: export / import the shortcut list as a small JSON file
  document.getElementById('favexport').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify({atalhos: list}, null, 1)], {type: 'application/json'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'atalhos-musicas.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  var inp = document.getElementById('favfile');
  document.getElementById('favimport').addEventListener('click', function () { inp.click(); });
  inp.addEventListener('change', function () {
    var f = inp.files && inp.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        if (d && d.alteracoes && window.EDICOES && EDICOES.importar) { inp.value = ''; EDICOES.importar(d.alteracoes); return; }
        var arr = d.atalhos || d;
        var ok = arr.filter(function (k) { return byKey[k]; });
        ok.forEach(function (k) { if (list.indexOf(k) === -1) list.push(k); });
        save(); render();
        alert(ok.length + ' atalho(s) importado(s).');
      } catch (e) { alert('Arquivo inválido.'); }
      inp.value = '';
    };
    r.readAsText(f);
  });
  window.musicasAtalhos = {
    get: function () { return list.slice(); },
    set: function (arr) { list = arr.filter(function (k) { return byKey[k]; }); save(); render(); return list.length; },
    only: function (v) { setOnly(v); }
  };
  render();
  try { if (sessionStorage.getItem('so-atalhos') && list.length) setOnly(true); } catch (e) {}
})();
