// REN/MRG: títulos renomeados e versões unificadas, para não perder o que ficou salvo
// saved data is keyed by song title: renamed titles (REN) and removed duplicate versions
// (MRG: kept version + semitones that keep the same chords) are carried over to the current title
var REN = {"150-Salvação perfeita": "Hino 150 - Salvação perfeita", "154 - Segurança e Paz": "Hino 154 - Segurança e Paz", "177 - Firme nas promessas": "Hino 177 - Firme nas promessas", "19 - Rei sublime": "Hino 019 - Rei sublime", "213 - A última hora": "Hino 213 - A última hora", "230 - Adoração": "Hino 230 - Adoração", "241 - O nascimento de Jesus": "Hino 241 - O nascimento de Jesus", "270 DESAFIO": "Hino 270 - Desafio", "292 A VINDA DO SENHOR": "Hino 292 - A vinda do Senhor", "312 - Há trabalho certo": "Hino 312 - Há trabalho certo", "Hino 013 -Contemplação": "Hino 013 - Contemplação", "Hino 028": "Hino 028 - Coroação", "Hino 11 - Trindade Santíssima (C)": "Hino 011 - Trindade Santíssima (C)", "Hino 110 A - Crer e observar": "Hino 110 - Crer e observar", "Hino 114 Brilho Celeste": "Hino 114 - Brilho Celeste", "Hino 126-Dependência (Tom G)": "Hino 126 - Dependência (Tom G)", "Hino 146 Segurança do Crente": "Hino 146 - Segurança do Crente", "Hino 147 Vencendo vem Jesus": "Hino 147 - Vencendo vem Jesus", "Hino 210 -O Filho Perdido": "Hino 210 - O Filho Perdido", "Hino 222 -Mais perto da Cruz (E)": "Hino 222 - Mais perto da Cruz (E)", "Hino 255": "Hino 255 - A Ovelha Perdida", "Hino 274 -Morto e Ressureto": "Hino 274 - Morto e Ressurreto", "Hino 303 Pendão real": "Hino 303 - Pendão real", "Hino 003 - A IGREJA EM ADORAÇÃO. A     4/4": "Hino 003 - A Igreja em Adoração (A 4/4)", "Hino 033 - MARAVILHAS DIVINAS": "Hino 033 - Maravilhas Divinas", "Hino 145 - REFÚGIO VERDADEIRO.": "Hino 145 - Refúgio Verdadeiro", "Hino 350 - A PALAVRA DA VIDA": "Hino 350 - A Palavra da Vida", "SALMOS 121": "Salmos 121", "Teu amor não não falha - Capo 2 casa": "Teu amor não falha - Capo 2 casa", "Alfa e Ô mega (Grupo Kharis) B": "Alfa e Ômega (Grupo Kharis) B", "Alfa e Ômega (Grupo Kharis) - E  (capo 2)": "Alfa e Ômega (Grupo Kharis) - E (capo 2)", "Acredito - Léo Gonçalves  (D)": "Acredito - Léo Gonçalves", "Acredito - Léo Gonçalves (D)": "Acredito - Léo Gonçalves", "Hino 289 - Quem irá?  (G)": "Hino 289 - Quem irá? (G)", "Tú És Santo (E)": "Tu És Santo (E)", "Tú És Santo (G)": "Tu És Santo (G)", "Familia - Regis Danese - Ensaiar": "Família - Regis Danese - Ensaiar", "Isaias 53 - Projeto Sola (D)": "Isaías 53 - Projeto Sola (D)", "Isaias 53 - Projeto Sola + Hino 334 - Conversão (Foi na cruz)": "Isaías 53 - Projeto Sola + Hino 334 - Conversão (Foi na cruz)", "Eu quero ser uma benção pra você": "Eu quero ser uma bênção pra você", "Hino 063 - As muitas Bençãos": "Hino 063 - As muitas Bênçãos", "Hino 172 - Chuvas de bençãos": "Hino 172 - Chuvas de bênçãos", "Hino 221 - Um vaso de benção (A)": "Hino 221 - Um vaso de bênção (A)", "Hino 221 - Um vaso de benção (G)": "Hino 221 - Um vaso de bênção (G)", "Hino 335 - Jubilo no Céu": "Hino 335 - Júbilo no Céu", "Abra os olhos do meu coração (D)": "Abra os olhos do meu coração", "Grande é Senhor (A)": "Grande é Senhor", "Ele vem pra te salvar (D)": "Ele vem pra te salvar", "Hino 003 - Igreja em adoração (A)": "Hino 003 - Igreja em adoração", "Hino 010 - A criação e seu Criador (C 4/4)": "Hino 010 - A criação e seu Criador (4/4)", "Hino 010 - A criação e seu Criador (D)": "Hino 010 - A criação e seu Criador (3/4)"};
var MRG = {"Hino 042 - A Deus demos glória (G)": ["Hino 042 - A Deus demos glória (E)", 3], "Hino 092 - A fé contemplada (A)": ["Hino 092 - A fé contemplada (C)", -3], "Hino 221 - Um vaso de bênção (G)": ["Hino 221 - Um vaso de bênção (A)", -2], "Hino 334 - Conversão (Foi na cruz) (E)": ["Hino 334 - Conversão (Foi na cruz) (D)", 2], "Jesus é o Rei da Glória - G (capo 2 casa)": ["Jesus é o Rei da Glória - A", -2], "Não temas, Eu sou contigo (A)": ["Não temas, Eu sou contigo (C)", -3], "Tu És Santo (E)": ["Tu És Santo (G)", -3]};
function novaChave(k) {
  var off = 0;
  if (REN[k]) k = REN[k];
  if (MRG[k]) { off = MRG[k][1]; k = MRG[k][0]; }
  return [k, off];
}
try {
  var fav = JSON.parse(localStorage.getItem('atalhos-musicas-v1') || 'null');
  if (fav && fav.length) {
    var seen = {}, out = [];
    fav.forEach(function (k) { k = novaChave(k)[0]; if (!seen[k]) { seen[k] = 1; out.push(k); } });
    localStorage.setItem('atalhos-musicas-v1', JSON.stringify(out));
  }
  ['tamanho-musicas', 'notas-musicas', 'tom-musicas'].forEach(function (name) {
    var o = JSON.parse(localStorage.getItem(name) || 'null'), changed = false;
    if (!o) return;
    Object.keys(o).forEach(function (k) {
      var r = novaChave(k), v = o[k];
      if (r[0] === k) return;
      if (name === 'tom-musicas') { v += r[1]; if (v > 11) v -= 12; if (v < -11) v += 12; }
      if (!(r[0] in o)) o[r[0]] = v;
      delete o[k];
      changed = true;
    });
    if (changed) localStorage.setItem(name, JSON.stringify(o));
  });
  // a song edited on this device follows a rename; not a merge (the edited text is in the removed version's key)
  var ed = JSON.parse(localStorage.getItem('edicoes-musicas') || 'null'), moved = false;
  if (ed) Object.keys(ed).forEach(function (k) {
    var n = REN[k];
    if (n && !MRG[n] && !(n in ed)) { ed[n] = ed[k]; delete ed[k]; moved = true; }
  });
  if (moved) localStorage.setItem('edicoes-musicas', JSON.stringify(ed));
} catch (e) {}
