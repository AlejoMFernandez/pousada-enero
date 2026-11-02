import cv2,numpy as np,json,sys
D=sys.argv[1]
def path_from(mask):
    m=cv2.resize(mask,None,fx=2,fy=2,interpolation=cv2.INTER_CUBIC)
    m=cv2.GaussianBlur(m,(5,5),0); _,m=cv2.threshold(m,127,255,cv2.THRESH_BINARY)
    cs,_=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
    out=[]
    for c in cs:
        if cv2.contourArea(c)<60: continue
        p=cv2.approxPolyDP(c,1.2,True).reshape(-1,2)/2.0
        if len(p)<3: continue
        mids=[(p[i]+p[(i+1)%len(p)])/2 for i in range(len(p))]
        s=f"M{mids[-1][0]:.1f} {mids[-1][1]:.1f}"
        for i in range(len(p)):
            s+=f"Q{p[i][0]:.1f} {p[i][1]:.1f} {mids[i][0]:.1f} {mids[i][1]:.1f}"
        out.append(s+"Z")
    return " ".join(out)
parts={}
for k,ids in {'navy':{'sail':[1],'E':[2],'ringB':[3],'nero':[4,5,6,7]},'yellow':{'ringT':[1],'sail2':[2],'swoosh':[3],'maragogi':[4,5,6,7]},'green':{'wave':None}}.items():
    m=(cv2.imread(f'{D}/mask_{k}.png',0)>127).astype(np.uint8)
    n,lab,st,_=cv2.connectedComponentsWithStats(m,8)
    for name,sel in ids.items():
        if sel is None: sel=[i for i in range(1,n) if st[i][4]>300]
        mm=np.isin(lab,sel).astype(np.uint8)*255
        x,y,w,h=cv2.boundingRect(mm)
        parts[name]={'d':path_from(mm),'bbox':[x,y,w,h],'color':k}
json.dump(parts,open(f'{D}/parts.json','w'))
col={'navy':'#014878','yellow':'#FCC93E','green':'#12B193'}
def svg(names,vb,fill=None,fn=None):
    g="".join(f'<path fill="{fill or col[parts[n]["color"]]}" fill-rule="evenodd" d="{parts[n]["d"]}"/>' for n in names)
    s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{g}</svg>'
    open(f'{D}/{fn}','w').write(s); return s
allp=['ringT','ringB','sail2','sail','swoosh','wave','E','nero','maragogi']
svg(allp,"0 0 2190 2200",fn='logo-color.svg')
svg(allp,"0 0 2190 2200",fill='#FFFFFF',fn='logo-blanco.svg')
# isotipo bbox
bb=[parts[n]['bbox'] for n in ['sail','sail2','swoosh','wave']]
x0=min(b[0] for b in bb)-20;y0=min(b[1] for b in bb)-20;x1=max(b[0]+b[2] for b in bb)+20;y1=max(b[1]+b[3] for b in bb)+20
svg(['sail2','sail','swoosh','wave'],f"{x0} {y0} {x1-x0} {y1-y0}",fn='isotipo-color.svg')
svg(['sail2','sail','swoosh','wave'],f"{x0} {y0} {x1-x0} {y1-y0}",fill='#014878',fn='isotipo-navy.svg')
print({k:v['bbox'] for k,v in parts.items()}, (x0,y0,x1-x0,y1-y0))
