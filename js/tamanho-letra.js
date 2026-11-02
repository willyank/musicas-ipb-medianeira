// tamanho da letra de cada música (A- / A+)
(function () {
  var KEY = 'tamanho-musicas', MIN = 0.6, MAX = 1.6, STEP = 0.1;
  var sizes = {};
  try { sizes = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { sizes = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(sizes)); } catch (e) {} }
  [].forEach.call(document.querySelectorAll('.note'), function (note) {
    var key = note.getAttribute('data-key');
    var bar = document.createElement('span');
    bar.className = 'sgrp';
    bar.innerHTML = '<button type="button" class="sdown" title="Diminuir a letra desta música">A-</button>' +
      '<button type="button" class="slabel" title="Voltar ao tamanho normal"></button>' +
      '<button type="button" class="sup" title="Aumentar a letra desta música">A+</button>';
    var host = note.querySelector('.tbar');
    if (!host) {
      host = document.createElement('div');
      host.className = 'tbar';
      note.querySelector('h2').insertAdjacentElement('afterend', host);
    }
    host.appendChild(bar);
    var lab = bar.querySelector('.slabel');
    function apply(v) {
      v = Math.round(Math.min(MAX, Math.max(MIN, v)) * 10) / 10;
      if (v === 1) { note.style.removeProperty('--fs'); delete sizes[key]; }
      else { note.style.setProperty('--fs', v); sizes[key] = v; }
      lab.textContent = Math.round(v * 100) + '%';
      bar.querySelector('.sdown').disabled = v <= MIN;
      bar.querySelector('.sup').disabled = v >= MAX;
      return v;
    }
    var cur = apply(typeof sizes[key] === 'number' ? sizes[key] : 1);
    bar.querySelector('.sdown').addEventListener('click', function () { cur = apply(cur - STEP); save(); });
    bar.querySelector('.sup').addEventListener('click', function () { cur = apply(cur + STEP); save(); });
    lab.addEventListener('click', function () { cur = apply(1); save(); });
  });
})();
