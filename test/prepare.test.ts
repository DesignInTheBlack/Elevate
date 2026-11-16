// Run with: npm test
// Runs `prepare` the way npx does, in a temporary project.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '..');
const prepare = (cwd: string) => execFileSync(process.execPath, [path.join(repo, 'bin/install.js')], { cwd }).toString();

test('prepare installs, then upgrades without touching the project', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'elevate-prepare-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'package.json'), '{"name":"site"}');
  const f = (p: string) => path.join(dir, 'elevate', p);

  // First run installs everything and adds the script.
  assert.match(prepare(dir), /is ready/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).scripts.elevate, 'tsx elevate/core/index.ts');

  // The project makes it its own.
  fs.appendFileSync(f('config/design.ts'), '\n// mine\n');
  fs.writeFileSync(f('templates/index.html'), '<p class="row">mine</p>');
  fs.rmSync(f('package.json'));
  fs.appendFileSync(f('core/parser.ts'), '\n// edited core\n');
  fs.writeFileSync(f('core/old-file.ts'), '');

  // An upgrade keeps the project's files, replaces core, and saves the old core.
  const out = prepare(dir);
  assert.match(out, /Upgraded Elevate/);
  assert.match(fs.readFileSync(f('config/design.ts'), 'utf8'), /\/\/ mine/);
  assert.equal(fs.readFileSync(f('templates/index.html'), 'utf8'), '<p class="row">mine</p>');
  assert.ok(fs.existsSync(f('package.json')), 'puts back elevate/package.json');
  assert.doesNotMatch(fs.readFileSync(f('core/parser.ts'), 'utf8'), /edited core/);
  assert.equal(fs.existsSync(f('core/old-file.ts')), false);
  const [backup] = fs.readdirSync(path.join(dir, '.elevate-backup'));
  assert.match(fs.readFileSync(path.join(dir, '.elevate-backup', backup, 'core/parser.ts'), 'utf8'), /edited core/);

  // Running it again changes nothing.
  assert.match(prepare(dir), /already installed/);
  assert.equal(fs.readdirSync(path.join(dir, '.elevate-backup')).length, 1);
});
