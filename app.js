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
