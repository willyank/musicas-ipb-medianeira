// convida a instalar o app: no Android, botão que abre a instalação do navegador; no iPhone, o passo a passo
(function () {
  var btn = document.getElementById('instbtn');
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (standalone || !/^https?:$/.test(location.protocol)) return;  // already installed, or opened from disk
  var KEY = 'instalar-dispensado', deferred = null, bar = null;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var HOW_IOS = 'Para instalar no iPhone: toque no botão Compartilhar (o quadrado com a seta para cima) e depois em "Adicionar à Tela de Início".';
  var HOW_OTHER = 'Para instalar: abra o menu do navegador (⋮) e toque em "Instalar app" ou "Adicionar à tela inicial".';
  btn.hidden = false;

  function install() {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; }).catch(function () {});
      close(false);
    } else alert(ios ? HOW_IOS : HOW_OTHER);
  }
  function close(remember) {
    if (bar) bar.hidden = true;
    if (remember) { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
  }
  function offer() {
    var dismissed = false;
    try { dismissed = !!localStorage.getItem(KEY); } catch (e) {}
    if (bar || dismissed) return;
    bar = document.createElement('div');
    bar.id = 'instalar';
    bar.innerHTML = '<span><b>Instale o app de músicas</b> para abrir mais rápido e sem internet.</span>' +
      '<button type="button" class="nvok">' + (deferred ? 'Instalar' : 'Como instalar') + '</button>' +
      '<button type="button" class="nvx" aria-label="Fechar aviso">×</button>';
    document.body.appendChild(bar);
    bar.querySelector('.nvok').addEventListener('click', install);
    bar.querySelector('.nvx').addEventListener('click', function () { close(true); });
  }
  btn.addEventListener('click', install);
  // Android (Chrome, Edge, Samsung): the browser says the app can be installed; keep the event to open it on tap
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    offer();
  });
  window.addEventListener('appinstalled', function () { deferred = null; close(true); btn.hidden = true; });
  // iPhone has no such event: the step by step, a moment after opening
  if (ios) setTimeout(offer, 3000);
})();
