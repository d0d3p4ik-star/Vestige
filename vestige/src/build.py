import sys, pathlib
# Сборка одного index.html из частей: разметка + данные + логика
parts = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2])
head = (parts / 'head.html').read_text(encoding='utf-8'); body = (parts / 'body.html').read_text(encoding='utf-8')
order = ['d1_refs.js', 'd2_missions_moon.js', 'd3_missions_mars.js', 'd4_archive.js', 'd5_i18n.js', 'app.js', 'pages.js']
js = '\n'.join((parts / name).read_text(encoding='utf-8') for name in order)
assert '</script' not in js.lower()
html = head + body + '\n<script type="module">\n' + js + '</script>\n</body>\n</html>\n'
out.write_text(html, encoding='utf-8')
print('built', out, len(html.encode('utf-8')), 'bytes', html.count('\n'), 'lines')
