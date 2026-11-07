# skills-hub

The site at **https://skills.omri-iram.co.il**: skills (`SKILL.md` files) that Omri Iram builds for teachers, each with what it solves, how to install it, what was tested and what wasn't, and a zip to download. Hebrew, right to left, free to download.

## Add a skill

1. Make a folder `skills/<skill-name>/`. The folder name is the skill's `name`: lowercase letters, digits and hyphens.
2. Put the skill in it as `SKILL.md`, with `name` and `description` in its frontmatter.
3. Add `meta.yaml` next to it (copy one from another skill; the fields are listed in `CLAUDE.md`).
4. Run `npm test && npm run build`. If something is wrong, the build says exactly what.
5. Commit and push to `main`. The site updates by itself within about 5 minutes.

In Claude Code, `/add-skill` does all of this and asks for the fields it can't fill.

Several skills that should be downloaded together go in `bundles.yaml`. A skill whose `requires` lists other skills gets its own automatic bundle.

## Build locally

```bash
npm ci
npm test          # checks every skill and the bundle logic
npm run build     # writes dist/: pages and zips
npm run serve     # http://localhost:4321
```

Fonts: Rubik, SIL Open Font License (`assets/fonts/OFL.txt`).
