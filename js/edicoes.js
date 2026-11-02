// editar uma música no ensaio e enviar a alteração
(function () {
  // editing a song during rehearsal: the change stays on this device until it is applied to the file
  var E = window.EDICOES, T = window.TONES;
  var web = /^https?:$/.test(location.protocol);
  var notes = [].slice.call(document.querySelectorAll('.note'));
  var links = [].slice.call(document.querySelectorAll('#nav a'));
  var GO = 'ir-para-musica';
  function fmt(d) { return d ? d.split('-').reverse().join('/') : ''; }
  function reloadAt(n) { try { sessionStorage.setItem(GO, n.id); } catch (e) {} location.reload(); }

  function message(title, e) {
    // plain text only: a symbol like ✏ arrived in WhatsApp as "�"
    return 'Alteração na música: ' + title + '\n(editada em ' + fmt(e.data) + ')\n\n```\n' + e.text + '\n```';
  }
  function send(title, e) {
    var msg = message(title, e);
    if (web && navigator.share) { navigator.share({title: 'Alteração: ' + title, text: msg}).catch(function () {}); return; }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(msg).catch(function () {});
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  }

  // slanted pencil, drawn so it looks the same on every phone (the ✏ character is lying down in some fonts)
  var PENCIL = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>';
  notes.forEach(function (n, i) {
    var k = n.getAttribute('data-key'), title = n.getAttribute('data-title'), body = n.querySelector('.body');
    if (!body) return;
    var e = E.get(k);
    if (e) links[i].classList.add('edited');
    // bottom of the song: edit button
    var bar = document.createElement('div');
    bar.className = 'editbar';
    bar.innerHTML = '<button type="button">' + PENCIL + 'editar esta música</button>';
    body.insertAdjacentElement('afterend', bar);
    // top of an edited song: what it is and what can be done with it
    if (e) {
      var ban = document.createElement('div');
      ban.className = 'edbanner';
      ban.innerHTML = '<span><b>' + PENCIL + 'Versão editada neste aparelho</b> em ' + fmt(e.data) + '. Só você vê; para ficar definitiva, envie a alteração.</span>' +
        '<button type="button" class="eedit">editar</button><button type="button" class="esend">enviar alteração</button><button type="button" class="eundo">desfazer</button>';
      body.insertAdjacentElement('beforebegin', ban);
      ban.querySelector('.eedit').addEventListener('click', open);
      ban.querySelector('.esend').addEventListener('click', function () { send(title, E.get(k)); });
      ban.querySelector('.eundo').addEventListener('click', function () {
        if (confirm('Desfazer a edição de "' + title + '" e voltar à versão oficial?')) { E.del(k); reloadAt(n); }
      });
    }
    var editor = null;
    function open() {
      if (editor) { editor.querySelector('textarea').focus(); return; }
      var shift = T ? T.get(k) : 0;
      var text = E.textOf(body);  // as it is on screen, in the key shown
      editor = document.createElement('div');
      editor.className = 'editor';
      var lab = n.querySelector('.tlabel');
      editor.innerHTML = '<p>Edite a cifra e a letra como aparecem na tela. Use espaços para colocar cada acorde sobre a sílaba.' +
        (shift ? ' <b>Você está editando no tom da tela (' + (lab ? lab.textContent.replace(/ ·.*/, '') : '') + '): ao salvar, ele passa a ser o tom desta música.</b>' : '') + '</p>' +
        '<div><button type="button" class="esave">salvar</button><button type="button" class="ecancel">cancelar</button></div>' +
        '<textarea wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>';
      var ta = editor.querySelector('textarea');
      ta.value = text;
      ta.rows = Math.min(40, Math.max(10, text.split('\n').length + 2));
      body.insertAdjacentElement('afterend', editor);
      body.hidden = true; bar.hidden = true;
      document.body.classList.add('editing');
      editor.querySelector('.ecancel').addEventListener('click', function () {
        editor.remove(); editor = null; body.hidden = false; bar.hidden = false;
        document.body.classList.remove('editing');
      });
      editor.querySelector('.esave').addEventListener('click', function () {
        if (E.clean(ta.value) === E.clean(text)) { editor.querySelector('.ecancel').click(); return; }
        E.set(k, ta.value);
        if (T && shift) T.set(k, 0);  // the saved text is already in the key that was on screen
        reloadAt(n);
      });
      ta.scrollTop = 0;  // start of the song; the keyboard opens when the text is touched
      n.scrollIntoView({block: 'start'});
    }
    bar.querySelector('button').addEventListener('click', open);
  });

  // all the changes of this device in one file, to send them to whoever updates the site
  var exp = document.createElement('button');
  exp.type = 'button'; exp.id = 'edexport';
  exp.title = 'Baixar todas as músicas editadas neste aparelho num arquivo, para enviar a quem atualiza o site';
  function updExp() { var c = E.count(); exp.hidden = !c; exp.textContent = 'alterações (' + c + ')'; }
  exp.addEventListener('click', function () {
    var all = E.all(), list = Object.keys(all).map(function (k) { return {titulo: k, data: all[k].data, texto: all[k].text}; });
    var blob = new Blob([JSON.stringify({alteracoes: list}, null, 1)], {type: 'application/json'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'alteracoes-musicas.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  document.getElementById('favbackup').appendChild(exp);
  updExp();

  // "importar" also accepts that file: the changes appear on this device (to review them before applying)
  var byKey = {};
  notes.forEach(function (n) { byKey[n.getAttribute('data-key')] = n; });
  window.EDICOES.importar = function (list) {
    var ok = 0;
    (list || []).forEach(function (x) {
      var k = window.novaChave ? novaChave(x.titulo)[0] : x.titulo;
      if (byKey[k] && x.texto) { E.set(k, x.texto); ok++; }
    });
    alert(ok + ' música(s) editada(s) importada(s).');
    if (ok) location.reload();
  };

  // back to the song that was being edited
  var go = null;
  try { go = sessionStorage.getItem(GO); sessionStorage.removeItem(GO); } catch (e) {}
  if (go && document.getElementById(go)) setTimeout(function () { document.getElementById(go).scrollIntoView({block: 'start'}); }, 50);
})();
