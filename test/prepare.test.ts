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

test('a project can rename, move, add and remove breakpoints in config/design.ts', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'elevate-bp-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'package.json'), '{"name":"site"}');
  prepare(dir);
  const design = path.join(dir, 'elevate', 'config', 'design.ts');
  // Written out of order on purpose: Elevate puts them in width order.
  fs.writeFileSync(design, fs.readFileSync(design, 'utf8').replace(/BreakPointToken: breakpoints,/, "BreakPointToken: { desktop: '75rem', tablet: '700px', md: '50rem' },"));
  const script = path.join(dir, 'check.mts');
  fs.writeFileSync(script, `
import { build, validate, describe } from './elevate/core/api.ts';
const r = await build({ write: false, files: false, extra: ['row /desktop/ col', 'pd:d2 /tablet/ pd:d4 /md/ pd:d6', 'contain'] });
console.log(JSON.stringify({ ok: r.ok, error: r.error, css: r.css, bps: describe().breakpoints, bad: validate('row /lg/ col').problems.map((p) => p.message) }));
`);
  const out = JSON.parse((fs.symlinkSync(path.join(repo, 'node_modules'), path.join(dir, 'node_modules')), execFileSync(process.execPath, ['--import', 'tsx', script], { cwd: dir })).toString().trim().split('\n').pop()!);
  assert.equal(out.ok, true, out.error);
  assert.deepEqual(out.bps.map((b: any) => b.name), ['tablet', 'md', 'desktop']);
  const at = (w: string) => out.css.lastIndexOf(`@media only screen and (min-width:${w})`);
  assert.ok(at('700px') > 0 && at('700px') < at('50rem') && at('50rem') < at('75rem'), 'media queries in width order');
  assert.doesNotMatch(out.css, /min-width:64rem/, 'removed breakpoints are gone, contain included');
  assert.match(out.bad[0], /not a breakpoint\. Use one of: tablet, md, desktop/);
});
