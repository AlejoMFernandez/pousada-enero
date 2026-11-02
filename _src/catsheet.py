import sys,glob,os
from PIL import Image,ImageDraw,ImageFont
root,out=sys.argv[1],sys.argv[2];os.makedirs(out,exist_ok=True)
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',15)
for sub in ['fotos-ig','web-actual']:
  for d in sorted(glob.glob(f'{root}/{sub}/*/')):
    cat=os.path.basename(d.rstrip('/'))
    if cat in('con-texto-o-graficas','epoca-anterior') and sub=='fotos-ig': C,S=12,160
    else: C,S=9,210
    fs=sorted(glob.glob(d+'*.jpg')+glob.glob(d+'*.webp'))
    per=C*8
    for p in range(0,len(fs),per):
        ch=fs[p:p+per];R=(len(ch)+C-1)//C
        sh=Image.new('RGB',(C*S,R*(S+18)),'white');dr=ImageDraw.Draw(sh)
        for i,fp in enumerate(ch):
            im=Image.open(fp).convert('RGB');im.thumbnail((S-6,S-6));x,y=(i%C)*S,(i//C)*(S+18)
            sh.paste(im,(x+(S-im.width)//2,y+(S-im.height)//2))
            lab=os.path.basename(fp).rsplit('.',1)[0];lab=lab.split('_')[0] if sub=='fotos-ig' else lab[:20]
            dr.text((x+4,y+S),lab,fill='black',font=f)
        sfx='' if len(fs)<=per else f'-{p//per+1}'
        sh.save(f'{out}/{sub}__{cat}{sfx}.jpg',quality=78)
print(sorted(os.listdir(out)))
