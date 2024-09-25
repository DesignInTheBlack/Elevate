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
      '.row-start': { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' },
      '.row-end': { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' },
      '.row-center': { display: 'flex', flexDirection: 'row', justifyContent: 'center' },
      '.row-stretch': { display: 'flex', flexDirection: 'row', alignItems: 'stretch' },
      '.row-baseline': { display: 'flex', flexDirection: 'row', alignItems: 'baseline' },

      // Flex Alignment Classes (Column)
      '.col-start': { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
      '.col-end': { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }, 
      '.col-center': { display: 'flex', flexDirection: 'column', alignItems: 'center' },
      '.col-stretch': { display: 'flex', flexDirection: 'column', justifyContent: 'stretch' },
      '.col-baseline': { display: 'flex', flexDirection: 'column', justifyContent: 'baseline' },

      // Flex Distribution Classes (Row)
      '.row-between': { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },   
      '.row-around': { display: 'flex', flexDirection: 'row', justifyContent: 'space-around' },
      '.row-evenly': { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' },

      // Flex Distribution Classes (Column) 
      '.col-between': { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
      '.col-around': { display: 'flex', flexDirection: 'column', justifyContent: 'space-around' },  
      '.col-evenly': { display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' },

      // Flex Alignment with Justify and Align Combinations (Row)
      '.row-startcenter': { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
      '.row-endcenter': { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
      '.row-centercenter': { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, 
      '.row-betweencenter': { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
      '.row-aroundcenter': { display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },

      // Flex Alignment with Justify and Align Combinations (Column)
      '.col-startcenter': { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' },
      '.col-endcenter': { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' },
      '.col-centercenter': { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
      '.col-betweencenter': { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' },  
      '.col-aroundcenter': { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' },

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
      '.space': {
        width: '100%',
        maxWidth: theme('container.screens.xl', '80rem'),
        marginLeft: 'auto',
        marginRight: 'auto',
      },

      // Buffer Utility for Padding
      '.buffer': {
        paddingLeft: theme('spacing.d4', '1rem'),
        paddingRight: theme('spacing.d4', '1rem'),
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