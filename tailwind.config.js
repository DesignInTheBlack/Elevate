// tailwind.config.js

const typography = require('./elevate/typography');
const colors = require('./elevate/colors');
const spacing = require('./elevate/spacing');
const breakpoints = require('./elevate/breakpoints');
const utilities = require('./elevate/utilities');
const plugins = require('./elevate/plugins');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ====================================================================================
  // Content Configuration
  // ====================================================================================
  // Specify the files Tailwind should scan for class names
  content: ["./dist/**/*.html"],

  // ====================================================================================
  // Theme Configuration
  // ====================================================================================
  // Customize your design system's global theme
  theme: {
    // ----------------------------------
    // Spacing Scale
    // ----------------------------------
    spacing: spacing.spacing,

    // ----------------------------------
    // Breakpoints
    // ----------------------------------
    screens: breakpoints.screens,

    // ----------------------------------
    // Container Sizes
    // ----------------------------------
    container: breakpoints.container,

    // ----------------------------------
    // Typography
    // ----------------------------------
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    lineWidth: typography.lineWidth,

    // ----------------------------------
    // Extended Theme Settings
    // ----------------------------------
    extend: {
      // Colors
      colors: colors.colors,

      // Typography extensions
      maxWidth: typography.extend.maxWidth,

      // Utility extensions
      ...utilities.extend,
    },
  },

  // ====================================================================================
  // Plugin Configuration
  // ====================================================================================
  // Add custom plugins or configure existing ones
  plugins: [
    ...plugins,
    // Add any additional plugins here
  ],

  // ====================================================================================
  // Core Plugins Configuration
  // ====================================================================================
  // Enable or disable Tailwind's core plugins
  // corePlugins: {
  //   // Disable core plugins if needed
  //   // preflight: false,
  // },

  // ====================================================================================
  // Prefix Configuration
  // ====================================================================================
  // Add a custom prefix to all of Tailwind's generated classes
  // prefix: 'tw-',
};