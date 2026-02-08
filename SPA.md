# Elevate SPA/JS Support Plan

## Goal
Make Elevate reliable and ergonomic for modern SPA frameworks (React, Next, Remix, Vue, Svelte, Astro) while preserving existing template-first workflow.

## Current System Summary (as-is)
- **Scanner:** `elevate/core/scan.js`
  - Recursively scans `config.Watch` for `config.FileTypes`.
  - Extracts class attributes using `config.ClassRegex`.
  - Masks comments and code blocks to preserve offsets for rewrite.
  - Supports many static patterns: template literals, simple ternaries, `clsx`, `classNames`, array join/filter, etc.
  - Skips unknown/dynamic expressions (variables, function calls, complex constructs).
- **Compiler / Watcher:** `elevate/core/index.ts`
  - `chokidar` watch on `config.Watch`.
  - Uses scan results + compiler for CSS.
  - Env rewrite runs only for static class strings.
- **Config:** `elevate/config/elevate.ts`
  - `FileTypes`: `html`, `jsx`, `tsx`, `astro` only.
  - Regex set covers `class`, `className`, and template literal `className`.

## Gaps for SPA/JS
- Missing file types by default: `js`, `ts`, `vue`, `svelte`, `mdx`.
- Regex extraction misses framework-specific patterns (Vue `:class`, Svelte `class:`, Solid `classList`, etc).
- No AST parser for complex class composition (hooks, utilities, conditions in variables).
- No build tool integration (Vite/Next/Remix plugins) for HMR and pipeline stability.
- Safelist workflow not streamlined for dynamic classes.

## Guiding Principles
- Keep **regex scanner** for speed and simplicity.
- Add **optional AST extraction** for deeper SPA support.
- Make changes **opt-in** and configuration-driven.
- Preserve **exact offsets** for env rewrite behavior.

## Plan (Phased)

## Phase 1 — Baseline SPA Coverage (low risk)
1. **Extend default file types**
   - Update `elevate/config/elevate.ts` to include `js`, `ts`, `vue`, `svelte`, `mdx` by default (or add a preset).
2. **Add framework regex patterns**
   - Expand `ClassRegex` to cover:
     - Vue `:class="..."`, `v-bind:class="..."`.
     - Svelte `class:foo={...}` and `class={...}`.
     - Solid `classList={{ ... }}` and `class={...}`.
     - JSX `clsx(...)` and `cn(...)` patterns when used directly in `className={...}`.
3. **Document dynamic caveats**
   - Update docs to show which patterns are detected and which require safelisting.

## Phase 2 — Optional AST Extractor (high value)
1. **Add an AST-based extractor (opt-in)**
   - New file: `elevate/core/scan-ast.ts`.
   - Parse JS/TS/JSX/TSX/MDX using a lightweight parser (e.g. `@babel/parser` or `acorn`).
   - Extract static string literals inside:
     - `className`, `class`, `classList`, `:class`, `class:` attributes.
     - `clsx`, `classnames`, `cn` calls.
     - Array and object literal patterns.
2. **Preserve offsets**
   - For AST sources, keep `start/end` offsets for env rewrite (when possible).
   - If offsets are unavailable, mark entry `isStatic=false` to avoid rewrites.
3. **Config toggle**
   - Add `UseAST: true/false` in `elevate/config/elevate.ts`.
   - Fallback to regex-only if parser is missing.

## Phase 3 — Tooling Integration
1. **Vite plugin**
   - Expose `elevate` plugin that runs compile on HMR updates.
   - Support virtual module or explicit CSS output path.
2. **Next/Remix integration**
   - Provide a small wrapper script or plugin for build/start.
3. **CLI enhancements**
   - `elevate prepare --spa` to set FileTypes, Regex presets, and safelist hints.

## Phase 4 — Dynamic Class Strategy
1. **Safelist UX**
   - Allow globs and prefixes in `SafeList` (e.g., `env:*`, `bg-color:*`).
   - Add `SafeListPatterns` to config (regex or wildcard).
2. **Dev warnings**
   - When the scanner detects complex `className` expressions, log a warning with a recommendation to safelist or convert to static string.
3. **Diagnostics**
   - Add a debug mode for “unknown class source” reporting.

## Phase 5 — Tests & Validation
1. **Fixture set**
   - Add fixtures for React/Vue/Svelte/Solid/MDX class patterns.
2. **Unit tests**
   - Scan coverage for regex-only and AST modes.
3. **Regression tests**
   - Ensure env rewrite still respects static-only rules.

## Implementation Map (where changes go)
- `elevate/config/elevate.ts`: file types, regex presets, AST toggle, SafeList patterns.
- `elevate/core/scan.js`: add regex patterns, or delegate to AST when enabled.
- `elevate/core/scan-ast.ts`: new optional parser-based extractor.
- `elevate/core/index.ts`: wire AST mode; maintain rewrite offsets.
- `bin/cli.js`: optional `prepare --spa`.
- `docs`: new “SPA Support” guide + update `supported-selectors` and `getting-started`.

## Acceptance Criteria
- Static class strings in React/Vue/Svelte compile correctly out of the box.
- Common `clsx` / `classnames` patterns are extracted without safelists.
- Dynamic expressions either resolve to static tokens or produce a clear warning.
- No regressions to env rewrite or ctx scoping.

## Risks & Mitigations
- **AST dependency bloat**: keep AST mode optional and lazily loaded.
- **Performance**: retain regex scan as default; AST only for file types that need it.
- **Rewrite offsets**: fall back to non-rewrite if offsets aren’t trustworthy.

## Suggested Next Action
Pick Phase 1 or Phase 2 as the starting point. I recommend Phase 1 for immediate wins, then Phase 2 if you want SPA reliability at scale.
