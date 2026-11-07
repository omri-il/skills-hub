---
description: Add a new skill to skills.omri-iram.co.il from a SKILL.md file or a description
argument-hint: <path to SKILL.md, a folder, or a short description>
---

Add a new skill to this site. Input: $ARGUMENTS

Speak to Omri in Hebrew. Read `CLAUDE.md` (meta.yaml fields and build checks) first.

1. **Get the SKILL.md.**
   - A path to a `SKILL.md`, a folder or a zip: read it whole. Don't change its content.
   - Only a description: write a SKILL.md with Omri (frontmatter `name` + `description`, then the instructions), and show it to him before going on.
   - Check the frontmatter: `name` lowercase letters, digits, hyphens; `description` present and at most 1024 characters. If not, tell Omri and propose a fix; change the file only if he agrees.

2. **Make the folder** `skills/<name>/` (name = the SKILL.md `name`) and copy SKILL.md into it. Only SKILL.md goes in, no other files.

3. **Write `meta.yaml`.** Copy the shape of an existing one. Fill what you can from the SKILL.md: `name`, a Hebrew `title`, `version` (1.0.0 for a new skill), `updated` (today), `subjects`, `audience`, `what_it_does`, `output`, `role`, `requires` (skills it says it calls, only ones in `skills/`), `platforms`.

4. **Ask Omri, in one message, for what only he knows**, and offer your draft for each:
   - `problem`: the problem it solves, in a teacher's words;
   - `tested`: what he actually ran and saw work, and on which platform;
   - `limitations`: what failed, what isn't tested yet;
   - anything else you were not sure about (`role`, `subjects`, `requires`).
   Never invent `tested` or `limitations`. If he hasn't tested yet, `tested` says so plainly.

5. **Bundles.** If it belongs with skills in `bundles.yaml`, ask whether to add it there.

6. **Check:** `npm test && npm run build`. Fix any problem the build lists. Open `npm run serve` → `http://localhost:4321/skills/<name>/` and look at the page.

7. **Commit** (`Add skill <name>`), and push to `main` only after Omri says so. The site updates within about 5 minutes; then open `https://skills.omri-iram.co.il/skills/<name>/` and download its zip once to confirm.
