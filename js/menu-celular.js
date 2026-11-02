// celular: gaveta do menu, botão voltar e título da música na barra do topo
(function () {
  var b = document.body, side = document.getElementById('side');
  function isOpen() { return b.classList.contains('menuopen'); }
  // the open drawer takes a history entry, so the phone's back button closes it instead of leaving the page
  function setMenu(v) {
    if (v === isOpen()) return;
    b.classList.toggle('menuopen', v);
    if (v) { try { history.scrollRestoration = 'manual'; history.pushState({menu: 1}, ''); } catch (e) {} }
    else if (history.state && history.state.menu) history.back();
  }
  window.addEventListener('popstate', function () {
    b.classList.remove('menuopen');
    setTimeout(function () { try { history.scrollRestoration = 'auto'; } catch (e) {} }, 0);
  });
  document.getElementById('menubtn').addEventListener('click', function () { setMenu(!isOpen()); });
  document.getElementById('mtop').addEventListener('click', function () { window.scrollTo({top: 0, behavior: 'smooth'}); });
  // song list: scroll to the song instead of following the link, so no history entries pile up
  document.getElementById('nav').addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    var t = document.getElementById(a.getAttribute('href').slice(1));
    if (t) t.scrollIntoView({block: 'start'});
  });
  side.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setMenu(false); });
  document.getElementById('main').addEventListener('click', function () { if (b.classList.contains('menuopen')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  if (location.hash === '#menu') setMenu(true);
  // show the current song's title in the mobile bar
  var mt = document.getElementById('mtitle'), notes = [].slice.call(document.querySelectorAll('.note')), tick = false, byKey = {};
  notes.forEach(function (n) { byKey[n.getAttribute('data-key')] = n; });
  // in repertoire mode the songs are shown in the shortcut order, not the alphabetical one
  function order() {
    if (!b.classList.contains('onlyfav') || b.classList.contains('busca')) return notes;
    return window.musicasAtalhos.get().map(function (k) { return byKey[k]; }).filter(Boolean);
  }
  function updTitle() {
    var l = order();
    for (var i = 0; i < l.length; i++) {
      if (l[i].classList.contains('hide')) continue;
      var r = l[i].getBoundingClientRect();
      if (r.bottom > 80) { mt.textContent = l[i].getAttribute('data-title'); return; }
    }
  }
  window.addEventListener('scroll', function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () { tick = false; updTitle(); });
  }, {passive: true});
  document.addEventListener('atalhos-mudou', function () { setTimeout(updTitle, 50); });
  document.getElementById('q').addEventListener('input', function () { setTimeout(updTitle, 250); });
  updTitle();
})();
