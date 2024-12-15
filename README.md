# Introducing Elevate CSS
Elevate CSS is a compile-time CSS generation framework that emphasizes type safety, declarative syntax, and minimal runtime overhead. By using a robust design token system and a mobile-first approach, Elevate ensures that every style rule is validated against design system constraints at compile-time, resulting in highly maintainable and consistent codebases.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#✦-features)
3. [Design Philosophy & Architecture](#✦-design-philosophy--architecture)
   - [The Elevate Web Design System (EWDS)](#▸-the-elevate-web-design-system-ewds)
   - [Architectural Approach](#▸-architectural-approach)
   - [Current Capabilities](#▸-current-capabilities)
   - [Design Token Management](#▸-design-token-management)
   - [Performance Characteristics](#▸-performance-characteristics)
4. [Syntax and Usage](#✦-syntax-and-usage)
   - [Quick Start](#▸-quick-start)
   - [Syntax Guide](#▸-syntax-guide)
   - [Responsive Styling](#▸-responsive-styling)
   - [Contextual and Functional Flags](#▸-contextual-and-functional-flags)
   - [Tokenization Strategy](#▸-tokenization-strategy)
   - [Token Types](#▸-token-types)
   - [Token Selection Guide](#▸-token-selection-guide)
   - [Best Practices](#▸-best-practices)
5. [Configuration](#✦-configuration)
   - [Framework Configuration](#▸-framework-configuration)
   - [Extending the Design System](#▸-extending-the-design-system)
   - [Project Structure](#▸-project-structure)



<br>

## ✦ Features

- **🛡️ Type-Safe CSS Generation**
  - Full TypeScript integration
  - Compile-time token validation
  - Design system constraint enforcement

- **🎨 Design System Integration**
  - Token-based system for colors, spacing, breakpoints, and typography
  - Structured property-attribute relationships
  - Enterprise-ready validation

- **📱 Responsive Design**
  - Mobile-first breakpoint system
  - Intuitive syntax: `property:modifier /md/ property:modifier`
  - Automatic media query generation

- **⚡ State Management**
  - Hover, focus, and custom states
  - Syntax: `@state:[property:modifier_property:modifier]`
  - Automatic CSS state compilation


<br>

## ✦ Design Philosophy & Architecture

### ▸ The Elevate Web Design System (EWDS)

**Core Design Principles:**
- Type-safe class parsing
- Declarative syntax for styling
- Intelligent breakpoint management
- Minimal runtime overhead

**Key Technical Innovations:**
- **Compile-Time Parsing**: Uses Chevrotain for robust class attribute tokenization
- **Mobile-First Design**: Intelligent breakpoint processing
- **Declarative Syntax**: Transforms HTML class attributes into optimized CSS

### ▸ Architectural Approach

**Parsing Strategy:**
1. **File Scanning**: Discover class attributes across project files
2. **Lexical Analysis**: Tokenize class strings
3. **Syntax Parsing**: Convert tokens to Abstract Syntax Trees (AST)
4. **CSS Generation**: Transform AST into optimized CSS

**Type Safety:**
- Strict token definitions
- Compile-time validation of design system tokens
- TypeScript type constraints for design system tokens

---

### ▸ Current Capabilities

- Responsive design syntax
- Context-based styling
- Breakpoint-aware class generation
- Intelligent buffer/container management
- Comprehensive design token system

---

### ▸ Design Token Management

Elevate manages design system tokens across multiple domains:
- Colors
- Spacing (Detail, Content, Space scales)
- Typography
- Breakpoints

Tokens are centralized within the `design/` directory, ensuring system-wide consistency and easy extensibility.

---

### ▸ Performance Characteristics

**Compilation Approach:**
- Generate static CSS at compile-time
- Transforms HTML class attributes into optimized CSS
- Zero runtime JavaScript overhead
- No tree shaking necessary

---


<br>

## ✦ Syntax and Usage

### ▸ Quick Start

```bash
# Install dependencies
npm install

# Compile to CSS
npm start
```

### ▸ Syntax Guide

**Basic Usage:**  
Use a "utility string" to describe styling. A simple direct property example:

```html
<div class="block"> <!-- display: block -->
```

**Compound Properties:**  
Build complex class definitions by chaining modifiers:

```html
<div class="property:modifier:modifier:modifier">      
```

**Practical Examples:**
```html
<div class="text:bold:purple">      <!-- Bold text with purple color -->
<div class="color:purple">          <!-- Element color set to purple -->
<div class="row:x-center:y-start">  <!-- Row layout with specific alignment -->
```

**Order of Modifiers:**  
The order generally doesn't matter unless there's a token type collision. In that case, the first matching token is used. For multiple modifiers of the same type, consider defining a submap in `/maps`.

### ▸ Responsive Styling

Elevate enforces a mobile-first, organized syntax for responsive design:

```html
<div class="text:purple /md/ text:right /lg/ @hover:[text:green:right]"> 
```

- Define universal classes first.
- Add breakpoint-specific adjustments after a `/breakpoint/` indicator.

### ▸ Contextual and Functional Flags

**Contextual Flag [@]:**  

Allows complex, conditional styling for states or conditions:

```html
<div class="@hover:[text:green:right]">  <!-- Hover state changes text -->
```

**Functional Flag [$]:**  

Ignore certain classes for CSS generation (e.g. for JavaScript hooks):

```html
<div class="$mySelector">
```


### ▸ Tokenization Strategy

Elevate's tokenization approach ensures flexibility, type safety, and consistency.

### ▸ Token Types

1. **Design System Tokens**  
   - **Purpose:** Global, immutable design constraints.  
   - **Location:** `design/` directory  
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

2. **Syntax Tokens**  
   - **Purpose:** Property-specific structural validation.  
   - **Location:** `maps/` directory  
   - **Characteristics:** Validate property values, provide type-safe transformations.

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

3. **PassThroughToken**  
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
   Use parentheses for values requiring them (e.g., URLs).

### ▸ Token Selection Guide

**Decision Matrix:**
```
Property Characteristics
├── Needs Global Consistency?
│   ├── Yes → Design System Token
│   └── No →
│       ├── Property-Specific Validation Needed?
│       │   ├── Yes → Syntax Token
│       │   └── No → PassThrough Token
```

**Note:**  
You must import relevant design token files if used in a submap.

### ▸ Best Practices
1. Prefer Design System Tokens.
2. Use Syntax Tokens for structured properties.
3. Minimize PassThroughToken usage.

<br>

## ✦ Configuration

### ▸ Framework Configuration

Configure Elevate in `elevate/config/`:

```typescript
// elevate/config/elevate.ts
const options = {
    Watch:'./',                // Directory to watch for changes
    FileTypes: ['html', 'jsx', 'tsx', 'astro'], // File extensions to scan
    Output:'./'                // Output directory for generated CSS
}

export const config = options
```

Import design tokens in the config:

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

The `maps/` folder contains property-attribute mappings, including `propertyAttributeMap.js` and any feature-specific syntax maps.

---

### ▸ Extending the Design System: A Comprehensive Guide

The design system supports seamless token extension through a structured, type-safe process. Follow these detailed steps to introduce new tokens:

---

##### 1. Token File Creation 🎨

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

---

##### 2. Design System Configuration 🔧

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

---

##### 3. Property Attribute Mapping 🗺️

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

---

##### 4. Token Usage Guidelines 📋

**Naming Conventions:**
- Use clear, semantic names
- Prefix with the token type (e.g., `BrandColorToken`)
- Avoid generic names that might cause collisions

**Type Safety Checks:**
- Verify token existence before use
- Use TypeScript's type system to prevent runtime errors
- Leverage IDE autocompletion for token selection

**Performance Considerations:**
- Keep token maps concise
- Use submaps for complex, related tokens
- Minimize the number of token types

---

##### 5. Advanced Token Management 🚀

**Token Inheritance:**
```typescript
// Extend existing tokens
export const extendedColors = {
  ...colors,  // Spread existing colors
  newShade: '#custom-color-value'
};
```

---

##### Troubleshooting 🔍

**Common Issues:**
- If a token doesn't map correctly, check:
  1. Token file export
  2. `designConfig.ts` import
  3. Any submaps relevant to your use case
  4. `propertyAttributeMap.ts` mapping
  5. Type consistency

---


<br>

### ▸ Project Structure

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
