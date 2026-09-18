const grid=document.querySelector('#gallery-grid');
const order=[9,10,0,6,2,3,4,5,7,8,11,12,1];
const album=order.map(i=>photos[i]);
album.forEach((p,i)=>{const b=document.createElement('button');b.className='photo';b.setAttribute('aria-label',({et:'Ava: ',ru:'Открыть: ',en:'Open: '}[document.documentElement.lang]||'Ava: ')+p.caption);const img=document.createElement('img');img.src=p.src;img.alt=p.caption;img.loading='lazy';const label=document.createElement('span');label.className='photo-label';label.textContent=p.caption;const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');label.append(n);b.append(img,label);b.onclick=()=>openPhoto(i);grid.append(b)});
const box=document.querySelector('#lightbox');let current=0,activeAlbum=album;
function showPhoto(){const p=activeAlbum[current];document.querySelector('#large-photo').src=p.src;document.querySelector('#large-photo').alt=p.caption;document.querySelector('#photo-caption').textContent=p.caption+' · '+(current+1)+' / '+activeAlbum.length;}
function openPhoto(i,collection=album){activeAlbum=collection;current=i;showPhoto();box.showModal();document.body.style.overflow='hidden';}
function step(n){current=(current+n+activeAlbum.length)%activeAlbum.length;showPhoto()}
box.querySelector('.close').onclick=()=>box.close();box.querySelector('.prev').onclick=()=>step(-1);box.querySelector('.next').onclick=()=>step(1);box.addEventListener('close',()=>document.body.style.overflow='');box.addEventListener('click',e=>{if(e.target===box)box.close()});box.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});
const renovationGrid=document.querySelector('#renovation-grid');
if(renovationGrid){
 const captions={
  et:['Katuse ja tellismüüritise detail','Telliskorstna seisukord','Katuse ja korstna ühenduskoht','Telliskorstna lähivaade','Korstna müüritise detail','Fassaadi ja vihmaveetoru detail','Korstna üldvaade','Katuse ja korstna vaade','Korstna remondi detail','Vana tellismüüritis','Fassaadi tellisdetail'],
  ru:['Деталь кровли и кирпичной кладки','Состояние кирпичной трубы','Примыкание кровли к трубе','Кирпичная труба крупным планом','Деталь кладки трубы','Фасад и водосточная труба','Общий вид трубы','Вид кровли и трубы','Деталь ремонта трубы','Старая кирпичная кладка','Деталь кирпичного фасада'],
  en:['Roof and brickwork detail','Condition of a brick chimney','Roof and chimney junction','Close view of a brick chimney','Chimney masonry detail','Facade and downpipe detail','Full view of the chimney','Roof and chimney view','Chimney repair detail','Historic brickwork','Brick facade detail']
 };
 const names=['IMG_2536','IMG_2620','IMG_2621','IMG_2623','IMG_2624','IMG_2710','IMG_4561','IMG_5125','IMG_5127','IMG_5131','IMG_5133'];
 const lang=document.documentElement.lang,labels=captions[lang]||captions.et;
 const renovationAlbum=names.map((name,i)=>({src:'img/renov/web/'+name+'.webp',caption:labels[i]}));
 renovationAlbum.forEach((p,i)=>{
  const button=document.createElement('button');button.type='button';button.className='renovation-photo';
  button.setAttribute('aria-label',({et:'Ava foto: ',ru:'Открыть фото: ',en:'Open photo: '}[lang]||'Ava foto: ')+p.caption);
  const img=document.createElement('img');img.src=p.src;img.alt=p.caption;img.loading='lazy';img.decoding='async';
  button.append(img);button.addEventListener('click',()=>openPhoto(i,renovationAlbum));renovationGrid.append(button);
 });
}
const details=document.querySelector('#contact-details');if(details){
 details.replaceChildren();
 for(const [key,prefix] of [['email','mailto:'],['phone','tel:']]){if(!siteConfig[key])continue;const el=document.createElement('a');el.href=prefix+siteConfig[key];el.textContent=siteConfig[key];details.append(el)}
 for(const [key,className] of [['contactName','contact-person'],['contactRole','contact-role']]){if(!siteConfig[key])continue;const el=document.createElement('p');el.className=className;el.textContent=key==='contactRole'?(document.documentElement.lang==='en'?siteConfig.contactRoleEn:document.documentElement.lang==='ru'?siteConfig.contactRoleRu:siteConfig.contactRole):siteConfig[key];details.append(el)}
}

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
 historyNote.querySelector(".history-close").addEventListener("click",()=>{clearTimeout(closeTimer);pinned=false;showHistory(false);trigger.focus();});
 historyNote.addEventListener("keydown",e=>{if(e.key==="Escape"){clearTimeout(closeTimer);pinned=false;showHistory(false);trigger.focus();}});
 document.addEventListener("click",e=>{if(!historyNote.contains(e.target)){clearTimeout(closeTimer);pinned=false;showHistory(false);}});
}

