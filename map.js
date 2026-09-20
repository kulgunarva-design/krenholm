// Positions refer to the dots at the ends of the handwritten lines in pano2.jpg.
// Percentages keep the markers anchored when the panorama scales.
(() => {
 const lang=document.documentElement.lang;
 const copy=({
  ru:{title:'Кренгольм на карте',hint:'Наведите на номер, чтобы увидеть фото. На телефоне нажмите на кружок; панораму можно двигать в сторону.',photo:'Фото',alt:'Цветная историческая панорама Кренгольма',close:'Закрыть фото',large:'Открыть крупнее'},
  et:{title:'Kreenholm kaardil',hint:'Foto vaatamiseks vii kursor numbrile. Telefonis puuduta numbrit; panoraami saab külgsuunas kerida.',photo:'Foto',alt:'Kreenholmi värvitud ajalooline panoraam',close:'Sulge foto',large:'Ava suuremalt'},
  en:{title:'Kreenholm on the map',hint:'Hover over a number to see a photo. On a phone, tap a circle and scroll the panorama sideways.',photo:'Photo',alt:'Colorized historical panorama of Kreenholm',close:'Close photo',large:'View larger'}
 })[lang] || {title:'Kreenholm',hint:'Hover over a number to see a photo.',photo:'Photo',alt:'Kreenholm panorama',close:'Close',large:'View larger'};
 const positions=[[17.49,66.17],[23.48,69.67],[28.15,69.24],[21.22,62.07],[32.55,71.09],[34.85,61.50],[50.13,49.37],[54.26,43.84],[3.94,97.0],[5.72,68.81],[8.54,77.11]];
 const collection=positions.map((_,i)=>({src:`img/map/${i+1}.${i===10?'JPG':'jpg'}`,caption:`${copy.photo} ${i+1}`}));
 const section=document.createElement('section');section.className='panorama-section section';section.id='panorama';
 const heading=document.createElement('h2');heading.textContent=copy.title;
 const hint=document.createElement('p');hint.className='panorama-hint';hint.id='panorama-hint';hint.textContent=copy.hint;
 const viewport=document.createElement('div');viewport.className='panorama-scroll';viewport.setAttribute('aria-label',copy.alt);viewport.setAttribute('aria-describedby',hint.id);viewport.tabIndex=0;
 const canvas=document.createElement('div');canvas.className='panorama-canvas';
 // Crop the scanned print edges; remap every marker to the same image location.
 const crop={left:1.4,right:3.2,top:1.2,bottom:2};
 const cropWidth=100-crop.left-crop.right,cropHeight=100-crop.top-crop.bottom;
 canvas.style.aspectRatio=`${1456*cropWidth} / ${1080*cropHeight}`;
 const panorama=document.createElement('img');panorama.className='panorama-image';panorama.src='img/pano/pano.png';panorama.alt=copy.alt;panorama.width=1456;panorama.height=1080;panorama.loading='lazy';
 Object.assign(panorama.style,{position:'absolute',width:(10000/cropWidth)+'%',maxWidth:'none',left:(-crop.left/cropWidth*100)+'%',top:(-crop.top/cropHeight*100)+'%'});
 canvas.append(panorama);viewport.append(canvas);section.append(heading,hint,viewport);
 document.querySelector('#gallery').before(section);

 const popup=document.createElement('div');popup.className='map-popup';popup.id='map-popup';popup.hidden=true;popup.setAttribute('role','region');
 const top=document.createElement('div');top.className='map-popup-top';
 const label=document.createElement('strong');label.id='map-popup-label';popup.setAttribute('aria-labelledby',label.id);
 const close=document.createElement('button');close.type='button';close.className='map-popup-close';close.textContent='×';close.setAttribute('aria-label',copy.close);top.append(label,close);
 const enlarge=document.createElement('button');enlarge.type='button';enlarge.className='map-popup-photo';enlarge.setAttribute('aria-label',copy.large);
 const photo=document.createElement('img');photo.decoding='async';enlarge.append(photo);popup.append(top,enlarge);document.body.append(popup);
 let active=null,timer,pinned=false;
 const buttons=[];
 function hide(){clearTimeout(timer);if(active!==null)buttons[active].setAttribute('aria-expanded','false');popup.hidden=true;active=null;pinned=false;}
 function place(){
  if(active===null)return;
  const r=buttons[active].getBoundingClientRect(),w=popup.offsetWidth,h=popup.offsetHeight;
  let x=r.left+r.width/2-w/2,y=r.top-h-10;
  if(y<8)y=r.bottom+10;
  popup.style.left=Math.max(8,Math.min(x,document.documentElement.clientWidth-w-8))+'px';
  popup.style.top=Math.max(8,Math.min(y,window.innerHeight-h-8))+'px';
 }
 function show(i){clearTimeout(timer);if(active!==null&&active!==i)buttons[active].setAttribute('aria-expanded','false');active=i;const p=collection[i];photo.src=p.src;photo.alt=p.caption;label.textContent=p.caption;popup.hidden=false;buttons[i].setAttribute('aria-expanded','true');place();}
 function deferHide(){if(!pinned)timer=setTimeout(hide,250);}
 positions.forEach(([x,y],i)=>{
  const button=document.createElement('button');button.type='button';button.className='map-marker';button.style.left=`clamp(20px, ${(x-crop.left)/cropWidth*100}%, calc(100% - 20px))`;button.style.top=`clamp(20px, ${(y-crop.top)/cropHeight*100}%, calc(100% - 20px))`;button.textContent=i+1;
  button.setAttribute('aria-label',collection[i].caption);button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',popup.id);
  button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){pinned=false;show(i);}});
  button.addEventListener('pointerleave',deferHide);
  button.addEventListener('focus',()=>show(i));
  button.addEventListener('blur',e=>{if(!popup.contains(e.relatedTarget))deferHide();});
  button.addEventListener('click',()=>{if(active===i&&pinned)hide();else{show(i);pinned=true;}});
  buttons.push(button);canvas.append(button);
 });
 photo.addEventListener('load',place);
 popup.addEventListener('pointerenter',()=>clearTimeout(timer));popup.addEventListener('pointerleave',deferHide);
 popup.addEventListener('focusin',()=>clearTimeout(timer));popup.addEventListener('focusout',e=>{if(!popup.contains(e.relatedTarget))hide();});
 close.addEventListener('click',()=>{const button=buttons[active];button?.focus();hide();});
 enlarge.addEventListener('click',()=>{const i=active;hide();if(i!==null)openPhoto(i,collection);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active!==null){const button=buttons[active];button.focus();hide();}});
 document.addEventListener('click',e=>{if(!popup.contains(e.target)&&!e.target.closest('.map-marker'))hide();});
 window.addEventListener('resize',hide);window.addEventListener('scroll',hide,{passive:true});viewport.addEventListener('scroll',hide,{passive:true});
})();
