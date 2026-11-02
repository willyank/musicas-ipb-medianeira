"""Torna definitivas as músicas editadas nos ensaios.

Entrada: o arquivo "alteracoes-musicas.json" (botão "alterações (N)" no menu Atalhos) e/ou um .txt
com as mensagens "Alteração na música: ..." copiadas do WhatsApp (pode ter várias).

    python ferramentas/aplicar_alteracoes.py alteracoes-musicas.json            -> só mostra o que muda
    python ferramentas/aplicar_alteracoes.py alteracoes-musicas.json --aplicar  -> grava no index.html

Antes de gravar, uma cópia do index.html vai para a pasta "backups" (que não deve ser publicada).
Depois de publicar o site, cada aparelho apaga sozinho a sua edição local quando ela fica igual à oficial.
"""
import re, sys, os, json, html, difflib, datetime, shutil, unicodedata
from html.parser import HTMLParser

PASTA = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(PASTA, 'index.html')
# messages from the site: "Alteração na música: ..." (older ones start with ✏, which WhatsApp may show as �)
MSG = re.compile(r'Alteração na música: (.+?)\s*\n\(editada em ([^)]*)\)\s*\n\s*```\n(.*?)\n```', re.S)


def ler_alteracoes(caminhos):
    alts = []
    for c in caminhos:
        txt = open(c, encoding='utf-8-sig').read()
        if c.lower().endswith('.json'):
            for a in json.loads(txt)['alteracoes']:
                alts.append((a['titulo'], a.get('data', ''), a['texto']))
        else:
            for m in MSG.finditer(txt):
                alts.append((m.group(1).strip(), m.group(2), m.group(3)))
    # the same song more than once: the last one wins
    final = {}
    for t, d, x in alts:
        final[t] = (d, x)
    return final


def limpar(t):
    t = unicodedata.normalize('NFC', t).replace('\r', '').replace('\xa0', ' ')
    return re.sub(r'^\n+|\n+$', '', re.sub(r'[ \t]+$', '', t, flags=re.M))


class _Texto(HTMLParser):
    """the song as text, with the same rules as the page's editor (textOf in js/edicoes-base.js)"""
    BLOCK = {'div', 'pre', 'p', 'li', 'ol', 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'table', 'tr', 'td'}
    LINE_TAGS = {'li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.cur, self.stack = [], None, []  # stack: [is_line, is_block, mark, has_line_child]

    def _line(self, tag, attrs):
        cls = (dict(attrs).get('class') or '').split()
        return tag in self.LINE_TAGS or 'para' in cls or 'ln' in cls

    def _flush(self):
        if self.cur is not None:
            self.out.extend(self.cur.split('\n'))
        self.cur = None

    def handle_starttag(self, tag, attrs):
        if tag == 'br':
            self.out.append(self.cur or '')
            self.cur = None
            return
        is_line = self._line(tag, attrs)
        is_block = is_line or tag in self.BLOCK
        if is_line:
            for f in self.stack:
                f[3] = True
        if is_block:
            self._flush()
        self.stack.append([is_line, is_block, len(self.out), False])

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag != 'br':
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == 'br' or not self.stack:
            return
        is_line, is_block, mark, has_line = self.stack.pop()
        if is_block:
            self._flush()
            if is_line and len(self.out) == mark and not has_line:
                self.out.append('')

    def handle_data(self, data):
        block = next((f for f in reversed(self.stack) if f[1]), None)  # nearest block decides
        in_line = bool(block and block[0])
        if in_line or data.strip():
            self.cur = (self.cur or '') + data


def texto_atual(corpo):
    p = _Texto()
    p.feed(corpo)
    p.close()
    p._flush()
    # same trimming as the page (JavaScript's \s also covers the invisible ﻿)
    return limpar('\n'.join(re.sub(r'[\s﻿]+$', '', l.replace('\xa0', ' ')) for l in p.out))


def main():
    global HTML, PASTA
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    aplicar = '--aplicar' in sys.argv
    for a in sys.argv[1:]:
        if a.startswith('--html='):  # another copy of the site (tests)
            HTML = os.path.abspath(a[7:])
            PASTA = os.path.dirname(HTML)
    if not args:
        print(__doc__)
        return 1
    alts = ler_alteracoes(args)
    if not alts:
        print('Nenhuma alteração encontrada nos arquivos.')
        return 1
    s = open(HTML, encoding='utf-8').read()
    m = re.search(r'var REN = (\{.*?\});', s)
    ren = json.loads(m.group(1)) if m else {}
    m = re.search(r'var MRG = (\{.*?\});', s)
    mrg = json.loads(m.group(1)) if m else {}
    n_secs = s.count('<section class="note"')
    feitos, faltam = [], []
    for titulo, (data, texto) in alts.items():
        chave = ren.get(titulo, titulo)
        chave = mrg[chave][0] if chave in mrg else chave
        sec = re.search(r'(<section class="note" id="n\d+" data-key="%s" [^>]*>)(.*?)(</section>)' % re.escape(html.escape(chave, quote=True)), s, re.S)
        if not sec:
            faltam.append(titulo)
            continue
        inner = sec.group(2)
        i = inner.index('<div class="body">')
        assert inner.endswith('</div>'), titulo
        novo = limpar(texto)
        antes = texto_atual(inner[i + len('<div class="body">'):-len('</div>')])
        print('=' * 70)
        print('%s  (editada em %s)' % (chave, data))
        diff = list(difflib.unified_diff(antes.split('\n'), novo.split('\n'), 'oficial', 'editada', lineterm='', n=1))
        print('\n'.join(diff[2:]) if diff else '(sem diferença: já está igual)')
        if not diff:
            continue
        corpo = '<div class="body"><pre class="code">' + '\n'.join(
            '<span class="ln">%s</span>' % html.escape(l, quote=False) for l in novo.split('\n')) + '\n</pre></div>'
        s = s[:sec.start(2)] + inner[:i] + corpo + s[sec.end(2):]
        feitos.append(chave)
    print('=' * 70)
    if faltam:
        print('Músicas não encontradas no site (verifique o título):', ', '.join(faltam))
    if not feitos:
        print('Nada a gravar.')
        return 0
    assert s.count('<section class="note"') == n_secs == s.count('</section>')
    if not aplicar:
        print('%d música(s) mudariam. Para gravar, rode de novo com --aplicar' % len(feitos))
        return 0
    os.makedirs(os.path.join(PASTA, 'backups'), exist_ok=True)
    copia = os.path.join(PASTA, 'backups', 'index-%s.html' % datetime.datetime.now().strftime('%Y%m%d-%H%M%S'))
    shutil.copy2(HTML, copia)
    open(HTML, 'w', encoding='utf-8').write(s)
    print('Gravado: %d música(s) atualizada(s). Cópia anterior em %s' % (len(feitos), copia))
    return 0


if __name__ == '__main__':
    sys.exit(main())
