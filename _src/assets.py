import json,math,sys
D='/tmp/claude-0/-home-claude/129a5318-04b4-5bfb-8766-b6147f08f0b1/scratchpad/logo'
O='/home/claude/enero/id/assets'
P=json.load(open(D+'/parts.json'))
NAVY,SOL,PISC,CAL='#014878','#FCC93E','#12B193','#F7F2E8'
cx,cy,r,sw,split=1098.5,1097,1024,43,1185
def ring(top,bot):
    return (f'<defs><clipPath id="t"><rect x="0" y="0" width="2200" height="{split}"/></clipPath><clipPath id="b"><rect x="0" y="{split}" width="2200" height="1100"/></clipPath></defs>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{top}" stroke-width="{sw}" clip-path="url(#t)"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{bot}" stroke-width="{sw}" clip-path="url(#b)"/>')
def paths(m):
    return ''.join(f'<path fill="{c}" fill-rule="evenodd" d="{P[n]["d"]}"/>' for n,c in m)
def save(name,vb,body):
    open(f'{O}/{name}','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{body}</svg>')
VB="0 0 2200 2200"
save('logo-color.svg',VB,ring(SOL,NAVY)+paths([('sail2',SOL),('sail',NAVY),('swoosh',SOL),('wave',PISC),('E',NAVY),('nero',NAVY),('maragogi',SOL)]))
save('logo-claro.svg',VB,ring(SOL,CAL)+paths([('sail2',SOL),('sail',CAL),('swoosh',SOL),('wave',PISC),('E',CAL),('nero',CAL),('maragogi',SOL)]))
save('logo-mono-navy.svg',VB,ring(NAVY,NAVY)+paths([(n,NAVY) for n in ['sail2','sail','swoosh','wave','E','nero','maragogi']]))
iso="574 271 1081 982"
save('isotipo-color.svg',iso,paths([('sail2',SOL),('sail',NAVY),('swoosh',SOL),('wave',PISC)]))
save('isotipo-navy.svg',iso,paths([(n,NAVY) for n in ['sail2','sail','swoosh','wave']]))
save('isotipo-claro.svg',iso,paths([('sail2',SOL),('sail',CAL),('swoosh',SOL),('wave',PISC)]))
# individual strokes
def bb(n,pad=12):
    x,y,w,h=P[n]['bbox']; return f"{x-pad} {y-pad} {w+2*pad} {h+2*pad}"
save('trazo-vela.svg',bb('sail'),paths([('sail',NAVY)]))
save('trazo-mastro.svg',bb('sail2'),paths([('sail2',SOL)]))
x0=min(P['wave']['bbox'][0],P['swoosh']['bbox'][0])-12; y0=P['wave']['bbox'][1]-12
x1=max(P['wave']['bbox'][0]+P['wave']['bbox'][2],P['swoosh']['bbox'][0]+P['swoosh']['bbox'][2])+12; y1=P['swoosh']['bbox'][1]+P['swoosh']['bbox'][3]+12
save('trazo-ola.svg',f"{x0} {y0} {x1-x0} {y1-y0}",paths([('swoosh',SOL),('wave',PISC)]))
save('trazo-ola-navy.svg',f"{x0} {y0} {x1-x0} {y1-y0}",paths([('swoosh',NAVY),('wave',NAVY)]))
save('trazo-ola-claro.svg',f"{x0} {y0} {x1-x0} {y1-y0}",paths([('swoosh',SOL),('wave',CAL)]))
# horizonte: split circle sun/sea
for nm,top,bot in [('horizonte.svg',SOL,NAVY),('horizonte-claro.svg',SOL,CAL)]:
    save(nm,"0 0 200 200",f'<defs><clipPath id="t"><rect width="200" height="108"/></clipPath><clipPath id="b"><rect y="108" width="200" height="92"/></clipPath></defs><circle cx="100" cy="100" r="92" fill="none" stroke="{top}" stroke-width="5" clip-path="url(#t)"/><circle cx="100" cy="100" r="92" fill="none" stroke="{bot}" stroke-width="5" clip-path="url(#b)"/>')
# brush stroke generator (tapered, logo-like: quick attack, long tail)
def bez(p,t):
    (a,b,c,d)=p; mt=1-t
    return tuple(mt**3*a[i]+3*mt*mt*t*b[i]+3*mt*t*t*c[i]+t**3*d[i] for i in range(2))
def stroke(p,w,n=80,attack=0.18,tail=0.55):
    pts=[bez(p,i/n) for i in range(n+1)]
    L,R=[],[]
    for i,(x,y) in enumerate(pts):
        t=i/n
        a=min(1,t/attack)**0.6; b=min(1,(1-t)/tail)**0.9 if t>1-tail else 1
        ww=w*max(0.06,a*b)/2
        x2,y2=pts[min(n,i+1)]; x1,y1=pts[max(0,i-1)]
        dx,dy=x2-x1,y2-y1; l=math.hypot(dx,dy) or 1; nx,ny=-dy/l,dx/l
        L.append((x+nx*ww,y+ny*ww)); R.append((x-nx*ww,y-ny*ww))
    poly=L+R[::-1]
    return 'M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in poly)+'Z'
def strokes_svg(name,vb,items,color):
    save(name,vb,''.join(f'<path fill="{c or color}" d="{stroke(p,w,**kw)}"/>' for p,w,c,kw in items))
# horizonte line + mares
strokes_svg('trazo-horizonte.svg',"0 0 1000 60",[(((10,34),(300,22),(700,22),(990,30)),16,None,{})],NAVY)
strokes_svg('trazo-mares.svg',"0 0 1000 220",[
 (((20,70),(320,0),(620,120),(980,30)),24,PISC,{}),
 (((90,130),(380,80),(660,170),(930,105)),17,SOL,{}),
 (((160,190),(420,150),(700,215),(880,175)),12,NAVY,{})],NAVY)
strokes_svg('trazo-subrayado.svg',"0 0 600 50",[(((10,36),(200,16),(420,30),(590,12)),20,None,{'attack':0.1,'tail':0.7})],PISC)
# vela mask shape (objectBoundingBox) path text, for inline use
open(f'{O}/vela-clip.txt','w').write("M0.08,0 C0.42,0.18 0.86,0.55 1,1 L0,1 Z")
# icons (tapered strokes, 48 box)
I={
'suites':[((6,40),(6,30),(6,22),(7,12)),((6,33),(18,33),(32,33),(42,33)),((42,33),(42,36),(42,38),(42,41)),((11,27),(14,24),(19,24),(22,27)),((24,27),(30,24),(36,24),(41,28))],
'cesta':[((7,22),(16,22),(32,22),(41,22)),((9,22),(11,32),(12,38),(14,41)),((39,22),(37,32),(36,38),(34,41)),((14,41),(20,41),(28,41),(34,41)),((14,22),(14,8),(34,8),(34,22)),((12,30),(20,31),(28,29),(36,30))],
'passeios':[((22,6),(30,14),(36,24),(36,32)),((36,32),(31,33),(26,33),(22,32)),((22,6),(22,16),(22,25),(22,32)),((18,13),(16,20),(14,26),(13,32)),((6,38),(18,35),(30,39),(42,36))],
'restaurante':[((14,6),(14,14),(14,20),(16,24)),((20,6),(20,14),(20,20),(18,24)),((17,24),(17,30),(17,36),(17,42)),((32,6),(38,12),(38,22),(33,25)),((33,25),(33,31),(33,36),(33,42))],
'pet':[],
'mapa':[((24,42),(14,30),(10,22),(12,14)),((12,14),(16,4),(32,4),(36,14)),((36,14),(38,22),(34,30),(24,42)),((20,18),(22,14),(27,14),(28,19))],
}
for k,ss in I.items():
    body=''.join(f'<path fill="{NAVY}" d="{stroke(p,4.2,n=40,attack=0.15,tail=0.4)}"/>' for p in ss)
    if k=='pet':
        body+=''.join(f'<ellipse cx="{x}" cy="{y}" rx="3.6" ry="4.6" fill="{NAVY}" transform="rotate({a} {x} {y})"/>' for x,y,a in [(12,21,-25),(19,13,-8),(29,13,8),(36,21,25)])+f'<path fill="{NAVY}" d="M24 26 C30 26 36 33 35 38 C34 42 29 41 24 40 C19 41 14 42 13 38 C12 33 18 26 24 26Z"/>'
    save(f'icono-{k}.svg',"0 0 48 48",body)
    save(f'icono-{k}-sol.svg',"0 0 48 48",body.replace(NAVY,SOL))
import os;print(sorted(os.listdir(O)))
bbw=[P[n]['bbox'] for n in ['E','nero','maragogi']]
x0=min(b[0] for b in bbw)-20;y0=min(b[1] for b in bbw)-20;x1=max(b[0]+b[2] for b in bbw)+20;y1=max(b[1]+b[3] for b in bbw)+20
save('wordmark.svg',f"{x0} {y0} {x1-x0} {y1-y0}",paths([('E',NAVY),('nero',NAVY),('maragogi',SOL)]))
