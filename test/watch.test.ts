// Run with: npm test
// Starts the real watcher in a temporary project and checks what it compiles.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '..');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('the watcher follows templates, folders, Extend files and tokens', { timeout: 120_000 }, async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'elevate-watch-'));
  fs.cpSync(path.join(repo, 'elevate'), path.join(dir, 'elevate'), { recursive: true });
  fs.symlinkSync(path.join(repo, 'node_modules'), path.join(dir, 'node_modules'));
  fs.writeFileSync(path.join(dir, 'package.json'), '{}');
  fs.mkdirSync(path.join(dir, 'blocks'));
  fs.mkdirSync(path.join(dir, 'elevate/extend'));
  fs.writeFileSync(path.join(dir, 'elevate/extend/x.css'), '/* extend-v1 */');
  const cfg = path.join(dir, 'elevate/config/elevate.ts');
  fs.writeFileSync(cfg, fs.readFileSync(cfg, 'utf8')
    .replace(/Watch:\s*'[^']*'/, "Watch:['./elevate/templates','./blocks']")
    .replace(/Extend:\s*\[[^\]]*\]/, "Extend:['./elevate/extend/x.css']"));

  const file = (p: string) => path.join(dir, p);
  const css = () => (fs.existsSync(file('elevate.css')) ? fs.readFileSync(file('elevate.css'), 'utf8') : '');
  const until = async (check: (s: string) => boolean, label: string, ms = 20_000) => {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      if (check(css())) return;
      await sleep(250);
    }
    assert.fail(`timed out: ${label}`);
  };

  const child = spawn(path.join(dir, 'node_modules/.bin/tsx'), ['elevate/core/index.ts'], {
    cwd: dir, detached: true, stdio: 'ignore',
  });
  t.after(() => {
    try { process.kill(-child.pid!, 'SIGKILL'); } catch {}
    fs.rmSync(dir, { recursive: true, force: true });
  });

  await until((s) => s.includes('extend-v1'), 'compiles on start with the Extend file');

  fs.writeFileSync(file('elevate/templates/new.html'), '<p class="text:teal">x</p>');
  await until((s) => s.includes('.text\\:teal'), 'a new template compiles');

  fs.rmSync(file('elevate/templates/new.html'));
  await until((s) => !s.includes('.text\\:teal') && s.includes('extend-v1'), 'a deleted template drops its classes');

  fs.writeFileSync(file('blocks/b.html'), '<p class="text:orange">x</p>');
  await until((s) => s.includes('.text\\:orange'), 'a second Watch folder compiles');

  fs.writeFileSync(file('elevate/extend/x.css'), '/* extend-v2 */');
  await until((s) => s.includes('extend-v2'), 'an Extend change recompiles');

  fs.writeFileSync(file('blocks/c.html'), '<p class="text:new-token">x</p>');
  await sleep(1500);
  const design = file('elevate/config/design.ts');
  fs.writeFileSync(design, fs.readFileSync(design, 'utf8').replace('ColorToken: colors,', "ColorToken: {...colors, 'new-token': '#123456'},"));
  await until((s) => s.includes('#123456'), 'a token change restarts the compiler', 30_000);

  const good = css();
  fs.writeFileSync(file('blocks/bad.html'), '<p class="text:nonsense">x</p>');
  await sleep(3000);
  assert.equal(css(), good, 'a bad class leaves the last good stylesheet');

  process.kill(-child.pid!, 'SIGINT');
  await sleep(2000);
  let left = '';
  try { left = execFileSync('pgrep', ['-f', dir]).toString().trim(); } catch { /* none left */ }
  assert.equal(left, '', 'Ctrl+C stops every process');
});
