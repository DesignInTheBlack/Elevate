# Elevate CSS

A strongly-typed utility CSS framework implementing the Elevate Web Design System (EWDS) methodology. Elevate CSS provides compile-time validation, state management, and responsive design capabilities through a type-safe TypeScript implementation.

---

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Design Philosophy & Architecture](#design-philosophy--architecture)
   - [The Elevate Web Design System (EWDS)](#the-elevate-web-design-system-ewds)
   - [Architectural Approach](#architectural-approach)
   - [Current Capabilities](#current-capabilities)
   - [Design Token Management](#design-token-management)
   - [Performance Characteristics](#performance-characteristics)
4. [Syntax and Usage](#syntax-and-usage)
   - [Quick Start](#quick-start)
   - [Syntax Guide](#syntax-guide)
   - [Responsive Styling](#responsive-styling)
   - [Contextual and Functional Flags](#contextual-and-functional-flags)
   - [Tokenization Strategy](#tokenization-strategy)
   - [Token Types](#token-types)
   - [Token Selection Guide](#token-selection-guide)
   - [Best Practices](#best-practices)
5. [Configuration](#configuration)
   - [Framework Configuration](#framework-configuration)
   - [Project Structure](#project-structure)
6. [Planned Roadmap](#planned-roadmap)
7. [Technical Requirements](#technical-requirements)
8. [Licensing](#licensing)

---

## Introduction

Elevate CSS is a compile-time CSS generation framework that emphasizes type safety, declarative syntax, and minimal runtime overhead. By using a robust design token system and a mobile-first approach, Elevate ensures that every style rule is validated against design system constraints at compile-time, resulting in highly maintainable and consistent codebases.

---

## Features

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

---

## Design Philosophy & Architecture

### The Elevate Web Design System (EWDS)

**Core Design Principles:**
- Type-safe class parsing
- Declarative syntax for styling
- Intelligent breakpoint management
- Minimal runtime overhead

**Key Technical Innovations:**
- **Compile-Time Parsing**: Uses Chevrotain for robust class attribute tokenization
- **Mobile-First Design**: Intelligent breakpoint processing
- **Declarative Syntax**: Transforms HTML class attributes into optimized CSS

### Architectural Approach

**Parsing Strategy:**
1. **File Scanning**: Discover class attributes across project files
2. **Lexical Analysis**: Tokenize class strings
3. **Syntax Parsing**: Convert tokens to Abstract Syntax Trees (AST)
4. **CSS Generation**: Transform AST into optimized CSS

**Type Safety:**
- Strict token definitions
- Compile-time validation of design system tokens
- TypeScript type constraints for design system tokens

### Current Capabilities

- Responsive design syntax
- Context-based styling
- Breakpoint-aware class generation
- Intelligent buffer/container management
- Comprehensive design token system

### Design Token Management

Elevate manages design system tokens across multiple domains:
- Colors
- Spacing (Detail, Content, Space scales)
- Typography
- Breakpoints

Tokens are centralized within the `design/` directory, ensuring system-wide consistency and easy extensibility.

### Performance Characteristics

**Compilation Approach:**
- Generates static CSS at compile-time
- Transforms HTML class attributes into optimized CSS
- Zero runtime JavaScript overhead
- No tree shaking necessary

---

## Syntax and Usage

### Quick Start

```bash
# Install dependencies
npm install

# Compile to CSS
npm start
```

### Syntax Guide

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

### Responsive Styling

Elevate enforces a mobile-first, organized syntax for responsive design:

```html
<div class="text:purple /md/ text:right /lg/ @hover:[text:green:right]"> 
```

- Define universal classes first.
- Add breakpoint-specific adjustments after a `/breakpoint/` indicator.

### Contextual and Functional Flags

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

---

### Tokenization Strategy

Elevate's tokenization approach ensures flexibility, type safety, and consistency.

### Token Types

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

### Token Selection Guide

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

### Best Practices
1. Prefer Design System Tokens.
2. Use Syntax Tokens for structured properties.
3. Minimize PassThroughToken usage.

---

## Configuration

### Framework Configuration

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

## Project Structure

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

---

## Planned Roadmap

**Near-Term Improvements:**
- Expand CSS feature support
- Expanded media query support
- Pseudo-class support
- Child selector support
- Container query shorthand syntax and generation

---

## Technical Requirements

- Node.js >=18
- TypeScript ^5.3.0
- Chevrotain ^11.0.3

---

## Licensing

Proprietary software developed by Ken Pickett.  
All rights reserved. Unauthorized distribution prohibited.

**Elevate Your Code. Elevate the Web.**









































