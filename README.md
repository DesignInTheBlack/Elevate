# Elevate CSS

A strongly-typed utility CSS framework implementing the Elevate Web Design System (EWDS) methodology. Elevate CSS provides compile-time validation, state management, and responsive design capabilities through a type-safe TypeScript implementation.

## Features

- 🛡️ **Type-Safe CSS Generation**
  - Full TypeScript integration
  - Compile-time token validation
  - Design system constraint enforcement

- 🎨 **Design System Integration**
  - Token-based system for colors, spacing, breakpoints and typography
  - Structured property-attribute relationships
  - Enterprise-ready validation

- 📱 **Responsive Design**
  - Mobile-first breakpoint system
  - Intuitive syntax: `property:modifier /md/ property:modifier`
  - Automatic media query generation

- ⚡ **State Management**
  - Hover, focus, and custom states
  - Syntax: `@state:[property:modifier_property:modifier]`
  - Automatic CSS state compilation

## Design Philosophy

### The Elevate Web Design System (EWDS)

#### Core Design Principles
Elevate is a compile-time CSS generation framework that focuses on:
- Type-safe class parsing
- Declarative syntax for styling
- Intelligent breakpoint management
- Minimal runtime overhead

#### Key Technical Innovations
- **Compile-Time Parsing**: Uses Chevrotain for robust class attribute tokenization
- **Mobile-First Design**: Intelligent breakpoint processing
- **Declarative Syntax**: Transform HTML class attributes into optimized CSS

### Architectural Approach

#### Parsing Strategy
Elevate uses a multi-stage parsing approach:
1. **File Scanning**: Discover class attributes across project files
2. **Lexical Analysis**: Tokenize class strings
3. **Syntax Parsing**: Convert tokens to Abstract Syntax Trees (AST)
4. **CSS Generation**: Transform AST into optimized CSS

#### Type Safety
Implemented through:
- Strict token definitions
- Compile-time validation of design system tokens
- TypeScript type constraints for design system tokens

### Current Capabilities

#### Supported Features
- Responsive design syntax
- State-based styling 
- Breakpoint-aware class generation
- Intelligent buffer/container management
- Comprehensive design token system

#### Design Token Management
Elevate manages design tokens across multiple domains:
- Colors
- Spacing (Detail, Content, Space scales)
- Typography
- Breakpoints

### Performance Characteristics

#### Compilation Approach
- Generates static CSS at compile-time
- Transforms HTML class attributes into optimized CSS
- Zero Runtime JavaScript overhead 
- No tree shaking necessary

### Planned Roadmap

#### Near-Term Improvements
- Expand CSS feature support
- Expanded media query support
- Pseudo-class support
- Child selector support
- Container query shorthand syntax and generation

## Tokenization Strategy

Elevate's design system leverages a sophisticated tokenization approach that provides flexibility, type safety, and design consistency.

### Token Types

#### 1. Design System Tokens
- **Purpose**: Global, immutable design constraints
- **Location**: `design/` directory
- **Characteristics**:
  - Centralized design values
  - Enforce system-wide consistency
  - Used across multiple property mappings

**Example**:
```typescript
// design/spacing.ts
export const spacing = {
  'd1': '0.25rem',
  'd2': '0.5rem',
  'd3': '0.75rem'
} as const;

export type SpacingToken = keyof typeof spacing;
```
#### 2. Syntax Tokens
- **Purpose**: Property-specific structural validation
- **Location**: `maps/` directory
- **Characteristics**:
  - Validate specific property values
  - Provide type-safe transformations
  - Scoped to specific property behaviors

**Example**:
```typescript
// maps/text.ts
export const text = {
  align: {
    "left": "left",
    "center": "center",
    "right": "right"
  }
} as const;

export type TextAlignToken = keyof typeof text.align;
```
#### 3. PassThroughToken
- **Purpose**: Unrestricted value entry
- **Characteristics**:
  - Maximum flexibility
  - No compile-time validation
  - Used for dynamic properties

**Example**:
```typescript
// propertyAttributeMap.ts
rotate: {
  "rotate": "PassThrough"  // Allows any rotation value
}
```

```HTML
// someHTML.file
<div class="rotate:((90deg))"></div>
```
Note that you must include the parenthesis for CSS rules that require them such as URLS.


### Token Selection Guide

#### Decision Matrix
```
Property Characteristics
├── Needs Global Consistency?
│   ├── Yes → Design System Token
│   └── No →
│       ├── Property-Specific Validation Needed?
│       │   ├── Yes → Syntax Token (Create a map file and define the syntax or define directly in the propertyAttributeMap)
│       │   └── No → PassThroughToken (This will NOT be validated)
```
Note that passthrough tokens are not validated, can be used in either a map or directly in the propertyAttributeMap. 

You MUST import any applicable design token files if said design tokens in a submap. 

### Best Practices
1. Prefer Design System Tokens
2. Use Syntax Tokens for structured properties
3. Minimize PassThrough usage

### Advanced Considerations
- Token composition
- Prefix-based token generation
- Compound token strategies

## Quick Start

```bash
# Install dependencies
npm install

# Compile to CSS
npm start
```

## Configuation 

### Framework Configuration
The `elevate/config/` directory contains configuration files for the framework, including:
elevate.js: Framework configuration options

```html
const options = {
    Watch:'./', <-- Directory to watch for changes>
    FileTypes: ['html', 'jsx', 'tsx', 'astro'], <-- File extensions to scan -->
    Output:'./' <-- Output directory for generated CSS -->
}

export const config = options
```

The maps folder contains the property-attribute mappings for the framework, including:
propertyAttributeMap.js as well as CSS feature specific syntax maps. 

The token import statements and the maps are imported in the utility.ts and can be expanded upon as needed.


## Syntax Guide

### 1. Core Syntax Types

#### Direct Properties
Single-token modifications that apply a basic styling or layout property. These are the simplest form of styling, providing immediate, straightforward application of a single characteristic to an element.

```html
<!-- Basic direct property application -->
<div class="block">       <!-- Display type -->      
<div class="hidden">      <!-- Visibility -->
<div class="buffer">
```

#### Compound Properties
Modifications that combine a property with a specific modifier, allowing more nuanced and precise styling. These provide granular control over element characteristics by specifying both the property and its desired state or value.

```html
<!-- Property:Modifier syntax -->
<div class="text:large">        <!-- Text size -->
<div class="color:purple">      <!-- Color specification -->
<div class="row:x-center">       <!-- Layout with alignment -->
<div class="border:d1">          <!-- Border width -->
<div class="m:d4">               <!-- Margin of 1rem -->
```

#### Stateful Strings
Dynamic styling mechanism that enables responsive and interactive visual changes based on element states. These allow complex, conditional styling that adapts to user interactions or specific conditions.

```html
<!-- State-based styling -->
<div class="@hover:[text:purple]">     <!-- Text color on hover -->
<div class="@focus:[color:red]">       <!-- Background color on focus -->
<div class="@active:[text:bold]">      <!-- Text weight when active -->
<!-- Complex state combinations -->
<div class="@hover:[text:purple:bold] @focus:[color:red]">
```

#### Functional Properties
````html
<!-- Any class marked with $ will be ignored and not included in the output -->
<div class = "$jsSelector">
<div class = "$sectionName">
<div class = "$listItem">
 ````

### 2. Chaining Modifiers
Combine multiple modifiers to create complex, multi-dimensional styling rules. This approach allows for rich, layered design specifications within a single class attribute.

```html
<!-- Chained property modifiers -->
<div class="text:h3:bold:center">  <!-- Large, bold, centered text -->
<div class="m:d4:d6">        <!-- Margin with d4 values for x axis and d6 for y axis values -->
```

### 3. Advanced Syntax Patterns

#### Responsive Styling
Apply different styles at specific breakpoints, enabling adaptive design that responds to varying screen sizes and device characteristics.

```html
<!-- Responsive text sizing -->
<div class="/lg/ text:h2">     <!-- Large text at large breakpoint -->
<div class="/md/ text:base">   <!-- Base text at medium breakpoint -->
<!-- Responsive layout -->
<div class="/lg/ row:x-center:y-start">
```

#### Complex State Management
Combine responsive design with interaction states to create sophisticated, context-aware styling that adapts to both device characteristics and user interactions.

```html
<!-- Responsive state styling -->
<div class="/md/ @hover:[text:large]">
<div class="/lg/ @focus:[color:purple]">
<!-- Multiple state and responsive combinations -->
<div class="/md/ @hover:[text:purple:bold] @focus:[color:red]">
```

### 4. Buffer Class
An intelligent, implicit container mechanism that dynamically adjusts content spacing across different device sizes. The buffer class provides consistent, responsive padding without requiring manual intervention or complex CSS wrapping.

```html
<!-- Buffer automatically manages spacing -->
<div class="buffer">
    <!-- Content will have appropriate padding based on current breakpoint -->
</div>
```

Buffer Spacing Mapping:
- `2xs`, `xs`, `sm`: `d5` spacing (smallest padding)
- `md`, `lg`, `xl`, `2xl`: `d8` spacing (medium padding)
- `3xl`, `4xl`, `5xl`: `c12` spacing (largest padding)

Note that your buffer definitions must align with your spacing and breakpoint tokens. 

### 5. Comprehensive Property Modifiers

#### Breakpoint Reference
Elevate provides a comprehensive breakpoint system for responsive design:
- `2xs`: 20rem (320px) - Very Small Mobile
- `xs`: 30rem (480px) - Small Mobile
- `sm`: 40rem (640px) - Large Mobile
- `md`: 48rem (768px) - Tablet
- `lg`: 64rem (1024px) - Small Desktop
- `xl`: 80rem (1280px) - Medium Desktop
- `2xl`: 96rem (1536px) - Large Desktop
- `3xl`: 120rem (1920px) - Full HD
- `4xl`: 160rem (2560px) - 2K
- `5xl`: 240rem (3840px) - 4K

#### Spacing Scale
Elevate uses three primary spacing scales with granular control:

1. **Detail Scale (`d1-d13`)**: Fine adjustments and component construction
   - Range: `0.25rem` (4pt) to `3.5rem` (56pt)
   - Ideal for: Padding, margins, small gaps
   - Example: `m:d4` (margin of 1rem), `p:d2` (padding of 0.5rem)

2. **Content Scale (`c1-c13`)**: General page layout and component spacing
   - Range: `4rem` (64pt) to `20rem` (320pt)
   - Ideal for: Section spacing, component layouts
   - Example: `gap:c6` (7rem gap between elements)

3. **Space Scale (`s1-s13`)**: Major page sections and full-page layouts
   - Range: `24rem` (384pt) to `120rem` (1920pt)
   - Ideal for: Page sections, full-width containers
   - Example: `w:s8` (width of 60rem)

Utility Values:
- `0`: Zero spacing
- `fill`: 100% width/height

#### Typography Modifiers

1. **Font Sizes**:
   - `tiny`: `0.533rem`
   - `small`: `0.711rem`
   - `base`: `1rem`
   - `h6` to `h1`: Increasing sizes from `1.125rem` to `7.594rem`

2. **Line Heights**:
   - `hug`: `1`
   - `tight`: `1.2`
   - `normal`: `1.4`
   - `loose`: `1.6`
   - `extra-spacious`: `1.8`

3. **Letter Tracking**:
   - `extra-tight`: `-0.02rem`
   - `tight`: `-0.01rem`
   - `normal`: `0`
   - `wide`: `0.01rem`
   - `widest`: `0.04rem`

### Breakpoint Reference
- `2xs`: 20rem (320px) - Very Small Mobile
- `xs`: 30rem (480px) - Small Mobile
- `sm`: 40rem (640px) - Large Mobile
- `md`: 48rem (768px) - Tablet
- `lg`: 64rem (1024px) - Small Desktop
- `xl`: 80rem (1280px) - Medium Desktop
- `2xl`: 96rem (1536px) - Large Desktop
- `3xl`: 120rem (1920px) - Full HD
- `4xl`: 160rem (2560px) - 2K
- `5xl`: 240rem (3840px) - 4K

### Design Token References
For complete token definitions, refer to:
- Spacing Tokens: `/elevate/design/spacing.ts`
- Typography Tokens: `/elevate/design/typography.ts`
- Color Tokens: `/elevate/design/colors.ts`
- Breakpoint Tokens: `/elevate/design/breakpoints.ts`

## Implementation

The framework consists of four main components:

1. **File Scanner** (`scan.ts`)
   - Traverses project directories
   - Extracts class attributes
   - Excludes `node_modules`

2. **Parser** (`parser.ts`)
   - Tokenizes class definitions
   - Validates against design system
   - Built with Chevrotain

3. **Utility System** (`utility.ts`)
   - Breakpoint management
   - Token validation
   - File operations

4. **Design System** (`design/`)
   - Color tokens
   - Typography scale
   - Spacing system
   - Breakpoint definitions

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

## Technical Requirements

- Node.js >=18
- TypeScript ^5.3.0
- Chevrotain ^11.0.3

## Licensing

Proprietary software developed by Ken Pickett.
All rights reserved. Unauthorized distribution prohibited.

*Elevate Your Code. Elevate the Web.*
