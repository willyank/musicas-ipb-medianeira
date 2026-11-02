// anotação curta por música
(function () {
  // a short note per song (e.g. "intro 2x, final lento"), saved in the browser and sent with the repertoire link
  var KEY = 'notas-musicas', memos = {}, reg = {};
  try { memos = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { memos = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(memos)); } catch (e) {} }
  // speech bubble with lines of text: reads as "note" on the phone, where only the icon shows
  var BUBBLE = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8.9a1.6 1.6 0 0 0-1.1.5L3.8 21.5a.5.5 0 0 1-.8-.4V5a2 2 0 0 1 2-2z"/><path d="M7.5 7.5h6M7.5 10.5h8.5M7.5 13.5h4.5"/></svg>';
  [].forEach.call(document.querySelectorAll('.note'), function (note) {
    var key = note.getAttribute('data-key');
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'memobtn';
    var h2 = note.querySelector('h2'), grp = document.createElement('span'), star = h2.querySelector('.star');
    grp.className = 'hbtns';
    h2.insertBefore(grp, star);
    grp.appendChild(star);
    grp.appendChild(btn);
    var box = document.createElement('div');
    box.className = 'memo';
    (note.querySelector('.tbar') || note.querySelector('h2')).insertAdjacentElement('afterend', box);
    var ed = null;
    function show() {
      var t = memos[key] || '';
      box.hidden = !t || !!ed;
      box.innerHTML = '<b>Anotação</b>';
      box.appendChild(document.createTextNode(t));
      btn.innerHTML = BUBBLE + '<span class="mtxt"> ' + (t ? 'anotação' : 'anotar') + '</span>';
      btn.classList.toggle('on', !!t);
      btn.title = t ? 'Editar a anotação desta música' : 'Escrever uma anotação para esta música (ex.: intro 2x, final lento)';
    }
    function set(t) {
      t = (t || '').trim();
      if (t) memos[key] = t; else delete memos[key];
      save(); show();
    }
    function edit() {
      if (ed) { ed.querySelector('textarea').focus(); return; }
      ed = document.createElement('div');
      ed.className = 'memoedit';
      ed.innerHTML = '<textarea placeholder="Ex.: intro 2x · começa só voz · final lento"></textarea><div>' +
        '<button type="button" class="msave">salvar</button><button type="button" class="mcancel">cancelar</button>' +
        (memos[key] ? '<button type="button" class="mdel">apagar</button>' : '') + '</div>';
      var ta = ed.querySelector('textarea');
      ta.value = memos[key] || '';
      box.insertAdjacentElement('afterend', ed);
      box.hidden = true;
      function close() { ed.remove(); ed = null; show(); }
      ed.querySelector('.msave').addEventListener('click', function () { set(ta.value); close(); });
      ed.querySelector('.mcancel').addEventListener('click', close);
      var del = ed.querySelector('.mdel');
      if (del) del.addEventListener('click', function () { if (confirm('Apagar a anotação desta música?')) { set(''); close(); } });
      ta.focus();
    }
    btn.addEventListener('click', edit);
    box.addEventListener('click', edit);
    reg[key] = set;
    show();
  });
  window.NOTAS = {
    get: function (k) { return memos[k] || ''; },
    set: function (k, t) {
      if (reg[k]) reg[k](t);
      else { if (t) memos[k] = t; else delete memos[k]; save(); }
    }
  };
})();
