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
