# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

skills-hub is the site at https://skills.omri-iram.co.il: Omri's skills for teachers, a page and a zip for each. Static, no server code, free download for everyone (Omri, 2026-11-07). Repo `omri-il/skills-hub`, public. `BRIEF.md` is the original brief.

On the laptop this clone is `C:\Users\omrii\Projects\Gemini-Skills` (since 2026-11-09): the one place to manage the site and develop Gemini skills. The repo, `package.json` and the VPS dir are still named `skills-hub`.

## Commands

```bash
npm ci
npm test              # node --test: checks the real skills and the rules below
node --test --test-name-pattern="name must match" test/skills.test.js   # one test
npm run build         # dist/: index.html, skills/<name>/index.html, downloads/*.zip, 404, sitemap
npm run serve         # serves dist/ on http://localhost:4321
```

## Layout

```
skills/<name>/SKILL.md    the skill itself. Never edit it here to fix the site
skills/<name>/meta.yaml   what the site shows about it
bundles.yaml              hand-made bundles: several skills, one button, a separate zip each
lib/skills.js             reads and checks everything; all checks live here
build.js                  writes dist/ (pages, zips, QR)
assets/                   style.css, app.js (filters, copy button), fonts, favicon.svg
deploy/                   nginx site, VPS update script, systemd timer
.claude/commands/add-skill.md   the /add-skill command
```

Adding a skill = a new folder in `skills/` and a push. Never touch `build.js` for that.

## How the build works

- `skills/*/SKILL.md` is the source. `packageSkill` in `lib/skills.js` adds the version only to the copy that goes into the zip and the site viewer, so the source file and what a teacher downloads are not identical.
- `dist/` is deleted and rebuilt on every run: never fix anything there.
- `test/serve.js` is the local preview server, not a test (`npm test` only runs `test/*.test.js`).

## Limits when writing a skill

- Only `SKILL.md` goes into the zip (`makeZip` in `build.js`). Any other file in the skill's folder (a script, an example) is dropped with no warning, so a skill has to be one self-contained file.
- Nothing checks that `version` went up after a change. Bump it by hand.
- `tested: []` passes the checks. A skill not tested yet says so in words, like `weekly-digest` ("עוד לא נבדק").

## Developing a skill

1. Draft or change the SKILL.md and show it to Omri.
2. Claude can't run a skill in Omri's Gemini account: write a ready-to-paste test request, and Omri runs it and reports what happened.
3. Record what really happened, with the date, in `tested` and `limitations`. `Gemini` goes under `platforms.tested` only after a real run.
4. Bump `version` and `updated` in `meta.yaml`.
5. `npm test && npm run build`, commit, and push to `main` only after Omri says so.

Known Gemini behaviour (2026-11-07, Flash and Pro, recorded in those skills' `tested`): a request for a presentation made Gemini build its own Canvas deck and skip `create-lesson-slides` and `fix-slides-rtl`, even when the request named the skill.

## meta.yaml

Required: `name` (= folder), `title` (Hebrew), `version`, `updated` (YYYY-MM-DD), `subjects` (list), `platforms` (`tested:` list and/or `compatible:` list), `audience`, `problem`, `what_it_does`, `output`, `role` (`main`, a skill the teacher uses; `shared`, a helper other skills call), `tested` (list), `limitations` (list).
Optional: `requires` (list of skill names), `example` (the request shown in "איך מתקינים"; without it the site guesses one from the name).

- `main` skills come first on the home page; `shared` ones under "סקילי עזר".
- `tested` and `limitations` are the site's credibility: write them as plain observations from a real run, never marketing. Ask Omri; don't invent them.
- A skill with `requires` gets an automatic bundle (itself plus everything it requires, at any depth). Its page's main button downloads those zips one by one; a secondary link downloads the skill alone.
- **A bundle is never one zip of several skills** (Omri, 2026-11-09): a teacher would have to extract it, and Gemini takes one skill per upload. One click downloads a separate zip per skill (`data-files` in `assets/app.js`), and each is uploaded as it is.

## Build checks (lib/skills.js)

The build stops with every problem listed if:
- `name` in SKILL.md is not the folder name, or not lowercase letters, digits and hyphens;
- `description` is missing or longer than 1024 characters;
- a skill in `requires` or in `bundles.yaml` does not exist;
- a required meta.yaml field is missing, or `role` is not main/shared;
- the description plus its version tag (` (גרסה X.Y.Z)`) is longer than 1024 characters.

**Every skill always shows its version once installed** (Omri, 2026-11-07), so he can tell whether he has the newest one. The build adds `meta.yaml`'s `version` to the SKILL.md that goes into the zip (and the site viewer): ` (גרסה X.Y.Z)` at the end of the description (Gemini's skill list shows it) and a line `> גרסה X.Y.Z · עודכנה YYYY-MM-DD · הגרסה העדכנית: <page>` under the frontmatter. Don't write the version into `skills/*/SKILL.md` by hand; bump `version` and `updated` in `meta.yaml` on every change to a skill.

Every zip holds one skill: one folder named exactly like the skill, with only `SKILL.md` in it (no hidden files, a fixed date, so the bytes only change when the skill does). That is the layout Gemini expects.

## Deploy

- DNS `skills.omri-iram.co.il` → VPS 147.79.114.195. nginx site `/etc/nginx/sites-available/skills.omri-iram.co.il` (copy of `deploy/skills.omri-iram.co.il.conf`), Let's Encrypt, files in `/var/www/skills`.
- **Push to main is the deploy.** On the VPS, `skills-hub-deploy.timer` runs `deploy/update.sh` every 5 minutes from the clone at `/root/Projects/skills-hub`: if `origin/main` moved it pulls, runs `npm ci`, `npm test`, `npm run build`, and only then rsyncs `dist/` into `/var/www/skills`. A failing build leaves the live site as it was. Logs: `journalctl -u skills-hub-deploy`.
- Deploy now instead of waiting: `ssh root@100.94.153.60 "systemctl start skills-hub-deploy"` (or `bash deploy/update.sh --force` in the clone).
- A change in `deploy/*.conf`, `.service` or `.timer` is not picked up by the timer: copy it into place by hand, then `nginx -t && systemctl reload nginx` or `systemctl daemon-reload`.
- GitHub Actions (`.github/workflows/check.yml`) runs the same test and build on every push, so a broken skill shows a red check on GitHub too.

## Rules

- Hebrew, right to left, logical CSS only (`margin-inline-start`, not `margin-left`). Code, file names and skill names are LTR islands (`<code dir="ltr">`, `<bdi>`). The SKILL.md viewer uses `unicode-bidi: plaintext` so each line picks its own direction.
- The page loads nothing from another site (CSP in the nginx file): fonts, favicon and the QR are local files.
- The QR (drawn in `build.js`, hidden under 560px) holds only `https://skills.omri-iram.co.il/`.
- The favicon comes from claude-config's `scripts/favicon/make_favicons.py` (row `skills`, glyph `layers`, #BEC81E). Change it there and re-run, not by hand.
- Downloads are free for everyone, with no sign-up and no analytics. The one form is the optional sign-up at `/#signup` (Omri, 2026-11-11): a weekly skills email (business Listmonk list 106) and beta testers (list 107). `POST /signup` → listmonk-selfservice `/skills/signup` → Listmonk's own `/subscription/form`, single opt-in behind Altcha; both lists are tagged `no-digest`, so these people never get the business weekly through them. The form's nginx routes and CSP are in `deploy/skills.omri-iram.co.il.conf`. Detail: the Listmonk repo, `selfservice/skills_signup.py`.
- `dist/skills.json` is read every Thursday 09:00 by Listmonk's `scripts/skills_weekly_draft.py`, which makes a draft for list 106 of the `main` skills whose `updated` is in the last 7 days. So a skill's `updated` date is what puts it in the weekly email.
- The site shows Gemini only for now (Omri, 2026-11-11): `SHOWN_PLATFORMS` in `build.js` hides Claude and ChatGPT tags, filters and install steps. meta.yaml still lists them.
