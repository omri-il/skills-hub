import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSkills, closure, parseFrontmatter, WHO } from '../lib/skills.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const META = (name, extra = '') => `name: ${name}
title: כותרת
version: 1.0.0
updated: 2026-11-07
subjects: [מתמטיקה]
platforms:
  tested: [Gemini]
audience: מורים
problem: בעיה.
benefit: חוסך.
what_it_does: עושה.
output: קובץ
role: main
tested: [נבדק]
limitations: [מגבלה]
${extra}`;

function fixture(skills, bundles) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-hub-'));
  for (const [folder, { name = folder, description = 'תיאור', meta = META(folder) }] of Object.entries(skills)) {
    fs.mkdirSync(path.join(dir, 'skills', folder), { recursive: true });
    const fm = [name !== null && `name: ${name}`, description !== null && `description: ${description}`].filter(Boolean).join('\n');
    fs.writeFileSync(path.join(dir, 'skills', folder, 'SKILL.md'), `---\n${fm}\n---\n\n# x\n`);
    fs.writeFileSync(path.join(dir, 'skills', folder, 'meta.yaml'), meta);
  }
  if (bundles) fs.writeFileSync(path.join(dir, 'bundles.yaml'), bundles);
  return dir;
}

test('the real skills in this repo pass every check', () => {
  const { errors, skills } = loadSkills(ROOT);
  assert.deepEqual(errors, []);
  assert.ok(skills.length >= 4);
});

test('name must match the folder', () => {
  const { errors } = loadSkills(fixture({ 'a-skill': { name: 'other-skill' } }));
  assert.ok(errors.some((e) => e.includes('must be the same as the folder name')));
});

test('name must be lowercase with hyphens', () => {
  const { errors } = loadSkills(fixture({ Bad_Name: {} }));
  assert.ok(errors.some((e) => e.includes('lowercase')));
});

test('description missing or over 1024 characters fails', () => {
  assert.ok(loadSkills(fixture({ 'a-skill': { description: null } })).errors.some((e) => e.includes('"description" is missing')));
  assert.ok(loadSkills(fixture({ 'a-skill': { description: 'א'.repeat(1025) } })).errors.some((e) => e.includes('the limit is 1024')));
  // The zip adds ' (גרסה 1.0.0)' (13 characters) to the description, so 1011 is the most a SKILL.md can have.
  assert.deepEqual(loadSkills(fixture({ 'a-skill': { description: 'א'.repeat(1011) } })).errors, []);
  assert.ok(loadSkills(fixture({ 'a-skill': { description: 'א'.repeat(1012) } })).errors.some((e) => e.includes('plus "(גרסה 1.0.0)"')));
});

test('a required skill that does not exist fails', () => {
  const { errors } = loadSkills(fixture({ 'a-skill': { meta: META('a-skill', 'requires: [ghost-skill]') } }));
  assert.ok(errors.some((e) => e.includes('requires "ghost-skill"')));
});

test('a missing meta.yaml field fails', () => {
  const { errors } = loadSkills(fixture({ 'a-skill': { meta: META('a-skill').replace(/^problem:.*\n/m, '') } }));
  assert.ok(errors.some((e) => e.includes('required field "problem"')));
});

test('who: a value outside the list fails, and no who means everyone', () => {
  const bad = loadSkills(fixture({ 'a-skill': { meta: META('a-skill', 'who: [תלמידים]') } }));
  assert.ok(bad.errors.some((e) => e.includes('who "תלמידים"')));
  const none = loadSkills(fixture({ 'a-skill': {} }));
  assert.deepEqual(none.errors, []);
  assert.deepEqual(none.skills[0].who, WHO);
});

test('a bundle naming a missing skill fails', () => {
  const { errors } = loadSkills(fixture({ 'a-skill': {} }, '- id: b\n  title: t\n  description: d\n  skills: [a-skill, nope]\n'));
  assert.ok(errors.some((e) => e.includes('skill "nope" does not exist')));
});

test('automatic bundle holds the skill and everything it needs, at any depth', () => {
  const dir = fixture({
    top: { meta: META('top', 'requires: [mid]') },
    mid: { meta: META('mid', 'requires: [base]') },
    base: {},
  });
  const { errors, autoBundles, byName } = loadSkills(dir);
  assert.deepEqual(errors, []);
  assert.deepEqual(autoBundles.get('top').skills, ['top', 'mid', 'base']);
  assert.deepEqual(closure('base', byName), ['base']);
  assert.equal(autoBundles.has('base'), false);
});

test('the zipped SKILL.md carries the version in the description and in a line under the frontmatter', () => {
  const { errors, skills } = loadSkills(ROOT);
  assert.deepEqual(errors, []);
  for (const s of skills) {
    const fm = parseFrontmatter(s.packaged);
    assert.equal(fm.name, s.name);
    assert.ok(fm.description.endsWith(`(גרסה ${s.version})`), `${s.name}: description has no version`);
    assert.ok(fm.description.startsWith(s.description.trim()), `${s.name}: description text changed`);
    assert.ok(s.packaged.includes(`> גרסה ${s.version} · עודכנה ${s.updated}`), `${s.name}: no version line`);
  }
});
