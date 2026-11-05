// typography.ts

export const typography = {
    // Core font sizes - simplified to direct values
    size: {
      // Readable small sizes, and headings that scale with the screen
      tiny: '0.75rem',
      eyebrow: '0.8125rem',
      small: '0.875rem',
      base: '1rem',
      h6: '1.125rem',
      h5: '1.375rem',
      h4: 'clamp(1.625rem, 1.4rem + 0.9vw, 2rem)',
      h3: 'clamp(2rem, 1.6rem + 1.6vw, 2.75rem)',
      h2: 'clamp(2.5rem, 1.8rem + 2.8vw, 3.75rem)',
      h1: 'clamp(3rem, 2rem + 4vw, 5rem)',
      display: 'clamp(3.5rem, 2rem + 6vw, 7rem)'
    },
    
    leading: {
      none: '1',
      hug: '1.2',
      snug: '1.3',
      normal: '1.4',
      relaxed: '1.5',
      loose: '1.6',
      spacious: '1.7',
      'extra-spacious': '1.8'
    },
  
    tracking: {
      // In em, so spacing scales with the text it's applied to
      'extra-tight': '-0.04em',
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
      widest: '0.1em'
    },
  
    measure: {
      note: '20ch',
      blob: '35ch',
      brief: '45ch',
      blog: '65ch',
      book: '70ch',
      essay: '75ch',
      full: '80ch'
    },
  
    family: {
      // System font stacks: they look native everywhere and load instantly
      sans: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      serif: "ui-serif, 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif",
      mono: "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
      rounded: "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif"
    },

    weight: {
      thin: '100',
      'extra-light': '200',
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      'extra-bold': '800',
      black: '900'
    }
    
  } 
  
