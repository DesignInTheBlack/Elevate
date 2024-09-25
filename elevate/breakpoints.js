// breakpoints.js

module.exports = {
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
    },
  },
};