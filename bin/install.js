// npx elevate-framework prepare
//
// First run: copies the elevate/ folder into the project and adds the
// "elevate" script to package.json.
//
// Later runs (upgrades): replace only elevate/core/, the compiler, and keep
// everything that belongs to the project: config, design, rules, templates
// and any other files. The old core is saved first, in .elevate-backup/.
// Files that are new in this version are added; nothing of yours is changed.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, '../elevate');
const target = path.resolve(process.cwd(), 'elevate');
const packageJsonPath = path.resolve(process.cwd(), 'package.json');

const readVersion = (dir) => {
  try {
    const text = fs.readFileSync(path.join(dir, 'core/version.ts'), 'utf8');
    return text.match(/VERSION\s*=\s*'([^']+)'/)?.[1] || null;
  } catch {
    return null;
  }
};

// Every file under dir, as paths relative to dir.
const listFiles = (dir, base = dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full, base) : [path.relative(base, full)];
  });
};

const sameFile = (a, b) => {
  try {
    return fs.readFileSync(a).equals(fs.readFileSync(b));
  } catch {
    return false;
  }
};

function addElevateScript() {
  if (!fs.existsSync(packageJsonPath)) {
    console.log('No package.json here, so no "elevate" script was added. Run "npm init -y" first, then prepare again.');
    return;
  }
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.scripts = packageJson.scripts || {};
  if (packageJson.scripts.elevate === 'tsx elevate/core/index.ts') return;
  packageJson.scripts.elevate = 'tsx elevate/core/index.ts';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
  console.log('Added the "elevate" script to package.json.');
}

function install() {
  fs.cpSync(source, target, { recursive: true });
  addElevateScript();
  console.log(`Elevate ${readVersion(source)} is ready in ./elevate. Run "npm run elevate" to start.`);
}

function upgrade() {
  const from = readVersion(target);
  const to = readVersion(source);

  // 1. Save the current compiler, unless it's already this exact version.
  const oldCore = path.join(target, 'core');
  const newCore = path.join(source, 'core');
  const oldFiles = listFiles(oldCore);
  const newFiles = listFiles(newCore);
  const changed = newFiles.filter((f) => !sameFile(path.join(oldCore, f), path.join(newCore, f)));
  const removed = oldFiles.filter((f) => !newFiles.includes(f));

  if (changed.length === 0 && removed.length === 0) {
    console.log(`Elevate ${to} is already installed.`);
  } else {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backup = path.resolve(process.cwd(), '.elevate-backup', from ? `${stamp}-v${from}` : stamp, 'core');
    if (fs.existsSync(oldCore)) fs.cpSync(oldCore, backup, { recursive: true });

    // 2. Replace the compiler.
    fs.rmSync(oldCore, { recursive: true, force: true });
    fs.cpSync(newCore, oldCore, { recursive: true });
    console.log(from ? `Upgraded Elevate from ${from} to ${to}.` : `Upgraded Elevate to ${to}.`);
    console.log(`Your previous elevate/core is saved in ${path.relative(process.cwd(), backup)}.`);
    console.log('If you had edited files in core, copy your changes back from there.');
  }

  // 3. Put back only what the compiler needs to run: elevate/package.json and
  // the config files, plus any example file a config file still imports.
  // Templates and examples you deleted stay deleted. Nothing is overwritten.
  const missing = (f) => !fs.existsSync(path.join(target, f));
  const copy = (f) => {
    fs.mkdirSync(path.dirname(path.join(target, f)), { recursive: true });
    fs.copyFileSync(path.join(source, f), path.join(target, f));
  };
  const all = listFiles(source).filter((f) => !f.startsWith(`core${path.sep}`));
  const added = all.filter((f) => missing(f) && (f === 'package.json' || f.startsWith(`config${path.sep}`)));
  added.forEach(copy);
  const configText = listFiles(path.join(target, 'config'))
    .map((f) => fs.readFileSync(path.join(target, 'config', f), 'utf8')).join('\n');
  all.filter((f) => missing(f) && /^(design|rules)[\\/]/.test(f))
    .filter((f) => configText.includes(path.basename(f, path.extname(f))))
    .forEach((f) => { copy(f); added.push(f); });
  if (added.length) console.log(`Put back missing files: ${added.map((f) => `elevate/${f}`).join(', ')}`);
  console.log('Nothing else in your config, design, rules or templates was changed.');

  addElevateScript();
}

try {
  if (fs.existsSync(target)) upgrade();
  else install();
} catch (error) {
  console.error(`Prepare failed: ${error.message}`);
  process.exit(1);
}
