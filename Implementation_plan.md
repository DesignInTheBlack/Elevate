# Implementation Plan: Elevate Next

This plan is expanded and aligned with the repo’s actual pipeline. It is written so it can be followed directly to implement the work.

**Repository Context (current pipeline)**
- elevate/core/scan.js scans files, strips comments, extracts class strings, and returns { file, lineNumber, classes }.
- elevate/core/parser.ts tokenizes and parses a single class string into a CST using Chevrotain.
- elevate/core/utility.ts converts CST ? AST and resolves modifiers into CSS declarations.
- elevate/core/index.ts orchestrates scanning, breakpoint handling, ctx scope, dedupe, and final CSS emission.
- elevate/config/elevate.ts defines watch paths, filetypes, and class regexes.

**Decisions Locked (per user)**
- Selector strategy: Proposal A only (explicit combinator directives).
- Chained states + combinators: exclusive (no chaining).
- Env registry: required file elevate.env.json.
- env:Name:open rewrite: expand + re-capture (append env:Name).
- Env conflicts: hard error.
- ctx tokens in env capture: excluded.

## Phase 1 - Chain States

**Goal**
- Allow @hover+focus-visible:[...] and produce .class:hover:focus-visible.

**Work**
1. Update the State token to accept chains in elevate/core/parser.ts.
2. In elevate/core/utility.ts, split chained states into an ordered array and store on the AST.
3. In elevate/core/index.ts, update selector emission to join state arrays into :state1:state2.
4. Add pseudo-element ordering: emit pseudo-classes first, then pseudo-elements. Use a list for pseudo-elements and apply consistently.
5. Replace the placeholder special-case with the new pseudo-element logic.

**Validation**
- @hover+focus-visible:[pd:d2] -> .class:hover:focus-visible { ... }
- @hover+before:[text:red] -> .class:hover::before { ... }
- @placeholder:[text:gray] -> .class::placeholder { ... }

**Files**
- elevate/core/parser.ts
- elevate/core/utility.ts
- elevate/core/index.ts

## Phase 2 - Selector Relations (Proposal A)

**Goal**
- Add explicit combinator directives using @desc, @child, @sibling, @general-sibling, @ancestor.

**Work**
1. Add selectorMode to AST objects produced by context blocks in elevate/core/utility.ts.
2. Detect combinator directives in handleContextFlags and set selectorMode, not state.
3. Enforce exclusivity: combinator directives cannot be chained with pseudo-states. Emit a clear error.
4. Update selector emission in elevate/core/index.ts to honor selectorMode:
5. Preserve existing ctx behavior only when no selectorMode is set.

**Validation**
- ctx:main @child:[pd:d2] -> .ctx:main > .pd\:d2
- ctx:main @desc:[pd:d2] -> .ctx:main .pd\:d2
- ctx:main @ancestor:[pd:d2] -> .pd\:d2 .ctx:main

**Files**
- elevate/core/utility.ts
- elevate/core/index.ts

## Phase 3 - Nested ctx Support (Stack + Named End)

**Goal**
- Allow nested ctx scopes with predictable selector chains and correct dedupe.

**Work**
1. Replace currentScope with scopeStack in elevate/core/index.ts.
2. Detect ctx tokens via startsWith('ctx:') to avoid false positives.
3. On ctx:NAME push; on ctx:end pop; on ctx:end:NAME validate top of stack.
4. Store scope as an ordered array on compiled class objects.
5. Emit selectors using full chain: .ctx:outer .ctx:inner .target and .ctx:outer .ctx:inner.target.
6. Update dedupe keys to include the full scope chain string.
7. Add diagnostics for unmatched end and leftover scopes.

**Validation**
- ctx:outer ctx:inner pd:d2 -> .ctx:outer .ctx:inner .pd\:d2 and .ctx:outer .ctx:inner.pd\:d2
- ctx:outer ctx:end:inner -> warning

**Files**
- elevate/core/index.ts

## Phase 4 - Env Class Condensation (Implicit Capture + Open Rewrite)

**Goal**
- Collapse a utility class list into one env class and allow reversible expansion.

**Work**
1. Add env token parsing helper in elevate/core/index.ts to identify env:Name and env:Name:open.
2. Update elevate/core/scan.js to return raw class strings plus start/end offsets for each class attribute.
3. Preserve offsets by masking comments and code blocks with whitespace instead of removing them.
4. Track static vs dynamic class attributes and allow rewrites only for static cases.
5. Build an env registry in a pre-pass over all scanned class lists.
6. Implicit definition rule: if env:Name appears with at least one non-env token, capture all non-env tokens in order.
7. Exclude ctx tokens from env capture.
8. If the same env alias is defined with a different token list, hard error.
9. Persist env registry to elevate.env.json and load it on startup.
10. Skip compiling original utilities for env definitions (so the condensed class is the only output).
11. Compile env aliases by replaying captured tokens through the normal pipeline while forcing className = env:Name.
12. Preserve breakpoints and state blocks during env compilation using the same breakpoint tracking used in establishBreakpoints.
13. Fix dedupe to avoid dropping env alias rules. Use a selector-aware key or aggregate declarations per selector before dedupe.
14. Implement env:Name:open rewrite using offsets and per-file replacements on the original file content.
15. Rewrite output: expanded tokens plus env:Name appended for re-capture.
16. Prevent watch loops by skipping files recently rewritten by the tool.

**Validation**
- pd-x:d4 bg-color:red mg-t:d1 env:card -> only .env\:card CSS emitted.
- /lg/ pd-x:d4 env:card -> .env\:card inside the lg media query.
- @hover:[bg-color:red] env:card -> .env\:card:hover.
- env:card:open rewrites source to pd-x:d4 bg-color:red mg-t:d1 env:card.
- Conflicting env:card definitions -> hard error.
- env:card:open inside dynamic template expression -> no rewrite.

**Files**
- elevate/core/scan.js
- elevate/core/index.ts
- elevate.env.json (new)

## Phase 5 - CSS Coverage Backlog

**Goal**
- Expand missing CSS utility coverage safely, in prioritized slices.

**Work**
1. Create a backlog list grouped by category and impact.
2. Pick an initial slice and define tokens and mappings in declaration maps.
3. Implement 1 to 3 categories per iteration to keep changes reviewable.
4. Add manual verification for each new category.

**Files**
- elevate/core/system/declarationMap.js and related token maps

## Cross-Cutting Validation

1. Run the compiler on the templates and a small fixture file after each phase.
2. Confirm existing behavior for classes without new syntax.
3. Spot-check CSS output for selector correctness and expected specificity.
4. Add a small fixture file for env alias definitions and open rewrites.

## Deliverables Summary

1. Parser updates in elevate/core/parser.ts.
2. AST and state handling updates in elevate/core/utility.ts.
3. Selector emission and ctx handling updates in elevate/core/index.ts.
4. Scanner updates and source rewrite support in elevate/core/scan.js.
5. New env registry file elevate.env.json and load/save logic.
6. Updated Implementation_plan.md with locked decisions and expanded execution steps.
