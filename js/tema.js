// botão de tema: automático, claro, escuro
(function () {
  var KEY = 'tema-musicas', root = document.documentElement;
  var ORDER = ['auto', 'light', 'dark'];
  var LABEL = {auto: '◐ Automático', light: '☀ Claro', dark: '☾ Escuro'};
  var ICON = {auto: '◐', light: '☀', dark: '☾'};
  function get() { try { var t = localStorage.getItem(KEY); return ORDER.indexOf(t) > -1 ? t : 'auto'; } catch (e) { return 'auto'; } }
  function apply(t) {
    if (t === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
    var b = document.getElementById('themebtn'), m = document.getElementById('mthemebtn');
    b.textContent = LABEL[t]; m.textContent = ICON[t];
    b.title = m.title = 'Tema: ' + LABEL[t].slice(2) + ' (clique para trocar)';
  }
  function next() {
    var t = ORDER[(ORDER.indexOf(get()) + 1) % ORDER.length];
    try { if (t === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, t); } catch (e) {}
    apply(t);
  }
  document.getElementById('themebtn').addEventListener('click', next);
  document.getElementById('mthemebtn').addEventListener('click', next);
  apply(get());
})();
