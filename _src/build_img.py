import glob,json,os,re
from PIL import Image
import numpy as np
W='/home/claude/enero/web/img'; OUT='/mnt/user-data/outputs/enero'; F='/home/claude/enero/id/fotos'
def grade(im,s=0.80):
    a=np.asarray(im.convert('RGB')).astype(np.float32)/255
    g=a.mean(2,keepdims=True); a=g+(a-g)*s
    a[...,0]*=1.03; a[...,2]*=0.95
    a=0.045+a*0.93
    return Image.fromarray((np.clip(np.clip(a,0,1)**1.04,0,1)*255).astype(np.uint8))
def save(im,name,widths,q=78):
    out=[]
    for w in widths:
        x=im.copy()
        if x.width>w: x=x.resize((w,round(x.height*w/x.width)),Image.LANCZOS)
        p=f'{W}/{name}-{w}.webp'; x.save(p,'WEBP',quality=q,method=6); out.append((w,x.size))
    return out
log={}
# hero desktop from original CSR00103 (graded)
im=grade(Image.open(f'{OUT}/web-actual/posada/CSR00103.webp'))
log['hero-desk']=save(im,'hero-desk',[1600,960])
# hero celu from original 1440x1800 hamaca
src=glob.glob(f'{OUT}/fotos-ig/posada/085-04_*')[0]
im=grade(Image.open(src)); log['hero-celu']=save(im,'hero-celu',[900,600])
# graded photos already prepared
for k,ws in {'puerta-quiosco':[1600,900],'mesa-picnic':[900,600],'cesta-girasoles':[900,600],'suite-detalle':[900,600],'reposeras':[1000,600],'fachada':[1200,700],'bandeja':[1200,700],'rest-3':[900,600],'rest-mesa':[900,600],'rest-1':[600],'rest-2':[600],'drink':[800,600],'aerea':[900,600],'jangada':[900,600],'catamara':[900,600],'piscinas':[900,600],'pet-gato':[800,500],'pet-perro':[800,500],'atardecer':[900,600],'hamaca':[900]}.items():
    log[k]=save(Image.open(f'{F}/{k}.jpg'),k,ws)
# rooms
rooms=json.load(open('/home/claude/enero/suites/rooms_br.json'))
cnt=0
for f in sorted(glob.glob('/home/claude/enero/suites/rooms/*.jpg')):
    b=os.path.basename(f)[:-4]
    im=grade(Image.open(f),0.88)
    save(im,'suites/'+b,[800,480],q=76); cnt+=1
print(cnt); print(json.dumps({k:v for k,v in log.items()}))
