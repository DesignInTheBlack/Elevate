// typography.js

module.exports = {
  // ====================================================================================
  // Typography Settings with Responsive Fluid Font Sizes
  // ====================================================================================
  // Utilizes CSS clamp() for fluid typography that scales between min and max values.

  fontSize: {
    'fluid-xs': [
      'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // Scales between 12px and 14px
      { lineHeight: '1.5' },
    ],
    'fluid-sm': [
      'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',   // Scales between 14px and 16px
      { lineHeight: '1.5' },
    ],
    'fluid-base': [
      'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',     // Scales between 16px and 18px
      { lineHeight: '1.5' },
    ],
    'fluid-lg': [
      'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',  // Scales between 18px and 20px
      { lineHeight: '1.4' },
    ],
    'fluid-xl': [
      'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',   // Scales between 20px and 24px
      { lineHeight: '1.4' },
    ],
    'fluid-2xl': [
      'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',     // Scales between 24px and 30px
      { lineHeight: '1.3' },
    ],
    'fluid-3xl': [
      'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',// Scales between 30px and 36px
      { lineHeight: '1.3' },
    ],
    'fluid-4xl': [
      'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',     // Scales between 36px and 48px
      { lineHeight: '1.2' },
    ],
    'fluid-5xl': [
      'clamp(3rem, 2.5rem + 2.5vw, 4rem)',         // Scales between 48px and 64px
      { lineHeight: '1.2' },
    ],
  },

  // ====================================================================================
  // Line Height Settings
  // ====================================================================================
  // Defines custom line heights for typography.

  lineHeight: {
    'tight': '1.2',           // For headings
    'snug': '1.3',
    'normal': '1.4',          // Default for body text
    'relaxed': '1.5',
    'loose': '1.6',
    'spacious': '1.7',
    'extra-spacious': '1.8',  // For large blocks of text
  },

  // ====================================================================================
  // Letter Spacing Settings
  // ====================================================================================
  // Adjusts the spacing between letters.

  letterSpacing: {
    'extra-tight': '-0.02rem',
    'tight': '-0.01rem',
    'normal': '0',
    'wide': '0.01rem',
    'wider': '0.02rem',
    'widest': '0.04rem',
  },

  // ====================================================================================
  // Line Width (Measure) Settings for Controlling Text Width
  // ====================================================================================
  // Controls the maximum line length for better readability.

  lineWidth: {
    'extra-narrow': '30ch', // Approx. 30 characters per line
    'narrow': '45ch',       // Recommended for mobile
    'medium': '60ch',       // Ideal for readability
    'wide': '75ch',         // For larger screens
    'extra-wide': '90ch',   // For very wide layouts
  },

  extend: {
    // ----------------------------------
    // Custom Maximum Widths for Line Length Control
    // ----------------------------------
    maxWidth: {
      'prose-xs': '30ch', // For narrow content like sidebars
      'prose-sm': '45ch',
      'prose-md': '60ch', // Default for body text
      'prose-lg': '75ch',
      'prose-xl': '90ch', // For wide content areas
    },
  },
};