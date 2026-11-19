#!/usr/bin/env python3
from pathlib import Path
from zipfile import ZipFile
import sys

apk = Path(sys.argv[1] if len(sys.argv) > 1 else "MPR-SQUAD-PCS-v2.9-package/android/app/build/outputs/apk/debug/app-debug.apk")
if not apk.is_file():
    raise SystemExit(f"APK not found: {apk}")
with ZipFile(apk) as z:
    candidates = [n for n in z.namelist() if n.endswith("/assets/index.html") or n == "assets/index.html"]
    if len(candidates) != 1:
        raise SystemExit(f"Expected exactly one packaged assets/index.html; found {len(candidates)}")
    html = z.read(candidates[0]).decode("utf-8")
checks = [
    'id="dwdTwoPersonSharePanel"',
    'id="dwdShareMonth"',
    'id="dwdSharePersonA"',
    'id="dwdSharePersonB"',
    'id="dwdShareSummary"',
    'DWD_TWO_PERSON_SHARED_EXPENSE_INTEGRATION_V1',
    'function dwdPersonExpenseTotal',
    'function renderTwoPersonShare',
    'function billAmount(',
    'mpr_pcs_work_details_v1',
]
missing = [x for x in checks if x not in html]
if missing:
    raise SystemExit("APK verification failed; missing: " + ", ".join(missing))
if html.count('id="dwdTwoPersonSharePanel"') != 1:
    raise SystemExit("APK verification failed; duplicate two-person panel")
print(f"APK verification passed: {apk} ({apk.stat().st_size} bytes)")
print("Verified: native DWD bill/person data hooks, month selector, two person selectors, summary and single integration panel.")
