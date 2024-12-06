# Elevate CSS

A strongly-typed utility CSS framework implementing the Elevate Web Design System (EWDS) methodology. Elevate CSS provides compile-time validation, state management, and responsive design capabilities through a type-safe TypeScript implementation.

## Features

- 🛡️ **Type-Safe CSS Generation**
  - Full TypeScript integration
  - Compile-time token validation
  - Design system constraint enforcement

- 🎨 **Design System Integration**
  - Token-based system for colors, spacing, and typography
  - Structured property-attribute relationships
  - Enterprise-ready validation

- 📱 **Responsive Design**
  - Mobile-first breakpoint system
  - Intuitive syntax: `/md/text:large`
  - Automatic media query generation

- ⚡ **State Management**
  - Hover, focus, and custom states
  - Syntax: `@hover:[text:red]`
  - Automatic CSS state compilation

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build project
npm run build
```

## Syntax Guide

### Basic Syntax
```html
<div class="property:modifier">
<!-- Example: <div class="color:purple"> -->
```

### Multiple Properties
```html
<div class="property1:modifier1 property2:modifier2">
<!-- Example: <div class="color:purple text:large"> -->
```

### Layout Properties

#### Flex Containers
```html
<!-- Row container with centered items -->
<div class="row:x-center:y-center">

<!-- Column (stack) container with top-aligned items -->
<div class="stack:x-center:y-start">
```

#### Flex Values
- X-axis alignment: `x-start`, `x-center`, `x-end`, `x-between`, `x-around`, `x-evenly`
- Y-axis alignment: `y-start`, `y-center`, `y-end`, `y-stretch`, `y-baseline`

#### Spacing
```html
<!-- Margin -->
<div class="m:d1">  <!-- d1-d12 spacing scale -->

<!-- Padding -->
<div class="p:d1">

<!-- Width and Height -->
<div class="w:d12 h:d6">
```

### Typography
```html
<!-- Font size and color -->
<div class="text:large color:purple">

<!-- Multiple text properties -->
<div class="text:large:bold:center">
```

### Responsive Design
```html
<!-- Applies only at medium breakpoint and above -->
<div class="/md/text:large">

<!-- Multiple responsive properties -->
<div class="/lg/stack:x-center:y-start">
```

### State Management
```html
<!-- Hover state -->
<div class="@hover:[color:purple]">

<!-- Focus state -->
<div class="@focus:[text:large]">

<!-- Multiple states -->
<div class="@hover:[color:purple] @focus:[text:large]">
```

### Currently Supported Properties

#### Layout
- `display`: `block`, `flex`, `grid`, `hidden`, etc.
- `row`: Flex row container with x/y alignment
- `stack`: Flex column container with x/y alignment
- `gap`: Spacing between flex/grid items

#### Spacing
- `m`: Margin (d1-d12 scale)
- `p`: Padding (d1-d12 scale)
- `w`: Width
- `h`: Height
- `min`: Min width/height
- `max`: Max width/height

#### Typography
- `text`: Font size, weight, family, alignment
- `color`: Text color
- `line-height`: Line height
- `letter-spacing`: Letter spacing

#### Flex Item Properties
- `item`: Flex grow, shrink, basis
- `order`: Flex order
- `self`: Align self

#### Visual
- `color`: Background color
- `border`: Border color, width, radius, style

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
├── design/     # Design system tokenization
├── maps/       # Property-attribute mappings
├── parser.ts   # Core parsing logic
├── scan.js     # File scanning system
└── utility.ts  # Helper functions
```

## Technical Requirements

- Node.js >=18
- TypeScript ^5.3.0
- Chevrotain ^11.0.3

## License

Copyright (c) 2024 Ken Pickett. All rights reserved.
Proprietary software - unauthorized distribution prohibited at this time.
