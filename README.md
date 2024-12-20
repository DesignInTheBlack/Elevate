# Elevate CSS: The Design Driven Utility Framework

<br>

Elevate CSS is a compile-first utility framework that transforms your styling layer into a seamless extension of your design system. With a token-driven architecture, expressive and expandable utility string (property:modifier) syntax, and build-time validation, Elevate ensures every styling decision is consistent, intentional, and scalable. By bridging the gap between design and development, Elevate empowers teams to create maintainable, error-free, and future-proof codebases with clarity and precision.

<br>

## § Table of Contents

<br>

**※ Please Excuse The Progress:**  

In it's current iteration (v0.1-alpha), Elevate CSS is a proof of concept and subject to change. I welcome your feedback and suggestions for future enhancements as I take this project from a technical proof-of-concept to a full-fledged utility framework. 

<br>
<br>

1. [Introduction](#-introduction)
2. [Features](#-features)
3. [Design Philosophy & Architecture](#-design-philosophy--architecture)  
   - [Core Design Principles](#-core-design-principles)   
4. [Syntax and Usage](#-syntax-and-usage)  
   - [Quick Start](#-quick-start)  
   - [Syntax Guide](#-syntax-guide)  
   - [Responsive Styling](#-responsive-styling)  
   - [Contextual and Functional Flags](#-contextual-and-functional-flags)  
   - [Design Tokens and Rules](#-design-tokens-and-rules)
   - [Special Tokens](#-special-tokens)    
   - [Token Selection Guide](#-token-selection-guide)  
   - [Best Practices](#-best-practices)  
5. [Configuration](#-configuration)  
   - [Framework Configuration](#-framework-configuration)  
   - [Extending Elevate: A Comprehensive Guide](#-extending-elevate-a-comprehensive-guide)  
   - [Project Structure](#-project-structure)  
6. [Why Elevate](#-why-elevate)  
   - [TailwindCSS vs Elevate CSS](#-tailwindcss-vs-elevate-css)  
   - [Why Choose Elevate CSS](#-why-choose-elevate-css)  
7. [Product Roadmap](#-product-roadmap)  
   - [Planned Features](#-planned-features)  
   - [Selector Support](#-selector-support)  
8. [Licensing and Attribution](#-licensing)
       

<br>

## § Design Philosophy
<br>

### ¶ Core Design Principles


- **Expressive and Intentional**  
   Styling choices should serve as self-documenting expressions of design intention, ensuring intuitive understanding and long-term maintainability.

- **Consistency and Consideration**  
   The design system is the single source of truth, rigorously upheld through build-time validation to eliminate off-scale values and unauthorized modifications. 

- **Extensible and Reliable**  
   Elevate must support growth and adaptation while maintaining simplicity, with syntax validated at build-time to guarantee alignment with the design system on every build. 

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

At the heart of Elevate's syntax are what is called "utility strings", which are used to describe styling and serve as the basis for CSS generation. They also double as the actual CSS classes. Unlike traditional utility frameworks which come packed with pre-defined utility classes, you are effectively writing CSS as you write utility strings in Elevate through the expression of property and modifier combinations.

<br>

**The Format**:

```html
<div class = "property:modifier:modifier">
```

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

Allows complex, conditional styling for states, conditions, and other pseudo-classes or pseudo-elements:

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

**Design System Tokens (Tokens)**
   - Global, immutable design constraints.  
   - Centralized values, enforce system-wide consistency.
<br>

**Syntax Rule Mappings (Rules)**  
   - Property-specific structural validation.  
   - Validate property values, provide transformations.
   - Allow for syntax extensions and modification through syntax rule mapping.
<br>


1. **Design System Tokens**  
   - **Purpose:** Global, immutable design constraints.  
   - **Location:** `design/` directory  
   - **Configuration:** `elevate/config/design.ts` and `elevate/design`
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
   } 

   ```

<br>

2. **Syntax Rule Mappings**  
   - **Purpose:** Property-specific structural validation and syntax construction or extension.  
   - **Location:** `rules/` directory  
   - **Configuration:** `elevate/config/declarationMap.ts`, `elevate/config/rules.ts` and `elevate/rules`
   - **Characteristics:** Validate property values, provide transformations, and structure or extend syntax.

   **Example:**
   ```typescript
   // rules/grid.ts

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
   } 

   ```
<br>



 ### ¶ Special Tokens

 <br>

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

  **Numeric Tokens**  
   - For numeric values.  
   - Build-time validation ensures that the value is a valid number.
   - Primarily used for CSS rules that require numeric values.

   <br>

   **Example:**

   ```typescript
   //Declaration Map
   // =============================
    // Z-Index
    // =============================
    z: { "z-index": "NumericToken" }
   ```

   ```html
   <div class="z:20"></div>
   ```
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
│       │   ├── Yes → Rule and Property-Attribute Map Entry
│       │   └── No → PassThrough Token
```
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
//Design System Token Imports Defined in 'Design' Directory.
import { example } from "../design/example.js";
import { colors } from "../design/colors.js";
import { spacing } from "../design/spacing.js";
import { typography } from "../design/typography.js";

//Elevate Number Validation
import { numeric } from '../etc/numeric.js';

//Token Type Definitions
export const designSystem = {
    ColorToken: { ...colors, ...example },
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    FontWeightToken: typography.weight,
    NumericToken: numeric,
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
    FlexGrowRule: flex.Grow,
    FlexShrinkRule: flex.Shrink,
    FlexSelfRule: flex.Self,
    FlexOrderRule: flex.Order,
    FlexBasisRule: flex.Basis,
    GridGapRule: grid.gap,
    GridRowRule: grid.row,
    GridColumnRule: grid.column
};

```

<br>


### ¶ Extending Elevate: A Comprehensive Guide

Elevate is designed to be extensible and adaptable, allowing you to easily integrate your design system or add new features and functionality that help you embody your design system in a way that is both consistent and maintainable within your codebase.

<details>
<summary>Click Here To Read More</summary>
<br>


#### Design System Integration

If your goal is to simply integrate your design system into elevate, you can follow these steps:

<br>

1. Add new categorized design tokens to the `elevate/design` directory in alignment with your design system.

```
//example-brandTokens.ts
export const BrandColors = {

    //Define New Token Categories

    BrandBackgroundTokens: {
    'popgreen':'#39FF14'
    },

    BrandCopyTokens: {
    'popwhite': '#FFFFFF',
    }

} 

```

<br>

2. Import the new token categories into `elevate/config/design.ts`. 

```

//Importing Our New Token Categories
import { BrandColors } from "../design/example-brandTokens.js";

```

<br>

3. Spread the new token categories into the appropriate token definition for compatability with Elevate's existing syntax.

```
//Token Definitions
export const designSystem = {
   ColorToken: { ...colors, ...BrandColors.BrandBackgroundTokens, ...BrandColors.BrandCopyTokens },
};
```

You can now utilize these new tokens in your utility strings as you would with any of the existing elevate tokens.

<br>

#### Extending Elevate's Syntax

As you integrate your design system, you may want to create product specific or use case specific syntax rules to better express your design system in your codebase and care has been taken to afford this feature. However, wile this is a powerful affordance, it's important to do so with care and consideration. To begin, follow these steps:

<br>

1. Create a new file in the `elevate/rules` directory.

<br>

**※ Rule Files and Modifier Syntax**  
When creating a new rule file, it is important to remember that you are defining the syntax of the modifier and not the property. In the case below, we're specifying that for our new example property (brand), we want to add new rules and we're articulating how those modifiers should be written as well as the types of token they will expect. 

<br>

```
//example-brandRules.ts
export const Brand = {

    BrandBackgroundRule: {
    "bg-": "BrandBackgroundToken"
    },

    BrandCopyRule: {
    "copy-": "BrandTextToken"
    }

}

```
<br>

2. Import the new rule file into `elevate/config/rules.ts` and spread it into the rules object.

```
//rules.ts

//Import Rule Files
import { Brand } from "../rules/example-brandRules.js";

//Spread Rules into Rules Object
export const rules = {
    ...Brand
};
```
<br>

3. Define a new property in the relationships object

```
//Define Custom Property and CSS Declaration Relationship
export const relationships = {
    //Example Custom Property Definition
    brand: 
    { "background-color": "BrandBackgroundRule", 
      "color": "BrandCopyRule" },
};

```
<br>

4. Test your new property in your utility strings within an appropriate filetype
```html

<div class="brand:bg-popgreen:copy-popwhite"></div>

```








</details>
<br>

### ¶ Project Structure

<br>

```
elevate/
├── config/     # Framework configuration files
│  
├── core/       # Core scanning, parsing, and compilation logic
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

Elevate CSS introduces an **engineering-first approach** to front-end styling, differentiating itself from frameworks like TailwindCSS by prioritizing **design system integrity, maintainability, and build-time validation**. Here’s how Elevate CSS stands apart:

<br>

#### **From Arbitrary Utilities to Token-Driven Enforcement**

- **Market Problem:**  
   TailwindCSS provides immense flexibility but lacks mechanisms to **enforce design system constraints**. Developers can easily introduce arbitrary values (e.g., `px-3.5`, `text-[14px]`), leading to **inconsistent styling** and design drift.

- **Elevate’s Innovation:**  
   Elevate CSS enforces strict adherence to **immutable design tokens** for properties like color, spacing, and typography. By validating styles **at build time**, it ensures that every property and modifier aligns with the design system, eliminating guesswork and inconsistencies. Decisions made are **considered** decisions and accesible to everyone.

**Key Differentiator:**  
Elevate turns your design tokens into **enforceable rules**, not optional guidelines, ensuring design consistency across projects.

<br>

#### **Build-Time Validation for Guaranteed Correctness**

- **Market Problem:**  
   TailwindCSS relies on **manual checks** and runtime visibility to catch issues like typos or invalid class names (`bg-blu-500`). This reactive approach increases QA overhead as well as technical debt over time.

- **Elevate’s Innovation:**  
   Elevate validates **all utility strings and tokens during the build process**, catching errors like misspelled classes or unauthorized modifiers **before production**. Incorrect styles fail the build, ensuring only valid and consistent styles are shipped.

**Key Differentiator:**  
Elevate acts as a **compiler for CSS**, enforcing correctness at build time and eliminating reliance on manual QA or runtime checks.

<br>

#### **From Class Bloat to Declarative, Semantic Syntax**

- **Market Problem:**  
   Tailwind's utility-first approach leads to **verbose, hard-to-read class lists** that obscure design intent (`bg-blue-500 px-4 py-2 text-sm`) and are rarely thoughtfully organized. Maintaining and auditing these class stacks becomes challenging, especially in large projects.

- **Elevate’s Innovation:**  
   Elevate adopts a **property:modifier syntax** (e.g., `text:purple:bold space:d2`) that maps directly to pre-approved design tokens and structures your responsive styling in a **semantic, declarative way**. This concise syntax makes classes self-explanatory, reducing cognitive overhead and improving code readability.

**Key Differentiator:**  
Elevate’s declarative syntax doubles as **living documentation** of your design system, making design intent visible, perceivable, most importantly - maintainable.

<br>

#### **From Utility Overload to Structured, Composable Logic**

- **Market Problem:**  
   Tailwind's atomic classes provide flexibility but lack a conceptual framework, leaving teams to define their own conventions. This becomes unsustainable as projects and teams scale or change.

- **Elevate’s Innovation:**  
   Elevate organizes styles around meaningful categories (e.g., `text`, `grid`, `space`) and validates modifiers against strictly defined design tokens. This structured approach helps you to build a coherent vocabulary over time, making the system easier to scale and maintain.

**Key Differentiator:**  
Elevate transforms ad-hoc class lists into a **stable, composable styling system** that grows with your project.

<br>

#### **True System Integration at Scale**

- **Market Problem:**  
   Tailwind expands by adding more utilities, often resulting in bloated stylesheets and fragmented design adherence. Large teams frequently struggle to maintain alignment with the design system.

- **Elevate’s Innovation:**  
   Elevate treats the design system as the **foundation of all styling decisions**. Breakpoints, states, and tokens are managed as **runtime-validated constants**, ensuring that changes propagate consistently throughout the codebase. This enables large teams to scale their design systems without sacrificing alignment or maintainability.

**Key Differentiator:**  
Elevate CSS integrates deeply with your design system, ensuring **coherence and scalability** as complexity grows over time.

<br>

#### **Engineering Rigor Meets Front-End Styling**

- **Market Problem:**  
   CSS frameworks often prioritize flexibility, relying on intuition and human judgment to maintain consistency. This creates friction for teams that value predictable workflows, reliable validation, and build-time guarantees.

- **Elevate’s Innovation:**  
   By leveraging **structured token and rule definitions** and **compiler-driven validation**, Elevate brings engineering principles to front-end styling. Developers benefit from a predictable, reliable workflow that aligns with modern software practices and keeps you in sync with your design system.

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
| **Developer Workflow**       | Rapid iteration                              | Intentional, error-resistant engineering          |
| **Output Efficiency**        | JIT-optimized CSS                            | Build-time optimized, minimal CSS, no tree shaking necessary           |


<br>

### ¶ Why Choose Elevate CSS?

Elevate CSS introduces a new standard for utility-first frameworks by prioritizing **design consistency**, **build-time correctness**, and **long-term maintainability**. It’s a framework built for teams and projects that demand more than quick fixes, empowering developers to create future-proof codebases without compromising on clarity or precision.

- **For Teams Scaling Design Systems:**  
   Elevate ensures that every styling decision aligns with your design language, preventing drift as your project grows.

- **For Projects Demanding Consistency:**  
   By strictly enforcing tokens and validating at build-time, Elevate guarantees that every style adheres to the system.

- **For Developers Who Value Clarity:**  
   Elevate’s semantic syntax reveals intent, making codebases easier to read, to teach, and to maintain.

<br>

</details>

<br>

## § Product Roadmap

The framework is actively evolving to adapt to the needs of the design and development community. Currently, Elevate CSS is a proof-of-concept framework that hopes to reimagine utility-first CSS approaches. It is in an early, experimental stage and I warmly welcome community feedback, contributions, and insights. My goal is to collaborate with developers and designers to refine and improve the framework, addressing real-world challenges:

<details>
<summary>Click Here To Read More</summary>

### ¶ Planned Features

<br>

- Consider Static Analysis and Compile Time Guarantees 
- IDE Integration for Syntax Highlighting and Autocomplete (Potentially Via LSP)
- Child selector support
- Expanded grid support with expressive syntax
- Container query support
- Logical property support for internationalization and flexible layouts
- Accessibility-focused utilities such as `hidden:visually` and ARIA state helpers
- Advanced selector composition for sibling selectors, combinators, and pseudo-classes
- Potentially some of **your** ideas and more to come, so check back regularly or get involved!

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

Elevate CSS is released as open-source software to empower developers and designers. The framework is provided with the intent to foster collaboration and community contributions, while retaining full ownership and rights by the original author.

### ¶ Key Points

- **Permitted Use**:  
   The code can be used, modified, and distributed for personal or commercial projects under the terms of the license.

- **Attribution**:  
   Attribution to the original author is required in all derivative works.

- **Restrictions**:  
   Redistribution or modification of the code must retain this license and its terms.

- **Ownership**:  
   The name "Elevate CSS," its branding, and all related intellectual property remain solely owned by the original author.

Elevate CSS’s licensing structure ensures that while the framework remains open-source, the rights and ownership stay intact with its creator. This allows for potential future commercialization or other endeavors as determined by the author and future contributors.

<br>

**Elevate Your Code. Elevate The Web.**
