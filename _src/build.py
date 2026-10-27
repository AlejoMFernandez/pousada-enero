import json, os, re, urllib.parse, time
B = '/home/claude/enero/scripts'; W = '/home/claude/enero/web'
SITE = os.environ.get('SITE', 'https://pousada-enero.vercel.app')
V = os.environ.get('V', str(int(time.time()))[-6:])
T = json.load(open(f'{B}/i18n.json'))
PG = json.load(open(f'{B}/pages_i18n.json'))
SIZES = json.load(open(f'{B}/pg_sizes.json'))
tpl = open(f'{B}/template.html').read()
intro_svg = open(f'{B}/intro_svg.html').read()
intro_block = open(f'{B}/pages/intro_block.html').read()
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
NAMES = {'pt':'PT','es':'ES','en':'EN'}
PAGES = ['home', 'pousada', 'passeios', 'restaurante']
PRELOAD_HOME = ('<link rel="preload" as="image" href="/img/hero-celu-600.webp" media="(max-width: 899px)" imagesrcset="/img/hero-celu-600.webp 600w, /img/hero-celu-900.webp 900w" imagesizes="100vw">\n'
                '<link rel="preload" as="image" href="/img/hero-desk-1600.webp" media="(min-width: 900px)" imagesrcset="/img/hero-desk-960.webp 960w, /img/hero-desk-1600.webp 1600w" imagesizes="60vw">\n')

def esc(s): return s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')
def strip_tags(s): return re.sub(r'<[^>]+>', '', s)

def img_macro(m, pg):
    key, vw, altkey = m.group(1), m.group(2), m.group(3); eager = m.group(4)
    w, h = SIZES[key]
    w2 = 1100 if w >= 1000 else w
    alt = strip_tags(pg.get(altkey[3:], '')) if altkey.startswith('pg.') else ''
    sizes = f'(min-width: 900px) {vw}vw, 100vw' if vw != '100' else '100vw'
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (f'<img src="/img/pg/{key}-600.webp" srcset="/img/pg/{key}-600.webp 600w, /img/pg/{key}-1100.webp {w2}w" sizes="{sizes}" '
            f'width="{w}" height="{h}" alt="{esc(alt)}" {load} decoding="async">')

def page_path(lang, page):
    base = T[lang]['path']
    return base if page == 'home' else base + PG[lang][page]['slug']

def hand_acc(html):
    def fix(m):
        inner = re.sub(r'([À-ÿ])', r'<span class="acc">\1</span>', m.group(3))
        return m.group(1) + inner + m.group(4)
    return re.sub(r'(<(p|span)[^>]*class="[^"]*\bhand\b[^"]*"[^>]*>)(.*?)(</\2>)', fix, html, flags=re.S)

def cta(kind, t, pg):
    if kind == 'BOOK':
        btns = f'<a class="btn btn--sol btn--lg" href="{{{{MOTOR}}}}" target="_blank" rel="noopener" data-book>{t["reservar_cta"]}</a><a class="btn btn--line-claro btn--lg" href="{{{{NB}}}}#suites">{t["ver_suites"]}</a>'
    elif kind == 'WA':
        btns = f'<a class="btn btn--sol btn--lg" href="{{{{WA}}}}" target="_blank" rel="noopener">{t["wa_label"]}</a><a class="btn btn--line-claro btn--lg" href="{{{{MOTOR}}}}" target="_blank" rel="noopener" data-book>{t["reservar_cta"]}</a>'
    else:
        btns = f'<a class="btn btn--sol btn--lg" href="{{{{WA_REST}}}}" target="_blank" rel="noopener">{t["re_btn"]}</a><a class="btn btn--line-claro btn--lg" href="{{{{MOTOR}}}}" target="_blank" rel="noopener" data-book>{t["reservar_cta"]}</a>'
    return (f'<section class="pg-cta"><div class="wrap pg-cta__in"><img class="pg-cta__boat" src="/img/barquito-claro.svg" alt="" width="72" height="64">'
            f'<h2 class="h2 h2--claro rv">{pg["ctat"]}</h2><p class="lead lead--claro rv">{pg["ctap"]}</p><div class="pg-cta__btns rv">{btns}</div></div></section>')

sitemap = []
for lang, t in T.items():
    motor = f'{MOTOR}&lang={t["motorlang"]}'
    wa = 'https://wa.me/5582988993364?text=' + urllib.parse.quote(t['wa_text'])
    jst = {k[3:]: v for k, v in t.items() if k.startswith('js_')}
    zonas = [{'id': z, 'name': t[ZK[z]], 'p': t[ZK[z] + '_p'], 'cats': cats, 'img': img, 'b': box, 'pt': pt} for z, cats, img, box, pt in ZONES]
    for page in PAGES:
        pg = PG[lang].get(page, {})
        here = page_path(lang, page)
        langs = ''.join(f'<a href="{page_path(l, page)}" hreflang="{T[l]["htmllang"]}" lang="{T[l]["htmllang"]}"' + (' aria-current="true"' if l == lang else '') + f'>{NAMES[l]}</a>' for l in T)
        main = open(f'{B}/pages/{page}.html').read()
        main = re.sub(r'\[\[img (\S+) (\d+) (\S+)( eager)?\]\]', lambda m: img_macro(m, pg), main)
        main = main.replace('{{CTA_BOOK}}', cta('BOOK', t, pg) if pg else '').replace('{{CTA_WA}}', cta('WA', t, pg) if pg else '').replace('{{CTA_WA_REST}}', cta('REST', t, pg) if pg else '')
        main = re.sub(r'\{\{pg\.(\w+)\}\}', lambda m: pg[m.group(1)], main)
        full = tpl.replace('{{MAIN}}', main).replace('{{INTRO_BLOCK}}', intro_block if page == 'home' else '')
        rep = dict(t)
        rep.update({'SITE': SITE, 'V': V, 'INTRO_SVG': intro_svg, 'LANGS': langs, 'WA': wa, 'WA_REST': wa,
            'JS_T': json.dumps(jst, ensure_ascii=False), 'ZONAS': json.dumps(zonas, ensure_ascii=False),
            'MOTOR': motor.replace('&', '&amp;'),
            'TITLE': t['title'] if page == 'home' else pg['title'], 'DESC': t['desc'] if page == 'home' else pg['desc'],
            'PAGE': here, 'ALT_pt': page_path('pt', page), 'ALT_es': page_path('es', page), 'ALT_en': page_path('en', page),
            'PRELOAD': PRELOAD_HOME if page == 'home' else '', 'INTRO_ON': 'true' if page == 'home' else 'false',
            'NB': '' if page == 'home' else t['path'],
            'P_POUSADA': page_path(lang, 'pousada'), 'P_REST': page_path(lang, 'restaurante'), 'P_PASSEIOS': page_path(lang, 'passeios'),
            'CUR_pousada': ' aria-current="page"' if page == 'pousada' else '', 'CUR_rest': ' aria-current="page"' if page == 'restaurante' else '',
            'CUR_passeios': ' aria-current="page"' if page == 'passeios' else ''})
        for _ in range(2):
            full = re.sub(r'\{\{(\w+)\}\}', lambda m: rep[m.group(1)] if m.group(1) in rep else (_ for _ in ()).throw(KeyError(m.group(1))), full)
        full = full.replace(f'motor:"{rep["MOTOR"]}"', f'motor:"{motor}"')
        full = hand_acc(full)
        d = W + here; os.makedirs(d, exist_ok=True)
        open(d + 'index.html', 'w').write(full)
        sitemap.append((page, lang))
        print(lang, page, len(full))

today = time.strftime('%Y-%m-%d')
urls = ''.join(f'<url><loc>{SITE}{page_path(l, p)}</loc><lastmod>{today}</lastmod>' + ''.join(f'<xhtml:link rel="alternate" hreflang="{T[k]["htmllang"]}" href="{SITE}{page_path(k, p)}"/>' for k in T) + '</url>' for p, l in sitemap)
open(W + '/sitemap.xml', 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls + '</urlset>\n')
open(W + '/robots.txt', 'w').write(f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')
