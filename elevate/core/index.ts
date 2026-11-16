// ╔════════════════════════════════════════════════════════════════════╗
// ║                           COMMAND LINE                             ║
// ║                                                                    ║
// ║   npm run elevate                  watch and compile (default)     ║
// ║   npm run elevate -- build         compile once                    ║
// ║   npm run elevate -- check "<classes>"   check a class string      ║
// ║   npm run elevate -- describe      print the design system as JSON ║
// ║                                                                    ║
// ║ Add --json to build or check for machine-readable output.          ║
// ║ The compiler itself lives in engine.ts; code should use api.ts.    ║
// ╚════════════════════════════════════════════════════════════════════╝

import { build, validate, describe, VERSION, config } from './api.js';
import { normalizePath } from './engine.js';
import { watchFolders } from './scan.js';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';
import ora from 'ora';

// Compiler errors carry their own file, line and tips, so print only the
// message, in red, with no stack trace.
Error.stackTraceLimit = 0;
process.on('uncaughtException', (err) => {
  console.log('\x1b[31m%s\x1b[0m', err.message);
  process.exit(1);
});

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));
const command = flags.has('--version') ? 'version' : positional[0] || 'watch';
const json = flags.has('--json');

// Exit code the watcher uses to ask the supervisor for a fresh process.
const RESTART = 75;

// ════ build ════

async function runBuild() {
  const result = await build();
  if (json) {
    const { css, ...rest } = result;
    process.stdout.write(JSON.stringify(rest, null, 2) + '\n');
  } else {
    result.warnings.forEach((w) => console.warn(w));
    if (result.ok) console.log(`√ Elevate CSS Compilation Successful! (${path.relative(process.cwd(), result.file || '') || result.file})`);
    else console.log('\x1b[31m%s\x1b[0m', `× Compilation failed: ${result.error}`);
  }
  process.exit(result.ok ? 0 : 1);
}

// ════ check ════

function runCheck() {
  const value = positional.slice(1).join(' ');
  if (!value.trim()) {
    console.log('Give the classes to check, in quotes: npm run elevate -- check "row gap:d4 /md/ col"');
    process.exit(2);
  }
  const result = validate(value);
  if (json) {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } else if (result.ok) {
    console.log(`√ ${result.classes.length} class${result.classes.length === 1 ? '' : 'es'} OK`);
  } else {
    result.problems.forEach((p) => console.log('\x1b[31m%s\x1b[0m', `× ${p.token}: ${p.message}`));
  }
  process.exit(result.ok ? 0 : 1);
}

// ════ describe ════

function runDescribe() {
  const out = args.find((a) => a.startsWith('--out='))?.slice('--out='.length);
  const text = JSON.stringify(describe(), null, 2) + '\n';
  if (out) {
    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    fs.writeFileSync(out, text, 'utf8');
    console.log(`√ Design system written to ${out}`);
  } else {
    process.stdout.write(text);
  }
}

// ════ watch: supervisor ════
// Tokens, rules and config are loaded once per process, so a change to them
// needs a fresh process. The supervisor runs the watcher as a child and starts
// a new one whenever it exits with RESTART.

function supervise() {
  const script = fileURLToPath(import.meta.url);
  let child: ReturnType<typeof spawn> | null = null;
  let stopping = false;
  const start = () => {
    child = spawn(process.execPath, [...process.execArgv, script, ...args], {
      stdio: 'inherit',
      env: { ...process.env, ELEVATE_WORKER: '1' },
    });
    child.on('exit', (code, signal) => {
      if (code === RESTART && !stopping) {
        start();
        return;
      }
      process.exit(code ?? (signal ? 0 : 1));
    });
  };
  const stop = (signal: NodeJS.Signals) => {
    stopping = true;
    if (child && child.exitCode === null) child.kill(signal);
    else process.exit(0);
  };
  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));
  start();
}

// ════ watch: worker ════

function watch() {
  const debugWatch = Boolean(process.env.ELEVATE_DEBUG_WATCH);
  const logDebug = (message: string) => {
    if (!debugWatch) return;
    try {
      fs.appendFileSync(path.resolve('elevate.debug.log'), `${new Date().toISOString()} ${message}\n`, 'utf8');
    } catch {
      // ignore logging failures
    }
  };

  const elevateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const watchDirs = watchFolders(config.Watch).map((d) => path.resolve(d));
  const extendFiles = new Set(config.Extend.map((f) => normalizePath(f)));
  const ext = (p: string) => path.extname(p).toLowerCase().substring(1);
  const inside = (p: string, dir: string) => {
    const rel = path.relative(normalizePath(dir), normalizePath(p));
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  };
  const inWatch = (p: string) => watchDirs.some((d) => inside(p, d));
  const isTemplate = (p: string) => inWatch(p) && config.FileTypes.includes(ext(p));
  const isExtend = (p: string) => extendFiles.has(normalizePath(p));
  const isSystem = (p: string) =>
    inside(p, elevateDir) && !inWatch(p) && ['ts', 'js', 'mjs', 'cjs', 'json'].includes(ext(p));

  const recentRewrites = new Map<string, number>();
  const lastFileMtime = new Map<string, number>();
  const lastFileHash = new Map<string, string>();
  let suppressWatchUntil = 0;
  let isCompiling = false;
  let compileQueued = false;
  let restarting = false;

  const compile = async () => {
    const spinner = ora({ text: 'Elevating Your CSS..', color: 'magentaBright', spinner: 'dots' }).start();
    const result = await build();
    result.rewrites.forEach((r) => {
      const normalized = normalizePath(r.file);
      recentRewrites.set(normalized, Date.now());
      suppressWatchUntil = Date.now() + 1500;
      try {
        lastFileMtime.set(normalized, fs.statSync(r.file).mtimeMs);
        lastFileHash.set(normalized, createHash('sha1').update(r.content).digest('hex'));
      } catch {
        // ignore stat/hash update
      }
      logDebug(`[rewrite] ${normalized}`);
    });
    if (result.rewrites.length) spinner.info('Env rewrite applied.');
    if (result.ok) {
      spinner.succeed('Elevate CSS Compilation Successful!');
      logDebug('[compile] success');
    } else {
      spinner.fail(`Compilation failed: ${result.error}`);
      logDebug(`[compile] fail ${result.error}`);
    }
    result.warnings.forEach((w) => console.warn(w));
  };

  const runCompile = async () => {
    if (isCompiling) {
      compileQueued = true;
      logDebug('[compile] queued while compiling');
      return;
    }
    isCompiling = true;
    logDebug('[compile] start');
    try {
      await compile();
    } finally {
      isCompiling = false;
      if (compileQueued) {
        compileQueued = false;
        logDebug('[compile] dequeued');
        if (!debugWatch) console.clear();
        runCompile();
      }
    }
  };

  const restart = (filePath: string) => {
    if (restarting) return;
    restarting = true;
    console.log(`Design system changed (${path.relative(process.cwd(), filePath)}). Restarting...`);
    watcher.close().finally(() => process.exit(RESTART));
  };

  // True when a change event carries new content; false for duplicate events
  // and for edits Elevate made itself.
  const isRealChange = (filePath: string) => {
    if (Date.now() < suppressWatchUntil) {
      logDebug('[watch] suppressed change event');
      return false;
    }
    const absPath = normalizePath(filePath);
    const recent = recentRewrites.get(absPath);
    if (recent && Date.now() - recent < 750) {
      recentRewrites.delete(absPath);
      return false;
    }
    try {
      const stat = fs.statSync(absPath);
      const lastMtime = lastFileMtime.get(absPath);
      if (lastMtime && stat.mtimeMs === lastMtime) return false;
      let hash = '';
      try {
        hash = createHash('sha1').update(fs.readFileSync(absPath, 'utf8')).digest('hex');
      } catch {
        // If we can't read file content, fall back to mtime only.
      }
      const lastHash = lastFileHash.get(absPath);
      lastFileMtime.set(absPath, stat.mtimeMs);
      if (hash && lastHash === hash) return false;
      if (hash) lastFileHash.set(absPath, hash);
      logDebug(`[watch] change ${absPath} mtime=${stat.mtimeMs} hash=${hash || 'n/a'}`);
    } catch {
      // If we can't stat the file, continue and let the compiler rescan.
    }
    return true;
  };

  const forget = (filePath: string) => {
    const absPath = normalizePath(filePath);
    lastFileMtime.delete(absPath);
    lastFileHash.delete(absPath);
  };

  const recompile = () => {
    if (!debugWatch) console.clear();
    runCompile();
  };

  const targets = [...watchDirs, elevateDir, ...config.Extend.map((f) => path.resolve(f))].filter((p) => fs.existsSync(p));
  watchDirs.filter((d) => !fs.existsSync(d)).forEach((d) => console.warn(`Watch folder not found: ${d}. Create it and restart Elevate.`));

  const watcher = chokidar.watch(Array.from(new Set(targets)), {
    persistent: true,
    ignoreInitial: true,
    ignored: (p: string) => {
      const base = path.basename(p);
      if (base === 'node_modules' || base === 'elevate.env.json' || base === 'elevate.debug.log') return true;
      if (base.startsWith('.') && p !== process.cwd()) return true;
      return p.endsWith('.css') && !isExtend(p);
    },
    awaitWriteFinish: {
      stabilityThreshold: 250,
      pollInterval: 50,
    },
    interval: 1000,
    binaryInterval: 300,
  });

  watcher.on('ready', () => {
    if (!debugWatch) console.clear();
    console.log('Elevate CSS is watching for changes...');
    runCompile();
  });

  watcher.on('change', (filePath: string) => {
    if (isSystem(filePath)) return restart(filePath);
    if (!isTemplate(filePath) && !isExtend(filePath)) return;
    if (isRealChange(filePath)) recompile();
  });

  watcher.on('add', (filePath: string) => {
    if (isSystem(filePath)) return restart(filePath);
    if (!isTemplate(filePath) && !isExtend(filePath)) return;
    if (isRealChange(filePath)) recompile();
  });

  watcher.on('unlink', (filePath: string) => {
    forget(filePath);
    if (isSystem(filePath)) return restart(filePath);
    if (isTemplate(filePath) || isExtend(filePath)) recompile();
  });

  watcher.on('unlinkDir', (dirPath: string) => {
    if (inWatch(dirPath)) recompile();
  });

  const shutdown = () => {
    console.log('Elevate CSS is shutting down...');
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// ════ dispatch ════

switch (command) {
  case 'watch':
    if (process.env.ELEVATE_WORKER === '1') watch();
    else supervise();
    break;
  case 'build':
    runBuild();
    break;
  case 'check':
    runCheck();
    break;
  case 'describe':
    runDescribe();
    break;
  case 'version':
    console.log(VERSION);
    break;
  default:
    console.log(`Unknown command "${command}". Use watch, build, check or describe.`);
    process.exit(2);
}
