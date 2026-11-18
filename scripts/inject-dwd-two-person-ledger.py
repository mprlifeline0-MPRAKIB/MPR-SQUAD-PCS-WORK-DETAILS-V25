#!/usr/bin/env python3
from pathlib import Path
import shutil
root=Path(".")
candidates=[root/"MPR-SQUAD-PCS-v2.9-package/android/app/src/main/assets/index.html",root/"android/app/src/main/assets/index.html"]
html=next((p for p in candidates if p.exists()),None)
if html is None:
    matches=list(root.glob("**/app/src/main/assets/index.html"))
    html=matches[0] if matches else None
if html is None: raise SystemExit("ERROR: Android app/src/main/assets/index.html not found after ZIP extraction.")
module=root/"DWD-TWO-PERSON-EXPENSES.js"
if not module.exists(): raise SystemExit("ERROR: DWD-TWO-PERSON-EXPENSES.js missing.")
shutil.copy2(module,html.parent/module.name)
source=html.read_text(encoding="utf-8")
tag='<script src="DWD-TWO-PERSON-EXPENSES.js"></script>'
if tag not in source:
    if "</body>" in source: source=source.replace("</body>",tag+"\n</body>",1)
    else: source+="\n"+tag+"\n"
    html.write_text(source,encoding="utf-8")
print("Injected two-person 50:50 ledger into",html)
