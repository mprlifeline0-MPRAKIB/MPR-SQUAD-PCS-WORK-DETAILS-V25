/* DWD v4.4 completion patch: animated developer card, global offline search, native share */
(()=>{'use strict';
const css=`
@keyframes dwdCardFloat{0%,100%{transform:translateY(0) rotateX(0)}50%{transform:translateY(-7px) rotateX(1.2deg)}}
@keyframes dwdPhotoGlow{0%,100%{box-shadow:0 0 0 2px #e9b44c,0 12px 28px #00c8e855}50%{box-shadow:0 0 0 4px #00d9e8,0 12px 38px #e9b44c88}}
@keyframes dwdNameGlow{0%,100%{text-shadow:0 2px 0 #07506b,0 7px 0 #031326,0 12px 22px #00c8e888}50%{text-shadow:0 2px 0 #07506b,0 7px 0 #031326,0 12px 28px #e9b44c}}
.developer-hero{transform-style:preserve-3d;animation:dwdCardFloat 5s ease-in-out infinite;perspective:900px}
.developer-hero img{animation:dwdPhotoGlow 3.5s ease-in-out infinite;transform:translateZ(18px)}
.developer-name{animation:dwdNameGlow 3.2s ease-in-out infinite;transform:translateZ(24px)}
.dwd-search-wrap{padding:10px 14px;background:#091b30;border-bottom:1px solid #31516e;position:sticky;top:0;z-index:6}
.dwd-search-wrap input{max-width:1050px;display:block;margin:auto;background:#fff;color:#172536}
#dwdSearchResults{max-width:1050px;margin:10px auto;padding:12px;background:#10243c;border:1px solid #31516e;border-radius:12px;color:#fff;display:none}
#dwdSearchResults.show{display:block}
.dwd-search-result{display:block;width:100%;text-align:left;margin:6px 0;background:#193956;color:#fff}
@media(prefers-reduced-motion:reduce){.developer-hero,.developer-hero img,.developer-name{animation:none!important}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const header=document.querySelector('header');if(header&&!document.getElementById('dwdGlobalSearch')){const wrap=document.createElement('div');wrap.className='dwd-search-wrap';wrap.innerHTML='<input id="dwdGlobalSearch" type="search" placeholder="🔎 সব হিসাব, ব্যক্তি ও নোট খুঁজুন…" aria-label="সব তথ্য খুঁজুন"><div id="dwdSearchResults" role="region" aria-live="polite"></div>';header.insertAdjacentElement('afterend',wrap)}
const inp=document.getElementById('dwdGlobalSearch'),out=document.getElementById('dwdSearchResults');
function flatten(value,path,arr){if(value==null)return;if(Array.isArray(value)){value.forEach((v,i)=>flatten(v,path+' '+(i+1),arr));return}if(typeof value==='object'){Object.entries(value).forEach(([k,v])=>flatten(v,path+' '+k,arr));return}const s=String(value).trim();if(s&&s!=='[object Object]'&&s.length<600)arr.push({path,text:s})}
function search(q){if(!out)return;const term=q.trim().toLocaleLowerCase();if(term.length<2){out.classList.remove('show');out.innerHTML='';return}let rows=[];try{flatten(JSON.parse(localStorage.getItem('mpr_squad_daily_work_details_v1')||'{}'),'হিসাব',rows)}catch(e){}const found=rows.filter(x=>(x.path+' '+x.text).toLocaleLowerCase().includes(term)).slice(0,40);out.innerHTML='<b>খোঁজের ফলাফল: '+found.length+'</b>'+ (found.length?found.map(x=>'<div class="card"><b>'+esc(x.path)+'</b><div>'+esc(x.text.slice(0,220))+'</div></div>').join(''):'<p>কোনো মিল পাওয়া যায়নি। বানান পরিবর্তন করে চেষ্টা করুন।</p>');out.classList.add('show')}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
inp?.addEventListener('input',()=>search(inp.value));
document.addEventListener('click',e=>{if(out&&!out.contains(e.target)&&e.target!==inp)out.classList.remove('show')});
window.dwdShareAll=()=>{let data;try{data=JSON.stringify(JSON.parse(localStorage.getItem('mpr_squad_daily_work_details_v1')||'{}'),null,2)}catch(e){alert('তথ্য প্রস্তুত করা যায়নি');return}const title='MPR SQUAD DWD — হিসাবের ব্যাকআপ';if(window.AndroidBridge?.shareText){window.AndroidBridge.shareText(title,data);return}if(navigator.share){navigator.share({title,text:data}).catch(()=>{})}else if(navigator.clipboard){navigator.clipboard.writeText(data).then(()=>alert('ব্যাকআপের লেখা কপি হয়েছে')).catch(()=>alert('Share সুবিধা এই ব্রাউজারে নেই'))}else alert('Share সুবিধা এই ব্রাউজারে নেই')};
const backupCard=[...document.querySelectorAll('#backupScreen .card')].find(x=>x.textContent.includes('ব্যাকআপ'));if(backupCard&&!backupCard.querySelector('.dwd-share-btn')){const b=document.createElement('button');b.className='dwd-share-btn secondary';b.textContent='📤 সম্পূর্ণ হিসাব Share করুন';b.onclick=window.dwdShareAll;backupCard.querySelector('.row')?.appendChild(b)}
})();