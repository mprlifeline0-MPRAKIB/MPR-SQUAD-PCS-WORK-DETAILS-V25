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


// Restrict transport presets and allow a real custom transport name.
function dwdTransportFields(formId){
 const form=document.getElementById(formId);if(!form||form.dataset.dwdTransport==="1")return;
 form.dataset.dwdTransport="1";
 ["goingTransport","returnTransport"].forEach(name=>{
  const sel=form.elements[name];if(!sel)return;
  const promptText=sel.options[0]?.textContent||"পরিবহন নির্বাচন করুন";
  sel.innerHTML="";
  const first=new Option(promptText,"");sel.add(first);
  [["রিকশা","🛺 রিকশা"],["CNG","🚕 CNG"],["মোটরসাইকেল","🏍️ মোটরসাইকেল"],["প্রাইভেট কার","🚘 প্রাইভেট কার"],["অন্যান্য","✍️ অন্যান্য"]].forEach(([v,t])=>sel.add(new Option(t,v)));
  const custom=document.createElement("input");custom.type="text";custom.className="dwd-transport-custom";custom.placeholder="অন্যান্য পরিবহনের নাম লিখুন";custom.hidden=true;custom.style.marginTop="7px";
  sel.insertAdjacentElement("afterend",custom);
  const update=()=>{custom.hidden=sel.value!=="অন্যান্য";if(!custom.hidden)custom.focus()};
  sel.addEventListener("change",update);
  form.addEventListener("submit",e=>{
   if(sel.value==="অন্যান্য"){
    const value=custom.value.trim();
    if(!value){e.preventDefault();e.stopImmediatePropagation();alert("অন্যান্য পরিবহনের নাম লিখুন।");custom.focus();return;}
    const option=new Option(value,value);sel.add(option);sel.value=value;
   }
  },true);
 });
}
dwdTransportFields("billForm");
dwdTransportFields("personExpenseForm");

// Add proper edit forms for duty, personal-expense, salary/mobile-bill/bonus and custom records.
const dwdEditorFields={
 duties:[["date","তারিখ","date"],["status","অবস্থা","select:ডিউটি|ডে অফ"],["start","শুরুর সময়","time"],["end","শেষের সময়","time"],["place","কাজের স্থান","text"],["personCode","সংশ্লিষ্ট ব্যক্তি","person"]],
 person:[["date","তারিখ","date"],["time","সময়","time"],["place","স্থান","text"],["goingTransport","যাওয়ার মাধ্যম","transport"],["goingFare","যাওয়ার ভাড়া","number"],["returnTransport","আসার মাধ্যম","transport"],["returnFare","আসার ভাড়া","number"],["foodTime","খাবারের সময়","select:দিন|রাত"],["food","খাবার খরচ","number"],["other","অন্যান্য খরচ","number"],["reason","খরচের কারণ","text"],["details","বিস্তারিত","textarea"],["payerCode","কে টাকা দিয়েছেন","person"],["receivedStatus","পাওয়ার অবস্থা","select:পেয়েছি|পাইনি"],["note","মন্তব্য","textarea"]],
 pay:[["date","তারিখ","date"],["type","ধরন","select:বেতন|মোবাইল বিল|বোনাস"],["amount","টাকার পরিমাণ","number"],["place","কাজের স্থান","text"],["personCode","সংশ্লিষ্ট ব্যক্তি","person"],["receivedStatus","টাকা পাওয়ার অবস্থা","select:পেয়েছি|পাইনি"],["note","মন্তব্য","textarea"]],
 custom:[["title","ক্যাটাগরি / শিরোনাম","text"],["date","তারিখ","date"],["place","কাজের স্থান","text"],["personCode","সংশ্লিষ্ট ব্যক্তি","person"],["details","বিস্তারিত তথ্য","textarea"]]
};
function dwdEditorSelect(field,value){
 let options=[];
 if(field==="person")options=(db.people||[]).map(p=>[p.code,p.name+" ("+p.code+")"]);
 else if(field.startsWith("select:"))options=field.slice(7).split("|").map(x=>[x,x]);
 else if(field==="transport")options=["রিকশা","CNG","মোটরসাইকেল","প্রাইভেট কার","অন্যান্য"].map(x=>[x,x]);
 if(value&&!options.some(x=>x[0]===String(value)))options.push([String(value),String(value)]);
 return '<select name="field" class="dwd-edit-input"><option value="">— নির্বাচন করুন —</option>'+options.map(x=>'<option value="'+esc(x[0])+'" '+(String(value??"")===x[0]?"selected":"")+'>'+esc(x[1])+'</option>').join("")+'</select>';
}
function dwdOpenEditor(group,index){
 const personRecord=group==="person";
 const target=personRecord?db.people[activePerson]?.records?.[index]:db[group]?.[index];
 if(!target)return;
 const defs=dwdEditorFields[group];if(!defs)return;
 const overlay=document.createElement("div");overlay.id="dwdRecordEditor";
 overlay.style.cssText="position:fixed;inset:0;background:#0009;z-index:9999;display:flex;align-items:center;justify-content:center;padding:12px";
 const form=document.createElement("form");form.style.cssText="background:#fff;color:#172536;border-radius:16px;padding:16px;width:min(560px,100%);max-height:90vh;overflow:auto;box-shadow:0 18px 60px #0007";
 form.innerHTML='<h3 style="margin:0 0 12px">হিসাব সম্পাদনা করুন</h3><div class="dwd-edit-grid"></div><div style="display:flex;gap:8px;margin-top:14px"><button type="submit" class="green">পরিবর্তন সংরক্ষণ</button><button type="button" class="secondary" id="dwdEditCancel">বাতিল</button></div>';
 const grid=form.querySelector(".dwd-edit-grid");grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px";
 defs.forEach(([key,label,type])=>{
  const wrap=document.createElement("label");wrap.style.cssText="display:block;color:#334155;font-size:13px";
  let input;
  if(type==="person"||type==="transport"||type.startsWith("select:")){wrap.innerHTML=label;input=document.createElement("span");input.innerHTML=dwdEditorSelect(type,target[key]);wrap.appendChild(input.firstElementChild);input=wrap.lastElementChild;input.name=key;}
  else {wrap.textContent=label;input=type==="textarea"?document.createElement("textarea"):document.createElement("input");input.name=key;input.type=type==="textarea"?"":type;input.value=target[key]??"";input.style.cssText="display:block;width:100%;padding:9px;border:1px solid #cbd5e1;border-radius:8px;color:#172536;background:#fff";if(type==="textarea")input.rows=2;wrap.appendChild(input);}
  grid.appendChild(wrap);
 });
 overlay.appendChild(form);document.body.appendChild(overlay);
 const close=()=>overlay.remove();form.querySelector("#dwdEditCancel").onclick=close;
 overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
 form.addEventListener("submit",e=>{
  e.preventDefault();const data=new FormData(form);
  defs.forEach(([key,,type])=>{const v=data.get(key);target[key]=(type==="number"?(Number(v)||0):(v??""));});
  if(save()){close();if(group==="person")renderPerson();else if(group==="duties")renderDuty();else if(group==="pay")renderPay();else renderCustom();}
 });
}
window.editDutyRecord=i=>dwdOpenEditor("duties",i);
window.editPersonRecord=i=>dwdOpenEditor("person",i);
window.editPayRecord=i=>dwdOpenEditor("pay",i);
window.editCustomRecord=i=>dwdOpenEditor("custom",i);
function dwdAddRowEditButtons(containerId,deletePattern,handlerName){
 const box=document.getElementById(containerId);if(!box)return;
 box.querySelectorAll("tr").forEach(row=>{
  const delButton=[...row.querySelectorAll("button")].find(b=>deletePattern.test(b.getAttribute("onclick")||""));
  if(!delButton||row.querySelector(".dwd-edit-record"))return;
  const match=(delButton.getAttribute("onclick")||"").match(/\d+/);if(!match)return;
  const b=document.createElement("button");b.type="button";b.className="secondary dwd-edit-record";b.textContent="✏️ সম্পাদনা";b.style.marginRight="5px";b.onclick=()=>window[handlerName](Number(match[0]));delButton.parentElement.insertBefore(b,delButton);
 });
}
function dwdAddCardEditButtons(containerId,pattern,handlerName){
 const box=document.getElementById(containerId);if(!box)return;
 box.querySelectorAll(".card").forEach(card=>{
  const delButton=[...card.querySelectorAll("button")].find(b=>pattern.test(b.getAttribute("onclick")||""));
  if(!delButton||card.querySelector(".dwd-edit-record"))return;
  const match=(delButton.getAttribute("onclick")||"").match(/\d+/);if(!match)return;
  const b=document.createElement("button");b.type="button";b.className="secondary dwd-edit-record";b.textContent="✏️ সম্পাদনা";b.style.marginRight="5px";b.onclick=()=>window[handlerName](Number(match[0]));delButton.parentElement.insertBefore(b,delButton);
 });
}
for(const [name,after] of [["renderDuty",()=>dwdAddRowEditButtons("dutyRows",/del\('duties'/,"editDutyRecord")],["renderPerson",()=>dwdAddRowEditButtons("personRows",/delPersonRecord/,"editPersonRecord")],["renderPay",()=>dwdAddCardEditButtons("payRows",/togglePayReceived/,"editPayRecord")],["renderCustom",()=>dwdAddCardEditButtons("customRows",/del\('custom'/,"editCustomRecord")]]){
 const original=window[name];if(typeof original==="function")window[name]=function(...args){const result=original.apply(this,args);after();return result;};
}


/* Screenshot-driven contrast and mobile-table repair */
(function dwdVisualRepair(){
 const style=document.createElement("style");
 style.id="dwd-visual-repair";
 style.textContent=`
  table tbody tr, table tbody td, table tbody th,
  #dutyRows tr, #dutyRows td, #dutyRows th,
  #billRows tr, #billRows td, #billRows th,
  #personRows tr, #personRows td, #personRows th,
  #payRows tr, #payRows td, #payRows th,
  #customRows tr, #customRows td, #customRows th {
    background-color:#15324d !important;color:#f4f8ff !important;
    border-color:#355675 !important;opacity:1 !important;
  }
  table thead th {background:#214664 !important;color:#fff !important;}
  .dwd-table-scroll {display:block;max-width:100%;overflow-x:auto;overflow-y:hidden;
    -webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;border-radius:12px;}
  .dwd-table-scroll table {min-width:640px;width:max-content;max-width:none;border-collapse:separate;border-spacing:0;}
  .dwd-table-scroll td,.dwd-table-scroll th {white-space:nowrap;}
  @media(max-width:480px){.dwd-table-scroll table{min-width:680px;}
    .dwd-table-scroll td,.dwd-table-scroll th{padding:10px 8px !important;font-size:13px !important;}}
 `;
 document.head.appendChild(style);
 function repairTables(){
  document.querySelectorAll("table").forEach(table=>{
   if(table.closest(".dwd-table-scroll"))return;
   const parent=table.parentElement;if(!parent)return;
   const wrap=document.createElement("div");wrap.className="dwd-table-scroll";
   parent.insertBefore(wrap,table);wrap.appendChild(table);
  });
 }
 function removeAccidentalSlashN(){
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const remove=[];let node;
  while((node=walker.nextNode()))if(node.nodeValue.trim()==="\\n")remove.push(node);
  remove.forEach(n=>n.remove());
 }
 repairTables();removeAccidentalSlashN();
})();

/* DWD v4.4.1: strict, rollback-safe JSON restore */
(function dwdHardenRestore(){
 const validList=(v)=>Array.isArray(v)&&v.every(x=>x&&typeof x==="object"&&!Array.isArray(x));
 window.restore=function(e){
  const input=e?.target, file=input?.files?.[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
   let incoming;
   try{
    incoming=JSON.parse(String(reader.result||""));
    const required=["duties","people","bills","pay","custom"];
    if(!incoming||typeof incoming!=="object"||Array.isArray(incoming)||
       !required.every(k=>validList(incoming[k]))||
       (incoming.stockNotes!==undefined&&!validList(incoming.stockNotes))||
       (incoming.people||[]).some(p=>p.records!==undefined&&!validList(p.records))||
       (incoming.bills||[]).some(b=>["goingFare","travel","returnFare","food","other","amountPaid"].some(k=>b[k]!==undefined&&(!Number.isFinite(Number(b[k]))||Number(b[k])<0))))
      throw new Error("invalid backup");
   }catch(err){alert("ব্যাকআপ ফাইলটি অসম্পূর্ণ বা সঠিক DWD JSON নয়। বর্তমান তথ্য অপরিবর্তিত রাখা হয়েছে।");if(input)input.value="";return;}
   if(!confirm("বর্তমান ডেটা প্রতিস্থাপন করে যাচাইকৃত ব্যাকআপ ফিরিয়ে আনবেন?")){if(input)input.value="";return;}
   const previous=db,previousRaw=localStorage.getItem("mpr_squad_daily_work_details_v1");
   db=incoming;
   const saved=save();
   if(!saved){
    db=previous;
    try{if(previousRaw===null)localStorage.removeItem("mpr_squad_daily_work_details_v1");else localStorage.setItem("mpr_squad_daily_work_details_v1",previousRaw);}catch(_){}
    alert("ব্যাকআপ সংরক্ষণ করা যায়নি। আগের তথ্য ফিরিয়ে রাখা হয়েছে।");
    if(input)input.value="";
    return;
   }
   alert("ব্যাকআপ সফলভাবে রিস্টোর হয়েছে।");
   if(input)input.value="";
   goHome();
  };
  reader.onerror=()=>{alert("ব্যাকআপ ফাইল পড়া যায়নি।");if(input)input.value="";};
  reader.readAsText(file);
 };
})();

})();


/* DWD v4.4.2: restore document-level vertical scrolling in Android WebView */
(function dwdMobileScrollRepair(){
 const style=document.createElement('style');
 style.id='dwd-mobile-scroll-repair';
 style.textContent=`
  html{height:auto!important;min-height:100%!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior-y:auto!important;touch-action:pan-y!important}
  body{height:auto!important;min-height:100dvh!important;overflow-x:hidden!important;overflow-y:visible!important;position:relative!important;touch-action:pan-y!important}
  body>main,main{height:auto!important;min-height:calc(100dvh - 64px)!important;max-height:none!important;overflow:visible!important;touch-action:pan-y!important}
  .screen,.screen.active{height:auto!important;min-height:calc(100dvh - 64px)!important;max-height:none!important;overflow:visible!important;touch-action:pan-y!important}
  .card,.formgrid,.grid,.foldergrid{max-height:none}
  .menu.open .drawer{height:100dvh!important;max-height:100dvh!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important}
  input,textarea,select,button{touch-action:manipulation}
 `;
 document.head.appendChild(style);
 const normalize=()=>{document.documentElement.style.overflowY='auto';document.body.style.overflowY='visible';};
 normalize();
 document.addEventListener('visibilitychange',normalize,{passive:true});
 document.addEventListener('click',e=>{if(e.target.closest('button,[onclick]'))setTimeout(normalize,0)},{passive:true});
})();



/* DWD responsive layout hardening: narrow phones, tablets and landscape */
(function dwdResponsiveHardening(){
 if(document.getElementById('dwd-responsive-hardening'))return;
 const style=document.createElement('style');
 style.id='dwd-responsive-hardening';
 style.textContent=`
  *,*::before,*::after{box-sizing:border-box}
  html{width:100%;max-width:100%;-webkit-text-size-adjust:100%;text-size-adjust:100%}
  body{width:100%;max-width:100%;margin:0!important;overflow-x:hidden!important}
  main{width:100%;max-width:1050px;margin-inline:auto;padding-inline:clamp(10px,3vw,18px)!important}
  .screen,.card,.grid,.row,.formgrid{min-width:0;max-width:100%}
  .grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .row{flex-wrap:wrap}
  img,svg,video,canvas{max-width:100%;height:auto}
  input,select,textarea{max-width:100%;min-width:0}
  button{max-width:100%;white-space:normal;overflow-wrap:anywhere}
  table{max-width:none}
  .dwd-table-scroll{width:100%;max-width:100%;overflow-x:auto;overflow-y:hidden;touch-action:pan-x pan-y;-webkit-overflow-scrolling:touch}
  @media(max-width:600px){
   main{padding:10px 10px calc(30px + env(safe-area-inset-bottom))!important}
   .grid{grid-template-columns:minmax(0,1fr)!important;gap:9px}
   .card{padding:12px;margin:9px 0;border-radius:13px}
   .row{gap:7px}
   .row>*{min-width:0;max-width:100%}
   .formgrid{grid-template-columns:minmax(0,1fr)!important}
   input:not([type=checkbox]):not([type=radio]),select,textarea{width:100%;min-height:42px;font-size:16px}
   button{min-height:40px}
   h1{font-size:clamp(21px,6vw,30px)}
   h2{font-size:clamp(18px,5vw,24px)}
   .dwd-table-scroll table{min-width:680px}
   #menu .drawer{width:min(88vw,340px);max-width:88vw}
  }
  @media(max-width:380px){
   main{padding-inline:8px!important}
   .card{padding:10px}
   .grid{gap:7px}
   .dwd-table-scroll table{min-width:640px}
   button{font-size:14px}
  }
  @media(orientation:landscape) and (max-height:500px){
   .screen{min-height:auto!important}
   #menu .drawer{max-height:100dvh;overflow-y:auto}
  }
  @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
 `;
 document.head.appendChild(style);
})();

/* DWD stability: deterministic Android Back navigation */
(function dwdAndroidBackNavigation(){
  if (window.__dwdBackHandlerInstalled) return;
  window.__dwdBackHandlerInstalled = true;
  window.appBackFromAndroid = function(){
    const menu = document.getElementById("menu");
    if (menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
      return true;
    }
    const searchPanel = document.getElementById("dwdSearchPanel");
    if (searchPanel && searchPanel.classList.contains("open")) {
      searchPanel.classList.remove("open");
      return true;
    }
    const visibleDialog = [...document.querySelectorAll("dialog[open],.modal.open,.modal.show,[role='dialog'].open")]
      .filter(el => el.getClientRects().length);
    if (visibleDialog.length) {
      const dialog = visibleDialog[visibleDialog.length - 1];
      if (typeof dialog.close === "function" && dialog.tagName === "DIALOG") dialog.close();
      else {
        dialog.classList.remove("open","show");
        dialog.setAttribute("aria-hidden","true");
      }
      return true;
    }
    const active = document.querySelector(".screen.active");
    if (active && active.id !== "homeScreen") {
      if (typeof window.goHome === "function") window.goHome();
      else {
        const home = document.getElementById("homeScreen");
        if (home) {
          document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s === home));
          home.scrollIntoView({block:"start"});
        }
      }
      return true;
    }
    return false;
  };
})();
