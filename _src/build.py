import json, os, re, sys, urllib.parse, time
B = '/home/claude/enero/scripts'; W = '/home/claude/enero/web'
SITE = os.environ.get('SITE', 'https://pousada-enero.vercel.app')
V = os.environ.get('V', str(int(time.time()))[-6:])
T = json.load(open(f'{B}/i18n.json'))
tpl = open(f'{B}/template.html').read()
intro = open(f'{B}/intro_svg.html').read()
MOTOR = 'https://book.securebookings.net/roomrate?id=77e9745c-0dfa-1693866830-44fe-a199-d5467f240167'
ZONES = [
  ('posada', ['tripla-vista-mar','vista-lateral-mar','dupla-vista-mar','terrea-vista-mar','terrea-tripla','suite-8','suites-26-28'], 'fachada-700.webp', [618.3,420,81.3,146], None),
  ('enerito', ['enerito'], None, [531.0,420,81.3,146], None),
  ('prime', ['prime-deluxe','prime'], None, [531.0,300,81.3,114], None),
  ('deluxe', ['deluxe-vista-mar','suite-24','deluxe'], None, [705.7,420,81.3,146], None),
  ('restaurante', [], 'rest-mesa-600.webp', [531.0,600,256.0,146], None),
  ('praia', [], 'reposeras-600.webp', [560,780,200,120], [659,872]),
]
ZK = {'posada':'z_posada','enerito':'z_enerito','prime':'z_prime','deluxe':'z_deluxe','restaurante':'z_rest','praia':'z_praia'}
names = {'pt':'PT','es':'ES','en':'EN'}
for lang, t in T.items():
    langs = ''.join(f'<a href="{T[l]["path"]}" hreflang="{T[l]["htmllang"]}" lang="{T[l]["htmllang"]}"' + (' aria-current="true"' if l == lang else '') + f'>{names[l]}</a>' for l in T)
    motor = f'{MOTOR}&lang={t["motorlang"]}'
    wa = 'https://wa.me/5582988993364?text=' + urllib.parse.quote(t['wa_text'])
    jst = {k[3:]: v for k, v in t.items() if k.startswith('js_')}
    zonas = [{'id': z, 'name': t[ZK[z]], 'p': t[ZK[z] + '_p'], 'cats': cats, 'img': img, 'b': box, 'pt': pt} for z, cats, img, box, pt in ZONES]
    rep = dict(t); rep.update({'SITE': SITE, 'V': V, 'INTRO_SVG': intro, 'LANGS': langs, 'MOTOR': motor, 'WA': wa,
        'WA_REST': wa, 'JS_T': json.dumps(jst, ensure_ascii=False), 'ZONAS': json.dumps(zonas, ensure_ascii=False)})
    rep['MOTOR'] = motor.replace('&', '&amp;')
    out = re.sub(r'\{\{(\w+)\}\}', lambda m: rep[m.group(1)] if m.group(1) in rep else (_ for _ in ()).throw(KeyError(m.group(1))), tpl)
    # JS literal must not contain &amp;
    out = out.replace(f'motor:"{rep["MOTOR"]}"', f'motor:"{motor}"')
    d = W + t['path']; os.makedirs(d, exist_ok=True)
    open(d + 'index.html', 'w').write(out)
    print(lang, len(out))

today = time.strftime('%Y-%m-%d')
urls = ''.join(f'<url><loc>{SITE}{T[l]["path"]}</loc><lastmod>{today}</lastmod>' + ''.join(f'<xhtml:link rel="alternate" hreflang="{T[k]["htmllang"]}" href="{SITE}{T[k]["path"]}"/>' for k in T) + '</url>' for l in T)
open(W + '/sitemap.xml', 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls + '</urlset>\n')
open(W + '/robots.txt', 'w').write(f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')
