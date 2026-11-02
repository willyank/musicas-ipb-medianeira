// busca em títulos, letras e cifras
(function(){
  var norm=function(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()};
  var notes=[].slice.call(document.querySelectorAll('.note'));
  var links=[].slice.call(document.querySelectorAll('#nav a'));
  var text=notes.map(function(n){return norm(n.textContent)});
  var info=document.getElementById('info'),q=document.getElementById('q'),t;
  function run(){
    var v=norm(q.value.trim()),n=0;
    notes.forEach(function(el,i){
      var ok=!v||text[i].indexOf(v)!==-1;
      el.classList.toggle('hide',!ok);links[i].classList.toggle('hide',!ok);
      if(ok)n++;
    });
    // only while searching: how many were found (the total sits at the bottom of the menu)
    // with "só atalhos" on, the search still looks in every song; clearing it brings the set back
    var b=document.body;b.classList.toggle('busca',!!v);
    info.hidden=!v;
    info.textContent=!v?'':(n?(n+' de '+notes.length+' músicas'):'Nenhuma música encontrada')+(b.classList.contains('onlyfav')?' (em todas, não só nos atalhos)':'');
  }
  document.getElementById('total').textContent=notes.length+' músicas';
  q.addEventListener('input',function(){clearTimeout(t);t=setTimeout(run,150)});
})();
