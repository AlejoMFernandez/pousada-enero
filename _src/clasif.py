import os,shutil,glob,sys,csv
from PIL import Image
raw,out=sys.argv[1],sys.argv[2]
C={}
def put(cat,nums):
    for n in nums: C[n]=cat
txt=[2,6,10,11,14,20,23,24,25,31,32,33,43,57,58,60,61,129,140,173,181,185,187,189,195,201,204,212,215,222,227,229,235,238,239,244,245,251,254,260,265,266,267,268]+list(range(269,377))+[380,383,384,391,392,393,396,401,402,404,406,408,409,410,414,416,417,420]
put('con-texto',txt)
put('posada',[1,3,4,8,9,12,22,26,34,44,47,49,63,65,69,70,72,73,75,79,83,85,90,93,95,107,110,116,117,122,125,128,130,131,133,134,135,136,139,143,151,158,162,163,165,166,168,175,177,180,184,186,203,208,209,210,211,216,219,224,228,234,236,240,246,247,248,252,259,264,387,389,394])
put('playa-y-mar',[15,30,38,48,50,51,62,66,67,81,84,94,97,99,108,111,114,124,126,138,142,145,150,154,157,171,172,174,182,194,198,200,205,213,218,220,223,226,242,256,258,378,379,390,395])
put('suites',[16,18,40,54,68,71,77,80,88,96,101,106,109,119,123,132,144,153,164,169,178,199,249,250,255,257,261])
put('cafe-da-manha',[52,53,59,82,89,104,112,115,118,121,127,137,152,170,176,183,191,197,202,214,221,241,243,253,263,405,418])
put('restaurante-y-drinks',[7,13,27,28,36,37,39,41,42,46,64,74,78,86,87,92,98,100,102,103,105,113,159,160,192,196,207,217,225,231,377,411])
put('experiencias',[17,141,146,147,148,161,167,190,206,237,262,382,388,398,399,400,403,407,413,419])
put('huespedes-y-equipo',[5,19,21,29,45,55,56,76,91,120,156,188,193,230,232,233,381,385,386,415])
put('mascotas',[149,155,412])
put('marca',[35,179,397])
put('epoca-anterior',list(range(421,499)))
fs=sorted(glob.glob(raw+'/*.jpg')); miss=[]; cnt={}
rows=list(csv.DictReader(open(raw+'/instagram_posts.csv',encoding='utf-8-sig')))
dims={}
for f in fs:
    n=int(os.path.basename(f)[:3]); cat=C.get(n)
    if not cat: miss.append(n); continue
    d=f'{out}/fotos-ig/{cat}'; os.makedirs(d,exist_ok=True); shutil.copy2(f,d)
    cnt[cat]=cnt.get(cat,0)+1; dims[n]=Image.open(f).size
with open(out+'/fotos-ig/instagram_posts.csv','w',encoding='utf-8-sig',newline='') as fo:
    w=csv.writer(fo); w.writerow(['n','categoria','ancho','alto']+list(rows[0].keys())[1:])
    for r in rows:
        n=int(r['n']); w.writerow([n,C.get(n,''),*dims.get(n,('',''))]+list(r.values())[1:])
print(cnt,'missing',miss)
