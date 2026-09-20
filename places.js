// Explicit local albums; original files remain unchanged.
const placeAlbums={
  "kren": [
    "img/kren/Kreenholm+area_Sven+Zacek.jpg",
    "img/kren/20 (1).JPG",
    "img/kren/1941-1944.jpg",
    "img/kren/20260914_172003.jpg",
    "img/kren/1000096415.jpg",
    "img/kren/1000096421.jpg",
    "img/kren/111111111111111111111.jpg",
    "img/kren/dsc064432375-768x512.jpg",
    "img/kren/IMG_5831.JPG",
    "img/kren/IMG_5841.JPG",
    "img/kren/installatsioon-1-scaled.jpg",
    "img/kren/kreenholm-used-to-be-the-biggest-textile-factory-in-europe-v0-g5ygw3xv4c0a1.jpg",
    "img/kren/Oised-kunstituurid-Kreenholmis.-Photo-by-lja-Smirnov.-Valik-2-1440x600.jpg",
    "img/kren/Константин Пятс на Кренгольме, 1934.png",
    "img/kren/Пленные красноармейцы, 1919.png"
  ],
  "tur": [
    "img/tur/Oised-kunstituurid-Kreenholmis.-Photo-by-lja-Smirnov.-Valik-2-1440x600 (1).jpg",
    "img/tur/installatsioon-1-scaled (1).jpg",
    "img/tur/kreenholm-used-to-be-the-biggest-textile-factory-in-europe-v0-g5ygw3xv4c0a1 (1).jpg",
    "img/tur/Kreenholm+area_Sven+Zacek (1).jpg"
  ]
};

(() => {
 const cards=document.querySelectorAll('.heritage-places>div');
 if(cards.length!==3)return;
 const lang=document.documentElement.lang;
 const labels=({ru:{open:'Открыть фотографии',photo:'Фото',tourism:'Туризм'},et:{open:'Ava fotod',photo:'Foto',tourism:'Turism'},en:{open:'Open photos',photo:'Photo',tourism:'Tourism'}})[lang];
 const panel=document.createElement('section');panel.className='place-category';panel.id='place-category';panel.hidden=true;
 const heading=document.createElement('h3');heading.id='place-category-title';panel.setAttribute('aria-labelledby',heading.id);
 const thumbnails=document.createElement('div');thumbnails.className='place-category-grid';panel.append(heading,thumbnails);cards[0].parentElement.after(panel);
 let selected=null;const triggers=[];
 for(const [folder,index,title] of [['kren',1,'Kreenholm'],['tur',2,labels.tourism]]){
  const sources=placeAlbums[folder];
  const album=sources.map((src,i)=>({src,caption:title+' — '+labels.photo+' '+(i+1)}));
  const button=document.createElement('button');button.type='button';button.className='heritage-album';button.setAttribute('aria-label',labels.open+': '+title);button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',panel.id);triggers.push(button);
  const photo=document.createElement('img');photo.src=sources[0];photo.alt=title;photo.loading='lazy';photo.decoding='async';
  const count=document.createElement('span');count.className='heritage-album-count';count.textContent=sources.length+' '+({ru:'фото',et:'fotot',en:'photos'})[lang];
  button.append(photo,count);cards[index].append(button);
  button.addEventListener('click',()=>{
   const collapse=selected===folder&&!panel.hidden;triggers.forEach(trigger=>trigger.setAttribute('aria-expanded','false'));
   panel.hidden=collapse;selected=collapse?null:folder;if(collapse)return;
   button.setAttribute('aria-expanded','true');heading.textContent=title;thumbnails.replaceChildren();
   album.forEach((item,i)=>{
    const thumb=document.createElement('button');thumb.type='button';thumb.className='place-category-photo';thumb.setAttribute('aria-label',item.caption);thumb.setAttribute('aria-haspopup','dialog');
    const image=document.createElement('img');image.src=item.src;image.alt=item.caption;image.loading='lazy';image.decoding='async';thumb.append(image);
    thumb.addEventListener('click',()=>{box.classList.add('place-album');openPhoto(i,album);});thumbnails.append(thumb);
   });
  });
 }
 box.addEventListener('close',()=>box.classList.remove('place-album'));
})();
