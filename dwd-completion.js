/* DWD v4.4 menu, search and sharing corrections */
(()=>{'use strict';
const css=`
@keyframes dwdCardFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes dwdPhotoGlow{0%,100%{box-shadow:0 0 0 2px #e9b44c,0 12px 28px #00c8e855}50%{box-shadow:0 0 0 4px #00d9e8,0 12px 38px #e9b44c88}}
@keyframes dwdNameGlow{0%,100%{text-shadow:0 2px 0 #07506b,0 7px 0 #031326,0 12px 22px #00c8e888}50%{text-shadow:0 2px 0 #07506b,0 7px 0 #031326,0 12px 28px #e9b44c}}
.developer-hero{transform-style:preserve-3d;animation:dwdCardFloat 5s ease-in-out infinite;perspective:900px}
.developer-hero img{animation:dwdPhotoGlow 3.5s ease-in-out infinite;transform:translateZ(18px)}
.developer-name{animation:dwdNameGlow 3.2s ease-in-out infinite;transform:translateZ(24px)}
#dwdSearchPanel{display:none;position:absolute;right:12px;top:calc(100% + 6px);width:min(92vw,420px);padding:10px;background:#091b30;border:1px solid #31516e;border-radius:12px;box-shadow:0 10px 30px #0009;z-index:20}
#dwdSearchPanel.open{display:block}#dwdSearchPanel input{width:100%;background:white;color:#172536}
#dwdSearchResults{max-height:55vh;overflow:auto;margin-top:8px;color:white}#dwdSearchResults .card{color:var(--ink);background:var(--card)}
#menu .dwd-accordion-head{display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;margin:12px 0 0;background:#102d4a;color:#fff;border:1px solid #31516e}
#menu .dwd-accordion-head .dwd-chevron{transition:transform .2s}#menu .dwd-accordion-head[aria-expanded=true] .dwd-chevron{transform:rotate(180deg)}
#menu .dwd-accordion-body{display:none;padding:2px 0 8px 12px;border-left:2px solid #e9b44c;margin-left:7px}#menu .dwd-accordion-body.open{display:block}
@media(prefers-reduced-motion:reduce){.developer-hero,.developer-hero img,.developer-name{animation:none!important}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const header=document.querySelector('header');
if(header&&!document.getElementById('dwdSearchToggle')){
 const controls=document.createElement('div');controls.style.cssText='display:flex;align-items:center;gap:6px;position:relative';
 const toggle=document.createElement('button');toggle.id='dwdSearchToggle';toggle.type='button';toggle.title='সার্চ';toggle.setAttribute('aria-label','সার্চ');toggle.textContent='⌕';toggle.style.cssText='font-size:27px;padding:6px 10px';
 const panel=document.createElement('div');panel.id='dwdSearchPanel';panel.innerHTML='<input id="dwdGlobalSearch" type="search" placeholder="সব হিসাব, ব্যক্তি ও নোট খুঁজুন…" aria-label="সব তথ্য খুঁজুন"><div id="dwdSearchResults" role="region" aria-live="polite"></div>';
 controls.append(toggle,panel);header.appendChild(controls);toggle.addEventListener('click',()=>{panel.classList.toggle('open');if(panel.classList.contains('open'))panel.querySelector('input').focus()});
}
const nav=document.querySelector('#menu .drawer');
if(nav&&!nav.dataset.dwdAccordion){nav.dataset.dwdAccordion='1';[...nav.querySelectorAll('h3')].forEach(heading=>{const body=document.createElement('div');body.className='dwd-accordion-body';let n=heading.nextElementSibling;while(n&&n.tagName!=='H3'){const next=n.nextElementSibling;body.appendChild(n);n=next}const button=document.createElement('button');button.type='button';button.className='dwd-accordion-head';button.setAttribute('aria-expanded','false');button.innerHTML='<span>'+heading.textContent+'</span><span class="dwd-chevron">⌄</span>';button.addEventListener('click',()=>{const open=body.classList.toggle('open');button.setAttribute('aria-expanded',String(open))});heading.replaceWith(button);button.after(body)})}
const inp=document.getElementById('dwdGlobalSearch'),out=document.getElementById('dwdSearchResults');
function flatten(v,path,a){if(v==null)return;if(Array.isArray(v)){v.forEach((x,i)=>flatten(x,path+' '+(i+1),a));return}if(typeof v==='object'){Object.entries(v).forEach(([k,x])=>flatten(x,path+' '+k,a));return}const s=String(v).trim();if(s&&s!=='[object Object]'&&s.length<600)a.push({path,text:s})}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function search(q){if(!out)return;const term=q.trim().toLocaleLowerCase();if(term.length<2){out.innerHTML='';return}let rows=[];try{flatten(JSON.parse(localStorage.getItem('mpr_squad_daily_work_details_v1')||'{}'),'হিসাব',rows)}catch(e){}const found=rows.filter(x=>(x.path+' '+x.text).toLocaleLowerCase().includes(term)).slice(0,35);out.innerHTML='<b>খোঁজের ফলাফল: '+found.length+'</b>'+(found.length?found.map(x=>'<div class="card"><b>'+esc(x.path)+'</b><div>'+esc(x.text.slice(0,200))+'</div></div>').join(''):'<p>কোনো মিল পাওয়া যায়নি।</p>')}
inp?.addEventListener('input',()=>search(inp.value));
window.dwdShareAll=()=>{let data;try{data=JSON.stringify(JSON.parse(localStorage.getItem('mpr_squad_daily_work_details_v1')||'{}'),null,2)}catch(e){alert('তথ্য প্রস্তুত করা যায়নি');return}const title='MPR SQUAD DWD — হিসাবের ব্যাকআপ';if(window.AndroidBridge?.shareText){window.AndroidBridge.shareText(title,data);return}if(navigator.share)navigator.share({title,text:data}).catch(()=>{});else alert('এই ব্রাউজারে Share সুবিধা নেই')};
if(nav&&!nav.querySelector('.dwd-apk-share')){const b=document.createElement('button');b.className='dwd-apk-share';b.type='button';b.textContent='📲 সম্পূর্ণ অ্যাপ Share / অন্যকে পাঠান';b.addEventListener('click',()=>{if(window.AndroidBridge?.shareAppApk)window.AndroidBridge.shareAppApk();else alert('APK Share সুবিধা Android অ্যাপে ব্যবহার করুন।')});nav.appendChild(b)}
const backupCard=[...document.querySelectorAll('#backupScreen .card')].find(x=>x.textContent.includes('ব্যাকআপ'));if(backupCard&&!backupCard.querySelector('.dwd-share-btn')){const b=document.createElement('button');b.className='dwd-share-btn secondary';b.textContent='📤 হিসাবের ব্যাকআপ Share করুন';b.onclick=window.dwdShareAll;backupCard.appendChild(b)}

// Keep newly entered date-based records visible when they belong to an earlier month.
function dwdFollowEntryMonth(formId, monthId) {
 const form=document.getElementById(formId), month=document.getElementById(monthId);
 if(!form||!month||form.dataset.dwdMonthFollow==="1")return;
 form.dataset.dwdMonthFollow="1";
 form.addEventListener("submit",function(){
  const date=form.elements.date?.value;
  if(date&&/^\d{4}-\d{2}-\d{2}$/.test(date))month.value=date.slice(0,7);
 },true);
}
dwdFollowEntryMonth("dutyForm","dutyMonth");
dwdFollowEntryMonth("billForm","billMonth");
dwdFollowEntryMonth("personExpenseForm","personMonth");

// A dedicated all-month view prevents older bills from appearing to vanish.
const dwdBillMonth=document.getElementById("billMonth");
const dwdBillRows=document.getElementById("billRows");
const dwdBillOriginalRender=window.renderBills;
let dwdShowAllBills=false;
function dwdRenderAllBills(){
 const all=(db.bills||[]).slice().sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
 const total=all.reduce((s,x)=>s+billAmount(x),0);
 const paidTotal=all.reduce((s,x)=>s+paidAmount(x),0);
 const dueTotal=all.reduce((s,x)=>s+dueAmount(x),0);
 const fullyPaid=all.filter(x=>dueAmount(x)===0&&billAmount(x)>0);
 const unpaid=all.filter(x=>dueAmount(x)>0);
 document.getElementById("billTotal").innerHTML=stat("সকল মাসের মোট বিল",money(total))+stat("মোট বিলের সংখ্যা",all.length);
 document.getElementById("billPaymentSummary").innerHTML=stat("✓ পেয়েছি",money(paidTotal))+stat("✕ পাইনি",money(dueTotal))+stat("সম্পূর্ণ পরিশোধিত বিল",fullyPaid.length)+stat("বাকি / আংশিক বিল",unpaid.length);
 const filter=document.getElementById("billStatusFilter")?.value||"all";
 const shown=all.filter(x=>filter==="all"||(filter==="paid"?dueAmount(x)===0&&billAmount(x)>0:dueAmount(x)>0));
 dwdBillRows.innerHTML=shown.map(x=>{
  const i=db.bills.indexOf(x),sum=billAmount(x),paid=paidAmount(x),due=dueAmount(x),fully=due===0&&sum>0;
  return "<tr><td>"+esc(x.date||"—")+"</td><td>"+esc(x.place||"—")+"</td><td>"+esc(personLabel(x.personCode))+"</td><td>"+esc(x.goingTransport||x.transport||"—")+" · "+money(x.goingFare??x.travel)+" / "+esc(x.returnTransport||"—")+" · "+money(x.returnFare)+"</td><td>"+money(num(x.goingFare??x.travel)+num(x.returnFare))+"</td><td>"+money(x.food)+"</td><td>"+money(x.other)+"</td><td><b>"+money(sum)+"</b></td><td><b style='color:#15803d'>"+money(paid)+"</b></td><td><b style='color:"+(due>0?"#dc2626":"#15803d")+"'>"+money(due)+"</b></td><td><span class='payment-mark "+(fully?"paid":paid>0?"partial":"unpaid")+"'>"+(fully?"✓ পেয়েছি":"✕ পাইনি")+"</span><br><small>"+(x.paymentDate?"সর্বশেষ: "+esc(x.paymentDate):"")+"</small></td><td><button class='"+(fully?"secondary":"green")+"' onclick='"+(fully?"toggleBillPaid":"addBillPayment")+"("+i+")'>"+(fully?"বাকি করুন":"＋ পেমেন্ট যোগ")+"</button></td><td><button class='secondary' onclick='editBillRecord("+i+")'>✏️ এডিট</button> <button class='danger' onclick=\"del('bills',"+i+",renderBills)\">মুছুন</button></td></tr>";
 }).join("")||"<tr><td colspan='13' style='text-align:center;padding:18px'>কোনো বিলের রেকর্ড নেই।</td></tr>";
}
if(typeof dwdBillOriginalRender==="function"){
 window.renderBills=function(){if(dwdShowAllBills)dwdRenderAllBills();else dwdBillOriginalRender();};
}
if(dwdBillMonth&&dwdBillRows&&!document.getElementById("dwdAllBillsToggle")){
 const toggle=document.createElement("button");
 toggle.id="dwdAllBillsToggle";toggle.type="button";toggle.className="secondary";
 toggle.textContent="সব মাসের বিল দেখুন";toggle.style.marginLeft="8px";
 toggle.addEventListener("click",function(){
  dwdShowAllBills=!dwdShowAllBills;
  toggle.textContent=dwdShowAllBills?"নির্বাচিত মাসের বিল দেখুন":"সব মাসের বিল দেখুন";
  window.renderBills();
 });
 dwdBillMonth.parentElement.appendChild(toggle);
}

})();