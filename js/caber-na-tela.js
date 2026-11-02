// "caber na tela" e "só letra"
(function () {
  // "caber na tela": shrink each song just enough for its chord lines to fit the screen width;
  // "só letra": hide the chord lines
  var FK = 'caber-tela', LK = 'so-letra', MIN = 0.7;
  var MONO = '"Roboto Mono",Consolas,"Courier New",monospace';
  var b = document.body, main = document.getElementById('main');
  var fitBtn = document.getElementById('fitbtn'), lyrBtn = document.getElementById('lyrbtn');
  var fitOn = true, lyr = false;
  try { fitOn = localStorage.getItem(FK) !== 'off'; lyr = localStorage.getItem(LK) === '1'; } catch (e) {}
  var notes = [].slice.call(document.querySelectorAll('.note'));
  // lines whose columns matter (marked .nw by the transposer): [characters, left padding in px]
  var lines = notes.map(function (n) {
    return [].map.call(n.querySelectorAll('.body .nw'), function (d) {
      var t = d.textContent.replace(/\t/g, '        ').replace(/\s+$/, '');
      return [t.length, parseFloat(d.style.paddingLeft) || 0];
    });
  });
  // blank lines that would pile up once the chord lines are hidden (start of the song or after another blank)
  notes.forEach(function (n) {
    var blank = true;
    [].forEach.call(n.querySelectorAll('.body .para, .body span.ln'), function (d) {
      if (d.classList.contains('chord') || d.classList.contains('tomln')) return;
      var empty = !d.textContent.trim();
      if (empty && blank) d.classList.add('xb');
      blank = empty;
    });
  });
  var em = 0.6;
  function measure() {
    var host = document.querySelector('.body');
    if (!host) return;
    var p = document.createElement('span');
    p.textContent = 'MMMMMMMMMM';
    p.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
    p.style.setProperty('font-size', '100px', 'important');
    p.style.setProperty('font-family', MONO, 'important');
    host.appendChild(p);
    var w = p.getBoundingClientRect().width;
    host.removeChild(p);
    if (w > 0) em = w / 1000;
  }
  function fit() {
    var cs = getComputedStyle(main);
    var avail = main.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 4;
    var base = matchMedia('(max-width:800px)').matches ? 13 : 14;
    notes.forEach(function (n, i) {
      var f = 1;
      if (fitOn && avail > 0) {
        lines[i].forEach(function (l) {
          if (l[0]) f = Math.min(f, (avail - l[1]) / (l[0] * em * base));
        });
        f = Math.max(MIN, f);
      }
      if (f < 1) n.style.setProperty('--fit', f.toFixed(3)); else n.style.removeProperty('--fit');
    });
  }
  // keep the song being read in view when the layout changes
  function keepPlace(fn) {
    var cur = null, off = 0;
    for (var i = 0; i < notes.length; i++) {
      var r = notes[i].getBoundingClientRect();
      if (r.height && r.bottom > 60) { cur = notes[i]; off = r.top; break; }
    }
    fn();
    if (cur && off < 0) cur.scrollIntoView({block: 'start'});
  }
  function upd() {
    b.classList.toggle('nochords', lyr);
    fitBtn.textContent = fitOn ? '↔ Caber na tela' : '↔ Tamanho fixo';
    fitBtn.classList.toggle('on', fitOn);
    fitBtn.title = fitOn ? 'As cifras diminuem um pouco para caber na largura da tela (clique para desligar)' : 'As linhas largas rolam para o lado (clique para ajustar à tela)';
    lyrBtn.textContent = lyr ? '♪ Só letra' : '♪ Letra e cifra';
    lyrBtn.classList.toggle('on', lyr);
    lyrBtn.title = lyr ? 'As cifras estão escondidas (clique para mostrar)' : 'Clique para esconder as cifras e mostrar só a letra';
  }
  fitBtn.addEventListener('click', function () {
    fitOn = !fitOn;
    try { localStorage.setItem(FK, fitOn ? 'on' : 'off'); } catch (e) {}
    keepPlace(function () { upd(); fit(); });
  });
  lyrBtn.addEventListener('click', function () {
    lyr = !lyr;
    try { if (lyr) localStorage.setItem(LK, '1'); else localStorage.removeItem(LK); } catch (e) {}
    keepPlace(upd);
  });
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 150); });
  measure();
  upd();
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); fit(); });
})();
