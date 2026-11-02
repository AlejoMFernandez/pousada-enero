import sys,glob,os,json
from PIL import Image,ImageDraw,ImageFont
cat,out=sys.argv[1],sys.argv[2]
fs=sorted(glob.glob(f'/mnt/user-data/outputs/enero/fotos-ig/{cat}/*.jpg'))
C,R,S=8,6,220
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22)
idx={}
for p in range(0,len(fs),C*R):
    sh=Image.new('RGB',(C*S,R*S),'white');d=ImageDraw.Draw(sh)
    for i,fp in enumerate(fs[p:p+C*R]):
        n=p+i; idx[n]=os.path.basename(fp)
        im=Image.open(fp).convert('RGB');im.thumbnail((S-6,S-6))
        x,y=(i%C)*S,(i//C)*S;sh.paste(im,(x+(S-im.width)//2,y+(S-im.height)//2))
        d.rectangle([x+2,y+2,x+50,y+30],fill='black');d.text((x+6,y+4),str(n),fill='yellow',font=f)
    sh.save(f'{out}/{cat}_{p//(C*R)+1}.jpg',quality=78)
json.dump(idx,open(f'{out}/{cat}.json','w'))
print(cat,len(fs))
