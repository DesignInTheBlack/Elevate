# Introducing Elevate CSS

<br>

Elevate CSS is a compile-first utility framework that transforms your styling layer into a seamless extension of your design system. With a token-driven architecture, expressive utility string (property:modifier) syntax, and compile-time validation, Elevate ensures every styling decision is consistent, intentional, and scalable. By bridging the gap between design and development, Elevate empowers teams to create maintainable, error-free, and future-proof codebases with clarity and precision.

<br>

## § Table of Contents

<br>

1. [Introduction](#introduction)
2. [Features](#-features)
3. [Design Philosophy & Architecture](#-design-philosophy--architecture)
   - [The Elevate Web Design System (EWDS)](#-the-elevate-web-design-system-ewds)
   - [Architectural Approach](#-architectural-approach)
   - [Current Capabilities](#-current-capabilities)
   - [Design Token Management](#-design-token-management)
   - [Performance Characteristics](#-performance-characteristics)
4. [Syntax and Usage](#-syntax-and-usage)
   - [Quick Start](#-quick-start)
   - [Syntax Guide](#-syntax-guide)
   - [Responsive Styling](#-responsive-styling)
   - [Contextual and Functional Flags](#-contextual-and-functional-flags)
   - [Token Types](#-tokenization-and-token-types)
   - [Token Selection Guide](#-token-selection-guide)
   - [Best Practices](#-best-practices)
5. [Configuration](#-configuration)
   - [Framework Configuration](#-framework-configuration)
   - [Extending the Design System](#-extending-the-design-system)
   - [Project Structure](#-project-structure)

<br>

## § Features
<br>

- **Type-Safe CSS Generation**
  - Compile-time token validation
  - Design system constraint enforcement

- **Design System Integration**
  - Token-based system for colors, spacing, typography, and breakpoints
  - Structured property-attribute relationships

- **Responsive Design**
  - Intuitive and mobile-first syntax: `property:modifier /breakpoint/ property:modifier`
  - Automatic media query generation

- **Context Management**
  - Supporting pseudo class selectors
  - Syntax: `@context:[property:modifier_property:modifier]`

<br>

## § Design Philosophy & Architecture
<br>

### ¶ Core Design Principles

<br>

- **Expressive and Intentional**  
   Styling choices should serve as self-documenting expressions of design intention, ensuring intuitive understanding and long-term maintainability.

- **Consistency and Consideration**  
   The design system is the single source of truth, rigorously upheld through strict typing and compile-time validation to eliminate off-scale values and unauthorized modifications. 

- **Extensible and Reliable**  
   The system must support growth and adaptation while maintaining simplicity, with styling validated before runtime to guarantee alignment with the design system on every build.

<br>

### ¶ Current Capabilities

<br>

- Responsive design syntax
- Context-based styling
- Breakpoint-aware class generation
- Intelligent buffer/container management
- Comprehensive design token system

<br>

### ¶ Architectural Approach

<br>

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
- TypeScript type constraints for design system tokens

<br>

### ¶ Performance Characteristics

<br>

**Compilation Approach:**
- Generate static CSS at compile-time
- Transforms HTML class attributes into optimized CSS
- Zero runtime JavaScript overhead
- No tree shaking necessary

<br>

## § Syntax and Usage

<br>

### ¶ Quick Start

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
<br>
At the heart of the syntax are "utility strings", which are used to describe styling. 

<br>

**Direct Properties:**  
<br>
Define a single property with a value. Generally used for layout and positioning.

```html
<div class="block"> <!-- display: block -->
```

<br>

**Compound Properties:** 

<br>

Build complex class definitions by chaining modifiers:

```html
<div class="property:modifier:modifier:modifier">      
```
<br>

**Practical Examples:**
<br>
```html
<div class="text:bold:purple">      <!-- Bold text with purple color -->
<div class="color:purple">          <!-- Element color set to purple -->
<div class="row:x-center:y-start">  <!-- Row layout with specific alignment -->
<div class="absolute left:d12 z:10">  <!-- Absolute positioning, d12 from the left, and z-index of 10  -->
```
<br>

**※ Order of Modifiers:**  
The order generally doesn't matter unless there's a token type collision. In that case, the first matching token is used. For multiple modifiers of the same type, consider defining a submap in `/maps`. By default, Elevate is structured so that no type collisions can occur.

<br>

### ¶ Responsive Styling

<br>

Elevate enforces a mobile-first, organized syntax for responsive design:

```html
<div class="text:purple /md/ text:right /lg/ @hover:[text:green:right]"> 
```

1. Define universal classes first.
2. Add breakpoint-specific adjustments after a `/breakpoint/` indicator.

<br>

### ¶ Contextual and Functional Flags

<br>

**Contextual Flag [@]:**  

Allows complex, conditional styling for states, conditions, and other pseudo-classes:

```html
<div class="@hover:[text:green:right]">  <!-- Hover state changes text -->
```
<br>

**Functional Flag [$]:**  

Ignore certain classes for CSS generation (e.g. for JavaScript interactions):

```html
<div class="$mySelector">
```

<br>

### ¶ Tokenization and Token Types

<br>

Elevate features three distinct token types:

<br>

**Design System Tokens**  
   - Global, immutable design constraints.  
   - Centralized values, enforce system-wide consistency.
<br>

**Syntax Tokens**  
   - Property-specific structural validation.  
   - Validate property values, provide type-safe transformations.
   - Allow for syntax extensions and modification through submapping.
<br>

**Pass-Through Tokens**
   - Unrestricted value entry.  
   - No compile-time validation, for dynamic or flexible values.
   - Primarily used for CSS rules that require special syntax (e.g., URLs or complex values).
   - Not recommended for general styling.

<br>

1. **Design System Tokens**  
   - **Purpose:** Global, immutable design constraints.  
   - **Location:** `design/` directory  
   - **Configuration:** `elevate/config/designConfig.ts`
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

2. **Syntax Tokens**  
   - **Purpose:** Property-specific structural validation.  
   - **Location:** `maps/` directory  
   - **Configuration:** `elevate/maps/propertyAttributeMap.ts` and `elevate/maps`
   - **Characteristics:** Validate property values, provide type-safe transformations, structure syntax.

   **Example:**
   ```typescript
   // maps/grid.ts
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

3. **Pass-Through Tokens** 
   - **Purpose:** Unrestricted value entry.  
   - **Characteristics:** No compile-time validation, for dynamic or flexible values.

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

   **※ Pass-Through Tokens and CSS** <br>
   You must pass through the value in the same way that you would write it in CSS.
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
│       │   ├── Yes → Syntax Token and a Submapping
│       │   └── No → PassThrough Token
```
<br>

**※ Design Token Imports**  
You must import relevant design token files if used in a submap to ensure compile-time validation.

<br>

### ¶ Best Practices

<br>

1. Prefer Design System Tokens.
2. Use Syntax Tokens for structured properties.
3. Minimize PassThroughToken usage.

<br>

## § Configuration

<br>

### ¶ Framework Configuration

<br>

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

Import design system tokens in `elevate/config/designConfig.ts`

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

**※ Design Token Imports** 
The `maps/` folder contains property-attribute mappings, including `propertyAttributeMap.js` and any feature-specific syntax maps.



<br>

### ¶ Extending the Design System: A Comprehensive Guide

<br>

The design system supports seamless token extension through a structured, type-safe process. Follow these detailed steps to introduce new tokens:

<br>

##### 1. Token File Creation

**Location:** `elevate/design/`  
**File Naming Convention:** Use a descriptive, singular noun (e.g., `brandColors.ts`)

**Example: Brand Color Tokens**
```typescript
// elevate/design/brandColors.ts
export const brandColors = {
  primary: '#3498db',   // Primary brand color
  secondary: '#2ecc71', // Secondary accent color
  tertiary: '#e74c3c'   // Tertiary highlight color
} as const;

// Generate a type from the token object
export type BrandColorToken = keyof typeof brandColors;
```

**Key Principles:**
- Use `as const` for strict type inference
- Create a type using `keyof typeof`
- Provide clear, descriptive comments
- Limit tokens to a single, cohesive concept

<br>

##### 2. Design System Configuration

**File:** `elevate/config/designConfig.ts`

**Integration Steps:**
```typescript
// Import your new tokens
import { brandColors } from "../design/brandColors.js";

// Extend the designSystem object
export const designSystem = {
  // Existing tokens...
  BrandColorToken: brandColors, // Add your new token map
};
```

<br>

##### 3. Property Attribute Mapping

**File:** `elevate/maps/propertyAttributeMap.ts`

**Mapping Strategies:**

**A. Direct Token Mapping**
```typescript
export const propertyAttributeMap = {
  // Simple, direct mapping
  primaryBrand: {
    "background-color": "BrandColorToken"
  },
  textBrand: {
    "color": "BrandColorToken"
  }
};
```

**B. Submap for Complex Mappings**
```typescript
// Create a dedicated submap for nuanced token usage
export const brandColorMap = {
  primary: {
    background: 'primary',
    color: 'secondary',
    border: 'tertiary'
  }
};

// Reference the submap in propertyAttributeMap
export const propertyAttributeMap = {
  // Complex token mapping
  brandVariant: brandColorMap
};
```

<br>

##### 4. Token Usage Guidelines 

**Naming Conventions:**
- Use clear, semantic names
- Prefix with the token type (e.g., `BrandColorToken`)
- Avoid generic names that might cause collisions

**Type Safety Checks:**
- Verify token existence before use
- Use TypeScript's type system to prevent runtime errors

**Performance Considerations:**
- Keep token maps concise
- Use submaps for complex, related tokens or syntactic relationships.
- Minimize the number of token types as possible.

<br>

##### 5. Advanced Token Management 

**Token Inheritance:**
```typescript
// Extend existing tokens
export const extendedColors = {
  ...colors,  // Spread existing colors
  newShade: '#custom-color-value'
};
```

<br>

##### Troubleshooting 

**Common Issues:**
- If a token doesn’t map correctly, verify the following:
  1. The design token is properly **exported** in the token file.
  2. The design token is correctly **imported** in `designConfig.ts`.
  3. All relevant **submaps** are updated for your use case.
  4. The design token or subsequent submap token are included in the **`propertyAttributeMap.ts`** mapping.
  5. Ensure **type consistency** across all definitions.


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
