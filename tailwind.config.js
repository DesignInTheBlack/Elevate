/** @type {import('tailwindcss').Config} */

module.exports = {
  // Specify the files Tailwind should scan for class names
  content: ["./*.html"],

  theme: {

    // ====================================================================================
    // Spacing Scale (based on a 4pt system)
    // ====================================================================================
    // This custom spacing scale uses keys like 'a1', 'b1', etc., to represent different
    // spacing values in rem units. This helps maintain consistent spacing throughout the
    // project.

    spacing: {
      // ----------------------------------
      // Group A Spacing (Smallest Sizes)
      // ----------------------------------
      'a1': '0.25rem',  // 4pt
      'a2': '0.5rem',   // 8pt
      'a3': '0.75rem',  // 12pt
      'a4': '1rem',     // 16pt

      // -------------------------
      // Group B Spacing
      // -------------------------
      'b1': '1.25rem',  // 20pt
      'b2': '1.5rem',   // 24pt
      'b3': '1.75rem',  // 28pt
      'b4': '2rem',     // 32pt

      // -------------------------
      // Group C Spacing
      // -------------------------
      'c1': '2.25rem',  // 36pt
      'c2': '2.5rem',   // 40pt
      'c3': '2.75rem',  // 44pt
      'c4': '3rem',     // 48pt
      'c5': '3.5rem',   // 56pt
      'c6': '4rem',     // 64pt

      // -------------------------
      // Group D Spacing
      // -------------------------
      'd1': '4.5rem',   // 72pt
      'd2': '5rem',     // 80pt
      'd3': '5.5rem',   // 88pt
      'd4': '5.75rem',  // 92pt
      'd5': '6rem',     // 96pt
      'd6': '7rem',     // 112pt
      'd7': '7.5rem',   // 120pt
      'd8': '8rem',     // 128pt
      'd9': '9rem',     // 144pt

      // -------------------------
      // Group E Spacing
      // -------------------------
      'e1': '10rem',    // 160pt
      'e2': '12rem',    // 192pt
      'e3': '16rem',    // 256pt

      // -------------------------
      // Group F Spacing
      // -------------------------
      'f1': '20rem',    // 320pt
      'f2': '24rem',    // 384pt
      'f3': '28rem',    // 448pt
      'f4': '32rem',    // 512pt

      // -------------------------
      // Group G Spacing
      // -------------------------
      'g1': '36rem',    // 576pt
      'g2': '40rem',    // 640pt
      'g3': '48rem',    // 768pt
      'g4': '56rem',    // 896pt
      'g5': '60rem',    // 960pt
      'g6': '64rem',    // 1024pt

      // -------------------------
      // Group H Spacing (Largest Sizes)
      // -------------------------
      'h1': '72rem',    // 1152pt
      'h2': '80rem',    // 1280pt
      'h3': '90rem',    // 1440pt
      'h4': '120rem',   // 1920pt
    },



    // ====================================================================================
    // Container Sizes with Custom Breakpoints
    // ====================================================================================
    // Defines custom container widths at different screen sizes for consistent layout.

    container: {
      center: true,
      padding: '1rem', // Default padding for the container

      screens: {
        'xs': '24rem',   // 384px - Extra Small
        'sm': '32rem',   // 512px - Small
        'md': '48rem',   // 768px - Medium
        'lg': '64rem',   // 1024px - Large
        'xl': '80rem',   // 1280px - Extra Large
        '2xl': '88rem',  // 1408px - Ultra Large
        '3xl': '90rem',  // 1440px - Huge
        '4xl': '120rem', // 1920px - Extra Huge
      },
    },



    // ====================================================================================
    // Custom Breakpoints
    // ====================================================================================
    // Defines custom screen sizes for responsive design.



    screens: {
      'xs': '36rem',    // 576px - Mobile Small
      'sm': '48rem',    // 768px - Mobile
      'md': '64rem',    // 1024px - Tablet
      'lg': '80rem',    // 1280px - Desktop
      'xl': '100rem',   // 1600px - Large Desktop
    },



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
    // Extend Default Theme with Custom Settings
    // ====================================================================================
    // Adds additional customizations to Tailwind's default theme.

    extend: {
      // ----------------------------------
      // Custom Colors
      // ----------------------------------
      colors: {
        // Base Color Palette
        color: {
          primary: {
            100: '#...', // Replace with actual color codes
            200: '#...',
            300: '#...',
            400: '#...',
            500: '#...',
          },
          secondary: {
            100: '#...',
            200: '#...',
            300: '#...',
            400: '#...',
            500: '#...',
          },
          // Add more color categories as needed
        },
        // Brand Colors
        brand: {
          accent: {
            light: '#...',
            dark: '#...',
          },
          // Add more brand colors as needed
        },
        // Theme Colors (Light and Dark Modes)
        theme: {
          light: {
            background: '#...',
            text: '#...',
          },
          dark: {
            background: '#...',
            text: '#...',
          },
        },
      },



      // ----------------------------------
      // Custom Z-Index Values
      // ----------------------------------
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },



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
  },



  // ====================================================================================
  // Extend Default Variants
  // ====================================================================================
  // Extends Tailwind's default variants to include additional states.

  variants: {
    extend: {
      // Add any custom variants here
      space: ['responsive'],   // Enable responsive variants for spacing utilities
      content: ['responsive'], // Enable responsive variants for content utilities
    },
  },



  // ====================================================================================
  // Plugins for Additional Functionality
  // ====================================================================================
  // Adds custom plugins to extend Tailwind's functionality.

  plugins: [



    // ----------------------------------
    // Layout Plugin: Adds Custom Components for Layout
    // ----------------------------------
    function ({ addComponents, theme }) {
      const components = {
        // Base Styles for All Space Components
        '.space': {
          display: 'block',
          width: '100%',
        },

        // Content Component for Wrapping Content
        '.content': {
          width: '100%',
          maxWidth: theme('container.screens.xl', '80rem'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.a4', '1rem'),
          paddingRight: theme('spacing.a4', '1rem'),
        },

        // Buffer Utility for Padding
        '.buffer': {
          padding: theme('spacing.a4', '1rem'),
        },
      };

      addComponents(components);
    },



    // ----------------------------------
    // Line Width Plugin: Adds Utilities for Controlling Line Width
    // ----------------------------------
    function ({ addUtilities, theme }) {
      const newUtilities = Object.entries(theme('lineWidth')).map(
        ([key, value]) => ({
          [`.line-width-${key}`]: { maxWidth: value },
        })
      );
      addUtilities(newUtilities);
    },



    // ----------------------------------
    // Baseline Grid Plugin: Adds Utilities for a Baseline Grid Overlay
    // ----------------------------------
    function ({ addUtilities }) {
      const newUtilities = {
        '.baseline-grid': {
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '100% 0.25rem',
        },
      };
      addUtilities(newUtilities);
    },



    // Additional plugins can be added here for other specific features
  
  
  
  ],
};
