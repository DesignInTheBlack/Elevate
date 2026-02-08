# Elevate Next: Planned Enhancements

This document explains upcoming changes in five areas: state chaining, selector relations, nested ctx support, env class condensation, and CSS coverage. Each change is framed with why it matters and how it would be implemented.

## Design Intent

Why:
- Increase expressiveness without introducing a new syntax family.
- Make selector behavior explicit to reduce surprises and specificity bloat.
- Close key gaps versus the CSS spec without overwhelming the core.

How:
- Extend the parser and AST for new state and selector metadata.
- Update selector emission to honor new modes.
- Prioritize missing CSS utilities by impact and use frequency.

## 1) Chain States

Why:
- Users often need compound pseudo-classes like :hover:focus-visible.
- Chaining reduces extra wrapper classes and keeps intent in one place.

How:
- Allow multiple pseudo-states in a single state block separated by +.
- Example syntax: @hover+focus-visible:[pd:d2].
- Output selector: .class:hover:focus-visible { ... }.
- Parser change: update the State token regex to match @[a-zA-Z0-9-]+(?:\+[a-zA-Z0-9-]+)*:.
- AST change: store state as an ordered list instead of a single string.
- Compiler change: join the list into :state1:state2 when building selectors.
- Diagnostics: optionally validate state fragments against an allowlist to catch typos, or keep free-form.

Success metric:
- Improved expressiveness without new syntax families, and fewer wrapper classes.

## 2) Selector Relations (Ancestor/Descendant/Combinators)

Why:
- Current ctx:* behavior emits both .scope.target and .scope .target, which inflates CSS and specificity.
- Users need explicit control for >, +, ~, and ancestor relations.

Current behavior:
- With ctx:*, each utility emits both .scope.target (compound) and .scope .target (descendant).
- No explicit control for combinators or ancestor selectors.

How (Proposal A: Explicit Combinator Directives):
- Add combinator directives as context blocks (compile-time only).
- Example directives and output:
- @desc:[pd:d2] -> .scope .pd\:d2
- @child:[pd:d2] -> .scope > .pd\:d2
- @sibling:[pd:d2] -> .scope + .pd\:d2
- @general-sibling:[pd:d2] -> .scope ~ .pd\:d2
- @ancestor:[pd:d2] -> .pd\:d2 .scope
- Implementation:
- Treat the state token as either a pseudo-state or a combinator directive.
- Extend handleContextFlags to detect directive states (e.g., desc, child).
- Pass a selectorMode field into the AST (e.g., descendant, child, sibling, ncestor).
- Update selector emission to use the correct combinator.

How (Proposal B: Scope Modes):
- Add ctx modifiers to control selector format once per scope.
- Example modes:
- ctx:main -> default (current dual output or descendant-only)
- ctx:main:desc -> only .scope .target
- ctx:main:self -> only .scope.target
- ctx:main:child -> only .scope > .target
- Implementation:
- Extend ctx parsing to read an optional selector mode.
- Apply that mode when building selectors for the active scope.

Success metric:
- Reduced selector bloat and explicit, predictable combinator control.

## 3) Nested ctx Support (Stack + Named End)

Why:
- Allow nested scopes without relying on extra wrapper classes.
- Make scoping intent explicit in long class lists.
- Reduce accidental scope leaks by making closes visible and verifiable.

How (Phase 1: Stack-Based ctx):
- Replace currentScope with a scope stack.
- On ctx:NAME, push; on ctx:end, pop.
- Store scope as an ordered list on each compiled class.
- Selector emission uses the full chain: .ctx:outer .ctx:inner .target (descendant) and .ctx:outer .ctx:inner.target (self/compound).
- Update class dedupe keys to include the full scope chain.
- Diagnostics: warn on ctx:end with an empty stack and warn on unclosed scopes after a file is processed.

How (Phase 2: Named End Tags):
- Add ctx:end:NAME to close a specific scope.
- Validation: require NAME to match the top of the stack (error if mismatched) to keep behavior predictable.
- Keep ctx:end as shorthand for closing the top scope.

Success metric:
- Nested scopes compile predictably, and mis-nesting produces clear warnings.

## 4) Env Class Condensation (Implicit Capture + Open Rewrite)

Why:
- Collapse long utility lists into a single, reusable class without losing expressiveness.
- Allow quick “round-trip” editing by expanding an env class back into its original list.
- Treat breakpoints and states as first-class parts of the condensed class.

How (Definition and Capture):
- Implicit capture: if a class list contains `env:Name` and at least one other non-env token, treat it as a definition.
- Capture the full token list minus all `env:*` tokens, preserving order, breakpoints, and state blocks.
- If a class list contains only `env:*` tokens, treat it as usage (no redefinition).
- If the same alias is defined with a different token list, emit a diagnostic.

How (Compilation):
- Build an env registry in a pre-pass across all scanned classes.
- Skip compiling the original utilities for definition lists (so the condensed class is the only output).
- Compile the captured token list into CSS with the class name forced to `env:Name`.
- Preserve breakpoints and state variants inside the captured list.

How (Open and Source Rewrite):
- `env:Name:open` expands to the captured token list and rewrites the source file.
- Recommended rewrite output: expanded tokens plus `env:Name` at the end for easy re-capture.
- Add rewrite safeguards: ignore self-writes in the watcher and debounce rewrites.

Success metric:
- A condensed env class compiles to the same CSS as its original list, and `:open` restores the list for editing.

## 5) CSS Coverage Gaps

Why:
- The framework covers core layout/typography/border/background/flex/grid basics, but several modern CSS areas are missing or only available via passthrough.

How:
- Use this list as a backlog seed for new utilities and token mappings.
- Prioritize items that reduce common passthrough usage and improve parity with the CSS spec.

Notable gaps by category:
- Layout and flow: loat, clear, missing display variants (e.g., 	able-*), logical properties, content-visibility.
- Overflow and scrolling: overflow-x, overflow-y, overscroll-behavior, scroll-behavior, scroll-snap-*, scroll-margin, scroll-padding, scrollbar-*.
- Borders and outlines: order-x, order-y, order-image-*, order-collapse, order-spacing, fuller outline controls.
- Typography: ont-style, ont-variant, ont-stretch, text decoration controls, 	ext-indent, 	ext-overflow, 	ext-rendering, word-spacing, 	ab-size, writing-mode, direction, unicode-bidi, line-clamp.
- Sizing and box model: ox-decoration-break, width/height keywords (it-content, min-content, max-content).
- Transforms and effects: structured 	ranslate/scale/rotate/skew, ilter, ackdrop-filter, blend modes, isolation.
- Animation: nimation-* properties and keyframe utilities.
- Lists and tables: list-style-*, 	able-layout, caption-side.
- Grid and flex extras: grid-template-areas, grid-area, grid place-self/align-self/justify-self.
- SVG and media: ill, stroke, stroke-width, object-position.
- Form and UI: ppearance, ccent-color.

## Optional Follow-up

If helpful, this can be converted into a concrete backlog with syntax proposals and token mappings per category.
