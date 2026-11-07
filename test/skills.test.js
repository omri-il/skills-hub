import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSkills, closure } from '../lib/skills.js';

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
  assert.deepEqual(loadSkills(fixture({ 'a-skill': { description: 'א'.repeat(1024) } })).errors, []);
});

test('a required skill that does not exist fails', () => {
  const { errors } = loadSkills(fixture({ 'a-skill': { meta: META('a-skill', 'requires: [ghost-skill]') } }));
  assert.ok(errors.some((e) => e.includes('requires "ghost-skill"')));
});

test('a missing meta.yaml field fails', () => {
  const { errors } = loadSkills(fixture({ 'a-skill': { meta: META('a-skill').replace(/^problem:.*\n/m, '') } }));
  assert.ok(errors.some((e) => e.includes('required field "problem"')));
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
