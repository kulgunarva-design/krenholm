from pathlib import Path
import sys
from urllib.parse import urlparse
from reportlab.graphics.barcode.qr import QrCodeWidget
from PIL import Image, ImageDraw
url = sys.argv[1] if len(sys.argv)>1 else ''
if urlparse(url).scheme != 'https' or not urlparse(url).netloc:
    raise SystemExit('Specify the final public HTTPS URL as the first argument.')
qr=QrCodeWidget(url,barLevel='M').qr
qr.make()
n=qr.getModuleCount(); quiet=4; size=n+quiet*2; scale=20
out=Path(sys.argv[2]) if len(sys.argv)>2 else Path(__file__).resolve().parents[1]/'qr'
out.mkdir(parents=True,exist_ok=True)
rects=[]; im=Image.new('RGB',(size*scale,size*scale),'white'); draw=ImageDraw.Draw(im)
for y in range(n):
    for x in range(n):
        if qr.isDark(y,x):
            a=x+quiet; b=y+quiet
            rects.append(f'<rect x="{a}" y="{b}" width="1" height="1"/>')
            draw.rectangle((a*scale,b*scale,(a+1)*scale-1,(b+1)*scale-1),fill='black')
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/><g fill="black">'+''.join(rects)+'</g></svg>'
(out/'site-qr.svg').write_text(svg,encoding='utf-8'); im.save(out/'site-qr.png')
(out/'destination.txt').write_text(url,encoding='utf-8')
print('Saved SVG and PNG to',out)
