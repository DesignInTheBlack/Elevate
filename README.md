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
3. [Design Philosophy](#-design-philosophy)  
   - [Core Design Principles](#-core-design-principles)
4. [Syntax and Usage](#-syntax-and-usage)  
   - [Quick Start Guide](#-quick-start-guide)  
   - [Installation and Usage](#-installation-and-usage)  
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
6. [Why Elevate?](#-why-elevate)  
   - [From Arbitrary Utilities to Token-Driven Enforcement](#-from-arbitrary-utilities-to-token-driven-enforcement)  
   - [Build-Time Validation for Guaranteed Correctness](#-build-time-validation-for-guaranteed-correctness)  
   - [From Class Bloat to Declarative, Semantic Syntax](#-from-class-bloat-to-declarative-semantic-syntax)  
   - [From Utility Overload to Structured, Composable Logic](#-from-utility-overload-to-structured-composable-logic)  
   - [True System Integration at Scale](#-true-system-integration-at-scale)  
   - [Engineering Rigor Meets Front-End Styling](#-engineering-rigor-meets-front-end-styling)  
   - [TailwindCSS vs. Elevate CSS](#-tailwindcss-vs-elevate-css)  
   - [Why Choose Elevate CSS?](#-why-choose-elevate-css)
7. [Product Roadmap](#-product-roadmap)  
   - [Planned Features](#-planned-features)  
   - [Selector Support](#-selector-support)
8. [Licensing](#-licensing)
   

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

At the heart of Elevate's syntax are what is called "utility strings", which are used to describe styling and serve as the basis for CSS generation. They also double as the actual CSS classes. Unlike traditional utility frameworks which come packed with pre-defined utility classes, you are effectively writing CSS as you write utility strings in Elevate through the expression of property and modifier combinations - which are validated against the design system and a series of rules at build-time to ensure consistency.

<br>

**The Format**:

```html
<div class = "property:modifier">
```

<br>

**Direct Properties:**  

Direct properties are properties that do not require any modifier and that define a single CSS declaration. Generally used for layout and positioning.

```html
<div class="block"> <!-- display: block -->
```

<br>

**Compound Properties:** 

Compound properties are properties that require one or more modifiers to be applied. These properties are used to create more complex CSS declarations.

```html

<div class="text:dark:bold:left">     

<!--
.text\:dark\:bold\:left {
color: #2C2638;
font-weight: 700;
text-align: left;
}
-->

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

Elevate affords and enforces a mobile-first, organized syntax for responsive design:

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

Elevate's systems are driven by two distinct elements:

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
   - **Configuration:**  `elevate/config/rules.ts` and `elevate/rules`
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

 Elevate includes a number of "helper" token types that provide additional capabilities beyond the core functionality for specific situations. These can be used to extend the framework's capabilities, but they should be used with caution. 

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

Please note that when using PassThroughToken, you must pass through the value in the same way that you would write it in CSS.
For example, preserving parentheses for values requiring them (e.g., URLs) or as above when passing number and unit combinations.

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
│       │   ├── Yes → New Rule File and Rules.tsEntry
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
//Design System Token Imports 

//Elevate Utility Imports
import { heightUtility } from "../core/system/etc/height.js";

//Example Custom Values Import
import { BrandColors } from "../design/example-brandTokens.js";

//System Standard Imports
import { colors } from "../core/system/design/colors.js";
import { spacing } from "../core/system/design/spacing.js";
import { typography } from "../core/system/design/typography.js";
import { breakpoints } from '../core/system/design/breakpoints.js';

//Token Definitions
export const designSystem = {
    ColorToken: colors,
    BreakPointToken: breakpoints,
    SpacingToken: {...spacing,...heightUtility},
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    FontWeightToken: typography.weight,

    //Spread Custom Token Categories
    ...BrandColors
};
```
<br>

Import and distribute syntax rule mappings in `elevate/config/rules.ts`

```typescript

//Import Rule Files
import { Brand } from "../rules/example-brandRules.js";

//Spread Rules into Rules Object
export const rules = {
    ...Brand
};

//Define Custom Property and CSS Declaration Relationship
export const relationships = {
    //Example Custom Property Definition
    brand: 
    { "background-color": "BrandBackgroundRule", 
      "color": "BrandCopyRule" },
};
```

<br>


### ¶ Extending Elevate: A Comprehensive Guide

Elevate is designed to be extensible and adaptable, allowing you to easily integrate your design system or add new features and functionality that help you embody your design system in a way that is both consistent and maintainable within your codebase.

<details>
<summary>Click Here To Read More</summary>
<br>


#### Design System Integration

If your goal is to simply integrate your design system tokens into elevate, you can follow these steps:

<br>

1. Add new categorized design tokens to the `elevate/design` directory in alignment with your design system and preferred organization.

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

When creating a new rule file, it is important to remember that you are defining the syntax of the **modifier** and **not the property**. In the case below, we're specifying that for our new example property (brand), we want to add new modifier syntax rules and we're articulating how those modifiers should be written as well as the types of design system tokens they will expect. 

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

2. Import the new rule file into `elevate/config/syntax.ts` and spread it into the rules object.

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
    //Note the distinction between "rules" and "tokens".
```


<br>


However, if you have two CSS declarations under a single property that share a common token type, you might run into something called a token collision and get unexpected results. A token collision is when two tokens passed through a utility string try to match to the same CSS declaration. To avoid this, you must create a new rule in `elevate/rules` to define an intermediary rule to allow the system to differentiate and then use that intermediary rule in the property as seen above.


<br>


#### Token and Rule Usage Guidelines


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
  1. Design system tokens should always be defined in the design directory and you can spread them in the existing token categories in `elevate/config/design.ts` for maximum compatibility with the default declarations in the declaration map.
  2. Examine the existing rules that allow Elevate to work out of the box by mapping token types to intermediary rules to CSS declarations in `core/system`.
  3. You can effectively create your own use case specific syntax for your project via these intermediary rules, but do so with care and consideration if you do. Elevate recommends using the existing rules for maximum compatibility whenever possible.


<br>

#### Troubleshooting


**Common Issues:**
- If a token doesn’t map correctly, verify the following:
  1. The design token is properly **exported** in the token file.
  2. The design token is correctly **imported** and **configured** in `design.ts`.
  3. All relevant **rules** are updated for your use case and structured correctly.
  4. The design token or subsequent rules are included in **`declarationMap.ts`** in an entry for the property you are trying to map.


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

Elevate CSS redefines utility-first frameworks by prioritizing **design consistency**, **build-time validation**, and **long-term maintainability**. It bridges the gap between design and development, empowering teams to build scalable, error-free, and future-proof systems. Here's why Elevate stands out:

<details>
<summary>Click Here To Read More</summary>

### ¶ Key Benefits

- **Design-Driven Approach**:  
   Enforces strict adherence to design tokens, ensuring consistent and intentional styling decisions that align with your design system.

- **Build-Time Validation**:  
   Catches typos, unauthorized values, and invalid class names during the build process, guaranteeing error-free code before production.

- **Semantic and Declarative Syntax**:  
   Intuitive `property:modifier` strings double as living documentation, making class structures readable and easy to maintain.

- **Scalable Structure**:  
   Organized styling categories and token-driven validation support long-term project scalability while maintaining design integrity.

- **Engineering Rigor**:  
   Compiler-driven validation integrates engineering principles into front-end styling, providing a predictable and reliable workflow.

---

### ¶ TailwindCSS vs. Elevate CSS

| **Feature/Philosophy**      | **TailwindCSS**                               | **Elevate CSS**                                |
|-----------------------------|-----------------------------------------------|-----------------------------------------------|
| **Core Philosophy**          | Utility-first pragmatism                     | Design-driven, validated at build time        |
| **Design System Adherence**  | Theming encouraged but optional              | Immutable token validation                    |
| **Error Handling**           | Runtime reliance, visual QA                  | Build-time validation                         |
| **Code Readability**         | Verbose class lists                          | Declarative, semantic syntax                  |
| **Scalability**              | Relies on team discipline                    | Token-driven consistency and validation       |
| **Developer Workflow**       | Rapid iteration                              | Intentional, error-resistant engineering      |
| **Output Efficiency**        | JIT-optimized CSS                            | Build-time optimized, minimal CSS             |

---

### ¶ Why Choose Elevate CSS?

- **For Teams Scaling Design Systems**:  
   Elevate guarantees alignment with your design language, preventing drift as your project grows.

- **For Projects Demanding Consistency**:  
   Strict enforcement of tokens and build-time validation ensures every style adheres to your system.

- **For Developers Seeking Clarity**:  
   Semantic syntax reveals design intent, simplifying codebase readability, collaboration, and maintenance.

Elevate CSS combines the flexibility of utility-first frameworks with the rigor of engineering principles, setting a new standard for maintainable, scalable, and error-free front-end styling.

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
