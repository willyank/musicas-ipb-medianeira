// aplica o tema escolhido (claro/escuro) antes de desenhar a página, sem piscar
try { var t = localStorage.getItem('tema-musicas'); if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t); } catch (e) {}
