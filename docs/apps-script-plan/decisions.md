# Apps Script skills for teachers: decisions

Omri, 2026-11-26: teachers need more than Gemini Canvas, and Apps Script is the next step. Two problems: a big Apps Script project is hard to update, and Gemini's code often fails on the first run. A third need: a skill that tells a teacher which tool fits (Canvas, Apps Script, or a dev environment). Most teachers should not go to dev environments.

Read this file at the start of every session on this task.

## The plan (approved 2026-11-26, after 2 checks: one here, one in a separate review session)

0. Bring back what exists: beta pages for `apps-script-fix` and `apps-script-lomda`; "Select all" in the permission step of every building skill; check that `apps-script-escape-room` and `sites-student-app` pass Gemini's upload security scan (they hold full code).
1. `apps-script-fix` also for a big project: project card in its own file (`Card.gs`), Gemini asks which files it needs, one change per chat, test with the `/dev` link, 3 lines to go back, split a long page into 3 files once.
2. `apps-script-build`: a main skill for Apps Script ideas with no skill on the site. The list of Gemini's mistakes lives inside it. `runCheck` test function (English name, returns no data, deletes its own row).
3. `which-tool`: up to 7 questions in one message, each with a default. Dev environment only for 4 cases. Writes no code.
4. Update the existing bundle `apps-script-for-teachers` in `bundles.yaml`.

## Decided, and why

- **No separate `apps-script-update` skill.** `apps-script-fix` already handles changes ("תיקון ושינוי", "תשנה לי בקוד"), so Gemini would pick fix. Two skills = two re-tests. The teacher should not have to choose.
- **No shared `apps-script-rules` skill.** Unknown whether Gemini loads 2 skills together; `requires` removes "רק הסקיל הזה" and means 2 uploads; the 4 building skills already hold their own rules and passed their mock runs.
- **The list of mistakes comes from** Gemini's answers without a skill (`video-help/data`), the rules already in the 4 skills, and the Playbook. Not from fix's 25 runs: those were repairs of prepared broken code.
- **Dev environment only for:** users without a school Google account who need a password; payments; more than 30 users at the same moment, regularly; a real-time multiplayer game. Ruled out: "more than 5 files" (a guess).
- **`which-tool` triggers on "what should I use" questions only.** Existing skills own "Apps Script", "vibe coding", "אפליקציה לתלמידים". A build request makes Gemini skip skills (2026-11-07).
- **Permission step says "Select all".** Since 2025 Google's permission window has a box per permission (granular OAuth consent); a teacher who does not tick all gets a tool that fails later.

## Facts checked (review session, 2026-11-26, Google docs)

- Edit a deployment to a new version: the link stays the same.
- Test deployments: a `/dev` link runs the latest saved code, only for the owner.
- Quotas: 6 minutes per run, 30 runs at the same moment per user.

## Not checked yet

- A function name in Hebrew in the Apps Script editor.
- A student signed in to 2 Google accounts who cannot open the web app link.
- Whether the Gemini app loads 2 skills together.

## Log

- 2026-11-26: step 0. Permission step "Select all" in fix 1.0.2, lomda 1.0.2, escape-room 1.0.1, dashboard 1.0.3, sheet-per-teacher 1.3.1. Beta results forms in Event Engine (business): fix `kbgtu`, lomda `afrye`, copied from the oral-check form with 2 more questions (which account, did the code run). DB backup before: `data/events.before-apps-script-beta-20261126.db`.
- 2026-11-26: step 1 draft, `apps-script-fix` 1.1.0 (worktree `apps-script-fix-big`, not pushed, waits for Omri's OK). A table at the top picks the mode: error (any size) or a change in 1-2 files = the old "fix at once"; a change in 3+ files or a pasted `Card.gs` = big-project mode. Choices made in the draft, and why:
  - The card counts "עדכון מס' N", not "גרסה": Google's deployment versions have their own numbers, and the go-back step says "the previous version".
  - "Long HTML" = more than 200 lines. A guess, not measured: change it after a real run cuts a file.
  - A split, and any answer with more than one long file, sends one file per message and waits for "הבא". The split itself returns all the code again, so without this it would be cut too.
  - `include(name)` and `createTemplateFromFile('Index').evaluate()` are named in words and inline code only, no code block: the upload scan.
  - A menu/trigger tool: no "גרסה חדשה"; save when nobody works in the sheet; go back = paste the old code from the start of the chat.
  - The "Test deployments" menu name in the Hebrew editor ("בדיקת פריסות") is not checked.
  - meta.yaml: the `uses` item "הכלי מבקש הרשאה" was replaced by "כלי גדול עם הרבה קבצים" (3 uses only; the permission case stays in the skill's table).
  - 5 test requests: `docs/apps-script-plan/fix-1.1.0-tests.md` (Claude wrote the test code; test 4 has a 250-line Index.html).
- 2026-11-26: fix 1.1.0 tested by Claude in the Gemini app (built-in browser, school account 1002216675@taded.org.il, default mode "Hydrogen"; Omri's choice). Tests 1, 2, 3 passed on the first run. Test 4 failed once: the split rule sat only under big-project mode, so a 2-file project with a 255-line Index.html got the whole file back (complete, not cut). Fixed: a table row and "בכל גודל של פרויקט"; second run split correctly, one file per message, `doGet` right. Test 5: the go-back section copied the web-app line for a menu tool; fixed with one line per tool type; second run right. 1.1.0 was also uploaded to hello@ (Chrome, before Omri asked for the built-in browser); both accounts passed the upload scan. Not tested: the code in a real Apps Script editor; an error request (unchanged part).
- 2026-11-26: step 2, `apps-script-build` 1.0.0 (worktree `apps-script-build`). Choices, and why:
  - The mistakes list comes from 4 'without' answers in `video-help/data` (lomda x2, dashboard x2; there is no escape-room file, not on the VPS either), the rules of the 4 building skills, and the Playbook (copy the error from the execution log; advanced services such as People API go under Services). Seen without a skill: Forms or formulas instead of the tool asked for; fixed column numbers (`row[4]`); a threshold of 70 when the teacher asked 55; "remove duplicates" on the responses tab; gendered address and an invented teacher name.
  - A routing table at the top: if another skill owns the request and is installed, follow it; if not, build and name that skill in one line.
  - 3 tool types (menu, trigger, web app); pick the simplest that fits.
  - `runCheck` checks tabs and headers, writes one row and deletes it in a lock, logs "הכול עובד". It is also the first run, so it opens the permission window. A tool that writes nothing only checks. A menu tool gets it as the last menu item "בדיקה".
  - `Card.gs` from day one, same format as fix 1.1.0, "עדכון מס' 1".
  - A tool that reads an existing sheet with no tab or header names in the request: one message, up to 4 questions with defaults. Otherwise code at once.
  - Email quotas in the skill: about 1,500 a day (school account), about 100 (private Gmail).
  - No `fixes.list` rows: no run of Gemini without this skill on these requests yet; `also` only.
- 2026-11-26: build 1.0.0 run by Claude in the Gemini app (built-in browser). CORRECTION: the browser was signed in to hello@, mode Neon, not the school account; this run does not count. 5 tests + a follow-up + a routing check passed; no change to the skill. Test 4 was reworded: the first wording ("שהגיליון יראה לי מי חיסר") did not trigger the skill, and Gemini gave formulas, a fair answer to a request with no code. Results: `build-1.0.0-tests.md`. Not tested: the code in a real Apps Script editor; a private Gmail account. `needs_pro` not set: the default mode passed.
- 2026-11-26: beta results form for build in Event Engine (business): `kawb2`, a copy of fix's `kbgtu` (same 16 questions), new title and intro. DB backup before: `data/events.before-apps-script-build-beta-20261126.db`.
- 2026-11-26: Omri's rule: every Gemini app test runs on the school Education account (1002216675@taded.org.il), in Hydrogen; hello@ only when the school credits run out. Why: hello@ has models and features (Neon) that the org account lacks. Check the signed-in account and mode before the first prompt. Build 1.0.0 must be run again there before it goes live.
- 2026-11-26: build 1.0.0 run again by Claude in the Gemini app, built-in browser, school account 1002216675@taded.org.il (`/u/4` there; its sign-in had expired, Omri signed in), mode Hydrogen. 5 tests + follow-up + routing check passed; no change to the skill. Notes: test 3 added 2 fields not asked for (stated in "מה נקבע"); test 4's question 3 had no default; the follow-up went to apps-script-fix and had no `TEST_MODE` (mail goes only to the owner). lomda is not installed in that account, so the routing check built the quiz and named `apps-script-lomda` in the last line, as the skill says. Results: `build-1.0.0-tests.md`; meta.yaml `tested`, `platforms.tested: Gemini`.
