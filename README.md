<p align="center">
  <img src="https://elevate-docs.pages.dev/_astro/dark.DxR7SM2r.svg" alt="Elevate CSS logo" width="140" />
</p>

<h1 align="center">Utility-First. Design-Driven.</h1>

<p align="center">
  Elevate CSS is a compile-first, token-driven utility framework that turns your styling layer into a
  seamless extension of your design system. It validates utility strings at build time, enforces
  consistency across teams, and keeps CSS output lean and intentional.
</p>

---

## Why Elevate
- Compile-first workflow that emits only what you use
- Token-driven architecture that aligns styling decisions with your design system
- Expressive utility string syntax (`property:modifier`) with order-agnostic modifiers
- Build-time validation to prevent invalid or off-system styles
- Extensible rules and tokens for custom properties and brand semantics

## Requirements
- Node.js 18 or later

## Quickstart
```bash
npm install elevate-framework
npx elevate-framework prepare
npm run elevate
```

`prepare` scaffolds the `elevate/` directory into your project and adds the `elevate` script to your `package.json`.
`npm run elevate` compiles once, then watches your templates and recompiles on every save. Changing a token, rule or setting restarts it automatically.

## Commands
- `npm run elevate`: compile, then watch
- `npm run elevate -- build`: compile once and exit (non-zero on error, for CI and hosts)
- `npm run elevate -- check "row gap:d4 /md/ col"`: check a class list and name each bad class
- `npm run elevate -- describe`: print the design system (breakpoints, tokens, rules, properties) as JSON

Tools can also call Elevate from code through `elevate/core/api.ts` (`build`, `validate`, `describe`). See [Commands and API](https://elevate-docs.pages.dev/reference/commands/).

## Configuration At A Glance
- `elevate/config/elevate.ts` configures watch folders (one or a list), file types, output, and safelist rules
- `elevate/config/design.ts` registers design tokens and token sources
- `elevate/config/syntax.ts` defines property relationships and syntax rules
- `elevate/templates/` is the default folder Elevate watches for class strings

## Documentation
Start here: [Elevate Docs](https://elevate-docs.pages.dev) and [Getting Started](https://elevate-docs.pages.dev/guides/2-getting-started/).

Beyond Getting Started:
- [Configuration and Extension](https://elevate-docs.pages.dev/guides/3-configuration/)
- [Specificity Rules](https://elevate-docs.pages.dev/guides/3-specificity/)
- [Layout Utilities](https://elevate-docs.pages.dev/guides/layout/)
- [Envelopes (env aliases)](https://elevate-docs.pages.dev/guides/4-env-aliases/)
- [Supported Selectors](https://elevate-docs.pages.dev/reference/supported-selectors/)
- [System Token Types](https://elevate-docs.pages.dev/reference/system-token-types/)
- [Designed Defaults - Colors](https://elevate-docs.pages.dev/default/colors/)
- [Designed Defaults - Spacing](https://elevate-docs.pages.dev/default/spacing/)
- [Writing Elevate - Backgrounds](https://elevate-docs.pages.dev/css/backgrounds/)
- [Writing Elevate - Text](https://elevate-docs.pages.dev/css/text/)

## Community
- [Discord](https://discord.gg/T3X2vBYA)
- [GitHub](https://github.com/DesignInTheBlack/Elevate)

**Elevate Your Code. Elevate The Web.**
