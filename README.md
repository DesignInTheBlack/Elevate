# Elevate CSS: The Design Driven Utility Framework

<br>

Elevate CSS is a compile-first utility framework that transforms your styling layer into a seamless extension of your design system. With a token-driven architecture, expressive utility string (property:modifier) syntax, and build-time validation, Elevate ensures every styling decision is consistent, intentional, and scalable. By bridging the gap between design and development, Elevate empowers teams to create maintainable, error-free, and future-proof codebases with clarity and precision.

<br>

## § Table of Contents

<br>

**※ Please Excuse Our Progress:**  

In it's current iteration (v0.1-alpha), Elevate CSS is a work in progress and subject to change. I welcome your feedback and suggestions for future enhancements as I take this project from a technical proof-of-concept to a full-fledged utility framework. 

<br>
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

- **Build-Time Validation**
  - Elevate validates utility strings, tokens, and rules during the build process.
  - Ensures class definitions conform to your design system before CSS is generated.
  - Errors like invalid properties or tokens are caught at build time, producing error-free CSS.

- **Strict Design Integration**
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
   Styling choices should serve as self-documenting expressions of design intention, ensuring intuitive understanding and long-term maintainability.

- **Consistency and Consideration**  
   The design system is the single source of truth, rigorously upheld through build-time validation to eliminate off-scale values and unauthorized modifications. 

- **Extensible and Reliable**  
   Elevate must support growth and adaptation while maintaining simplicity, with styling validated at build-time to guarantee alignment with the design system on every build. 

<br>

### ¶ Architectural Approach


**Key Technical Innovations:**
- **Build-Time Parsing**: Uses Chevrotain for robust class attribute tokenization
- **Mobile-First Design**: Intelligent breakpoint processing
- **Declarative Syntax**: Transforms HTML class attributes into optimized CSS

**Parsing Strategy:**
1. **File Scanning**: Discover class attributes across project files
2. **Lexical Analysis**: Tokenize class strings
3. **Syntax Parsing**: Convert syntax to Concrete Syntax Trees (CST)
4. **CSS Generation**: Transform CST into optimized CSS


<br>

## § Quick Start Guide

This quick start guide is included to give you an opportunity to dive right into the world of Elevate CSS. With that said, however, it is **highly recommended** that you familiarize yourself with the **configuration** section as well as it provides a deeper understanding of Elevate's capabilities, functionality, and best practices as well as how to best leverage the framework for your specific needs.

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

<details>
<summary>Click Here To Continue Reading</summary>


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
   - Validate property values, provide transformations.
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
   - **Characteristics:** Validate property values, provide transformations, and structure syntax.

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
   - No build-time validation, for dynamic or flexible values.
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

You must import relevant design token files if used in a rule file to ensure build-time validation.

<br>

### ¶ Best Practices

<br>

1. Prefer Design System Tokens whenever possible.
2. Use Syntax Rule Mappings for structured properties, relationships, or syntax extension.
3. Minimize PassThroughToken usage.

<br>

</details>
<br>

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
import { breakpoints } from '../design/breakpoints.js';

//Token Type Definitions
export const rulesMaster = {
    TextAlignRule: text.align,
    TextTransformRule: text.transform,
    BreakPointToken: breakpoints,
    xAxis: flex.xAxis,
    yAxis: flex.yAxis,
    BorderWidthRule: border.width,
    BorderRadiusRule: border.radius,
    BorderStyleRule: border.style,
    FlexGrowRule: flex.flexGrowRule,
    FlexShrinkRule: flex.flexShrinkRule,
    FlexSelfRule: flex.flexSelfRule,
    FlexOrderRule: flex.flexOrderRule,
    FlexBasisRule: flex.flexBasisRule,
    GridGapRule: grid.gap,
    GridRowRule: grid.row,
    GridColumnRule: grid.column
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
} 
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

Out of the box, Elevate supports an order agnostic syntax structure. It doesn't matter where you place a given design token in a utility string, so long as the syntax is valid and the rule is defined correctly in the property attribute map. It does so through a "first match wins" strategy whereby a modifier passed "slots" to the first CSS declaration that expects a token or rule of that type in the property attribute map.

<br>

```typescript
    // Typography
    text: {
        "font-size": "FontSizeToken",
        "color": "ColorToken",
        "font-family": "FontFamilyToken",
        "line-height": "LineHeightToken",
        "letter-spacing": "LetterSpacingToken",
        "text-align": "TextAlignRule",
        "max-width": "MeasureToken",
        "font-weight": "FontWeightToken",
        "text-transform": "TextTransformRule"
    }

    //You can write text:red:bold or text:bold:red and the order doesn't matter.
```

<br>

However, if you have two CSS declarations that share a common token type, you might run into something called a token collision and get unexpected results. A token collision is when two tokens passed through a utility string try to match to the same CSS declaration. To avoid this, you must create a new rule in `elevate/rules` to define an intermediary rule to allow the system to differentiate and then use that intermediary rule in the property attribute map as seen above.

**Mapping Strategies:**

**A. Direct Token Mapping**
```typescript
//Typically defined directly in the property attribute map for simplicity
 'max-w': {
        "max-width": "SpacingToken",
    },

//propertyAttributeMap.ts
```

**B. Submap for Syntax Extension or to Avoid Token Collisions**
```typescript
//Typically defined in a rule file, exported as a syntax mapping rule, which is then referred to in the property attribute map.
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
} 

//text.ts in the rules directory
```

<br>

#### 4. Token and Rule Usage Guidelines 

**Naming Conventions:**
- Use clear, semantic names
- Prefix with the token type or Rule Purpose (e.g., `BrandColorToken` or `TextAlignRule`)
- Avoid generic names that might cause collisions

**Performance Considerations:**
- Use rules for complex, related tokens or syntactic relatationships or expanding the syntax.
- Minimize the number of token types and rules as possible to minimize complexity.


<br>

#### Helpful Tips

**Extension Considerations:**
- As you begin extending Elevate to fit your use case, consider the following:
  1. Design system tokens should always be defined in the design directory and you can spread them in the existing token categories in `elevate/config/design.ts`.
  2. Examine the existing rules that allow Elevate to work out of the box by mapping token types to intermediary rules to CSS declarations in the property attribute map.
  3. You can effectively create your own use case specific syntax for your project via these intermediary rules, but do so with care and consideration if you do.

<br>

#### Troubleshooting 

**Common Issues:**
- If a token doesn’t map correctly, verify the following:
  1. The design token is properly **exported** in the token file.
  2. The design token is correctly **imported** and *configured* in `design.ts`.
  3. All relevant **rules** are updated for your use case and structured correctly.
  4. The design token or subsequent rules are included in **`propertyAttributeMap.ts`** in an entry for the property you are trying to map.
  5. Ensure **consistency** across all definitions.
</details>
<br>

### ¶ Project Structure

<br>

```
elevate/
├── config/     # Framework configuration
│  
├── core/       # Core parsing and compilation logic
│  
├── design/     # Design system tokenization
│  
└── rules/      # Syntax mapping rules

```
<br>

</details>

<br>

## § Why Elevate?

The goal of Elevate CSS is to introduce a new standard in the world of utility-first frameworks by addressing fundamental shortcomings in traditional approaches while introducing a rigorous, token-driven, build-time-validated methodology. Unlike other frameworks, Elevate is purpose-built to maintain strict design system adherence, enforce correctness, and enable long-term scalability.

<details>
<summary>Click Here To Read More</summary>

<br>

### **Market Differentiation and Competitive Positioning**

Elevate CSS introduces an **engineering-first approach** to front-end styling, differentiating itself from frameworks like TailwindCSS by prioritizing **design system integrity, maintainability, and build-time validation**. Here’s how Elevate CSS stands apart:

<br>

#### **From Arbitrary Utilities to Token-Driven Enforcement**

- **Market Problem:**  
   TailwindCSS provides immense flexibility but lacks mechanisms to **enforce design system constraints**. Developers can easily introduce arbitrary values (e.g., `px-3.5`, `text-[14px]`), leading to **inconsistent styling** and design drift.

- **Elevate’s Innovation:**  
   Elevate CSS enforces strict adherence to **immutable design tokens** for properties like color, spacing, and typography. By validating styles **at build time**, it ensures that every property and modifier aligns with the design system, eliminating guesswork and inconsistencies.

**Key Differentiator:**  
Elevate turns your design tokens into **enforceable rules**, not optional guidelines, ensuring design consistency across projects.

<br>

#### **Build-Time Validation for Guaranteed Correctness**

- **Market Problem:**  
   TailwindCSS relies on **manual checks** and runtime visibility to catch issues like typos or invalid class names (`bg-blu-500`). This reactive approach increases QA overhead and technical debt.

- **Elevate’s Innovation:**  
   Elevate validates **all utility strings and tokens during the build process**, catching errors like misspelled classes or unauthorized modifiers **before production**. Incorrect styles fail the build, ensuring only valid and consistent styles are shipped.

**Key Differentiator:**  
Elevate acts as a **compiler for CSS**, enforcing correctness at build time and eliminating reliance on manual QA or runtime checks.

<br>

#### **From Class Bloat to Declarative, Semantic Syntax**

- **Market Problem:**  
   Tailwind's utility-first approach leads to **verbose, hard-to-read class lists** that obscure design intent (`bg-blue-500 px-4 py-2 text-sm`). Maintaining and auditing these class stacks becomes challenging, especially in large projects.

- **Elevate’s Innovation:**  
   Elevate adopts a **property:modifier syntax** (e.g., `text:purple:bold space:y-2`) that maps directly to pre-approved design tokens. This concise syntax makes classes self-explanatory, reducing cognitive overhead and improving code readability.

**Key Differentiator:**  
Elevate’s declarative syntax doubles as **living documentation** of your design system, making design intent visible and maintainable.

<br>

#### **From Utility Overload to Structured, Composable Logic**

- **Market Problem:**  
   Tailwind's atomic classes provide flexibility but lack a conceptual framework, leaving teams to define their own conventions. This becomes unsustainable as projects and teams scale.

- **Elevate’s Innovation:**  
   Elevate organizes styles around meaningful categories (e.g., `text`, `grid`, `space`) and validates modifiers against strictly defined design tokens. This structured approach builds a coherent vocabulary over time, making the system easier to scale and maintain.

**Key Differentiator:**  
Elevate transforms ad-hoc class lists into a **stable, composable styling system** that grows with your project.

<br>

#### **True System Integration at Scale**

- **Market Problem:**  
   Tailwind expands by adding more utilities, often resulting in bloated stylesheets and fragmented design adherence. Large teams frequently struggle to maintain alignment with the design system.

- **Elevate’s Innovation:**  
   Elevate treats the design system as the **foundation of all styling decisions**. Breakpoints, states, and tokens are managed as **runtime-validated constants**, ensuring that changes propagate consistently throughout the codebase. This enables large teams to scale their design systems without sacrificing alignment or maintainability.

**Key Differentiator:**  
Elevate CSS integrates deeply with your design system, ensuring **coherence and scalability** as complexity grows.

<br>

#### **Engineering Rigor Meets Front-End Styling**

- **Market Problem:**  
   CSS frameworks often prioritize flexibility, relying on intuition and human judgment to maintain consistency. This creates friction for teams that value predictable workflows, reliable validation, and build-time guarantees.

- **Elevate’s Innovation:**  
   By leveraging **structured token and rule definitions**, AST parsing, and **compiler-driven validation**, Elevate brings engineering principles to front-end styling. Developers benefit from a predictable, reliable workflow that aligns with modern software practices.

**Key Differentiator:**  
Elevate CSS transforms styling into a rigorously engineered system, enabling **long-term maintainability and reliability**.


<br>

### ¶ **TailwindCSS vs. Elevate CSS**

| **Feature/Philosophy**      | **TailwindCSS**                               | **Elevate CSS**                                |
|-----------------------------|-----------------------------------------------|-----------------------------------------------|
| **Core Philosophy**          | Utility-first pragmatism                     | Design-driven, validated at build time  |
| **Design System Adherence**  | Theming encouraged but optional              | Immutable token validation                    |
| **Error Handling**           | Runtime reliance, visual QA                  | Build-time validation                         |
| **Code Readability**         | Verbose class lists                          | Declarative, semantic syntax                  |
| **Scalability**              | Relies on team discipline                    | Token and rule driven consistency and validation       |
| **Developer Workflow**       | Rapid iteration                              | Intentional, error-proof engineering          |
| **Output Efficiency**        | JIT-optimized CSS                            | Build-time optimized, minimal CSS             |


<br>

### ¶ Why Choose Elevate CSS?

Elevate CSS introduces a new standard for utility-first frameworks by prioritizing **design consistency**, **build-time correctness**, and **long-term maintainability**. It’s a framework built for teams and projects that demand more than quick fixes, empowering developers to create future-proof codebases without compromising on clarity or precision.

- **For Teams Scaling Design Systems:**  
   Elevate ensures that every styling decision aligns with your design language, preventing drift as your project grows.

- **For Projects Demanding Consistency:**  
   By strictly enforcing tokens and validating at build-time, Elevate guarantees that every style adheres to the system.

- **For Developers Who Value Clarity:**  
   Elevate’s semantic syntax reveals intent, making codebases easier to read, teach, and maintain.

<br>

</details>

<br>

## § Product Roadmap

The framework is actively evolving to adapt to the evolving needs of the design and development community. Currently, Elevate CSS is a proof-of-concept framework that aims to redefine utility-first CSS approaches. It is in an early, experimental stage and I warmly welcome community feedback, contributions, and insights. Our goal is to collaborate with developers and designers to refine and improve the framework, addressing real-world challenges:

<details>
<summary>Click Here To Read More</summary>

### ¶ Planned Features

<br>

- Statis Analysis and Compile Time Guarantees 
- IDE Integration for Syntax Highlighting and Autocomplete
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

<br>

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
