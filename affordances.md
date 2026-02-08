# Layout Affordances Implementation Plan

## Goals
1. Provide single-class layout primitives that remove wrapper spam and reduce layout boilerplate.
2. Keep syntax readable and explicit while mapping cleanly onto existing Elevate token systems.
3. Ensure affordances work with breakpoints and state blocks without special cases.
4. Keep defaults sensible and predictable with opt-in modifiers for opinionated behavior.

## Selected Affordances
1. `stack`
2. `cluster`
3. `split`
4. `center`
5. `grid-auto`

## Syntax And Behavior

### 1) `stack`
Intent: Vertical flow with optional spacing and alignment.

Proposed syntax:
- `stack` (base)
- `stack:gap-d4`
- `stack:gap-d4:align-center`
- `stack:gap-d4:align-center:justify-between`
- `stack:reverse` (optional)

Base CSS:
- `display: flex`
- `flex-direction: column`

Modifiers:
- `gap-<SpacingToken>` ? `gap`
- `align-<AlignItemsRule>` ? `align-items`
- `justify-<JustifyContentRule>` ? `justify-content`
- `reverse` ? `flex-direction: column-reverse`

Defaults:
- No gap by default (explicit gap is clearer and safer)

### 2) `cluster`
Intent: Horizontal wrap with gap + alignment.

Proposed syntax:
- `cluster`
- `cluster:gap-d3`
- `cluster:gap-d3:align-center:justify-between`
- `cluster:nowrap` (optional)

Base CSS:
- `display: flex`
- `flex-direction: row`
- `flex-wrap: wrap`

Modifiers:
- `gap-<SpacingToken>` ? `gap`
- `align-<AlignItemsRule>` ? `align-items`
- `justify-<JustifyContentRule>` ? `justify-content`
- `nowrap` ? `flex-wrap: nowrap`

### 3) `split`
Intent: Two-column layout with simple ratios.

Proposed syntax:
- `split` (defaults to `ratio-1-1`)
- `split:ratio-2-1`
- `split:ratio-1-2:gap-d6`
- `split:ratio-(2fr_1fr)` (pass-through)
- `split:reverse` (optional)

Base CSS:
- `display: grid`
- `grid-template-columns: 1fr 1fr` (default)

Modifiers:
- `ratio-1-1`, `ratio-2-1`, `ratio-1-2`, `ratio-3-1`, `ratio-1-3` ? `grid-template-columns`
- `ratio-(<custom>)` ? pass-through `grid-template-columns` (underscores become spaces)
- `gap-<SpacingToken>` ? `gap`
- `reverse` ? swap ratio order

### 4) `center`
Intent: Center a block in its parent with optional max width and text centering.

Proposed syntax:
- `center`
- `center:max-c12`
- `center:max-(60rem)`
- `center:text` (optional)

Base CSS:
- `margin-left: auto`
- `margin-right: auto`

Modifiers:
- `max-<DimensionToken>` ? `max-width`
- `max-(<custom>)` ? pass-through `max-width`
- `text` ? `text-align: center`

Defaults:
- No max-width by default; it’s explicit via modifier

### 5) `grid-auto`
Intent: Responsive auto-grid with min column width and gap.

Proposed syntax:
- `grid-auto` (defaults to `min-d10` and `fit`)
- `grid-auto:min-d10:gap-d4`
- `grid-auto:min-(220px):gap-d4`
- `grid-auto:min-(14rem):gap-d6:fill`

Base CSS:
- `display: grid`
- `grid-template-columns: repeat(auto-fit, minmax(<min>, 1fr))`

Modifiers:
- `min-<SpacingToken>` ? min width from spacing scale
- `min-(<custom>)` ? pass-through min width
- `gap-<SpacingToken>` ? `gap`
- `fit` ? `auto-fit` (default)
- `fill` ? `auto-fill`

## Compiler Integration Plan

### Phase 1: Define Rule Maps
1. Create a new rule file `elevate/core/system/rules/affordances.ts`.
2. Add rule groups for:
   - `StackAlignRule` (align-items values)
   - `StackJustifyRule` (justify-content values)
   - `ClusterAlignRule` (align-items values)
   - `ClusterJustifyRule` (justify-content values)
   - `AffordanceGapRule` (gap- prefix ? SpacingToken)
   - `SplitRatioRule` (ratio- tokens + pass-through ratio)
   - `CenterMaxRule` (max- tokens + pass-through)
   - `GridAutoMinRule` (min- tokens + pass-through)
   - `GridAutoFitRule` (fit | fill)

### Phase 2: Add Declaration Map Entries
1. Add `stack`, `cluster`, `split`, `center`, `grid-auto` to `elevate/core/system/declarationMap.ts`.
2. Map each property to the appropriate CSS properties and rules:
   - `stack`: `display`, `flex-direction`, `gap`, `align-items`, `justify-content`
   - `cluster`: `display`, `flex-direction`, `flex-wrap`, `gap`, `align-items`, `justify-content`
   - `split`: `display`, `grid-template-columns`, `gap`
   - `center`: `margin-left`, `margin-right`, `max-width`, `text-align`
   - `grid-auto`: `display`, `grid-template-columns`, `gap`

### Phase 3: Base Declarations
1. Add a small base-declaration injector in `elevate/core/utility.ts` for these affordances.
2. Base rules should be added even when no modifiers are present.
3. Example base map:
   - `stack`: `display:flex`, `flex-direction:column`
   - `cluster`: `display:flex`, `flex-direction:row`, `flex-wrap:wrap`
   - `split`: `display:grid`, `grid-template-columns:1fr 1fr`
   - `center`: `margin-left:auto`, `margin-right:auto`
   - `grid-auto`: `display:grid`, `grid-template-columns:repeat(auto-fit, minmax(<default>, 1fr))`

### Phase 4: Modifier Parsing
1. Ensure modifier prefixes are defined in rule maps so `getModifierType()` resolves correctly.
2. Use `PassThroughToken` for custom ratio/min/max values via parentheses.
3. Keep `gap-` aligned with existing `GridGapRule` behavior to avoid new token types if possible.

## Testing Plan
1. Update `elevate/templates/core-features.html` with examples for each affordance.
2. Include breakpoint variants for each affordance.
3. Include state block variants to ensure selectors compile.
4. Validate that each affordance generates correct CSS in `elevate.css`.

## Documentation Plan
1. Add a new docs page `css/layout-affordances.mdx`.
2. Document syntax, defaults, and modifier options per affordance.
3. Add examples that match `core-features.html`.
4. Add quick reference section for modifiers and common patterns.

## Rollout Steps
1. Implement rules and declaration map entries.
2. Implement base rule injection.
3. Update `core-features.html` and verify compile output.
4. Update docs and ensure they match actual system behavior.
5. Add a checklist in `needs_workd.md` confirming affordances are implemented and documented.
