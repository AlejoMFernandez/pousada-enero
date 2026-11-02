import json,glob,os
from PIL import Image
S='/home/claude/enero/suites'; W='/home/claude/enero/web'
br=json.load(open(f'{S}/rooms_br.json')); es={r['id']:r for r in json.load(open(f'{S}/rooms_es.json'))}; en={r['id']:r for r in json.load(open(f'{S}/rooms_en.json'))}
def imgs(idx,limit=None):
    out=[]
    for f in sorted(glob.glob(f'{W}/img/suites/{idx:02d}_*-800.webp')):
        b=os.path.basename(f).replace('-800.webp',''); w,h=Image.open(f).size
        out.append({'f':b,'w':w,'h':h})
    return out[:limit] if limit else out
def feats(idx):
    r=br[idx-1]; return {'pt':r['feat'],'es':es[r['id']]['feat'],'en':en[r['id']]['feat']}
C=[
 dict(id='tripla-vista-mar',rooms=[1],zone='posada',name='Tripla Vista Mar',units='1 · 2',size='32',pax=3,beds={'pt':'1 casal + 1 solteiro','es':'1 doble + 1 individual','en':'1 double + 1 single'},tags=['mar','tres'],
      txt={'pt':'A maior da casa, com janela para o mar e espaço para três.','es':'La más grande de la casa, con ventana al mar y lugar para tres.','en':'Our largest suite, with a sea-view window and room for three.'}),
 dict(id='vista-lateral-mar',rooms=[2],zone='posada',name='Vista Lateral Mar',units='3 · 4',size='20',pax=2,beds={'pt':'1 cama de casal','es':'1 cama doble','en':'1 double bed'},tags=['mar','sacada'],
      txt={'pt':'Sacada com rede e o mar de lado, entre os coqueiros.','es':'Balcón con hamaca y el mar de costado, entre los cocoteros.','en':'A balcony with a hammock and a side view of the sea through the palms.'}),
 dict(id='dupla-vista-mar',rooms=[3],zone='posada',name='Dupla Vista Mar',units='5',size='16',pax=2,beds={'pt':'1 cama de casal','es':'1 cama doble','en':'1 double bed'},tags=['mar'],
      txt={'pt':'Para dois, com a janela aberta para a praia.','es':'Para dos, con la ventana abierta a la playa.','en':'For two, with the window open to the beach.'}),
 dict(id='terrea-vista-mar',rooms=[5],zone='posada',name='Térrea Vista Mar',units='7',size='24',pax=3,beds={'pt':'1 casal + 1 solteiro','es':'1 doble + 1 individual','en':'1 double + 1 single'},tags=['mar','terrea','tres'],
      txt={'pt':'No térreo, sai da porta e pisa no jardim, de frente para o mar.','es':'En planta baja: salís por la puerta y pisás el jardín, frente al mar.','en':'Ground floor: step out the door onto the garden, facing the sea.'}),
 dict(id='terrea-tripla',rooms=[4],zone='posada',name='Térrea Tripla',units='6',size='',pax=3,beds={'pt':'1 casal + 1 solteiro','es':'1 doble + 1 individual','en':'1 double + 1 single'},tags=['terrea','tres'],
      txt={'pt':'No térreo, prática para famílias e para quem viaja com pet.','es':'En planta baja, práctica para familias y para quien viaja con mascota.','en':'Ground floor, easy for families and guests travelling with pets.'}),
 dict(id='deluxe-vista-mar',rooms=[15,16,21],zone='deluxe',name='Deluxe Vista Mar',units='19 · 20 · 25',size='27–29',pax=2,beds={'pt':'1 cama de casal','es':'1 cama doble','en':'1 double bed'},tags=['mar','sacada'],
      txt={'pt':'As mais amplas para dois: sacada, rede e o mar na frente.','es':'Las más amplias para dos: balcón, hamaca y el mar enfrente.','en':'Our most spacious for two: balcony, hammock and the sea in front.'}),
 dict(id='suite-24',rooms=[20],zone='deluxe',name='Suíte 24',units='24',size='27',pax=3,beds={'pt':'1 casal + 1 solteiro','es':'1 doble + 1 individual','en':'1 double + 1 single'},tags=['mar','tres'],
      txt={'pt':'Tripla com vista mar, para famílias que querem espaço.','es':'Triple con vista al mar, para familias que quieren espacio.','en':'A sea-view triple for families who want room to spread out.'}),
 dict(id='deluxe',rooms=[17,18,19],zone='deluxe',name='Deluxe',units='21 · 22 · 23',size='18',pax=2,beds={'pt':'1 cama de casal ou queen','es':'1 cama doble o queen','en':'1 double or queen bed'},tags=['sacada'],
      txt={'pt':'Sacada privativa e madeira por todo lado.','es':'Balcón privado y madera por todos lados.','en':'A private balcony and warm wood throughout.'}),
 dict(id='prime-deluxe',rooms=[7],zone='prime',name='Prime Deluxe',units='15',size='20',pax=3,beds={'pt':'1 casal + 1 solteiro','es':'1 doble + 1 individual','en':'1 double + 1 single'},tags=['tres'],
      txt={'pt':'Piso hidráulico, cortinas de linho e espaço para três.','es':'Piso calcáreo, cortinas de lino y lugar para tres.','en':'Patterned tile floors, linen curtains and room for three.'}),
 dict(id='prime',rooms=[6],zone='prime',name='Prime',units='16 · 17 · 18',size='16',pax=2,beds={'pt':'1 cama de casal','es':'1 cama doble','en':'1 double bed'},tags=[],
      txt={'pt':'Aconchegante, a poucos passos da areia.','es':'Acogedora, a pocos pasos de la arena.','en':'Cosy, a few steps from the sand.'}),
 dict(id='enerito',rooms=[8,9,10,11,12,13],zone='enerito',name='Enerito',units='9 · 10 · 11 · 12 · 13 · 14',size='16–19',pax=2,beds={'pt':'1 cama de casal','es':'1 cama doble','en':'1 double bed'},tags=[],
      txt={'pt':'Simples e impecável: o jeito mais leve de ficar no Enero.','es':'Simple e impecable: la forma más liviana de quedarse en Enero.','en':'Simple and spotless: the lightest way to stay at Enero.'}),
 dict(id='suite-8',rooms=[14],zone='posada',name='Suíte 8',units='8',size='14',pax=2,beds={'pt':'1 cama de casal','es':'1 cama doble','en':'1 double bed'},tags=[],
      txt={'pt':'Compacta e silenciosa, perfeita para casais.','es':'Compacta y silenciosa, ideal para parejas.','en':'Compact and quiet, ideal for couples.'}),
 dict(id='suites-26-28',rooms=[22,23,24],zone='posada',name='Suítes 26 a 28',units='26 · 27 · 28',size='14',pax=2,beds={'pt':'1 cama de casal','es':'1 cama doble','en':'1 double bed'},tags=[],
      txt={'pt':'As mais novas da pousada, para dois.','es':'Las más nuevas de la pousada, para dos.','en':'The newest rooms in the pousada, for two.'}),
 dict(id='casa-enero',rooms=[25,26],zone='casa',name='Casa Enero',units='',size='',pax=3,beds={'pt':'Duplas e triplas, cama queen','es':'Dobles y triples, cama queen','en':'Doubles and triples, queen bed'},tags=['tres'],
      txt={'pt':'Quartos privativos numa casa com piscina, sala, cozinha e área gourmet compartilhadas. Não inclui café da manhã.','es':'Cuartos privados en una casa con pileta, living, cocina y área gourmet compartidos. No incluye desayuno.','en':'Private rooms in a house with a shared pool, lounge, kitchen and barbecue area. Breakfast not included.'}),
]
for c in C:
    allimgs=[]
    for r in c['rooms']: allimgs+=imgs(r)
    if c['id']=='casa-enero':
        allimgs=[i for i in allimgs if i['f']=='25_03']+[i for i in allimgs if i['f']!='25_03']
    c['img']=allimgs[:16]; c['n']=len(allimgs)
    c['feat']=feats(c['rooms'][0])
units=sum(len(c['units'].split('·')) for c in C if c['units'])
open(f'{W}/js/data.js','w').write('window.ENERO_SUITES='+json.dumps(C,ensure_ascii=False,separators=(',',':'))+';')
print(units, [ (c['id'],c['n']) for c in C], os.path.getsize(f'{W}/js/data.js'))
