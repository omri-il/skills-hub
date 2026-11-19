"""Make the video helper for skills (Omri, 2026-11-19): demo requests, Gemini without and with the skill,
and what to point at on camera. Only Omri sees the result (admin/server.js, assets/video-help.js).

Claude picks the requests and the points (Omri's rule: choices in a video are Claude's, not Gemini's).
Gemini API only answers, once with no skill and once with the skill, so the answers are a preview: the Gemini
app can answer a little differently.

The output is NOT in git (the repo is public): video-help/data/<skill>.json. Copy it to the VPS:
  scp video-help/data/*.json root@100.94.153.60:/root/Projects/skills-video-help/

Usage (Python 3.12, google-genai and anthropic installed):
  py -3.12 video-help/make.py --env <a .env with GEMINI_API_KEY> [--skills a,b] [--force] [--workers 6]
ANTHROPIC_API_KEY comes from ~/.claude/secrets/anthropic.env.
"""
import argparse
import datetime
import json
import os
import random
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).resolve().parent / "data"
GEMINI_MODEL = "gemini-3.5-flash"
CLAUDE_MODEL = "claude-opus-5-5"

PICK = """You help Omri Iram, an Israeli teacher trainer, record a short YouTube video that shows the power of one
Gemini skill. In the video he types a request into Gemini twice: once in a chat with no skill, once with the
skill installed. The viewers (Israeli teachers) must SEE the difference in a few seconds.

<skill name="{name}">
{skill}
</skill>

<site_text>
title: {title}
problem: {problem}
benefit: {benefit}
</site_text>

Write 2 demo requests for this skill, in Hebrew, as a real Israeli teacher would type them.
- Each request is complete: it gives every detail the skill asks for (grade, subject, topic, length...), so Gemini
  builds at once and does not stop to ask. If the skill works on data (student answers, grades, a text), put a short,
  realistic, anonymous sample in the request (first names only or "תלמיד 1", never full names or IDs).
- Short enough to paste on camera: up to 60 words, plus the sample data if needed.
- Pick requests where plain Gemini typically falls short in a way this skill fixes (generic, missing a part, wrong
  direction, no student version...), so the difference is visible.
- The 2 requests differ (another subject or grade, or another use).
- "followup": one short Hebrew answer Omri can give if Gemini still asks a question anyway ("" if not needed).
- "label": 3-6 Hebrew words naming the demo.
Also write "opening": one plain Hebrew sentence (max 20 words) Omri can say at the start of the video: the problem
the skill solves, in a teacher's words. No em dash, no colon joining two sentences.

Return only JSON: {{"opening": "...", "demos": [{{"label": "...", "prompt": "...", "followup": "..."}}, ...]}}"""

POINTS = """Omri Iram records a video that compares Gemini without a skill and with it. Below are the skill, the
request, and both real answers. Write what he should point at on camera.

<skill name="{name}">
{skill}
</skill>

<request>{prompt}</request>

<without_skill>
{without}
</without_skill>

<with_skill>
{with_}
</with_skill>

Write 3 points in plain Hebrew, each up to 25 words, each about a thing the viewer can see on screen in the two
answers (a section that is there or missing, a concrete example, the length, the order, a student version...).
Use the form "בלי הסקיל: ... עם הסקיל: ..." where it fits. Only claims that are literally true in the answers above;
quote a short phrase from an answer when it helps. If the answer with the skill is not better on some point, do not
invent one. No em dash.

Return only JSON: {{"show": ["...", "...", "..."]}}"""


def load_env(paths):
    for p in paths:
        p = Path(os.path.expanduser(p))
        if not p.exists():
            continue
        for line in p.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"'))


def extract_json(text):
    t = text.strip()
    m = re.search(r"```(?:json)?\s*(.*?)```", t, re.S)
    if m:
        t = m.group(1)
    start = t.find("{")
    return json.loads(t[start:t.rfind("}") + 1])


def meta(name):
    return yaml.safe_load((ROOT / "skills" / name / "meta.yaml").read_text(encoding="utf-8"))


def skill_md(name):
    return (ROOT / "skills" / name / "SKILL.md").read_text(encoding="utf-8")


def with_requires(name, seen=None):
    """The skill and every skill it requires, as the teacher installs them."""
    seen = seen if seen is not None else []
    if name in seen:
        return seen
    seen.append(name)
    for r in meta(name).get("requires") or []:
        with_requires(r, seen)
    return seen


def retry(fn):
    for attempt in range(6):
        try:
            return fn()
        except Exception:
            if attempt == 5:
                raise
            time.sleep(10 * (attempt + 1) + random.random() * 5)


def ask_claude(claude, prompt):
    def go():
        with claude.messages.stream(model=CLAUDE_MODEL, max_tokens=6000, messages=[{"role": "user", "content": prompt}]) as s:
            return s.get_final_message()
    msg = retry(go)
    return extract_json("".join(b.text for b in msg.content if b.type == "text"))


def docx_text(data):
    """The text of a Word file Gemini made, paragraphs and table rows, so the panel and Claude can read it."""
    import io
    import docx
    d = docx.Document(io.BytesIO(data))
    lines = [p.text for p in d.paragraphs if p.text.strip()]
    for t in d.tables:
        for row in t.rows:
            cells = []
            for c in row.cells:
                if c.text.strip() and c.text.strip() not in cells:
                    cells.append(c.text.strip())
            lines.append(" | ".join(cells))
    return "\n".join(lines)


def answer_text(resp):
    """Everything Gemini gave: its text, and a file it made with the code tool (a .docx is read out).
    Skills like create-choice-board answer only with a file, so resp.text alone is empty (2026-11-19)."""
    out = []
    for c in resp.candidates or []:
        for p in (c.content.parts if c.content else None) or []:
            if p.text:
                out.append(p.text)
            elif p.inline_data and p.inline_data.data:
                mime = p.inline_data.mime_type or ""
                if "wordprocessingml" in mime:
                    try:
                        out.append("[Gemini יצר קובץ Word. התוכן שלו:]\n" + docx_text(p.inline_data.data))
                    except Exception:
                        out.append("[Gemini יצר קובץ Word]")
                else:
                    out.append(f"[Gemini יצר קובץ: {mime}]")
            elif p.code_execution_result and p.code_execution_result.output:
                res = p.code_execution_result.output.strip()
                if res:
                    out.append("[פלט הקוד:]\n" + res[:1500])
    return "\n\n".join(out)


def ask_gemini(gemini, name, demo, skill_on):
    from google.genai import types
    system = "You are Gemini, helping a teacher in Israel."
    if skill_on:
        texts = "\n\n".join(f'<skill name="{n}">\n{skill_md(n)}\n</skill>' for n in with_requires(name))
        system += " The user has installed the following skills, and they are active for this conversation. Follow them exactly.\n\n" + texts
    # The Gemini app runs code and makes files for every chat, so both runs get the code tool (2026-11-19:
    # without it, skills that build a .docx gave an empty answer).
    tools = [types.Tool(code_execution=types.ToolCodeExecution())]
    cfg = types.GenerateContentConfig(system_instruction=system, tools=tools)
    contents = [types.Content(role="user", parts=[types.Part(text=demo["prompt"])])]
    out = []
    for turn in range(2):
        text = retry(lambda: answer_text(gemini.models.generate_content(model=GEMINI_MODEL, contents=contents, config=cfg)))
        out.append(text)
        asked = "?" in text and len(text) < 2500 and "```" not in text
        if turn == 0 and asked and demo.get("followup"):
            out.append(f"\n\n[Omri answers: {demo['followup']}]\n\n")
            contents.append(types.Content(role="model", parts=[types.Part(text=text)]))
            contents.append(types.Content(role="user", parts=[types.Part(text=demo["followup"])]))
            continue
        break
    return "".join(out).strip()


def make(name, claude, gemini):
    m = meta(name)
    picked = ask_claude(claude, PICK.format(name=name, skill=skill_md(name), title=m["title"], problem=m["problem"], benefit=m.get("benefit", "")))
    demos = []
    for d in picked["demos"][:3]:
        d["without"] = ask_gemini(gemini, name, d, False)
        d["with"] = ask_gemini(gemini, name, d, True)
        if not d["without"].strip() or not d["with"].strip():
            raise RuntimeError(f"empty Gemini answer in demo '{d.get('label')}': no points written on an empty answer")
        d["show"] = ask_claude(claude, POINTS.format(name=name, skill=skill_md(name), prompt=d["prompt"], without=d["without"], with_=d["with"]))["show"]
        demos.append(d)
    data = {"name": name, "title": m["title"], "made": datetime.date.today().isoformat(), "model": GEMINI_MODEL,
            "opening": picked.get("opening", ""), "demos": demos}
    (OUT / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    return name


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--env", action="append", default=[], help="a .env file with GEMINI_API_KEY (more than one is fine)")
    ap.add_argument("--skills", default="", help="comma list; default every main skill that is not hidden")
    ap.add_argument("--force", action="store_true", help="make again even if the JSON exists")
    ap.add_argument("--workers", type=int, default=6)
    a = ap.parse_args()
    load_env(a.env + ["~/.claude/secrets/anthropic.env"])
    import anthropic
    from google import genai
    claude = anthropic.Anthropic(max_retries=6)
    gemini = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    OUT.mkdir(exist_ok=True)

    if a.skills:
        names = a.skills.split(",")
    else:
        names = sorted(p.name for p in (ROOT / "skills").iterdir()
                       if (p / "meta.yaml").exists() and meta(p.name).get("role") == "main" and not meta(p.name).get("hidden"))
    names = [n for n in names if a.force or not (OUT / f"{n}.json").exists()]
    print(f"{len(names)} skills: {', '.join(names)}", flush=True)
    t0 = time.time()
    with ThreadPoolExecutor(a.workers) as pool:
        futs = {pool.submit(make, n, claude, gemini): n for n in names}
        for f in as_completed(futs):
            try:
                print(f"done {f.result()} ({time.time() - t0:.0f}s)", flush=True)
            except Exception as e:
                print(f"FAILED {futs[f]}: {e}", flush=True)


if __name__ == "__main__":
    main()
