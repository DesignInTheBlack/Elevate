# Introducing Elevate CSS

<br>

Elevate CSS is a compile-first utility framework that transforms your styling layer into a seamless extension of your design system. With a token-driven architecture, expressive utility string (property:modifier) syntax, and compile-time validation, Elevate ensures every styling decision is consistent, intentional, and scalable. By bridging the gap between design and development, Elevate empowers teams to create maintainable, error-free, and future-proof codebases with clarity and precision.

<br>

**※ Please Excuse Our Progress:**  

In it's current iteration, Elevate CSS is a work in progress and subject to change. I welcome your feedback and suggestions for future enhancements as I take this project from a technical proof-of-concept to a full-fledged utility framework. 

<br>

## § Table of Contents

<br>

1. [Introduction](#-introduction)
2. [Features](#-features)
3. [Design Philosophy & Architecture](#-design-philosophy--architecture)  
   - [Core Design Principles](#-core-design-principles)  
   - [Architectural Approach](#-architectural-approach)  
   - [Performance Characteristics](#-performance-characteristics)  
   - [Current Capabilities](#-current-capabilities)  
4. [Syntax and Usage](#-syntax-and-usage)  
   - [Quick Start](#-quick-start)  
   - [Syntax Guide](#-syntax-guide)  
   - [Responsive Styling](#-responsive-styling)  
   - [Contextual and Functional Flags](#-contextual-and-functional-flags)  
   - [Design Tokens and Rules](#-design-tokens-and-rules)  
   - [Token Selection Guide](#-token-selection-guide)  
   - [Best Practices](#-best-practices)  
5. [Configuration](#-configuration)  
   - [Framework Configuration](#-framework-configuration)  
   - [Extending Elevate: A Comprehensive Guide](#-extending-elevate-a-comprehensive-guide)  
   - [Project Structure](#-project-structure)  
6. [Why Elevate](#-why-elevate)  
   - [Market Differentiation and Competitive Positioning](#-market-differentiation-and-competitive-positioning)  
   - [TailwindCSS vs Elevate CSS](#-tailwindcss-vs-elevate-css)  
   - [Why Choose Elevate CSS](#-why-choose-elevate-css)  
7. [Product Roadmap](#-product-roadmap)  
   - [Planned Features](#-planned-features)  
   - [Selector Support](#-selector-support)  
8. [Licensing and Attribution](#-licensing)
       

<br>

## § Features
<br>

- **Type-Safe CSS Generation**
  - Compile-time token validation
  - Design system constraint enforcement
  - No tree shaking necessary

- **Design System Integration**
  - Token-based system for colors, spacing, typography, and breakpoints
  - Structured property-attribute relationships


- **Responsive Design**
  - Intuitive and mobile-first syntax: `property:modifier /breakpoint/ property:modifier`
  - Automatic media query generation

- **Context Management**
  - Supporting pseudo-class and pseudo-element selectors
  - Syntax: `@context:[property:modifier_property:modifier]`

<br>

## § Design Philosophy & Architecture
<br>

### ¶ Core Design Principles


- **Expressive and Intentional**  
   Styling choices should serve as self-documenting expressions of design intention, ensuring intuitive understanding and long-term maintainability of the codebase.

- **Consistency and Consideration**  
   The design system is the single source of truth, rigorously upheld through strict typing and compile-time validation to eliminate off-scale values and unauthorized modifications. 

- **Extensible and Reliable**  
   Elevate must support growth and adaptation while maintaining simplicity, with styling validated before runtime to guarantee alignment with the design system on every build. 

<br>

### ¶ Architectural Approach


**Key Technical Innovations:**
- **Compile-Time Parsing**: Uses Chevrotain for robust class attribute tokenization
- **Mobile-First Design**: Intelligent breakpoint processing
- **Declarative Syntax**: Transforms HTML class attributes into optimized CSS

**Parsing Strategy:**
1. **File Scanning**: Discover class attributes across project files
2. **Lexical Analysis**: Tokenize class strings
3. **Syntax Parsing**: Convert syntax to Concrete Syntax Trees (CST)
4. **CSS Generation**: Transform CST into optimized CSS

**Type Safety:**
- Strict token definitions of design system as well as property-attribute relationships
- Compile-time validation of design system tokens and relationships to CSS
- TypeScript type constraints for design system tokens and syntax rules

<br>

## § Quick Start Guide

This quick start guide is included to give you an opportunity to dive right into the world of Elevate CSS. With that said, however, it is HIGHLY RECOMMENDED that you familiarize yourself with the configuration section as well as it provides a deeper understanding of Elevate's capabilities, functionality, and best practices as well as how to best leverage the framework for your specific needs.

<details>
<summary>Click Here To Read More</summary>

<br>

### ¶ Installation and Usage

<br>

```bash
# Install dependencies
npm install

# Compile to CSS
npm start
```

<br>

### ¶ Syntax Guide

<br>

**Basic Usage:**  

At the heart of Elevate's syntax are "utility strings", which are used to describe styling and serve as the basis for CSS generation. They also double as the class attribute in HTML. 
<br>

**Direct Properties:**  

Define a single property with a value. Generally used for layout and positioning.

```html
<div class="block"> <!-- display: block -->
```

<br>

**Compound Properties:** 

Build complex class definitions by chaining modifiers:

```html
<div class="property:modifier:modifier:modifier">      
```
<br>

**Practical Examples:**

```html
<div class="text:bold:purple">      <!-- Bold text with purple color -->
<div class="color:purple">          <!-- Element color set to purple -->
<div class="row:x-center:y-start">  <!-- Row layout with specific alignment -->
<div class="absolute left:d12 z:10">  <!-- Absolute positioning, d12 from the left, and z-index of 10  -->
```
<br>

**※ Modifiers are Order Agnostic**  

You can write text:red:bold or text:bold:red and the order doesn't matter. We'll get to the how and why later.

<br>

### ¶ Responsive Styling

<br>

Elevate enforces a mobile-first, organized syntax for responsive design:

```html
<div class="text:purple p:d1:d2 /md/ text:right /lg/ @hover:[text:green:right]"> 
```

1. Define universal classes on the far left.
2. Add breakpoint-specific adjustments after a `/breakpoint/` indicator.

<br>

### ¶ Contextual and Functional Flags

<br>

**Contextual Flag [@]:**  

Allows complex, conditional styling for states, conditions, and other pseudo-classes or pseudo-elements.:

```html
<div class="@hover:[text:green:right]">  <!-- Hover state changes text -->
```

<br>

For More Information: [See Currently Supported Selectors](#-selector-support)

<br>

**Functional Flag [$]:**  

Exempt certain classes from CSS generation (e.g. for JavaScript interactions):

```html
<div class="$mySelector">
```

<br>

### ¶ Design Tokens and Rules

<br>

Elevate is powered by two distinct elements:

<br>

**Design System Tokens**
   - Global, immutable design constraints.  
   - Centralized values, enforce system-wide consistency.
<br>

**Syntax Rule Mappings**  
   - Property-specific structural validation.  
   - Validate property values, provide type-safe transformations.
   - Allow for syntax extensions and modification through submapping.
<br>


1. **Design System Tokens**  
   - **Purpose:** Global, immutable design constraints.  
   - **Location:** `design/` directory  
   - **Configuration:** `elevate/config/design.ts`
   - **Characteristics:** Centralized values, enforce system-wide consistency.

   **Example:**
   ```typescript
   // design/colors.ts
   export const colors = {
       'purple': '#6665DD',
       'dark':'#2C2638',
       'white':'#F0EFF4',
       'warn':'#FABC2A',
       'error':'#D81E5B'
   } as const;

   export type ColorToken = keyof typeof colors;
   ```

<br>

2. **Syntax Rule Mappings**  
   - **Purpose:** Property-specific structural validation and syntax construction or extension.  
   - **Location:** `rules/` directory  
   - **Configuration:** `elevate/rules/propertyAttributeMap.ts` and `elevate/config/rules.ts`
   - **Characteristics:** Validate property values, provide type-safe transformations, and structure syntax.

   **Example:**
   ```typescript
   // rules/grid.ts
   import { SpacingToken } from '../design/spacing.js';
   import { NumericToken } from '../maps/numeric.js';

   export const grid = {
     gap: {
       "gap-": "SpacingToken"
     },
     row: {
       "row-": "NumericToken" 
     },
     column: {
       "col-": "NumericToken"
     }
   } as const;

   export type GridToken = keyof typeof grid;
   export type GridGapToken = `g-${SpacingToken}`; 
   export type GridRowToken = `r-${NumericToken}`; 
   export type GridColumnToken = `c-${NumericToken}`;
   ```
<br>



   **※ A Very Special Design Token**

   **Pass-Through Tokens**  
   - Unrestricted value entry.  
   - No compile-time validation, for dynamic or flexible values.
   - Primarily used for CSS rules that require special syntax (e.g., URLs or complex values).
   - Not recommended for general styling.
   <br>

   **Example:**

   ```typescript
   // propertyAttributeMap.ts
   rotate: {
     "rotate": "PassThroughToken" // Allows any rotation value
   }
   ```

   ```html
   <div class="rotate:((90deg))"></div>
   ```
<br>

Please note that you must pass through the value in the same way that you would write it in CSS.
For example, preserving parentheses for values requiring them (e.g., URLs).

<br>

### ¶ Token Selection Guide

<br>

**Decision Matrix:**
```
Property Characteristics
├── Needs Global Consistency?
│   ├── Yes → Design System Token
│   └── No →
│       ├── Property-Specific Validation Needed?
│       │   ├── Yes → SyntaxMapping Rule and Property-Attribute Map Entry
│       │   └── No → PassThrough Token
```
<br>

**※ Design Tokens In Syntax Mapping Rules**  

You must import relevant design token files if used in a rule file to ensure compile-time validation.

<br>

### ¶ Best Practices

<br>

1. Prefer Design System Tokens whenever possible.
2. Use Syntax Rule Mappings for structured properties, relationships, or syntax extension.
3. Minimize PassThroughToken usage.

<br>

</details>

## § Configuration

Elevate is designed with a powerful, flexible configuration system that allows deep customization while maintaining strict design system integrity. With great power, however, comes great responsibility. Take time to thoroughly review and align the configuration options with your project's specific design requirements and architectural goals. For a comprehensive understanding, dive into the detailed documentation below.

<details>
<summary>Click Here To Read More</summary>

<br>

### ¶ Framework Configuration

Configure Elevate's general settings in `elevate/config/elevate.ts`:

```typescript
// elevate/config/elevate.ts
const options = {
    Watch:'./',                // Directory to watch for changes
    FileTypes: ['html', 'jsx', 'tsx', 'astro'], // File extensions to scan
    Output:'./'                // Output directory for generated CSS
}

export const config = options
```
<br>

Import and distribute design system tokens in `elevate/config/design.ts`

```typescript
// elevate/config/designConfig.ts
import { colors } from "../design/colors.js";
import { spacing } from "../design/spacing.js";
import { typography } from "../design/typography.js";

export const designSystem = {
    ColorToken: colors,
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    FontWeightToken: typography.weight,
};
```
<br>

Import and distribute syntax rule mappings in `elevate/config/rules.ts`

```typescript

//Rule Submap Imports Defined in 'Maps' Directory.
import { flex } from '../rules/flex.js';
import { border } from '../rules/border.js';
import { text } from '../rules/text.js';
import { grid } from '../rules/grid.js';
import { numeric } from '../rules/numeric.js';

//Token Type Definitions
export const rulesMaster = {
    TextAlignToken: text.align,
    TextTransformToken: text.transform,
    BreakPointToken: breakpoints,
    xAxis: flex.xAxis,
    yAxis: flex.yAxis,
    BorderWidthToken: border.width,
    BorderRadiusToken: border.radius,
    BorderStyleToken: border.style,
    FlexGrowToken: flex.flexGrowToken,
    FlexShrinkToken: flex.flexShrinkToken,
    FlexSelfToken: flex.flexSelfToken,
    FlexOrderToken: flex.flexOrderToken,
    FlexBasisToken: flex.flexBasisToken,
    NumericToken: numeric.NumericToken,
    GridGapToken: grid.gap,
    GridRowToken: grid.row,
    GridColumnToken: grid.column
};

```

<br>


### ¶ Extending Elevate: A Comprehensive Guide

Elevate is designed to be extensible and adaptable, allowing you to easily add new features and functionality that help you embody your design system in a way that is both consistent and maintainable within your codebase.

<details>
<summary>Click Here To Read More</summary>
<br>

**※ Included Example**  

By default, Elevate includes a basic example of extending the design system. Please see `example.ts` and `design.ts`.


#### 1. Design Token File Creation

The most straightforward way to add a new token type is to create a new file in the `design/` directory. 

**Location:** `elevate/design/`  
**File Naming Convention:** Use a descriptive, singular noun (e.g., `brandColors.ts`)

**Example: Brand Color Tokens**
```typescript
export const example = {
    'example':'#39FF14'
} as const

export type ExampleToken = keyof typeof example;
```

**Key Principles:**
- Use `as const` for strict type inference
- Create a type using `keyof typeof`
- Provide clear, descriptive comments
- Limit tokens to a single, cohesive concept

<br>

#### 2. Design Token Integration

When you create a new design token file, you must import it in `elevate/config/design.ts` and add it to the `designSystem` object. For compatability with the existing rules, you can spread the new token type into the existing token categories.

**File:** `elevate/config/design.ts`

**Integration Steps:**
```typescript
//Design Token Imports Defined in 'Design' Directory.
import { example } from "../design/example.js";
import { colors } from "../design/colors.js";
import { spacing } from "../design/spacing.js";
import { typography } from "../design/typography.js";

//Token Type Definitions
export const designSystem = {
    ColorToken: { ...colors, ...example },
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    FontWeightToken: typography.weight,
};
```

<br>

#### 3. Syntax Mapping Rule Creation

Mapping rules allow for you to extend Elevate to better fit your use case or to model your design system's syntax in a way that is
consistent, maintainable, and appropriate to the product you are creating. You are essentially defining an intermediary token type that can be used in place of a design token type. 
<br>
Elevate suggests reading this section with care as it is a critical aspect of Elevate's design philosophy and architecture.
<br>

**※ Token Collisions and How to Avoid Them**  

Out of the box, Elevate supports an order agnostic syntax structure. It doesn't matter where you place a given design token in a utility string, so long as the syntax is valid and the rule is defined correctly in the property attribute map. It does so through a sophisticated "first match wins" strategy whereby a token passed "slots" to the first CSS declaration that expects a token of that type in your property. 

<br>

```typescript
    // Typography
    text: {
        "font-size": "FontSizeToken",
        "color": "ColorToken",
        "font-family": "FontFamilyToken",
        "line-height": "LineHeightToken",
        "letter-spacing": "LetterSpacingToken",
        "text-align": "TextAlignToken",
        "max-width": "MeasureToken",
        "font-weight": "FontWeightToken",
        "text-transform": "TextTransformToken"
    },

    //You can write text:red:bold or text:bold:red and the order doesn't matter.
```

<br>

However, if you have two CSS declarations that share a common token type, you might run into something called a token collision and get unexpected results. A token collision is when two tokens passed through a utility string try to match to the same CSS declaration. To avoid this, you must create a new rule in `elevate/rules` to define an intermediary token to allow the system to differentiate and then use that intermediary token in the property attribute map. That's the powerful affordance of rules in Elevate. 


**File:** `elevate/maps/propertyAttributeMap.ts`

**Mapping Strategies:**

**A. Direct Token Mapping**
```typescript
//Typically defined directly in the property attribute map for simplicity
 'max-w': {
        "max-width": "SpacingToken",
    },
```

**B. Submap for Syntax Extension or to Avoid Token Collisions**
```typescript
//Typically defined in a rule file, exported as a syntax mapping rule, which is then referred to in the property attribute map.
 'text': {
        "font-size": "FontSizeToken",
export const text = {
    align: {
        'left': 'left',
        'center': 'center',
        'right': 'right',
        'justify': 'justify'
      },

      transform: {
        'uppercase': 'uppercase',
        'lowercase': 'lowercase',
        'capitalize': 'capitalize'
      }


} as const;

export type textAlignToken = keyof typeof text.align;
export type textTransformToken = keyof typeof text.transform;

```

<br>

#### 4. Token Usage Guidelines 

**Naming Conventions:**
- Use clear, semantic names
- Prefix with the token type (e.g., `BrandColorToken`)
- Avoid generic names that might cause collisions

**Type Safety Checks:**
- Verify token existence before use
- Use TypeScript's type system to prevent runtime errors

**Performance Considerations:**
- Use rules for complex, related tokens or syntactic relationships.
- Minimize the number of token types as possible.


<br>

#### Helpful Tips

**Extension Considerations:**
- As you begin extending Elevate to fit your use case, consider the following:
  1. Design system tokens should always be defined in the design directory and you can spread them in the existing token categories in `elevate/config/design.ts`.
  2. If you're feeling confused about how rules work, examine the existing rules that allow Elevate to work out of the box.
  3. You can effectively create your own use case specific syntax for your project via rules, but do so with care and consideration if you do.

<br>

#### Troubleshooting 

**Common Issues:**
- If a token doesn’t map correctly, verify the following:
  1. The design token is properly **exported** in the token file.
  2. The design token is correctly **imported** in `design.ts`.
  3. All relevant **rules** are updated for your use case.
  4. The design token or subsequent rules are included in **`propertyAttributeMap.ts`**.
  5. Ensure **type consistency** across all definitions.
</details>
<br>

### ¶ Project Structure

<br>

```
elevate/
├── config/     # Framework configuration
│   ├── designConfig.ts
│   └── elevate.ts
├── core/       # Core parsing and compilation logic
│   ├── index.ts
│   ├── parser.ts
│   ├── scan.js
│   └── utility.ts
├── design/     # Design system tokenization
├── maps/       # Property-attribute mappings
└── README.md

```
<br>

</details>

## § Why Elevate?

The goal of Elevate CSS is to introduce a new standard in the world of utility-first frameworks by addressing fundamental shortcomings in traditional approaches while introducing a rigorous, token-driven, compile-time-validated methodology. Unlike other frameworks, Elevate is purpose-built to maintain strict design system adherence, enforce correctness, and enable long-term scalability.

<details>
<summary>Click Here To Read More</summary>

<br>

### ¶ Market Differentiation and Competitive Positioning

Elevate CSS stands apart in the market of CSS frameworks by introducing a novel approach to styling that prioritizes **engineering rigor, design system integrity, and long-term maintainability**. Here's how Elevate differentiates itself:

<br>

#### **From Arbitrary Utilities to Rigorous Token Enforcement**

- **Market Problem:**  
   Popular frameworks like TailwindCSS provide a vast library of atomic utilities but fail to enforce strict adherence to design tokens. Developers often introduce "off-scale" or inconsistent values, degrading the integrity of the design system.

- **Elevate’s Innovation:**  
   At the heart of Elevate CSS is a token-driven architecture. All styles are tied to pre-approved, strictly typed design tokens. These tokens are validated at compile-time, ensuring that every property and modifier reflects the design system with absolute precision. This guarantees consistency across projects and eliminates the guesswork of arbitrary class selections.

**Key Differentiator:**  
Elevate CSS makes design tokens immutable rules, not optional guidelines, elevating the design system to a first-class citizen in your codebase.

 <br>

#### **From Class Bloat to Declarative, Semantic Syntax**

- **Market Problem:**  
   Tailwind-style class stacks often lead to verbose, hard-to-read code (e.g., `bg-blue-500 px-4 py-2 text-sm`). This makes it difficult to discern design intent, creating challenges in onboarding, auditing, and maintaining large-scale projects.

- **Elevate’s Innovation:**  
   Elevate employs a concise, property:modifier syntax that inherently maps to pre-approved tokens. Instead of verbose class lists, styles like `text:purple:bold space:y-2` are declarative, semantic, and self-explanatory. This transforms your codebase into a readable, maintainable narrative of design decisions, reducing cognitive overhead.

**Key Differentiator:**  
Elevate’s syntax doubles as living documentation of your design system, making intent visible and self-validating.

<br>

#### **Compile-Time Validation for Guaranteed Correctness**

- **Market Problem:**  
   Frameworks like Tailwind rely on runtime checks or visual testing to catch errors such as misspelled classes (`bg-blu-500`). This leaves room for subtle inconsistencies and styling drift, increasing QA overhead and technical debt.

- **Elevate’s Innovation:**  
   With a compiler-like approach, Elevate validates all classes and tokens at compile-time. Errors such as typos, unauthorized modifiers, or off-scale values fail the build, ensuring that only correct, consistent styles make it to production. This engineering-first mindset eliminates reliance on manual checks.

**Key Differentiator:**  
Elevate CSS enforces correctness by construction, ensuring that styling errors are caught early and automatically.

<br>

#### **From Utility Overload to Structured, Composable Logic**

- **Market Problem:**  
   While Tailwind’s atomic classes are flexible, there’s no inherent conceptual framework guiding how to compose them into meaningful patterns. Teams must rely on conventions or documentation to maintain consistency, which becomes unsustainable at scale.

- **Elevate’s Innovation:**  
   Elevate organizes styles around meaningful categories (e.g., `text`, `space`, `color`) and strictly typed tokens. The framework encourages reuse through property-to-modifier maps, building a coherent styling vocabulary over time. This structured approach promotes maintainability and scalability, particularly for large, complex projects.

**Key Differentiator:**  
Elevate turns ad-hoc class lists into a stable, composable styling system that grows with your project.

<br>

#### **True System Integration at Scale**

- **Market Problem:**  
   As projects evolve, traditional frameworks expand by adding more utilities, often resulting in bloated stylesheets and fragmented design adherence. Without enforcement mechanisms, large teams may struggle to maintain alignment with the design system.

- **Elevate’s Innovation:**  
   Elevate integrates deeply with the design system by treating it as the foundation of all styling decisions. Breakpoints, states, and tokens are managed as typed constants, ensuring that changes propagate coherently throughout the codebase. This enables large teams to scale their design systems without sacrificing consistency.

**Key Differentiator:**  
Elevate CSS grows with your design system, enforcing alignment and coherence as complexity increases.

<br>

#### **Engineering Rigor Meets Front-End Styling**

- **Market Problem:**  
   CSS frameworks have traditionally relied on flexibility and intuition, leaving consistency to human judgment. This creates friction for teams that value type safety, static analysis, and compile-time guarantees.

- **Elevate’s Innovation:**  
   By leveraging TypeScript, Abstract Syntax Tree (AST) parsing, and static analysis, Elevate applies engineering principles to front-end styling. Developers gain a predictable, type-safe workflow that aligns with modern software development practices.

**Key Differentiator:**  
Elevate CSS transforms styling into a rigorously engineered system, ensuring long-term maintainability and reliability.

<br>

### ¶ Competitive Positioning: TailwindCSS vs. Elevate CSS

| **Feature/Philosophy**      | **TailwindCSS**                               | **Elevate CSS**                                |
|-----------------------------|-----------------------------------------------|-----------------------------------------------|
| **Core Philosophy**          | Utility-first pragmatism                     | Design-driven, strictly validated             |
| **Design System Adherence**  | Theming encouraged but optional              | Immutable token enforcement                   |
| **Error Handling**           | Runtime reliance, visual QA                  | Compile-time validation                       |
| **Code Readability**         | Verbose class lists                          | Declarative, semantic syntax                  |
| **Scalability**              | Relies on team discipline                    | Guaranteed via token and type enforcement     |
| **Developer Workflow**       | Rapid iteration                              | Intentional, error-proof engineering          |
| **Output Efficiency**        | JIT-optimized CSS                            | Compile-time optimized, minimal CSS           |

<br>

### ¶ Why Choose Elevate CSS?

Elevate CSS introduces a new standard for utility-first frameworks by prioritizing **design consistency**, **compile-time correctness**, and **long-term maintainability**. It’s a framework built for teams and projects that demand more than quick fixes, empowering developers to create future-proof codebases without compromising on clarity or precision.

- **For Teams Scaling Design Systems:**  
   Elevate ensures that every styling decision aligns with your design language, preventing drift as your project grows.

- **For Projects Demanding Consistency:**  
   By strictly enforcing tokens and validating at compile-time, Elevate guarantees that every style adheres to the system.

- **For Developers Who Value Clarity:**  
   Elevate’s semantic syntax reveals intent, making codebases easier to read, teach, and maintain.

<br>

</details>

## § Product Roadmap

The framework is actively evolving to adapt to the evolving needs of the design and development community. With that said, here are some of the key features being worked on and planned for the near future:

<details>
<summary>Click Here To Read More</summary>

### ¶ Planned Features

<br>

- Child selector support
- Expanded grid support with expressive syntax
- Container query support
- Logical property support for internationalization and flexible layouts
- Accessibility-focused utilities such as `hidden:visually` and ARIA state helpers
- Advanced selector composition for sibling selectors, combinators, and pseudo-classes
- More to come, so check back regularly!

<br>

### ¶ Selector Support

| **Selector Type**          | **Examples**                                | **Description**                                                             | **Framework Support** |
|-----------------------------|---------------------------------------------|-----------------------------------------------------------------------------|------------------------|
| **State Selectors**         | `:hover`, `:focus`, `:active`, `:visited`  | Styles elements based on user interactions (hover, focus, etc.).            | ✅ Supported           |
|                             | `:disabled`                                | Applies styles to disabled elements.                                        | ✅ Supported           |
| **Structural Pseudo-classes**| `:first-child`, `:last-child`, `:only-child`| Targets elements based on their structural position within the DOM.         | ✅ Supported           |
|                             | `:empty`                                   | Matches elements with no children or content.                               | ✅ Supported           |
|                             | `:nth-child(n)`, `:nth-of-type(n)`         | Targets elements based on their position among siblings.                    | ❌ Unsupported         |
|                             | `:has()`                                   | Matches parents that contain specific children.                             | ❌ Unsupported         |
| **Form and Input States**   | `:checked`, `:required`, `:optional`       | Targets form inputs based on validation or attribute states.                | ✅ Supported           |
|                             | `:valid`, `:invalid`                       | Applies styles to valid or invalid form fields.                             | ✅ Supported           |
|                             | `:in-range`, `:out-of-range`               | Matches inputs within or outside a specified range.                         | ✅ Supported           |
| **Pseudo-elements**         | `::before`, `::after`                      | Inserts content before or after an element's actual content.                | ✅ Supported           |
|                             | `::first-letter`, `::first-line`           | Styles the first letter or line of an element's content.                    | ✅ Supported           |
|                             | `::placeholder`, `::selection`             | Applies styles to placeholder text or selected text.                        | ✅ Supported           |
| **Attribute Selectors**     | `[attr=value]`, `[attr^=value]`            | Matches elements based on attribute values (exact, prefix, suffix, etc.).   | ❌ Unsupported         |
|                             | `[attr*=value]`, `[attr~=value]`           | Matches elements where the attribute contains or is in a space-separated list.| ❌ Unsupported         |
| **Combinators**             | `>`, `+`, `~`                              | Matches elements based on parent-child or sibling relationships.            | ❌ Unsupported         |
| **Group Selectors**         | `:is()`, `:where()`                        | Matches elements using a list of selectors.                                 | ❌ Unsupported         |
| **Target and Logical States**| `:target`                                  | Styles elements based on URL fragment targeting (e.g., `#section`).         | ❌ Unsupported         |
|                             | `:lang()`, `:dir()`                        | Matches elements based on language or text direction.                       | ❌ Unsupported         |
| **Universal Selectors**     | `*`                                        | Matches all elements.                                                       | ❌ Unsupported         |
| **Type Selectors**          | `div`, `p`, `span`                         | Matches all elements of a specific type.                                    | ❌ Unsupported         |
| **ID Selectors**            | `#id`                                      | Matches elements with a specific `id`.                                      | ❌ Unsupported         |
| **Class Selectors**         | `.class`                                   | Matches elements with a specific `class`.                                   | ❌ Unsupported         |
| **Descendant Selectors**    | `ancestor descendant`                      | Matches elements nested within an ancestor.                                 | ❌ Unsupported         |
| **Negation Selectors**      | `:not(selector)`                           | Matches elements that do not match a given selector.                        | ❌ Unsupported         |

<br>

</details>

## § Licensing

Elevate CSS is released as open-source software to empower developers to create scalable and maintainable design systems. The framework is provided with the intent to foster collaboration and community contributions, while retaining full ownership and rights by the original author.

### ¶ Key Points

- **Permitted Use**:  
   The code can be used, modified, and distributed for personal or commercial projects under the terms of the license.

- **Attribution**:  
   Attribution to the original author is required in all derivative works.

- **Restrictions**:  
   Redistribution or modification of the code must retain this license and its terms.

- **Ownership**:  
   The name "Elevate CSS," its branding, and all related intellectual property remain solely owned by the original author.

Elevate CSS’s licensing structure ensures that while the framework remains open-source, the rights and ownership stay intact with its creator. This allows for potential future commercialization or other endeavors as determined by the author.

<br>

**Elevate Your Code. Elevate The Web.**
