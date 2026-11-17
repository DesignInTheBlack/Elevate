// ╔════════════════════════════════════════════════════════════════════╗
// ║                            PUBLIC API                              ║
// ║ Use Elevate from code: build the stylesheet, check a class string, ║
// ║ or describe the design system. Import it from the project's own    ║
// ║ copy, so it uses that project's config:                            ║
// ║                                                                    ║
// ║   import { build, validate, describe } from './elevate/core/api.ts' ║
// ║                                                                    ║
// ║ Nothing here starts a watcher or touches process handlers.         ║
// ╚════════════════════════════════════════════════════════════════════╝

import { config } from '../config/elevate.js';
import { designSystem } from '../config/design.js';
import { rules as customRules } from '../config/syntax.js';
import { elevateCompiler } from './parser.js';
import { types, writeCSS, outputFile, getBreakpointPriority, siteBreakpoints } from './utility.js';
import { parseClassValue, scanFolders, watchFolders } from './scan.js';
import { declarationMap } from './system/declarationMap.js';
import { elevateRules } from './system/elevateRules.js';
import {
  compileProject,
  generateCSS,
  loadEnvRegistry,
  virtualInstance,
  type ClassInstance,
  type CompileOptions,
  type CompileResult,
} from './engine.js';
import { VERSION } from './version.js';

export { VERSION, config };
export type { ClassInstance, CompileOptions, CompileResult };

// ════ build ════

export type BuildOptions = CompileOptions & {
  // Write elevate.css to the configured Output folder. Default true.
  write?: boolean;
};

export type BuildResult = CompileResult & {
  file?: string; // where the stylesheet was written
};

// Compiles every watched template into one stylesheet. Never throws: check
// `ok`, then `error`. On failure nothing is written, so the last good
// stylesheet stays in place.
export async function build(options: BuildOptions = {}): Promise<BuildResult> {
  const result = await compileProject(options);
  if (!result.ok || options.write === false) return result;
  const file = await writeCSS(result.css);
  return { ...result, file };
}

// ════ validate ════

export type ClassProblem = {
  token: string;   // the class that is wrong, or the whole value
  message: string; // one plain sentence
  detail: string;  // the compiler's full message, with tips
};

export type ValidateResult = {
  ok: boolean;
  classes: string[]; // the tokens Elevate read from the value
  problems: ClassProblem[];
};

const isMarker = (t: string) => /^\/[a-zA-Z0-9_-]{1,12}\/$/.test(t);

// Pulls the first real sentence out of a compiler message, without the
// heading word, the "in file on line" part or the tips.
const summarize = (message: string) => {
  const first = message.trim().split('\n').find((l) => l.trim()) || message;
  return first
    .replace(/^[A-Za-z /-]+:\s+(?=[A-Z"])/, '')
    .replace(/ in \S+ on line \d+/, '')
    .trim();
};

// Checks one class attribute value, exactly as the compiler would read it in a
// template: breakpoint markers, state blocks, ctx scopes and env names included.
// It compiles the value on its own, so it catches every error a build would,
// without reading or writing any files.
export function validate(value: string): ValidateResult {
  const { classes, rejected } = parseClassValue(String(value).trim());
  const problems: ClassProblem[] = [];

  rejected.forEach((token) => {
    const message = `"${token}" can't be a class name.`;
    problems.push({ token, message, detail: message });
  });

  classes.forEach((token) => {
    if (token.startsWith('-') || config.SafeList.includes(token)) return;
    if (token.startsWith('ctx:') || token.startsWith('env:')) return;
    if (isMarker(token)) {
      if (getBreakpointPriority(token) < 0) {
        const names = siteBreakpoints.map((b) => b.name).join(', ');
        const message = `"${token}" is not a breakpoint. Use one of: ${names}.`;
        problems.push({ token, message, detail: message });
      }
      return;
    }
    if (/^@[^:]+:\[[^\]]*\s[^\]]*\]$/.test(token)) {
      const message = `Use underscores, not spaces, inside "${token}".`;
      problems.push({ token, message, detail: message });
      return;
    }
    try {
      elevateCompiler(token, { fileName: '(class)', lineNumber: 1 });
    } catch (err: any) {
      const detail = String(err?.message || err).trim();
      problems.push({ token, message: summarize(detail), detail });
    }
  });

  // Errors that only show when classes are put together, such as a combinator
  // with no ctx scope or two pseudo-elements in one state chain.
  if (problems.length === 0 && classes.length > 0) {
    try {
      const instance = virtualInstance(value);
      generateCSS([instance], loadEnvRegistry(() => {}), () => {});
    } catch (err: any) {
      const detail = String(err?.message || err).trim();
      if (detail !== 'No CSS content generated!') {
        problems.push({ token: String(value).trim(), message: summarize(detail), detail });
      }
    }
  }

  return { ok: problems.length === 0, classes, problems };
}

// ════ scan ════

// Every class attribute in the watched folders, with file and line.
export function scan(): ClassInstance[] {
  return scanFolders(config.Watch, config.FileTypes, () => {});
}

// ════ describe ════

export type PropertyDescription = {
  // CSS property → the token or rule type it takes, or a fixed value.
  declarations: Record<string, string>;
  // The token and rule types this property accepts as modifiers.
  accepts: string[];
  // True when the property works with no modifier, like `block` or `row`.
  standalone: boolean;
  // True when the property only takes a raw (value) pass-through.
  passThroughOnly: boolean;
};

export type DesignSystemDescription = {
  elevate: string;
  breakpoints: { name: string; minWidth: string }[];
  // The design tokens: name → CSS value, by token type. These are the maps a
  // design tool may add to (see config/design.ts).
  tokens: Record<string, Record<string, string>>;
  // Keyword rules: modifier → CSS value, by rule type. A key ending in "-",
  // such as "from-", is a prefix that takes a value of the type it maps to.
  rules: Record<string, Record<string, string>>;
  properties: Record<string, PropertyDescription>;
  // Layout shorthands that need no modifier.
  layout: string[];
  states: {
    // Any CSS pseudo-class works as a state (@hover, @focus-visible, @nth-child…).
    pseudoElements: string[];
    combinators: string[];
  };
  config: {
    watch: string[];
    fileTypes: string[];
    output: string;
    extend: string[];
  };
};

const PLACEHOLDERS = new Set(['x', 'y', 'top', 'left', 'right', 'bottom']);
const SPECIAL_TYPES = new Set(['PassThroughToken', 'NumericToken']);
const STANDALONE = new Set(['row', 'col', 'row-r', 'col-r', 'grid', 'contain', 'stack', 'cluster', 'split', 'center', 'grid-auto']);

// Plain values only: functions (like the numeric validator) become a note.
const plain = (map: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(map || {}).map(([k, v]) => [k, typeof v === 'function' ? '(number)' : typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)])
  );

// Everything a tool needs to offer Elevate's choices without guessing: the
// breakpoints, every token and rule with its CSS value, and which types each
// property accepts. JSON-safe.
export function describe(): DesignSystemDescription {
  const tokenNames = new Set(Object.keys(designSystem));
  const allTypes = types as Record<string, Record<string, any>>;

  const tokens: Record<string, Record<string, string>> = {};
  tokenNames.forEach((name) => {
    if (name === 'BreakPointToken') return;
    tokens[name] = plain(allTypes[name]);
  });

  const rules: Record<string, Record<string, string>> = {};
  const ruleNames = [...Object.keys(elevateRules), ...Object.keys(customRules)];
  ruleNames.forEach((name) => {
    if (tokenNames.has(name)) return;
    rules[name] = plain(allTypes[name]);
  });

  const properties: Record<string, PropertyDescription> = {};
  Object.entries(declarationMap as Record<string, Record<string, string>>).forEach(([name, decls]) => {
    const declarations = plain(decls);
    // Directional placeholders: pd, mg and inset take spacing per side, and
    // row and col take x- and y- alignment keywords.
    const placeholderType: Record<string, string> = { x: 'xAxis', y: 'yAxis', top: 'SpacingToken', left: 'SpacingToken', right: 'SpacingToken', bottom: 'SpacingToken' };
    const referenced = Object.values(declarations)
      .map((v) => placeholderType[v] || v)
      .filter((v) => v in allTypes || SPECIAL_TYPES.has(v));
    const accepts = Array.from(new Set(referenced));
    const literal = Object.values(declarations).filter((v) => !(v in allTypes) && !SPECIAL_TYPES.has(v) && !PLACEHOLDERS.has(v));
    properties[name] = {
      declarations,
      accepts,
      standalone: STANDALONE.has(name) || (literal.length > 0 && accepts.length === 0),
      passThroughOnly: accepts.length === 1 && accepts[0] === 'PassThroughToken',
    };
  });

  return {
    elevate: VERSION,
    breakpoints: siteBreakpoints.map((b) => ({ ...b })),
    tokens,
    rules,
    properties,
    layout: ['stack', 'cluster', 'split', 'center', 'grid-auto'],
    states: {
      pseudoElements: ['placeholder', 'before', 'after', 'marker', 'selection', 'backdrop', 'file-selector-button'],
      combinators: ['child', 'children', 'desc', 'descendants', 'sibling', 'siblings', 'general-sibling', 'ancestor'],
    },
    config: {
      watch: watchFolders(config.Watch),
      fileTypes: [...config.FileTypes],
      output: outputFile(),
      extend: [...config.Extend],
    },
  };
}
