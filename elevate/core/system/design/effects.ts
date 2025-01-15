export const effects = {

shadows: {
'soft':'rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;',
'physical':'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;'
}
,

gradients: {
'fadetoblack':'linear-gradient(0deg, rgba(0,0,0,0.5032387955182073) 0%, rgba(255,255,255,0) 100%);'
},

textShadows: {
'soft-text':  '0px 1px 2px rgba(0, 0, 0, 0.3);',

},

transitions: {
    'ultra-fast': 'all 0.05s ease-in-out',  // For very quick changes
    'fast': 'all 0.1s ease-in-out',  // Snappy but smooth
    'medium': 'all 0.2s ease-in-out',  // Balanced speed
    'slow': 'all 0.3s ease-in-out',  // Smooth, deliberate
    'ultra-slow': 'all 0.5s ease-in-out',  // For dramatic effects
    'ease': 'all 0.3s ease',  // Natural transition
    'ease-in': 'all 0.3s ease-in',  // Gradual start
    'ease-out': 'all 0.3s ease-out',  // Gradual end
    'linear': 'all 0.3s linear',  // Uniform speed, simple
    'snappy': 'all 0.2s cubic-bezier(0.4, 0, 0.6, 1)',  // Fast and sharp
    'fluid': 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',  // Elastic, fluid effect
    'relaxed': 'all 0.6s ease-in-out',  // Extra smooth and slow
  },

  backgrounds: {

    thinstripes: 'repeating-linear-gradient(45deg, currentColor 0 5px, transparent 5px 10px)',

    thickstripes: 'repeating-linear-gradient(45deg, currentColor 0 15px, transparent 15px 30px)',

    zigzag: 'repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 6px, transparent 6px 8px)',

    cotton: 'radial-gradient(circle, currentColor 2px, transparent 2px) 0 0 / 10px 10px, radial-gradient(circle, currentColor 2px, transparent 2px) 5px 5px / 10px 10px',

    hatching: 'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 10px), repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 10px)',

    honeycomb: 'repeating-linear-gradient(60deg, currentColor 0 2px, transparent 2px 20px), repeating-linear-gradient(120deg, currentColor 0 2px, transparent 2px 20px)',

    microfiber: 'radial-gradient(circle, currentColor 1px, transparent 2px) 2px 2px / 6px 6px',

    bubbles: 'radial-gradient(circle, transparent 4px, currentColor 5px, transparent 6px) 0 0 / 20px 20px, radial-gradient(circle, transparent 4px, currentColor 5px, transparent 6px) 10px 10px / 20px 20px',

    velvet: 'repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 6px)',

    grid: 'repeating-linear-gradient(currentColor 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 20px)',

    tape: 'repeating-linear-gradient(45deg, currentColor 0 25px, transparent 25px 50px)',

    shimmer: 'linear-gradient(to bottom, transparent, currentColor 50%, transparent)',

    halftone: 'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0 / 6px 6px, radial-gradient(circle, transparent 3px, currentColor 3px) 3px 3px / 6px 6px',

    pointgrid: 'radial-gradient(circle, currentColor 1px, transparent 1px) 0 0 / 10px 10px, radial-gradient(circle, currentColor 2px, transparent 2px) 5px 5px / 10px 10px',

    herringbone: 'repeating-linear-gradient(135deg, currentColor 0 10px, transparent 10px 20px), repeating-linear-gradient(225deg, currentColor 0 10px, transparent 10px 20px)',

    speckled: 'repeating-linear-gradient(to right, currentColor 0 4px, transparent 4px 8px), repeating-linear-gradient(to bottom, currentColor 0 4px, transparent 4px 8px)',

    lattice: 'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 15px), repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 15px)',

    plastic: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%), radial-gradient(circle at 50% 8%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)',

    glow: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2), transparent), radial-gradient(circle at 65% 65%, rgba(255,255,255,0.15), transparent), currentColor',

    curtains: 'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 2px), repeating-linear-gradient(44deg, currentColor 0 1px, transparent 1px 2px)',

    changeling: 'repeating-linear-gradient(0deg, currentColor 0 20px, transparent 20px 40px), repeating-linear-gradient(60deg, currentColor 0 20px, transparent 20px 40px), repeating-linear-gradient(120deg, currentColor 0 20px, transparent 20px 40px)',

    headshot: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05), transparent 70%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.05), transparent 80%), linear-gradient(to bottom right, transparent 30%, currentColor 70%)',

    wheat: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05), transparent 70%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.05), transparent 80%), repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 6px), repeating-linear-gradient(44deg, currentColor 0 1px, transparent 1px 6px)',

    carbon: 'radial-gradient(circle at center center, transparent, rgba(0,0,0,0.2)), repeating-linear-gradient(135deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(45deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 5px, transparent 5px, transparent 6px), linear-gradient(90deg, currentColor, currentColor)',

    finish: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 4px), linear-gradient(90deg, currentColor, currentColor)',

    prism: 'linear-gradient(90deg, hsla(194,74%,56%,0.2), hsla(266,74%,56%,0.2), hsla(338,74%,56%,0.2), hsla(50,74%,56%,0.2), hsla(122,74%,56%,0.2))'


  }

}
  