// avisa quando uma versão nova do site foi publicada, para quem está com o app aberto atualizar com um toque
(function () {
  if (!/^https?:$/.test(location.protocol) || !window.fetch) return;
  // GitHub Pages gives every file the time of the last publication as Last-Modified, so the page's own
  // date (the version on screen) against the date the site gives now tells whether something was published
  var shown = Date.parse(document.lastModified), last = 0, HOUR = 60 * 60 * 1000;
  if (!shown) return;
  var bar = null, warned = 0;
  function warn(t) {
    // closed with "×": it comes back only for a newer publication
    if (bar) { if (t > warned) { warned = t; bar.hidden = false; } return; }
    warned = t;
    bar = document.createElement('div');
    bar.id = 'novaversao';
    bar.innerHTML = '<span><b>Músicas atualizadas.</b></span><button type="button" class="nvok">Atualizar</button><button type="button" class="nvx" aria-label="Fechar aviso">×</button>';
    document.body.appendChild(bar);
    bar.querySelector('.nvok').addEventListener('click', function () {
      // back to the song that is on screen (js/edicoes.js scrolls to it after loading)
      var cur = null;
      [].some.call(document.querySelectorAll('.note'), function (n) {
        if (!n.offsetParent) return false;
        var r = n.getBoundingClientRect();
        if (r.bottom > 80) { cur = n; return true; }
        return false;
      });
      try { if (cur) sessionStorage.setItem('ir-para-musica', cur.id); } catch (e) {}
      location.reload();
    });
    bar.querySelector('.nvx').addEventListener('click', function () { bar.hidden = true; });
  }
  function check() {
    if (document.visibilityState === 'hidden' || navigator.onLine === false) return;
    if (Date.now() - last < 60 * 1000) return;  // returning to the app many times in a row: one check is enough
    last = Date.now();
    // HEAD: only the headers, a few hundred bytes; "no-store" so neither the browser nor the service worker answer
    fetch(location.pathname, {method: 'HEAD', cache: 'no-store'}).then(function (r) {
      var t = Date.parse(r.headers.get('Last-Modified') || '');
      if (r.ok && t > shown) warn(t);
    }).catch(function () {});
  }
  // when coming back to the app (e.g. from WhatsApp), when the internet returns and every hour while on screen;
  // also once shortly after opening, in case the page came from the offline copy
  document.addEventListener('visibilitychange', check);
  window.addEventListener('online', check);
  setInterval(function () { last = 0; check(); }, HOUR);
  setTimeout(check, 10 * 1000);
})();
