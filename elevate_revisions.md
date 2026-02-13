# Elevate Revisions Plan

Date: 2026-02-13

## Goals
1. Fix @ancestor semantics and reduce ctx-order hackiness.
2. Relax combinator placement within state chains.
3. Expand allowed state name charset (at least underscore).
4. Support combinators inside env aliases via safe scoping.
5. Improve pseudo-element error clarity (keep one-per-chain rule).
6. Clarify combinator semantics and naming to match CSS behavior.

## Phases
1. Phase 1: Correctness and scope behavior
   Scope: Fix @ancestor selector semantics and remove ctx-order hacks. Clarify combinator anchor behavior in examples.
   Work: @ancestor uses :has; ctx look-ahead within a single class list; update core-features combinator examples to show ctx as anchor.
   Files: elevate/core/index.ts, elevate/core/scan.js (if needed), elevate/templates/core-features.html.
   Exit: @ancestor works without ordering hacks, @children/@descendants/@siblings demos are intuitive and match CSS combinator behavior.

2. Phase 2: Parser ergonomics
   Scope: Reduce syntactic friction without changing core semantics.
   Work: Allow single combinator anywhere in the state chain; expand state charset to include underscore; improve pseudo-element error copy.
   Files: elevate/core/utility.ts, elevate/core/parser.ts, elevate/core/scan.js, elevate/core/index.ts.
   Exit: @hover+child and @child+hover both compile; @foo_bar compiles/scans; pseudo-element errors are clear.

3. Phase 3: Env alias capability
   Scope: Allow combinators inside env aliases with safe scoping.
   Work: Attach implicit env scope for combinator rules; document env combinator behavior.
   Files: elevate/core/index.ts, elevate/templates/core-features.html (env section), docs (if any).
   Exit: env aliases can include @children/@descendants/@siblings and apply to relatives of the env element without compilation errors.

## Risks
1. :has selector support depends on browser. If not acceptable, we need an alternate syntax or require explicit ancestor class on target.
2. Look-ahead ctx resolution could affect existing scope stack behavior; must be constrained to within the same class list.
3. Env combinators change compiled selectors; need to document that they scope to the env element.

## Validation
1. Update core-features demos for @ancestor, @children, @descendants, @siblings to verify correct behavior visually.
2. Add small fixture with @hover+child ordering and underscore state names.
3. Run compile and verify elevate.css output for each scenario.
4. Confirm @siblings demo uses ctx as the anchor and demonstrates that all following siblings are targeted.
