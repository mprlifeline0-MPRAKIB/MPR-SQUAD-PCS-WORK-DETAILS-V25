#!/usr/bin/env python3
from pathlib import Path
ROOT = Path(".")
candidates = [ROOT / "MPR-SQUAD-PCS-v2.9-package/android/app/src/main/assets/index.html", ROOT / "android/app/src/main/assets/index.html"]
html = next((p for p in candidates if p.exists()), None)
if html is None:
    found = list(ROOT.glob("**/app/src/main/assets/index.html"))
    html = found[0] if found else None
if html is None:
    raise SystemExit("ERROR: Android app/src/main/assets/index.html not found.")
source = html.read_text(encoding="utf-8")
required = ["let db=", "function billAmount(", "function inMonth(", "function renderFolders(", "function save(", "personFolders"]
missing = [token for token in required if token not in source]
if missing:
    raise SystemExit("ERROR: DWD source schema changed; missing required hooks: " + ", ".join(missing))
if 'id="dwdTwoPersonSharePanel"' not in source:
    anchor = '<div id="personFolders" class="foldergrid"></div>'
    if source.count(anchor) != 1:
        raise SystemExit("ERROR: Expected one personFolders anchor; refusing unsafe HTML edit.")
    panel = '''<div class="card" id="dwdTwoPersonSharePanel">
    <h3>👥 দুই ব্যক্তির যৌথ খরচ বণ্টন (৫০:৫০)</h3>
    <p class="muted">মূল বিলের মোট খরচ থেকে নির্বাচিত দুই ব্যক্তির ব্যক্তিগত খরচ বাদ দিয়ে অবশিষ্ট টাকা সমান ভাগ হবে। মূল বিল ও ব্যক্তিগত খরচের রেকর্ড থেকেই হিসাব স্বয়ংক্রিয়ভাবে নেওয়া হয়।</p>
    <div class="formgrid">
      <div><label>হিসাবের মাস</label><input type="month" id="dwdShareMonth" onchange="renderTwoPersonShare()"></div>
      <div><label>ব্যক্তি ১</label><select id="dwdSharePersonA" onchange="setTwoPersonPerson('a',this.value)"></select></div>
      <div><label>ব্যক্তি ২</label><select id="dwdSharePersonB" onchange="setTwoPersonPerson('b',this.value)"></select></div>
    </div>
    <div id="dwdShareSummary" class="totalgrid" style="margin-top:12px"></div>
    <p class="muted" id="dwdShareFormula" style="margin-top:10px"></p>
  </div>
  '''
    source = source.replace(anchor, panel + anchor, 1)
marker = "/* DWD_TWO_PERSON_SHARED_EXPENSE_INTEGRATION_V1 */"
if marker not in source:
    close = source.rfind("</script>")
    if close < 0:
        raise SystemExit("ERROR: Main application script closing tag not found.")
    js = r'''/* DWD_TWO_PERSON_SHARED_EXPENSE_INTEGRATION_V1 */
function dwdShareMonth(){return $("dwdShareMonth")?.value||today().slice(0,7)}
function dwdShareSettings(){db.settings=db.settings||{};db.settings.twoPersonShare=db.settings.twoPersonShare||{};return db.settings.twoPersonShare}
function refreshTwoPersonOptions(){
  const a=$("dwdSharePersonA"),b=$("dwdSharePersonB");if(!a||!b)return;
  const cfg=dwdShareSettings(),people=db.people||[];
  if(!cfg.a||!people.some(p=>p.code===cfg.a))cfg.a=people[0]?.code||"";
  if(!cfg.b||!people.some(p=>p.code===cfg.b)||cfg.b===cfg.a)cfg.b=people.find(p=>p.code!==cfg.a)?.code||"";
  const options='<option value="">ব্যক্তি নির্বাচন করুন</option>'+people.map(p=>'<option value="'+esc(p.code)+'">'+esc(p.name)+' ('+esc(p.code)+')</option>').join("");
  a.innerHTML=options;b.innerHTML=options;a.value=cfg.a;b.value=cfg.b;
  if($("dwdShareMonth")&&!$("dwdShareMonth").value)$("dwdShareMonth").value=today().slice(0,7);
  renderTwoPersonShare();
}
function setTwoPersonPerson(slot,value){
  const cfg=dwdShareSettings();
  if(value&&((slot==="a"&&value===cfg.b)||(slot==="b"&&value===cfg.a))){alert("একই ব্যক্তিকে দুইবার নির্বাচন করা যাবে না।");refreshTwoPersonOptions();return;}
  cfg[slot]=value;save();refreshTwoPersonOptions();
}
function dwdPersonExpenseTotal(person,month){
  return (person?.records||[]).filter(r=>inMonth(r.date,month)).reduce((sum,r)=>sum+num(r.travel)+num(r.food)+num(r.other),0);
}
function renderTwoPersonShare(){
  const out=$("dwdShareSummary"),formula=$("dwdShareFormula");if(!out||!formula)return;
  const month=dwdShareMonth(),cfg=dwdShareSettings(),people=db.people||[];
  const p1=people.find(p=>p.code===cfg.a),p2=people.find(p=>p.code===cfg.b);
  if(!p1||!p2||p1.code===p2.code){out.innerHTML='<div class="stat"><b>দুইজনের হিসাব চালু করতে</b><span>আগে ব্যক্তির ফোল্ডার থেকে দুইজনের নাম ও ID তৈরি করুন, তারপর এখানে দুজনকে নির্বাচন করুন।</span></div>';formula.textContent="";return;}
  const bills=(db.bills||[]).filter(b=>inMonth(b.date,month));
  const total=bills.reduce((sum,b)=>sum+billAmount(b),0);
  const a=dwdPersonExpenseTotal(p1,month),b=dwdPersonExpenseTotal(p2,month),personal=a+b,joint=total-personal;
  if(!Number.isFinite(total)||!Number.isFinite(a)||!Number.isFinite(b)||total<0||a<0||b<0){
    formula.textContent="সতর্কতা: বিল বা ব্যক্তিগত খরচের রেকর্ডে অবৈধ সংখ্যা রয়েছে। হিসাব যাচাই করুন।";out.innerHTML="";return;
  }
  if(joint < -0.005){
    out.innerHTML=stat("মোট বিল / খরচ",money(total))+stat(p1.name+" ব্যক্তিগত খরচ",money(a))+stat(p2.name+" ব্যক্তিগত খরচ",money(b))+stat("ব্যক্তিগত খরচের যোগফল",money(personal));
    formula.textContent="সতর্কতা: দুই ব্যক্তির ব্যক্তিগত খরচের যোগফল মূল বিলের মোট খরচের চেয়ে বেশি। মূল বিলের রেকর্ড যাচাই না করা পর্যন্ত ৫০:৫০ ভাগ দেখানো হচ্ছে না।";return;
  }
  const cents=n=>Math.round((n+Number.EPSILON)*100);
  const totalC=cents(total),aC=cents(a),bC=cents(b),sharedC=totalC-aC-bC;
  const shared=sharedC/100,halfC=Math.floor(sharedC/2),half=halfC/100,odd=sharedC%2;
  const share1C=aC+halfC+odd,share2C=bC+halfC,share1=share1C/100,share2=share2C/100;
  out.innerHTML=stat("মোট খরচ (বিল)",money(total))+stat("ব্যক্তি ১-এর ব্যক্তিগত খরচ",money(a))+stat("ব্যক্তি ২-এর ব্যক্তিগত খরচ",money(b))+stat("বাদ দেওয়ার পর যৌথ খরচ",money(shared))+stat(p1.name+"-এর মোট অংশ",money(share1))+stat(p2.name+"-এর মোট অংশ",money(share2));
  formula.textContent="হিসাব: "+money(total)+" − "+money(a)+" − "+money(b)+" = "+money(shared)+" যৌথ খরচ। পয়সার অঙ্ক বিজোড় হলে ১ পয়সা ব্যক্তি ১-এর অংশে যোগ হবে। "+p1.name+" = "+money(a)+" + "+money(share1-a)+" = "+money(share1)+"; "+p2.name+" = "+money(b)+" + "+money(share2-b)+" = "+money(share2)+". যাচাই: দুইজনের অংশের যোগফল "+money(share1+share2)+"।";
}
const dwdOriginalSave=save;
save=function(){const ok=dwdOriginalSave();if(ok)renderTwoPersonShare();return ok;};
const dwdOriginalRenderFolders=renderFolders;
renderFolders=function(){dwdOriginalRenderFolders();refreshTwoPersonOptions();};
refreshTwoPersonOptions();
'''
    source = source[:close] + js + "\n" + source[close:]
html.write_text(source, encoding="utf-8")
print("Integrated live 50:50 expense allocation into", html)
