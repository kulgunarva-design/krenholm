const grid=document.querySelector('#gallery-grid');
const order=[9,10,0,6,2,3,4,5,7,8,11,12,1];
const album=order.map(i=>photos[i]);
album.forEach((p,i)=>{const b=document.createElement('button');b.className='photo';b.setAttribute('aria-label',({et:'Ava: ',ru:'Открыть: ',en:'Open: '}[document.documentElement.lang]||'Ava: ')+p.caption);const img=document.createElement('img');img.src=p.src;img.alt=p.caption;img.loading='lazy';const label=document.createElement('span');label.className='photo-label';label.textContent=p.caption;const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');label.append(n);b.append(img,label);b.onclick=()=>openPhoto(i);grid.append(b)});
const box=document.querySelector('#lightbox');let current=0;
function showPhoto(){const p=album[current];document.querySelector('#large-photo').src=p.src;document.querySelector('#large-photo').alt=p.caption;document.querySelector('#photo-caption').textContent=p.caption+' · '+(current+1)+' / '+album.length;}
function openPhoto(i){current=i;showPhoto();box.showModal();document.body.style.overflow='hidden';}
function step(n){current=(current+n+album.length)%album.length;showPhoto()}
box.querySelector('.close').onclick=()=>box.close();box.querySelector('.prev').onclick=()=>step(-1);box.querySelector('.next').onclick=()=>step(1);box.addEventListener('close',()=>document.body.style.overflow='');box.addEventListener('click',e=>{if(e.target===box)box.close()});box.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});
const details=document.querySelector('#contact-details');if(siteConfig.email||siteConfig.phone||siteConfig.address){details.replaceChildren();for(const [key,prefix] of [['email','mailto:'],['phone','tel:'],['address','']]){if(!siteConfig[key])continue;const el=document.createElement(prefix?'a':'p');el.textContent=siteConfig[key];if(prefix)el.href=prefix+siteConfig[key];details.append(el)}}

const heroFlip=document.querySelector(".hero-flip");
if(heroFlip){
 const era=document.querySelector(".hero-era");
 const modern=heroFlip.querySelector('.hero-back');
 const masonry=document.createElement('span');
 masonry.className='hero-masonry';masonry.setAttribute('aria-hidden','true');
 heroFlip.querySelector('.hero-flip-inner').append(masonry);
 const drawBricks=()=>{
  if(!modern.naturalWidth)return;
  const width=heroFlip.clientWidth,height=heroFlip.clientHeight;
  if(!width||!height)return;
  const columns=6,brickWidth=width/columns,rows=Math.ceil(height/(brickWidth*.48)),brickHeight=height/rows;
  const scale=Math.max(width/modern.naturalWidth,height/modern.naturalHeight);
  const imageWidth=modern.naturalWidth*scale,imageHeight=modern.naturalHeight*scale;
  const offsetX=(width-imageWidth)/2,offsetY=(height-imageHeight)*.4;
  const fragment=document.createDocumentFragment();
  for(let row=0;row<rows;row++)for(let col=0;col<columns+(row%2);col++){
   const left=Math.max(0,(col-(row%2)*.5)*brickWidth),right=Math.min(width,(col+1-(row%2)*.5)*brickWidth),top=row*brickHeight;
   const brick=document.createElement('span');brick.className='hero-brick';
   const phase=(left/width*.55+row/Math.max(1,rows-1)*.45);
   Object.assign(brick.style,{left:left+'px',top:top+'px',width:(right-left+.35)+'px',height:(brickHeight+.35)+'px',backgroundImage:'url("'+modern.src+'")',backgroundSize:imageWidth+'px '+imageHeight+'px',backgroundPosition:(offsetX-left)+'px '+(offsetY-top)+'px'});
   brick.style.setProperty('--reveal-delay',Math.round(phase*1500)+'ms');
   brick.style.setProperty('--return-delay',Math.round((1-phase)*1000)+'ms');
   fragment.append(brick);
  }
  masonry.replaceChildren(fragment);heroFlip.classList.add('has-bricks');
 };
 modern.addEventListener('load',drawBricks);drawBricks();
 new ResizeObserver(drawBricks).observe(heroFlip);
 const setHeroFace=shown=>{heroFlip.classList.toggle("is-flipped",shown);heroFlip.setAttribute("aria-pressed",String(shown));heroFlip.querySelector(".hero-front").setAttribute("aria-hidden",String(shown));heroFlip.querySelector(".hero-back").setAttribute("aria-hidden",String(!shown));era.textContent=shown?era.dataset.present:era.dataset.past;};
 heroFlip.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse")setHeroFace(true);});
 heroFlip.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse")setHeroFace(false);});
 heroFlip.addEventListener("click",()=>setHeroFace(!heroFlip.classList.contains("is-flipped")));
 heroFlip.addEventListener("keydown",e=>{if(e.key==="Escape")setHeroFace(false);});
 heroFlip.addEventListener("blur",()=>setHeroFace(false));
}


const historyNote=document.querySelector(".history-disclosure");
if(historyNote){
 const trigger=historyNote.querySelector(".history-toggle"),panel=historyNote.querySelector(".history-reveal");
 let pinned=false,closeTimer;
 const showHistory=open=>{historyNote.classList.toggle("is-open",open);trigger.setAttribute("aria-expanded",String(open));panel.inert=!open;};
 historyNote.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse"){clearTimeout(closeTimer);showHistory(true);}});
 historyNote.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse"&&!pinned)closeTimer=setTimeout(()=>showHistory(false),350);});
 trigger.addEventListener("click",()=>{clearTimeout(closeTimer);pinned=!pinned;showHistory(pinned);});
 historyNote.addEventListener("keydown",e=>{if(e.key==="Escape"){clearTimeout(closeTimer);pinned=false;showHistory(false);trigger.focus();}});
 document.addEventListener("click",e=>{if(!historyNote.contains(e.target)){clearTimeout(closeTimer);pinned=false;showHistory(false);}});
}

