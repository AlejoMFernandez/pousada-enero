import math,os
O='/home/claude/enero/id/assets/icons2'
os.makedirs(O,exist_ok=True)
NAVY='#014878'
def cub(a,b,c,d,t):
    m=1-t;return (m**3*a[0]+3*m*m*t*b[0]+3*m*t*t*c[0]+t**3*d[0], m**3*a[1]+3*m*m*t*b[1]+3*m*t*t*c[1]+t**3*d[1])
def sample(segs,n=60):
    pts=[]
    for s in segs:
        if len(s)==2: a,d=s; b=(a[0]+(d[0]-a[0])/3,a[1]+(d[1]-a[1])/3); c=(a[0]+2*(d[0]-a[0])/3,a[1]+2*(d[1]-a[1])/3)
        else: a,b,c,d=s
        k=n
        for i in range(k+ (1 if s is segs[-1] else 0)): pts.append(cub(a,b,c,d,i/k))
    return pts
def brush(segs,w=3.6,lo=0.55,closed=False):
    """pen-brush: thick in the middle, slimmer (not pointy) ends with round caps"""
    pts=sample(segs)
    # cumulative length
    L=[0]
    for i in range(1,len(pts)): L.append(L[-1]+math.dist(pts[i],pts[i-1]))
    T=L[-1] or 1
    left,right=[],[]
    for i,(x,y) in enumerate(pts):
        t=L[i]/T
        f=1 if closed else lo+(1-lo)*math.sin(math.pi*min(1,max(0,t)))**0.6
        hw=w*f/2
        x2,y2=pts[min(len(pts)-1,i+1)];x1,y1=pts[max(0,i-1)]
        dx,dy=x2-x1,y2-y1;l=math.hypot(dx,dy) or 1;nx,ny=-dy/l,dx/l
        left.append((x+nx*hw,y+ny*hw));right.append((x-nx*hw,y-ny*hw))
    d='M'+' L'.join(f'{x:.2f} {y:.2f}' for x,y in left+right[::-1])+'Z'
    if not closed:
        for (x,y),t in [(pts[0],0),(pts[-1],1)]:
            r=w*lo/2; d+=f'M{x-r:.2f} {y:.2f}a{r:.2f} {r:.2f} 0 1 0 {2*r:.2f} 0a{r:.2f} {r:.2f} 0 1 0 {-2*r:.2f} 0Z'
    return d
I={}
I['suites']=[ [((7,13),(7,40))], [((7,31),(41,31))], [((41,31),(41,40))],
  [((11,27),(10,22),(19,21),(20,25)),((20,25),(20.5,28),(12,28.5),(11,27))], [((23,31),(23,26.5)),((23,26.5),(30,24),(37,24),(41,26.5)),((41,26.5),(41,31))] ]
I['cesta']=[ [((13,22),(13,8),(35,8),(35,22))], [((6,22),(42,22))], [((9,22),(13,40))],[((39,22),(35,40))],[((13,40),(35,40))],[((11,31),(37,31))] ]
I['restaurante']=[ [((13,6),(13,15))],[((18,6),(18,15))],[((23,6),(23,15))],[((13,15),(13,21),(23,21),(23,15))],[((18,20),(18,42))],
  [((33,6),(40,10),(40,22),(34,25))],[((33,6),(33,42))] ]
I['passeios']=[ [((24,6),(31,13),(36,23),(36,31)),((36,31),(23,31))],[((24,6),(23,31))],[((19,14),(18,22),(16,27),(14,31))],[((6,38),(16,34.5),(30,40.5),(42,36))] ]
I['mapa']=[ [((24,42),(15,32),(10,25),(10,18)),((10,18),(10,10),(16,5),(24,5)),((24,5),(32,5),(38,10),(38,18)),((38,18),(38,25),(33,32),(24,42))],
  [((24,13.5),(27,13.5),(28.5,15.5),(28.5,18)),((28.5,18),(28.5,21),(26.5,22.5),(24,22.5)),((24,22.5),(21,22.5),(19.5,20.5),(19.5,18)),((19.5,18),(19.5,15),(21.5,13.5),(24,13.5))] ]
I['praia']=[ [((7,21),(12,9),(36,9),(41,21))],[((7,21),(11,18.5),(15,18.5),(19,21)),((19,21),(22,18.5),(26,18.5),(29,21)),((29,21),(33,18.5),(37,18.5),(41,21))],[((24,12),(24,41))],[((12,41),(36,41))] ]
I['wifi']=[ [((8,20),(18,11),(30,11),(40,20))],[((14,26),(20,20.5),(28,20.5),(34,26))],[((19.5,32),(22,30),(26,30),(28.5,32))] ]
I['estrela']=[ [((24,6),(28.5,17)),((28.5,17),(40,18)),((40,18),(31,26)),((31,26),(34,38)),((34,38),(24,31.5)),((24,31.5),(14,38)),((14,38),(17,26)),((17,26),(8,18)),((8,18),(19.5,17)),((19.5,17),(24,6))] ]
paw=''.join(f'<ellipse cx="{x}" cy="{y}" rx="3.6" ry="4.7" fill="{NAVY}" transform="rotate({a} {x} {y})"/>' for x,y,a in [(11.5,21,-25),(18.5,12.5,-8),(29.5,12.5,8),(36.5,21,25)])+f'<path fill="{NAVY}" d="M24 25 C30.5 25 37 32.5 36 37.5 C35 42 29.5 41 24 40 C18.5 41 13 42 12 37.5 C11 32.5 17.5 25 24 25Z"/>'
for k,ss in I.items():
    w=3.4 if k not in('mapa',) else 3.4
    body=''.join(f'<path fill="{NAVY}" fill-rule="nonzero" d="{brush(s,w=w,closed=(k=="estrela"))}"/>' for s in ss)
    open(f'{O}/icono-{k}.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">{body}</svg>')
open(f'{O}/icono-pet.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">{paw}</svg>')
html='<html><body style="margin:0;padding:20px;background:#F7F2E8;display:flex;flex-wrap:wrap;gap:24px">'+''.join(f'<div style="background:#fff;padding:14px;text-align:center;font:12px sans-serif"><img src="icono-{k}.svg" width="96"><br><img src="icono-{k}.svg" width="32"> {k}</div>' for k in list(I)+['pet'])+'</body></html>'
open(f'{O}/prev.html','w').write(html)
print(sorted(os.listdir(O)))
