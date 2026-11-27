"""Page pictures for the create-integrated-lesson "איך זה עוזר?" rows (2026-11-27): renders the Canvas page in the
'with' answer of video-help demo 0, makes a wrong try in question 1 (✗ + hint) and opens "בדיקה למורה".
Usage: py -3.12 deploy/shots/integrated_lesson_page.py . ../skill-tests/results/vh-integrated-lesson/shots
Prints the boxes and points for deploy/shots/anchors.json (after_img), then run make_row_shots.py."""
import json, re, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(sys.argv[1])
OUT = Path(sys.argv[2]); OUT.mkdir(parents=True, exist_ok=True)
d = json.loads((ROOT / "video-help/data/create-integrated-lesson.json").read_text(encoding="utf-8"))
w = d["demos"][0]["with"]
html = re.search(r"```html\n(.*?)```", w, re.S).group(1)
S = 2
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width": 440, "height": 900}, device_scale_factor=S)
    pg.set_content(html); pg.wait_for_timeout(800)
    # row 1: a wrong answer in question 1 -> ✗ and the hint
    box = pg.locator("#practice .qa").first
    box.locator("input").fill("1"); box.locator("button", has_text="לבדוק").click()
    pg.wait_for_timeout(200)
    head = pg.locator("#practice").evaluate("e => { const c = e.closest('.card') || e.parentElement; return c.getBoundingClientRect().top + scrollY }")
    bb = box.evaluate("e => { const r = e.getBoundingClientRect(); return [r.left, r.top + scrollY, r.right, r.bottom + scrollY] }")
    tip = box.locator(".tip").first.evaluate("e => { const r = e.getBoundingClientRect(); return [r.right + 24, r.top + scrollY + r.height / 2] }")
    pg.screenshot(path=str(OUT / "il-0-practice.png"), full_page=True)
    res["practice"] = {"box": [0, round(head * S), 440 * S, round((bb[3] + 10) * S)], "point": [round(tip[0] * S), round(tip[1] * S)]}
    # row 2: the teacher check
    pg.locator("#teacherBtn").click(); pg.wait_for_timeout(300)
    t = pg.locator("#teacherBtn").evaluate("e => e.getBoundingClientRect().top + scrollY")
    ok = pg.locator("#teacher p.ok").first.evaluate("e => { const r = e.getBoundingClientRect(); return [r.right + 24, r.top + scrollY + r.height / 2, r.bottom + scrollY] }")
    pg.screenshot(path=str(OUT / "il-0-teacher.png"), full_page=True)
    res["teacher"] = {"box": [0, round((t - 10) * S), 440 * S, round((ok[2] + 12) * S)], "point": [round(ok[0] * S), round(ok[1] * S)]}
    b.close()
print(json.dumps(res))
