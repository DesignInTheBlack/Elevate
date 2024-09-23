// plugins.js

module.exports = [
  // ----------------------------------
  // Flex Utilities Plugin: Adds Custom Flex Classes as per EWDS Guidelines
  // ----------------------------------
  function ({ addUtilities, theme }) {
    const newUtilities = {
      // Flex Container Classes
      '.row': { display: 'flex', flexDirection: 'row' },
      '.col': { display: 'flex', flexDirection: 'column' },

      // Flex Alignment Classes (Row)
      '.row-start': { alignItems: 'flex-start' },
      '.row-end': { alignItems: 'flex-end' },
      '.row-center': { alignItems: 'center' },
      '.row-stretch': { alignItems: 'stretch' },
      '.row-baseline': { alignItems: 'baseline' },

      // Flex Alignment Classes (Column)
      '.col-start': { justifyContent: 'flex-start' },
      '.col-end': { justifyContent: 'flex-end' },
      '.col-center': { justifyContent: 'center' },
      '.col-stretch': { justifyContent: 'stretch' },
      '.col-baseline': { justifyContent: 'baseline' },

      // Flex Distribution Classes (Row)
      '.row-between': { justifyContent: 'space-between' },
      '.row-around': { justifyContent: 'space-around' },
      '.row-evenly': { justifyContent: 'space-evenly' },

      // Flex Distribution Classes (Column)
      '.col-between': { alignItems: 'space-between' },
      '.col-around': { alignItems: 'space-around' },
      '.col-evenly': { alignItems: 'space-evenly' },

      // Flex Alignment with Justify and Align Combinations (Row)
      '.row-endstart': { justifyContent: 'flex-end', alignItems: 'flex-start' },
      '.row-endcenter': { justifyContent: 'flex-end', alignItems: 'center' },
      '.row-startend': { justifyContent: 'flex-start', alignItems: 'flex-end' },
      '.row-centerstart': { justifyContent: 'center', alignItems: 'flex-start' },
      '.row-centerend': { justifyContent: 'center', alignItems: 'flex-end' },

      // Flex Alignment with Justify and Align Combinations (Column)
      '.col-endstart': { alignItems: 'flex-end', justifyContent: 'flex-start' },
      '.col-endcenter': { alignItems: 'flex-end', justifyContent: 'center' },
      '.col-startend': { alignItems: 'flex-start', justifyContent: 'flex-end' },
      '.col-centerstart': { alignItems: 'center', justifyContent: 'flex-start' },
      '.col-centerend': { alignItems: 'center', justifyContent: 'flex-end' },

      // Flex Item Classes
      '.grow': { flexGrow: '1' },
      '.shrink': { flexShrink: '1' },
      '.no-grow': { flexGrow: '0' },
      '.no-shrink': { flexShrink: '0' },

      // Flex Basis Classes
      '.basis-auto': { flexBasis: 'auto' },
      '.basis-0': { flexBasis: '0%' },
      '.basis-25': { flexBasis: '25%' },
      '.basis-33': { flexBasis: '33.333333%' },
      '.basis-50': { flexBasis: '50%' },
      '.basis-66': { flexBasis: '66.666667%' },
      '.basis-75': { flexBasis: '75%' },
      '.basis-100': { flexBasis: '100%' },
    };

    // Adding responsive variants
    addUtilities(newUtilities, ['responsive']);
  },

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
];