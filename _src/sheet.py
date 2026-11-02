import sys,glob,os
from PIL import Image,ImageDraw,ImageFont
src,out=sys.argv[1],sys.argv[2]
fs=sorted(glob.glob(src+'/*.jpg'))
C,R,S=10,6,190
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20) if os.path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf') else ImageFont.load_default()
for p in range(0,len(fs),C*R):
    sh=Image.new('RGB',(C*S,R*S),'white');d=ImageDraw.Draw(sh)
    for i,fp in enumerate(fs[p:p+C*R]):
        im=Image.open(fp).convert('RGB');im.thumbnail((S-6,S-6))
        x,y=(i%C)*S,(i//C)*S;sh.paste(im,(x+(S-im.width)//2,y+(S-im.height)//2))
        bn=os.path.basename(fp);n=bn[:6] if bn[3]=='-' else bn[:3];t=' ' if bn[3]=='-' else bn[4:8]
        d.rectangle([x+2,y+2,x+92,y+26],fill='black');d.text((x+5,y+3),n+t[0],fill='yellow',font=f)
    sh.save(f'{out}/sheet_{p//(C*R)+1:02d}.jpg',quality=80)
print(len(fs))
