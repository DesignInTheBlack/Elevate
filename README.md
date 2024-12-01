# Elevate CSS

A utility CSS framework implementing the EWDS (Enterprise Web Design System) methodology with type-safe parsing and state management. Currently in active development.

## Overview

Elevate CSS aims to bridge the gap between design systems and utility CSS by providing a strongly-typed, enterprise-focused CSS framework. It combines the flexibility of utility classes with the structure and safety needed for large-scale applications.

## Goals

Based on EWDS methodology, Elevate CSS aims to:

1. **Enforce Design Consistency**
   - Strict token-based system for colors, spacing, and typography
   - Validation against design system constraints
   - Type-safe implementation of design tokens

2. **Improve Developer Experience**
   - Clear error messages with design system context
   - Compile-time validation of utility classes
   - Intelligent state management

3. **Enable Design System Integration**
   - Direct mapping to design tokens
   - Structured property-attribute relationships
   - Enterprise-ready type safety

## Current Status

This is an active work in progress. Currently implemented:
- Basic parser and compiler
- File scanning system
- Token validation
- State management
- Breakpoint handling
- Typography properties

## Features

### 🛡️ Type Safety
- Full TypeScript integration
- Compile-time token validation
- Property and attribute type checking

### 🎯 State Management
```css
// State handling
@hover:[text:red]

// Property with modifier
text:large
```

### 📱 Mobile-First Design
```html
<!-- Breakpoint syntax -->
<div class="/md/text:large">
  Responsive Text
</div>
```

## Architecture

The system consists of several key components:

1. **File Scanner** - Searches project files for class attributes
2. **Parser** - Built with Chevrotain for robust tokenization and parsing
3. **AST Generator** - Converts parsed tokens into a structured AST
4. **CSS Generator** - Outputs compiled CSS to `elevate.css`

### Current Property Support

```typescript
// Currently supported properties
text: {
    "font-size": "FontSizeToken",
    "color": "ColorToken",
    "font-weight": "FontWeightToken"
}
```

## Technical Details

### File Processing
- Scans HTML files for class attributes
- Supports directory traversal (excludes node_modules)
- Processes breakpoints in mobile-first order

### Error Handling
- Detailed error messages
- Stack trace management
- Graceful error recovery during parsing

### Token Types
- ColorToken
- SpacingToken
- FontSizeToken
- FontFamilyToken
- LineHeightToken
- LetterSpacingToken

## Project Structure

```
├── elevate/
│   ├── parser.ts         // Parsing logic
│   ├── utility.ts        // Shared utilities
│   ├── scan.ts          // File scanning
│   └── config/
│       └── propertyAttributeMap.ts  // Property configuration
```

## Planned Features
- Complete EWDS token implementation
- Extended property support
- Build tool integration
- Documentation generation
- VS Code extension

## Contributing

As this project is in active development and implements proprietary methodology, we are not currently accepting external contributions. Please feel free to open issues for bug reports or feature discussions.

## License

Copyright (c) 2024 [Ken Pickett]

All rights reserved. This source code is licensed under a proprietary license. No part of this source code may be reproduced, distributed, or transmitted in any form or by any means, without the prior written permission of the copyright holder.

Unauthorized copying of this software, via any medium, is strictly prohibited.

## Acknowledgments

Built using Chevrotain parser toolkit and implementing EWDS methodology.
