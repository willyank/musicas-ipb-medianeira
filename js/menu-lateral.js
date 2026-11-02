// menu: atalhos recolhíveis, "⋯" e "⚙ Opções"
(function () {
  // side menu: shortcuts can be folded (and step aside while searching), "⋯" keeps the less used actions,
  // "⚙ Opções" stays closed at the bottom until it is tapped
  var box = document.getElementById('favbox'), tog = document.getElementById('favtoggle'), KEY = 'atalhos-recolhidos';
  function setClosed(v) {
    box.classList.toggle('closed', v);
    tog.setAttribute('aria-expanded', String(!v));
    try { if (v) localStorage.setItem(KEY, '1'); else localStorage.removeItem(KEY); } catch (e) {}
  }
  try { if (localStorage.getItem(KEY)) setClosed(true); } catch (e) {}
  window.abrirAtalhos = function () { box.classList.remove('searching'); setClosed(false); };
  tog.addEventListener('click', function () {
    var searching = box.classList.contains('searching');
    box.classList.remove('searching');
    setClosed(searching ? false : !box.classList.contains('closed'));
  });
  var q = document.getElementById('q');
  q.addEventListener('input', function () { box.classList.toggle('searching', !!q.value.trim()); });
  var more = document.getElementById('favmore'), mb = document.getElementById('favmorebtn');
  mb.addEventListener('click', function () { more.hidden = !more.hidden; mb.classList.toggle('on', !more.hidden); });
  var ob = document.getElementById('optbtn'), opts = document.getElementById('opts');
  ob.addEventListener('click', function () {
    opts.hidden = !opts.hidden;
    ob.setAttribute('aria-expanded', String(!opts.hidden));
    ob.querySelector('span').textContent = opts.hidden ? '▸' : '▾';
  });
})();
