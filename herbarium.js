/* Pocket Herbarium — deterministic imaginary plants, no dependencies. */
function hashSeed(text){let h=2166136261;for(const c of text){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function randomFrom(seed){let h=hashSeed(seed);return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const escapeXML=t=>String(t).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
function growSpecimen(input){
 const seed=String(input).trim().slice(0,80)||'moon garden',random=randomFrom(seed);
 const pick=a=>a[Math.floor(random()*a.length)];
 const name=pick(['Lunar','Velvet','Rain','Paper','Cloud','Amber','Whisper'])+' '+pick(['fern','bell','sprout','lantern','clover','star','willow']);
 const ink=pick(['#607b58','#537268','#778354']),petal=pick(['#cda174','#b4a4bb','#d8bb74','#bf8e7b']);
 const habit=pick(['Opens only when a window is quiet.','Keeps a little rain inside each leaf.','Turns toward unfinished questions.','Blooms where a melody has been planted.','Grows one new thought every morning.']);
 let branches='';const count=3+Math.floor(random()*3);
 for(let i=0;i<count;i++){
  const tipX=150+i*270/(count-1)+(random()-.5)*45,tipY=115+random()*140,baseX=280+(random()-.5)*65;
  branches+=`<path d="M${baseX} 455 Q${baseX-25} 300 ${tipX} ${tipY}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  for(let j=1;j<=4;j++){const t=j/5,y=455+(tipY-455)*t,x=baseX+(tipX-baseX)*t,side=j%2?1:-1,s=20+random()*18;branches+=`<path d="M${x} ${y} Q${x+side*s*1.6} ${y-5} ${x+side*s} ${y-s} Q${x} ${y-s} ${x} ${y}" fill="${ink}" opacity="${.6+random()*.35}"/>`;}
  const petals=4+Math.floor(random()*4),size=10+random()*9;
  for(let j=0;j<petals;j++){const a=j*Math.PI*2/petals;branches+=`<ellipse cx="${tipX+Math.cos(a)*size*.65}" cy="${tipY+Math.sin(a)*size*.65}" rx="${size*.65}" ry="${size}" transform="rotate(${j*360/petals+90} ${tipX+Math.cos(a)*size*.65} ${tipY+Math.sin(a)*size*.65})" fill="${petal}" opacity=".85"/>`;}
  branches+=`<circle cx="${tipX}" cy="${tipY}" r="6" fill="#f6df9a"/>`;
 }
 const number=String(hashSeed(seed)%100000).padStart(5,'0');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="640" viewBox="0 0 600 640" role="img" aria-labelledby="title desc"><title id="title">${escapeXML(name)}</title><desc id="desc">An imaginary botanical specimen grown from ${escapeXML(seed)}. ${escapeXML(habit)}</desc><rect width="600" height="640" fill="#faf7ed"/><rect x="26" y="26" width="548" height="588" fill="none" stroke="#e0deca"/><circle cx="300" cy="270" r="176" fill="#e8ecda"/><path d="M85 460H515" stroke="#c5cdb5"/>${branches}<g fill="#57694d" font-family="Georgia,serif" text-anchor="middle"><text x="300" y="517" font-size="30">${escapeXML(name)}</text><text x="300" y="548" font-size="12" fill="#8a947a">${escapeXML(habit)}</text></g><g fill="#99a089" font-family="monospace" font-size="9"><text x="47" y="60">MIMO'S POCKET HERBARIUM</text><text x="450" y="60">No. ${number}</text><text x="47" y="589">SEED: ${escapeXML(seed.slice(0,40))}</text><text x="470" y="589">IMAGINARY</text></g></svg>`;
 return{seed,name,habit,svg,number};
}
if(typeof module!=='undefined')module.exports={growSpecimen};
if(typeof document!=='undefined'){
 const input=document.querySelector('#seed'),holder=document.querySelector('#specimen'),note=document.querySelector('#note');let specimen;
 function render(){specimen=growSpecimen(input.value);input.value=specimen.seed;holder.innerHTML=specimen.svg;try{localStorage.setItem('mimo-herbarium-seed',specimen.seed);}catch{}note.textContent='The same seed always grows the same plant. Nothing leaves your device.';}
 try{input.value=localStorage.getItem('mimo-herbarium-seed')||input.value;}catch{}
 document.querySelector('#grow-form').addEventListener('submit',e=>{e.preventDefault();render();});
 document.querySelector('#wander').addEventListener('click',()=>{const words=['window','moon','rain','quiet','fern','cloud','morning','moss'];const bits=new Uint32Array(2);crypto.getRandomValues(bits);input.value=words[bits[0]%words.length]+' '+words[bits[1]%words.length]+' '+(bits[1]%1000);render();});
 document.querySelector('#save').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([specimen.svg],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download='mimo-specimen-'+specimen.number+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);note.textContent='Your specimen is ready to keep. Grow another whenever curiosity calls.';});
 render();
}
