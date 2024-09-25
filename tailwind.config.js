// tailwind.config.js

const typography = require('./elevate/typography');
const colors = require('./elevate/colors');
const spacing = require('./elevate/spacing');
const { screens, container } = require('./elevate/breakpoints');
const utilities = require('./elevate/utilities');
const plugins = require('./elevate/plugins');
const colorPlugins = require('./elevate/colorPlugins');

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
    screens: screens,

    // ----------------------------------
    // Container Sizes
    // ----------------------------------
    container: container,

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
  // Safelist Configuration
  // ====================================================================================
  safelist: [
    {
      // Safelist patterns for bg and text classes with lighten/darken
      pattern: /^bg-c-p-\d{3}\\:(lighten|darken)-\d{1,2}$/,
    },
    {
      pattern: /^text-c-p-\d{3}\\:(lighten|darken)-\d{1,2}$/,
    },
    {
      // Safelist patterns for gradient classes
      pattern: /^gradient-c-[a-z]-\d{3}-to-c-[a-z]-\d{3}$/,
    },
    {
      // Safelist patterns for accessible text
      pattern: /^text-accessible$/,
    },
    {
      // Safelist patterns for additional utility classes
      pattern: /^text-complement$/,
    },
    {
      pattern: /^text-triadic-\d$/,
    },
    {
      pattern: /^dark-adapt-bg-c-p-\d{3}$/,
    },
    {
      pattern: /^dark-adapt-text-c-p-\d{3}$/,
    },
    {
      pattern: /^text-accessible-bg-c-p-\d{3}$/,
    },
    // Add more patterns as needed based on your plugins
  ],

  // ====================================================================================
  // Plugin Configuration
  // ====================================================================================
  plugins: [
    ...plugins,
    ...colorPlugins,
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