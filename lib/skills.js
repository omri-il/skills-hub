// Reads skills/*/SKILL.md + meta.yaml and bundles.yaml, and checks them.
// Every problem is collected, so one build run lists all of them at once.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const MAX_DESCRIPTION = 1024;
export const REQUIRED_META = [
  'name', 'title', 'version', 'updated', 'subjects', 'platforms', 'audience',
  'problem', 'what_it_does', 'output', 'role', 'tested', 'limitations',
];

export function parseFrontmatter(text) {
  const m = text.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  return YAML.parse(m[1]) || {};
}

export const SITE = 'https://skills.omri-iram.co.il';
export const versionTag = (version) => `(גרסה ${version})`;

// The SKILL.md that goes into the zip and the site viewer: the file as written, plus its version from
// meta.yaml in two places a teacher can see after installing it: the end of the description (shown in
// Gemini's skill list) and a line under the frontmatter. skills/*/SKILL.md itself is never changed.
export function packageSkill(text, { name, version, updated }) {
  const m = text.match(/^(﻿?---\r?\n)([\s\S]*?)(\r?\n---\r?\n?)([\s\S]*)$/);
  if (!m) return text;
  const doc = YAML.parseDocument(m[2]);
  const description = `${String(doc.get('description')).trim()} ${versionTag(version)}`;
  doc.set('description', description);
  const fm = doc.toString({ lineWidth: 0 }).replace(/\n$/, '');
  const line = `> גרסה ${version} · עודכנה ${updated} · הגרסה העדכנית: ${SITE}/skills/${name}/`;
  return `${m[1]}${fm}${m[3]}\n${line}\n${m[4].replace(/^\r?\n/, '\n')}`;
}

function isEmpty(v) {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
}

function list(v) {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v.map(String) : [String(v)];
}

export function loadSkills(root) {
  const errors = [];
  const skillsDir = path.join(root, 'skills');
  const dirs = fs.existsSync(skillsDir)
    ? fs.readdirSync(skillsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
        .map((d) => d.name).sort()
    : [];
  if (!dirs.length) errors.push('No skills found in skills/.');

  const skills = [];
  for (const dir of dirs) {
    const where = `skills/${dir}`;
    const skillPath = path.join(skillsDir, dir, 'SKILL.md');
    const metaPath = path.join(skillsDir, dir, 'meta.yaml');
    if (!fs.existsSync(skillPath)) { errors.push(`${where}: SKILL.md is missing.`); continue; }
    if (!fs.existsSync(metaPath)) { errors.push(`${where}: meta.yaml is missing.`); continue; }

    const raw = fs.readFileSync(skillPath);
    const text = raw.toString('utf8');
    let fm;
    try { fm = parseFrontmatter(text); } catch (e) { errors.push(`${where}/SKILL.md: frontmatter is not valid YAML (${e.message}).`); continue; }
    if (!fm) { errors.push(`${where}/SKILL.md: no frontmatter (it must start with --- name/description ---).`); continue; }

    if (isEmpty(fm.name)) errors.push(`${where}/SKILL.md: "name" is missing.`);
    else {
      if (fm.name !== dir) errors.push(`${where}/SKILL.md: name "${fm.name}" must be the same as the folder name "${dir}".`);
      if (!NAME_RE.test(String(fm.name))) errors.push(`${where}/SKILL.md: name "${fm.name}" must be lowercase letters, digits and hyphens only (e.g. create-math-practice).`);
    }
    if (isEmpty(fm.description)) errors.push(`${where}/SKILL.md: "description" is missing.`);
    else if ([...String(fm.description)].length > MAX_DESCRIPTION) {
      errors.push(`${where}/SKILL.md: description is ${[...String(fm.description)].length} characters, the limit is ${MAX_DESCRIPTION}.`);
    }

    let meta;
    try { meta = YAML.parse(fs.readFileSync(metaPath, 'utf8')) || {}; } catch (e) { errors.push(`${where}/meta.yaml: not valid YAML (${e.message}).`); continue; }
    for (const f of REQUIRED_META) if (isEmpty(meta[f])) errors.push(`${where}/meta.yaml: required field "${f}" is missing.`);
    if (!isEmpty(meta.name) && meta.name !== dir) errors.push(`${where}/meta.yaml: name "${meta.name}" must be the same as the folder name "${dir}".`);
    if (!isEmpty(meta.role) && !['main', 'shared'].includes(meta.role)) errors.push(`${where}/meta.yaml: role must be "main" or "shared", not "${meta.role}".`);
    if (meta.platforms && typeof meta.platforms === 'object' && !list(meta.platforms.tested).length && !list(meta.platforms.compatible).length) {
      errors.push(`${where}/meta.yaml: platforms needs "tested" or "compatible".`);
    }

    // The version is added to the description in the zip, so the limit counts it too.
    const withTag = [...`${String(fm.description || '').trim()} ${versionTag(meta.version)}`].length;
    if (!isEmpty(fm.description) && !isEmpty(meta.version) && withTag > MAX_DESCRIPTION) {
      errors.push(`${where}/SKILL.md: description plus "${versionTag(meta.version)}" is ${withTag} characters, the limit is ${MAX_DESCRIPTION}.`);
    }
    const packaged = packageSkill(text, { name: dir, version: String(meta.version || ''), updated: String(meta.updated || '') });

    skills.push({
      name: dir,
      dir,
      raw,
      text,
      packaged,
      description: String(fm.description || ''),
      title: String(meta.title || dir),
      version: String(meta.version || ''),
      updated: String(meta.updated || ''),
      subjects: list(meta.subjects),
      tested_on: list(meta.platforms?.tested),
      compatible: list(meta.platforms?.compatible),
      audience: String(meta.audience || ''),
      problem: String(meta.problem || '').trim(),
      what_it_does: String(meta.what_it_does || '').trim(),
      output: String(meta.output || '').trim(),
      requires: list(meta.requires),
      role: meta.role === 'shared' ? 'shared' : 'main',
      tested: list(meta.tested),
      limitations: list(meta.limitations),
      example: String(meta.example || '').trim(),
    });
  }

  const byName = new Map(skills.map((s) => [s.name, s]));
  for (const s of skills) {
    for (const r of s.requires) {
      if (!byName.has(r)) errors.push(`skills/${s.name}/meta.yaml: requires "${r}", but there is no skills/${r}/.`);
      if (r === s.name) errors.push(`skills/${s.name}/meta.yaml: a skill cannot require itself.`);
    }
  }

  // Bundles from bundles.yaml.
  const bundles = [];
  const bundlesPath = path.join(root, 'bundles.yaml');
  if (fs.existsSync(bundlesPath)) {
    let data;
    try { data = YAML.parse(fs.readFileSync(bundlesPath, 'utf8')) || []; } catch (e) { errors.push(`bundles.yaml: not valid YAML (${e.message}).`); data = []; }
    if (!Array.isArray(data)) { errors.push('bundles.yaml: must be a list of bundles.'); data = []; }
    for (const [i, b] of data.entries()) {
      const where = `bundles.yaml (bundle ${i + 1})`;
      for (const f of ['id', 'title', 'description', 'skills']) if (isEmpty(b?.[f])) errors.push(`${where}: "${f}" is missing.`);
      if (b?.id && !NAME_RE.test(b.id)) errors.push(`${where}: id "${b.id}" must be lowercase letters, digits and hyphens.`);
      if (b?.id && byName.has(b.id)) errors.push(`${where}: id "${b.id}" is already a skill name.`);
      for (const n of list(b?.skills)) if (!byName.has(n)) errors.push(`${where}: skill "${n}" does not exist in skills/.`);
      if (b?.id) bundles.push({ id: b.id, title: String(b.title || ''), description: String(b.description || ''), skills: list(b.skills), auto: false });
    }
  }

  // An automatic bundle for every skill that requires others: it plus everything it needs.
  const autoBundles = new Map();
  if (!errors.length) {
    for (const s of skills) {
      if (!s.requires.length) continue;
      const all = closure(s.name, byName);
      autoBundles.set(s.name, {
        id: `${s.name}-full`,
        title: `${s.title}, עם כל מה שהוא צריך`,
        description: '',
        skills: all,
        auto: true,
      });
    }
  }

  return { skills, byName, bundles, autoBundles, errors };
}

// The skill and everything it requires, at any depth, the skill itself first.
export function closure(name, byName) {
  const out = [];
  const seen = new Set();
  const visit = (n) => {
    if (seen.has(n)) return;
    seen.add(n);
    out.push(n);
    for (const r of byName.get(n)?.requires || []) visit(r);
  };
  visit(name);
  return out;
}
