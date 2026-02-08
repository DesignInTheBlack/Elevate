// ╔════════════════════════════════════════════════════════════════════╗
// ║                          MODULE IMPORTS                            ║
// ╚════════════════════════════════════════════════════════════════════╝

import { elevateCompiler } from './parser.js';
import { findClassAttributes } from './scan.js';
import { getBreakpointPriority } from './utility.js';
import { writeToFile } from './utility.js';
import { getModifierValue } from './utility.js';
import { config } from '../config/elevate.js'
import fs from 'fs';
import { createHash } from 'crypto';
import chokidar from 'chokidar';
import ora from 'ora';
import path from 'path';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const recentRewrites = new Map<string, number>();
const envRegistryPath = path.resolve('elevate.env.json');
let isCompiling = false;
let compileQueued = false;
const lastFileMtime = new Map<string, number>();
const lastFileHash = new Map<string, string>();
const debugWatch = Boolean(process.env.ELEVATE_DEBUG_WATCH);
let suppressWatchUntil = 0;

const normalizePath = (p: string) => {
  const resolved = path.resolve(p);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
};

const logDebug = (message: string) => {
  if (!debugWatch) return;
  try {
    fs.appendFileSync(path.resolve('elevate.debug.log'), `${new Date().toISOString()} ${message}\n`, 'utf8');
  } catch {
    // ignore logging failures
  }
};

const getEnvDefineName = (token: string): string | null => {
  const match = token.match(/^env:([a-zA-Z0-9-]+)$/);
  return match ? match[1] : null;
};

const getEnvOpenName = (token: string): string | null => {
  const match = token.match(/^env:([a-zA-Z0-9-]+):open$/);
  return match ? match[1] : null;
};

const isEnvToken = (token: string) => Boolean(getEnvDefineName(token) || getEnvOpenName(token));
const isCtxToken = (token: string) => token.startsWith('ctx:');
const isBreakpointToken = (token: string) => /^\/[a-zA-Z0-9_-]{1,5}\/$/.test(token);

const loadEnvRegistry = (): Record<string, string[]> => {
  try {
    if (!fs.existsSync(envRegistryPath)) return {};
    const raw = fs.readFileSync(envRegistryPath, 'utf8');
    if (!raw.trim()) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if (parsed.aliases && typeof parsed.aliases === 'object') return parsed.aliases;
      return parsed as Record<string, string[]>;
    }
    return {};
  } catch (err) {
    console.warn('Warning: failed to read elevate.env.json; starting with empty registry.');
    return {};
  }
};

const saveEnvRegistry = (registry: Record<string, string[]>) => {
  const payload = { aliases: registry };
  fs.writeFileSync(envRegistryPath, JSON.stringify(payload, null, 2), 'utf8');
};

const compileOnce = async () => {
  const spinner = ora({
    text: 'Elevating Your CSS..',
    color: 'magentaBright',
    spinner: 'dots'
  }).start();

  if (!config.Watch || !config.FileTypes) {
    throw new Error('Invalid configuration: Watch directory and FileTypes must be specified');
  }

  try {
    // ╔════════════════════════════════════════════════════════════════════╗
    // ║                        1. SCAN FILES                               ║
    // ║ Scan the files in the provided directory and retrieve class lists. ║
    // ╚════════════════════════════════════════════════════════════════════╝

    spinner.text = 'Scanning files for Elevate classes...';
    let scannedClasses;
    try {
      scannedClasses = findClassAttributes(config.Watch, config.FileTypes);
    } catch (err: any) {
      console.error('Failed to scan for classes:', err.message);
      return;
    }

    if (!scannedClasses || scannedClasses.length === 0) {
      console.warn('No classes found in the specified files.');
    }

    // -------------------------------------------------------------
    // ENV REGISTRY PRE-PASS (definitions + open rewrites)
    // -------------------------------------------------------------
    const envRegistry = loadEnvRegistry();
    let registryUpdated = false;

    // Pass 1: capture env definitions
    scannedClasses.forEach((instance: any) => {
      const classList: string[] = instance.classes || [];
      const envDefines = classList
        .map((token) => getEnvDefineName(token))
        .filter(Boolean) as string[];
      const envOpens = classList
        .map((token) => getEnvOpenName(token))
        .filter(Boolean) as string[];
      const envOpenSet = new Set(envOpens);
      const envTargets = Array.from(new Set([...envDefines, ...envOpens]));

      if (envTargets.length === 0) return;

      const capturedTokens = classList.filter(
        (token) => !isEnvToken(token) && !isCtxToken(token)
      );
      const nonTrivialTokens = capturedTokens.filter(
        (token) => !isBreakpointToken(token)
      );

      // If there are no non-env, non-breakpoint tokens, treat as usage only
      if (nonTrivialTokens.length === 0) return;

      // Validate captured tokens so env aliases can't include non-Elevate tokens
      capturedTokens.forEach((token) => {
        if (isBreakpointToken(token) || isEnvToken(token) || isCtxToken(token)) return;
        try {
          const ast = elevateCompiler(token, { fileName: instance.file, lineNumber: instance.lineNumber });
          if (!ast) {
            throw new Error('Unable to parse token');
          }
          if (ast.selectorMode) {
            throw new Error('Combinator directives are not allowed inside env aliases');
          }
        } catch (err: any) {
          throw new Error(
`\\n\\nInvalid env definition token "${token}" in ${instance.file} on line ${instance.lineNumber}.\\n${err?.message || ''}\\n`
          );
        }
      });

      envTargets.forEach((name) => {
        const existing = envRegistry[name];
        const next = capturedTokens;
        if (existing) {
          if (existing.join(' ') !== next.join(' ')) {
            if (envOpenSet.has(name)) {
              envRegistry[name] = next;
              registryUpdated = true;
            } else {
              throw new Error(
`\\n\\nEnv Conflict: env:${name} is defined with different tokens.\\n\\nExisting:\\n${existing.join(' ')}\\n\\nNew:\\n${next.join(' ')}\\n`
              );
            }
          }
        } else {
          envRegistry[name] = next;
          registryUpdated = true;
        }
      });

      instance.envDefinition = true;
    });

    if (registryUpdated) {
      saveEnvRegistry(envRegistry);
    }

    // Pass 2: rewrite env:Name:open and auto-condense definitions
    const rewritesByFile = new Map<string, { start: number; end: number; replacement: string }[]>();
    scannedClasses.forEach((instance: any) => {
      const rawTokens = Array.isArray(instance.rawTokens)
        ? instance.rawTokens
        : (instance.rawValue || '').match(/(?:\([^)]*\)|\S+)/g) || [];
      const envOpenNames = rawTokens.map((token) => getEnvOpenName(token)).filter(Boolean) as string[];
      const envDefineNames = rawTokens.map((token) => getEnvDefineName(token)).filter(Boolean) as string[];

      if (!instance.isStatic && envOpenNames.length > 0) {
        console.warn(`Skipping env:open rewrite in dynamic class string (${instance.file}:${instance.lineNumber}).`);
        return;
      }

      // Prefer env:open expansion when present and not already expanded
      if (envOpenNames.length > 0) {
        const nonEnvTokens = rawTokens.filter(
          (token) => !isEnvToken(token) && !isCtxToken(token) && !isBreakpointToken(token)
        );
        if (nonEnvTokens.length === 0) {
          const openSet = new Set(envOpenNames);
          const expanded: string[] = [];
          let changed = false;

          rawTokens.forEach((token) => {
            const openName = getEnvOpenName(token);
            if (openName) {
              const aliasTokens = envRegistry[openName];
              if (!aliasTokens) {
                console.warn(`env:${openName}:open has no definition; skipping rewrite.`);
                expanded.push(token);
                return;
              }
              // Keep the :open marker in the expanded list so it stays open until explicitly closed.
              expanded.push(`env:${openName}:open`, ...aliasTokens);
              changed = true;
              return;
            }
            const defineName = getEnvDefineName(token);
            if (defineName && openSet.has(defineName)) {
              return;
            }
            expanded.push(token);
          });

          if (changed) {
            if (typeof instance.valueStart !== 'number' || typeof instance.valueEnd !== 'number') {
              console.warn(`Missing offsets for env:open rewrite in ${instance.file}:${instance.lineNumber}.`);
              return;
            }
            const replacement = expanded.join(' ');
            if (replacement === String(instance.rawValue || '').trim()) {
              return;
            }
            const fileKey = normalizePath(instance.file);
            const fileRewrites = rewritesByFile.get(fileKey) || [];
            fileRewrites.push({
              start: instance.valueStart,
              end: instance.valueEnd,
              replacement,
            });
            rewritesByFile.set(fileKey, fileRewrites);
          }
          return;
        }
        // Already expanded (user editing) or includes other tokens; skip auto-condense
        return;
      }

      // Auto-condense definitions when no :open marker is present
      if (envDefineNames.length === 1) {
        const name = envDefineNames[0];
        const capturedTokens = rawTokens.filter(
          (token) => !isEnvToken(token) && !isCtxToken(token)
        );
        const nonTrivialTokens = capturedTokens.filter(
          (token) => !isBreakpointToken(token)
        );
        if (nonTrivialTokens.length > 0) {
          if (!instance.isStatic) {
            console.warn(`Skipping env auto-condense in dynamic class string (${instance.file}:${instance.lineNumber}).`);
            return;
          }
          if (typeof instance.valueStart !== 'number' || typeof instance.valueEnd !== 'number') {
            console.warn(`Missing offsets for env auto-condense in ${instance.file}:${instance.lineNumber}.`);
            return;
          }
          const replacement = `env:${name}`;
          if (replacement === String(instance.rawValue || '').trim()) {
            return;
          }
          const fileKey = normalizePath(instance.file);
          const fileRewrites = rewritesByFile.get(fileKey) || [];
          fileRewrites.push({
            start: instance.valueStart,
            end: instance.valueEnd,
            replacement,
          });
          rewritesByFile.set(fileKey, fileRewrites);
        }
      } else if (envDefineNames.length > 1) {
        console.warn(`Multiple env definitions in one class list (${instance.file}:${instance.lineNumber}). Skipping auto-condense.`);
      }
    });

    if (rewritesByFile.size > 0) {
      rewritesByFile.forEach((replacements, filePath) => {
        const original = fs.readFileSync(filePath, 'utf8');
        const sorted = replacements.sort((a, b) => b.start - a.start);
        let updated = original;
        sorted.forEach((rep) => {
          updated = updated.slice(0, rep.start) + rep.replacement + updated.slice(rep.end);
        });
        fs.writeFileSync(filePath, updated, 'utf8');
        const normalized = normalizePath(filePath);
        recentRewrites.set(normalized, Date.now());
        suppressWatchUntil = Date.now() + 1500;
        try {
          const stat = fs.statSync(filePath);
          lastFileMtime.set(normalized, stat.mtimeMs);
          const hash = createHash('sha1').update(updated).digest('hex');
          lastFileHash.set(normalized, hash);
        } catch {
          // ignore stat/hash update
        }
        logDebug(`[rewrite] ${normalized} replacements=${replacements.length}`);
      });
      spinner.info('Env rewrite applied. Recompiling...');
      // Re-run compile after rewrite completes
      await delay(50);
      compileQueued = true;
      logDebug(`[compile] queued after rewrite files=${rewritesByFile.size}`);
      return;
    }

    // ╔════════════════════════════════════════════════════════════════════╗
    // ║                  2. INITIALIZE DATA STRUCTURES                     ║
    // ║ Define the compiledClasses array and placeholder for types.        ║
    // ╚════════════════════════════════════════════════════════════════════╝

    spinner.text = 'Processing class definitions...';
    let compiledClasses: any[] = [];
    const scopeByFile = new Map<string, string[]>();

    // ╔════════════════════════════════════════════════════════════════════╗
    // ║                    3. Establish Breakpoints                        ║
    // ║ Process classes by breakpoints, using elevateCompiler.             ║
    // ║ - Detects breakpoints                                              ║
    // ║ - Adds them to class objects                                       ║
    // ╚════════════════════════════════════════════════════════════════════╝

    function establishBreakpoints(instance: any) {
      if (!instance || !instance.classes) {
        throw new Error('Invalid class instance provided');
      }
      let lastBreak = '';
      let classList = instance.classes;
      const fileKey = normalizePath(instance.file);
      let scopeStack = scopeByFile.get(fileKey);
      if (!scopeStack) {
        scopeStack = [];
        scopeByFile.set(fileKey, scopeStack);
      }

      classList.forEach(function (classString: string) {
        if (!classString.startsWith('-') && !config.SafeList.includes(classString)) {
          if (classString.startsWith('ctx:')) {
            if (classString === 'ctx:end') {
              if (scopeStack.length === 0) {
                console.warn('ctx:end encountered with no open ctx scope.');
              } else {
                scopeStack.pop();
              }
              return;
            }

            if (classString.startsWith('ctx:end:')) {
              const name = classString.slice('ctx:end:'.length);
              const expected = `ctx:${name}`;
              const top = scopeStack[scopeStack.length - 1];
              if (top !== expected) {
                console.warn(`ctx:end:${name} does not match the current scope (${top || 'none'}).`);
              } else {
                scopeStack.pop();
              }
              return;
            }

            scopeStack.push(classString);
            return;
          }

          if (isEnvToken(classString)) {
            return;
          }

          const regex = /\/[a-zA-Z0-9]{1,3}\//;
          // ════ Mobile-First Breakpoint Processing ════
          if (regex.test(classString)) {
            lastBreak = classString;
            return;
          }

          let classObject = elevateCompiler(classString, { fileName: instance.file, lineNumber: instance.lineNumber });
          classObject.breakpoint = lastBreak;
          classObject.scope = scopeStack.length ? [...scopeStack] : null;

          compiledClasses.push(classObject);
        }
      });

    }

    function compileEnvAlias(name: string, tokens: string[], forcedBreakpoint?: string | null) {
      let lastBreak = '';
      tokens.forEach((token) => {
        if (isCtxToken(token) || isEnvToken(token)) return;

        if (isBreakpointToken(token)) {
          lastBreak = token;
          return;
        }

        let classObject;
        try {
          classObject = elevateCompiler(token, { fileName: `env:${name}`, lineNumber: 0 });
        } catch (err: any) {
          throw new Error(`\\n\\nInvalid env:${name} token "${token}".\\n${err?.message || ''}\\n`);
        }
        if (!classObject) {
          throw new Error(`\\n\\nInvalid env:${name} token "${token}".\\nUnable to parse token.\\n`);
        }
        if (classObject.selectorMode) {
          throw new Error(`\\n\\nInvalid env:${name} token "${token}".\\nCombinator directives are not allowed inside env aliases.\\n`);
        }
        classObject.breakpoint = lastBreak || forcedBreakpoint || '';
        classObject.scope = null;
        classObject.className = `env:${name}`;
        compiledClasses.push(classObject);
      });
    }

    // ╔════════════════════════════════════════════════════════════════════╗
    // ║                   4. MAP SCANNED CLASSES                           ║
    // ║ Apply the `structureClasses` function to each scanned class.       ║
    // ╚════════════════════════════════════════════════════════════════════╝
    scannedClasses.map(establishBreakpoints);
    scopeByFile.forEach((stack, fileKey) => {
      if (stack.length > 0) {
        console.warn(`Unclosed ctx scopes in ${fileKey} (last open: ${stack[stack.length - 1]}).`);
      }
    });
    Object.entries(envRegistry).forEach(([name, tokens]) => {
      compileEnvAlias(name, tokens);
    });

    // Pass 3: compile env usage with breakpoint scoping
    scannedClasses.forEach((instance: any) => {
      if (!instance || !instance.classes) return;
      let lastBreak = '';
      (instance.classes as string[]).forEach((token) => {
        if (isBreakpointToken(token)) {
          lastBreak = token;
          return;
        }
        const envName = getEnvDefineName(token);
        if (envName && envRegistry[envName]) {
          compileEnvAlias(envName, envRegistry[envName], lastBreak || null);
        }
      });
    });

    // ╔════════════════════════════════════════════════════════════════════╗
    // ║                  5. SORT COMPILED CLASSES                          ║
    // ║ Sort classes by breakpoint priority using getBreakpointPriority.   ║
    // ║ Empty breakpoints are prioritized first.                           ║
    // ╚════════════════════════════════════════════════════════════════════╝
    spinner.text = 'Organizing and sorting classes...';
    compiledClasses.sort((a, b) => {
      // Handle empty breakpoints (put them first)
      if (!a.breakpoint) return -1;
      if (!b.breakpoint) return 1;

      return getBreakpointPriority(a.breakpoint) - getBreakpointPriority(b.breakpoint);
    });

    // Deduplicate classes
    const uniqueClasses = new Map<string, any>();
    compiledClasses.forEach(item => {
      const scopeKey = Array.isArray(item.scope) ? item.scope.join(' ') : (item.scope || '');
      const stateKey = Array.isArray(item.state) ? item.state.join('+') : (item.state || '');
      const selectorKey = item.selectorMode || '';
      const propertyKey = item.property || '';
      const modifierKey = Array.isArray(item.modifiers) ? item.modifiers.join('|') : '';
      const key = `${item.className}${item.breakpoint || ''}${scopeKey}${stateKey}${selectorKey}${propertyKey}${modifierKey}`;
      if (!uniqueClasses.has(key)) {
        uniqueClasses.set(key, item);
      }
    });

    // Convert back to array
    compiledClasses = Array.from(uniqueClasses.values());

    // ╔════════════════════════════════════════════════════════════════════╗
    // ║                       6. OUTPUT RESULTS                            ║
    // ║ Compile the results into a CSS file                                ║
    // ╚════════════════════════════════════════════════════════════════════╝

    // Helper function to escape special characters in class names
    await delay(100);
    const escapeClassName = (className: string) =>
      className.replace(/[@:\[\]()\/.,+#~=%?&!$^*<>{}|]/g, m => `\\${m}`);

    spinner.text = 'Generating CSS output...';
    let breakpointSupervisor: string | null = null;
    let compiledCSS = '';
    let mediaQueryOpen = false;

    const pseudoElements = new Set([
      'placeholder',
      'before',
      'after',
      'marker',
      'selection',
      'backdrop',
      'file-selector-button',
    ]);

    const buildStateSuffix = (state: string | string[] | null | undefined) => {
      if (!state) return '';
      const chain = Array.isArray(state) ? state : String(state).split('+');
      const pseudoClasses: string[] = [];
      const pseudoElems: string[] = [];

      chain.forEach((token) => {
        if (!token) return;
        if (pseudoElements.has(token)) {
          pseudoElems.push(token);
        } else {
          pseudoClasses.push(token);
        }
      });

      const classPart = pseudoClasses.length ? `:${pseudoClasses.join(':')}` : '';
      if (pseudoElems.length > 1) {
        throw new Error(`Invalid state chain: multiple pseudo-elements (${pseudoElems.join(', ')}).`);
      }
      const elemPart = pseudoElems.length ? `::${pseudoElems[0]}` : '';
      return `${classPart}${elemPart}`;
    };

    const defaultAutoGridMin = (() => {
      try {
        return getModifierValue('min-c10', { "grid-template-columns": "GridAutoMinRule" });
      } catch {
        return '10rem';
      }
    })();

    compiledClasses.forEach((item) => {

      if (item.breakpoint !== breakpointSupervisor) {
        // Close previous media query if open
        if (mediaQueryOpen) {
          compiledCSS += `}\n\n`;
          mediaQueryOpen = false;
        }

        breakpointSupervisor = item.breakpoint;

        // Open new media query if breakpoint exists
        if (breakpointSupervisor) {
          const breakpoint = getModifierValue(item.breakpoint.replace(/\//g, ''));
          if (!breakpoint) {
            throw new Error(`Invalid breakpoint value: ${item.breakpoint}`);
          }
          const breakpointTransition = `@media only screen and (min-width:${breakpoint}) {`;
          compiledCSS += `${breakpointTransition}\n`;
          mediaQueryOpen = true;
        }
      }

      const flexProperties =
        item.property === 'row'
          ? 'display:flex;\nflex-direction:row;'
          : item.property === 'col'
            ? 'display:flex;\nflex-direction:column;'
            : item.property === 'row-r'
              ? 'display:flex;\nflex-direction:row-reverse;'
              : item.property === 'col-r'
                ? 'display:flex;\nflex-direction:column-reverse;'
                : item.property === 'stack'
                  ? 'display:flex;\nflex-direction:column;'
                  : item.property === 'cluster'
                    ? 'display:flex;\nflex-direction:row;\nflex-wrap:wrap;'
                    : item.property === 'split'
                      ? 'display:grid;\ngrid-template-columns:1fr 1fr;'
                      : item.property === 'center'
                        ? 'margin-left:auto;\nmargin-right:auto;'
                        : item.property === 'grid-auto'
                          ? `display:grid;\ngrid-template-columns:repeat(auto-fit, minmax(${defaultAutoGridMin}, 1fr));`
                          : item.property === 'grid'
                            ? 'display:grid;'
                            : '';

      const modifiers = item.modifiers.map((modifier: string) => `${modifier};`).join('\n');

      const scopeChain = Array.isArray(item.scope)
        ? item.scope
        : item.scope
          ? [item.scope]
          : [];
      const scopeClasses = scopeChain.map((s: string) => `.${escapeClassName(s)}`);
      const scopeClass = scopeClasses.join(' ');
      const targetClass = `.${escapeClassName(item.className)}`;
      const stateSuffix = buildStateSuffix(item.state);

      let selectors: string[] = [];

      if (item.selectorMode) {
        if (!scopeClass) {
          throw new Error(`Combinator directive requires an active ctx scope for class "${item.className}".`);
        }

        switch (item.selectorMode) {
          case 'desc':
            selectors = [`${scopeClass} ${targetClass}${stateSuffix}`];
            break;
          case 'child':
            selectors = [`${scopeClass} > ${targetClass}${stateSuffix}`];
            break;
          case 'sibling':
            selectors = [`${scopeClass} + ${targetClass}${stateSuffix}`];
            break;
          case 'general-sibling':
            selectors = [`${scopeClass} ~ ${targetClass}${stateSuffix}`];
            break;
          case 'ancestor':
            selectors = [`${targetClass}${stateSuffix} ${scopeClass}`];
            break;
          default:
            selectors = [`${scopeClass} ${targetClass}${stateSuffix}`];
            break;
        }
      } else {
        const lastScope = scopeClasses[scopeClasses.length - 1] || '';
        const parentChain = scopeClasses.slice(0, -1).join(' ');
        const compoundTarget = lastScope
          ? `${lastScope}${targetClass}${stateSuffix}`
          : `${targetClass}${stateSuffix}`;
        const selfSelector = parentChain ? `${parentChain} ${compoundTarget}` : compoundTarget;
        const descendantSelector = scopeClass
          ? `${scopeClass} ${targetClass}${stateSuffix}`
          : `${targetClass}${stateSuffix}`;

        // make an array of the two selectors…
        const selSet = new Set<string>();
        selSet.add(selfSelector);
        selSet.add(descendantSelector);
        selectors = Array.from(selSet);
      }

      // and then join with a comma
      compiledCSS +=
        selectors.join(', ') +
        ' {' +
        (flexProperties ? `\n${flexProperties}` : '') +
        `\n${modifiers}\n}\n\n`;
    });

    // Close the last media query if open
    if (mediaQueryOpen) {
      compiledCSS += `}\n`;
    }

    // Write the final CSS output
    spinner.text = 'Writing CSS file...';
    if (!compiledCSS) {
      throw new Error('No CSS content generated!');
    }
    await writeToFile(compiledCSS);
    // console.clear();
    spinner.succeed('Elevate CSS Compilation Successful!');
    logDebug('[compile] success');
  } catch (error: any) {
    spinner.fail(`Compilation failed: ${error.message}`);
    logDebug(`[compile] fail ${error.message}`);
    return;
  }
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
    await compileOnce();
  } finally {
    isCompiling = false;
    if (compileQueued) {
      compileQueued = false;
      logDebug('[compile] dequeued');
      runCompile();
    }
  }
};

const watcher = chokidar.watch(config.Watch, {
  persistent: true,
  ignoreInitial: true,
  ignored: ['**/*.css', '**/elevate.env.json'],
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
});

watcher.on('change', (filePath: string) => {
  if (Date.now() < suppressWatchUntil) {
    logDebug('[watch] suppressed change event');
    return;
  }
  const absPath = normalizePath(filePath);
  const recent = recentRewrites.get(absPath);
  if (recent && Date.now() - recent < 750) {
    recentRewrites.delete(absPath);
    return;
  }
  try {
    const stat = fs.statSync(absPath);
    const lastMtime = lastFileMtime.get(absPath);
    if (lastMtime && stat.mtimeMs === lastMtime) {
      return;
    }
    let hash = '';
    try {
      const content = fs.readFileSync(absPath, 'utf8');
      hash = createHash('sha1').update(content).digest('hex');
    } catch {
      // If we can't read file content, fall back to mtime only.
    }
    const lastHash = lastFileHash.get(absPath);
    if (hash && lastHash === hash) {
      lastFileMtime.set(absPath, stat.mtimeMs);
      return;
    }
    if (hash) {
      lastFileHash.set(absPath, hash);
    }
    lastFileMtime.set(absPath, stat.mtimeMs);
    if (debugWatch) {
      console.log(`[watch] change ${absPath} mtime=${stat.mtimeMs} hash=${hash || 'n/a'}`);
    }
    logDebug(`[watch] change ${absPath} mtime=${stat.mtimeMs} hash=${hash || 'n/a'}`);
  } catch {
    // If we can't stat the file, continue and let the compiler rescan.
  }
  const ext = path.extname(filePath).toLowerCase().substring(1);
  if (config.FileTypes.includes(ext)) {
    if (!debugWatch) console.clear();
    runCompile();
  }
});

process.on('SIGINT', function () {
  console.log('Elevate CSS is shutting down...');
  process.exit(1);
});
