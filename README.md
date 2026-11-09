# Músicas IPB Medianeira

Repertório de músicas e hinos da IPB Medianeira, com letras e cifras, em uma página única pensada para usar no celular durante o culto.

São **342 músicas**. A maioria foi transcrita de notas do Evernote; 33 hinos do Novo Cântico que eram cantados nos cultos (segundo o grupo do WhatsApp) e não estavam aqui foram adicionados a partir do PDF do hinário cifrado. Outros 27 hinos que tinham só a 1ª estrofe (e o coro) foram completados com as estrofes do hinário, usando as cifras da 1ª estrofe do site. Os hinos seguem o padrão `Hino NNN - Nome`.

O uso pensado é: no **ensaio**, escolher as músicas, ajustar o tom e anotar combinados; no **culto**, abrir a lista no celular e passar de uma música para a outra.

---

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | A página: todas as músicas e os estilos. É onde se editam as músicas. |
| `js/` | O código das funcionalidades, um arquivo por assunto (veja [Arquivos de código](#arquivos-de-código-js)). |
| `manifest.webmanifest` | Descreve o "app" (nome, cores, ícones) para o celular poder instalá-lo na tela inicial. |
| `sw.js` | Service worker: guarda uma cópia da página no celular para ela abrir **sem internet**. |
| `icon-192.png`, `icon-512.png` | Ícones do app. |
| `README.md` | Este documento. |
| `.gitignore`, `.nojekyll` | Controlam o que vai para o GitHub (só os arquivos do site) e fazem o GitHub Pages publicar os arquivos como estão. |
| `ferramentas/aplicar_alteracoes.py` | Script que torna definitivas as músicas editadas nos ensaios (veja [Editar uma música no ensaio](#editar-uma-música-no-ensaio)). Não é usado pela página. |

Os seis primeiros (contando a pasta `js`) precisam ficar **sempre juntos na mesma pasta** e ser publicados juntos.

**Não publicar** outros arquivos que estejam na pasta, como a conversa exportada do WhatsApp (tem nomes e telefones do grupo), o PDF do hinário e a pasta `backups`. Eles não são usados pela página.

---

### Arquivos de código (`js/`)

O `index.html` carrega estes arquivos no fim da página, **nesta ordem** (a ordem importa: um usa o que o anterior preparou):

| Arquivo | O que faz |
|---|---|
| `tema-inicial.js` | Aplica o tema escolhido antes de desenhar a página, para não piscar (carregado no início). |
| `nomes-antigos.js` | `REN`/`MRG`: títulos renomeados e versões unificadas, para não perder o que ficou salvo (carregado no início). |
| `edicoes-base.js` | Músicas editadas no ensaio: guarda no aparelho e mostra no lugar da versão oficial. |
| `busca.js` | Busca em títulos, letras e cifras. |
| `cifras.js` | Reconhece as linhas de cifra e muda o tom (transposição). |
| `atalhos.js` | Atalhos (☆), "só atalhos", exportar/importar. |
| `menu-celular.js` | Gaveta do menu no celular, botão voltar e título da música na barra do topo. |
| `menu-lateral.js` | Atalhos recolhíveis, "⋯" e "⚙ Opções". |
| `tema.js` | Botão de tema (automático, claro, escuro). |
| `tamanho-letra.js` | A- / A+ de cada música. |
| `caber-na-tela.js` | "Caber na tela" e "só letra". |
| `anotacoes.js` | Anotação por música. |
| `edicoes.js` | Botão "editar esta música" e envio da alteração. |
| `repertorio.js` | Modo repertório, tela acesa, link de repertório e modo sem internet. |
| `atualizacao.js` | Aviso "Músicas atualizadas" quando há uma publicação nova com o app aberto. |
| `instalar.js` | Convite para instalar o app (botão no Android, passo a passo no iPhone). |

Ao criar um arquivo novo em `js/`, inclua-o também na lista `FILES` do `sw.js`, para funcionar sem internet.

---

## Como abrir

- **No computador, sem publicar:** dê dois cliques no `index.html`. Quase tudo funciona, mas **não** funcionam o modo sem internet, a instalação como app nem o envio do link de repertório para outras pessoas (veja [Limitações](#limitações)).
- **Publicado no GitHub Pages (recomendado):** abra https://willyank.github.io/musicas-ipb-medianeira/. Todas as funcionalidades funcionam, inclusive no celular.

---

## Funcionalidades

### Lista de músicas e busca
- A **lista lateral** mostra todas as músicas em ordem alfabética, **ignorando acentos e maiúsculas** ("Águas purificadoras" fica entre "Adoramos o Cordeiro" e "Ajuntamento"). Clique num título para ir até a música.
- A **busca** (campo logo acima da lista de músicas, abaixo dos atalhos) filtra enquanto você digita. Enquanto há texto na busca, os atalhos se recolhem numa linha só, para os resultados terem espaço. Ela procura no **título, na letra e nas cifras**, sem diferenciar acentos nem maiúsculas: buscar "bencao" encontra "bênção". Enquanto há texto na busca, uma linha abaixo dela mostra quantas músicas foram encontradas. O total de músicas aparece discreto no rodapé do menu, à esquerda de ⚙ Opções, e é contado sozinho.

### Visual das músicas
- Fonte monoespaçada, para manter as cifras alinhadas sobre as sílabas certas.
- **Cifras em laranja e negrito**; letra em cor escura (ou clara, no tema escuro).
- O padrão visual foi baseado na música "Colossenses 1 - Projeto Sola".

### Botões de opções
No rodapé da lista lateral (no celular, no fim do menu **☰**) fica **⚙ Opções ▸**, fechado. Tocando nele, abrem quatro botões; cada um mostra o estado atual, e a escolha fica salva. No celular, o tema também pode ser trocado pelo **◐** da barra do topo:

| Botão | O que faz |
|---|---|
| **☼ Tela acesa / ☾ Tela livre** | Mantém a tela do celular acesa enquanto a página está aberta. |
| **◐ Automático / ☀ Claro / ☾ Escuro** | Tema da página. |
| **↔ Caber na tela / ↔ Tamanho fixo** | Ajusta a letra de cada música à largura da tela. |
| **♪ Letra e cifra / ♪ Só letra** | Esconde as cifras. |

### Tema claro / escuro
- Botão **◐ Automático / ☀ Claro / ☾ Escuro**, na lista lateral; no celular também há o **◐** na barra do topo. Cada clique passa para a próxima opção.
- **Automático** segue o tema do celular ou do computador. A escolha fica salva.

### Tela acesa
- Enquanto a página está aberta, **a tela não apaga sozinha**, útil durante o culto.
- O botão **☼ Tela acesa / ☾ Tela livre** liga e desliga isso. Fica com borda amarela quando está ativo, e a escolha fica salva.
- Depende do navegador: funciona no Chrome, no Edge e no Safari atuais. Se o navegador não suportar, o botão não aparece.

### Caber na tela
- Ligado (padrão), cada música **diminui a letra só o necessário** para que as linhas de cifra caibam na largura da tela, sem rolar para o lado. Músicas que já cabem ficam em 100%.
- O mínimo é **70%**. Cerca de 50 músicas têm linhas de cifra tão largas que, mesmo em 70%, ainda rolam um pouco para o lado no celular.
- Linhas de texto comuns (instruções, observações, links) **quebram linha** normalmente. Só as linhas de cifra e a letra logo abaixo delas ficam sem quebrar, para manter o alinhamento.
- O cálculo é refeito ao girar o celular ou mudar o tamanho da janela.
- O **A- / A+** continua valendo por cima do ajuste.

### Só letra
- Esconde as linhas de cifra (e a linha "Tom: X") e mostra a letra em fonte normal, maior, com quebra de linha. Útil para quem canta.
- Os botões de tom somem nesse modo; o A- / A+ continua funcionando.

### Transposição de tom
- Cada música com cifra tem a barra **− Tom: G +**. Cada clique desce ou sobe **meio tom**, até 11 semitons para cada lado. **Tocar no tom** (em azul quando alterado) volta ao original.
- O rótulo mostra o tom atual e o deslocamento, por exemplo `Tom: B · +2`. O tom vem do atributo `data-tom` da música (veja "Como editar o conteúdo"); se ele não existir, de uma linha "Tom: X" no texto; e, por último, da primeira cifra.
- **Sustenido ou bemol é escolhido automaticamente** pelo tom de destino: F, Bb, Eb, Ab e Db usam bemóis; G, D, A, E, B e F# usam sustenidos.
- Acordes compostos são transpostos por inteiro: `F#m7/A`, `D/F#`, `C#m7(b5)`, `E4`. A linha "Tom: X" também muda.
- Os espaços entre as cifras são reajustados para que continuem sobre as mesmas sílabas.
- **O tom escolhido fica salvo por música** e continua aplicado ao reabrir a página.

### Tamanho da letra (A- / A+)
- Na mesma barra do tom, à direita: **A- 100% A+** diminui ou aumenta a letra (de 60% a 160%, em passos de 10%). Tocar no **%** volta ao normal (100%).
- O ajuste vale só para aquela música e fica salvo. Ele é aplicado sobre o ajuste do "caber na tela".

### Anotações por música
- O botão **✎** no título da música abre um campo para escrever combinados do ensaio, por exemplo "intro 2x · começa só voz · final lento". **salvar** guarda; **apagar** remove.
- A anotação aparece num quadro amarelo acima da letra; tocar nele permite editar. Quando a música tem anotação, o ✎ fica com borda amarela.
- As anotações ficam salvas no aparelho e **vão junto no link do repertório**.

### Editar uma música no ensaio
Para mudar a própria cifra ou letra (trocar um acorde, mudar a introdução, cortar uma estrofe). As anotações continuam servindo para combinados curtos.

1. **No ensaio:** no fim da música, toque em **✏ editar esta música**. A música aparece como texto, do jeito que está na tela; use espaços para colocar cada acorde sobre a sílaba e toque em **salvar**.
   - A alteração vale **na hora, só naquele aparelho**: aparece no lugar da original, transpõe normalmente e funciona sem internet. Fica um aviso azul "Versão editada neste aparelho" e um ✏ na lista de músicas.
   - Se a música estava transposta, você edita no tom da tela, e esse passa a ser o tom dela.
   - **desfazer** volta à versão oficial.
2. **Para a equipe:** o link de **compartilhar repertório** leva junto as músicas editadas do repertório. Quem abre o link passa a ver a versão do ensaio.
3. **Para ficar definitiva:**
   - Toque em **enviar alteração** (no aviso azul): abre o WhatsApp com a música editada, ou o compartilhamento do celular.
   - Ou, no menu Atalhos, toque em **alterações (N)**: baixa o arquivo `alteracoes-musicas.json` com todas as músicas editadas naquele aparelho. O botão **importar** aceita esse arquivo, para ver as alterações em outro aparelho antes de aplicar.
   - Quem cuida do site junta as mensagens (copiadas para um `.txt`) e/ou os arquivos e roda, nesta pasta:
     ```
     python ferramentas/aplicar_alteracoes.py alteracoes-musicas.json mensagens.txt
     ```
     Isso **só mostra** o que muda em cada música. Para gravar no `index.html`, rode de novo com `--aplicar` no fim. Antes de gravar, uma cópia do `index.html` vai para a pasta `backups`.
   - Depois de publicar o site, cada aparelho apaga sozinho a sua edição quando ela fica igual à versão oficial.

Dicas para escrever:
- Uma linha que começa com **ATENÇÃO** ou **Repete** (com ou sem parêntese), por exemplo `(ATENÇÃO: Vai direto para Como é bom, começa a cantar antes)` ou `(repete: Deixa teu rio)`, aparece **em cinza e menor**: é uma instrução de como tocar, não algo para cantar. Se o `(repete: ...)` ou `(ATENÇÃO: ...)` estiver no fim de um verso, só esse trecho fica cinza. Uma linha que começa com **↻** (ex.: `↻ Introdução e repete o verso`) fica cinza, mas no tamanho normal da letra.
- Uma linha de cifra pode terminar com um comentário entre parênteses ou `< >`, por exemplo `D   Bm (para cima, segura mais um tempo)` ou `E <segura mais tempo em E>`. A linha continua sendo cifra e transpõe normalmente (inclusive acordes citados no comentário).

Uma música editada passa a ser guardada como texto simples (sem negrito ou recuos especiais do Evernote).

### Atalhos = repertório do culto
- O botão **☆ atalho**, no título de cada música, adiciona a música ao menu **Atalhos**; ele vira **★ nos atalhos** (no celular, só **★**). As músicas com atalho ganham uma ★ na lista lateral.
- No menu Atalhos, as músicas aparecem numa **lista numerada**, na ordem do repertório:
  - toque no nome para ir até a música;
  - **▲ / ▼** mudam a ordem (no computador também dá para **arrastar**);
  - **×** remove o atalho;
  - **⋯** (ao lado de "só atalhos") mostra **exportar**, **importar** e **limpar atalhos** (este pede confirmação);
  - tocar em **▾ Atalhos** recolhe a caixa numa linha só (e tocar de novo abre); a escolha fica salva.
- O botão **só atalhos** liga o **modo repertório**:
  - mostra apenas as músicas dos atalhos, **na ordem das etiquetas**;
  - no fim de cada música aparece **◀ anterior · 2 de 5 · próxima: [nome] ▶**;
  - a barra do topo do celular mostra o nome da música que está na tela, seguindo a ordem do repertório;
  - **ver todas** volta a mostrar o repertório inteiro.
  - a **busca** continua procurando em **todas** as músicas, não só nos atalhos (as que são atalho aparecem com ★ na lista). Ao apagar a busca, volta a mostrar só o repertório.

### Compartilhar o repertório
- **compartilhar repertório** (no menu Atalhos) gera um link com a **ordem das músicas, os tons ajustados, as anotações e as músicas editadas no ensaio**. No celular, abre direto o compartilhamento (WhatsApp etc.); no computador, o link é copiado.
- Quem abrir o link vê a pergunta *"Abrir o repertório compartilhado com N música(s)?"*. Se confirmar:
  - os atalhos da pessoa são **substituídos** pelos do link;
  - os tons combinados são aplicados;
  - as anotações do link substituem as da pessoa nessas músicas (músicas sem anotação no link mantêm as da pessoa);
  - a página entra no modo repertório;
  - a lista de atalhos aparece **expandida**, mesmo que a pessoa a tivesse recolhido.
- Links antigos continuam funcionando quando uma música foi renomeada ou unificada (veja [O que fica salvo](#o-que-fica-salvo-no-aparelho)). Se alguma música do link não existir mais, ela é ignorada e o aviso diz quantas não foram encontradas.
- Formato do link (exemplo com 6 músicas, duas com o tom mudado):
  ```
  https://willyank.github.io/musicas-ipb-medianeira/#repertorio=3226.lp9g+2.lG6w.Xm0b-3.rT1T.PdMg
  ```
  Cada música vira um **código de 4 letras** calculado a partir do nome (`lp9g`), seguido da mudança de tom quando houver (`+2`, `-3`), na ordem do repertório. Assim o link fica curto no WhatsApp (umas 2 linhas). A letra e as cifras não vão no link, porque já estão no site.
  - **Anotações e músicas editadas** vão depois de um `!`, comprimidas: o link fica mais longo, mas cerca de 3 vezes menor do que seria sem comprimir.
  - Os códigos também reconhecem os **nomes antigos** de músicas renomeadas ou unificadas (`REN`/`MRG`), então links antigos continuam abrindo.
  - Se um dia duas músicas gerarem o mesmo código, aquele repertório é enviado no formato antigo (`#r=`, com os nomes completos), que continua funcionando.

### Exportar / importar atalhos
- **exportar** (no botão **⋯** dos atalhos) salva os atalhos num arquivo `atalhos-musicas.json`.
- **importar** carrega esse arquivo, por exemplo em outro navegador. As músicas do arquivo são **acrescentadas** aos atalhos atuais.
- O arquivo leva só os atalhos (não os tons, tamanhos nem anotações). Para levar o repertório completo, use o link de compartilhamento.

### Uso no celular
- A lista vira uma **gaveta**, aberta pelo botão **☰**, para a música ocupar a tela inteira. Tocar numa música fecha a gaveta.
- O botão **voltar** do Android fecha a gaveta, em vez de sair da página ou do app.
- A barra do topo mostra o **título da música** que está na tela, o botão de tema e o **↑** para voltar ao topo.
- Tom e tamanho ficam numa **única linha** acima da letra, com botões grandes para o toque.
- Linhas de cifra que não cabem nem com o ajuste automático **rolam para o lado** em vez de quebrar, para não desalinhar as cifras.

### Sem internet e instalação como app
*(só no site publicado)*
- Na primeira visita, a página fica guardada no aparelho e passa a **abrir sem internet**.
- Quando há internet, a versão mais nova é baixada automaticamente, logo depois de publicada: a cada abertura o app pergunta ao site se cada arquivo mudou (uma resposta minúscula quando não mudou) e baixa só o que mudou. Assim o `index.html` e os arquivos de `js/` nunca ficam em versões diferentes.
- Com o app **aberto** (ou em segundo plano), ele confere se houve publicação nova quando a pessoa **volta para o app** (por exemplo, depois de usar o WhatsApp), quando a **internet volta** e **a cada 5 minutos** com o app na tela. É um pedido minúsculo (só a data da última publicação).
  - Se houve, aparece no pé da tela o aviso **"Músicas atualizadas. [Atualizar]"**. Tocando em **Atualizar**, a página recarrega e volta para a música que estava na tela, com os atalhos, tons e anotações de antes. O **×** fecha o aviso (ele volta só numa publicação seguinte).
  - A página **nunca recarrega sozinha**, para a música não pular no meio do culto. Enquanto alguém edita uma música, o aviso fica escondido.
  - Qualquer publicação gera o aviso, mesmo uma que só mude este README (o GitHub muda a data de todos os arquivos ao publicar).
- **Qual versão está no aparelho:** dentro de **⚙ Opções** (no rodapé do menu), abaixo dos botões, aparece **"versão de DD/MM HH:mm"**: a data e a hora da publicação de onde veio a página que está na tela. Para saber se o app de alguém está atualizado, compare com o que aparece no seu aparelho (ou no computador) depois de publicar: se a data for mais antiga, o app dessa pessoa ainda não pegou a versão nova (é só fechar e abrir o app, ou tocar em Atualizar no aviso).
- Para instalar, use a opção **"Adicionar à tela inicial"** do navegador (Android: menu ⋮; iPhone: botão Compartilhar). O app aparece como **"Músicas IPB"**, com o ícone ♫ IPB.
- **Convite para instalar** (para quem não acha a opção do navegador):
  - **Android** (Chrome, Edge, Samsung): quando o navegador permite instalar, aparece no pé da tela **"Instale o app de músicas… [Instalar]"**; tocar em Instalar abre a janela de instalação do próprio navegador.
  - **iPhone**: a Apple não permite um botão de instalar; alguns segundos depois de abrir aparece **"[Como instalar]"**, que mostra o passo a passo (Compartilhar → "Adicionar à Tela de Início").
  - O **×** fecha o aviso de vez naquele aparelho; o botão **📲 Instalar app** continua em **⚙ Opções**.
  - Quem já abriu pelo app instalado não vê nem o aviso nem o botão.

---

## O que fica salvo no aparelho

Tudo é salvo no **armazenamento local do navegador** (`localStorage`), separado por navegador e por aparelho. Nada é enviado para servidor nenhum.

| Chave | O que guarda |
|---|---|
| `atalhos-musicas-v1` | Lista de atalhos (repertório), na ordem |
| `tom-musicas` | Tom ajustado de cada música |
| `tamanho-musicas` | Tamanho da letra de cada música |
| `notas-musicas` | Anotação de cada música |
| `edicoes-musicas` | Músicas editadas neste aparelho (texto e data) |
| `tema-musicas` | Tema escolhido (claro/escuro; ausente = automático) |
| `tela-acesa` | Preferência de manter a tela acesa |
| `caber-tela` | `off` quando o "caber na tela" foi desligado |
| `so-letra` | `1` quando o modo "só letra" está ligado |

**Esses dados se perdem** se você limpar os dados de navegação ou usar janela anônima. Eles também **não passam** de um aparelho para outro, nem de um navegador para outro. Para levar o repertório, use o link de compartilhamento ou exportar/importar.

Tudo é guardado pelo **título da música**. O script `js/nomes-antigos.js` converte automaticamente os atalhos, tons, tamanhos e anotações salvos com nomes antigos (e, numa música só renomeada, também a versão editada no ensaio):
- `var REN = {...}`: títulos renomeados (`"nome antigo": "nome novo"`);
- `var MRG = {...}`: versões repetidas que foram removidas (`"versão removida": ["versão que ficou", ajuste]`). O ajuste, em semitons, é somado ao tom salvo, para a música continuar com as mesmas cifras. Exemplo: quem tinha "Tu És Santo (E)" passa a ter "Tu És Santo (G)" com −3, que mostra as mesmas cifras em E.

As mesmas regras valem para links de repertório antigos.

Versões repetidas removidas em 30/10/2026 (ficou a mais completa de cada uma): Hino 042 (G), Hino 092 (A), Hino 221 (G), Hino 334 (E), Jesus é o Rei da Glória - G (capo 2 casa), Não temas, Eu sou contigo (A) e Tu És Santo (E).

Removidas em 09/11/2026, sem conversão (não eram mais tocadas): Abra os olhos do meu coração (E) e a cópia repetida da versão (D), e Grande é o Senhor (G). As que ficaram foram renomeadas para "Abra os olhos do meu coração" e "Grande é Senhor" (com `REN`).

---

## Limitações

- **Arquivo aberto direto do computador** (`file:///...`):
  - o link de repertório é apenas copiado, e só abre naquele computador;
  - o modo sem internet e a instalação como app não funcionam.
  
  Os navegadores só permitem isso em sites `https`, como o GitHub Pages.
- A transposição reconhece como cifra as linhas compostas só de acordes. Uma linha de letra formada apenas por "A" ou "E" pode ser confundida com cifra. Notas de melodia escritas como acordes (ex.: "Melodia: E C# E F#") também são transpostas.
- Cerca de 50 músicas têm linhas de cifra largas demais para o celular mesmo em 70%. Elas rolam para o lado; o **A-** ou o celular deitado ajudam.
- O "caber na tela" e o "só letra" dependem da identificação das linhas de cifra; uma linha de cifra escrita de forma incomum pode não ser escondida no modo só letra.
- Algumas músicas vieram de imagens e foram transcritas. Pode haver pequenos erros de posição de cifra nelas.

---

## Site publicado (GitHub Pages)

- **Site:** https://willyank.github.io/musicas-ipb-medianeira/
- **Repositório:** https://github.com/willyank/musicas-ipb-medianeira (público, branch `main`, GitHub Pages na raiz)

O repositório é público: qualquer pessoa pode **ver** o site e os arquivos, mas **só o dono** (ou quem ele adicionar como colaborador em Settings → Collaborators) pode alterá-los. Alterações feitas no site pelo botão "editar" ficam só no aparelho de quem editou, até serem aplicadas e publicadas.

**Para atualizar o site** depois de mudar o `index.html` (por exemplo, depois de `ferramentas/aplicar_alteracoes.py --aplicar`), nesta pasta:
```
git add -A
git commit -m "Descrição da mudança"
git push
```
Em 1–2 minutos o site novo está no ar. Quem estiver online recebe a nova versão automaticamente; o modo sem internet guarda a última versão vista.

O arquivo `.gitignore` deixa entrar no repositório **apenas** os arquivos do site, este README e o script de `ferramentas`. A conversa do WhatsApp, o PDF do hinário, a pasta `backups` e qualquer outro arquivo da pasta nunca são enviados.

**Segurança:** o início do `index.html` tem uma *política de segurança de conteúdo* (`<meta http-equiv="Content-Security-Policy">`). Ela só deixa a página carregar e enviar coisas para o próprio site, e só aceita código que esteja nos arquivos de `js/` (código escrito dentro do `index.html` é bloqueado); links para outros sites (Cifra Club, WhatsApp) continuam abrindo normalmente. Se um dia a página precisar carregar algo de fora (uma fonte, uma imagem, um script de outro endereço), esse endereço precisa ser acrescentado nessa linha, senão o navegador bloqueia.

---

## Como editar o conteúdo

O `index.html` é um arquivo de texto e pode ser editado em qualquer editor (VS Code, Bloco de Notas). Faça uma cópia antes de editar.

Cada música é um bloco `<section>`:

```html
<section class="note" id="n123" data-key="Hino 303 - Pendão real" data-title="Hino 303 - Pendão real" data-tom="E">
  <h2>Hino 303 - Pendão real</h2>
  <div class="body">
    ... linhas da música ...
  </div>
</section>
```

- `data-title` e `<h2>` são o título exibido.
- `data-key` é o identificador usado para salvar atalhos, tons e tamanhos. Normalmente é igual ao título.
- `data-tom` é o tom da música, mostrado na barra **− Tom: E +** (opcional). Use quando a primeira cifra não é o tom, por exemplo uma música em G que começa em Em. Não é preciso escrever "Tom: E" também no texto: desde 08/11/2026 essas linhas repetidas foram tiradas (as que tinham compasso ou BPM ficaram como `Compasso: 4/4` e `BPM: 70`). Músicas com capotraste mantêm a linha, porque ela explica a forma dos acordes.
- As linhas da música ficam dentro de `<div class="body">`. Algumas estão em `<div class="para">` (uma por linha) e outras em blocos `<pre class="code">` / `<pre class="ocr">` com uma `<span class="ln">` por linha. Partes em negrito usam `<b>`.
- As cores das cifras **não** estão no texto. A página reconhece as linhas de cifra ao abrir e as pinta de laranja; para alinhar, basta usar espaços. Uma linha de cifra pode ter, além dos acordes, parênteses, `|`, `2x` e `2ª vez`; qualquer outra palavra faz a linha ser tratada como letra (e não ser transposta).
- Acordes menores são escritos como `Am`, `F#m7`, `Bm/A` (padronizado em 06/11/2026; o `A-` do hinário ainda é reconhecido, mas não deve mais ser usado). Diminutos: `F#º` (a página não reconhece `F#o`, com a letra "o").
- **Acorde opcional** (aparece mais claro; quem toca pode pular): na linha de cifra, envolva o acorde em `<span class="opt">...</span>`, por exemplo `D <span class="opt">A</span>    Bm`. Ele muda de tom normalmente. Exemplo: Hino 019 - Rei sublime. Uma música editada pelo botão "editar" vira texto simples, e aí a marcação de opcional se perde nessa versão editada.
- Os estilos que vieram do Evernote (fontes, tamanhos, cores) foram removidos, porque a página define tudo isso. Por isso o arquivo caiu de 3,4 MB para cerca de 1 MB. Só foi mantido o recuo (`style="padding-left:..."`) de algumas linhas.

Cada música também tem um link na lista lateral, dentro de `<nav id="nav">`:

```html
<a href="#n123" data-i="123">Hino 303 - Pendão real</a>
```

**Ao adicionar, remover ou renomear uma música:**
- mantenha o `<section>` e o link `<a>` da lista **na mesma ordem** (alfabética, ignorando acentos) e com o **mesmo `id`**;
- ao renomear, acrescente `"nome antigo": "nome novo"` em `var REN = {...}` (em `js/nomes-antigos.js`), para não perder atalhos, tons, tamanhos e anotações salvos;
- ao remover uma versão repetida que ainda é usada, acrescente `"versão removida": ["versão que fica", ajuste]` em `var MRG = {...}` (no mesmo arquivo). Se ninguém usa mais, não precisa.
