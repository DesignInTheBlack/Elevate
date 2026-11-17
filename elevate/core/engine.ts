// ╔════════════════════════════════════════════════════════════════════╗
// ║                          COMPILER ENGINE                           ║
// ║ Turns scanned class lists into CSS. No watcher, no spinner, and no ║
// ║ process handlers, so it can be called from code (see api.ts).      ║
// ╚════════════════════════════════════════════════════════════════════╝

import { elevateCompiler } from './parser.js';
import { getBreakpointPriority, getBreakpointWidth, getModifierValue, assembleCSS } from './utility.js';
import { scanFolders, parseClassValue, splitClassTokens } from './scan.js';
import { config } from '../config/elevate.js';
import fs from 'fs';
import path from 'path';

export type Warn = (message: string) => void;

export type ClassInstance = {
  file: string;
  lineNumber: number;
  classes: string[];
  rawValue?: string;
  rawTokens?: string[];
  valueStart?: number;
  valueEnd?: number;
  isStatic?: boolean;
  virtual?: boolean;
  envDefinition?: boolean;
};

export type FileRewrite = { file: string; content: string };

const envRegistryPath = path.resolve('elevate.env.json');

export const normalizePath = (p: string) => {
  const resolved = path.resolve(p);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
};

const getEnvDefineName = (token: string): string | null => {
  const match = token.match(/^env:([a-zA-Z0-9-]+)$/);
  return match ? match[1] : null;
};

const getEnvOpenName = (token: string): string | null => {
  const match = token.match(/^env:([a-zA-Z0-9-]+):open$/);
  return match ? match[1] : null;
};

// Escapes any class name for use in a CSS selector (like CSS.escape)
const cssEscape = (value: string) =>
  value.replace(/^(-?)(\d)/, (_m, dash, d) => `${dash}\\3${d} `)
    .replace(/[^a-zA-Z0-9_\-\u0080-\uFFFF\\ ]/g, (ch) => `\\${ch}`);

const isEnvToken = (token: string) => Boolean(getEnvDefineName(token) || getEnvOpenName(token));
const isCtxToken = (token: string) => token.startsWith('ctx:');
const isBreakpointToken = (token: string) => /^\/[a-zA-Z0-9_-]{1,12}\/$/.test(token);
const isMarkerToken = (token: string) => /^\/[a-zA-Z0-9_-]{1,12}\/$/.test(token);

export const loadEnvRegistry = (warn: Warn = console.warn): Record<string, string[]> => {
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
    warn('Failed to read elevate.env.json; starting with an empty env registry.');
    return {};
  }
};

export const saveEnvRegistry = (registry: Record<string, string[]>) => {
  const payload = { aliases: registry };
  fs.writeFileSync(envRegistryPath, JSON.stringify(payload, null, 2), 'utf8');
};


// ════ Env pre-pass ════
// Records env definitions in the registry, and works out the source edits that
// expand env:Name:open markers and condense definitions. Edits are returned,
// not written, so the caller decides whether files may change.
export function prepareEnv(
  scannedClasses: ClassInstance[],
  envRegistry: Record<string, string[]>,
  warn: Warn = console.warn
): { registryUpdated: boolean; rewrites: FileRewrite[] } {
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

    // Pass 2: rewrite env:Name:open and auto-condense definitions
    const rewritesByFile = new Map<string, { start: number; end: number; replacement: string }[]>();
    scannedClasses.forEach((instance: any) => {
      if (instance.virtual) return;
      const rawTokens = Array.isArray(instance.rawTokens)
        ? instance.rawTokens
        : (instance.rawValue || '').match(/(?:\([^)]*\)|\S+)/g) || [];
      const envOpenNames = rawTokens.map((token) => getEnvOpenName(token)).filter(Boolean) as string[];
      const envDefineNames = rawTokens.map((token) => getEnvDefineName(token)).filter(Boolean) as string[];

      if (!instance.isStatic && envOpenNames.length > 0) {
        warn(`Skipping env:open rewrite in dynamic class string (${instance.file}:${instance.lineNumber}).`);
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
                warn(`env:${openName}:open has no definition; skipping rewrite.`);
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
              warn(`Missing offsets for env:open rewrite in ${instance.file}:${instance.lineNumber}.`);
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
            warn(`Skipping env auto-condense in dynamic class string (${instance.file}:${instance.lineNumber}).`);
            return;
          }
          if (typeof instance.valueStart !== 'number' || typeof instance.valueEnd !== 'number') {
            warn(`Missing offsets for env auto-condense in ${instance.file}:${instance.lineNumber}.`);
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
        warn(`Multiple env definitions in one class list (${instance.file}:${instance.lineNumber}). Skipping auto-condense.`);
      }
    });

    const rewrites: FileRewrite[] = [];
    rewritesByFile.forEach((replacements, filePath) => {
        const original = fs.readFileSync(filePath, 'utf8');
        const sorted = replacements.sort((a, b) => b.start - a.start);
        let updated = original;
        sorted.forEach((rep) => {
            updated = updated.slice(0, rep.start) + rep.replacement + updated.slice(rep.end);
        });
        rewrites.push({ file: filePath, content: updated });
    });
    return { registryUpdated, rewrites };
}

// ════ CSS generation ════
// Turns scanned class lists into the compiled rules (without the reset,
// contain rules or Extend files). Throws on the first invalid class.
export function generateCSS(
  scannedClasses: ClassInstance[],
  envRegistry: Record<string, string[]>,
  warn: Warn = console.warn
): string {
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

      const getFutureCtxTokens = (fromIndex: number) => {
        const future: string[] = [];
        for (let i = fromIndex + 1; i < classList.length; i++) {
          const token = classList[i];
          if (!token.startsWith('ctx:')) continue;
          if (token === 'ctx:end' || token.startsWith('ctx:end:')) continue;
          if (!future.includes(token)) future.push(token);
        }
        return future;
      };

      classList.forEach(function (classString: string, index: number) {
        if (!classString.startsWith('-') && !config.SafeList.includes(classString)) {
          if (classString.startsWith('ctx:')) {
            if (classString === 'ctx:end') {
              if (scopeStack.length === 0) {
                warn('ctx:end encountered with no open ctx scope.');
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
                warn(`ctx:end:${name} does not match the current scope (${top || 'none'}).`);
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

          // ════ Mobile-First Breakpoint Processing ════
          // A marker is a whole class like /md/. Anchored, so a pass-through value
          // such as bg-img:(url(/img/a.jpg)) is never mistaken for one.
          if (isMarkerToken(classString)) {
            // Mobile first: a marker applies to every class after it, so the
            // sizes read smallest to largest. One that goes backwards usually
            // means a class has landed in the wrong group.
            const rank = getBreakpointPriority(classString);
            const before = lastBreak ? getBreakpointPriority(lastBreak) : -1;
            if (lastBreak && rank >= 0 && rank <= before) {
              const where = instance.file ? ` in ${instance.file} on line ${instance.lineNumber}` : '';
              warn(rank === before
                ? `Breakpoint written twice: ${classString} appears more than once in one class list${where}. Put its classes together after a single ${classString}.`
                : `Breakpoints out of order: ${classString} comes after ${lastBreak} in one class list${where}. A marker applies to every class after it, so write the sizes smallest first and keep each size's classes behind its own marker.`);
            }
            lastBreak = classString;
            return;
          }

          let classObject = elevateCompiler(classString, { fileName: instance.file, lineNumber: instance.lineNumber });
          classObject.breakpoint = lastBreak;
          let scopeChain = scopeStack.length ? [...scopeStack] : [];
          if (classObject.selectorMode) {
            const futureCtx = getFutureCtxTokens(index);
            futureCtx.forEach((token) => {
              if (!scopeChain.includes(token)) scopeChain.push(token);
            });
          }
          classObject.scope = scopeChain.length ? scopeChain : null;

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
        classObject.breakpoint = lastBreak || forcedBreakpoint || '';
        classObject.scope = classObject.selectorMode ? [`env:${name}`] : null;
        classObject.className = `env:${name}`;
        compiledClasses.push(classObject);
      });
    }

    // ╔════════════════════════════════════════════════════════════════════╗
    // ║                   4. MAP SCANNED CLASSES                           ║
    // ║ Apply the `structureClasses` function to each scanned class.       ║
    // ╚════════════════════════════════════════════════════════════════════╝
    scannedClasses.map(establishBreakpoints);

    // ════ Responsive isolation ════
    // Class names are global, but breakpoints belong to elements. If one element
    // writes `col /lg/ grid` and another writes `row /lg/ col`, the lg copy of
    // `.col` must not reach the first element, and a plain rule
    // must not reach elements that only use it from lg. So each rule for a
    // class is limited to the elements that use that class at that rule's
    // breakpoint. An element is identified by its whole set of classes, which
    // works whatever order the browser sees them in.
    const rankOf = (bp: string) => (bp ? getBreakpointPriority(bp) : -1);
    type Use = { ranks: Set<number>; selector: string; tokens: Set<string>; where: string };
    const uses = new Map<string, Use[]>();
    const dynamicTokens = new Set<string>();
    scannedClasses.forEach((instance: any) => {
      const list: string[] = instance.classes || [];
      const tokens = new Set(list);
      const ranks = new Map<string, Set<number>>();
      let rank = -1;
      list.forEach((token) => {
        if (isMarkerToken(token)) {
          rank = rankOf(token);
          return;
        }
        if (!ranks.has(token)) ranks.set(token, new Set());
        ranks.get(token)!.add(rank);
      });
      const selector = Array.from(tokens).map((t) => `.${cssEscape(t)}`).join('');
      ranks.forEach((r, token) => {
        if (!instance.isStatic) {
          dynamicTokens.add(token);
          return;
        }
        const list = uses.get(token) || [];
        // The same classes at the same breakpoints are one kind of element.
        // The same classes at different breakpoints stay separate, and the
        // check below reports them, since CSS can't tell them apart.
        const key = Array.from(r).sort().join(',');
        if (!list.some((u) => u.selector === selector && Array.from(u.ranks).sort().join(',') === key)) {
          list.push({ ranks: new Set(r), selector, tokens, where: `${instance.file}:${instance.lineNumber}` });
        }
        uses.set(token, list);
      });
    });
    const warnedAmbiguity = new Set<string>();
    const isolationFor = (className: string, breakpoint: string) => {
      // Envelopes carry their own breakpoints, and dynamic class strings can't be
      // identified, so those classes keep plain, global rules.
      if (className.startsWith('env:') || dynamicTokens.has(className)) return '';
      const list = uses.get(className);
      if (!list) return '';
      const rank = rankOf(breakpoint || '');
      const here = list.filter((u) => u.ranks.has(rank));
      const elsewhere = list.filter((u) => !u.ranks.has(rank));
      if (!elsewhere.length) return '';
      // A selector made of one element's classes also matches any element that
      // carries all of them, so check which way of writing the rule is exact.
      const covers = (a: Use, b: Use) => Array.from(a.tokens).every((t) => b.tokens.has(t));
      const includeIsExact = !here.some((h) => elsewhere.some((e) => covers(h, e)));
      const excludeIsExact = !elsewhere.some((e) => here.some((h) => covers(e, h)));
      const include = `:where(${Array.from(new Set(here.map((u) => u.selector))).join(', ')})`;
      const exclude = `:where(:not(${Array.from(new Set(elsewhere.map((u) => u.selector))).join(', ')}))`;
      if (!includeIsExact && !excludeIsExact) {
        const key = `${className}@${rank}`;
        if (!warnedAmbiguity.has(key)) {
          warnedAmbiguity.add(key);
          const e = elsewhere.find((x) => here.some((h) => covers(x, h)))!;
          warn(`Responsive ambiguity: "${className}" in ${e.where} can't be told apart from an element that carries all of its classes but uses "${className}" at a different breakpoint. Add or change a class on one of them.`);
        }
      }
      // :where() adds no specificity, so rule weights are unchanged.
      // Prefer the exact form; between two exact forms, the shorter one.
      if (excludeIsExact && (!includeIsExact || elsewhere.length <= here.length)) return exclude;
      if (includeIsExact) return include;
      return exclude;
    };
    scopeByFile.forEach((stack, fileKey) => {
      if (stack.length > 0) {
        warn(`Unclosed ctx scopes in ${fileKey} (last open: ${stack[stack.length - 1]}).`);
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
    // Base rules first, then each breakpoint in ascending order. The sort is
    // stable, so rules keep the order they were written in within each group.
    compiledClasses.sort((a, b) => rankOf(a.breakpoint || '') - rankOf(b.breakpoint || ''));

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
    const escapeClassName = (className: string) => cssEscape(className);

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

    // States that follow an element's ARIA or open state, so a script sets
    // aria-current or aria-expanded and the styles follow, without touching
    // classes: @current:[text:ink], @expanded:[rotate:180].
    const ATTRIBUTE_STATES: Record<string, string> = {
      current: '[aria-current]:not([aria-current="false"])',
      expanded: '[aria-expanded="true"]',
      selected: '[aria-selected="true"]',
      pressed: '[aria-pressed="true"]',
      open: '[open]',
    };

    const buildStateSuffix = (state: string | string[] | null | undefined) => {
      if (!state) return '';
      const chain = Array.isArray(state) ? state : String(state).split('+');
      const pseudoClasses: string[] = [];
      const pseudoElems: string[] = [];

      const attributes: string[] = [];
      chain.forEach((token) => {
        if (!token) return;
        if (ATTRIBUTE_STATES[token]) {
          attributes.push(ATTRIBUTE_STATES[token]);
        } else if (pseudoElements.has(token)) {
          pseudoElems.push(token);
        } else {
          pseudoClasses.push(token);
        }
      });

      const classPart = pseudoClasses.length ? `:${pseudoClasses.join(':')}` : '';
      if (pseudoElems.length > 1) {
        throw new Error(
          `Invalid state chain: multiple pseudo-elements (${pseudoElems.join(', ')}). CSS allows only one pseudo-element per selector.`
        );
      }
      const elemPart = pseudoElems.length ? `::${pseudoElems[0]}` : '';
      return `${attributes.join('')}${classPart}${elemPart}`;
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
          const breakpoint = getBreakpointWidth(item.breakpoint);
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
                      ? 'display:grid;\ngrid-template-columns:minmax(0,1fr) minmax(0,1fr);'
                      : item.property === 'center'
                        ? 'margin-left:auto;\nmargin-right:auto;'
                        : item.property === 'grid-auto'
                          ? `display:grid;\ngrid-template-columns:repeat(auto-fit, minmax(${defaultAutoGridMin}, 1fr));`
                          : item.property === 'grid'
                            ? 'display:grid;'
                            : item.property === 'line-clamp'
                              ? 'display:-webkit-box;\n-webkit-box-orient:vertical;\noverflow:hidden;'
                              : '';

      const modifiers = item.modifiers.map((modifier: string) => `${modifier};`).join('\n');

      const scopeChain = Array.isArray(item.scope)
        ? item.scope
        : item.scope
          ? [item.scope]
          : [];
      const scopeClasses = scopeChain.map((s: string) => `.${escapeClassName(s)}`);
      const scopeClass = scopeClasses.join(' ');
      const targetClass = `.${escapeClassName(item.className)}${isolationFor(item.className, item.breakpoint)}`;
      const targetSelector =
        item.selectorTarget === 'all' ? '*' : targetClass;
      const stateSuffix = buildStateSuffix(item.state);

      let selectors: string[] = [];

      if (item.selectorMode) {
        if (!scopeClass) {
          throw new Error(`Combinator directive requires an active ctx scope for class "${item.className}".`);
        }

        switch (item.selectorMode) {
          case 'desc':
            selectors = [`${scopeClass} ${targetSelector}${stateSuffix}`];
            break;
          case 'child':
            selectors = [`${scopeClass} > ${targetSelector}${stateSuffix}`];
            break;
          case 'sibling':
            selectors = [`${scopeClass} + ${targetSelector}${stateSuffix}`];
            break;
          case 'general-sibling':
            selectors = [`${scopeClass} ~ ${targetSelector}${stateSuffix}`];
            break;
          case 'ancestor':
            selectors = [`${scopeClass}:has(${targetSelector}${stateSuffix})`];
            break;
          default:
            selectors = [`${scopeClass} ${targetSelector}${stateSuffix}`];
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

    if (!compiledCSS) {
      throw new Error('No CSS content generated!');
    }
    return compiledCSS;
}

export type CompileOptions = {
  // Update elevate.env.json and rewrite env markers in source files. Default true.
  files?: boolean;
  // Extra class attribute values to compile, as if they were in a template.
  extra?: string[];
};

export type CompileResult = {
  ok: boolean;
  css: string;          // the full stylesheet, ready to write ('' when ok is false)
  error?: string;       // the first error, in the same words the watcher prints
  warnings: string[];
  rewrites: FileRewrite[]; // source files changed by env rewrites
};

// Scans the watched folders and compiles the whole stylesheet. Never throws.
export async function compileProject(options: CompileOptions = {}): Promise<CompileResult> {
  const files = options.files !== false;
  const warnings: string[] = [];
  const warn: Warn = (m) => { warnings.push(m); };
  const rewrites: FileRewrite[] = [];
  try {
    // Env rewrites change the files being scanned, so scan again after them.
    for (let pass = 0; ; pass++) {
      const scannedClasses: ClassInstance[] = scanFolders(config.Watch, config.FileTypes, warn);
      (options.extra || []).forEach((value, i) => {
        scannedClasses.push(virtualInstance(value, `(extra ${i + 1})`, 1));
      });
      if (scannedClasses.length === 0) {
        warn('No classes found in the specified files.');
      }
      const envRegistry = loadEnvRegistry(warn);
      const env = prepareEnv(scannedClasses, envRegistry, warn);
      if (files && env.registryUpdated) saveEnvRegistry(envRegistry);
      if (files && env.rewrites.length > 0 && pass < 3) {
        env.rewrites.forEach((r) => {
          fs.writeFileSync(r.file, r.content, 'utf8');
          rewrites.push(r);
        });
        continue;
      }
      const rulesCSS = generateCSS(scannedClasses, envRegistry, warn);
      const assembled = await assembleCSS(rulesCSS);
      assembled.warnings.forEach(warn);
      return { ok: true, css: assembled.css, warnings, rewrites };
    }
  } catch (error: any) {
    return { ok: false, css: '', error: error?.message || String(error), warnings, rewrites };
  }
}

// A class list that didn't come from a file, such as a value being checked.
export function virtualInstance(value: string, file = '(class)', lineNumber = 1): ClassInstance {
  return {
    file,
    lineNumber,
    classes: parseClassValue(value.trim()).classes,
    rawValue: value,
    rawTokens: splitClassTokens(value.trim()),
    isStatic: true,
    virtual: true,
  };
}
